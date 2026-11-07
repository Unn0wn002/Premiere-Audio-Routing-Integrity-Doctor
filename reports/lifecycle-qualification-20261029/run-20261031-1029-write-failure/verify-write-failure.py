"""Local verification of native evidence records; never drives the host."""
from pathlib import Path
import ast,datetime,hashlib,json,re,subprocess
run=Path(__file__).resolve().parent
root=run.parents[2]
read=lambda p:json.loads(p.read_text(encoding='utf-8-sig'))
sha=lambda p:hashlib.sha256(p.read_bytes()).hexdigest()
preflight=read(run/'preflight.json')
result=read(run/'native-result.json')
trace=read(run/'stage-trace.json')
assert result['status']=='PASS_BOUNDED_NATIVE_D05_WRITE_FAILURE_AND_RECOVERY'
assert preflight['caseD05']=='PASS_BOUNDED_NATIVE' and preflight['newScans']==0
receipt=read(root/'artifacts/audio-preflight-0.2.1-037571056922-receipt.json')
for item in receipt['files']:
    for base in [root,root/'artifacts/audio-preflight-0.2.1-037571056922']:
        assert hashlib.sha256((base/item['file']).read_bytes().replace(b'\r\n',b'\n')).hexdigest()==item['sha256']
assert subprocess.check_output(['git','branch','--show-current'],cwd=root,text=True).strip()=='codex/validated-beta-20261017'
assert subprocess.check_output(['git','rev-parse','HEAD'],cwd=root,text=True).strip()=='9330e242eadcd10623300ca39d01753355aefc7a'
assert sha(root/preflight['fixture'])==preflight['fixtureSha256']=='544b63d0e826208df0bbe07f89181f97e4aa495f2110c72ce34d82f758266203'
old=read(root/'reports/lifecycle-qualification-20261029/run-20261031-0828-linear-fixture/preparation-readback.json')
for name,expected in old['protectedFixtureHashes'].items(): assert sha(root/name)==expected,name
inventory=[x for x in read(root/'reports/panel-layout-20261029/inherited-inventory.json') if not x['file'].startswith('reports/panel-layout-20261029/')]
for item in inventory: assert (root/item['file']).exists(),item['file']
for name in ['tests/beta.test.js','tests/recovery.test.js']: assert sha(root/name)==next(x['sha256'] for x in inventory if x['file']==name)
for item in read(root/'reports/lifecycle-qualification-20261029/run-20261030-2116-boundaries/media-path-precheck.json'): assert sha(Path(item['path']))==item['sha256']
for name in ['finalize-write-failure.py','verify-write-failure.py']: ast.parse((run/name).read_text(encoding='utf-8'),filename=name)
baseline=(root/preflight['retainedReport']).read_bytes()
for item in read(run/'exports.json')['exports']:
    p=run/item['file']
    assert p.read_bytes()==baseline
    assert p.stat().st_size==item['bytes']==51217142
    assert sha(p)==item['sha256']==preflight['retainedReportSha256']
assert (run/'locked-write-target.json').stat().st_size==0
assert sha(run/'locked-write-target.json')=='e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855'
assert trace['returnedFileObjectObserved'] and trace['temporaryBreakpointRemoved'] and trace['debuggerUnpaused']
assert trace['pickerReturnedFileObjectObservedAt']<trace['postPickerHandleReadyObservedAt']<trace['resumeRequestedAt']<=trace['resumeObservationReturnedAt']<=trace['postResumePanelObservedAt']
source=(root/'index.js').read_text().splitlines()
assert 'if (!file)' in source[112] and 'await file.write' in source[113]
cleanup=read(run/'cleanup-readback.json')
assert cleanup['exclusiveReadWriteOpenSucceeded'] and cleanup['targetBytes']==0 and cleanup['readOnlyAttribute']==False
assert result['allTemporaryHandlesReleased'] and result['breakpointRemoved'] and result['debuggerUnpaused']
for name in ['native-export-resource-busy-or-locked.jpg','picker-returned-file-before-write.jpg','temporary-breakpoint-removed-before-resume.jpg','debugger-unpaused-no-breakpoints.jpg','attributed-file-write-rejection-controls-recovered.jpg','final-saved-json-recovered.jpg']:
    assert (run/name).is_file()
