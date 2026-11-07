# Beta qualification and paid-release gates

<!-- WRITE_FAILURE_CURRENT -->
**Latest 31 October result — DEVELOPER_LIFECYCLE_SUBSET_COMPLETE_BOUNDED:** D05 now PASS_BOUNDED_NATIVE for a real disposable-file write rejection, recovered controls and successful byte-identical subsequent export. Ordinary native error was `Export failed: resource busy or locked`; a separate debugger-assisted boundary trace confirmed a returned File before a temporary write-denying handle was acquired and original file.write resumed. All handles released; temporary breakpoint removed; debugger unpaused. Zero new scans or runtime edits. Ledger **11 bounded developer passes / 7 package/installed-context cases NOT_RUN**. [Verified D05 run](../reports/lifecycle-qualification-20261029/run-20261031-1029-write-failure/README.md); shared handoff section 9.20. **Next:** All eleven planned developer-context cases P01 and D01-D10 now have bounded passes. Preserve these results and do not repeat them merely to resume. Remaining K01 and I01-I06 package/installed-context cases require their separate authorization, verified final-runtime CCX and designated clean context. No packaging or installation is started by this D05 task; mapping/output/playback correctness and earlier crash cause remain UNKNOWN, distribution NOT APPROVED.
<!-- /WRITE_FAILURE_CURRENT -->

<!-- INFLIGHT_CURRENT -->
**Latest 31 October result — INFLIGHT_DEVELOPER_CHECKS_COMPLETE_BOUNDED:** final 037571056922 D08 cancellation/recovery and D09 native UI guard now PASS_BOUNDED_NATIVE. Cancelled 6657 ms report retains 869 clips / 3476 components, explicit unvisited Unknowns and null clip/component expected denominators; retry COMPLETE 7966 ms restores full 1/3/1024/4096 coverage. Recovery second Scan input occurred inside the retained scan interval while controls were visibly disabled; progress continued 101→980 and original generatedAt was retained. Adapter invocation count is not instrumented (UNKNOWN). Full 7295/7966 ms reports equal except generation time/duration; all three native JSON reports reproduce diagnostics. Ledger **10 bounded passes / 8 NOT_RUN**. [Verified native run](../reports/lifecycle-qualification-20261029/run-20261031-1006-inflight/README.md); shared handoff section 9.19. **Next:** Preserve the completed layout/review/picker/project-boundary/cancellation/guard evidence. Remaining developer case D05 requires an already available harmless operator-approved native write-failure destination. Do not create ACL/security changes or protected-folder writes. Packaging, host-restart and installed-customer cases require their separate artifact/profile/authorization prerequisites; no final CCX or customer qualification is established.
<!-- /INFLIGHT_CURRENT -->

<!-- LINEAR_FIXTURE_CURRENT -->
**Latest 31 October checkpoint — RESPONSIVE_LINEAR_FIXTURE_PREPARED_BOUNDED:** corrected disposable sequence independently verified at 30.00 fps, stereo 48 kHz. Native growth and saved-structure guards passed every power of two from 1 to **1,024 equal, contiguous one-second clips**, one sequence / three audio tracks / one populated track. Timeline fit, Save and File menu responded. Normal saved close/reopen and fresh timeline/File-menu responsiveness are independently observed; user ready remains USER_STATED. Zero new scans; D08/D09 remain NOT_RUN, ledger 8 bounded passes / 10 NOT_RUN. Runtime/source/originals preserved. [Preparation evidence](../reports/lifecycle-qualification-20261029/run-20261031-0828-linear-fixture/README.md); shared handoff section 9.17. **Next:** Freshly bind UDT registration path and Loaded state to final 037571056922 before any scan. Then use this independent fixture for the planned bounded D08/D09 trial; actual active traversal/cancel/overlap evidence is required. No forced delays or fixture growth beyond 1024 merely to catch a short scan.
<!-- /LINEAR_FIXTURE_CURRENT -->

**30 October current developer evidence:** D06 no-project/empty, D07 B→A retained identity and D10 saved working-copy close/reopen now have bounded passes. Total **8 bounded passes / 10 NOT_RUN**. Native reports/renderer and saved/source preservation verified; visible active-sequence state checked, full in-memory/audio correctness not certified. [Current boundary run](../reports/lifecycle-qualification-20261029/run-20261030-2116-boundaries/README.md). No broader lifecycle, installed-customer, performance or distribution checkbox is promoted. Older initial-subset/planning rows below preserve their dates/scopes.

