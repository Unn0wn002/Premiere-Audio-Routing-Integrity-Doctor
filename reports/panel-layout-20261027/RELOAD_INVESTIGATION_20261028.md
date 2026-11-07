# Project reload investigation — 28 October 2026

Result: the previous project/revert nonresponse remains unresolved. A fresh independent empty-project close/reopen control passed in the current responsive session. No runtime fix is justified by the evidence collected so far.

## Current source and preserved state

The checkout is on `codex/validated-beta-20261017`, HEAD `9330e242eadcd10623300ca39d01753355aefc7a` (pagination implementation). This is newer than the earlier captured base `c7d63f7`; no new commit was made by this investigation. Installed runtime remains the previously verified `48bb1d177f4c` candidate. No application source, installed binaries, preferences, caches, fonts or canonical WBS were edited.

Premiere PID 11556 was responsive on the user-opened Positive_Signal_Test at the beginning and end. The existing report and user-exported JSON/HTML were preserved. No scan, export, forced termination or restart occurred during this investigation. The original project remained open while the independent control was created, closed and reopened; it was restored as the active project afterward, without an unsaved edit marker.

## Fixture checks

Independent gzip decompression and XML parsing passed for Positive_Signal_Test, Layout_Test_Copy and the new control. All three unique source WAV paths referenced by the audio fixtures exist; the peak-file references checked also exist. This rules out a damaged gzip/XML container and missing referenced paths in this inspection. It does not establish every serialized Premiere object or media-decoder state as healthy.

Saved hashes:

- Positive_Signal_Test: `6403c37515e1a96ff6e34b049e5845f21ba2d692e3bf2a8202d51737facf7012` (unchanged).
- Layout_Test_Copy: `f243358de98eb0024a0364eb6f8a90a7d8ef1b5250db2169ae2ec1d973e82a8e` (unchanged).
- New reload-control-20261028: `4ec4a6a959676f5f36b7f27ae0b1f984c4d1302afe28dd2f59daa63efb626aad` (unchanged across close/reopen).

Machine evidence: `reload-fixture-audit-20261028.json`.

## Independent native control

Created `reload-control-20261028.prproj` through File > New > Project with Template=None and Skip import mode. It was saved only in this evidence directory. XML inspection confirms zero sequence objects and zero source-media path references. This is a new native project, not a renamed or rewritten copy of the audio fixture.

Closed only the control project, then reopened its exact path through File > Open Recent. It appeared as the active project, its empty bin was visible, a native Window menu opened, and the process reported Responding=true. Audio Preflight remained open and idle, displaying its explicitly named earlier Positive_Signal_Test report; no control-project scan was invoked. Closed only the control again and returned to the original project/bin view. The original project was not reopened or reverted.

Scope: this is one warm, same-process, multi-project control with the original audio project still loaded. It is not a cold-start test, a test with Audio Preflight unloaded, a reproduction of File > Revert, or proof that the original fixture is defective. It demonstrates that not every native project close/reopen triggers the sustained freeze.

## Logs and code inspection

Read selected failure lines and counts from these existing UXP logs, without copying entire logs or unrelated account data:

| Log/session | Beta-ID mentions | Home fallback errors | Failed Home containers |
| --- | ---: | ---: | ---: |
| 28 Oct 11:44:47, earlier nonresponsive opening | 1 | 2 | 2 |
| 28 Oct 11:49:37, earlier revert session | 1 | 2 | 2 |
| 27 Oct 12:29:28, session with successful bounded native tests | 6 | 2 | 2 |

These report Home Yukon fallback/container failures and other Adobe-owned UI/manifest warnings. The same Home errors occur in a session that also completed tests. No error line attributing a failure to the beta was found in the selected reviewed evidence. That is not proof of its absence: the current 12:01 UXP log is zero bytes, and these logs do not include native thread stacks.

Windows Application events returned an older 27 October 01:16 AppHangB1 for Premiere 26.5.2.5, not a new causal stack for the latest revert incident. The native plugin-loading log ended after its normal module scan; it did not identify the blocked native call.

Current `index.js` binds handlers during panel create/show. `scanActiveProject` runs only from the Scan button handler. No automatic project-opening/reload scan, polling interval or project-switch event subscription exists in the inspected panel module. This makes an automatic scan trigger unsupported as an explanation; it does not rule out every UXP/host lifecycle interaction. The earlier unchanged-fixture experiment with both developer registrations unloaded remains historical evidence, separately scoped to that runtime/session.

## Decision and next discriminating evidence

Do not reset preferences, clear caches, rewrite fixtures, change the plugin ID or change scanner logic based on these results. The current scan/export passes remain valid within their recorded scope; project reload stability remains unqualified.

The next useful evidence is a native hang capture during a single controlled reproduction, with before/after process identity and an exact action log. No debugger/capture CLI (`windbg`, `cdb`, `procdump`) was found on PATH; no tool was downloaded or installed, and no memory dump was captured. Microsoft documents ProcDump's hung-window trigger (`-h`) and mini-dump capture: https://learn.microsoft.com/en-us/sysinternals/downloads/procdump. A capture can support native stack analysis; it does not itself prove a plugin defect. Prepare capture first, then reproduce once on a disposable project; preserve and analyze evidence before any guarded recovery. No further speculative reload attempts were made in this session.

Final state: Positive_Signal_Test open without an edit marker, installed Audio Preflight panel docked, PID 11556 responsive, original fixture and user exports unchanged. The new empty control is preserved in this directory for a future paired test.
