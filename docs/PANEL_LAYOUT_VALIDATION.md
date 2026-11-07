# Native panel layout validation

## Current continuation — 29 October 2026

**Final measured result, 12:35 WIB:** runtime `037571056922` has bounded narrow **326 × 359 logical-pixel outer bounds / 35 ms** and wide **807 × 359 / 31 ms** native scans, screenshots and independently matching JSON/HTML pairs. Each shows COMPLETE 4/15/7/18 coverage, zero failed reads/review findings and three capability Unknowns. Reports agree apart from generation time/duration. Final narrow HTML Save was user-performed; wide native resize/scan/saves were assistant-operated. Saved fixture/source unchanged; final panel idle/wide with picker closed. This closes the previously missing measured-size scan/export evidence only; raw-textarea/docking history and separate lifecycle/customer-installation gates retain their scope. [Final evidence and continuation](../reports/panel-layout-20261029/CONTINUATION.md).

### Earlier 29 October checkpoints — preserved historical states

**Latest 12:25 WIB measurement:** final stage `037571056922` independently identified through UDT Options and loaded. Fresh narrow floating outer bounds **326 × 359 logical pixels**, **35 ms** physical scan, COMPLETE. Native JSON verifies 4/4 sequences, 15/15 tracks, 7/7 clips, 18/18 components, zero failed reads/review findings and three capability Unknowns; saved fixture unchanged. Screenshots and byte-identical `narrow-scan.json` copy are under `../reports/panel-layout-20261029/`; the original JSON remains in the previous report folder. UIA filename readback did not predict the actual save destination. A later capture returned Codex instead of Premiere; desktop input stopped. Narrow native HTML, CSS viewport measurement and wide trial remain unqualified. UDT permission is no longer the blocker. [Details and next native procedure](../reports/panel-layout-20261029/CONTINUATION.md). Earlier pending measured-size statements below refer to the checkpoint before this partial narrow result.

Premiere work is resumed by explicit user instruction. Current source/stage identity was reverified as `03757105692238f9fdc51a17a39aa4a3c6021ca08a6e8c799aa51d43db8d29a4` over unchanged HEAD `9330e242eadcd10623300ca39d01753355aefc7a`. All inherited edits/evidence are retained. Today's filesystem verification is in `../reports/panel-layout-20261029/checkpoint-verification.json`.

Latest aggregate native evidence is **HISTORICAL_RECORDED**: `session-result.json` keys `layoutPostRestartValidation` (42 ms docked scan and final-candidate JSON/HTML), `manualHelperOffDockingValidation` and `manualHelperOffResizeValidation` (both **USER_STATED**). Native scan coverage was 4/4 sequences, 15/15 tracks, 7/7 clips, 18/18 components; zero failed reads/review findings and three capability Unknowns. Retained export contents were rechecked today; this is not a fresh native scan. Do not repeat the already completed scan/export or helper-off manual docking checks merely because older sections list them as pending.

Remaining bounded layout evidence: independently bound loaded runtime; exact narrow/wide geometry and units; screenshots; fresh scan result/duration and JSON/HTML for each size. Broader lifecycle and clean-customer installation are separate gates. Existing-profile installation is recorded for predecessor `48bb1d177f4c`; the 19 October UAC blocker is historical. Mapping, buses and playback/export correctness stay UNKNOWN. Earlier automated docking exit cause stays UNKNOWN. See [current session outcome and continuation](../reports/panel-layout-20261029/CONTINUATION.md).

## Historical validation ledger

All dates, PASS labels, next steps and last-known host states below refer to their original checkpoints. They are preserved as historical evidence, not present-session verification or instructions to repeat completed work.

Date: 27 October 2026, Asia/Jakarta. Small-fixture result: BOUNDED_NATIVE_PANEL_AND_LIFECYCLE_PASS. Latest larger-fixture result: cancellation functional checks PASS, responsiveness NOT QUALIFIED due to a persistent host stall. Installation remains unqualified.

## Source and host identity

- Checkout: codex/validated-beta-20261017, commit c7d63f7f568900d941acdb658ea1123c352ccb0e, with the index.html layout patch uncommitted.
- Premiere: 26.5.2, executable build 26.5.2.5; observed UXP uxp-9.3.0-local; plugin 0.2.1; en_US.
- UXP Developer Tools: 2.3.0.5.
- Staged runtime identity: b4460b46135c7e7b07b1ff905cbd27afd110f66fbb07c6fda4e46627fb3a140a.
- UDT Options independently confirmed the registered build folder as this checkout's artifacts/audio-preflight-0.2.1-b4460b46135c. See ../reports/panel-layout-20261027/udt-build-folder.txt.
- Staged index.html SHA256: d25d24c8f93920e37073501ab241e818f2aaa901a6798f19eac855723d658201.

Historical package hashes and installation qualification do not apply to these changed bytes. This was a UDT development load, not a customer CCX installation test.

## Architecture

The main interface is the manifest's UXP panel entrypoint, audio-routing-integrity-probe. Premiere owns docking, undocking, resizing and floating. There is no custom modal main interface. index.js handles interaction; src/premiereAdapter.js, diagnostics.js, valueSerializer.js and report.js retain capture and processing logic.

The dark panel uses a width media query to stack buttons below 380px, constrains review selectors to their cards, wraps text, and provides vertical scrolling. Size declarations are host preferences, not guarantees.

Official references:

- https://developer.adobe.com/premiere-pro/uxp/plugins/concepts/manifest/
- https://developer.adobe.com/premiere-pro/uxp/resources/recipes/css-styling/
- https://developer.adobe.com/premiere-pro/uxp/uxp-api/reference-css/media-queries/width

## Results