**Initial lifecycle execution complete within bounds:** [current run](../reports/lifecycle-qualification-20261029/run-20261029-1314/README.md) records P01 and D01–D04 PASS_BOUNDED_NATIVE; 13 cases remain NOT_RUN. Actual Reviewed annotations are present in native JSON/HTML; panel-only reopen retained summary/first visible review tag; reset 29 ms JSON has no annotations; picker cancellation/retry recovered without another scan. Three unchanged-project reports agree except generation time/duration. This does not qualify full lifecycle, native write failure, app/project restart, installation or release. Earlier popup failure and original planning snapshots remain preserved.

**Lifecycle execution planning history:** [18-case plan](LIFECYCLE_QUALIFICATION_PLAN_20261029.md), [live execution ledger](../reports/lifecycle-qualification-20261029/execution-ledger.json). The initial all-NOT_RUN planning snapshot is preserved under the current run's `baseline/`; five cases now have bounded evidence as stated above. Developer and installed contexts, fresh install and upgrade routes remain separate. No final-runtime CCX or clean customer context is verified. Broader release checkboxes are not promoted by this subset.

**Current 29 October, 12:35 WIB:** the bounded measured-size gate is complete for final `037571056922`: narrow 326 × 359 logical-pixel outer bounds / 35 ms and wide 807 × 359 / 31 ms, screenshots plus matching native JSON/HTML. Each has complete 4/15/7/18 coverage, zero failed reads/review findings and three capability Unknowns. This does not check off broader lifecycle, all display/scaling variants, a new docking transition, clean-customer installation or distribution. [Final evidence and next separate stage](../reports/panel-layout-20261029/CONTINUATION.md). Older pending-size/access statements below are historical checkpoints.

**29 October, 12:25 WIB:** final-stage UDT binding/load and a measured narrow floating 326 × 359 logical-pixel scan (35 ms) plus native JSON are verified. Narrow HTML and wide native checks remain incomplete after capture/filename targeting issues; no full layout/lifecycle gate is checked off. UDT access is restored, not the present blocker. [Current evidence and continuation](../reports/panel-layout-20261029/CONTINUATION.md).

**29 October continuation:** Premiere work is resumed; current source/stage identity `037571056922` was reverified without drift. Historical final-candidate docked scan/exports are complete, and helper-off docking/resizing remains USER_STATED. Required measured narrow/wide geometry, screenshots and fresh per-size scan/export evidence remain open. The 19 October UAC instruction and cleanup-only NOT_RUN labels below are historical for their own identities. See [current status](PROJECT_STATUS.md) and [session continuation](../reports/panel-layout-20261029/CONTINUATION.md). Clean-customer installation/lifecycle and distribution approval remain separate gates.

## Historical checkpoint ledger

**Latest layout candidate:** `037571056922`: 58 controlled tests pass; final docked scan/JSON/HTML and floating scan/raw-textarea checks have bounded native evidence. USER_STATED helper-off undock/redock and narrow/wide floating views behaved normally with no freeze/crash; exact sizes and fresh per-size scan results were not provided. Basic manual layout checks are complete for this trial. Earlier automated docking crash remains unexplained; customer installation and broader lifecycle gates remain incomplete. [Exact evidence and remaining checks](LAYOUT_REFRESH_20261028.md). No distribution approval. The historical checklist below retains its original identities.

**28 October checkpoint:** the working cleanup-patch candidate is `6fb3f7af946f`, with 58 controlled tests, six synthetic fixtures, syntax and developer archive verification passing; native qualification for this changed identity is NOT_RUN. The installed predecessor `48bb1d177f4c` has bounded existing-profile scan/export evidence. The 19 October installation blocker below is historical for that older checkpoint, and its checked fixture/package items must not be transferred to the new runtime. [Current matrix and remaining gates](IMPLEMENTATION_REVIEW_20261028.md). Clean-profile/customer lifecycle qualification and distribution approval remain pending.

Candidate: Audio Preflight 0.2.1. Status: NOT APPROVED FOR DISTRIBUTION. Exact current gate: `PROJECT_STATUS.md`. Record date, OS, Premiere exact version/build, UXP/UDT versions, staged identity and CCX hash for every run. Use disposable fixtures and copies of projects. Record actual outcomes; pending is never a pass.

