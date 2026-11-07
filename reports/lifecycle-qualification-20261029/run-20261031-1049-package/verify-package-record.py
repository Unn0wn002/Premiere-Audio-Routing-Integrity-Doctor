"""Independent local preservation/record readback; no native UI or installation."""
from pathlib import Path
import ast,datetime,hashlib,json,re,subprocess,zipfile
run=Path(__file__).resolve().parent
root=run.parents[2]
read=lambda p:json.loads(p.read_text(encoding='utf-8-sig'))
sha=lambda p:hashlib.sha256(p.read_bytes()).hexdigest()
result=read(run/'package-result.json')
receipt=read(root/'artifacts/audio-preflight-0.2.1-037571056922-receipt.json')
for item in receipt['files']:
    for base in [root,root/'artifacts/audio-preflight-0.2.1-037571056922']:
        assert hashlib.sha256((base/item['file']).read_bytes().replace(b'\r\n',b'\n')).hexdigest()==item['sha256']
assert subprocess.check_output(['git','branch','--show-current'],cwd=root,text=True).strip()==result['branch']
assert subprocess.check_output(['git','rev-parse','HEAD'],cwd=root,text=True).strip()==result['head']
assert sha(root/result['package'])==result['packageSha256']
assert (root/result['package']).stat().st_size==15698
with zipfile.ZipFile(root/result['package']) as z:
    assert z.testzip() is None
    assert len(z.namelist())==len(set(z.namelist()))
    assert sorted(n for n in z.namelist() if not n.endswith('/'))==sorted(i['file'] for i in receipt['files'])
    assert all(n in [i['file'] for i in receipt['files']]+['src/'] for n in z.namelist())
    for i in receipt['files']:
        b=z.read(i['file'])
        if i['file']=='manifest.json': assert json.loads(b)==read(root/'artifacts/audio-preflight-0.2.1-037571056922/manifest.json')
        else: assert hashlib.sha256(b).hexdigest()==i['sha256']
old=read(root/'reports/lifecycle-qualification-20261029/run-20261031-0828-linear-fixture/preparation-readback.json')
for name,expected in old['protectedFixtureHashes'].items(): assert sha(root/name)==expected,name
assert sha(root/'reports/lifecycle-qualification-20261029/run-20261031-0828-linear-fixture/working/Linear_Audio_20261031.prproj')=='544b63d0e826208df0bbe07f89181f97e4aa495f2110c72ce34d82f758266203'
for item in read(root/'reports/lifecycle-qualification-20261029/run-20261030-2116-boundaries/media-path-precheck.json'): assert sha(Path(item['path']))==item['sha256']
inventory=[x for x in read(root/'reports/panel-layout-20261029/inherited-inventory.json') if not x['file'].startswith('reports/panel-layout-20261029/')]
for item in inventory: assert (root/item['file']).exists(),item['file']
for name in ['tests/beta.test.js','tests/recovery.test.js']: assert sha(root/name)==next(x['sha256'] for x in inventory if x['file']==name)
for i in read(run/'preflight.json')['priorCCXs']: assert sha(root/i['file'])==i['sha256']
assert sha(Path(receipt['packageFile']))==receipt['packageSha256']
ledger=read(root/'reports/lifecycle-qualification-20261029/execution-ledger.json')
before=read(run/'baseline/ledger-before.json')
counts={s:sum(c['status']==s for c in ledger['cases']) for s in ['PASS_BOUNDED_NATIVE','PASS_ARCHIVE_INTEGRITY','NOT_RUN']}
assert counts=={'PASS_BOUNDED_NATIVE':11,'PASS_ARCHIVE_INTEGRITY':1,'NOT_RUN':6}
assert ledger['counts']=={'passBoundedNative':11,'passArchiveIntegrity':1,'notRun':6,'total':18}
assert ledger['newNativeExecutions']==before['newNativeExecutions']==10
assert ledger['newInstalledExecutions']==0 and not ledger['authorization']['installationAuthorized']
for c in ledger['cases']:
    prior=next(x for x in before['cases'] if x['id']==c['id'])
    if c['id']!='LQ-K01': assert c==prior,c['id']
    else: assert prior['status']=='NOT_RUN' and c['status']=='PASS_ARCHIVE_INTEGRITY'
