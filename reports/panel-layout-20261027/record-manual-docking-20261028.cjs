const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict');
const dir=__dirname;
const read=f=>JSON.parse(fs.readFileSync(path.join(dir,f),'utf8').replace(/^\uFEFF/,''));
const result={recordedAt:new Date().toISOString(),evidenceClass:'USER_STATED',
 action:'Manual undock/redock comparison after computer use disconnected',
 userReport:'Normal, no freeze. and dint crashed',
 outcome:{dockedNormally:true,freezeReported:false,crashReported:false},
 runtimeIdentityFromSessionContext:'03757105692238f9fdc51a17a39aa4a3c6021ca08a6e8c799aa51d43db8d29a4',
 identityLimit:'No intervening runtime or session change reported; no fresh independent host identity readback performed.',
 interpretation:'Earlier automated helper-connected crash was not reproduced in this manual helper-off trial. Causation remains UNKNOWN.',
 remaining:['Manual narrow and larger floating resize/layout checks.','Broader native lifecycle and customer installation qualification.'],
 computerUseReconnectedForThisRecord:false,distributionApproved:false};
fs.writeFileSync(path.join(dir,'manual-docking-validation-20261028.json'),JSON.stringify(result,null,2)+'\n');
const aggregate=read('session-result.json');aggregate.manualHelperOffDockingValidation=result;
fs.writeFileSync(path.join(dir,'session-result.json'),JSON.stringify(aggregate,null,2)+'\n');
assert.deepStrictEqual(read('manual-docking-validation-20261028.json'),read('session-result.json').manualHelperOffDockingValidation);
console.log('Manual docking report preserved; aggregate readback matches.');