| Check | Actual result |
| --- | --- |
| Native plugin load | PASS: existing beta registration loaded and opened Audio Preflight |
| Standard host menu | PASS: Window > UXP Plugins > Audio Preflight - Private Beta opens the panel |
| Docking | PASS: tab docked beside Learn in the host workspace |
| Narrow docked resize | PASS: approximately 320px wide; stacked buttons, wrapped status/coverage and contained selectors |
| Floating and resize | PASS for observed sizes: approximately 326 x 359 to 632 x 780 outer bounds initially; subsequent short floating layout approximately 602 x 373 also scrolled to exports and findings |
| Undock/redock | PASS: host panel menu's Undock Panel command and tab redocking retained the report |
| Docked fixture scan | PASS: completed / COMPLETE, 34 ms, two review findings and three capability Unknowns |
| Floating fixture scan | PASS: completed / COMPLETE, 31 ms, same counts |
| Cross-layout report comparison | PASS: sequence observations and full diagnostics match exactly between docked JSON and the raw envelope embedded in floating HTML |
| Coverage | PASS: 4/4 sequences, 15/15 tracks, 7/7 clips, 18/18 components; zero failed reads |
| No-project scan | PASS: failed / UNKNOWN, 6 ms, four Unknown findings; no unconditional successful completion |
| JSON export | PASS: parsed saved reports from no-project and docked scans |
| Readable export | PASS: floating HTML saved; contains COMPLETE status, host, findings and complete parseable raw report |
| Cancelled export picker | PASS: Export cancelled message; export controls recovered and report retained |
| Review selector | Programmatic native change event PASS in both layouts: Intentional annotation reaches raw report and resets on the next scan. Physical popup selection remains unqualified |
| In-flight scan cancellation/overlap | Programmatic native events PASS in both layouts: start/export disabled, cancel enabled, duplicate delivered event leaves busy state intact, immediate cancellation reports cancelled/UNKNOWN, cleanup and actual host retry succeed. No scanner-call counter or physical rapid-click test was injected |
| Raw evidence toggle | Programmatic native events PASS in both layouts; original hidden state restored |
| Deliberate export write failure | NOT_RUN natively; controlled regression PASS |
| Controlled checks after layout change | PASS: 53/53 tests, zero failed/skipped; 6/6 synthetic contracts; all syntax checks |

The results establish basic panel integration and exercised scan/export paths. They do not establish full lifecycle, accessibility, every display scaling setting, long-name stress cases, all F01-F11 native fixtures, installation or release readiness. Mapping, output buses and playback/export correctness remain UNKNOWN.

## Evidence and interruptions

Evidence directory: ../reports/panel-layout-20261027/.

- session-result.json: identities, fixture/export hashes and qualification limits.
- docked-fixture.json: original native docked report.
- audio-preflight-2026-10-26T18-36-11-466Z.html: original native floating readable report, including raw envelope. UTC filename corresponds to 27 October in Asia/Jakarta.
- floating-no-project.json: unchanged copy of native no-project report.
- docked-final.png: final docked host screenshot with retained results and cancelled-export status.
- udt-build-folder.txt: observed UDT registration path.
- controlled-tests.txt, fixture-tests.txt, syntax-checks.txt: fresh controlled-check outputs.
- Layout_Test_Copy.prproj: disposable copy; SHA256 f243358de98eb0024a0364eb6f8a90a7d8ef1b5250db2169ae2ec1d973e82a8e, still equal to original fixture after testing.

Premiere temporarily stopped responding while opening the copied fixture, before a project scan. It recovered without forced termination or restart. Cause UNKNOWN. A startup notice about an earlier unexpected exit was already visible. Neither observation establishes a plugin defect.

An earlier manifest-picker automation attempt could not target the file field. The user resolved the duplicate existing registration by selecting the new build folder in Options; the path was subsequently independently verified above.

The initial no-project export was saved to the native dialog's previous folder in the older workspace, despite an accessibility set-value request appearing successful. Actual original: C:\Users\unn0w\Downloads\Management Project\Premiere Audio Routing Integrity Doctor\reports\beta-20261004\audio-preflight-2026-10-26T18-28-07-970Z.json. It was copied unchanged into this checkout; the additional original was left untouched. Subsequent exports were verified in this checkout. No existing project or report was overwritten.

## Remaining native procedure

1. Independently exercise review selection and scan-local reset using the actual native dropdown, retaining annotated export evidence. Current automation popup targeting is not a product failure verdict.
2. Use a disposable sufficiently large fixture to exercise cancellation and overlap while a scan is observably active. Record cancellation/retry, one-in-flight behavior, and layout changes during the scan.
3. Exercise failure recovery and keyboard focus in both layouts; include long names, short docked height, locale/scaling variants and project switching.
4. Keep customer installation and larger F01-F11 fixture qualification separate. Record exact runtime receipt and native results; never substitute the controlled test passes for these native checks.

No commit, push, merge, release, installation, production project edit or canonical WBS edit was performed. The panel is left docked in the disposable copy.

## Native lifecycle follow-up

The UDT console executed `reports/panel-layout-20261027/native-ui-harness.js` against the actual loaded panel, first docked and then floating. There were no mocks, host setters, altered runtime sources or delayed fake host calls. The harness drives programmatic UXP DOM events rather than physical mouse input. Both runs passed all 13 assertions, retained in the original native-saved `native-ui-lifecycle.json` (SHA256 `9deb08f3fa0167d11222e940b905df8876ba14023e34747fdbaafbb501c84395`).

The cancelled observations have project=null: these runs qualify immediate cancellation at the adapter's initial checkpoint, before project acquisition. They do not qualify cancellation partway through a large inventory. After cancellation, actual native host retry traversals completed with COMPLETE diagnostic status in 33 ms docked and 40 ms floating. Both new reports have empty annotations and an Unreviewed selector. Native annotation change persisted risk:0=intentional before those scans. Both raw-evidence toggle assertions passed.

The first harness used `.click()` and incorrectly assumed synchronous handler execution; its busy-state assertion failed while annotation checks passed. That attempt is retained in the same evidence file and `native-ui-attempt1-console.txt`. The revised harness uses `dispatchEvent(new Event('click'))` to observe state within the same event turn. Both delivered synthetic click events are counted, bypassing disabled hit-testing intentionally. Stable busy state plus one cancellation envelope was observed; actual adapter invocation count was not instrumented. This evidence complements the existing controlled single-flight regression, rather than proving physical double-click timing by itself.

