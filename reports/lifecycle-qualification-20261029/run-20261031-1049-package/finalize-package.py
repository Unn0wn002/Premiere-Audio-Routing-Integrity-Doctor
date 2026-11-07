"""Record authorized local UDT packaging; never drives or installs the host."""
from pathlib import Path
import datetime,hashlib,json,os,re,shutil,subprocess,zipfile

run=Path(__file__).resolve().parent
root=run.parents[2]
read=lambda p:json.loads(p.read_text(encoding='utf-8-sig'))
write=lambda p,d:p.write_text(json.dumps(d,indent=2,ensure_ascii=False)+'\n',encoding='utf-8')
sha=lambda p:hashlib.sha256(p.read_bytes()).hexdigest()
now=datetime.datetime.now(datetime.timezone.utc).isoformat()
runtime='03757105692238f9fdc51a17a39aa4a3c6021ca08a6e8c799aa51d43db8d29a4'
rel=run.relative_to(root).as_posix()
ccx='artifacts/ccx-0.2.1-037571056922/com.unn0wn002.audio-preflight.beta_premierepro.ccx'
package_hash='ecb01b1a03e113f89ed355769ee737378feb240f2961187f795ae03e55580d06'
assert sha(root/ccx)==package_hash
receipt=read(root/'artifacts/audio-preflight-0.2.1-037571056922-receipt.json')
assert receipt['identity']==runtime
assert hashlib.sha256(json.dumps(receipt['files'],separators=(',',':')).encode()).hexdigest()==runtime
stage=root/'artifacts/audio-preflight-0.2.1-037571056922'
runtime_checks=[]
for item in receipt['files']:
    for base in [root,stage]:
        assert hashlib.sha256((base/item['file']).read_bytes().replace(b'\r\n',b'\n')).hexdigest()==item['sha256']
    runtime_checks.append({'file':item['file'],'sourceNormalizedMatches':True,'stageExactMatches':sha(stage/item['file'])==item['sha256']})
assert sorted(p.relative_to(stage).as_posix() for p in stage.rglob('*') if p.is_file())==sorted(i['file'] for i in receipt['files'])
archive=read(run/'archive-verification.json')
assert archive['packageSha256']==package_hash and archive['runtimeMatchesStaging'] and not archive['installationQualified']
with zipfile.ZipFile(root/ccx) as z:
    assert z.testzip() is None
    names=z.namelist()
    assert len(names)==len(set(names))
    assert sorted(n for n in names if not n.endswith('/'))==sorted(i['file'] for i in receipt['files'])
    assert all(n in [i['file'] for i in receipt['files']]+['src/'] for n in names)
    details=[]
    for item in receipt['files']:
        b=z.read(item['file']); exact=hashlib.sha256(b).hexdigest()==item['sha256']
        if item['file']=='manifest.json':
            assert json.loads(b)==read(stage/'manifest.json')
            assert not exact
        else: assert exact
        details.append({'file':item['file'],'bytes':len(b),'sha256':hashlib.sha256(b).hexdigest(),'exactBytes':exact})
    manifest=json.loads(z.read('manifest.json'))
write(run/'independent-archive-readback.json',{'verifiedAt':now,'status':'PASS_ARCHIVE_INTEGRITY','package':ccx,'sha256':package_hash,'bytes':(root/ccx).stat().st_size,'zipCRC':'PASS','uniqueEntries':True,'allowlistOnly':True,'manifestValuesEqual':True,'manifestFormattingOnly':True,'manifest':manifest,'files':details,'sourceStageChecks':runtime_checks,'installationQualified':False,'nativeValidation':'NOT_ESTABLISHED_BY_PACKAGING'})

