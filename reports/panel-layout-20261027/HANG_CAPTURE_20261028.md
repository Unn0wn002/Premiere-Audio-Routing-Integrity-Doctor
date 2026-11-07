# Premiere close/reopen hang capture — 28 October 2026

**VERIFIED_THIS_SESSION: the warm close/reopen hang reproduced and one local mini dump was captured. Root cause remains UNKNOWN.**

## Controlled trial

- Source HEAD: `9330e242eadcd10623300ca39d01753355aefc7a`.
- Installed Audio Preflight 0.2.1 runtime: `48bb1d177f4cb8ec4b8e90ff4d23fe618baec155a814db80f7b19e5d9096b28f`; installed runtime files rechecked against its preserved receipt.
- Target: existing Premiere 26.5.2 process PID 11556, initially responsive with the saved disposable `Positive_Signal_Test` project. No edit marker was present.
- Closed the sole active project without a save prompt, then selected its exact saved path through native **File > Open Recent**. The panel was open and idle; UDT was absent. No new scan or export was invoked.
- The saved timeline and retained earlier report became visible. Premiere subsequently showed **Not Responding**, with repeated process checks reporting `Responding=false`.
- This is one warm close/reopen trial. It does not establish cold-start behavior or isolate the installed plugin from other host components.

## Capture and structural checks

Microsoft-signed portable ProcDump 12.02 monitored only PID 11556 for one hung-window mini dump. Automatic target termination and WER upload were disabled. Tool provenance and SHA256 are in `hang-capture-tool-verification.json`; Microsoft documents the flags at [ProcDump](https://learn.microsoft.com/en-us/sysinternals/downloads/procdump).

Capture log: hung window at **12:44:49 WIB**, dump completed at **12:44:51 WIB**, then the one-dump monitor exited. The dump header timestamp is 05:44:50 UTC.

| Item | Verified value |
| --- | --- |
| File | `hang-capture-20261028/premiere-11556-reopen-mini.dmp` |
| Bytes | 201,778,984 |
| SHA256 | `a4d00b0ba45ceb2e2642913f0d99dcbaac69ad8ca656f52bd6ddf7d62cd33b21` |
| Signature / architecture / PID | `MDMP` / AMD64 / 11556 |
| Directory entries / modules / threads | 20 / 340 / 198 |
| Exception stream | Absent; this was a hang capture |

The metadata inspector validated header signature, stream bounds, thread context locations and recorded stack ranges. It outputs module basenames and instruction offsets without printing captured memory. Its output is `hang-capture-20261028/dump-metadata.json`; its reproducible source is `inspect-dump-metadata.cjs` in the same directory.

**These are structural checks, not symbolized stack unwinds.** Thread order and raw instruction pointers do not establish the UI thread, a deadlock, or plugin causality. A mini dump may omit additional object data needed for diagnosis. The process dump stays local and has not been uploaded or committed.

The now-flushed UXP log for the stalled session contains one beta registration mention and no lines matching the selected uncaught/unhandled/fatal/deadlock keywords. This limited keyword review does not establish absence of errors or identify the cause.

## Recovery and preservation

After the completed dump, the still-stalled PID 11556 was terminated under exact executable-path, expected fixture-title, absent edit-marker, nonresponsive-state, completed-capture and unchanged saved-fixture guards. Premiere was relaunched without opening a project. New PID **38540** reports `Responding=true`; the native window inventory returned `Adobe Premiere`.

Home UI verification could not complete: the computer-use helper returned `foreground window did not report a process id` twice, including after fresh window selection. Further app input stopped. Recovery is therefore verified at process level only; no new responsive-project or scan claim is made. The capture monitor is no longer running.

SHA256 checks confirm all six preserved files are unchanged: original layout fixture, positive-signal fixture, large fixture, independent empty control, user-exported JSON and user-exported HTML. The installed runtime still matches. No source implementation, preferences, cache, fixture audio states or canonical WBS were changed.

## Next evidence required

Analyze this saved dump's thread stacks with a native debugger and available symbols before selecting another reproduction or code patch. No `cdb.exe`, `windbg.exe` or `WinDbgX.exe` was found on PATH; the three checked standard Windows Kits debugger paths are absent. This is a bounded availability check, not an exhaustive machine inventory.

Earlier scan/export and docked/floating results remain bounded successes. Project reload reliability remains **BLOCKED / root cause UNKNOWN**. Clean-profile installation, upgrade/uninstall and the scanner's routing, mapping and playback capability unknowns remain unqualified.

Machine evidence: `hang-capture-summary-20261028.json`, `hang-capture-20261028/monitor-stdout.txt` (UTF-16LE), process observations and recovery records in that directory. Historical records remain intact; the aggregate `session-result.json` adds this trial under `hangCaptureValidation`.

## Subsequent native stack analysis

The later authorized analysis completed with locally extracted Microsoft-signed CDB and verified Windows PDBs. All 198 captured threads were unwound. The debugger classified a BusyHang in Premiere; the UI thread contains a Windows UI Automation/MSAA callback into Adobe native frames. Adobe private symbols and the initiating accessibility client remain unknown. The previously missing-debugger/analysis-not-run limitation above records the original capture stage and is superseded for this later analysis only. Full findings and a prepared manual control: `NATIVE_HANG_ANALYSIS_20261028.md`; machine evidence: `hang-capture-20261028/native-analysis-summary.json`. No new native reproduction or source fix was attempted.