Remaining checks are physical popup/rapid-click interaction, mid-inventory cancellation and large-project responsiveness, deliberate native write-failure recovery, project switching/reopen, and customer installation. No new implementation defect was established by these bounded checks. The disposable project file hash remains unchanged. At the end of this follow-up the panel is floating and idle, the review state is reset, and the harness's temporary event listener has been removed. Test records remain only in the debugger's memory and saved evidence.

## Larger inventory stress test: latest result

The preceding small-fixture qualification is preserved. This section supersedes its pending mid-inventory cancellation result and its last-known host state.

No larger ready-made fixture was found. The separate setup helper `reports/panel-layout-20261027/create-large-fixture.js` used documented Adobe Project.saveAs, lockedAccess/executeTransaction, and Sequence.createCloneAction to create and save **Large_Inventory_Test.prproj**. All setup mutations were confined to that new disposable project. Its original source, Layout_Test_Copy.prproj, remains byte-identical to the earlier SHA256. The production scanner and staged runtime were not edited.

The first setup guard stopped without mutations because Premiere returned a Windows extended-length path. The helper was corrected to normalize only that observed prefix while retaining the exact expected-path check. The new fixture has 256 sequences, 771 audio tracks, 511 clip occurrences and 2,034 inspected components. It is a repeated-template stress inventory, not a representative customer project or acoustic correctness fixture.

| Measurement | Observed result |
| --- | --- |
| Functional native harness assertions | 13/13 PASS; this does not grade overall host responsiveness |
| Mid-inventory cancel request | 101 ms after start, progress sequences 6/256 |
| Retained cancelled evidence | Six sequences; completion cancelled; diagnostic status PARTIAL; 250 sequence scopes explicitly unknown/unvisited |
| Request-to-idle time | 22 ms; total cancelled run wall time 123 ms |
| Complete retry | 256/256 sequences; COMPLETE observed coverage; zero failed reads |
| Complete retry adapter time | 4,618 ms |
| Complete retry wall time | 5,206 ms, including diagnostics/UI reporting |
| UXP timer sampling | Requested 5 ms period; observed p95 gap 2 ms, maximum gap 619 ms; one gap above 100 ms. Native timer scheduling did not match requested period exactly |
| Host responsiveness after completion | Responding=false across repeated independent process checks; native activation timed out |
| Host working set at final check | 4,247,150,592 bytes; no pre-stress memory baseline was recorded |
| Docked and repeated performance trials | BLOCKED by persistent host stall; not executed |

**Overall: cancellation correctness passed for this inventory; large-project responsiveness has not passed.** A console-level PASS covers only the listed functional assertions. The sustained host stall remains a material unresolved performance issue. Its cause is UNKNOWN. Unbounded synchronous report serialization and card creation in index.js render() are investigation candidates, not a demonstrated root cause; the 619 ms timer gap alone cannot explain the longer host stall or assign blame.

Measurements used actual native host reads and programmatic DOM cancel events, without scanner stubs or injected scan delays. Evidence: `large-inventory-native.json` (32,185,254 bytes; SHA256 `2d5563f04013bb33fccf0e0935749fee16b0fce1597e1037a51a5aa002866267`), `large-inventory-summary.json`, `large-host-state.json`, setup/measurement helper sources, and retained console text. The large fixture SHA256 is `850a5354a3248815974526de640e2b040b927505ec7d5895c0be10b3fa046249`.

Because the host picker could not be relied on during the stall, the UDT console wrote evidence using Adobe's documented plugin data-folder API. The native original is at `C:\Users\unn0w\AppData\Roaming\Adobe\UXP\PluginsStorage\PPRO\26\Developer\com.unn0wn002.audio-preflight.beta\PluginData\arid-large-inventory-1793067882786.json`; it was copied unchanged to this checkout. Both remain local; no upload occurred.

The host was left running with the saved disposable stress project. No forced termination, source-fixture overwrite, runtime patch, commit, push or release occurred. Before another trial, recover the host and separate adapter-only traversal from panel report rendering. A minimal follow-up investigation would instrument report construction/render timing and bound visible finding cards plus raw-evidence serialization, then repeat this exact fixture and confirm report/export integrity.

## Host recovery after stress test

The preceding left-running state is historical. On the authorized recovery attempt, normal close timed out. The exact stalled Premiere process was verified by executable path, nonresponsive state and disposable stress-project window title before terminating it. Premiere was restarted and observed at Home; the crash-recovery Reopen action was not selected. The new process reported Responding=true and a working set of 1,897,799,680 bytes. Evidence: recovery-process-before.json and recovery-process-after.json. This restores the test host; it does not resolve or qualify the stress-test performance issue. No runtime patch, commit, push or release was made.


## Reopen isolation: no scan initiated

After the responsive restart, the existing UDT registration was loaded and its debugger opened. The saved Large_Inventory_Test fixture was opened from Premiere Home without pressing Scan or submitting any debugger code. Premiere displayed the project workspace but reported Responding=false in three process observations (CPU 68.28, 92.98 and 123.63 seconds; working set approximately 2.62 GB). Debugger activation also timed out, so no adapter-only traversal, diagnosis or panel-render timing could be collected. The fixture hash remained 850A5354A3248815974526DE640E2B040B927505EC7D5895C0BE10B3FA046249.

This reproduces nonresponsiveness before a new scan/report render; it does not establish a host-only cause because the plugin remained loaded. Eager render remains an unproven candidate for the earlier run. Evidence: reopen-without-scan-process.json and reopen-without-scan-process-final.json. Stop repeated scan attempts on this fixture. The next discriminating control is opening it with the plugin unloaded, then a smaller independent fixture if necessary. The exact nonresponsive process was terminated again with executable, window-title and responsiveness guards, preserving the saved project.


