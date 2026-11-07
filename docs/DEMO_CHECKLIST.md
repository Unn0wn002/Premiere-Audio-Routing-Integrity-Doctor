# Bounded beta demonstration

**29 October continuation:** measured layout/native export results are in `reports/panel-layout-20261029/`; remaining execution follows [the current lifecycle plan](LIFECYCLE_QUALIFICATION_PLAN_20261029.md). A plan is not a rehearsal/native PASS, and old frozen-candidate fixture assertions keep their original identity. Do not repeat the full fixture campaign or measured size scans merely to start lifecycle work.

Working target: 22 October 2026. Official submission deadline remains unconfirmed. A demo is not a substitute for native qualification.

1. Record branch, commit and runtime/package SHA256 from `PROJECT_STATUS.md` and the packaging receipt. Identify whether the run is native, mocked or a synthetic example. Show the exact Premiere build, UXP/plugin versions and locale.
2. Open a disposable project. Independently show stereo channel settings, an active audio track and an enabled clip. Scan and show measured duration, coverage, host identity and explicit routing/mapping/output Unknowns.
3. On disposable state, demonstrate F05 (one nonempty track muted), F06 (muted and active nonempty tracks), and F07 (disabled second occurrence of a same-name clip). Show ARID-001/002/003, sequence/track/clip location and exact ticks. Explain that mute/disable may be intentional; no repair action exists.
4. Demonstrate actual Mono and Multichannel settings, plus intentional hard pan. Channel configuration is informational; pan alone creates no risk finding. If any state is unavailable, show its fixture as blocked, never passed.
5. Show a partial-read regression report with a scoped Unknown and surviving independent observations. Label mocked fault injection explicitly. Show an empty successful project separately from failed enumeration.
6. Rapidly click Scan; demonstrate one in-flight scan and disabled controls. Cancel a scan and show retained evidence plus unvisited Unknown, then run again.
7. Mark one finding Intentional; export JSON and compare its host, coverage, evidence, annotation and location with the panel. Start a new scan and show annotation reset. Cancel the save picker and show controls recover.
8. Repeat three scans of unchanged state; record durations. Save, close, reopen and rescan. Compare independently inspected mute, Enable, channel and relevant pan/mapping state; retain before/after evidence and original project hashes separately from deliberate fixture setup changes.
9. Show the F01–F11 record. Give TP/FP/FN only for independently observable conditions; show Unknown and blocked/not-run separately. State the current qualification gate and next action.

The developer ZIP is unsigned source staging. Adobe UDT packaging and clean Creative Cloud installation/restart/upgrade/uninstall/reinstall remain separate checks. Never describe static tests, historical candidate results or archive integrity as native success.

## Bounded submission rehearsal

For frozen runtime `7b544bd27f3b`, retain the completed F01–F11 evidence and identify which demonstration segments use its saved screenshots/exports. Do not repeat the fixture campaign without a new defect. Record new installation and lifecycle steps separately in `reports/submission-closeout-20261019/closeout-ledger.json`, distinguishing installed-package execution, UDT execution, reused native evidence and simulated examples.

Step 5 may use `fixtures/sample_export.json`, explicitly labeled `SYNTHETIC_EXAMPLE_NOT_NATIVE_EVIDENCE`; it demonstrates Partial/Unknown read coverage with independently surviving findings. It does not qualify a native failed getter. Live empty-project behavior and lifecycle controls require their own evidence.

Report submission-demo readiness separately from distribution readiness. A blocked installation, unverified installed identity or incomplete required lifecycle step must remain visible in the closeout result. Larger-project performance, customer cohort and paid-release work remain pending; no rehearsal result waives the beta-release checklist.

The 19 October closeout is **BLOCKED_INSTALLATION** at an unresolved Windows UAC prompt; no new live lifecycle/demo rehearsal is claimed. Reusable native and simulated assets are identified in the [closeout review](../reports/submission-closeout-20261019/CLOSEOUT_REVIEW.md). Resume through the single [operator handoff](SUBMISSION_OPERATOR_HANDOFF.md).