next_action='Designate a clean customer test profile/host and record I01 pre-install provenance. Installation/restart/upgrade/uninstall/reinstall require separate explicit authorization; none is started. Preserve completed developer/layout checks. Mapping, output topology, playback/export correctness and earlier crash cause remain UNKNOWN; distribution NOT APPROVED.'
status='FINAL_RUNTIME_CCX_PREPARED_ARCHIVE_VERIFIED'
record={'completedAt':now,'status':status,'case':'LQ-K01','caseStatus':'PASS_ARCHIVE_INTEGRITY','evidenceClass':'VERIFIED_THIS_SESSION_NATIVE_UDT_PACKAGING_AND_STATIC_ARCHIVE','runtime':runtime,'branch':'codex/validated-beta-20261017','head':'9330e242eadcd10623300ca39d01753355aefc7a','package':ccx,'packageSha256':package_hash,'packageBytes':(root/ccx).stat().st_size,'nativeAction':'UDT ellipsis > Package > Select target directory; Successfully packaged plugin observed','registeredStagePathVerified':True,'buildFolderOverride':'blank','sixRuntimeFilesExact':True,'manifestValuesEqual':True,'manifestBytesExact':False,'sourceStageUnchanged':True,'newScans':0,'newInstalledExecutions':0,'installationStarted':False,'installationQualified':False,'distributionApproved':False,'nextAction':next_action,'limits':['Archive integrity and native packaging UI do not qualify installed runtime behavior or clean-customer installation.','Strict byte verification rejected only manifest.json; documented AllowManifestReformat passed after authenticated staged-manifest value comparison.','Previously recorded developer native observations retain their dates and bounds; no repeat scan/test-suite or installation smoke was performed.']}
write(run/'package-result.json',record)
pre=read(run/'preflight.json'); pre.update(status=status,K01='PASS_ARCHIVE_INTEGRITY',completedAt=now,packageGenerationStarted=True,newCCX=ccx,newCCXSha256=package_hash,installationStarted=False)
write(run/'preflight.json',pre)

docs=['README.md','docs/PROJECT_STATUS.md','docs/LIFECYCLE_QUALIFICATION_PLAN_20261029.md','docs/SUBMISSION_OPERATOR_HANDOFF.md','docs/BETA_RELEASE_CHECKLIST.md','reports/panel-layout-20261029/CONTINUATION.md']
for name in docs+['reports/panel-layout-20261029/session-result.json']:
    backup=run/'baseline'/('before-package-'+name.replace('/','__'))
    if not backup.exists(): shutil.copy2(root/name,backup)
handoff=root.parent/'HANDOFF_LOG_2026-10-29.md'
if not (run/'baseline/handoff-before-package.md').exists(): shutil.copy2(handoff,run/'baseline/handoff-before-package.md')
ledger_path=root/'reports/lifecycle-qualification-20261029/execution-ledger.json'
ledger=read(ledger_path)
case=next(c for c in ledger['cases'] if c['id']=='LQ-K01')
case.update(status='PASS_ARCHIVE_INTEGRITY',evidenceClass=record['evidenceClass'],actual=record,evidence=[run.name+'/'+p for p in ['registered-stage-folder.txt','udt-options-blank-override.jpg','package-destination.jpg','udt-package-success.jpg','archive-exact-result.txt','archive-verification.json','independent-archive-readback.json','package-result.json']],limitations=record['limits'],blockingReason=None)
ledger['candidate'].update(finalCCXPath=ccx,finalCCXSha256=package_hash)
ledger['authorization'].update(currentDeliverable='User authorized final-runtime CCX preparation for local review only; completed without installation/publication/deployment.',packageGenerationStarted=True,installationAuthorized=False)
ledger['contextReadiness']['finalRuntimeCCXVerified']=True
ledger.update(status=status,currentRun=run.name,updatedAt=now,revisedAt=now,currentRunCompletedAt=now,packagePreparation=record,nextExecutionSequence=['LQ-I01 designate and document clean test context'],nextExecutionPrerequisites=[next_action],counts={'passBoundedNative':11,'passArchiveIntegrity':1,'notRun':6,'total':18})
ledger['finalObservedHostState']={'evidenceClass':'HISTORICAL_RECORDED_LAST_NATIVE_PREMIERE_STATE','sourceRun':'run-20261031-1029-write-failure','state':ledger['currentNativeHostState'],'thisRunPremiereRechecked':False,'thisRunUDT':'Successfully packaged plugin; beta row Debugging; no reload/unload'}
ledger['actualExecutionSequence'].append('LQ-K01 UDT final-stage Package and independent archive verification')
write(ledger_path,ledger)
session_path=root/'reports/panel-layout-20261029/session-result.json'
session=read(session_path); session['packagePreparation']=record
plan=session['lifecycleQualificationPlan']; plan.update(status=status,currentRun=rel+'/README.md',remainingNotRun=6,boundedPasses=11,archivePasses=1,nextAction=next_action,nextProposedSequence=['LQ-I01 designate and document clean test context'],finalCCXPath=ccx,finalCCXSha256=package_hash)
plan['actualCases']['LQ-K01']='PASS_ARCHIVE_INTEGRITY'
session['nextAction']=next_action
write(session_path,session)