## Unloaded-plugin control

After another clean restart, UDT showed both Audio Preflight registrations Not loaded (unloaded-control-udt.txt). Opening the same saved fixture without loading either registration reproduced Responding=false, before any scan or report rendering. Independent process snapshots are unloaded-control-process.json and unloaded-control-process-final.json. The small source and large disposable project hashes were unchanged. This establishes that the reproduced opening stall does not require this developer-loaded plugin; the exact fixture/host cause remains UNKNOWN. It does not prove that panel rendering has no performance cost or qualify large-project responsiveness. Adapter-only traversal and repeated panel stress trials remain BLOCKED until a fixture opens responsively without the plugin. No further retries on this fixture were attempted. The exact stalled process was recovered with the same guards.


Final recovery verified Premiere Home with no active project and Responding=true (PID 22676, working set 1,980,837,888 bytes); see isolation-final-recovery.json. No fixture was reopened after this final recovery. Existing small-fixture passes remain bounded; large-fixture performance qualification stays BLOCKED.


## Smaller fixture reopen control

A later live check found Premiere and UDT closed. Premiere was launched without launching UDT or loading the developer plugin. Opening the existing smaller four-sequence Layout_Test_Copy from Home reproduced Responding=false in two observations separated by at least 20 seconds (CPU 62.28 then 97.13 seconds). No scan was started. The project SHA256 remained F243358DE98EB0024A0364EB6F8A90A7D8EF1B5250DB2169AE2EC1D973E82A8E. Evidence: small-reopen-unloaded-process.json and small-reopen-unloaded-process-final.json. This is a smaller control from the same fixture family, not an independent media/fixture provenance control. Earlier small-fixture native passes are historical bounded observations; this current reopen does not pass. The failure is not confined to the large clone inventory; exact host/fixture/shared-workspace cause remains UNKNOWN. Panel and adapter retesting are BLOCKED by project-open responsiveness. No preference, cache, workspace, driver or project-content changes were attempted. The exact stalled process was terminated only after executable/path, window-title and nonresponsive guards matched.


The recovery launch reopened Layout_Test_Copy without a new Open input and again reported Responding=false (small-control-recovery.json). The reopening mechanism is UNKNOWN. To stop the repeat cycle, the verified stalled process was terminated with executable, title and responsiveness guards. No further relaunch was attempted. Further native validation requires a responsive host session opening an independent blank/disposable project. Saved fixture contents remain unchanged.


## User-opened session: current responsive control

The user manually opened Premiere with Layout_Test_Copy and authorized testing that existing session. Live inspection showed its timeline and populated Learn panel; process PID 21192 reported Responding=true. No project was opened or relaunched by automation in this control. This is a current responsive counterexample to the earlier failed opening attempts and leaves their cause unresolved. Loading the existing beta registration through UDT failed with: No applications are connected to the service. Thus no new scan ran. Evidence: user-open-session-udt-error.txt and user-open-session-process.json. The working session was preserved and returned to foreground; no restart, project mutation or preference changes were performed.


## Reconnected existing session: beta scan

After the user restored the UXP connection, live UDT showed the prototype loaded. It was unloaded and the beta registration com.unn0wn002.audio-preflight.beta loaded successfully; UDT reported validation and load success in Premiere 26.5.2. A native click on Scan active project in the floating beta panel completed in 33 ms, with diagnostic status COMPLETE, two review findings and three unknowns. The existing Layout_Test_Copy session was preserved without reopening it. Post-scan process state and unchanged fixture hash are recorded in reconnected-native-scan.json. This is visible native panel evidence, not a new full JSON export or large-project qualification. Earlier UDT connection failure is superseded for this session; the prior project-open stall cause remains UNKNOWN.


## Reconnected session: findings and report exports

Both native panel exports succeeded through Save As into fresh reconnected-report.json and reconnected-report.html. JSON parsing passed; all five risk/unknown rule IDs appear in HTML; decoded embedded HTML raw evidence deep-equals the exported JSON (reconnected-export-validation.json). Findings: ARID-002 Audio 1 muted with clips; ARID-003 disabled Audio 2 clip stereo-l440-r880.wav at 3.003-6.006 seconds. Neither state was changed or annotated as intentional. Unknowns remain output-bus topology, source-channel mapping and end-to-end playback/export correctness. Premiere PID 37304 remained Responding=true; source fixture hash unchanged. Export controls returned available after each save. This validates export content and native save completion; no new browser visual-render qualification or large-project pass is claimed.


## Manual audio UI inspection

For the active stereo-l440-r880 sequence only, native Audio Track Mixer showed Audio 1, 2 and 3 outputs set to Mix, all displayed pan values centered 0.0, and Audio 1 mute active. Playback advanced from start through sampled timecodes to the six-second end and stopped; sampled mixer frames showed no visible signal. No audio capture/listening evidence or rendered-audio analysis was available, so playback/export correctness is NOT VERIFIED.

Modify > Audio Channels for the selected stereo WAV source showed Custom, Stereo, one audio clip, with both clip L and clip R mapped to media source Left; media source Right unchecked in both rows. Intent is UNKNOWN; this is a manual review observation, not a newly implemented scanner detection. The dialog was canceled without applying changes. Scanner U01/U02/U03 remain unchanged and do not become global PASS from this bounded inspection. Evidence: manual-audio-inspection.json. No mute, enable, routing, mapping or project file edits were made. Mixer panel was opened and restored from maximized view; plugin panel was hidden to expose mixer controls.


## WAV export attempt

Native Export workspace opened for stereo-l440-r880, Entire Source, displayed six-second duration and 48 kHz stereo source. Format remained H.264: input to the open format popup dismissed it instead of changing selection (scroll and End key attempts). Accessible tree did not expose a selectable format value. No export was started and no WAV or audio analysis was produced. Host remains responsive; project hash unchanged. Evidence: wav-export-attempt.json. Required handoff: manually select Format > Waveform Audio and leave export settings open. Do not treat this attempted export as an audio PASS.


