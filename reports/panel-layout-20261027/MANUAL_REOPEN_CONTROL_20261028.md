# Manual opening observations and later measured recovery

**Result:** user-reported opening/reopening delays followed by recovery; a later process-only observation independently verified a sustained nonresponsive interval followed by recovery without termination. **Cause UNKNOWN; original unchanged-fixture control not satisfied because the user chose Save.**

## User-reported observations

The user reports both first opening and reopening initially froze, then became usable after an unspecified delay. Timeline visible: yes. File menu responds: yes. Audio Preflight visible: yes. Fan became faster for a while. A save prompt appeared, and the user explicitly confirmed choosing **Save**.

These are USER_STATED observations, not timed opening measurements or thermal telemetry. They remain distinct from the process samples collected afterward.

## Independently measured afterward

Existing Premiere PID **46156** was observed without computer-use/UI inspection calls. Seven process-only samples from **13:15:55 to 13:16:25 WIB** all returned `Responding=false`: 30.13 seconds of observation with **30.77 seconds of process CPU time** added, approximately one CPU core on average. This does not measure the entire opening delay because sampling began after the user's report.

A single additional hang capture was prepared, but the immediate pre-capture guard found the process responsive and stopped before invoking ProcDump. **No second dump was created; no process was terminated.**

Four later samples from **13:17:21 to 13:17:36 WIB** all returned `Responding=true`; process CPU increased only 0.47 seconds over this 15.09-second interval. Final title remained Positive_Signal_Test. Native timeline/menu usability was user reported, not re-inspected by automation.

This establishes recovery in the current session. It does not prove the current interval has the same stack or cause as the earlier captured BusyHang, and it does not rule out an accessibility interaction. No new inspection calls is not equivalent to demonstrating that every accessibility client was detached.

## User-saved project preserved

The current project SHA256 is `7bfc2f703ec78c5592f4150986a4635270feb6e197806f11d02d61f478d723ec`, differing from the earlier fixture's `6403c37515e1a96ff6e34b049e5845f21ba2d692e3bf2a8202d51737facf7012`. The source was last saved at 13:13:05 WIB. A separate byte-identical copy was created at:

`manual-control-20261028/Positive_Signal_Test-user-saved-7bfc2f703ec7.prproj`

The copy is 23,183 bytes; gzip decompression and XML parsing passed with root PremiereData and 4,121 elements. These container checks and the changed hash do not identify semantic edits or their cause. The user-saved source was not restored, overwritten or otherwise edited by the assistant.

The earlier captured-dump and scan/export reports remain historical evidence for their recorded versions. This follow-up does not retroactively change those observations or qualify reload reliability.

## Next bounded step

Keep the recovered session open. For a later timing control, use the preserved saved snapshot and record elapsed time from selecting Open until the File menu responds, with no new automated UI inspection during opening. Do not repeat opening/restart cycles merely to obtain a pass. Fan activity alone does not establish a thermal, GPU, or plugin defect.

Machine evidence: `manual-control-20261028/manual-control-result.json`, `process-samples.jsonl`, `recovery-samples.json`, `saved-snapshot.json` and `saved-snapshot-audit.json`. The aggregate adds this follow-up under `manualReopenControl` without replacing earlier evidence.
