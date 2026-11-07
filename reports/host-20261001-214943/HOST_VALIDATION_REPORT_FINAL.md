# Independent host validation — final continuation record

Friday, 2 October 2026 at 06:58:59 GMT+7; 2026-10-01T23:58:59.735Z; Asia/Jakarta UTC+07:00.

HOST TEST VERDICT: PARTIAL. Stage PROTOTYPE IN PROGRESS. LOCAL ONLY / NOT PUSHED.

This record supersedes the earlier interim all-fixtures-blocked conclusion, retained in INTERIM_SUPERSEDED-HOST_VALIDATION_REPORT.md and INTERIM_SUPERSEDED-host-results.json. The first project-creation pause recovered naturally. F01-F07 subsequently ran. A separate reopen pause also recovered naturally; both pause causes are UNVERIFIED. No forced termination or source repair was performed.

## Identity and static acceptance

Workspace C:\Users\unn0w\Downloads\Management Project\Premiere Audio Routing Integrity Doctor. Canonical origin Unn0wn002/Premiere-Audio-Routing-Integrity-Doctor; main/base cc7adbbe805767924812f32cb6bbe6e87bb2f851. Candidate 28c4c5f401358c1751f7f43280bd38e19740ddd74f293c3daade664d4192dac8 VERIFIED before and after, all14 receipt application/config/test input hashes match. Twelve documentation inputs separately rechecked. Original DOCX unchanged. September28 uncommitted work NOT RECOVERED. Pre-existing tracked/untracked application changes preserved. This session adds only evidence/scripts and disposable fixture assets/projects. Exact commands, cwd, stdout/stderr, exit codes and final Git inventory: identity-before.json, identity-after-final.json.