## Native WAV render and sample analysis

The user selected Waveform Audio after the format-popup automation blocker. Settings were verified as Entire Source, 48 kHz stereo 16-bit. Native Export rendered the active stereo-l440-r880 sequence to fresh active-sequence-baseline.wav and Premiere displayed export success. Every RIFF PCM sample was examined: 288,288 frames, 6.006 seconds, two channels, both exactly digital zero (peak and RMS negative infinity dBFS; zero nonzero or clipped samples). The WAV SHA256 is 55a3281e8a38c54bbcde0be843c4664f510bcf3c49167745b88c91b8f93e395d. Analysis: wav-signal-analysis.json.

This verifies a native rendered silent file for the unchanged current audio states. It is consistent with the muted Audio 1 and disabled Audio 2 clip, but a silent output cannot qualify channel separation, correct intended source mapping, loudspeaker playback or a general routing PASS. No positive-signal control was performed. Project file SHA256 remained F243358DE98EB0024A0364EB6F8A90A7D8EF1B5250DB2169AE2EC1D973E82A8E; Premiere remained responsive. No audio-state or project edits were made. Export settings/output filename were changed for this authorized local test.


## Extended positive-signal and lifecycle validation

See reports/panel-layout-20261027/EXTENDED_VALIDATION.md and extended-validation-summary.json. A new native Save As project preserved the original fixture. Test-only unmute/enable/mapping changes produced signal; first export exposed the existing clip Balance 100.0 hard-right, confirmed in Effect Controls. A separate centered export passed rendered Left 440 Hz / Right 880 Hz checks in both one-second interior windows, with no clipping. The hard-right output and its REVIEW result remain preserved. Native programmatic lifecycle harness passed 20/20 assertions, with scans 43/38/36 ms and retry 41 ms. Visible panel reopened, retained results across floating-to-docked drag, and a physical docked scan passed at 34 ms, zero risks, three capability unknowns. Local report HTML raw evidence deep-equals native retry JSON. Original project hash unchanged; saved positive project and responsive host left open. This bounded result does not resolve the earlier large-fixture stall, grant scanner mapping/playback capabilities, verify speakers or qualify customer installation.


## Latest large-fixture investigation: stall not reproduced

The unchanged large fixture opened successfully within the existing responsive PID 37304 session, with both UDT registrations unloaded first. Adapter-only/report timing then passed with host responsive: adapter 4,286 ms, diagnostics 61 ms, JSON 61 ms, HTML 151 ms. Native panel cancellation/full-retry recheck passed 13/13 assertions, cancellation-to-idle 25 ms, full retry wall 5,055 ms, max sampled UXP gap 599 ms. Diagnostics deep-equal adapter-only results. A separate direct docked Scan completed in 4,691 ms; host remained responsive. Both large and positive fixture hashes unchanged. Earlier nonresponse evidence remains historical and unresolved; do not claim a root-cause fix or broad responsiveness PASS. The previous repeat-trial blocker did not apply in this established responsive session. Full interpretation and smallest proposed performance patch are in reports/panel-layout-20261027/LARGE_STALL_INVESTIGATION.md; machine results in large-recheck-summary.json. No runtime patch, restart or host recovery was required.

## Implemented finding pagination and lazy raw evidence

The subsequent authorized working-tree patch renders 25 findings per page and serializes raw JSON on demand while preserving complete reports and exports. New developer runtime identity is `48bb1d177f4cb8ec4b8e90ff4d23fe618baec155a814db80f7b19e5d9096b28f`; the previous stage remains preserved. Controlled tests passed 56/56, fixtures 6/6 and syntax checks passed. Actual-host floating-panel harness passed 47/47 assertions on 765 findings across 31 pages, including annotation retention, cancellation and retry. Three scan wall times were 4,575/4,512/4,425 ms, with maximum sampled UXP gaps 114/106/107 ms, compared with the earlier unpaged 599 ms observation. Full native JSON and HTML exports agree with the complete report. Physical docked page navigation, undocking and redocking passed; the attempted floating resize did not take effect and adds no size-coverage claim. Fixture hashes are unchanged and Premiere remains responsive. The earlier opening stall root cause and three capability unknowns remain unresolved. Details and limits: `reports/panel-layout-20261027/PAGINATION_VALIDATION.md`; machine summary: `pagination-summary.json` in the same folder.

## Follow-up: wide floating layout and matching CCX

A later physical right-edge drag successfully widened the floating panel to approximately 800 px. Controls reflowed, native scrolling exposed findings, physical Next moved to page 2, and a fresh physical Scan completed in 4,286 ms with unchanged complete coverage and 506 review findings / three unknowns. Results survived redocking. This adds bounded wider-floating coverage; attempted height changes did not take effect. UDT generated a separate CCX for runtime `48bb1d177f4c`; independent archive verification passed all seven files, with manifest formatting allowed. CCX SHA256: `15026dd9df78c2437ab0e295a6d62c7df5f0276486ba130981c68dc9876662f5`. Installation was not launched and remains unverified; the current desktop is not a demonstrated clean customer profile. Details, package path and exact operator handoff: `reports/panel-layout-20261027/FLOATING_AND_PACKAGE_FOLLOWUP.md`; machine evidence: `floating-package-followup.json` and `current-ccx-verification.json` in the same folder. No runtime or fixture edits were made.

## 28 October: installed candidate verified; project-open test blocked

The user supplied Creative Cloud's successful installation confirmation for 0.2.1, superseding the earlier timeout attempt for this candidate. Independently inspected installed directory `%APPDATA%/Adobe/UXP/Plugins/External/com.unn0wn002.audio-preflight.beta_0.2.1`: six runtime files match the current receipt exactly and parsed manifest values match, binding it to `48bb1d177f4c`. With UDT not launched, a fresh Premiere session exposed Window > UXP Plugins > Audio Preflight - Private Beta and opened the native floating panel. Physical no-project scan returned explicit UNKNOWN, zero review findings, four unknowns, 7 ms, and recovered controls. These are current installed-runtime observations in the existing development profile; they do not establish a clean customer profile, upgrade or uninstall/reinstall.