Submission closeout is separately **BLOCKED_INSTALLATION**: the 19 October normal CCX launch reached unresolved Windows UAC in a non-clean development profile. Installed identity and dependent lifecycle/demo checks remain unexecuted. See the [closeout ledger](../reports/submission-closeout-20261019/closeout-ledger.json) and single [operator handoff](SUBMISSION_OPERATOR_HANDOFF.md). No checkbox below is waived by the submission rehearsal or archive verification; larger-project performance, cohort and paid-release work remain pending.

## Before private beta

- [x] Static tests, synthetic fixtures, syntax and whitespace checks pass (18 October 2026; 53 tests, 6 synthetic fixtures; `reports/verification-20261017/static-checks.json`).
- [x] Runtime-only staging and deterministic unsigned developer ZIP match identity `7b544bd27f3b`; seven exact files verified (`reports/verification-20261017/package-verification.json`). This is not a CCX installation pass.
- [x] Adobe UDT 2.3.0.5 generated current 0.2.1 CCX; SHA256 `8c3c27a8dc28…`. Seven runtime files verified against the frozen receipt; manifest values equal after UDT whitespace changes. See `reports/verification-20261017/ccx-verification.json`. Installation remains unqualified.
- [ ] New candidate loads and renders at minimum/docked/floating panel sizes; text, dropdowns, scrolling, raw evidence and long names remain readable.
- [x] F01-F11 agree with independent visible ground truth for runtime `7b544bd27f3b` on Premiere 26.5.2 Build 5. Actual Mono1/Multichannel4 settings and content verified; 33 repeated reads across ten setups, including six F11 save-close-reopen reads. Intentional pan/layout create no risk; mapping/output remain Unknown. See `reports/verification-20261017/NATIVE_VALIDATION_20261018.md` for scoped evidence and recovered host interruptions. Other checklist items retain their separate gates.
- [ ] No project, empty project, empty tracks, multiple sequences, repeated clips, missing media, and panel reopening behave clearly.
- [ ] Injected failure tests remain green; capture natural host read failures if reproducible, without calling setters/private APIs to induce them.
- [ ] Repeat clicks start one scan; cancel during sequences/tracks/clips retains supported findings, marks unvisited state Unknown, and enables another scan after cleanup.
- [ ] Project-switch test retains captured project identity; document sequential snapshot limits.
- [ ] Reviewed/Intentional tags update exports and reset on the next scan.
- [ ] JSON/HTML save, cancelled picker, unavailable destination, and repeat exports recover controls. Compare exported exact ticks/annotations with panel evidence. HTML names cannot execute markup.
- [ ] Record elapsed duration and UI responsiveness on controlled 100/1,000/5,000-clip projects. Cancel input must be acknowledged when a host call returns; unexplained stalls block beta.
- [ ] Before/after state and clean-project indicators show no scan-attributable changes. Record undo/state evidence and qualifications separately.
- [ ] Clean customer installation, app restart, upgrade from prior beta identity, uninstall and reinstall work through Creative Cloud; UDT loading alone is insufficient.

Acceptance: zero unexplained wrong supported-rule results, project mutations, crashes, hangs, misleading completion or install blockers. Unknown capabilities are excluded from accuracy denominators, never reported as verified negatives. Fix and retest affected cases against a new staged identity.

## Private beta cohort

- Recruit five editors manually; no messages are sent automatically.
- Run two weeks starting after qualification and installation checks pass; use project copies.
- Collect `BETA_FEEDBACK.md` responses at the end and whenever a blocker occurs. Capture project size, runtime, finding correctness and ability to locate findings without developer help.
- Gate: at least four of five can install, scan, locate and export findings independently; no unresolved blockers above.

## Before sale

- At least three editors report repeated practical value.
- Resolve beta blockers and rerun qualification on the packaged paid candidate.
- Establish support destination, licensing terms and refund policy with the owner; do not invent commitments.
- Choose pricing and sales channel from beta evidence. Implement payment/licensing only after those decisions.
- Capture accurate screenshots from the qualified host and describe bounded preflight scope. Never advertise routing/output certification.

If value depends on unavailable routing/mapping capabilities, pause commercialization and reassess supported-API feasibility.
