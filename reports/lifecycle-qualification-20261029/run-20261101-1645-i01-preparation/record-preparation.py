"""Record read-only I01 preparation without manufacturing a clean profile/pass."""
from pathlib import Path
import datetime,hashlib,json,os,re,shutil,subprocess
run=Path(__file__).resolve().parent
root=run.parents[2]
read=lambda p:json.loads(p.read_text(encoding='utf-8-sig'))
sha=lambda p:hashlib.sha256(p.read_bytes()).hexdigest()
write=lambda p,v:p.write_text(json.dumps(v,indent=2)+'\n',encoding='utf-8')
now=datetime.datetime.now(datetime.timezone.utc).isoformat()
baseline=run/'baseline'; baseline.mkdir(exist_ok=True)
assert not (baseline/'ledger-before.json').exists(),'Preparation already recorded; inspect instead of rerunning mutations.'
ledger_path=root/'reports/lifecycle-qualification-20261029/execution-ledger.json'
before=read(ledger_path)
shutil.copy2(ledger_path,baseline/'ledger-before.json')
(baseline/'git-status.txt').write_text(subprocess.check_output(['git','status','--short'],cwd=root,text=True))
project_log_hash=sha(root/'PROJECT_LOG.md')
assert subprocess.check_output(['git','branch','--show-current'],cwd=root,text=True).strip()=='codex/validated-beta-20261017'
assert subprocess.check_output(['git','rev-parse','HEAD'],cwd=root,text=True).strip()=='9330e242eadcd10623300ca39d01753355aefc7a'
receipt=read(root/'artifacts/audio-preflight-0.2.1-037571056922-receipt.json')
for item in receipt['files']:
    for base in [root,root/'artifacts/audio-preflight-0.2.1-037571056922']:
        assert hashlib.sha256((base/item['file']).read_bytes().replace(b'\r\n',b'\n')).hexdigest()==item['sha256']
checks=read(run/'archive-verification.json')
assert checks['runtimeMatchesStaging'] and not checks['installationQualified']
assert checks['packageSha256']=='ecb01b1a03e113f89ed355769ee737378feb240f2961187f795ae03e55580d06'
for name,expected in read(root/'reports/lifecycle-qualification-20261029/run-20261031-0828-linear-fixture/preparation-readback.json')['protectedFixtureHashes'].items(): assert sha(root/name)==expected
inv=[i for i in read(root/'reports/panel-layout-20261029/inherited-inventory.json') if not i['file'].startswith('reports/panel-layout-20261029/')]
for i in inv: assert (root/i['file']).exists()
for name in ['tests/beta.test.js','tests/recovery.test.js']: assert sha(root/name)==next(i['sha256'] for i in inv if i['file']==name)
status='AWAITING_CLEAN_CONTEXT_DESIGNATION'
next_action='Await owner designation of a different Windows profile or PC, or confirmation that none is available; then inspect only that context read-only for I01 provenance. No install/restart/profile creation/system change is authorized by this preparation.'
record={'updatedAt':now,'status':status,'run':run.relative_to(root).as_posix(),'case':'LQ-I01','caseStatus':'NOT_RUN','contextDesignated':False,'cleanContextEstablished':False,'ownerQuestion':'Another Windows user on this PC / another PC / none available yet; include name if available','newScans':0,'desktopCalls':0,'installationStarted':False,'nextAction':next_action}
write(run/'preparation-result.json',record)
ledger=read(ledger_path); ledger['cleanContextPreparation']=record; ledger['updatedAt']=now
ledger['nextExecutionSequence']=['LQ-I01 after owner designates accessible candidate clean context']
ledger['nextExecutionPrerequisites']=[next_action]
write(ledger_path,ledger)
docs=['README.md','docs/PROJECT_STATUS.md','docs/SUBMISSION_OPERATOR_HANDOFF.md','docs/LIFECYCLE_QUALIFICATION_PLAN_20261029.md']
for name in docs:
    p=root/name; shutil.copy2(p,baseline/name.replace('/','__'))
    link=os.path.relpath(run/'README.md',p.parent).replace('\\','/')
    content=p.read_text(encoding='utf-8-sig'); split=content.find('\n')+1
    block=f'<!-- CLEAN_CONTEXT_CURRENT -->\n**1 November continuation — {status}:** I01 baseline form/preparation is ready; no clean profile/host has been designated. Final CCX and seven source/stage hashes rechecked unchanged. No native input, scan, installation or system change. Counts remain 11 bounded developer passes + 1 archive pass / 6 installed cases NOT_RUN. [Current preparation]({link}); shared handoff 9.22. {next_action}\n<!-- /CLEAN_CONTEXT_CURRENT -->\n\n'
    p.write_text(content[:split]+'\n'+block+content[split:].lstrip('\n'),encoding='utf-8')