Opening the unchanged disposable Positive_Signal_Test through the native file picker produced a partially blank workspace and Responding=false in PID 18076. A second process/screenshot check after at least 20 seconds remained nonresponsive. No project scan ran, and no restart, termination or preference change was attempted. Fixture SHA256 remained `6403c37515e1a96ff6e34b049e5845f21ba2d692e3bf2a8202d51737facf7012`. Cause remains UNKNOWN; installed project lifecycle is BLOCKED_PROJECT_OPEN_NONRESPONSE, not PASS. Evidence: `reports/panel-layout-20261027/installed-runtime-verification-20261028.json`. Operator handoff: recover/open Premiere normally and leave a responsive disposable project available before continuing native project scans.


## 28 October: installed scans in the user-opened responsive session

The user opened Positive_Signal_Test normally. With UDT absent, the installed panel opened through Window > UXP Plugins and physical docked/floating scans completed in 36/32 ms, complete 4-sequence / 15-track / 7-clip / 18-component coverage, zero review findings and three unknowns. Results survived undocking and redocking. Native JSON export was not completed: an automation focus mismatch sent filename keystrokes to the parent host instead of its separate Save As window, causing unsaved fixture changes. The actual picker was cancelled and controls recovered. Native File > Revert discarded only those automation-induced changes; the edit marker cleared and saved timeline reappeared. Premiere then remained nonresponsive through a further 20-second check. Saved fixture hash is unchanged. No scan-attributable mutation, exported-report PASS or broad lifecycle PASS is inferred. Detailed incident and bounded results: reports/panel-layout-20261027/installed-fixture-followup-20261028.json. No further reload/restart retries were attempted.

## 28 October: user native installed exports validated

The user saved installed-test.json and installed-test.html from the installed panel. Independent file checks verified a completed 29 ms scan on Positive_Signal_Test.prproj in Premiere 26.5.2 / UXP 9.3-local / plugin 0.2.1: COMPLETE coverage of 4 sequences, 15 tracks, 7 clips and 18 components, zero failed reads, zero review findings, four informational findings and three expected capability unknowns. Decoded HTML raw evidence deep-equals JSON; the full HTML exactly matches the report renderer and contains all seven finding articles. Installed runtime files still match identity 48bb1d177f4c (manifest values equivalent). Native export completion is user-performed evidence; file contents were verified this session. PID 11556 is responsive on the fixture; its saved SHA256 remains unchanged. This supersedes prior export NOT_VERIFIED only for these fresh exports. Clean-profile installation, upgrade, uninstall/reinstall, full lifecycle and earlier opening/reload nonresponse remain separate unqualified checks. Evidence: reports/panel-layout-20261027/installed-export-validation-20261028.json.

## 28 October: independent empty-project reload control

Read-only fixture audits passed gzip/XML parsing and all three unique source WAV paths exist. A freshly created native empty project (no template/media/sequences) was closed and reopened once through File > Open Recent with Audio Preflight idle and the original audio project still loaded. Menu interaction and Responding=true passed. Control and original fixture hashes are unchanged; user JSON/HTML exports retain their validated hashes. Home fallback/container errors occur equally in two earlier failure logs and the 27 October session that completed native tests, so they do not isolate the cause. Current panel code has no automatic project-load scan. Original project/bin view restored without an edit marker; PID 11556 responsive. This warm multi-project control does not qualify cold opening or Revert and does not establish the earlier freeze root cause. No application/runtime/preference/cache changes or further failing-fixture reloads were performed. Details and next evidence needed: reports/panel-layout-20261027/RELOAD_INVESTIGATION_20261028.md; machine summary: reload-investigation-summary-20261028.json.

## 28 October: close/reopen hang reproduced and captured

One subsequent guarded trial closed the saved sole active Positive_Signal_Test project and reopened it through native File > Open Recent with the installed panel idle and UDT absent. The saved timeline became visible, then Premiere PID 11556 showed Not Responding with repeated process checks false. Microsoft-signed ProcDump 12.02 captured one local 201,778,984-byte mini dump, completed at 12:44:51 WIB, and exited. MDMP structure, AMD64 PID 11556, stream bounds, 340 modules and 198 thread contexts were verified; SHA256 is a4d00b0ba45ceb2e2642913f0d99dcbaac69ad8ca656f52bd6ddf7d62cd33b21. No new scan or export ran. Symbolized stack analysis has not run and root cause remains UNKNOWN.

After capture, the still-stalled exact process was terminated under executable/title/no-edit-marker/nonresponse/unchanged-fixture guards, then Premiere was relaunched without a project-opening input. New PID 38540 reports Responding=true. Home UI inspection failed twice with "foreground window did not report a process id"; further app input stopped, so recovery is verified only at process level. Capture monitor exited. Four fixture hashes and both user export hashes remain unchanged; installed runtime still matches 48bb1d177f4c. No source implementation or preference/cache edits were made. Details: reports/panel-layout-20261027/HANG_CAPTURE_20261028.md; machine summary: hang-capture-summary-20261028.json. Earlier records are historical observations, not final host state. Next evidence is native stack analysis of this saved dump, not a speculative fix or repeated opening trial.

## 28 October: native stack analysis completed

Locally extracted Microsoft-signed CDB 10.0.29661.1004 analyzed the saved dump only. Final symbol-assisted analysis, cached stack inspection and Windows symbol verification each exited 0; all 198 thread stacks were parsed. Windows PDBs for ntdll/UIAutomationCore/oleacc/user32 verified; Adobe symbols remain exports only. !analyze -hang classified APPLICATION_HANG_BusyHang_cfffffff_Adobe_Premiere_Pro.exe!Unknown at offset 0x176ffb9e. Thread 0/TID 31364 contains the host message loop and UIAutomationCore proxy/event handling through oleacc AccessibleObjectFromWindowTimeout into repeated Adobe native frames. Threads 99 and 182 contain accessibility SendMessageTimeoutW paths. The three explicitly named UXP threads are waiting in the snapshot; this does not prove plugin innocence or all UXP inactivity. Large nearest-export offsets do not identify Adobe's actual internal function. The accessibility caller, exact defect and root-cause fix remain UNKNOWN. Earlier offline WRONG_SYMBOLS output is preserved but excluded from conclusions.

