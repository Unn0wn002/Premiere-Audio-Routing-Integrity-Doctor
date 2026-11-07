const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict');
const dir=__dirname;
const read=f=>JSON.parse(fs.readFileSync(path.join(dir,f),'utf8').replace(/^\uFEFF/,''));
const result={recordedAt:new Date().toISOString(),evidenceClass:'USER_STATED',
 requestedTest:'Helper-off floating panel resized narrow and wide; check buttons, text and host stability.',
 userReport:'Button Normal, text Normal, not freezing, not crashed',
 outcome:{buttonsReportedNormal:true,textReportedNormal:true,freezeReported:false,crashReported:false},
 runtimeIdentityFromSessionContext:'03757105692238f9fdc51a17a39aa4a3c6021ca08a6e8c799aa51d43db8d29a4',
 basicManualLayoutStatus:'COMPLETE_FOR_REPORTED_TRIAL',
 limits:['Exact dimensions and screenshots not supplied.','No fresh per-size scan result or duration supplied.','Runtime association is continued session context, not fresh independent readback.','Earlier helper-connected automated docking crash remains unexplained.','Customer installation and broader lifecycle qualification remain pending.'],
 computerUseReconnected:false,distributionApproved:false};
fs.writeFileSync(path.join(dir,'manual-resize-validation-20261028.json'),JSON.stringify(result,null,2)+'\n');
const aggregate=read('session-result.json');aggregate.manualHelperOffResizeValidation=result;
fs.writeFileSync(path.join(dir,'session-result.json'),JSON.stringify(aggregate,null,2)+'\n');
assert.deepStrictEqual(read('manual-resize-validation-20261028.json'),read('session-result.json').manualHelperOffResizeValidation);
console.log('Manual resize result and aggregate readback verified.');