handoff=root.parent/'HANDOFF_LOG_2026-10-29.md'
shutil.copy2(handoff,baseline/'handoff-before.md')
old=handoff.read_text(encoding='utf-8-sig'); split=old.find('\n')+1
heading=f'<!-- CLEAN_CONTEXT_CURRENT -->\n**Latest Premiere continuation — 1 November 2026: section 9.22.** I01 preparation ready; {status}. Owner asked to name another Windows profile/PC or state none is available. Package/runtime reverified; no native input, scan or installation. All previous passes retained; I01–I06 NOT_RUN. {next_action}\n<!-- /CLEAN_CONTEXT_CURRENT -->\n\n'
new=old[:split]+'\n'+heading+old[split:].lstrip('\n')
new+='''\n\n### 9.22 Clean-context I01 preparation awaiting environment designation — 1 November 2026

**Created:** Premiere-Audio-Routing-Integrity-Doctor/reports/lifecycle-qualification-20261029/run-20261101-1645-i01-preparation/README.md, clean-context-baseline.json (unresolved fields remain null/UNVERIFIED), fresh archive-verification.json, preparation-result.json, baseline ledger/Git/docs/shared-log snapshots, record-preparation.py and verification.json. User asked to continue the recommended clean-environment stage; owner selection question is pending. No clean context is invented, created or marked passed. Another Windows user alone does not establish absence of machine-wide plugin history.

**Actual checks:** branch codex/validated-beta-20261017 / HEAD 9330e242eadcd10623300ca39d01753355aefc7a unchanged. Dirty/untracked history preserved; newly inherited PROJECT_LOG.md found/read and left byte-identical. Seven normalized source/stage hashes and final CCX rechecked. Existing verify-package.ps1 with documented manifest-format allowance passed: six exact runtime files, all manifest values equal; CCX SHA256 ecb01b1a03e113f89ed355769ee737378feb240f2961187f795ae03e55580d06. Archive check is newly verified filesystem evidence, not a new native/installed pass. Protected fixture/test/inherited-path preservation, doc links, ledger case equality and Git whitespace are checked in verification.json. No runtime fix or controlled-suite rerun was needed. Prior native observations retain their dates and bounds.

**Edited:** live ledger adds cleanContextPreparation/current prerequisite without altering case results or counts; README/status/operator/plan current pointers and this exact shared log. Old package/lifecycle/layout records and other-project entries preserved. No desktop calls, scans, save/close/restart, login/profile creation, package generation, install/uninstall/upgrade/reinstall, settings or outbound actions. Counts remain 11 bounded developer native passes + 1 archive pass / 6 installed cases NOT_RUN.

**Exact continuation:** await owner naming another Windows profile/PC or saying none is available. Once designated/accessibly presented, record actual host/profile pre-install provenance and prior plugin history, normal Adobe access, host/UXP versions, installed-plugin absence and inactive developer registrations. USER_STATED history remains separate from independent native/filesystem observations. If no suitable context exists, explain the available owner-only setup choice; do not alter the current development profile or infer clean installation from it. Installation/restart and other consequential actions remain separately authorized; no permission is requested twice or implied from this read-only preparation. Mapping/output topology/playback-export correctness and earlier crash cause UNKNOWN; distribution NOT APPROVED. No background native work underway.
'''
handoff.write_text(new,encoding='utf-8')
# Final readback checks cover exactly this preparation's edits.
after=read(ledger_path)
assert after['cases']==before['cases'] and after['counts']==before['counts']
assert after['newNativeExecutions']==before['newNativeExecutions'] and after['newInstalledExecutions']==0
assert sha(root/'PROJECT_LOG.md')==project_log_hash
for name in docs+[(run/'README.md').relative_to(root).as_posix()]:
    p=root/name
    for target in re.findall(r'\]\(([^)]+)\)',p.read_text(encoding='utf-8-sig')):
        target=target.split('#')[0]
        if target and not re.match(r'^(https?:|codex:)',target): assert (p.parent/target).exists()
assert old[old.find('\n')+1:].lstrip('\n') in handoff.read_text(encoding='utf-8')
subprocess.run(['git','diff','--check'],cwd=root,check=True,capture_output=True)
write(run/'verification.json',{'verifiedAt':now,'status':'PASS_LOCAL_I01_PREPARATION_ONLY','caseStatus':'NOT_RUN','runtimeSourceStageUnchanged':True,'archiveIntegrityPass':True,'protectedFixturesAndInheritedTestsPreserved':True,'inheritedPathsPresent':len(inv),'projectLogUnchanged':True,'ledgerCasesAndCountsUnchanged':True,'docsLinksExist':True,'sharedHistoryPreserved':True,'gitDiffCheck':True,'newNativeExecutions':0,'installationStarted':False,'cleanContextEstablished':False,'currentMissingInput':'Owner designation of accessible candidate clean context','files':[{'file':p.relative_to(run).as_posix(),'sha256':sha(p)} for p in sorted(run.rglob('*')) if p.is_file() and p.name!='verification.json']})
print(json.dumps(record,indent=2))