The next prepared control is operator-driven reopening of the unchanged disposable project without new automated accessibility inspection during opening, with process-only observations and operator confirmation. It was not run during this analysis. No source/runtime/host-setting changes or live debug attach occurred; current Premiere PID 38540 remains responsive in process checks. Details: reports/panel-layout-20261027/NATIVE_HANG_ANALYSIS_20261028.md; machine findings: hang-capture-20261028/native-analysis-summary.json. This supersedes analysis-NOT_RUN/debugger-unavailable only for the preserved dump; broad lifecycle qualification remains incomplete.

## 28 October: user manual opening report and measured recovery

The user reports first opening and reopening each initially froze, then recovered after an unspecified delay, with visible timeline, responsive File menu and visible Audio Preflight panel. Fan speed increase is user observed, not measured. The user confirmed choosing Save at the prompt. Positive_Signal_Test now hashes to 7bfc2f703ec78c5592f4150986a4635270feb6e197806f11d02d61f478d723ec; a verified separate copy of this user-saved version was preserved. Its gzip/XML container parses successfully. This is not the unchanged saved-fixture control; semantic changes are not established and the assistant did not restore the earlier version.

Subsequent process-only samples of PID 46156 returned nonresponsive seven times over 30.13 seconds, adding 30.77 seconds CPU time. Before an additional capture could start, the process recovered and the guard skipped ProcDump. No second dump or termination occurred. Four later samples over 15.09 seconds all reported responsive, adding only 0.47 CPU seconds. No computer-use/UI inspection calls or host-setting changes were made in this follow-up. These samples start after the user report and do not measure the opening delay. Recovery is independently verified; same-cause attribution to the earlier dump and broad lifecycle PASS remain unproven. Details: reports/panel-layout-20261027/MANUAL_REOPEN_CONTROL_20261028.md; machine record: manual-control-20261028/manual-control-result.json.

## 28 October: requested post-load scan blocked before input

A later current host process PID 34960 reports Responding=true and title Adobe Premiere. The saved project still matches the preserved user-saved snapshot 7bfc2f703ec78c5592f4150986a4635270feb6e197806f11d02d61f478d723ec. Computer-use window selection returned one Premiere window, but screenshot-only inspection failed with "foreground window did not report a process id". Fresh window selection followed by an activation/inspection retry failed with the same error. Per the computer-use recovery guidance, further app input stopped. No scan button was clicked, no project was opened by the assistant, and no new native scan result is claimed. Current active-project/panel state is unverified. Evidence: reports/panel-layout-20261027/postload-scan-attempt-20261028.json. The remaining operator step is one manual Scan active project on the saved fixture and fresh completion evidence; prior scan results are historical and do not satisfy this new attempt.

## 28 October: manual post-load scan shown complete

The user supplied a new native screenshot in response to the manual scan handoff. Visual content verified this session: docked Audio Preflight on Positive_Signal_Test.prproj, diagnostic status COMPLETE, reported scan duration 37 ms, zero review findings and three capability unknowns. Coverage displayed complete: 4/4 sequences, 15/15 tracks, 7/7 clips and 18/18 components. Mapping, output buses and playback/export correctness remain UNKNOWN. The screenshot displays Premiere 26.5.2, UXP 9.3.0-local, plugin 0.2.1 and locale en_US. This is user-supplied native screenshot evidence; execution was not observed live and no computer-use calls were made this turn.

The screenshot was preserved as reports/panel-layout-20261027/postload-manual-scan-20261028.png, SHA256 2122d9ab929b7550f00cb435a18c27fd06f171dd8497744c625bc44720de3866. Machine evidence: postload-manual-scan-20261028.json; aggregate key postLoadManualScan. Current saved fixture still matches the preserved user-saved version 7bfc2f703ec7. Independent installed file checks still match receipt 48bb1d177f4c (manifest values equivalent); screenshot version alone does not identify the loaded runtime path. This satisfies the bounded manual scan completion evidence requested after the automation failure. It does not resolve the helper error, qualify project-opening reliability or verify fresh JSON/HTML contents. The displayed 37 ms measures scanning, not the preceding loading delay. A fresh export pair would be the next evidence for full report comparison.

## 28 October: fresh manual scan exports independently verified

The user confirmed exporting the completed 37 ms scan. Fresh files audio-preflight-2026-10-28T13-37-12-486Z.json (136,908 bytes; SHA256 4e51efc297ad9e4555e2699fcff9d3f0a04822e888a84e05807528a1d68187c4) and the matching .html (170,614 bytes; SHA256 2ee217e1286b3ee01a7ab6adc90ea8d1f951a873074256c42bfe14c5546ce2d4) were verified from disk. JSON parsing passed. Decoded HTML raw evidence deep-equals JSON, the full HTML exactly matches the complete report renderer, all seven finding articles/rule IDs are present, and diagnostics reproduce exactly from the exported observations. Contents agree with the screenshot: COMPLETE traversal and inventory, 4/4 sequences, 15/15 tracks, 7/7 clips, 18/18 components, zero failed reads, zero review findings, four information findings and three capability unknowns (ARID-U01/U02/U03). Annotations are empty.

The fresh report deep-equals the earlier installed-test.json after excluding only observation.generatedAt and observation.durationMs. This comparison covers exported observations/diagnostics, not all native project semantics. Current saved project still hashes to 7bfc2f703ec7; installed files still match receipt 48bb1d177f4c with equivalent manifest values. No computer-use input or new scan was performed by the assistant during verification. The bounded manual scan/export check is complete; the previous fresh-export-NOT_VERIFIED limit is superseded for this pair. Browser visual-render QA, project-opening delay, broad lifecycle reliability and routing/mapping/playback capability unknowns remain separate. Reproducible verifier: reports/panel-layout-20261027/validate-postload-exports.cjs; machine evidence: postload-export-validation-20261028.json; aggregate key postLoadExportValidation.


