const fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto'),assert=require('node:assert/strict');
const {spawnSync}=require('node:child_process');
const root=path.resolve(__dirname,'../..');
const read=p=>JSON.parse(fs.readFileSync(p,'utf8'));
const sha=p=>crypto.createHash('sha256').update(fs.readFileSync(p)).digest('hex');
const ledger=read(path.join(__dirname,'execution-ledger.json')),inputs=read(path.join(__dirname,'planning-inputs.json'));
const planFile=path.join(root,ledger.plan),plan=fs.readFileSync(planFile,'utf8');
assert.equal(ledger.status,'PLAN_READY_NOT_EXECUTED');assert.equal(ledger.cases.length,18);
assert.equal(ledger.newNativeExecutions,0);assert.equal(ledger.newInstalledExecutions,0);
assert.equal(ledger.authorization.nativeExecutionStarted,false);assert.equal(ledger.authorization.installationAuthorized,false);
const ids=ledger.cases.map(c=>c.id);assert.equal(new Set(ids).size,18);
assert.deepEqual(plan.split(/\r?\n/).filter(l=>/^\| LQ-/.test(l)).map(l=>l.split('|')[1].trim()),ids);
for(const c of ledger.cases){assert.equal(c.status,'NOT_RUN');assert.equal(c.actual,null);assert.equal(c.durationMs,null);assert.deepEqual(c.evidence,[]);assert.ok(c.acceptance&&c.action);for(const dependency of [...c.dependenciesAll,...c.dependenciesAny])assert.ok(ids.includes(dependency));}
const visit=(id,stack=[])=>{assert.ok(!stack.includes(id),'Dependency cycle: '+id);const c=ledger.cases.find(c=>c.id===id);for(const d of [...c.dependenciesAll,...c.dependenciesAny])visit(d,[...stack,id]);};ids.forEach(id=>visit(id));
assert.deepEqual(ledger.cases.find(c=>c.id==='LQ-I03').dependenciesAny,['LQ-I02','LQ-I04']);
assert.ok(ledger.cases.find(c=>c.id==='LQ-I05').dependenciesAll.includes('LQ-I03'));
assert.ok(Array.isArray(inputs.ccxInventory));assert.equal(inputs.ccxInventory.length,1);assert.equal(inputs.finalRuntimeCCXFound,false);
for(const item of inputs.sourceFiles){const source=fs.readFileSync(path.join(root,item.file),'utf8').replace(/\r\n/g,'\n');assert.equal(crypto.createHash('sha256').update(source).digest('hex'),item.sha256);}
for(const fixture of inputs.fixtures)if(fixture.present)assert.equal(sha(path.join(root,fixture.file)),fixture.sha256);
const docs=['README.md','docs/LIFECYCLE_QUALIFICATION_PLAN_20261029.md','docs/PROJECT_STATUS.md','docs/BETA_RELEASE_CHECKLIST.md','docs/SUBMISSION_OPERATOR_HANDOFF.md','docs/BETA_GUIDE.md','docs/DEMO_CHECKLIST.md','docs/HOST_TEST_RUNBOOK.md','reports/panel-layout-20261029/CONTINUATION.md'];
for(const file of docs){const absolute=path.join(root,file),text=fs.readFileSync(absolute,'utf8');for(const m of text.matchAll(/\]\(([^)]+)\)/g)){const target=m[1].split('#')[0];if(!target||/^(https?:|codex:)/.test(target))continue;assert.ok(fs.existsSync(path.resolve(path.dirname(absolute),target)),'Missing link '+file+' -> '+target);}}
const handoff=path.join(root,'../HANDOFF_LOG_2026-10-29.md');assert.ok(fs.readFileSync(handoff,'utf8').includes('### 9.9 Lifecycle qualification planning'));
const whitespace=spawnSync('git',['diff','--check'],{cwd:root,encoding:'utf8'});assert.equal(whitespace.status,0,whitespace.stdout+whitespace.stderr);
const result={verifiedAt:new Date().toISOString(),status:'PASS_PLAN_AND_LOCAL_INPUT_READBACK_NOT_NATIVE_QUALIFICATION',caseCount:18,allCasesNotRun:true,actualResultsAndDurationsNull:true,evidenceArraysEmpty:true,dependenciesAcyclic:true,freshInstallAndUpgradeSeparate:true,sourceAndFixtureHashesMatch:true,finalCCXAvailability:'NOT_FOUND_UNDER_CURRENT_ARTIFACTS',localLinksExist:true,sharedHandoffSection99Present:true,gitDiffCheck:true,newHostInputs:0,newNativeExecutions:0,newInstallations:0,distributionApproved:false,files:fs.readdirSync(__dirname).filter(f=>f!=='plan-verification.json'&&fs.statSync(path.join(__dirname,f)).isFile()).map(file=>({file,sha256:sha(path.join(__dirname,file))})),plan:{file:ledger.plan,sha256:sha(planFile)},routingDocs:docs.filter(f=>f!==ledger.plan).map(file=>({file,sha256:sha(path.join(root,file))})),sharedHandoffSha256:sha(handoff)};
fs.writeFileSync(path.join(__dirname,'plan-verification.json'),JSON.stringify(result,null,2)+'\n');console.log(JSON.stringify({status:result.status,cases:18,newNativeExecutions:0,newInstallations:0,dependenciesAcyclic:true,localLinksExist:true,sourceAndFixtureHashesMatch:true},null,2));
