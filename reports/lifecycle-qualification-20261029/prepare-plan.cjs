// Plan preparation only: read local sources/artifacts and write this new ledger.
const fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto'),assert=require('node:assert/strict');
const {spawnSync}=require('node:child_process');
const root=path.resolve(__dirname,'../..');
const read=p=>JSON.parse(fs.readFileSync(p,'utf8').replace(/^\uFEFF/,''));
const sha=b=>crypto.createHash('sha256').update(b).digest('hex');
const planPath=path.join(root,'docs/LIFECYCLE_QUALIFICATION_PLAN_20261029.md');
const plan=fs.readFileSync(planPath,'utf8');
const rows=plan.split(/\r?\n/).filter(l=>/^\| LQ-/.test(l)).map(line=>{
  const cells=line.split('|').map(x=>x.trim());
  return {id:cells[1],action:cells[2],acceptance:cells[3]};
});
assert.equal(rows.length,18);assert.equal(new Set(rows.map(r=>r.id)).size,18);
const dependencyMap={
  'LQ-P01':[], 'LQ-D01':['LQ-P01'],'LQ-D02':['LQ-P01'],'LQ-D03':['LQ-P01','LQ-D02'],
  'LQ-D04':['LQ-P01'],'LQ-D05':['LQ-P01','LQ-D04'],'LQ-D06':['LQ-P01'],
  'LQ-D07':['LQ-P01','LQ-D06'],'LQ-D08':['LQ-P01'],'LQ-D09':['LQ-P01'],
  'LQ-D10':['LQ-P01','LQ-D07'],'LQ-K01':['LQ-P01'],'LQ-I01':['LQ-K01'],
  'LQ-I02':['LQ-K01','LQ-I01'],'LQ-I03':['LQ-K01','LQ-I01'],'LQ-I04':['LQ-K01','LQ-I01'],
  'LQ-I05':['LQ-K01','LQ-I01','LQ-I03'],'LQ-I06':['LQ-I05']
};
const cases=rows.map(row=>({...row,context:row.id.startsWith('LQ-D')?'UDT_FINAL':row.id.startsWith('LQ-I')?'INSTALLED_FINAL':row.id==='LQ-K01'?'ARCHIVE':'PREFLIGHT',dependenciesAll:dependencyMap[row.id],dependenciesAny:row.id==='LQ-I03'||row.id==='LQ-I05'?['LQ-I02','LQ-I04']:[],sharesActiveRunWith:row.id==='LQ-D08'?'LQ-D09':row.id==='LQ-D09'?'LQ-D08':null,status:'NOT_RUN',evidenceClass:null,actual:null,durationMs:null,operatorActions:[],evidence:[],limitations:[],blockingReason:null}));
const git=args=>{const p=spawnSync('git',args,{cwd:root,encoding:'utf8'});assert.equal(p.status,0,p.stderr);return p.stdout.trim();};
const branch=git(['branch','--show-current']),head=git(['rev-parse','HEAD']);
assert.equal(branch,'codex/validated-beta-20261017');assert.equal(head,'9330e242eadcd10623300ca39d01753355aefc7a');
const receipt=read(path.join(root,'artifacts/audio-preflight-0.2.1-037571056922-receipt.json'));
const sourceFiles=receipt.files.map(item=>{
  const source=Buffer.from(fs.readFileSync(path.join(root,item.file),'utf8').replace(/\r\n/g,'\n'));
  const stage=fs.readFileSync(path.join(root,'artifacts/audio-preflight-0.2.1-037571056922',item.file));
  assert.equal(sha(source),item.sha256);assert.equal(sha(stage),item.sha256);
  return {...item,sourceMatches:true,stageMatches:true};
});
assert.equal(sha(JSON.stringify(receipt.files)),receipt.identity);
const zip=path.join(root,'artifacts/audio-preflight-0.2.1-037571056922-developer.zip');
assert.equal(sha(fs.readFileSync(zip)),receipt.packageSha256);
const existing=read(path.join(root,'reports/panel-layout-20261029/session-result.json'));
assert.equal(existing.status,'BOUNDED_NARROW_WIDE_LAYOUT_AND_EXPORTS_COMPLETE');
const fixtureFiles=['Positive_Signal_Test.prproj','Large_Inventory_Test.prproj','Layout_Test_Copy.prproj'].map(name=>{
  const p=path.join(root,'reports/panel-layout-20261027',name);
  return fs.existsSync(p)?{file:path.relative(root,p).replace(/\\/g,'/'),present:true,sha256:sha(fs.readFileSync(p))}:{file:path.relative(root,p).replace(/\\/g,'/'),present:false,sha256:null};
});
assert.equal(fixtureFiles[0].sha256,'7bfc2f703ec78c5592f4150986a4635270feb6e197806f11d02d61f478d723ec');
const inputs={recordedAt:new Date().toISOString(),evidenceClass:'VERIFIED_THIS_SESSION_STATIC_PLANNING_INPUTS',branch,head,runtimeIdentity:receipt.identity,packageSha256:receipt.packageSha256,sourceFiles,fixtures:fixtureFiles,ccxInventory:null,finalRuntimeCCXFound:null,ccxInventoryScope:'Files under this checkout artifacts directory only; absence is not proof about other locations',existingLayoutEvidence:'reports/panel-layout-20261029/session-result.json',historicalLedgers:['reports/submission-closeout-20261019/closeout-ledger.json'],nativeTestsExecutedForPlan:0,hostInputsPerformedForPlan:0};
const ledger={recordType:'proposed-final-candidate-lifecycle-execution-ledger',preparedAt:new Date().toISOString(),status:'PLAN_READY_NOT_EXECUTED',candidate:{branch,head,pluginId:receipt.pluginId,version:receipt.version,runtimeIdentity:receipt.identity,receipt:'artifacts/audio-preflight-0.2.1-037571056922-receipt.json',developerZipSha256:receipt.packageSha256,finalCCXPath:null,finalCCXSha256:null},authorization:{currentDeliverable:'Planning and local evidence preparation only',nativeExecutionStarted:false,packageGenerationStarted:false,installationAuthorized:false,uninstallAuthorized:false,systemSettingsChangesAuthorized:false,outboundActionsAuthorized:false},contextReadiness:{disposableLifecycleCopyPrepared:false,cleanCustomerProfileEstablished:false,operatorUnsavedWorkReadinessConfirmed:false,eligibleLowerVersionPackageVerified:false,finalRuntimeCCXVerified:false},reuse:{layout:'reports/panel-layout-20261029/native-layout-completion.json',narrowPair:'reports/panel-layout-20261029/narrow-pair-verification.json',widePair:'reports/panel-layout-20261029/wide-pair-verification.json',crossLayout:'reports/panel-layout-20261029/cross-layout-verification.json',sameProjectScanReportsAvailable:2,doNotRepeatSizesWithoutReason:true},routes:{freshInstall:['LQ-I01','LQ-I02','LQ-I03','LQ-I05','LQ-I06'],upgrade:['LQ-I01','LQ-I04','LQ-I03'],upgradeNeedsSeparateVerifiedLowerVersionBaseline:true,downgradeDevelopmentProfileToCreateBaseline:false},cases,caseCount:cases.length,newNativeExecutions:0,newInstalledExecutions:0,distributionApproved:false,unknownCapabilities:['sourceChannelMapping','outputBusTopology','playbackExportCorrectness'],nextExecutionSequence:['LQ-P01','LQ-D02','LQ-D03','LQ-D04'],plan:'docs/LIFECYCLE_QUALIFICATION_PLAN_20261029.md',plannedEvidencePattern:'reports/lifecycle-qualification-20261029/<run-id>/<case-id>/'};
for(const [file,value] of [['planning-inputs.json',inputs],['execution-ledger.json',ledger]]){
  const target=path.join(__dirname,file);assert.ok(!fs.existsSync(target),'Preserve the initial plan snapshot: '+file);fs.writeFileSync(target,JSON.stringify(value,null,2)+'\n',{flag:'wx'});
}
console.log(JSON.stringify({status:ledger.status,cases:cases.length,nativeExecutions:0,runtimeMatchesFrozen:true,fixtureUnchanged:true},null,2));
