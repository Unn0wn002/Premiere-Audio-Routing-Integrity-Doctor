const fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto'),assert=require('node:assert/strict');
const dir=__dirname;
const read=f=>JSON.parse(fs.readFileSync(path.join(dir,f),'utf8').replace(/^\uFEFF/,''));
const fixtureSha256=crypto.createHash('sha256').update(fs.readFileSync(path.join(dir,'Positive_Signal_Test.prproj'))).digest('hex');
assert.equal(fixtureSha256,'7bfc2f703ec78c5592f4150986a4635270feb6e197806f11d02d61f478d723ec');
const result={recordedAt:new Date().toISOString(),runtimeIdentity:'03757105692238f9fdc51a17a39aa4a3c6021ca08a6e8c799aa51d43db8d29a4',
 status:'VERIFIED_THIS_SESSION_BOUNDED_DOCKED_SCAN_AND_EXPORTS',hostPid:46824,windowId:2950814,hostResponsiveBeforeDisconnect:true,
 dockedScanMs:42,reviewFindings:0,unknowns:3,exports:read('layout-final-export-validation-20261028.json'),
 dockedRawTextarea:'Expanded readable wrapped JSON and collapsed successfully',widerDocked:'Resize gesture did not establish geometry change',
 transientReviewTag:'A wheel gesture changed one information finding to Intentional after exports. This is an interaction observation, not an assessment. No later export; fresh scan resets.',
 fixtureSha256,helperState:'Session reset, then process inventory found Premiere responsive and no codex-computer-use process',
 limits:['Previous docking crash unresolved; no repeated automated docking drag.','Manual helper-off undock/redock comparison pending.','Wider floating and customer lifecycle qualification remain incomplete.'],distributionApproved:false};
fs.writeFileSync(path.join(dir,'layout-postrestart-validation-20261028.json'),JSON.stringify(result,null,2)+'\n');
const aggregate=read('session-result.json');aggregate.layoutPostRestartValidation=result;
fs.writeFileSync(path.join(dir,'session-result.json'),JSON.stringify(aggregate,null,2)+'\n');
assert.deepStrictEqual(read('session-result.json').layoutPostRestartValidation,read('layout-postrestart-validation-20261028.json'));
console.log('Post-restart checkpoint and aggregate readback verified.');
