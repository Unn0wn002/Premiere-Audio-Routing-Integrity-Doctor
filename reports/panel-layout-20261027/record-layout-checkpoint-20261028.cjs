const fs=require('node:fs'), path=require('node:path'), assert=require('node:assert/strict'), crypto=require('node:crypto');
const dir=__dirname, repo=path.join(dir,'../..');
const read=p=>JSON.parse(fs.readFileSync(p,'utf8').replace(/^\uFEFF/,''));
const sha=p=>crypto.createHash('sha256').update(fs.readFileSync(p)).digest('hex');
const receipt=read(path.join(repo,'artifacts/audio-preflight-0.2.1-037571056922-receipt.json'));
const exactSource=receipt.files.map(f=>{
 const source=fs.readFileSync(path.join(repo,f.file),'utf8').replace(/\r\n/g,'\n');
 assert.equal(crypto.createHash('sha256').update(source).digest('hex'),f.sha256);
 return {file:f.file,normalizedSourceMatchesReceipt:true};
});
const fixture=sha(path.join(dir,'Positive_Signal_Test.prproj'));
assert.equal(fixture,'7bfc2f703ec78c5592f4150986a4635270feb6e197806f11d02d61f478d723ec');
const result={recordedAt:new Date().toISOString(),status:'CONTROLLED_PASS_NATIVE_DOCKING_CRASH_OBSERVED_DISTRIBUTION_HOLD',
 runtimeIdentity:receipt.identity,packageSha256:receipt.packageSha256,exactSource,
 finalCandidateNative:{developerLoadObserved:true,floatingScanMs:39,reviewFindings:0,unknowns:3,
  rawEvidence:'Read-only textarea rendered wrapped long diagnostic strings and scrolled to ending annotations without the earlier overlap.',
  docking:'Premiere exited following panel tab drag toward left docking area; crash reporter returned by window inventory; process inspection found crash reporter PID 8184 and no Premiere process.',
  cause:'UNKNOWN',wideFloating:'NOT_VERIFIED',finalCandidateExport:'NOT_RUN',crashReportSubmitted:false,hostAutomaticallyRestarted:false},
 earlierLayoutCandidate:{identity:'9b0796ebae7aab7a16de87c133c0065426d44238e6c1e494f4e9d5eb5b9b95f0',dockedScanMs:36,floatingScanMs:32,
  exports:read(path.join(dir,'layout-export-validation-20261028.json'))},
 intermediateCSSTrial:{identity:'f2863dbb6a19101373378de509deed43755eb1e252442708b1d91ceb967f008b',scanMs:42,rawOverlap:'STILL_OBSERVED_SUPERSEDED'},
 computerUse:{openingStallWithHelper:true,detachingAllowedRecovery:true,reconnectedAfterSettling:true,postSettleScansWorked:true,
  limit:'One successful reconnection is not a root-cause fix or a broad reliability pass.',
  finalState:'JavaScript session reset; exact-path process inventory returned no computer-use helper processes. Earlier explicit PID/start guard refused termination; no successful guarded-stop claim for that attempt.'},
 checks:{controlled:58,controlledPassed:58,synthetic:6,syntheticPassed:6,syntaxPassed:true,whitespacePassed:true,
  archive:read(path.join(dir,'layout-final-package-verification-20261028.json'))},
 fixtureSha256:fixture,
 remaining:['Isolate docking failure with manual helper-off baseline before attributing cause.','Final candidate docked and wider-floating tests.','Final candidate JSON/HTML exports.','Clean-profile installation and lifecycle qualification.'],
 distributionApproved:false};
fs.writeFileSync(path.join(dir,'layout-refresh-validation-20261028.json'),JSON.stringify(result,null,2)+'\n');
const aggregate=read(path.join(dir,'session-result.json')); aggregate.layoutRefreshValidation=result;
fs.writeFileSync(path.join(dir,'session-result.json'),JSON.stringify(aggregate,null,2)+'\n');
assert.deepStrictEqual(read(path.join(dir,'layout-refresh-validation-20261028.json')),read(path.join(dir,'session-result.json')).layoutRefreshValidation);
console.log(JSON.stringify({status:result.status,runtimeIdentity:result.runtimeIdentity,fixtureSha256:fixture,aggregateReadbackMatches:true},null,2));