docs=['README.md','docs/PROJECT_STATUS.md','docs/LIFECYCLE_QUALIFICATION_PLAN_20261029.md','docs/SUBMISSION_OPERATOR_HANDOFF.md','docs/BETA_RELEASE_CHECKLIST.md','reports/panel-layout-20261029/CONTINUATION.md']
for p in [root/name for name in docs]+[run/'README.md']:
    content=p.read_text(encoding='utf-8-sig'); assert result['status'] in content
    for target in re.findall(r'\]\(([^)]+)\)',content):
        target=target.split('#')[0]
        if target and not re.match(r'^(https?:|codex:)',target): assert (p.parent/target).exists(),str(p)+': '+target
handoff=root.parent/'HANDOFF_LOG_2026-10-29.md'
old_handoff=(run/'baseline/handoff-before-package.md').read_text(encoding='utf-8-sig')
current_handoff=handoff.read_text(encoding='utf-8-sig')
# Existing shared content is contiguous beneath the new top route; unrelated history is retained.
assert old_handoff[old_handoff.find('\n')+1:].lstrip('\n') in current_handoff
assert '### 9.21 Final-runtime CCX' in current_handoff
for name in ['finalize-package.py','verify-package-record.py']: ast.parse((run/name).read_text(),filename=name)
subprocess.run(['git','diff','--check'],cwd=root,check=True,capture_output=True)
session=read(root/'reports/panel-layout-20261029/session-result.json')
assert session['status']=='BOUNDED_NARROW_WIDE_LAYOUT_AND_EXPORTS_COMPLETE'
assert session['lifecycleQualificationPlan']['boundedPasses']==11 and session['lifecycleQualificationPlan']['remainingNotRun']==6
for f in ['udt-package-success.jpg','package-destination.jpg','udt-options-blank-override.jpg','registered-stage-folder.txt','archive-verification.json','independent-archive-readback.json']: assert (run/f).is_file()
verification={'verifiedAt':datetime.datetime.now(datetime.timezone.utc).isoformat(),'status':'PASS_PACKAGE_ARCHIVE_PRESERVATION_AND_RECORD_READBACK','nativePackagingStatus':result['status'],'runtimeSourceStageUnchanged':True,'archiveIntegrityPass':True,'manifestFormattingOnly':True,'sixRuntimeFilesExact':True,'fixtureAndProtectedOriginalsUnchanged':True,'priorLinkedMediaUnchanged':True,'inheritedPathsPresent':len(inventory),'inheritedTestsUnchanged':True,'previousCCXAndDeveloperZipPreserved':True,'onlyK01CaseChanged':True,'ledgerCounts':counts,'rootSummaryReconciled':True,'zeroNewScans':True,'installationStarted':False,'installationQualified':False,'documentLinksExist':True,'sharedHandoffHistoryPreserved':True,'gitDiffCheck':True,'helperSyntax':'PASS','evidenceLimit':'Native UDT action/path/options/success were observed separately; this verifier checks local files and record consistency, not screenshot facts or installed behavior.','editedDocs':[{'file':name,'sha256':sha(root/name)} for name in docs],'sharedHandoffSha256':sha(handoff),'files':[{'file':p.relative_to(run).as_posix(),'sha256':sha(p)} for p in sorted(run.rglob('*')) if p.is_file() and p.name!='verification.json']}
(run/'verification.json').write_text(json.dumps(verification,indent=2)+'\n',encoding='utf-8')
print(json.dumps({k:v for k,v in verification.items() if k not in ['files','editedDocs']},indent=2))
