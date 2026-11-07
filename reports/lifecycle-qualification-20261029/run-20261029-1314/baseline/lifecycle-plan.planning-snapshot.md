# Lifecycle qualification plan — 29 October 2026

Status: **PLAN_READY / NEW_NATIVE_LIFECYCLE_NOT_RUN / DISTRIBUTION_NOT_APPROVED**.

The user requested this plan after completion of the bounded narrow/wide layout checks. This deliverable defines execution order and evidence; it does not execute tests, restart/close Premiere, install/uninstall software, alter system/app permissions, or approve distribution. Runtime source, inherited edits, original fixtures and earlier evidence stay preserved. CutBridge, AE Glyph and WBS are outside scope.

## Candidate and current evidence

| Identity | Frozen value |
| --- | --- |
| Checkout | `C:\Users\unn0w\Downloads\02_Projects\Premiere-Audio-Routing-Integrity-Doctor` |
| Branch / HEAD | `codex/validated-beta-20261017` / `9330e242eadcd10623300ca39d01753355aefc7a` |
| Plugin | `com.unn0wn002.audio-preflight.beta`, version `0.2.1` |
| Final runtime | `03757105692238f9fdc51a17a39aa4a3c6021ca08a6e8c799aa51d43db8d29a4` |
| Frozen stage / receipt | `artifacts/audio-preflight-0.2.1-037571056922` / matching `-receipt.json` |
| Developer ZIP SHA256 | `f989dccd51b54bdab7f790816fdec7dc93b65f508b9a17a88bbd967a9371d607` |
| Saved positive fixture SHA256 | `7bfc2f703ec78c5592f4150986a4635270feb6e197806f11d02d61f478d723ec` |

These source/stage/archive identities are distinct from the identity of a currently loaded or installed plugin. Revalidate the applicable context before execution. The inherited dirty tree must not be reset, staged wholesale or discarded.

Completed layout evidence is under `reports/panel-layout-20261029/`: final-stage UDT Options/readback and load, narrow 326 × 359 logical-pixel outer bounds / 35 ms, wide 807 × 359 / 31 ms, screenshots and native JSON/HTML pairs. Each has complete 4/15/7/18 sequence/track/clip/component coverage, zero failed reads/review findings and three capability Unknowns. `cross-layout-verification.json` proves reports equal after excluding only generation time and duration. Reuse these records; do not repeat size scans just to begin lifecycle testing. They are single observations, not a performance benchmark or installed-customer qualification.

Prior helper-off docking/resizing remains USER_STATED. Earlier final-candidate docked/raw-textarea results remain historical native evidence. The earlier docking crash cause and wider Computer Use focus/capture issues remain UNKNOWN. The 19 October UAC checkpoint is historical; it is not proof of a current prompt. Existing-profile predecessor installation does not qualify a clean customer install.

## Execution order and authority

1. **Preflight:** reconfirm the frozen identity, preservation baseline, available disposable fixtures, operator readiness and working native targeting. Complete no host action if any required identity is ambiguous.
2. **Developer-context lifecycle:** start with review/reset and panel reopening, then export recovery, project boundaries and larger-inventory controls. Reuse completed ordinary scan/export/layout records. Context must be labeled `UDT_FINAL`; it cannot pass an installed-candidate gate.
3. **Packaging preparation:** when execution is requested, create a separate CCX from the exact final stage through supported UDT packaging and verify the archive. Do not rename the developer ZIP or substitute an older CCX. This plan generates no package.
4. **Customer installation lifecycle:** only after a verified final CCX, a designated clean profile and explicit permission for install/restart/upgrade/uninstall/reinstall. Use normal Creative Cloud flow and independently bind installed files with UDT developer registrations inactive.

Local plan/evidence preparation is authorized now. Native lifecycle execution is a subsequent task. Normal project/app closing or restart requires confirmed readiness with no unsaved user work at risk; never force-terminate Premiere. Package installation, system settings, security/permission prompts and outbound actions retain the original separate-permission boundaries. The user must handle authentication, UAC and protected consent. Do not self-grant Computer Use app access through config edits.

## Preflight and developer-context matrix

All case results start **NOT_RUN**, actual result/duration null and evidence empty in the [execution ledger](../reports/lifecycle-qualification-20261029/execution-ledger.json). Expectations are proposed acceptance criteria derived from the current implementation and existing runbooks, not new native observations.