for name in docs:
    p=root/name
    run_link=os.path.relpath(run/'README.md',p.parent).replace('\\','/')
    ccx_link=os.path.relpath(root/ccx,p.parent).replace('\\','/')
    block=f'''<!-- PACKAGE_CURRENT -->
**Current Premiere checkpoint — 31 October 2026: {status}.** K01 **PASS_ARCHIVE_INTEGRITY**: supported UDT Package created the final `037571056922` [CCX]({ccx_link}), SHA256 `{package_hash}` ({record['packageBytes']:,} bytes). Six runtime files match exactly; only manifest JSON formatting changed, with all values independently equal to the authenticated stage. Runtime/source/tests preserved; zero new scans or installation. Totals: **11 bounded developer native passes + 1 archive pass / 6 installed cases NOT_RUN**. [Packaging evidence]({run_link}); shared handoff **9.21**. {next_action}

All earlier dated “current”, “latest” and stopping-point statements below are retained historical checkpoints; this block and the live ledger supersede them. Packaging does not establish installed-runtime behavior.
<!-- /PACKAGE_CURRENT -->

'''
    content=p.read_text(encoding='utf-8-sig')
    assert '<!-- PACKAGE_CURRENT -->' not in content
    split=content.find('\n')+1
    p.write_text(content[:split]+'\n'+block+content[split:].lstrip('\n'),encoding='utf-8')
planfile=root/'docs/LIFECYCLE_QUALIFICATION_PLAN_20261029.md'
t=planfile.read_text(encoding='utf-8')
t=t.replace('Use `PASS_BOUNDED_NATIVE`, `FAIL_REPRODUCED`, `BLOCKED`, `NOT_RUN` or `NOT_EXERCISED`','Use `PASS_ARCHIVE_INTEGRITY` only for K01 archive results; use `PASS_BOUNDED_NATIVE`, `FAIL_REPRODUCED`, `BLOCKED`, `NOT_RUN` or `NOT_EXERCISED` for native cases')
t=t.replace('This plan generates no package.','The original planning task generated no package; authorized K01 execution is now recorded above.')
old='Initial and boundary subsets are complete: P01, D01–D04, D06/D07/D10 PASS_BOUNDED_NATIVE with stated limits; 10 cases NOT_RUN.'
if old in t:
    start=t.index(old); end=t.find('\n',start)
    if end<0:end=len(t)
    t=t[:start]+'Current continuation: P01 and D01–D10 are PASS_BOUNDED_NATIVE; K01 is PASS_ARCHIVE_INTEGRITY; I01–I06 remain NOT_RUN. '+next_action+' See the current packaging evidence and shared handoff section 9.21. Do not repeat completed checks merely to resume.'+t[end:]
planfile.write_text(t,encoding='utf-8')

