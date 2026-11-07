"""Record the observed native checkpoint; never controls the application."""
from pathlib import Path
import datetime, hashlib, json, os, re, subprocess

run = Path(__file__).resolve().parent
root = run.parents[2]
rel = run.relative_to(root).as_posix()
now = datetime.datetime.now(datetime.timezone(datetime.timedelta(hours=7))).isoformat()
read = lambda p: json.loads(p.read_text(encoding='utf-8-sig'))
def write(p, value):
    p.write_text(json.dumps(value, indent=2) + '\n', encoding='utf-8')
status = 'INFLIGHT_ATTEMPT_AWAITING_OPERATOR_JSON_SAVE'
next_action = 'Await requested saved response for the existing native JSON Save As dialog (default media folder/name). Verify the saved complete report before any new scan. Then make one earlier Cancel attempt on this unchanged 1024-clip fixture and one successful retry if cancellation occurs. Stop input on targeting disagreement; do not grow the fixture or inject delays.'
preflight = read(run / 'preflight.json')
preflight.update(status=status, updatedAt=now, loadedRuntimeBound=True, registrationPath='artifacts/audio-preflight-0.2.1-037571056922', buildFolderOverride=None, nativeScanButtonInputs=2, retainedCompleteReportsObserved=1, exportedReportVerified=False, D08='NOT_EXERCISED', D09='NOT_EXERCISED', nextAction=next_action)
preflight['nativeScanInvocationCount'] = 'At least one; native generatedAt filename matches second input. Verify raw export before exact count claims.'
preflight.pop('newNativeScans', None)
write(run / 'preflight.json', preflight)
attempt = read(run / 'native-attempt-timestamps.json')
events = [
    {'event': 'FINAL_RUNTIME_BOUND_AND_LOADED', 'class': 'VERIFIED_THIS_SESSION_NATIVE_AND_FILESYSTEM', 'registrationPathObservedVia': 'UDT Open Folder -> Explorer full breadcrumb accessibility tree', 'buildFolderOverride': 'blank; no change', 'loaded': True, 'evidence': ['registered-folder.txt', 'registered-folder-0.jpg', 'registered-folder-1.jpg', 'udt-options.jpg', 'udt-options.txt', 'udt-loaded.jpg']},
    {'event': 'REAL_TRAVERSAL_AND_TIMING_LIMIT', 'actual': attempt, 'firstProgress': '132/1024', 'laterProgress': '277/1024 main capture; 281/1024 later panel capture', 'sequentialSnapshotsAreNotAtomic': True, 'scanAndExportDisabledVisibly': True, 'cancelEnabledVisibly': True, 'secondInputBusyStateAtInput': 'NOT_ESTABLISHED; input was 8.583 seconds after initial Scan', 'retainedReport': 'COMPLETE, 7295 ms, 1/1 sequences, 3/3 tracks, 1024/1024 clips, 4096/4096 components, 0 review findings, 3 capability Unknowns', 'nativeSaveDialogDefaultStem': 'audio-preflight-2026-10-31T03-08-24-777Z', 'cancelledReportObtained': False, 'D08': 'NOT_EXERCISED', 'D09': 'NOT_EXERCISED', 'limits': 'Disabled controls in a past screenshot do not establish their state at a delayed input. No rejected-overlap, invocation-count or cancellation PASS.'},
    {'event': 'RESIZE_TARGET_DID_NOT_APPLY', 'inputStopped': True, 'operatorRequested': 'Expose Export JSON', 'operatorStatement': 'ready', 'operatorClass': 'USER_STATED', 'independentReadback': 'Panel now docked at left, export controls visible and retained 7295 ms report unchanged', 'evidence': ['panel-resize-not-applied-input-stopped.jpg', 'operator-docked-report-export-visible.jpg']},
    {'event': 'JSON_SAVE_TARGET_DISAGREEMENT', 'nativePickerObserved': True, 'defaultFolder': 'run-20261031-0828-linear-fixture/media', 'saveClickTarget': 'main Premiere window', 'actual': 'Save As still exists behind main window; no file found', 'inputStopped': True, 'operatorRequested': 'Bring Save As forward, Save default name/folder, reply saved', 'response': 'PENDING', 'productWriteFailureEstablished': False, 'evidence': ['complete-json-picker.jpg', 'native-window-metadata.json']}
]
write(run / 'native-events.json', events)
ledger_path = root / 'reports/lifecycle-qualification-20261029/execution-ledger.json'
ledger = read(ledger_path)
ledger.update(status=status, currentRun=run.name, updatedAt=now)
for case_id in ['LQ-D08', 'LQ-D09']:
    case = next(c for c in ledger['cases'] if c['id'] == case_id)
    case.update(status='NOT_EXERCISED', evidenceClass='VERIFIED_THIS_SESSION_NATIVE_WITH_TIMING_LIMIT', actual={'busyControlsObserved': True, 'delayedInputDoesNotEstablishBusyStateAtInput': True, 'cancelledReport': False, 'retainedCompleteMs': 7295}, evidence=[run.name + '/native-events.json', run.name + '/native-attempt-timestamps.json', run.name + '/scan-active-132-of-1024.jpg', run.name + '/after-second-scan-active-277.jpg', run.name + '/attempt1-complete-coverage.jpg'], limitations=['Observation-to-input delay prevents in-flight cancellation/overlap acceptance; no pass.', 'Exact adapter invocation count is not instrumented; verify retained native JSON before further conclusions.'])