| ID | Planned action / prerequisite | Acceptance and required evidence |
| --- | --- | --- |
| LQ-P01 | Recheck branch/HEAD, seven source/stage hashes and receipt; identify current UDT path/load, exact host build/UXP/locale and disposable project. Capture fixture hash, clean/unsaved marker and relevant visible audio state before testing. | Explicit final-runtime binding and preservation baseline. Source/version strings alone are insufficient. Record fresh window identity; no project mutation or hidden setup. |
| LQ-D01 | Reuse the two preserved unchanged-project narrow/wide reports as repeat observations 1–2. If three repeats are required, add at most one read-only scan before deliberate fixture changes. | Full reports stable after excluding only generation time/duration; any other difference investigated. These repeats do not add detection cases or establish a same-layout performance benchmark. |
| LQ-D02 | In the disposable project, physically select one finding's Reviewed/Intentional state; export JSON/HTML, then scan again. | Annotation changes only the report's review state, not findings/audio. Export pair contains that annotation; next scan resets annotations and selector to Unreviewed. Interaction is not evidence the finding was assessed as intentional. |
| LQ-D03 | Close and reopen only the plugin panel once in the same loaded UDT context, after an idle scan/annotation. | Report, annotation and controls remain consistent. Same-context report retention is expected; if the host recreates plugin context, record that separately and require honest empty state/disabled exports until a new scan. Context loss must not silently pass a retention assertion. No app quit or workspace reset. |
| LQ-D04 | Open one native export picker and Cancel, then export the retained report normally. | Cancel status, controls recovered, report retained, successful subsequent native export. Select the actual dialog, keep default filename/folder when focus is uncertain, verify actual file location. No rescan needed just to retry export. |
| LQ-D05 | Exercise an actual native write failure only with a harmless operator-approved unavailable destination already available; do not change ACLs/security or write into protected application folders. | A real plugin write rejection, visible error, recovered controls and successful subsequent export. A picker rejecting a path before plugin write is a different boundary. If a safe native write failure cannot be exercised, retain NOT_RUN and cite controlled coverage separately. |
| LQ-D06 | With operator readiness, distinguish no active project from a successfully enumerated empty disposable project. Preserve/create separate fixture copies and media references deliberately. | No-project acquisition remains failed/UNKNOWN; zero-sequence successful enumeration may be COMPLETE with zero observed inventory. Neither may invent complete unknown denominators or routing/output certification. Preserve raw reports and independent project/sequence UI truth. |
| LQ-D07 | While idle, switch between two distinct disposable projects A/B; export retained A report before scanning B. | A's captured identity/evidence stays A until a new scan; new B scan identifies B. Record active UI identity and report identity separately. Do not edit or switch while a scan is active to claim an atomic snapshot guarantee. |
| LQ-D08 | Use an independently responsive larger disposable inventory, user-opened with desktop inspection idle during loading. Request Cancel during visibly active traversal, then retry once. | Retained visited evidence, explicit unvisited Unknowns, cancellation request/completion timestamps, progress/denominators, recovered controls and one successful retry. If the scan finishes before Cancel is exercised, record NOT_EXERCISED, not PASS; no fake host delays/setters or fault injection in the frozen runtime. |
| LQ-D09 | Combine with D08's visibly active scan: observe disabled Scan/export controls and one deliberate second Scan input. | Bounded UI guard evidence during a real active traversal. One final report alone does not prove rejected overlap or adapter invocation count. If invocation count cannot be observed without altering runtime, state that limit; never claim instrumented single-flight proof. |
| LQ-D10 | Prepare/save a separate working lifecycle copy, freeze its post-setup baseline, then normally close/reopen that copy after user readiness. Keep desktop inspection idle during loading; inspect after the operator reports it settled. | Saved copy/media resolution and relevant audio state persist, scan/export work after reopening, original canonical fixture untouched. Separate intentional Save/serialization changes from scan-only preservation; compare post-setup baseline and independent visible mute/Enable/settings/undo or clean-state evidence. File hash alone proves saved bytes, not all in-memory state. |

Proposed minimum execution starts with **P01 → D02 → D03 → D04**. These add the most direct final-candidate lifecycle evidence to the completed scan/export/layout baseline. D01 can reuse the existing two scans; add a third only for a defined repeatability requirement. The old full F01–F11 fixture campaign is not automatically rerun.

Fixture preparation must preserve linked-media resolution. If copying a project changes relative media resolution, stop and distinguish setup failure from scanner behavior. Larger fixture history includes opening stalls; do not reopen it repeatedly to force a pass. Stop if targeting disagrees, screenshots/focus identify another app, the desktop locks or Premiere stops responding. Preserve the last report and error; no repeated input, preference/cache changes or forced termination. A fresh user-confirmed settled session is required before resuming.

## Packaging and installed-context matrix

Read-only inventory in [planning inputs](../reports/lifecycle-qualification-20261029/planning-inputs.json) found one CCX under this checkout's `artifacts/`: predecessor `48bb1d177f4c`, SHA256 `15026dd9df78c2437ab0e295a6d62c7df5f0276486ba130981c68dc9876662f5`. Five of seven runtime files match final `037571056922`; the changed HTML/JS do not. **No final-runtime CCX was found in that inventory.** This is a bounded local artifact search, not proof none exists elsewhere. Historical old 0.2.0/7b544 CCX paths must be revalidated before use; do not assume the former upgrade package is currently available.

