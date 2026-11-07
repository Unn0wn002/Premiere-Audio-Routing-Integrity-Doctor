"""Record observed preparation evidence; never controls Premiere or executes its API."""
from pathlib import Path
import argparse, datetime, hashlib, json, re, subprocess

parser = argparse.ArgumentParser()
parser.add_argument('--reopen-verified', action='store_true')
args = parser.parse_args()
run = Path(__file__).resolve().parent
root = run.parents[2]
rel = run.relative_to(root).as_posix()
now = datetime.datetime.now(datetime.timezone(datetime.timedelta(hours=7))).isoformat()
status = 'RESPONSIVE_LINEAR_FIXTURE_PREPARED_BOUNDED' if args.reopen_verified else 'LINEAR_1024_SAVED_AWAITING_REOPEN_READY'
section = '9.17' if args.reopen_verified else '9.16'
sha = lambda p: hashlib.sha256(p.read_bytes()).hexdigest()
read = lambda p: json.loads(p.read_text(encoding='utf-8-sig'))
def write(p, value):
    p.write_text(json.dumps(value, indent=2) + '\n', encoding='utf-8')

for name in ['preflight.json', 'native-events.json', 'README.md', 'preparation-readback.json']:
    dest = run / 'baseline' / ('before-30fps-recovery-' + name)
    if not dest.exists():
        dest.write_bytes((run / name).read_bytes())
ledger_path = root / 'reports/lifecycle-qualification-20261029/execution-ledger.json'
baseline_ledger = run / 'baseline/ledger-before-30fps-recovery.json'
if not baseline_ledger.exists():
    baseline_ledger.write_bytes(ledger_path.read_bytes())

stages = []
for n in [1, 2, 4, 8, 16, 32, 64, 128, 256, 512, 1024]:
    name = f'stage-{n:04d}-30fps-structure.json'
    s = read(run / name)
    assert s['referencedAudioClipOccurrences'] == n
    assert s['sequenceCount'] == s['populatedAudioTracks'] == 1
    assert s['audioTrackCount'] == 3 and s['contiguousRepeatedClipRanges']
    clips = [c for t in s['tracks'] for c in t['clips']]
    assert all(c['endTicks'] - c['startTicks'] == 254016000000 for c in clips)
    assert max(c['endTicks'] for c in clips) == n * 254016000000
    assert s['projectSha256'] == sha(run / f'baseline/stage-{n:04d}-30fps.prproj')
    stages.append({'clips': n, 'structure': name, 'snapshotSha256': s['projectSha256']})
final = read(run / 'stage-1024-30fps-structure.json')
project = run / final['project']
assert sha(project) == final['projectSha256']
assert len(final['sourcePaths']) == 1 and final['sourcePaths'][0].replace('\\', '/').endswith('/media/ARID_Linear_Stereo_1s.wav')
assert subprocess.check_output(['git', 'branch', '--show-current'], cwd=root, text=True).strip() == 'codex/validated-beta-20261017'
assert subprocess.check_output(['git', 'rev-parse', 'HEAD'], cwd=root, text=True).strip() == '9330e242eadcd10623300ca39d01753355aefc7a'
receipt = read(root / 'artifacts/audio-preflight-0.2.1-037571056922-receipt.json')
for item in receipt['files']:
    for base in [root, root / 'artifacts/audio-preflight-0.2.1-037571056922']:
        normalized = (base / item['file']).read_bytes().replace(b'\r\n', b'\n')
        assert hashlib.sha256(normalized).hexdigest() == item['sha256']

