// Validate the fresh native JSON found in the picker's previous directory.
// Preserve its original bytes and location; never manufacture a native HTML export.
const fs = require('node:fs');
const path = require('node:path');
const assert = require('node:assert/strict');
const crypto = require('node:crypto');
const root = path.resolve(__dirname, '../..');
const relativeOriginal = 'reports/panel-layout-20261027/audio-preflight-2026-10-29T05-21-05-797Z.json';
const original = path.join(root, relativeOriginal);
const bytes = fs.readFileSync(original);
const report = JSON.parse(bytes.toString('utf8'));
const hash = value => crypto.createHash('sha256').update(value).digest('hex');
assert.equal(report.observation.durationMs,35);
assert.equal(report.observation.completion,'completed');
assert.equal(report.observation.scanTraversalComplete,true);
assert.equal(report.observation.sequenceInventoryComplete,true);
assert.equal(report.observation.project.name,'Positive_Signal_Test.prproj');
assert.equal(report.diagnostics.status,'COMPLETE');
assert.equal(report.diagnostics.risk.length,0);
assert.equal(report.diagnostics.unknown.length,3);
assert.equal(report.diagnostics.coverage.failedReads,0);
for(const [scope,count] of Object.entries({sequences:4,tracks:15,clips:7,components:18})) {
  assert.equal(report.diagnostics.coverage[scope].status,'COMPLETE');
  assert.equal(report.diagnostics.coverage[scope].known,count);
  assert.equal(report.diagnostics.coverage[scope].expected,count);
}
assert.deepEqual(report.diagnostics,require('../../src/diagnostics.js').diagnose(report.observation));
const receipt = JSON.parse(fs.readFileSync(path.join(root,'artifacts/audio-preflight-0.2.1-037571056922-receipt.json'),'utf8'));
for(const item of receipt.files) {
  assert.equal(hash(Buffer.from(fs.readFileSync(path.join(root,item.file),'utf8').replace(/\r\n/g,'\n'))),item.sha256);
  assert.equal(hash(fs.readFileSync(path.join(root,'artifacts/audio-preflight-0.2.1-037571056922',item.file))),item.sha256);
}
const fixtureHash=hash(fs.readFileSync(path.join(root,'reports/panel-layout-20261027/Positive_Signal_Test.prproj')));
assert.equal(fixtureHash,'7bfc2f703ec78c5592f4150986a4635270feb6e197806f11d02d61f478d723ec');
const destination=path.join(__dirname,'narrow-scan.json');
if(fs.existsSync(destination)) assert.equal(hash(fs.readFileSync(destination)),hash(bytes));
else fs.writeFileSync(destination,bytes,{flag:'wx'});
assert.equal(hash(fs.readFileSync(original)),hash(fs.readFileSync(destination)));
const result={verifiedAt:new Date().toISOString(),status:'PASS_BOUNDED_NATIVE_NARROW_JSON_CONTENT',runtimeIdentity:receipt.identity,runtimeBinding:'Supported UDT Options path independently read, prototype unloaded, beta loaded, source/stage files match frozen receipt',original:relativeOriginal,copy:'narrow-scan.json',sha256:hash(bytes),bytes:bytes.length,durationMs:35,project:report.observation.project,host:report.observation.host,coverage:report.diagnostics.coverage,reviewFindings:0,capabilityUnknowns:3,diagnosticsReproduce:true,fixtureSha256:fixtureHash,htmlExport:'NOT_RUN',wideTrial:'NOT_RUN',limits:['UIA filename readback matched requested destination but native save used old default directory/name; cause UNKNOWN','Subsequent parent capture returned Codex; desktop input stopped','No complete narrow JSON/HTML pair or wide-size qualification','Exact CSS content viewport dimensions not measured']};
fs.writeFileSync(path.join(__dirname,'native-json-verification.json'),JSON.stringify(result,null,2)+'\n');
const attemptFile=path.join(__dirname,'native-layout-attempt.json');
const attempt=JSON.parse(fs.readFileSync(attemptFile,'utf8'));
attempt.narrow.jsonExport='VERIFIED_FROM_FRESH_ORIGINAL_IN_PREVIOUS_FOLDER';
attempt.narrow.failedReadsVerifiedFromJSON=0;
attempt.narrow.verification='native-json-verification.json';
attempt.exportIncident.originalFound=relativeOriginal;
attempt.exportIncident.originalPreserved=true;
attempt.exportIncident.byteIdenticalCopy='narrow-scan.json';
attempt.exportIncident.requestedFileFoundAfterClick=false;
attempt.exportIncident.explanation='Native JSON was saved with default name in previous folder despite full requested filename echoed by UIA; only later filesystem copying created narrow-scan.json';
fs.writeFileSync(attemptFile,JSON.stringify(attempt,null,2)+'\n');
console.log(JSON.stringify({status:result.status,durationMs:35,sha256:result.sha256,coverage:result.coverage.state,failedReads:0,originalPreserved:true,byteIdenticalCopy:true,html:'NOT_RUN',wide:'NOT_RUN'},null,2));
