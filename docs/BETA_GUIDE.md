# Audio Preflight 0.2.1 private beta guide

Status: beta candidate, qualification pending. Initial target: Windows 11 and Premiere Pro 26.5.2. No macOS or other-version support claim.

**29 October current routing:** final developer runtime is `037571056922`; bounded measured layout/native export evidence is complete. The [lifecycle qualification plan](LIFECYCLE_QUALIFICATION_PLAN_20261029.md) separates UDT execution, packaging and installed-customer testing. Current local `artifacts/` inventory found only predecessor `48bb1d177f4c` CCX; no final-runtime CCX was verified. Package/install references from 19 October below retain their historical identity and must not be substituted for the final candidate. No new lifecycle/install execution follows from this guide update.

## Build and package

1. Run the unit, fixture and syntax checks from README.
2. Run `node scripts/prepare-beta.js`. Retain the returned receipt, unsigned developer ZIP and stagingDirectory. Each changed runtime creates a new content-addressed folder; never mix folders or manually patch staged files. The ZIP can be extracted for UDT development loading; renaming it to CCX does not qualify an installer.
3. In Adobe UXP Developer Tools, Add Plugin using the staged manifest. Use the plugin menu's Package action and choose a local output folder. Confirm success and retain the CCX SHA-256 alongside the staging receipt.
4. Inspect the CCX archive contents: only manifest, index HTML/JS, and four src modules should appear. Do not package the workspace root containing fixture projects, reports or work logs.
5. Complete `BETA_RELEASE_CHECKLIST.md` on the staged/package identity before distribution.

Verify the developer ZIP in PowerShell using paths printed by the build:

```powershell
./scripts/verify-package.ps1 -Package <developer.zip> -Receipt <receipt.json> -Output <verification.json>
```

The verifier requires exact allowlist, identity and runtime bytes. For a genuine UDT-generated CCX only, use `-AllowManifestReformat` if UDT changes manifest whitespace; parsed manifest values must still match. Installation qualification remains false after archive verification. New receipts state `nativeValidation: NOT_ESTABLISHED_BY_PACKAGING`; read the native ledger for actual host results. Earlier frozen receipts retain the initial blocked checkpoint and are not current status authorities. CI runs these static/package checks on Node 22/24, Windows and Linux, and retains an unsigned developer handoff.

The historical 19 October UDT-generated CCX was `artifacts/ccx-0.2.1-7b544bd27f3b/com.unn0wn002.audio-preflight.beta_premierepro.ccx`. Its recorded SHA256 is `8c3c27a8dc281db5e3f4fe0555dd7455a77e7860c5e63036b728b1596f8209e2`. Archive verification was recorded then; current availability, installation and native qualification must be revalidated separately. It is not the final `037571056922` package; use `PROJECT_STATUS.md` and the lifecycle plan for current continuation.

This independent beta uses `com.unn0wn002.audio-preflight.beta`, separating it from the historical probe. Keep this beta ID stable for beta upgrades. A future Marketplace release must obtain its Marketplace ID separately; do not reuse that Marketplace ID for independently purchased packages. Adobe recommends UDT packaging and installation testing: [package guide](https://developer.adobe.com/premiere-pro/uxp/plugins/distribution/package/).

## Install and use (must be verified before sharing)

Open the supplied CCX with Creative Cloud Desktop, follow its installation flow, restart Premiere, and locate Audio Preflight under Window > UXP Plugins. Record any additional steps actually needed; do not promise an untested installation experience. Development loading through UDT is a separate workflow.

The 19 October closeout reached Windows UAC for Adobe Creative Cloud while opening the verified current CCX in the existing development profile. System consent remains unresolved; clean-profile installation, restart, installed identity, uninstall/reinstall and upgrade are not qualified. This is not a recorded CCX rejection. See the single [operator handoff](SUBMISSION_OPERATOR_HANDOFF.md) and [closeout review](../reports/submission-closeout-20261019/CLOSEOUT_REVIEW.md). Package integrity and the completed UDT fixture evidence remain separate from installation.

Open a copy of a project. Choose Scan active project and avoid edits or project switching until it finishes. Review findings by sequence and track. Clip locations include occurrence number, seconds relative to sequence start and exact ticks where observed. Reviewed/Intentional tags acknowledge findings; they do not change audio or remove evidence. Tags reset on the next scan.

Read the diagnostic status and coverage as well as the finding count. A successfully empty project/track is observed empty. A failed collection getter has an unknown denominator and cannot count as empty or healthy. Partial component data does not erase known mute/disabled states; it produces a scoped Unknown. `COMPLETE` never certifies source mapping, output buses or playback/export audio.

Cancel scan requests a stop between inventory items. Current host reads finish first. A cancelled or partial report covers only captured observations. Run another scan to inspect the entire project.

Use Export JSON for inspectable evidence or Export readable report for a standalone HTML report. Choose the save location yourself. Review names and paths before sharing. The readable report does not embed the raw evidence (it stays small); raw evidence remains available through Export JSON and Show / hide raw evidence.

## Privacy and support

Processing is local. This version contains no telemetry, network upload, account system or automatic Premiere repair. Reports contain project/clip names, paths, IDs, component metadata, parameter values, timings, host details and scan-local review states. Files are written only following the export action and local save picker. Unsaved reports/annotations are held in panel memory.

Report issues manually using `BETA_FEEDBACK.md` through the existing private conversation used to receive the beta. No support address, response-time commitment or collection service has been established. Do not send production media or private paths unless you choose to share them. Reproduce with a disposable project where possible.

## Release notes

0.2.1 adds scoped failed/missing-read diagnostics, explicit observation coverage and host identity, incomplete-inventory aggregate guards, documented value-shape regressions, CI and a deterministic unsigned developer ZIP. Runtime UTF-8 text is normalized from CRLF to LF for portable package identity; staged bytes are the qualification target. Fresh native evidence and remaining qualification steps for this runtime receipt are recorded in [PROJECT_STATUS.md](PROJECT_STATUS.md).

0.2.0 adds grouped findings, review tags, progress, cooperative cancellation, measured scan duration, local JSON/HTML export, and runtime-only staging with SHA-256 identity. Observation/diagnostic schema is 0.3.0; report envelope is 1.0.0. Existing ARID rule IDs and exact tick strings are retained. No new routing/pan interpretation or auto-fix is enabled.