next_action = ('Freshly bind UDT registration path and Loaded state to final 037571056922 before any scan. Then use this independent fixture for the planned bounded D08/D09 trial; actual active traversal/cancel/overlap evidence is required. No forced delays or fixture growth beyond 1024 merely to catch a short scan.' if args.reopen_verified else 'Await already requested operator ready after normal reopen; make no desktop calls during loading. Then fresh-select Premiere, independently inspect timeline and File-menu responsiveness, and preserve evidence before declaring reopened readiness.')
evidence = {
    'updatedAt': now, 'status': status, 'run': rel,
    'project': final['project'], 'projectSha256': final['projectSha256'],
    'sequenceCount': 1, 'audioTrackCount': 3, 'populatedAudioTracks': 1,
    'referencedAudioClipOccurrences': 1024, 'clipDurationSeconds': 1,
    'sequenceDurationSeconds': 1024, 'nativeEndTimecode': '00:17:04:00',
    'sequenceTimebase': '30.00 frames/second', 'audio': 'Stereo 2 channels / 48000 Hz',
    'contiguousEqualDurationRangesVerified': True, 'stages': stages,
    'operatorTimebaseSelection': {'class': 'USER_STATED', 'statement': '30 selected.'},
    'timebaseIndependentlyObserved': 'sequence-settings-30fps-verified.jpg',
    'nativeSaveFitAndFileMenuResponsive': True,
    'nativeEvidence': ['stage-0002-30fps-native.jpg', 'stage-0128-30fps-native.jpg', 'stage-1024-30fps-saved-native.jpg', 'stage-1024-fit-native.jpg', 'stage-1024-file-menu-responsive.jpg', 'stage-1024-normal-close-home.jpg'],
    'normalCloseObserved': True, 'normalReopenRequested': True,
    'reopenedReadinessIndependentlyObserved': args.reopen_verified,
    'responsiveLargerFixtureEstablished': args.reopen_verified,
    'nativeScansThisRun': 0, 'finalRuntimeLoadedThisRun': 'NOT_INDEPENDENTLY_ESTABLISHED',
    'runtimeSourceStageIdentity': receipt['identity'], 'runtimeSourceStageUnchanged': True,
    'D08': 'NOT_RUN', 'D09': 'NOT_RUN', 'nextAction': next_action,
    'limits': ['Synthetic single-sequence preparation, not representative customer performance or cancellation qualification.', 'Saved native project structure, observed UI responsiveness and plugin adapter reads are separate evidence classes.', 'Mapping, output-bus topology, playback/export correctness and earlier docking crash cause remain UNKNOWN.', 'Customer installation and broader lifecycle remain separate; distribution NOT APPROVED.']
}
if args.reopen_verified:
    assert (run / 'stage-1024-reopened-native.jpg').exists()
    assert (run / 'stage-1024-reopened-file-menu.jpg').exists()
    evidence['operatorReopenReady'] = {'class': 'USER_STATED', 'statement': 'ready'}
    evidence['nativeEvidence'] += ['stage-1024-reopened-native.jpg', 'stage-1024-reopened-file-menu.jpg']
write(run / 'fixture-result.json', evidence)

preflight = read(run / 'preflight.json')
preflight.update(status=status, updatedAt=now, currentSavedProjectSHA256=final['projectSha256'], currentSavedClipCount=1024, currentSequenceTimebase='30.00 frames/second', largerFixtureQualified=args.reopen_verified, nativeScans=0, fixtureResult='fixture-result.json', normalReopenRequested=True, reopenedReadinessIndependentlyObserved=args.reopen_verified)
preflight['historicalSetupDiagnostic'] = {'file': 'two-clip-gap-diagnostic.json', 'savedDiagnosticClipCount': 2, 'inMemoryAfterOwnUndo': 1, 'supersededBy': '30 fps corrected baseline and validated growth'}
preflight.pop('savedDiagnosticClipCount', None)
preflight.pop('inMemoryVisibleClipCountAfterOwnUndo', None)
write(run / 'preflight.json', preflight)
events = read(run / 'native-events.json')
event_name = 'REOPENED_1024_FIXTURE_INDEPENDENTLY_OBSERVED' if args.reopen_verified else 'TIMEBASE_RECOVERY_AND_LINEAR_GROWTH_1024'
if not any(x['event'] == event_name for x in events):
    events.append({'event': event_name, 'recordedAt': now, 'operatorTimebaseStatement': '30 selected.', 'operatorClass': 'USER_STATED', 'nativeTimebaseAndAudioIndependentlyObserved': True, 'correctedTwoClipZeroGapVerified': True, 'savedGrowthStages': [x['clips'] for x in stages], 'nativeActions': 'Fresh Ctrl+A/C, append with Ctrl+V at observed end, Ctrl+S; observe after every input and inspect/freeze each saved stage; fit sequence; File menu; normal saved close and recent-project reopen request', 'reopenedObserved': args.reopen_verified, 'newScans': 0, 'evidence': 'fixture-result.json'})
write(run / 'native-events.json', events)

