// Verify actual retained native reports and timing; never executes host APIs.
const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');
const assert = require('node:assert/strict');
const run = __dirname;
const root = path.resolve(run, '../../..');
const {diagnose} = require(path.join(root, 'src/diagnostics'));
const read = p => JSON.parse(fs.readFileSync(p, 'utf8').replace(/^\uFEFF/, ''));
const sha = p => crypto.createHash('sha256').update(fs.readFileSync(p)).digest('hex');
const media = path.join(root, 'reports/lifecycle-qualification-20261029/run-20261031-0828-linear-fixture/media');
const names = [
  ['complete-before-cancel', '2026-10-31T03-08-24-777Z'],
  ['cancelled', '2026-10-31T03-20-31-529Z'],
  ['retry-complete', '2026-10-31T03-21-39-589Z']
];
const exportRecords = [];
const reports = {};
for (const [label, stamp] of names) {
  const native = path.join(media, 'audio-preflight-' + stamp + '.json');
  const copy = path.join(run, label + '.json');
  if (!fs.existsSync(copy)) fs.copyFileSync(native, copy, fs.constants.COPYFILE_EXCL);
  assert.equal(sha(native), sha(copy), 'Native report copy mismatch');
  const report = read(copy);
  reports[label] = report;
  assert.deepEqual(diagnose(report.observation), report.diagnostics, 'Native diagnostics not reproducible');
  assert.equal(report.observation.project.name, 'Linear_Audio_20261031.prproj');
  assert.equal(report.observation.project.guid, '8f7c6386-4cd2-4ad8-9089-136ab291b6a6');
  assert.ok(report.observation.project.path.endsWith('working\\Linear_Audio_20261031.prproj'));
  assert.deepEqual(report.annotations, {});
  assert.equal(report.diagnostics.risk.length, 0);
  assert.deepEqual(report.diagnostics.coverage.capabilities, {sourceChannelMapping:'UNKNOWN',outputBusTopology:'UNKNOWN',playbackExportCorrectness:'UNKNOWN'});
  exportRecords.push({label,native:path.relative(root,native).replaceAll('\\','/'),copy:path.basename(copy),bytes:fs.statSync(copy).size,sha256:sha(copy),generatedAt:report.observation.generatedAt,durationMs:report.observation.durationMs,completion:report.observation.completion,diagnosticStatus:report.diagnostics.status});
}
const full = reports['complete-before-cancel'];
const partial = reports.cancelled;
const retry = reports['retry-complete'];
for (const report of [full, retry]) {
  assert.equal(report.observation.completion, 'completed');
  assert.equal(report.observation.scanTraversalComplete, true);
  assert.equal(report.diagnostics.status, 'COMPLETE');
  assert.equal(report.diagnostics.coverage.failedReads, 0);
  assert.equal(report.diagnostics.unknown.length, 3);
  for (const [kind, count] of [['sequences',1],['tracks',3],['clips',1024],['components',4096]]) {
    assert.deepEqual(report.diagnostics.coverage[kind], {status:'COMPLETE',expected:count,observed:count,known:count,unknown:0});
  }
}
assert.equal(full.observation.durationMs,7295);
assert.equal(retry.observation.durationMs,7966);
// Full-document repeatability, excluding precisely these two expected fields.
const stable = report => {
  const {generatedAt,durationMs,...observation} = report.observation;
  return {...report, observation};
};
assert.deepEqual(stable(full),stable(retry));
assert.equal(partial.observation.completion,'cancelled');
assert.equal(partial.observation.scanTraversalComplete,false);
assert.equal(partial.observation.durationMs,6657);
assert.equal(partial.diagnostics.status,'PARTIAL');
const coverage = partial.diagnostics.coverage;
assert.deepEqual(coverage.clips,{status:'PARTIAL',expected:null,observed:869,known:869,unknown:null});
assert.deepEqual(coverage.components,{status:'PARTIAL',expected:null,observed:3476,known:3476,unknown:null});
assert.deepEqual(coverage.tracks,{status:'PARTIAL',expected:3,observed:1,known:0,unknown:3});
assert.equal(coverage.failedReads,4); // Incomplete-inventory diagnostics; not four proven host-call exceptions.
assert.equal(partial.diagnostics.unknown.length,8);
assert.ok(partial.diagnostics.unknown.some(f=>f.ruleId==='ARID-U-CANCELLED'&&/Unvisited state/.test(f.observed)));
const visited=partial.observation.sequences[0].audioTracks[0].clips;
assert.equal(visited.length,869);
assert.deepEqual(visited,full.observation.sequences[0].audioTracks[0].clips.slice(0,869));
assert.deepEqual(partial.observation.sequences[0].settings,full.observation.sequences[0].settings);
const cancelTimes=read(path.join(run,'cancel-trial-timestamps.json'));
const retryTimes=read(path.join(run,'retry-timestamps.json'));
const ms=s=>Date.parse(s);
const cancelStart=ms(partial.observation.generatedAt);
const cancelEnd=cancelStart+partial.observation.durationMs;
assert.ok(ms(cancelTimes.cancelRequestedAt)>cancelStart);
assert.ok(ms(cancelTimes.cancelInputReturnedAt)<cancelEnd);
assert.ok(ms(cancelTimes.resultObservationReturnedAt)>=cancelEnd);
const retryStart=ms(retry.observation.generatedAt);
const retryEnd=retryStart+retry.observation.durationMs;
assert.ok(Math.abs(retryStart-ms(retryTimes.scanInputReturnedAt))<250);
assert.ok(ms(retryTimes.secondScanRequestedAt)>retryStart);
assert.ok(ms(retryTimes.secondScanReturnedAt)<retryEnd);
assert.ok(ms(retryTimes.secondInputObservationReturnedAt)<retryEnd);
assert.ok(retryStart<ms(retryTimes.secondScanRequestedAt));
fs.writeFileSync(path.join(run,'exports.json'),JSON.stringify({verifiedAt:new Date().toISOString(),exports:exportRecords},null,2)+'\n');
const result={verifiedAt:new Date().toISOString(),status:'PASS_BOUNDED_NATIVE_D08_D09_REPORT_AND_TIMING_READBACK',runtime:'03757105692238f9fdc51a17a39aa4a3c6021ca08a6e8c799aa51d43db8d29a4',D08:{status:'PASS_BOUNDED_NATIVE',cancelledDurationMs:6657,visitedClips:869,visitedComponents:3476,visitedClipsDeepEqualCompletePrefix:true,unvisitedUnknownsExplicit:true,incompleteOrUnvisitedTracks:3,clipAndComponentExpectedUnknown:true,partialFailedReadsReported:4,unknownFindings:8,inputTimestamps:cancelTimes,generatedAt:partial.observation.generatedAt,estimatedScanFinishedAt:new Date(cancelEnd).toISOString(),completionTimestampLimit:'Finish estimate is generatedAt plus durationMs; independently observed completion is resultObservationReturnedAt, not an instrumented callback.',retryDurationMs:7966,retryCompleteInventory:[1,3,1024,4096],controlsRecoveredObserved:true},D09:{status:'PASS_BOUNDED_NATIVE',scope:'Native disabled-controls and deliberate second Scan input while the retained recovery scan was active; traversal progressed 101 to 980 without reset and final report retains original recovery generatedAt.',inputTimestamps:retryTimes,secondInputInsideRetainedScanInterval:true,originalRetryGeneratedAtRetained:true,adapterInvocationCount:'NOT_INSTRUMENTED_UNKNOWN'},completeReportsEqualExcept:['observation.generatedAt','observation.durationMs'],fullReportEquality:true,diagnosticsReproducedForAllThree:true,initialDelayedAttempt:'NOT_EXERCISED; preserved separately, not promoted',nativeScanStartsEstablished:4,nativeCompleteReportsRetained:2,nativeCancelledReportsRetained:1,firstScanReportNotRetained:true,limits:['Bounded developer-context fixture evidence, not instrumented single-flight proof or representative customer performance.','The unknown clip/component denominators remain null after cancellation; do not substitute 1024/4096 from a different completed report.','Mapping/output topology/playback-export correctness and earlier crash cause UNKNOWN.','No new HTML pair required for these cases; native JSON reports retained. Customer installation and broader lifecycle remain separate.']};
fs.writeFileSync(path.join(run,'native-result.json'),JSON.stringify(result,null,2)+'\n');
console.log(JSON.stringify({status:result.status,cancelledMs:6657,visitedClips:869,visitedComponents:3476,retryMs:7966,retryInventory:[1,3,1024,4096],fullReportEquality:true,diagnosticsReproduced:true,secondScanInsideActiveInterval:true,adapterInvocationCount:'UNKNOWN'},null,2));
