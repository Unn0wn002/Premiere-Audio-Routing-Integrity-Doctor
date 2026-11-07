"""Verify local preservation and checkpoint consistency, without host execution."""
from pathlib import Path
import ast, datetime, hashlib, json, re, subprocess
run=Path(__file__).resolve().parent
root=run.parents[2]
read=lambda p:json.loads(p.read_text(encoding='utf-8-sig'))
sha=lambda p:hashlib.sha256(p.read_bytes()).hexdigest()
preflight=read(run/'preflight.json')
receipt=read(run/'baseline/runtime-receipt.json')
for item in receipt['files']:
    for base in [root, root/'artifacts/audio-preflight-0.2.1-037571056922']:
        assert hashlib.sha256((base/item['file']).read_bytes().replace(b'\r\n',b'\n')).hexdigest()==item['sha256']
assert subprocess.check_output(['git','branch','--show-current'],cwd=root,text=True).strip()=='codex/validated-beta-20261017'
assert subprocess.check_output(['git','rev-parse','HEAD'],cwd=root,text=True).strip()=='9330e242eadcd10623300ca39d01753355aefc7a'
assert sha(root/preflight['fixture'])==preflight['fixtureSha256']==sha(run/'baseline/fixture-before.prproj')
old=read(root/'reports/lifecycle-qualification-20261029/run-20261031-0828-linear-fixture/preparation-readback.json')
for name,expected in old['protectedFixtureHashes'].items(): assert sha(root/name)==expected,name
inventory=[x for x in read(root/'reports/panel-layout-20261029/inherited-inventory.json') if not x['file'].startswith('reports/panel-layout-20261029/')]
for item in inventory: assert (root/item['file']).exists(),item['file']
for name in ['tests/beta.test.js','tests/recovery.test.js']: assert sha(root/name)==next(x['sha256'] for x in inventory if x['file']==name)
for item in read(root/'reports/lifecycle-qualification-20261029/run-20261030-2116-boundaries/media-path-precheck.json'): assert sha(Path(item['path']))==item['sha256']
for name in ['record-checkpoint.py','verify-checkpoint.py','finalize-inflight.py']: ast.parse((run/name).read_text(encoding='utf-8'),filename=name)
ledger=read(root/'reports/lifecycle-qualification-20261029/execution-ledger.json')
counts={status:sum(x['status']==status for x in ledger['cases']) for status in ['PASS_BOUNDED_NATIVE','NOT_RUN','NOT_EXERCISED']}
complete=preflight['status']=='INFLIGHT_DEVELOPER_CHECKS_COMPLETE_BOUNDED'
assert counts==({'PASS_BOUNDED_NATIVE':10,'NOT_RUN':8,'NOT_EXERCISED':0} if complete else {'PASS_BOUNDED_NATIVE':8,'NOT_RUN':8,'NOT_EXERCISED':2})
assert ledger['status']==preflight['status']
assert preflight['loadedRuntimeBound'] and preflight['exportedReportVerified']==complete
if complete:
    result=read(run/'native-result.json')
    assert result['D08']['status']==result['D09']['status']=='PASS_BOUNDED_NATIVE'
    assert result['D09']['adapterInvocationCount']=='NOT_INSTRUMENTED_UNKNOWN'
    for item in read(run/'exports.json')['exports']:
        assert sha(root/item['native'])==sha(run/item['copy'])==item['sha256']
docs=['README.md','docs/PROJECT_STATUS.md','docs/LIFECYCLE_QUALIFICATION_PLAN_20261029.md','docs/SUBMISSION_OPERATOR_HANDOFF.md','docs/BETA_RELEASE_CHECKLIST.md','reports/panel-layout-20261029/CONTINUATION.md']
for p in [root/name for name in docs]+[run/'README.md']:
    content=p.read_text(encoding='utf-8-sig'); assert preflight['status'] in content
    for target in re.findall(r'\]\(([^)]+)\)',content):
        target=target.split('#')[0]
        if target and not re.match(r'^(https?:|codex:)',target): assert (p.parent/target).exists(),str(p)+': '+target
subprocess.run(['git','diff','--check'],cwd=root,check=True,capture_output=True)
record={'verifiedAt':datetime.datetime.now(datetime.timezone.utc).isoformat(),'status':'PASS_LOCAL_PRESERVATION_AND_CHECKPOINT_READBACK_BOUNDED_D08_D09_COMPLETE' if complete else 'PASS_LOCAL_PRESERVATION_AND_CHECKPOINT_READBACK_NATIVE_GAPS_OPEN','nativeStatus':preflight['status'],'runtimeSourceStageUnchanged':True,'fixtureAndProtectedOriginalsUnchanged':True,'inheritedPathsPresent':len(inventory),'inheritedTestsUnchanged':True,'priorLinkedMediaUnchanged':True,'ledgerCounts':counts,'documentLinksExist':True,'gitDiffCheck':True,'helperSyntax':'PASS','rawExportVerified':complete,'nativePassClaimAdded':complete,'sharedHandoffSha256':sha(root.parent/'HANDOFF_LOG_2026-10-29.md'),'files':[{'file':p.relative_to(run).as_posix(),'sha256':sha(p)} for p in sorted(run.rglob('*')) if p.is_file() and p.name!='verification.json']}
(run/'verification.json').write_text(json.dumps(record,indent=2)+'\n',encoding='utf-8')
print(json.dumps({k:record[k] for k in ['status','nativeStatus','runtimeSourceStageUnchanged','fixtureAndProtectedOriginalsUnchanged','inheritedPathsPresent','ledgerCounts','documentLinksExist','gitDiffCheck','rawExportVerified']},indent=2))