ledger = read(ledger_path)
assert sum(x['status'] == 'PASS_BOUNDED_NATIVE' for x in ledger['cases']) == 8
assert sum(x['status'] == 'NOT_RUN' for x in ledger['cases']) == 10
ledger.update(status=status, currentRun=run.name, updatedAt=now)
ledger['largerFixturePreparation'] = evidence
ledger['currentNativeHostState'] = {'project': 'Linear_Audio_20261031', 'status': 'reopened, independently responsive' if args.reopen_verified else 'normal reopen requested; awaiting operator ready, desktop inspection idle', 'lastObservedSavedProjectSha256': final['projectSha256'], 'pluginLoadedThisRun': 'NOT_INDEPENDENTLY_ESTABLISHED', 'scanThisRun': False}
write(ledger_path, ledger)
layout_path = root / 'reports/panel-layout-20261029/session-result.json'
layout = read(layout_path)
layout['largerFixturePreparation'] = {k: evidence[k] for k in ['status', 'run', 'projectSha256', 'referencedAudioClipOccurrences', 'responsiveLargerFixtureEstablished', 'finalRuntimeLoadedThisRun', 'D08', 'D09', 'nextAction']}
layout['largerFixturePreparation']['newNativeScans'] = 0
write(layout_path, layout)

summary = f'**Latest 31 October checkpoint — {status}:** corrected disposable sequence independently verified at 30.00 fps, stereo 48 kHz. Native growth and saved-structure guards passed every power of two from 1 to **1,024 equal, contiguous one-second clips**, one sequence / three audio tracks / one populated track. Timeline fit, Save and File menu responded. ' + ('Normal saved close/reopen and fresh timeline/File-menu responsiveness are independently observed; user ready remains USER_STATED. ' if args.reopen_verified else 'Normal saved close observed; reopen requested and operator ready pending, with desktop inspection idle during loading. ') + 'Zero new scans; D08/D09 remain NOT_RUN, ledger 8 bounded passes / 10 NOT_RUN. Runtime/source/originals preserved. '
doc_paths = ['README.md', 'docs/PROJECT_STATUS.md', 'docs/LIFECYCLE_QUALIFICATION_PLAN_20261029.md', 'docs/SUBMISSION_OPERATOR_HANDOFF.md', 'docs/BETA_RELEASE_CHECKLIST.md', 'reports/panel-layout-20261029/CONTINUATION.md']
for name in doc_paths:
    p = root / name
    content = p.read_text(encoding='utf-8-sig')
    content = re.sub(r'<!-- LINEAR_FIXTURE_CURRENT -->.*?<!-- /LINEAR_FIXTURE_CURRENT -->\n\n', '', content, flags=re.S)
    title, rest = content.split('\n', 1)
    link = Path(__import__('os').path.relpath(run / 'README.md', p.parent)).as_posix()
    block = '<!-- LINEAR_FIXTURE_CURRENT -->\n' + summary + f'[Preparation evidence]({link}); shared handoff section {section}. **Next:** {next_action}\n<!-- /LINEAR_FIXTURE_CURRENT -->\n\n'
    p.write_text(title + '\n\n' + block + rest.lstrip('\n'), encoding='utf-8')

old_run = (run / 'baseline/before-30fps-recovery-README.md').read_text(encoding='utf-8-sig')
readme = '# Independent linear audio fixture preparation — 31 October 2026\n\n' + summary + '\n\n'
readme += f'Saved working project: `working/Linear_Audio_20261031.prproj`. Final SHA256 **`{final["projectSha256"]}`**; identical frozen snapshot `baseline/stage-1024-30fps.prproj`. Duration 1,024 seconds / **00:17:04:00**. Detailed stages, identities and limits: [fixture-result.json](fixture-result.json). The separate one-second generated input remains `media/ARID_Linear_Stereo_1s.wav`.\n\n'
readme += '**Actual setup recovery:** user replied “30 selected.”; fresh native Sequence Settings independently showed 30.00 fps, Stereo 2 channels / 48000 Hz. Saved corrected one-clip baseline, re-copied it and verified two equal one-second clips with zero gap before further growth. Every later stage was saved, structurally checked and frozen. The 29.97-fps two-clip mismatch remains preserved as setup history, not a scanner defect; frame-rounding causation is not established.\n\n'
readme += '**Exact continuation:** ' + next_action + '\n\n'
readme += 'No UDT launch/load or scan ran in this preparation. Source/stage hashes do not establish a currently loaded developer runtime. No runtime/test patch or package/install/system/remote action; CutBridge, AE Glyph and WBS unchanged. Existing 58/58 controlled and 6/6 synthetic results retain their original date; not rerun for unchanged runtime and fixture/document work.\n\n'
readme += '## Historical checkpoints — superseded, preserved verbatim below\n\n' + old_run
(run / 'README.md').write_text(readme, encoding='utf-8')