ledger=read(root/'reports/lifecycle-qualification-20261029/execution-ledger.json')
before=read(run/'baseline/ledger-before.json')
counts={s:sum(c['status']==s for c in ledger['cases']) for s in ['PASS_BOUNDED_NATIVE','NOT_RUN']}
assert counts=={'PASS_BOUNDED_NATIVE':11,'NOT_RUN':7}
assert ledger['newNativeExecutions']==before['newNativeExecutions']
for case in ledger['cases']:
    previous=next(c for c in before['cases'] if c['id']==case['id'])
    if case['id']!='LQ-D05': assert case==previous,case['id']
    else: assert previous['status']=='NOT_RUN' and case['status']=='PASS_BOUNDED_NATIVE'
docs=['README.md','docs/PROJECT_STATUS.md','docs/LIFECYCLE_QUALIFICATION_PLAN_20261029.md','docs/SUBMISSION_OPERATOR_HANDOFF.md','docs/BETA_RELEASE_CHECKLIST.md','reports/panel-layout-20261029/CONTINUATION.md']
for p in [root/name for name in docs]+[run/'README.md']:
    content=p.read_text(encoding='utf-8-sig'); assert preflight['status'] in content
    for target in re.findall(r'\]\(([^)]+)\)',content):
        target=target.split('#')[0]
        if target and not re.match(r'^(https?:|codex:)',target): assert (p.parent/target).exists(),str(p)+': '+target
handoff=root.parent/'HANDOFF_LOG_2026-10-29.md'
assert '### 9.20 Native D05' in handoff.read_text(encoding='utf-8-sig')
subprocess.run(['git','diff','--check'],cwd=root,check=True,capture_output=True)
record={'verifiedAt':datetime.datetime.now(datetime.timezone.utc).isoformat(),'status':'PASS_LOCAL_PRESERVATION_REPORT_RECOVERY_AND_D05_RECORD_READBACK','nativeStatus':preflight['status'],'runtimeSourceStageUnchanged':True,'fixtureAndProtectedOriginalsUnchanged':True,'inheritedPathsPresent':len(inventory),'inheritedTestsUnchanged':True,'priorLinkedMediaUnchanged':True,'ledgerCounts':counts,'onlyD05CaseChanged':True,'zeroNewScans':True,'allRecoveryExportsByteIdentical':True,'postPickerTraceOrderingVerified':True,'nativeEvidenceLimit':'UI/Scope/error/control screenshots were independently observed; this helper checks artifacts and consistency, not visual facts by itself.','allFileHandlesReleased':True,'debuggerUnpausedAndBreakpointRemoved':True,'documentLinksExist':True,'gitDiffCheck':True,'helperSyntax':'PASS','sharedHandoffSha256':sha(handoff),'editedDocs':[{'file':name,'sha256':sha(root/name)} for name in docs],'files':[{'file':p.relative_to(run).as_posix(),'sha256':sha(p)} for p in sorted(run.rglob('*')) if p.is_file() and p.name!='verification.json']}
(run/'verification.json').write_text(json.dumps(record,indent=2)+'\n',encoding='utf-8')
print(json.dumps({k:record[k] for k in ['status','runtimeSourceStageUnchanged','fixtureAndProtectedOriginalsUnchanged','inheritedPathsPresent','ledgerCounts','zeroNewScans','allRecoveryExportsByteIdentical','allFileHandlesReleased','debuggerUnpausedAndBreakpointRemoved','documentLinksExist','gitDiffCheck']},indent=2))
