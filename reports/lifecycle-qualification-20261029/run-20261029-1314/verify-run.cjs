// Filesystem/content verification only; never drives the host or fabricates cases.
const fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto'),assert=require('node:assert/strict');
const {spawnSync}=require('node:child_process');
const root=path.resolve(__dirname,'../../..'),base=path.dirname(__dirname);
const read=p=>JSON.parse(fs.readFileSync(p,'utf8').replace(/^\uFEFF/,''));
const sha=p=>crypto.createHash('sha256').update(fs.readFileSync(p)).digest('hex');
const ledger=read(path.join(base,'execution-ledger.json'));
for(const [args,expected] of [[['branch','--show-current'],ledger.candidate.branch],[['rev-parse','HEAD'],ledger.candidate.head]]){
  const result=spawnSync('git',args,{cwd:root,encoding:'utf8'});assert.equal(result.status,0);assert.equal(result.stdout.trim(),expected);
}
assert.equal(ledger.candidate.runtimeIdentity,'03757105692238f9fdc51a17a39aa4a3c6021ca08a6e8c799aa51d43db8d29a4');
const receipt=read(path.join(root,ledger.candidate.receipt));
for(const item of receipt.files){
  const normalized=fs.readFileSync(path.join(root,item.file),'utf8').replace(/\r\n/g,'\n');
  assert.equal(crypto.createHash('sha256').update(normalized).digest('hex'),item.sha256);
  assert.equal(sha(path.join(root,'artifacts/audio-preflight-0.2.1-037571056922',item.file)),item.sha256);
}
const fixture=path.join(root,'reports/panel-layout-20261027/Positive_Signal_Test.prproj');
assert.equal(sha(fixture),sha(path.join(__dirname,'baseline/Positive_Signal_Test.prproj')));
assert.equal(sha(fixture),'7bfc2f703ec78c5592f4150986a4635270feb6e197806f11d02d61f478d723ec');
const initial=read(path.join(root,'reports/panel-layout-20261029/inherited-inventory.json'));
for(const file of ['tests/beta.test.js','tests/recovery.test.js'])assert.equal(sha(path.join(root,file)),initial.find(x=>x.file===file).sha256);
const allowed=['NOT_RUN','IN_PROGRESS','PASS_BOUNDED_NATIVE','BLOCKED','NOT_EXERCISED','FAIL_REPRODUCED'];
for(const c of ledger.cases){
  assert.ok(allowed.includes(c.status));
  if(c.status==='PASS_BOUNDED_NATIVE')assert.ok(c.actual&&c.evidence.length);
}
const annotation=path.join(__dirname,'annotated-report.json'),htmlFile=path.join(__dirname,'annotated-report.html'),reset=path.join(__dirname,'reset-report.json');
let annotationChecks=null;
if(fs.existsSync(annotation)&&fs.existsSync(htmlFile)){
  const report=read(annotation),html=fs.readFileSync(htmlFile,'utf8');
  const baseline=read(path.join(__dirname,'baseline/retained-31ms-report.json'));
  const expectedAnnotations=Object.fromEntries(require(path.join(root,'src/report')).findings(baseline).map(f=>[f.key,'reviewed']));
  assert.deepEqual(report.annotations,expectedAnnotations);
  assert.deepEqual(report.diagnostics,require(path.join(root,'src/diagnostics')).diagnose(report.observation));
  assert.equal(html,require(path.join(root,'src/report')).toHTML(report));
  for(const f of read(path.join(__dirname,'annotated-export-files.json'))){assert.equal(sha(path.join(root,f.original)),f.sha256);assert.equal(sha(path.join(__dirname,f.copy)),f.sha256);}
  const normalize=x=>{x=structuredClone(x);delete x.observation.generatedAt;delete x.observation.durationMs;delete x.annotations;return x;};
  assert.deepEqual(normalize(report),normalize(baseline));
  annotationChecks={annotationEqualsExpected:true,observedReviewValue:'reviewed',annotatedFindingCount:Object.keys(report.annotations).length,rendererEquals:true,diagnosticsReproduce:true,otherReportFieldsUnchanged:true,resetVerified:false};
  if(fs.existsSync(reset)){
    const r=read(reset);assert.deepEqual(r.annotations,{});assert.deepEqual(normalize(r),normalize(report));
    annotationChecks.resetVerified=true;
  }
}
if(ledger.cases.find(c=>c.id==='LQ-D02').status==='PASS_BOUNDED_NATIVE')assert.ok(annotationChecks?.resetVerified,'Cannot pass D02 without annotated pair and reset JSON');
let repeatabilityChecks=null;
if(fs.existsSync(reset)){
  const files=['reports/panel-layout-20261029/narrow-scan.json','reports/panel-layout-20261029/wide-scan.json',path.relative(root,reset)];
  const reports=files.map(f=>read(path.join(root,f)));
  const normalize=x=>{x=structuredClone(x);delete x.observation.generatedAt;delete x.observation.durationMs;return x;};
  for(const report of reports){
    assert.deepEqual(normalize(report),normalize(reports[0]));
    assert.deepEqual(report.annotations,{});
    assert.equal(report.diagnostics.coverage.state,'COMPLETE');
    assert.equal(report.diagnostics.coverage.failedReads,0);
  }
  repeatabilityChecks={reports:files,durationsMs:reports.map(r=>r.observation.durationMs),fullReportEquality:true,excludedFields:['observation.generatedAt','observation.durationMs'],additionalDetectionCases:0,performanceBenchmark:false};
  fs.writeFileSync(path.join(__dirname,'repeatability-verification.json'),JSON.stringify(repeatabilityChecks,null,2)+'\n');
}
if(ledger.cases.find(c=>c.id==='LQ-D01').status==='PASS_BOUNDED_NATIVE')assert.ok(repeatabilityChecks);
const events=read(path.join(__dirname,'native-events.json'));
if(ledger.cases.find(c=>c.id==='LQ-D03').status==='PASS_BOUNDED_NATIVE'){
  const e=events.find(e=>e.event==='PANEL_ONLY_CLOSE_REOPEN');
  assert.ok(e?.summaryRetained&&e.firstVisibleReviewRetained);
  assert.equal(e.appRestart,false);assert.equal(e.projectClosed,false);
}
if(ledger.cases.find(c=>c.id==='LQ-D04').status==='PASS_BOUNDED_NATIVE'){
  const e=events.find(e=>e.event==='EXPORT_CANCEL_RETRY');
  assert.ok(e?.pickerClosedAfterCancel&&e.savedAfterRetry);
  assert.equal(e.rescanBetweenCancelAndRetry,false);
  const exported=read(path.join(__dirname,'reset-export-file.json'));
  assert.equal(sha(path.join(root,exported.original)),exported.sha256);
  assert.equal(sha(reset),exported.sha256);
}
assert.equal(ledger.newInstalledExecutions,0);assert.equal(ledger.authorization.installationAuthorized,false);
for(const c of ledger.cases)for(const file of c.evidence)assert.ok(fs.existsSync(path.join(base,file)),'Missing case evidence: '+file);
assert.equal(ledger.cases.filter(c=>c.status==='PASS_BOUNDED_NATIVE').length,ledger.counts.passBoundedNative);
assert.equal(ledger.cases.filter(c=>c.status==='NOT_RUN').length,ledger.counts.notRun);
assert.equal(ledger.cases.length,ledger.counts.total);
const docs=['README.md','docs/PROJECT_STATUS.md','docs/LIFECYCLE_QUALIFICATION_PLAN_20261029.md','docs/BETA_RELEASE_CHECKLIST.md','docs/SUBMISSION_OPERATOR_HANDOFF.md','reports/panel-layout-20261029/CONTINUATION.md',path.relative(root,path.join(__dirname,'README.md'))];
for(const file of docs)for(const m of fs.readFileSync(path.join(root,file),'utf8').matchAll(/\]\(([^)]+)\)/g)){
  const target=m[1].split('#')[0];if(!target||/^(https?:|codex:)/.test(target))continue;
  assert.ok(fs.existsSync(path.resolve(path.dirname(path.join(root,file)),target)),'Broken link: '+file+' -> '+target);
}
assert.ok(fs.readFileSync(path.join(root,'../HANDOFF_LOG_2026-10-29.md'),'utf8').includes('### 9.11 Initial developer lifecycle checks complete within bounds'));
const git=spawnSync('git',['diff','--check'],{cwd:root,encoding:'utf8'});assert.equal(git.status,0,git.stdout+git.stderr);
const cases=ledger.cases.filter(c=>['LQ-P01','LQ-D01','LQ-D02','LQ-D03','LQ-D04'].includes(c.id)).map(c=>({id:c.id,status:c.status}));
const result={verifiedAt:new Date().toISOString(),status:'PASS_EXECUTION_RECORD_AND_PRESERVATION_READBACK',scopeStatus:ledger.status,cases,annotationChecks,repeatabilityChecks,runtimeSourceAndStageUnchanged:true,inheritedTestsUnchanged:true,savedFixtureUnchanged:true,caseEvidenceExists:true,newNativeScans:ledger.newNativeExecutions,newInstallations:0,gitDiffCheck:true,limits:['Record/content checks do not independently operate UI or convert unexecuted cases into PASS','Saved fixture hash is distinct from all in-memory state'],files:fs.readdirSync(__dirname).filter(f=>f!=='verification.json'&&fs.statSync(path.join(__dirname,f)).isFile()).map(file=>({file,sha256:sha(path.join(__dirname,file))}))};
fs.writeFileSync(path.join(__dirname,'verification.json'),JSON.stringify(result,null,2)+'\n');
console.log(JSON.stringify({status:result.status,scopeStatus:result.scopeStatus,cases,savedFixtureUnchanged:true,runtimeUnchanged:true,annotationChecks},null,2));
