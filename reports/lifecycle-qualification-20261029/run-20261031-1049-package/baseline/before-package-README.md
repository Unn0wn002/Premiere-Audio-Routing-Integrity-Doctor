# Premiere Audio Routing Integrity Doctor

<!-- WRITE_FAILURE_CURRENT -->
**Latest 31 October result — DEVELOPER_LIFECYCLE_SUBSET_COMPLETE_BOUNDED:** D05 now PASS_BOUNDED_NATIVE for a real disposable-file write rejection, recovered controls and successful byte-identical subsequent export. Ordinary native error was `Export failed: resource busy or locked`; a separate debugger-assisted boundary trace confirmed a returned File before a temporary write-denying handle was acquired and original file.write resumed. All handles released; temporary breakpoint removed; debugger unpaused. Zero new scans or runtime edits. Ledger **11 bounded developer passes / 7 package/installed-context cases NOT_RUN**. [Verified D05 run](reports/lifecycle-qualification-20261029/run-20261031-1029-write-failure/README.md); shared handoff section 9.20. **Next:** All eleven planned developer-context cases P01 and D01-D10 now have bounded passes. Preserve these results and do not repeat them merely to resume. Remaining K01 and I01-I06 package/installed-context cases require their separate authorization, verified final-runtime CCX and designated clean context. No packaging or installation is started by this D05 task; mapping/output/playback correctness and earlier crash cause remain UNKNOWN, distribution NOT APPROVED.
<!-- /WRITE_FAILURE_CURRENT -->

<!-- INFLIGHT_CURRENT -->
**Latest 31 October result — INFLIGHT_DEVELOPER_CHECKS_COMPLETE_BOUNDED:** final 037571056922 D08 cancellation/recovery and D09 native UI guard now PASS_BOUNDED_NATIVE. Cancelled 6657 ms report retains 869 clips / 3476 components, explicit unvisited Unknowns and null clip/component expected denominators; retry COMPLETE 7966 ms restores full 1/3/1024/4096 coverage. Recovery second Scan input occurred inside the retained scan interval while controls were visibly disabled; progress continued 101→980 and original generatedAt was retained. Adapter invocation count is not instrumented (UNKNOWN). Full 7295/7966 ms reports equal except generation time/duration; all three native JSON reports reproduce diagnostics. Ledger **10 bounded passes / 8 NOT_RUN**. [Verified native run](reports/lifecycle-qualification-20261029/run-20261031-1006-inflight/README.md); shared handoff section 9.19. **Next:** Preserve the completed layout/review/picker/project-boundary/cancellation/guard evidence. Remaining developer case D05 requires an already available harmless operator-approved native write-failure destination. Do not create ACL/security changes or protected-folder writes. Packaging, host-restart and installed-customer cases require their separate artifact/profile/authorization prerequisites; no final CCX or customer qualification is established.
<!-- /INFLIGHT_CURRENT -->

<!-- LINEAR_FIXTURE_CURRENT -->
**Latest 31 October checkpoint — RESPONSIVE_LINEAR_FIXTURE_PREPARED_BOUNDED:** corrected disposable sequence independently verified at 30.00 fps, stereo 48 kHz. Native growth and saved-structure guards passed every power of two from 1 to **1,024 equal, contiguous one-second clips**, one sequence / three audio tracks / one populated track. Timeline fit, Save and File menu responded. Normal saved close/reopen and fresh timeline/File-menu responsiveness are independently observed; user ready remains USER_STATED. Zero new scans; D08/D09 remain NOT_RUN, ledger 8 bounded passes / 10 NOT_RUN. Runtime/source/originals preserved. [Preparation evidence](reports/lifecycle-qualification-20261029/run-20261031-0828-linear-fixture/README.md); shared handoff section 9.17. **Next:** Freshly bind UDT registration path and Loaded state to final 037571056922 before any scan. Then use this independent fixture for the planned bounded D08/D09 trial; actual active traversal/cancel/overlap evidence is required. No forced delays or fixture growth beyond 1024 merely to catch a short scan.
<!-- /LINEAR_FIXTURE_CURRENT -->

**Latest preparation:** one-clip native baseline verified; first duplication exposed a frame-timing mismatch. Growth stopped, diagnostic preserved and manual disposable-sequence timebase selection is pending after popup automation did not apply. Zero new scans. [Current run](reports/lifecycle-qualification-20261029/run-20261031-0828-linear-fixture/README.md), shared handoff section 9.15.

**31 October current preparation:** a fresh linear-audio fixture is being prepared in a separate run. Generated local stereo WAV and empty native project file are preserved; settled workspace confirmation is pending. No larger fixture or cancellation/overlap PASS is claimed, no new scan. [Current preparation](reports/lifecycle-qualification-20261029/run-20261031-0828-linear-fixture/README.md). The eight earlier bounded passes remain unchanged.

Research ID 37. Audio Preflight 0.2.1 private beta candidate for Windows 11 / Adobe Premiere Pro 26.5.2.

**30 October boundary checks complete within bounds:** D06 no-project/empty distinction, D07 captured-report identity across B→A switching and D10 saved working-copy close/reopen have native/raw evidence. Scans: absent project 1 ms UNKNOWN, empty project 3 ms COMPLETE, populated A 38 ms before / 47 ms after reopen. Reports before/after agree except generation time/duration; native post-reopen JSON/HTML match. Total ledger: **8 bounded passes / 10 NOT_RUN**. Runtime/original fixture preserved. [Current run](reports/lifecycle-qualification-20261029/run-20261030-2116-boundaries/README.md). Broader developer/customer gates remain unqualified.

Current gate and exact candidate: [PROJECT_STATUS](docs/PROJECT_STATUS.md). Historical working target: **22 October 2026**; official submission deadline **unconfirmed**. Native and installation qualification are required before distribution.

