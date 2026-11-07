// Refresh this continuation's local summary/readback without executing host code.
const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');
const assert = require('node:assert/strict');
const {spawnSync} = require('node:child_process');
const root = path.resolve(__dirname, '../..');
const read = p => JSON.parse(fs.readFileSync(p, 'utf8').replace(/^\uFEFF/, ''));
const sha = p => crypto.createHash('sha256').update(fs.readFileSync(p)).digest('hex');
const checkpoint = read(path.join(__dirname, 'checkpoint-verification.json'));
const output = path.join(__dirname, 'session-result.json');
const defaultResult = {
  sessionDate: '2026-10-29', timezone: 'Asia/Jakarta', status: 'AWAITING_OPERATOR_RUNTIME_LOAD',
  userResumedPremiere: true, olderParkedSuperseded: true,
  branch: checkpoint.branch, head: checkpoint.head, sourceStageRuntime: checkpoint.normalizedRuntimeIdentity,
  packageSha256: checkpoint.packageSha256, runtimeSourceChangedThisContinuation: false,
  verificationClasses: {
    staticFilesystem: 'VERIFIED_THIS_SESSION', controlled: 'VERIFIED_THIS_SESSION_CONTROLLED',
    historicalNative: 'HISTORICAL_RECORDED', helperOffManualLayout: 'USER_STATED'
  },
  controlled: {passed:58, failed:0, skipped:0, repeatedAfterEscape:false}, synthetic:{passed:6,total:6}, syntax:'PASS', archive:'PASS',
  historicalFinalExports: {hashesRechecked:true, embeddedJSONEquals:true, rendererEquals:true, diagnosticsReproduce:true, scanOrigin:'HISTORICAL_RECORDED', durationMs:42, newNativeScan:false},
  nativeAccess: {
    existingPremiereLaunchedOnce:true, homeObserved:true, automatedProjectOpening:false,
    manualProjectOpening:'USER_STATED_DONE', escapeInterruptedFirstFollowup:true, userExplicitlyResumed:true,
    freshProjectWorkspaceObserved:true, project:'Positive_Signal_Test', loadedRuntimeIndependentlyIdentified:false,
    udtAccessAttempts:2, udtError:'Computer Use was not approved to use Adobe UXP Developer Tools',
    userReadyBetweenAttempts:true, errorReasonBeyondMessage:'UNKNOWN', alternateAutomationUsed:false,
    operatorManualDeveloperLoad:'REQUESTED_AWAITING_RESPONSE', projectEdits:false, forcedTermination:false
  },
  perSizeNative:{narrow:'NOT_RUN',wide:'NOT_RUN',dimensions:null,screenshots:[],freshExports:[]},
  nextAction:'Await manual UDT registration path/Loaded state or available UDT access; inspect final-candidate panel, record binding provenance, then exact narrow/wide dimensions/screenshots/per-size scans and JSON/HTML.',
  limits:['Earlier automated docking crash cause UNKNOWN','Mapping, output-bus topology and playback/export correctness UNKNOWN','Clean-customer installation and broader lifecycle remain separate unqualified gates'],
  distributionApproved:false,
  initialInventoryClarification:{untrackedAtCapture:494,sessionFilesIncluded:3,inheritedOutsideSessionDirectory:491},
  continuation:'CONTINUATION.md', sharedHandoff:'C:/Users/unn0w/Downloads/02_Projects/HANDOFF_LOG_2026-10-29.md#9'
};
const result = fs.existsSync(output) ? read(output) : defaultResult;
result.updatedAt = new Date().toISOString();
for (const item of checkpoint.sourceFiles) assert.equal(sha(path.join(root,item.file)), item.rawSourceSha256, 'Runtime source changed: '+item.file);
const inventory = read(path.join(__dirname,'inherited-inventory.json')).filter(x=>!x.file.startsWith('reports/panel-layout-20261029/'));
for (const item of inventory) assert.ok(fs.existsSync(path.join(root,item.file)), 'Inherited path missing: '+item.file);
for (const name of ['tests/beta.test.js','tests/recovery.test.js']) {
  const original = inventory.find(x=>x.file===name);
  assert.equal(sha(path.join(root,name)), original.sha256, 'Inherited test changed: '+name);
}
const fixture = path.join(root,'reports/panel-layout-20261027/Positive_Signal_Test.prproj');
result.savedFixtureSha256 = sha(fixture);
result.savedFixtureMatchesCheckpoint = result.savedFixtureSha256 === checkpoint.fixtureSha256;
assert.ok(result.savedFixtureMatchesCheckpoint, 'Saved fixture changed; investigate without restoring');
const docs = ['README.md','docs/PROJECT_STATUS.md','docs/PANEL_LAYOUT_VALIDATION.md','docs/LAYOUT_REFRESH_20261028.md','docs/IMPLEMENTATION_REVIEW_20261028.md','docs/BETA_RELEASE_CHECKLIST.md','docs/SUBMISSION_OPERATOR_HANDOFF.md'];
for (const name of docs) {
  const content = fs.readFileSync(path.join(root,name),'utf8');
  assert.ok(content.includes('037571056922'), 'Current identity pointer missing: '+name);
  for (const m of content.matchAll(/\]\(([^)]+)\)/g)) {
    const target = m[1].split('#')[0];
    if(!target || /^(https?:|codex:)/.test(target)) continue;
    assert.ok(fs.existsSync(path.resolve(path.dirname(path.join(root,name)),target)), 'Broken local link: '+name+' -> '+target);
  }
}
const whitespace = spawnSync('git',['diff','--check'],{cwd:root,encoding:'utf8'});
assert.equal(whitespace.status,0,whitespace.stdout+whitespace.stderr);
fs.writeFileSync(output, JSON.stringify(result,null,2)+'\n');
const aggregateFile = path.join(root,'reports/panel-layout-20261027/session-result.json');
const beforeText = fs.readFileSync(aggregateFile,'utf8');
const before = JSON.parse(beforeText);
const summary = {updatedAt:result.updatedAt, evidenceRecord:'../panel-layout-20261029/session-result.json', continuation:'../panel-layout-20261029/CONTINUATION.md', sourceStageRuntime:result.sourceStageRuntime, status:result.status, historicalNative:'HISTORICAL_RECORDED; 42 ms final docked scan/exports retained, not rerun', manualLayout:'Historical helper-off docking/resizing remains USER_STATED; see perSizeNative for the new measured checks', perSizeNative:result.perSizeNative, distributionApproved:false};
if(!Object.hasOwn(before,'continuation20261029')) {
  const trimmed = beforeText.trimEnd();
  assert.ok(trimmed.endsWith('}'));
  fs.writeFileSync(aggregateFile,trimmed.slice(0,-1).trimEnd()+',\n  "continuation20261029": '+JSON.stringify(summary,null,2).replace(/\n/g,'\n  ')+'\n}\n');
} else {
  before.continuation20261029=summary;
  fs.writeFileSync(aggregateFile,JSON.stringify(before,null,2)+'\n');
}
const after=read(aggregateFile);
const oldHistorical={...JSON.parse(beforeText)}; delete oldHistorical.continuation20261029;
const newHistorical={...after}; delete newHistorical.continuation20261029;
assert.deepEqual(newHistorical,oldHistorical,'Historical aggregate values changed');
const handoff=path.join(root,'../HANDOFF_LOG_2026-10-29.md');
assert.ok(fs.readFileSync(handoff,'utf8').includes('## 9. Premiere resumed'));
const evidenceFiles=fs.readdirSync(__dirname).filter(f=>fs.statSync(path.join(__dirname,f)).isFile()&&f!=='verification-readback.json').map(file=>({file,sha256:sha(path.join(__dirname,file))}));
const verification={verifiedAt:new Date().toISOString(),status:result.status==='BOUNDED_NARROW_WIDE_LAYOUT_AND_EXPORTS_COMPLETE'?'PASS_LOCAL_READBACK_BOUNDED_LAYOUT_SCOPE_COMPLETE':'PASS_LOCAL_READBACK_NATIVE_GAPS_OPEN',runtimeSourcesUnchanged:true,inheritedTestFilesUnchanged:true,inheritedPathsPresent:inventory.length,fixtureUnchanged:true,documentationLinksExist:true,gitDiffCheck:true,historicalAggregateValuesPreserved:true,sharedHandoffSection9Present:true,files:evidenceFiles,editedDocs:docs.map(file=>({file,sha256:sha(path.join(root,file))})),sharedHandoffSha256:sha(handoff),aggregateSha256:sha(aggregateFile),nativeStatus:result.status};
fs.writeFileSync(path.join(__dirname,'verification-readback.json'),JSON.stringify(verification,null,2)+'\n');
console.log(JSON.stringify({status:verification.status,nativeStatus:result.status,inheritedPathsPresent:inventory.length,runtimeUnchanged:true,fixtureUnchanged:true,documentationLinksExist:true,gitDiffCheck:true,historicalAggregatePreserved:true},null,2));