ledger['inFlightAttempt'] = preflight
ledger['currentNativeHostState'] = {'project': 'Linear_Audio_20261031', 'panel': 'operator-docked left; retained COMPLETE 7295 ms report', 'saveAs': 'open behind main window; awaiting operator Save', 'finalRuntimeBinding': 'VERIFIED_THIS_SESSION_NATIVE_REGISTRATION_AND_LOADED', 'inputStopped': True}
write(ledger_path, ledger)
summary = '**Latest 31 October in-flight attempt — ' + status + ':** final 037571056922 registration path, blank build override and Loaded state independently bound. Real traversal and disabled Scan/export controls observed on the 1024-clip fixture, but delayed second Scan/Cancel inputs did not establish a busy-state rejection or cancellation. Retained report COMPLETE 7295 ms, full 1/3/1024/4096 coverage. D08/D09 NOT_EXERCISED; 8 earlier bounded passes and 8 other NOT_RUN cases preserved. JSON Save As remains open after targeting disagreed; input stopped, operator Save requested. '
readme = '# Bounded in-flight attempt — 31 October 2026\n\n' + summary + '\n\n'
readme += 'Actual native actions and timing: [native-events.json](native-events.json), [native-attempt-timestamps.json](native-attempt-timestamps.json). The UI result is distinct from raw-report content: native JSON has not yet been verified. Active screenshots captured at different moments (277 vs 281) are not atomic. The native filename points to generatedAt 03:08:24.777Z, adjacent to the second Scan input; do not label that input rejected during the first traversal. Cancel input at 03:08:33.114Z was followed by COMPLETE, not a cancellation result. No scanner defect is established.\n\n'
readme += '**Operator recovery:** resize failed to apply and input stopped; user ready is USER_STATED. Fresh native screenshot independently shows left-docked panel and retained report. JSON picker opened in the fixture media folder. Save input to the main window did not close the actual Save As window; no file was located. User-only Save recovery requested, no rescan. This is not a reproduced plugin write failure.\n\n'
readme += '**Exact continuation:** ' + next_action + '\n\n'
readme += 'Branch codex/validated-beta-20261017 / HEAD 9330e242eadcd10623300ca39d01753355aefc7a and seven source/stage hashes remain frozen runtime 03757105692238f9fdc51a17a39aa4a3c6021ca08a6e8c799aa51d43db8d29a4. Fixture saved SHA256 544b63d0e826208df0bbe07f89181f97e4aa495f2110c72ce34d82f758266203; baseline preserved. No source/test patch, injected host delay, fixture growth, forced termination, user-work discard, install/package/system/remote action or CutBridge/AE Glyph/WBS change. Mapping/output topology/playback-export correctness and earlier crash cause UNKNOWN. Customer installation and broader lifecycle remain separate; distribution NOT APPROVED.\n'
(run / 'README.md').write_text(readme, encoding='utf-8')
docs = ['README.md', 'docs/PROJECT_STATUS.md', 'docs/LIFECYCLE_QUALIFICATION_PLAN_20261029.md', 'docs/SUBMISSION_OPERATOR_HANDOFF.md', 'docs/BETA_RELEASE_CHECKLIST.md', 'reports/panel-layout-20261029/CONTINUATION.md']
for name in docs:
    p = root / name; text = p.read_text(encoding='utf-8-sig')
    text = re.sub(r'<!-- INFLIGHT_CURRENT -->.*?<!-- /INFLIGHT_CURRENT -->\n\n', '', text, flags=re.S)
    title, rest = text.split('\n', 1)
    link = Path(os.path.relpath(run / 'README.md', p.parent)).as_posix()
    block = '<!-- INFLIGHT_CURRENT -->\n' + summary + f'[Current native checkpoint]({link}); shared handoff section 9.18. **Next:** {next_action}\n<!-- /INFLIGHT_CURRENT -->\n\n'
    p.write_text(title + '\n\n' + block + rest.lstrip('\n'), encoding='utf-8')
