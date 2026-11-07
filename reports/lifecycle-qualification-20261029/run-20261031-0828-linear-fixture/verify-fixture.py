"""Readback checks for the bounded fixture record; no host execution."""
from pathlib import Path
import ast, datetime, hashlib, json, re, subprocess

run = Path(__file__).resolve().parent
root = run.parents[2]
read = lambda p: json.loads(p.read_text(encoding='utf-8-sig'))
sha = lambda p: hashlib.sha256(p.read_bytes()).hexdigest()
old = read(run / 'baseline/before-30fps-recovery-preparation-readback.json')
fixture = read(run / 'fixture-result.json')
for name, expected in old['protectedFixtureHashes'].items():
    assert sha(root / name) == expected, 'Protected fixture changed: ' + name
inventory = [x for x in read(root / 'reports/panel-layout-20261029/inherited-inventory.json') if not x['file'].startswith('reports/panel-layout-20261029/')]
for item in inventory:
    assert (root / item['file']).exists(), 'Inherited path absent: ' + item['file']
for name in ['tests/beta.test.js', 'tests/recovery.test.js']:
    assert sha(root / name) == next(x['sha256'] for x in inventory if x['file'] == name)
for item in read(root / 'reports/lifecycle-qualification-20261029/run-20261030-2116-boundaries/media-path-precheck.json'):
    assert sha(Path(item['path'])) == item['sha256']
assert sha(run / 'media/ARID_Linear_Stereo_1s.wav') == '3db4c9dee27fd8ee8ed414cc12fb962cb67a780ef3f73445a5e1dad3b170ea8d'
assert sha(run / 'working/Linear_Audio_20261031.prproj') == fixture['projectSha256']
for stage in fixture['stages']:
    assert sha(run / ('baseline/' + stage['structure'].replace('-structure.json', '.prproj'))) == stage['snapshotSha256']
for name in fixture['nativeEvidence'] + [fixture['timebaseIndependentlyObserved']]:
    assert (run / name).is_file()
for name in ['inspect-project.py', 'record-fixture.py', 'verify-fixture.py']:
    ast.parse((run / name).read_text(encoding='utf-8'), filename=name)
ledger = read(root / 'reports/lifecycle-qualification-20261029/execution-ledger.json')
assert sum(x['status'] == 'PASS_BOUNDED_NATIVE' for x in ledger['cases']) == 8
assert sum(x['status'] == 'NOT_RUN' for x in ledger['cases']) == 10
for case in ['LQ-D08', 'LQ-D09']:
    assert next(x['status'] for x in ledger['cases'] if x['id'] == case) == 'NOT_RUN'
docs = ['README.md', 'docs/PROJECT_STATUS.md', 'docs/LIFECYCLE_QUALIFICATION_PLAN_20261029.md', 'docs/SUBMISSION_OPERATOR_HANDOFF.md', 'docs/BETA_RELEASE_CHECKLIST.md', 'reports/panel-layout-20261029/CONTINUATION.md']
for p in [root / name for name in docs] + [run / 'README.md']:
    content = p.read_text(encoding='utf-8-sig')
    assert fixture['status'] in content
    for target in re.findall(r'\]\(([^)]+)\)', content):
        target = target.split('#')[0]
        if target and not re.match(r'^(https?:|codex:)', target):
            assert (p.parent / target).exists(), f'Broken local link {p.name}: {target}'
subprocess.run(['git', 'diff', '--check'], cwd=root, check=True, capture_output=True)
git_status = subprocess.check_output(['git', 'status', '--short', '--untracked-files=all'], cwd=root, text=True)
(run / 'git-status-after.txt').write_text(git_status, encoding='utf-8')
record = {
    'verifiedAt': datetime.datetime.now(datetime.timezone.utc).isoformat(),
    'status': 'PASS_PRESERVATION_AND_LOCAL_READBACK', 'currentStage': fixture['status'],
    'nativeClaimSource': 'fixture-result.json; native screenshots observed separately; verifier does not manufacture UI evidence',
    'runtimeSourceStageUnchanged': fixture['runtimeSourceStageUnchanged'],
    'protectedFixtureHashes': old['protectedFixtureHashes'], 'inheritedPathsPresent': len(inventory),
    'inheritedTestsUnchanged': True, 'priorLinkedMediaUnchanged': True, 'newWavHashVerified': True,
    'savedGrowthStagesVerified': [x['clips'] for x in fixture['stages']],
    'finalProjectSha256': fixture['projectSha256'], 'savedTwoClipDiagnosticPreserved': True,
    'nativeLargerResponsivenessEstablished': fixture['responsiveLargerFixtureEstablished'],
    'newNativeScans': 0, 'D08': 'NOT_RUN', 'D09': 'NOT_RUN',
    'operatorTimebaseResponseRequired': False,
    'operatorReopenResponseRequired': not fixture['reopenedReadinessIndependentlyObserved'],
    'gitDiffCheck': True, 'localLinksExist': True, 'evidenceHelperSyntax': 'PASS',
    'dirtyAndUntrackedPathCount': len(git_status.splitlines()),
    'sharedHandoffSha256': sha(root.parent / 'HANDOFF_LOG_2026-10-29.md'),
    'editedDocs': [{'file': name, 'sha256': sha(root / name)} for name in docs],
    'files': [{'file': p.relative_to(run).as_posix(), 'sha256': sha(p)} for p in sorted(run.rglob('*')) if p.is_file() and p.name != 'preparation-readback.json']
}
(run / 'preparation-readback.json').write_text(json.dumps(record, indent=2) + '\n', encoding='utf-8')
print(json.dumps({k: record[k] for k in ['status', 'currentStage', 'inheritedPathsPresent', 'finalProjectSha256', 'nativeLargerResponsivenessEstablished', 'newNativeScans', 'operatorReopenResponseRequired', 'gitDiffCheck', 'localLinksExist']}, indent=2))
