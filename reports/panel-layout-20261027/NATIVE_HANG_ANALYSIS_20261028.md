# Native analysis of the captured Premiere hang

**VERIFIED_THIS_SESSION:** Microsoft CDB unwound all **198 threads** in the preserved dump and classified it as `APPLICATION_HANG_BusyHang_cfffffff_Adobe_Premiere_Pro.exe!Unknown`. The captured UI thread is inside a Windows accessibility callback into Premiere. **The initiating client and exact defective function remain UNKNOWN. No fix is established.**

## Evidence and confidence

The dump remains `a4d00b0ba45ceb2e2642913f0d99dcbaac69ad8ca656f52bd6ddf7d62cd33b21`, PID 11556, captured on 28 October at 12:44:50 WIB. This analysis opened the saved dump only; it never attached to the currently running Premiere process.

The current Microsoft WinDbg distribution was obtained through the [official download](https://learn.microsoft.com/en-us/windows-hardware/drivers/debugger/). Only its amd64 debugger files were extracted locally; no app registration or system installation was performed. CDB, DbgEng, DbgHelp, SymSrv and the analysis extension all have valid Microsoft signatures. Engine version: **10.0.29661.1004 AMD64**. Provenance, versions and hashes are recorded in `debugger-tools/debugger-verification.json`.

Windows PDBs were fetched from the [Microsoft public symbol server](https://learn.microsoft.com/en-us/windows-hardware/drivers/debugger/microsoft-public-symbols) into a local cache. Native module output verifies PDB symbols for ntdll, UIAutomationCore, oleacc and user32. Adobe Premiere Pro 26.5.2.5 has **export symbols only**; its private PDB was unavailable. The dump was not uploaded.

The final symbol analysis, cached stack analysis and focused symbol verification each exited **0**. An earlier offline attempt lacked OS PDBs and generated a WRONG_SYMBOLS result; that log is preserved but excluded from the findings below. The final symbol-assisted analysis has no WRONG_SYMBOLS result.

## What the threads show

Thread **0 / OS TID 31364 (0x7a84)** contains Premiere's message loop and window-procedure callbacks. Its calling path, from the message loop toward the executing Adobe frame, is:

```text
user32!GetMessageW
  -> uiautomationcore!HookMessageWndProc / HandleHookMessage
  -> uiautomationcore!InProcProxyEventManager::TranslateWinEvents
  -> uiautomationcore!BuiltinProxyFactory::TryCreateProxy / CreateMsaaProxy
  -> oleacc!AccessibleObjectFromWindowTimeout
  -> user32!SendMessageTimeoutW / UserCallWinProcCheckWow
  -> repeated Adobe native frames
  -> Adobe_Premiere_Pro+0x176ffb9e
```

This is observed stack evidence of accessibility event/proxy handling at the capture instant. Microsoft's [AccessibleObjectFromWindow documentation](https://learn.microsoft.com/en-us/windows/win32/api/oleacc/nf-oleacc-accessibleobjectfromwindow) describes this API family as retrieving an interface for a window-associated object. The exact internal Adobe function cannot be named from the available symbols.

Other relevant captured threads:

| Thread index / OS TID | Observed path |
| --- | --- |
| 99 / 36948 (0x9054) | UIAutomationCore incoming request -> `HwndUtils::SendWmGetObject` -> `SendMessageTimeoutW` -> `NtUserMessageCall` |
| 182 / 46536 (0xb5c8) | UIAutomationCore event dispatch -> `PerformOperationOnHwndThread` -> `SendMessageTimeoutW` -> `NtUserMessageCall` |
| 110 / 29988 (0x7524) | Named UXP Database Thread; waiting in a condition-variable path |
| 133 / 39216 (0x9930) | Named UXP COM Thread; waiting in a condition-variable path |
| 141 / 37720 (0x9358) | Named Background DOM Loader Thread - UXP JavaScript Thread; waiting in a condition-variable path |

The three explicitly named UXP threads are waiting in this snapshot. That does not establish the state of every UXP operation or exonerate a plugin. No new scan or export was invoked during the captured reproduction, as recorded in the preceding trial evidence.

## Interpretation and limits

**Strong lead / inference:** a Premiere accessibility interaction, potentially affected by automated inspection, merits an independent control. This is consistent with the captured UI Automation/MSAA path. It does not identify which accessibility client initiated the request; an in-process UIAutomationCore stack alone cannot identify an external caller.

The automated BusyHang classification is a heuristic, not a causal verdict. The dump does not establish a deadlock cycle, a specific plugin fault, a GPU fault, a corrupt project, or a root-cause fix.

Large offsets printed after exported names such as `pion::algorithm::xml_encode+0x93160a` and `boost::serialization::singleton_module::unlock` are nearest-export labels. They **must not** be interpreted as proof that the actual internal function is an XML encoder or serialization lock. Adobe private symbols are required for that attribution. The raw instruction offset is retained for accurate follow-up.

No runtime patch is justified by this dump alone. Current source HEAD remains `9330e242eadcd10623300ca39d01753355aefc7a`. Native reload reliability remains unqualified.

## Smallest next control — prepared, not run

1. In the current Premiere session, the operator manually opens the unchanged disposable `Positive_Signal_Test.prproj` from this report directory. If the host is already on that saved project, manually close and reopen it once. Do not discard unrelated unsaved work.
2. During opening, issue **no new computer-use or accessibility-inspection calls**. Collect process-only responsiveness samples, then have the operator verify that the timeline appears and a menu responds. Record the precise path and whether the installed panel is visible.
3. Treat a responsive trial as one bounded counterexample. Avoiding new inspection calls does not prove that all accessibility clients are detached. If it hangs, preserve one comparable capture and stop the trial; do not enter a restart/reopen loop.

This control requires the operator's manual opening step; it has **not** run during the dump analysis. No Windows accessibility settings, preferences, caches, plugin registrations or project contents need to change.

## Artifacts and final state

- `hang-capture-20261028/native-stack-analysis-symbols.txt`: completed symbol-assisted analysis and all thread stacks.
- `hang-capture-20261028/native-stack-analysis-cached.txt`: focused UI/accessibility thread stacks and named-thread inventory.
- `hang-capture-20261028/native-symbol-verification.txt`: PDB status for the relevant Windows modules.
- `hang-capture-20261028/native-analysis-summary.json`: structured findings and per-thread summary.
- `hang-capture-20261028/summarize-native-analysis.cjs`: reproducible checks and summary extraction.
- `debugger-tools/debugger-verification.json`: downloaded tool provenance and signatures.

Premiere PID 38540 remained responsive through process-only checks. No computer-use input, live debugging attachment, process termination, fixture edit, plugin implementation edit, or canonical WBS change occurred during this analysis. Saved fixture/report hashes are rechecked in `native-analysis-preservation.json` in the capture directory.