Completed layout result, **29 October 12:35 WIB**: final `037571056922` identified/loaded; measured narrow **326 × 359 logical-pixel outer bounds / 35 ms** and wide **807 × 359 / 31 ms** scans, screenshots and verified native JSON/HTML. Both have full 4/15/7/18 coverage, zero failed reads/review findings and three capability Unknowns. Reports agree apart from generation time/duration. Runtime source, inherited tests and saved fixture are preserved. See [bounded layout result](reports/panel-layout-20261029/CONTINUATION.md). The later initial lifecycle result is recorded below; clean-customer installation and distribution remain unqualified.

Historical context: final-candidate 42 ms docked scan/exports and 39 ms floating/raw-textarea checks retain their original recorded dates; helper-off docking/resizing remains USER_STATED. The earlier automated docking exit has no proven cause. The measured checks above close the specific missing narrow/wide evidence, without turning those older observations or controlled tests into broader native qualification. The installed predecessor and frozen stages remain preserved.

The [lifecycle qualification plan](docs/LIFECYCLE_QUALIFICATION_PLAN_20261029.md) now records **five bounded developer/preflight passes (P01, D01–D04)** and 13 NOT_RUN cases. Reviewed test annotations exported correctly, panel-only reopening retained the summary/first visible review tag, a 29 ms scan cleared annotations, and cancelled-picker retry saved JSON without rescanning. Three unchanged-project reports agree except generation time/duration. [Current run](reports/lifecycle-qualification-20261029/run-20261029-1314/README.md). Runtime and saved fixture are preserved; no project/app restart or installation occurred. Full lifecycle, final CCX packaging and clean-customer installation remain separate unqualified phases.

## Purpose

Review muted non-empty audio tracks, disabled audio clips, and sequence audio configuration through supported Premiere UXP APIs. Findings include locations, evidence, and manual review guidance. Complete routing, source-channel mapping, pan interpretation, and playback/export correctness remain `UNKNOWN / CANNOT VERIFY`.

This is a diagnostic/QC prototype, not an audio editor or mixer replacement.

## Safety

The scan path is read-only. It uses getters and inspection APIs and does not execute Premiere mutation actions.

## Run static checks

```text
npm test
npm run test:fixtures
npm run check:syntax
```

These checks validate mocked adapter reads, diagnostics, panel controls, export, archive integrity and JavaScript syntax. The six synthetic fixtures validate rule contracts. Neither layer proves Premiere host behavior; CI has no Premiere host.

The current candidate uses observation/diagnostic schema 0.3.0 and report envelope 1.0.0. If npm is unavailable, run `node --test tests/*.test.js`, `node tests/evaluate-fixtures.js`, and `node tests/check-syntax.js`. Record that npm itself was not verified.

## Run in Premiere 26.5

Run `node scripts/prepare-beta.js`, then use UXP Developer Tools to add the manifest in its returned stagingDirectory and load it into Premiere Pro 26.5.2. Open a disposable fixture project and run the panel `Audio Preflight`. Retain the runtime receipt and follow `docs/HOST_TEST_RUNBOOK.md` and `docs/BETA_RELEASE_CHECKLIST.md`.

The panel shows findings, item locations, host identity and observation coverage (`COMPLETE`, `PARTIAL`, `UNKNOWN`). Successfully empty inventories are distinct from failed enumeration; failed getters retain scoped Unknowns and independently observed findings. Complete coverage applies only to this bounded observation set. The panel retains raw evidence and supports Reviewed/Intentional annotations. Annotations reset on every scan and never modify Premiere. Cancellation takes effect between inventory items after an in-flight item finishes. JSON and readable HTML exports use a user-selected local save location. Overlapping scans are blocked. No telemetry or network uploads are implemented.

## Prepare a private beta package

Run `node scripts/prepare-beta.js` (or `npm run prepare:beta`). This stages seven allowlisted runtime files and a deterministic unsigned developer ZIP under `artifacts/`, with a SHA-256 receipt. The ZIP is a developer handoff; use Adobe UDT to produce a CCX and qualify installation separately. See [installation and packaging](docs/BETA_GUIDE.md), [demo checklist](docs/DEMO_CHECKLIST.md), and [synthetic sample export](fixtures/sample_export.json). The receipt is not host or installer approval.

## Existing host evidence

Earlier 0.2.1 runtimes have bounded F01–F11 native fixture evidence and a later installed 37 ms manual scan/export pair. These results stay bound to their recorded runtime identities; they do not qualify all behavior of the changed working candidate `9b0796ebae7a`. Three capability Unknown findings remain separate from observable risk counts. Clean-profile installation and broader lifecycle/performance checks remain unqualified; see [current evidence and limits](docs/PROJECT_STATUS.md).

The October 2 final continuation report supersedes older NOT RUN statements: `reports/host-20261001-214943/HOST_VALIDATION_REPORT_FINAL.md`. The old 0.1.0 candidate loaded in Premiere 26.5.2 Build 5 and demonstrated bounded mute, disabled-clip, and location behavior. Mono/multichannel fixtures and timings remained unfinished. Those results do not qualify this changed 0.2.1 candidate. Current native evidence and remaining steps are recorded in [PROJECT_STATUS](docs/PROJECT_STATUS.md).

## Current capability boundary

Documented public APIs support sequence enumeration, audio-track enumeration, sequence channel settings, mute state, audio clip state, and component/parameter inspection. Complete source-channel mapping and final output-bus topology remain unverified/unknown in the public APIs searched.

## Gate rule

Do not distribute this candidate until its host matrix and customer installation checks pass. Do not sell until the private beta criteria in `docs/BETA_RELEASE_CHECKLIST.md` pass. No scan certifies final audio output.