handoff = root.parent / 'HANDOFF_LOG_2026-10-29.md'
text = handoff.read_text(encoding='utf-8-sig')
heading = f'### {section} Linear fixture 30 fps recovery and 1,024-clip preparation'
if heading not in text:
    entry = '\n\n' + heading + ' — 31 October 2026\n\n'
    entry += summary + '\n\n'
    entry += f'**Created and verified:** under `Premiere-Audio-Routing-Integrity-Doctor/{rel}/`, `sequence-settings-30fps-verified.jpg`; corrected one/two-clip and 4/8/16/32/64/128/256/512/1024 stage structure JSON and byte-identical `baseline/stage-*-30fps.prproj` snapshots; final project SHA256 **`{final["projectSha256"]}`**. Working path `working/Linear_Audio_20261031.prproj`, sequence ARID_Linear_Stereo_1s, 30.00 fps, Stereo 2 / 48000 Hz, duration 00:17:04:00. Only independent generated WAV source, unchanged SHA256 `3db4c9dee27fd8ee8ed414cc12fb962cb67a780ef3f73445a5e1dad3b170ea8d`. Native captures cover corrected two-clip, 128-clip, final saved/fit/File-menu and normal-close Home states; `fixture-result.json` lists actual paths/hashes/stages. '
    if args.reopen_verified:
        entry += 'New `stage-1024-reopened-native.jpg` and `stage-1024-reopened-file-menu.jpg` independently show reopened project and responsive File menu after user ready. '
    entry += '\n\n**Historical distinction:** operator timebase selection/ready are USER_STATED; fresh native settings and saved gzip/XML occurrence refs independently verify correction/count/equal lengths/continuity. The old saved 29.97 duplication diagnostic and failed popup selection remain preserved; no scanner defect or crash cause is inferred. Native responsiveness is observed action/readback, not a timed UI benchmark. No plugin adapter traversal, cancellation, rejected overlap or customer performance is verified. UDT has not been launched/loaded in this preparation; fresh exact registration path/Loaded binding is required before any scan.\n\n'
    entry += '**Edited:** run README/preflight/events, `fixture-result.json`, read-only `record-fixture.py` and preservation/readback inventory; live lifecycle ledger; current-facing project README, PROJECT_STATUS, LIFECYCLE_QUALIFICATION_PLAN, SUBMISSION_OPERATOR_HANDOFF, BETA_RELEASE_CHECKLIST and layout CONTINUATION; additive larger-fixture summary in layout session-result and existing aggregate continuation pointer; this shared log. Historical setup/run documents and prior current JSON were frozen under `baseline/before-30fps-recovery-*` / `ledger-before-30fps-recovery.json`. Other projects and their handoff entries preserved.\n\n'
    entry += '**Identity, actual checks and gaps:** same codex/validated-beta-20261017 / 9330e242eadcd10623300ca39d01753355aefc7a; seven normalized source/stage hashes remain final 03757105692238f9fdc51a17a39aa4a3c6021ca08a6e8c799aa51d43db8d29a4. Saved count/contiguity guards pass each growth stage; no product code/test patch and no unnecessary controlled-suite rerun. Preservation/links/Git whitespace/readback results are in the run record. Zero native scans this run; earlier lifecycle scans and 8 bounded passes / 10 NOT_RUN keep their original dates. Mapping, output topology, playback/export correctness, crash causation UNKNOWN. Customer install/package/profile and broader lifecycle remain separate; distribution NOT APPROVED. No forced termination, unsaved user-work discard, app restart, install/package/system/remote action, or CutBridge/AE Glyph/WBS change.\n\n'
    entry += '**Exact next continuation:** ' + next_action + ' Preserve completed size/review/picker/boundary trials; do not repeat without a reason. D05 still needs a harmless approved available failure destination.\n'
    text += entry
title, rest = text.split('\n', 1)
rest = re.sub(r'<!-- LINEAR_FIXTURE_CURRENT -->.*?<!-- /LINEAR_FIXTURE_CURRENT -->\n\n', '', rest, flags=re.S)
top = f'<!-- LINEAR_FIXTURE_CURRENT -->\n**Latest authoritative Premiere continuation — 31 October: section {section}.** ' + summary + ' Earlier 9.14/9.15 pending states are historical; use the latest section for exact continuation.\n<!-- /LINEAR_FIXTURE_CURRENT -->\n\n'
handoff.write_text(title + '\n\n' + top + rest.lstrip('\n'), encoding='utf-8')
print(json.dumps({'status': status, 'clips': 1024, 'projectSha256': final['projectSha256'], 'runtimeSourceStageUnchanged': True, 'ledgerBoundedPasses': 8, 'ledgerNotRun': 10, 'sharedHandoffSection': section}, indent=2))
