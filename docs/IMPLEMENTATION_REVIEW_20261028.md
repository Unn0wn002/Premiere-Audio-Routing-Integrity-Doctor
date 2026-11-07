# Implementation review — 28 October 2026

**Final 29 October continuation, 12:35 WIB:** measured native narrow/wide scans and JSON/HTML are complete for unchanged final `037571056922` (326 × 359 logical-pixel outer bounds / 35 ms; 807 × 359 / 31 ms). Both have complete listed coverage, zero failed reads/review findings and three capability Unknowns. Export pairs and cross-layout report equality were independently checked. No new product source defect or patch was established; original cleanup regressions remain unchanged. [Current stopping point](../reports/panel-layout-20261029/CONTINUATION.md). The earlier partial checkpoint and cleanup-only matrix below remain historical; this does not establish full lifecycle or customer installation.

**29 October, 12:25 WIB continuation:** the final `037571056922` stage was independently confirmed and loaded through UDT. A fresh narrow floating scan (326 × 359 logical-pixel outer bounds, 35 ms) and native JSON have complete bounded coverage with zero failed reads/review findings and three capability Unknowns. Native HTML/wide checks remain open after export/capture targeting disagreed; no new runtime defect or source fix is established. [Current evidence](../reports/panel-layout-20261029/CONTINUATION.md). Historical cleanup-only matrix below retains its original scope.

This preserves the historical cleanup-only `6fb3f7af946f` checkpoint. Later layout work passed through intermediate `9b0796ebae7a` and produced final working identity **`03757105692238f9fdc51a17a39aa4a3c6021ca08a6e8c799aa51d43db8d29a4`**, reverified from source/stage on 29 October. See [layout/native retry evidence](LAYOUT_REFRESH_20261028.md) and [current continuation](../reports/panel-layout-20261029/CONTINUATION.md). The final identity has historical 42 ms docked scan/exports and 39 ms floating/raw-textarea evidence; helper-off docking/resizing is USER_STATED. Exact measured per-size evidence remains missing. The cleanup regressions and controlled A1–A5 results below retain their original scope; native NOT_RUN labels and next steps below refer to the cleanup-only checkpoint and must not erase later final-candidate evidence. Earlier `VERIFIED_THIS_SESSION` wording below belongs to that original session.

Source base: branch `codex/validated-beta-20261017`, HEAD `9330e242eadcd10623300ca39d01753355aefc7a`. This patch is uncommitted. Origin: `https://github.com/Unn0wn002/Premiere-Audio-Routing-Integrity-Doctor.git`. Existing untracked `PANEL_LAYOUT_VALIDATION.md` and the complete panel-layout report tree were preserved. No branch change, commit, push, host input or installed-runtime replacement occurred.

The supplied `01_PREMIERE_A1_A5.md` was read as the task handoff. Matching `00_PREMIERE_AUDIO_MEMORY_AND_PROMPT.md` was not present in that prompt directory or this checkout's file listing. Historical observations are not assumed current. Current implementation is in `src/premiereAdapter.js` and `index.js`; no recovered `projectScanner.js` is required for these existing modules.

## Confirmed defect and minimal fix

Scan setup set `inFlight=true`, then touched the UI before entering `try/finally`. Export setup similarly set `exporting=true`, then updated controls outside cleanup protection. A thrown UI operation could reject the handler and leave the respective lock set, blocking retries.

Two controlled DOM-failure regressions in `tests/beta.test.js` reproduced this: both failed against the original code with the injected render/control errors. The minimal `index.js` patch moves UI initialization into the existing protected blocks. Both tests now pass, including a successful retry, restored controls, and no scan/picker invocation before failed initialization. No diagnostic rule, adapter host API, report format, UI framework or project-mutation behavior changed. This controlled failure is not claimed to have occurred in Premiere and is not offered as a fix for the earlier host opening stall.

## A1–A5 matrix

Commands below use the verified bundled Node executable, with working directory at the repository root. `node --test tests/*.test.js` passed **58/58**, zero failed/skipped. `node tests/evaluate-fixtures.js` passed **6/6** synthetic contracts. `node tests/check-syntax.js` and `git diff --check` passed. npm was not invoked.