Independently rerun before host testing: node --test tests/*.test.js:20 passed,0 failed/cancelled/skipped/todo; node tests/evaluate-fixtures.js:6/6; node tests/check-syntax.js:8 explicit files; git diff --check and git diff --cached --check:exit0. Logs unit.json, fixtures.json, syntax.json, diff-check.json, cached-diff-check.json. Direct Node equivalents used because npm.cmd unavailable. No acceptance tests changed. Final diff checks recorded again in identity-after-final.json. Existing docs/fixture statuses are historical, not current host conclusions.

## Host environment and loading

Windows11Pro kernel10.0.26300. Premiere26.5.2 Build5 (26.5 target family), UI en_US; UXP uxp-9.3.0-local from actual report. UDT executable2.3.0.5; manifest public premierepro minimum26.5.0. Exact root manifest loaded via supported UDT workflow. Initial no-connected-app error preserved. Empty Premiere session safely restarted after normal Plugins > Enable developer mode setting; no application-wide audio preferences changed. UXP LOAD HOST VERIFIED (uxp-load-success.jpg/.json). Environment/About evidence ../host-20261001-213604/environment.json and premiere-about.jpg. No production project used. English locale only; Japanese locale NOT RUN. Developer console initial No Issues; no distinct load warning observed. Complete console history not exported, so absence of every warning UNVERIFIED.

## A1-A5 evidence layers

| Finding | Static | Host result / limits | Evidence |
|---|---|---|---|
| A1 completeness | STATICALLY VERIFIED | No-project failure status and scoped Unknown HOST VERIFIED; successful complete inventories observed; naturally partial path not exercised | no-project.jpg, no-project-console.json; F01/F05 raw |
| A2 isolation | STATICALLY VERIFIED | Forced synchronous/rejected/metadata failures not induced in host | unit.json |
| A3 serialization | STATICALLY VERIFIED | Real nested boolean/numeric wrappers and exact string ticks observed; arbitrary shape/exception paths remain static | F01/F07 raw |
| A4 concurrency | STATICALLY VERIFIED | Triple-click interaction completed, button recovered, correct project identity; host overlap/start count/ordering not instrumented | A4-read-only-clean-after.jpg; F11PRE raw |
| A5 locations | STATICALLY VERIFIED | Duplicate same-name occurrences HOST VERIFIED: indexes0/1, same track, correct sequence context and distinct exact ticks | F07 raw and before/after screenshots |

No active project scan produced completion failed, project null, inventory false, error No active Premiere project., scoped ARID-U-READ Unknown, no risk and enabled button. It did not display Scan complete. Four Unknown findings in that report. Raw console presentation retained; not falsely labeled byte-exact reconstructed JSON.

Real serializer example nested {value:{value:false}} with keyframe-position ticks '-91445760000000000', seconds -360000; Level0.17782793939113617. Real zero and empty display names preserved. F07 occurrence1 start '762810048000', end '1525620096000', seconds3.003/6.006; occurrence0 starts0. Indices scan-local, not persistent host IDs. UI pan -100/+100/+50 is absent from the returned Volume/ChannelVolume component chain; successful serialization does not establish pan/balance semantics or output correctness. No pan risk rule enabled.

## Fixture results

| Test | Execution | Assertion | Observability | Evidence |
|---|---|---|---|---|
| F01 | RUN | PASS | PARTIAL | F01-panel-output.raw.json; F01-before.jpg; F01-after.jpg |
| F02 | RUN | PASS | PARTIAL | F02-panel-output.raw.json; F02-before.jpg; F02-after.jpg |
| F03 | RUN | PASS | PARTIAL | F03-panel-output.raw.json; F03-before.jpg; F03-after.jpg |
| F04 | RUN | PASS | PARTIAL | F04-panel-output.raw.json; F04-before.jpg; F04-after.jpg |
| F05 | RUN | PASS | CONFIRMED | F05-panel-output.raw.json; F05-before.jpg; F05-after.jpg |
| F06 | RUN | PASS | CONFIRMED | F06-panel-output.raw.json; F06-before.jpg; F06-after.jpg |
| F07 | RUN | PASS | CONFIRMED | F07-panel-output.raw.json; F07-before.jpg; F07-after.jpg |
| F08 | BLOCKED | UNASSESSED | UNKNOWN_CANNOT_VERIFY | F08-setup-blocker.json |
| F09 | BLOCKED | UNASSESSED | UNKNOWN_CANNOT_VERIFY | F08-setup-blocker.json |
| F10 | RUN | PASS | UNKNOWN_CANNOT_VERIFY | F10-panel-output.raw.json; F10-mapping-after-scan.jpg |
| F11 | RUN | PASS | PARTIAL | F11PRE-panel-output.raw.json; F11POST-panel-output.raw.json; F11-comparison.json |

F01: Stereo2 confirmed; enabled clip, unmuted track; no ARID-001/002/003. Product routing boundaries remain Unknown.

F02: Visible clip Balance -100. Available public component chain omits UI Panner; no unsupported broken-output verdict.

F03: Visible clip Balance +100; same observability limitation; no false risk.

F04: Deliberately non-centered Balance +50; no risk solely from pan. Repository says creative hard pan; user asks non-centered pan. This session tests latter; hard extremes separately F02/F03.

F05: Only non-empty track muted; complete required inventory; ARID-001 once.

F06: A1 muted and A2 unmuted, both non-empty; ARID-002 on A1 only; no ARID-001.

F07: Second of two same-name clips on A1 disabled; ARID-003 exact occurrence1 with sequence/track/tick locator.

F08: Mix selector interaction did not establish Mono. Misnamed empty F08_Mono artifact is actually Stereo2; not acceptance evidence. Accessibility setter unavailable; corrected creation canceled.

F09: Not constructed; shared Mix selector interaction blocker. No multichannel acceptance scan.

F10: Modify Audio Channels independently set both output rows to source Left; applied to disposable matching clips. Scanner retains ARID-U02 Unknown, no risk. Mapping confirmed unchanged after scan. PASS is uncertainty handling, not mapping verification.

F11: Saved/closed/reopened disposable project. Transient host pause recovered naturally. Entire parsed before/after report identical except generatedAt; visible Balance +50 retained. Drift NOT REPRODUCED for compared fields. Mapping drift unassessed; mapping fixture created later.

PASS for F01-F04 refers to bounded configuration/no unsupported risk behavior, not full pan or routing observability. CONFIRMED F05-F07 refers to mute/enable/location rule assertions only; routing boundaries remain Unknown. Seven complete raw reports each contain three product-boundary Unknown findings (21 emitted findings, not21 distinct capabilities). F11PRE/F11POST/F10 each add three; no-project adds four. Blocked fixture outcomes are not scanner negative results. Scan wall-clock runtimes were not instrumented: UNVERIFIED; generatedAt timestamps retained per raw report. F11 comparison verifies all parsed report fields except generatedAt unchanged, with visible Balance +50 retained. This does not prove Premiere cannot exhibit drift.

Raw report JSON text recovered losslessly from read-only panel textContent queries using UTF16 hex (F01/F05/F06) or ASCII-guarded base64 (F02/F03/F04/F07/F10/F11PRE/F11POST). Length checks and JSON parse succeeded. Original console/accessibility chunks retained as independent backing; raw output not manually edited. Derived summaries in host-results-final.json explicitly separate from raw files. Reports capture project GUID5fe57359-da5b-4852-909d-c3595b59c6a5, sequence GUID06a6a407-a666-40bd-b196-ebd09a74fc7f and exact host environment.

Synthetic assets: ../host-20261001-213604 evidence assets.json and fixtures/premiere/runs/host-20261001-213604 assets. 48kHz16-bit3s mono440Hz; stereoL440/R880; four discrete220/440/660/880Hz. SHA256 respectively759763e2dbfc66aa157eac5bd26b5ad68d9d961bbd79096bc6fddee9acdde433,4d3f81af9a607482540d4ecd3d32474a9b5e2f66da3153bec4360954a65c7349,283f645ab0f64dda448bdd6fa9be01d2c4e27ee6bd2a604ff5834aacaad8a1aa. Only stereo asset imported. F10 after F11: both mapping rows intentionally use Left, saved in disposable project. F10 has no playback/export ground truth. Saved disposable project fixtures/premiere/runs/host-20261001-214943/ARID_26_5_Fixtures_214943.prproj. No production footage or project.

## Read-only integrity, metrics and decision

Compared screenshots/raw reports preserve visible track mutes, clip enabled state and pan before/after scans. Saved clean project had no dirty asterisk before/after rapid scan. HOST VERIFIED for these bounded comparisons; undo history, exhaustive parameter state and all possible mutation effects UNVERIFIED. Fixture edits/save/autosave are not scanner mutation. No unexpected scan-attributable state change observed; no HOST FAILED read-only finding.

Three evaluable positive fixtures F05/F06/F07:3 expected rule TPs,0 FN, detection3/3. Four entirely negative risk fixtures F01-F04:0 FP, false-alarm0/4. Two blocked acceptance fixtures F08-F09 unassessed, never converted to negatives. No broad product accuracy estimate. Unknown routing, mapping and audible/export capabilities are retained separately. PLAYBACK CORRECTNESS NOT VERIFIED. EXPORT CORRECTNESS NOT VERIFIED.

Disposition CONTINUE within read-only observable-state scope. Useful bounded mute/disabled-clip/location behavior has actual host evidence. This is not complete routing-graph, bus-topology, source mapping, playback or export certification, and not TECHNICALLY VALIDATED or release-ready. Next priority: establish actual Mono and Multichannel fixtures through a reliable supported host control interaction, against the same unchanged candidate. Host responsive at completion; transient Not Responding causality UNVERIFIED. Preserve project and evidence. Canonical DOCX update PENDING because safe render verification unavailable (missing soffice.exe). Corrective final continuation appended to existing WORK_LOG_APPEND_PENDING.md; history retained. All evidence LOCAL ONLY / NOT PUSHED.