| ID | Planned action / prerequisite | Acceptance and required evidence |
| --- | --- | --- |
| LQ-K01 | When packaging execution is authorized, UDT Package the exact frozen final stage into a new local CCX. Independently verify with `scripts/verify-package.ps1` and the final receipt; allow only documented manifest formatting. | Actual CCX path/SHA256, plugin ID/version and seven-file equality; no staging overwrite. Archive PASS remains separate from installation. A verified final CCX is a dependency for every installed-context case. |
| LQ-I01 | User provides a designated clean test profile/host with normal Adobe access; record pre-install state and provenance. | Clean-context evidence, not merely an empty Creative Cloud acquired-plugin list or existing development profile. Never record credentials. |
| LQ-I02 | Explicitly authorized normal Creative Cloud installation of K01's exact CCX; user handles UAC/authentication. Verify installed contents and inactive developer registrations. | Installer outcome, selected package/hash, installed path/ID/version, six exact runtime files plus manifest values as appropriate. No UDT fallback/installed-predecessor substitution. |
| LQ-I03 | After readiness/authorization, normal Premiere restart with UDT not launched; open installed panel, scan disposable project and export both reports; exercise the relevant panel/review/cancel recovery checks in installed context. | Fresh installed binding, host startup/menu/panel evidence and actual lifecycle results. Developer-context evidence may guide expectations but cannot replace installed execution. No forced quit or unsaved work discard. |
| LQ-I04 | Separately authorized upgrade from an authentic, verified lower-version same-ID package. First establish that installed baseline, then install final 0.2.1 normally. | Genuine prior artifact/provenance, version transition and before/after installed identities with working panel/report. Same-version predecessor 0.2.1 replacement is not automatically an eligible upgrade. If no eligible prior package exists, keep NOT_RUN; do not relabel binaries/versions. |
| LQ-I05 | Separately authorized normal uninstall in the test profile, after preservation/readiness. | Native removal result and absence of installed panel/files under the documented normal flow. Preserve exports and user projects; deletion is an operator-confirmed consequential action. |
| LQ-I06 | Separately authorized reinstall of the exact K01 candidate, followed by a normal restart/scan/export smoke. | Correct installed identity restored and bounded installed smoke passes. Reinstallation must not inherit PASS solely from I02. |

Keep **fresh-install** and **upgrade** routes distinct. Fresh route: I01 → I02 → I03 → I05 → I06. Upgrade route: a separately identified test profile/run with an authentic lower-version baseline → I04 → I03 for that upgraded identity. Do not downgrade the development profile or replace the existing installed predecessor merely to manufacture an upgrade baseline. I03 may follow either I02 or I04, but evidence must name its route; an upgrade does not retroactively pass fresh installation. I05/I06 apply only to the explicitly designated test profile and authorized removal/reinstallation.

## Evidence record and decision rules

Each executed case records case ID, runtime/package identity, context (`UDT_FINAL` or `INSTALLED_FINAL`), host build/UXP/locale, fixture before/after hashes, expected versus actual result, duration or null, screenshots, raw export paths/SHA256, operator actions, controlled/historical references, limitations and next action. Keep native originals intact and make only verified identical working copies. Maintain semantic comparison exclusions explicitly; do not remove differing fields until evidence shows why they may be excluded.

Use `PASS_BOUNDED_NATIVE`, `FAIL_REPRODUCED`, `BLOCKED`, `NOT_RUN` or `NOT_EXERCISED` for actual results, with separate evidence class. USER_STATED actions remain identified even when their output files are independently verified. Null durations/denominators are not zero. Controlled mocks, synthetic contracts, prior-candidate native reports and package integrity never become native lifecycle PASS. Re-run controlled checks only after a source change/new failure warrants it; a runtime patch requires a new identity and affected native retests.

Stop on an unexplained mismatch, scan-attributable state change, misleading completion, crash/hang or access boundary; record actual symptoms without assigning a cause. Complete only the affected recovery after a safe, explicitly identified state exists. Acceptance is case-by-case; partial success does not waive an unexercised case. No broad lifecycle PASS is issued while required cases are open.

Larger 100/1,000/5,000-clip performance, representative customer cohort, other builds/scaling/locales, demo rehearsal, release/commercialization and routing/mapping/output correctness remain separate gates. Do not schedule outreach, publish, push, merge, install or change system settings from this plan. Mapping, output-bus topology and playback/export correctness stay UNKNOWN; distribution NOT APPROVED.

## Exact continuation

The plan and empty 18-case execution ledger are ready. **No new native lifecycle or installed-customer test has run for this planning task.** Next requested execution should start at P01, then D02–D04 on a separately preserved disposable working copy after user readiness. The installation phase additionally needs a final verified CCX, a user-supplied clean context and explicit consequential-action permission. Preserve the final layout result and consult the [current project status](PROJECT_STATUS.md) and [shared handoff](../../HANDOFF_LOG_2026-10-29.md) section 9.9.