summary=f'''**Latest authoritative Premiere continuation — 31 October 2026: section 9.21.** Final-runtime CCX prepared through supported UDT Package and independently verified; K01 PASS_ARCHIVE_INTEGRITY. Final runtime `{runtime}`, CCX SHA256 `{package_hash}`. Six runtime files exact; manifest values equal with formatting-only difference. 11 bounded developer native passes + 1 archive pass / 6 installed cases NOT_RUN. No scan, installation, restart, system or outbound action. Earlier Premiere stopping points remain historical. {next_action}'''
ht=handoff.read_text(encoding='utf-8-sig'); split=ht.find('\n')+1
ht=ht[:split]+'\n<!-- PACKAGE_CURRENT -->\n'+summary+'\n<!-- /PACKAGE_CURRENT -->\n\n'+ht[split:].lstrip('\n')
ht+=f'''

### 9.21 Final-runtime CCX prepared for local review — 31 October 2026

**Actual result — {status}:** user authorized K01 local package preparation only. Reconfirmed codex/validated-beta-20261017 / HEAD 9330e242eadcd10623300ca39d01753355aefc7a and inherited dirty/untracked state. UDT Open Folder breadcrumb independently identified exact artifacts/audio-preflight-0.2.1-037571056922; Options showed blank build override. Supported row Package action, isolated empty destination and native **Successfully packaged plugin** observed. No installer was opened. K01 PASS_ARCHIVE_INTEGRITY is separate from the existing eleven bounded developer native passes; I01–I06 all NOT_RUN.

**Created:** `Premiere-Audio-Routing-Integrity-Doctor/{ccx}`, **{record['packageBytes']:,} bytes**, SHA256 **{package_hash}**. Frozen runtime remains **{runtime}**. Existing predecessor CCX and developer ZIP preserved. Current run `{rel}` contains preflight/baseline snapshots, registered-folder UI readback, blank-override/destination/success screenshots, native observation, strict-check rejection record, archive-verification.json, independent-archive-readback.json, package-result.json, README, finalize-package.py and verification/readback records. Native destination field was set through supported indexed set_value and read back before Select Folder; stale accessibility focus was not used for typing. Activation initially reported user input and capture showed another foreground app; no click was sent there. Refresh/activation recovered UDT before action.

**Actual archive checks:** existing scripts/verify-package.ps1 strict check rejected only manifest.json bytes; documented AllowManifestReformat passed against authenticated stage. Independent Python ZIP CRC, unique-entry whitelist/count, six exact runtime hashes, recursive manifest-value equality, plugin ID/version/host/permissions and seven source/stage hashes passed. Manifest formatting difference is explicit, not a new runtime. No new scanner, playback, export, representative performance or installed-host claim follows from packaging. Historical 58/58 controlled / 6/6 synthetic checks were not rerun because runtime/tests are unchanged. Preservation, fixture/media/test/inherited-path, docs-link and Git-whitespace verification is recorded in this run verification.json.

**Documentation reconciliation:** updated live ledger candidate CCX and K01 result, corrected stale root counts (previously 8/10 despite eleven passing individual cases), authorization/current-run/prerequisite and old boundary final-state pointers. Frozen old ledger remains baseline/ledger-before.json; prior case records unchanged. Current README/status/plan/operator/checklist/layout continuation now lead to this package result; dated older blocks remain historical. Added package record/plan summary to layout session-result and refreshed its existing aggregate continuation pointer without changing historical aggregate values. Updated this exact shared log while preserving other-project entries. No source/test fix was required; no unrelated project files changed.

**Limits and exact next continuation:** {next_action} No clean customer context is established by this existing development profile. Do not install, restart, upgrade, uninstall, reinstall, publish, push, merge, deploy or change system settings under package-only authorization. The older 19 October UAC result remains historical; no current UAC blocker was observed. Premiere was not re-inspected this packaging run; its last native state remains the D05 7966 ms retained report, inspector unpaused/no breakpoints, with its original timestamp. UDT packaging remained Debugging and did not reload/unload the runtime. Zero new scans; cumulative lifecycle scan-start count remains ten. No background packaging work remains.
'''
handoff.write_text(ht,encoding='utf-8')

(run/'README.md').write_text(f'''# Final-runtime local CCX preparation — 31 October 2026

Status: **{status}** / K01 **PASS_ARCHIVE_INTEGRITY**.

Supported native UDT Package created the [final-runtime CCX](../../../{ccx}), {record['packageBytes']:,} bytes, SHA256 `{package_hash}`. Frozen runtime `{runtime}`. Branch/HEAD preserved. Native registration folder, blank build override, destination and success were independently observed; screenshots and UI readback are retained here.

Existing [PowerShell archive verification](archive-verification.json) passed with documented manifest-format allowance. [Independent ZIP readback](independent-archive-readback.json) verifies CRC/unique whitelist, six exact runtime files and all manifest values. [Strict check](archive-exact-result.txt) preserves the expected manifest-byte difference. Source/stage seven hashes remain equal to the receipt. No installer opened, no new scan or product/test edit. Existing CCX/ZIP and historical native evidence preserved.

[Package result](package-result.json), [native observation](package-native-observation.json), [preservation/readback](verification.json), [ledger](../execution-ledger.json). Totals: eleven bounded developer native passes, one archive-integrity pass, six installed cases NOT_RUN. Historical/mock/USER_STATED observations retain their classifications. Archive checks do not qualify an installed host or clean-customer install.

Corrected stale ledger root counts and developer pending steps from older checkpoints; individual developer cases preserved. Current-facing docs and shared handoff 9.21 updated, historical entries retained. Git whitespace/local links and protected fixtures/tests/media/inherited paths are verified in verification.json. Unchanged-runtime historical test suites were not repeated.

Next continuation: {next_action}
''',encoding='utf-8')
print(json.dumps({'status':status,'ccx':ccx,'sha256':package_hash,'counts':ledger['counts'],'nextAction':next_action},indent=2))