| Requirement | Controlled result this session | Expected / actual evidence | Native result for changed runtime |
| --- | --- | --- | --- |
| A1 inventory completeness | PASS; already implemented | Failed inventories retain unknown denominators; empty inventories retain complete zero counts; aggregate mute suppressed on partial evidence. `adapter-validation`, `diagnostic-validation`, `recovery` tests. | NOT_RUN |
| A2 isolation | PASS; already implemented | Project/sequence/track/item/metadata failures remain scoped and later independent items continue. `adapter-validation` and `recovery` tests. | NOT_RUN |
| A3 serializer | PASS; already implemented | Nested wrappers, exact tick strings, cycle/depth/size failures and unsupported shapes remain explicit. `recovery` and `adapter-validation` tests. | NOT_RUN |
| A4 lock/cleanup | PASS after this patch | New startup render/control exceptions recover scan/export locks and permit successful retries; existing overlap, cancel and rejected-read tests remain green. `beta` and `recovery` tests. | NOT_RUN |
| A5 report honesty | PASS; already implemented | Incomplete scopes retain PARTIAL/UNKNOWN, failures avoid completed messaging; HTML escapes data and preserves full findings. `diagnostic-validation`, `ui-summary`, `beta`, `recovery` tests. | NOT_RUN |

Controlled PASS does not become native PASS. The installed candidate's separately retained 37 ms manual scan/export pair is bounded native evidence for its older runtime identity, not this patch. The supported native diagnostic label for unavailable coverage remains UNKNOWN; no new BLOCKED diagnostic enum was invented.

## Candidate identity and preservation

New local working candidate: `6fb3f7af946ff01d90137acdf1f6c5199b9fd1f022df9f421edd1ec8ade517ab`, version 0.2.1. Only `index.js` changes among the seven runtime files. Version alone must not be used to identify this build.

- Stage: `artifacts/audio-preflight-0.2.1-6fb3f7af946f`.
- Developer ZIP: same path plus `-developer.zip`; SHA256 `838ac5c0f3ffefe4bb7d45b89f73045ba19e77b40ae41d153e5b9c28b8ffe93f`.
- Receipt: same path plus `-receipt.json`.
- Independent `scripts/verify-package.ps1` result: all seven exact files and archive hash PASS. This is archive integrity only; new CCX generation, installation and native qualification are NOT_RUN.
- Previous installed/staged runtime `48bb1d177f4c` and its CCX remain preserved. Existing profile installation was verified by files and user/native evidence on 28 October; the older 19 October UAC checkpoint is historical for that profile. Clean-customer installation is still unqualified.

Machine build/verification records: `reports/panel-layout-20261027/cleanup-patch-candidate-20261028.json` and `cleanup-patch-package-verification-20261028.json`. Earlier evidence and new package are retained side by side.

## Remaining gates — three groups

1. **Changed-runtime native smoke:** package/load this exact new identity, then verify ordinary scan, cancel/retry, panel reopening, review annotations and fresh JSON/HTML. Preserve the current installed candidate. Do not inject host failures or call private/setter APIs to manufacture native evidence. BLOCKED until the changed runtime is actually loaded and operated in Premiere.
2. **Customer installation/lifecycle:** clean-profile install, app restart, eligible upgrade, uninstall/reinstall and complete installed lifecycle checks. These are not satisfied by the existing development-profile installation or developer harnesses. BLOCKED until the operator supplies the profile/install actions and resulting evidence. Distribution remains NOT APPROVED.
3. **Broader performance/release:** controlled 100/1,000/5,000-clip timing coverage, unexplained-stall review and beta cohort gates. Existing large-fixture/pagination evidence is bounded and does not fill every size cell. Keep mapping, buses and playback/export correctness UNKNOWN. BLOCKED until the prescribed fixtures/cohort evidence exists; no release/sale approval is inferred.

## Native demo/retest boundary

Use supported native UXP panels via Window > UXP Plugins. Keep desktop automation disconnected during project opening; it produced long accessibility requests in the captured environment. Open disposable projects manually, allow loading to settle, then use the panel's Scan/Cancel/review/export controls. No main modal interface or floating-only palette is introduced; existing docking/floating architecture stays intact.

For the new identity, start with one completed read-only scan and a fresh JSON/HTML pair, then exercise cancel/retry and annotations. Retain exact build receipt and operator observations. Prior 37 ms exports remain evidence for the previous installed runtime. Do not overwrite them or silently replace the installed package.
