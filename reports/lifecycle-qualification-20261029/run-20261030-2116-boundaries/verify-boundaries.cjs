// Evidence readback only. This script never drives Premiere or executes a synthetic host.
const fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto'),assert=require('node:assert/strict');
const {spawnSync}=require('node:child_process');
const root=path.resolve(__dirname,'../../..');
const read=p=>JSON.parse(fs.readFileSync(p,'utf8').replace(/^\uFEFF/,''));
const sha=p=>crypto.createHash('sha256').update(fs.readFileSync(p)).digest('hex');
const pre=read(path.join(__dirname,'preflight.json'));
for(const args of [['branch','--show-current'],['rev-parse','HEAD']]){
 const g=spawnSync('git',args,{cwd:root,encoding:'utf8'});assert.equal(g.status,0);assert.equal(g.stdout.trim(),args[0]==='branch'?pre.branch:pre.head);
}
const receipt=read(path.join(root,'artifacts/audio-preflight-0.2.1-037571056922-receipt.json'));
assert.equal(receipt.identity,pre.runtime);
for(const f of receipt.files){
 const text=fs.readFileSync(path.join(root,f.file),'utf8').replace(/\r\n/g,'\n');assert.equal(crypto.createHash('sha256').update(text).digest('hex'),f.sha256);
 assert.equal(sha(path.join(root,'artifacts/audio-preflight-0.2.1-037571056922',f.file)),f.sha256);
}
assert.equal(sha(path.join(root,pre.originalFixture)),pre.fixtureSha256);assert.equal(sha(path.join(__dirname,'baseline/Positive_Signal_Test.prproj')),pre.fixtureSha256);
for(const f of read(path.join(__dirname,'media-path-precheck.json')))assert.equal(sha(f.path),f.sha256);
const inherited=read(path.join(root,'reports/panel-layout-20261029/inherited-inventory.json'));
for(const f of inherited.filter(f=>!f.file.startsWith('reports/panel-layout-20261029/')))assert.ok(fs.existsSync(path.join(root,f.file)));
for(const file of ['tests/beta.test.js','tests/recovery.test.js'])assert.equal(sha(path.join(root,file)),inherited.find(f=>f.file===file).sha256);
for(const f of read(path.join(__dirname,'exports.json'))){assert.equal(sha(path.join(root,f.original)),f.sha256);assert.equal(sha(path.join(__dirname,f.copy)),f.sha256);}
const reports={};
for(const name of ['no-project','empty-project','retained-A-in-B','B-new-scan','A-before-reopen','A-after-reopen']){
 const p=path.join(__dirname,name+'.json');if(!fs.existsSync(p))continue;
 const report=read(p);assert.deepEqual(report.diagnostics,require(path.join(root,'src/diagnostics')).diagnose(report.observation));
 const html=path.join(__dirname,name+'.html');if(fs.existsSync(html))assert.equal(fs.readFileSync(html,'utf8'),require(path.join(root,'src/report')).toHTML(report));
 reports[name]=report;
}
const noProject=reports['no-project'];assert.ok(noProject);assert.equal(noProject.observation.project,null);assert.equal(noProject.observation.completion,'failed');assert.equal(noProject.observation.sequenceCount,null);assert.equal(noProject.diagnostics.status,'UNKNOWN');
for(const k of ['sequences','tracks','clips','components'])assert.equal(noProject.diagnostics.coverage[k].expected,null);
const checks={noProjectUnknown:true,emptyProjectComplete:false,retainedProjectIdentity:false,reopenReportComparison:false};
if(reports['empty-project']){
 const p=reports['empty-project'];assert.ok(p.observation.project);assert.equal(p.observation.sequenceCount,0);assert.deepEqual(p.observation.sequences,[]);assert.equal(p.diagnostics.status,'COMPLETE');
 for(const k of ['sequences','tracks','clips','components'])assert.equal(p.diagnostics.coverage[k].expected,0);
 checks.emptyProjectComplete=true;
}
if(reports['retained-A-in-B']&&reports['B-new-scan']){
 const a=reports['retained-A-in-B'],b=reports['B-new-scan'];assert.notDeepEqual(a.observation.project,b.observation.project);assert.equal(a.observation.sequenceCount,4);assert.equal(b.observation.sequenceCount,0);checks.retainedProjectIdentity=true;
}
if(fs.existsSync(path.join(__dirname,'retained-B-in-A.html'))&&reports['empty-project']&&reports['A-before-reopen']){
 const b=reports['empty-project'],a=reports['A-before-reopen'];
 assert.equal(fs.readFileSync(path.join(__dirname,'retained-B-in-A.html'),'utf8'),require(path.join(root,'src/report')).toHTML(b));
 assert.notDeepEqual(b.observation.project,a.observation.project);assert.equal(b.observation.sequenceCount,0);assert.equal(a.observation.sequenceCount,4);
 assert.equal(a.diagnostics.coverage.failedReads,0);checks.retainedProjectIdentity=true;
 checks.projectSwitchDirection='Empty B captured -> populated A active -> retained B HTML exported -> new A scan';
}
if(reports['A-before-reopen']&&reports['A-after-reopen']){
 const normalize=p=>{p=structuredClone(p);delete p.observation.generatedAt;delete p.observation.durationMs;return p;};
 assert.deepEqual(normalize(reports['A-before-reopen']),normalize(reports['A-after-reopen']));
 const baseline=read(path.join(__dirname,'working-copy-baseline.json'));assert.equal(sha(path.join(root,baseline.workingCopy)),baseline.sha256);checks.reopenReportComparison=true;
 assert.equal(sha(path.join(__dirname,baseline.baseline)),baseline.sha256);
}
const g=spawnSync('git',['diff','--check'],{cwd:root,encoding:'utf8'});assert.equal(g.status,0,g.stdout+g.stderr);
const ledger=read(path.join(root,'reports/lifecycle-qualification-20261029/execution-ledger.json'));
for(const c of ledger.cases)for(const f of c.evidence)assert.ok(fs.existsSync(path.join(root,'reports/lifecycle-qualification-20261029',f)),'Missing evidence: '+f);
assert.equal(ledger.cases.filter(c=>c.status==='PASS_BOUNDED_NATIVE').length,ledger.counts.passBoundedNative);
assert.equal(ledger.cases.filter(c=>c.status==='NOT_RUN').length,ledger.counts.notRun);
if(ledger.cases.find(c=>c.id==='LQ-D06').status==='PASS_BOUNDED_NATIVE')assert.ok(checks.noProjectUnknown&&checks.emptyProjectComplete);
if(ledger.cases.find(c=>c.id==='LQ-D07').status==='PASS_BOUNDED_NATIVE')assert.ok(checks.retainedProjectIdentity);
if(ledger.cases.find(c=>c.id==='LQ-D10').status==='PASS_BOUNDED_NATIVE'){
 assert.ok(checks.reopenReportComparison);assert.ok(fs.existsSync(path.join(__dirname,'A-after-reopen.html')));
 const events=read(path.join(__dirname,'native-events.json'));assert.ok(events.some(e=>e.event==='A_NORMAL_CLOSE_REOPEN'&&e.inspectionIdleDuringLoading&&e.appRestart===false));
 const metadata=read(path.join(__dirname,'final-window-metadata.json'));assert.equal(metadata.retainedScanMs,47);assert.equal(metadata.pickerClosed,true);
}
const artifactInventory=path.join(__dirname,'artifact-inventory.json');
if(fs.existsSync(artifactInventory))for(const f of read(artifactInventory).files)if(f.verifyFrozenBytes)assert.equal(sha(path.join(__dirname,f.file)),f.sha256,'Artifact changed: '+f.file);
const result={verifiedAt:new Date().toISOString(),evidenceClass:'FILESYSTEM_AND_NATIVE_ARTIFACT_READBACK',status:'PASS_AVAILABLE_ARTIFACT_AND_PRESERVATION_CHECKS',checks,runtimeSourceStageUnchanged:true,originalFixtureUnchanged:true,inheritedTestsUnchanged:true,mediaFilesUnchanged:true,gitDiffCheck:true,nativeReportFiles:Object.keys(reports),limitations:['Artifact readback is distinct from UI execution and cannot pass absent native case evidence.','Saved bytes do not prove every in-memory property.'],files:fs.readdirSync(__dirname).filter(f=>f!=='verification.json'&&fs.statSync(path.join(__dirname,f)).isFile()).map(file=>({file,sha256:sha(path.join(__dirname,file))}))};
fs.writeFileSync(path.join(__dirname,'verification.json'),JSON.stringify(result,null,2)+'\n');console.log(JSON.stringify({status:result.status,checks,nativeReportFiles:result.nativeReportFiles},null,2));