## 28 October: accessibility caller trace preparation

Continued caller investigation found the UIAutomationCore ETW provider registered. Targeted timeout/performance trace start failed with Access is denied; no trace ran. The prepared 180-second, 32 MB local capture script passed PowerShell parsing and requires manual administrator execution and an operator project-reopen trial. No settings, caches, installed runtime or project files were changed. Provider registration and a similar Adobe forum report do not prove caller identity or a fix. Status remains unresolved. Details: reports/panel-layout-20261027/accessibility-trace-20261028/INVESTIGATION_STATUS.md.


## 28 October: accessibility request client identified and detached

The operator captured a full app restart. ETW records 879 client requests from computer-use helper PID 28268 to new Premiere PID 16356; 871 matched method Start/Stop pairs include seven about 65 seconds long. Provider task/opcode definitions were verified. Trace lost 68,443 events, so incomplete pairs are not failure evidence. The original sampler watched old PID 34960 and cannot time new-host responsiveness. The identified helper was stopped under executable/start-time guards; Premiere remained responsive and no user project/settings/runtime were altered. This is a candidate mitigation, not a verified resolution. Updated v2 capture tracks replacement PIDs and helper presence with larger trace buffers. Operator restart/open comparison remains required, without reconnecting desktop automation. Evidence: reports/panel-layout-20261027/accessibility-trace-20261028/20261028-205631/FINDINGS.md and findings-summary.json.


## 28 October: helper-off comparison completed

Capture 20261028-210730 followed the restarted Premiere PID 40980. Helper absent in all 36 samples; all 34 new-host samples responsive; no ETW client-call/request-written records; 50 Premiere callback pairs within 1 ms at analysis resolution. Tracerpt reports 8,202 events and zero lost. Saved fixture unchanged. The operator initially reported the freeze remained, then clarified under 10 seconds followed by recovery. The helper-associated 65-second requests are absent in this bounded comparison, supporting keeping desktop automation disconnected during opening. The remaining short loading delay is not diagnosed or declared normal; process responsiveness does not substitute for UI usability. No universal fix or full lifecycle PASS is claimed. Details: reports/panel-layout-20261027/accessibility-trace-20261028/20261028-210730/COMPARISON.md and comparison-summary.json.


## 28 October: residual short opening delay profiling prepared

The residual user-reported sub-10-second delay remains undiagnosed. Current host PID 40980 is responsive in process metadata and computer-use remains disconnected. WPR reports no active recording; CPU (with sampled/context-switch stacks), DiskIO and FileIO built-in profiles are available. A 60-second capture script passed PowerShell parsing and awaits manual administrator execution. It requires Premiere already at Home and a single warm project opening, separates app startup from project loading, records timestamps/project hashes and avoids changes to existing recording sessions. No new capture ran. Script: reports/panel-layout-20261027/accessibility-trace-20261028/Capture-PremiereOpenPerformance.ps1. WPR/tracerpt are present; richer stack analysis tooling may be needed after capture. No project/runtime/settings changes were made.


## 28 October: warm opening measured at 2–4 seconds

The user supplied a successful CPU/DiskIO/FileIO trace and measured 2–4 seconds until usable. All 59 process samples have helper absent, one Premiere PID 21080; 6.625 CPU-seconds over 59.673 seconds with a brief opening burst. Tracerpt: 10,419,164 events, zero lost. Targeted kernel analysis paired 2,896 target read/write operations with completion; longest 8.656 ms, no tracked pending read/write at end. About 24.38 MB of requested basename traffic is Lumetri presets; workspace data also appears. This is consistent with resource initialization but does not attribute the entire delay or exclude other wait types. Project unchanged; no runtime/preferences/cache edits. Keep desktop automation disconnected during opening as a bounded mitigation for earlier minute-long helper calls. Remaining short latency is not assigned a defect or declared eliminated; no patch is justified by this trace. Details: reports/panel-layout-20261027/accessibility-trace-20261028/performance-20261028-212121/FINDINGS.md and performance-summary.json.
# Layout refresh final checkpoint — 28 October 2026

Post-restart 22:31 WIB update: final candidate `037571056922` completed a 42 ms docked scan with full listed observation coverage and zero failed reads. Native JSON/HTML pair independently matches renderer/diagnostics; see `layout-final-export-validation-20261028.json`. Docked raw textarea rendered and collapsed correctly. No repeat automated docking drag; earlier crash cause unresolved, manual helper-off baseline pending. Older statements below retain their time-bound meanings.

Current runtime `037571056922`: 58 controlled tests and six synthetic fixtures pass; seven-file developer archive verified. Native floating scan 39 ms and read-only raw-evidence textarea scrolling/wrapping succeeded. This replaces the overlapping preformatted raw-text display observed in the initial layout candidate. Premiere exited during the next docking gesture; refreshed window/process inspection found the crash reporter and no main Premiere process. Cause UNKNOWN; final docking, wider-floating, export and lifecycle qualification remain incomplete. No crash report was submitted or host restarted.

Disconnecting the helper during the earlier opening stall allowed recovery; reconnecting after settling enabled initial layout candidate `9b0796ebae7a` docked/floating scans (36/32 ms) and independently matching native JSON/HTML. These are specifically bound to that earlier identity. Saved Positive_Signal_Test SHA256 remains `7bfc2f703ec78c5592f4150986a4635270feb6e197806f11d02d61f478d723ec`. See [final layout checkpoint](LAYOUT_REFRESH_20261028.md) and `reports/panel-layout-20261027/layout-refresh-validation-20261028.json`. Earlier dated records below retain their original identities and qualification limits.
