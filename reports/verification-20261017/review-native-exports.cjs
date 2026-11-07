// Independent retained-export analysis. This script does not call Premiere or edit runtime.
const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');
const assert = require('node:assert/strict');
const { diagnose } = require('../../src/diagnostics');
const root = path.resolve(__dirname, '../..');
const hash = bytes => crypto.createHash('sha256').update(bytes).digest('hex');
const list = v => Array.isArray(v) ? v : [];
const reviewedBatches=[], batchSources=new Map();
function stable(v) {
  if (Array.isArray(v)) return v.map(stable);
  if (v && typeof v === 'object') return Object.fromEntries(Object.keys(v).filter(k => !['generatedAt','durationMs'].includes(k)).sort().map(k => [k, stable(v[k])]));
  return v;
}
function review(source) {
  const absolute = path.resolve(root, source);
  const bytes = fs.readFileSync(absolute);
  const data = JSON.parse(bytes);
  if (data.recordType === 'arid-native-fixture-repeat-batch') {
    if (batchSources.has(data.batchId)) throw Error('Duplicate native batchId across inputs: '+source+'; first seen at '+batchSources.get(data.batchId));
    batchSources.set(data.batchId,source);
    assert.equal(data.expectedRuntime?.declaredRuntimeIdentity,'7b544bd27f3b12b11b21eb695187af4ed51be661385f2821657e73f23225f408','Unexpected declared batch runtime identity');
    assert.equal(data.expectedRuntime?.implementationGitSha,'64e75e382cfee9626bb743d949f412d290f180e1','Unexpected declared batch implementation');
    assert.ok(Array.isArray(data.runs) && data.runs.length<=3,'Expected zero to three actually retained native reports');
    assert.equal(data.scansRequested,3,'Unexpected requested scan count');
    assert.ok(Number.isInteger(data.scanAttempts) && data.scanAttempts>=data.runs.length && data.scanAttempts<=3,'Invalid actual attempt count');
    assert.ok(['COLLECTING','THREE_REPORTS_COLLECTED','INCOMPLETE_UNEXPECTED_EXCEPTION'].includes(data.executionStatus),'Unknown batch execution status');
    const threeReportCollectionComplete=data.executionStatus==='THREE_REPORTS_COLLECTED' && data.runs.length===3;
    if (data.executionStatus==='THREE_REPORTS_COLLECTED') assert.equal(data.runs.length,3,'Complete collection must retain three real reports');
    if (data.executionStatus==='INCOMPLETE_UNEXPECTED_EXCEPTION') {
      assert.ok(data.runs.length<3 && data.executionError && typeof data.executionError.message==='string','Incomplete batch must retain its actual exception');
      assert.equal(data.scanAttempts,data.runs.length+1,'Failed attempted read is separate from retained reports');
      assert.equal(data.executionError.attemptedRunIndex,data.scanAttempts,'Unexpected exception attempt index');
    }
    assert.equal(new Set(data.runs.map(r=>r.runId)).size,data.runs.length,'Native batch run IDs must be distinct');
    const parentBatch={recordType:data.recordType,helperVersion:data.helperVersion,helperFile:data.helperFile,batchId:data.batchId,
      fixtureIds:data.fixtureIds,stateLabel:data.stateLabel,expectedRuntime:data.expectedRuntime,executionMethod:data.executionMethod,
      batchStartedAt:data.batchStartedAt,batchFinishedAt:data.batchFinishedAt,executionStatus:data.executionStatus,
      scansRequested:data.scansRequested,scanAttempts:data.scanAttempts,actualRetainedReports:data.runs.length,
      executionError:data.executionError||null,threeReportCollectionComplete,
      repeatCollectionQualification:threeReportCollectionComplete?'THREE_REPORT_ENVELOPES_ONLY_REQUIRES_INDEPENDENT_FIXTURE_REVIEW':'UNQUALIFIED_INCOMPLETE_BATCH',
      declarationsAreNotIndependentUiTruth:true,runtimeIdentityLimit:data.runtimeIdentityEvidence};
    reviewedBatches.push({source:path.relative(root,absolute).replace(/\\/g,'/'),bytes:bytes.length,sha256:hash(bytes),fileLastWriteTime:fs.statSync(absolute).mtime.toISOString(),...parentBatch});
    return data.runs.map((run,index)=>{
      assert.equal(run.runIndex,index+1,'Batch run index mismatch');
      assert.ok(Number.isFinite(Date.parse(run.startedAt)) && Date.parse(run.finishedAt)>=Date.parse(run.startedAt),'Invalid run timestamps');
      assert.equal(run.report?.observation?.host?.pluginVersion,data.expectedRuntime.pluginVersion,'Batch plugin identity mismatch');
      assert.equal(run.report?.observation?.host?.name,data.expectedRuntime.hostName,'Batch host name mismatch');
      assert.equal(run.report?.observation?.host?.version,data.expectedRuntime.hostVersion,'Batch host version mismatch');
      return reviewEnvelope(source,absolute,bytes,run.report,{
        rawByteScope:'Whole host-saved native repeat batch; this embedded report was not separately host-exported.',
        reportJsonPointer:'/runs/'+index+'/report',
        parentBatch,
        nativeBatchRun:{runId:run.runId,runIndex:run.runIndex,startedAt:run.startedAt,finishedAt:run.finishedAt}
      });
    });
  }
  return [reviewEnvelope(source,absolute,bytes,data,{rawByteScope:'Whole standalone native panel-exported report.',reportJsonPointer:''})];
}
function reviewEnvelope(source,absolute,bytes,data,provenance) {
  const o = data.observation;
  const issues = [];
  let parameterCount = 0, keyframeCount = 0, animatedParameterCount = 0, keyframeTimeCount = 0;
  const check = (condition, label) => { if (!condition) issues.push(label); };
  const tick = (v, at) => check(v && typeof v.ticks === 'string' && /^-?\d+$/.test(v.ticks) && Number.isFinite(v.seconds), at + ': TickTime shape');
  const inner = v => typeof v === 'string' || typeof v === 'boolean' || Number.isFinite(v) || v && typeof v === 'object' && (['x','y'].every(k => Number.isFinite(v[k])) || ['red','green','blue','alpha'].every(k => Number.isFinite(v[k])));
  for (const [si,s] of list(o.sequences).entries()) {
    const at = 'sequences[' + si + ']';
    const rate = s.settings && s.settings.audioSampleRate;
    check(rate && Number.isFinite(rate.value) && rate.value > 0 && Number.isFinite(rate.ticksPerFrame) && rate.ticksPerFrame > 0, at + ': FrameRate shape');
    for (const [ti,t] of list(s.audioTracks).entries()) for (const [ci,c] of list(t.clips).entries()) {
      const cat = `${at}.audioTracks[${ti}].clips[${ci}]`;
      tick(c.startTime, cat + '.startTime'); tick(c.endTime, cat + '.endTime');
      for (const [chainIndex,chain] of [c.componentChain,c.sourceProjectItem && c.sourceProjectItem.componentChain].entries()) {
        for (const comp of list(chain && chain.components)) for (const p of list(comp.params)) {
          parameterCount++;
          if (p.startValue) {
            keyframeCount++;
            check(p.startValue.value && inner(p.startValue.value.value), `${cat}.chain[${chainIndex}].component[${comp.index}].param[${p.index}]: Keyframe.value.value shape`);
            tick(p.startValue.position, cat + ': Keyframe.position');
          } else issues.push(cat + ': missing Keyframe');
          if (p.isTimeVarying === true) animatedParameterCount++;
          for (const time of list(p.keyframeTimes)) { keyframeTimeCount++; tick(time, cat + ': keyframeTimes'); }
        }
      }
    }
  }
  const replay = diagnose(o);
  let diagnosticReplayAgrees = true;
  try { assert.deepEqual(replay, data.diagnostics); } catch { diagnosticReplayAgrees = false; }
  const recursiveErrors = [];
  function collect(v, at) {
    if (!v || typeof v !== 'object') return;
    if (Array.isArray(v.errors)) v.errors.forEach(e => recursiveErrors.push({at, error:e}));
    for (const [k,child] of Object.entries(v)) if (k !== 'errors') collect(child, at + '.' + k);
  }
  collect(o,'observation');
  return {
    source: path.relative(root,absolute).replace(/\\/g,'/'), bytes:bytes.length, sha256:hash(bytes),
    ...provenance,
    nativeScanGeneratedAt:o.generatedAt, fileLastWriteTime:fs.statSync(absolute).mtime.toISOString(),
    timestampMeaning:'nativeScanGeneratedAt is the plugin scan timestamp; fileLastWriteTime is filesystem save/copy metadata and is not another scan time.',
    generatedAt:o.generatedAt, host:o.host, completion:o.completion, durationMs:o.durationMs,
    status:data.diagnostics.status, coverage:data.diagnostics.coverage,
    stableObservationSha256: hash(JSON.stringify(stable(o))), stableDiagnosticSha256:hash(JSON.stringify(stable(data.diagnostics))),
    diagnosticReplayAgrees, recursiveErrors,
    strictDocumentedShapeChecks:{allObservedShapesValid:!issues.length,parameterCount,keyframeCount,animatedParameterCount,keyframeTimeCount,issues},
    sequences:list(o.sequences).map(s=>({name:s.name,guid:s.guid,occurrenceIndex:s.occurrenceIndex,settings:s.settings,audioTrackCount:s.audioTrackCount,
      tracks:list(s.audioTracks).map(t=>({name:t.name,id:t.id,index:t.index,muted:t.muted,clipCount:t.clipCount,
        clips:list(t.clips).map(c=>({name:c.name,occurrenceIndex:c.occurrenceIndex,disabled:c.disabled,startTime:c.startTime,endTime:c.endTime}))}))})),
    risk:data.diagnostics.risk, information:data.diagnostics.information,
    unknown: list(data.diagnostics.unknown).map(u=>({ruleId:u.ruleId,location:u.location,observed:u.observed}))
  };
}
const files = process.argv.slice(2);
if (!files.length) throw Error('Pass actual exported JSON file paths relative to repository root.');
const reviewedExports=files.flatMap(review);
const batchRunInputs=new Map(), reportInputs=new Map();
for (const item of reviewedExports) {
  const reference=item.source+(item.reportJsonPointer||'');
  if (item.nativeBatchRun) {
    const key=JSON.stringify([item.parentBatch.batchId,item.nativeBatchRun.runId]);
    if (batchRunInputs.has(key)) throw Error('Duplicate physical native batch run across inputs: '+reference+'; first seen at '+batchRunInputs.get(key));
    batchRunInputs.set(key,reference);
  }
  const key=JSON.stringify([item.nativeScanGeneratedAt,item.stableObservationSha256,item.stableDiagnosticSha256]);
  if (reportInputs.has(key)) throw Error('Duplicate physical native report across inputs (scan timestamp + stable observation/diagnostic identity): '+reference+'; first seen at '+reportInputs.get(key));
  reportInputs.set(key,reference);
}
const result = {recordType:'independent-native-export-analysis',reviewedAt:new Date().toISOString(),
  sourceGitSha:'64e75e382cfee9626bb743d949f412d290f180e1',runtimeIdentity:'7b544bd27f3b12b11b21eb695187af4ed51be661385f2821657e73f23225f408',
  interpretation:'Actual retained native export parsing; diagnostic replay is static consistency only. No fixture truth, TP/FP/FN, thenable behavior or unchanged UI state is inferred by this script.',
  duplicateInputPolicy:'Reject repeated batchId/runId or repeated scan timestamp + stable observation/diagnostic identity across inputs; aliases do not count as new executions.',
  batches:reviewedBatches,
  exports:reviewedExports};
process.stdout.write(JSON.stringify(result,null,2)+'\n');