layout_path = root / 'reports/panel-layout-20261029/session-result.json'
layout = read(layout_path); layout['inFlightAttempt20261031'] = preflight; write(layout_path, layout)
handoff = root.parent / 'HANDOFF_LOG_2026-10-29.md'
text = handoff.read_text(encoding='utf-8-sig')
heading = '### 9.18 Final-runtime load and bounded in-flight timing attempt — 31 October 2026'
if heading not in text:
    text += '\n\n' + heading + '\n\n' + summary + '\n\n'
    text += '**Created/edited:** `Premiere-Audio-Routing-Integrity-Doctor/' + rel + '/` contains preflight, frozen ledger/fixture/receipt/Git baseline, native UDT path/options/Loaded captures, pre-scan and active-state captures, delayed second input/complete coverage captures, actual UTC input timestamps, operator-docked export view, Save As picker and targeting-stop evidence, README/events, record-checkpoint.py and readback. Updated live ledger, current project README/status/plan/operator/checklist/layout-continuation pointers, additive in-flight session summary/aggregate pointer, and this log. Older 9.14–9.17 and unrelated-project entries are preserved.\n\n'
    text += '**Timing reassessment and limits:** first Scan requested 03:08:16.070Z, active observation returned 03:08:17.730Z; second Scan requested 03:08:24.653Z, returned 24.773Z. Native retained export filename indicates generatedAt 24.777Z, adjacent to the second input. Thus the later input may have started a fresh scan; screenshots of disabled controls before that input do not prove rejected overlap. Cancel requested 03:08:33.114Z; result COMPLETE 7295 ms, not cancelled. No D08/D09 PASS, no instrumented single-flight proof, no crash cause or product defect inferred. Export write result is still unverified, not a native write-failure PASS.\n\n'
    text += '**Runtime/preservation/gates:** same codex/validated-beta-20261017 / 9330e242eadcd10623300ca39d01753355aefc7a; all seven normalized source/stage files match final 037571056922 receipt. Saved 1024 fixture baseline SHA256 544b63d0e826208df0bbe07f89181f97e4aa495f2110c72ce34d82f758266203. No runtime/test change or unnecessary controlled-suite rerun. Prior tests remain historical; original/source/test/media/inherited-path, links and Git-whitespace checks are recorded in this run readback. No fixture growth, app restart, force termination, unsaved-work discard, package/install/system/remote action or CutBridge/AE Glyph/WBS change. Mapping/output/playback correctness UNKNOWN; customer lifecycle/install/distribution separate and unapproved.\n\n**Exact next continuation:** ' + next_action + '\n'
title, rest = text.split('\n', 1)
rest = re.sub(r'<!-- INFLIGHT_CURRENT -->.*?<!-- /INFLIGHT_CURRENT -->\n\n', '', rest, flags=re.S)
handoff.write_text(title + '\n\n<!-- INFLIGHT_CURRENT -->\n**Latest authoritative Premiere checkpoint: section 9.18.** ' + summary + '\n<!-- /INFLIGHT_CURRENT -->\n\n' + rest.lstrip('\n'), encoding='utf-8')
print(json.dumps({'status': status, 'boundedPasses': 8, 'notRun': 8, 'notExercised': 2, 'next': next_action}, indent=2))
