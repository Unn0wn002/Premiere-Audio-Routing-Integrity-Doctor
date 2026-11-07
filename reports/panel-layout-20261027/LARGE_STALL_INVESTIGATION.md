# Large-project stall investigation — 27 October 2026

**Result: opening stall NOT REPRODUCED in the existing responsive session. Original root cause remains UNKNOWN. A measurable UI/event-loop pause remains.** No production runtime fix was applied.

## Controlled conditions

The same saved `Large_Inventory_Test.prproj` was opened through Premiere's native Open Project dialog in the already-responsive PID 37304 session. Both developer registrations were unloaded before opening. The positive-control project had been saved; no restart, preference reset, cache cleanup, driver change or project rewrite occurred.

Premiere displayed the large project's timeline and populated Learn panel. Responding=true and an opening native Window menu confirmed interaction. This differs from earlier failed launch/reopen attempts, which also affected the smaller fixture. It does not identify which environmental or session difference caused those failures.

Large fixture SHA256 remained `850A5354A3248815974526DE640E2B040B927505EC7D5895C0BE10B3FA046249`. Positive fixture SHA256 remained `6403C37515E1A96FF6E34B049E5845F21BA2D692E3BF2A8202D51737FACF7012`.

## Separate adapter/report construction control

The beta was loaded after successful opening. `large-isolation-harness.js` ran from its native UDT console. It invoked the real adapter and report helpers without invoking the panel renderer, then saved its full record via the plugin data folder.

| Stage | Measured wall time |
| --- | --- |
| Adapter traversal | 4,286 ms |
| Diagnostics | 61 ms |
| JSON serialization | 61 ms |
| HTML generation | 151 ms |

Traversal coverage was COMPLETE: 256 sequences, 771 tracks, 511 clip occurrences, 2,034 components; zero failed reads. Findings: 506 risks, 256 information entries, three capability unknowns. JSON was 26,308,531 characters; HTML 32,010,728 characters. These are character counts, not encoded file byte sizes. Host remained responsive after this control.

## Full native panel path

`large-panel-recheck.js` reused the existing real-host cancellation/full-retry harness, adding durable evidence storage. No scan delay, mocks, or scanner-source edits were introduced. UI events in this harness were programmatic DOM events.

| Measurement | Result |
| --- | --- |
| Functional assertions | 13/13 PASS |
| Mid-inventory cancel | Requested at 100 ms; retained five sequences |
| Cancel wall time / request-to-idle | 125 ms / 25 ms |
| Cancel maximum sampled timer gap | 25 ms |
| Full retry adapter / wall time | 4,485 ms / 5,055 ms |
| Full retry maximum sampled timer gap | 599 ms; one gap over 100 ms |
| Full retry coverage | COMPLETE, zero failed reads |
| Diagnostics compared with adapter-only run | Deep-equal |

The retained floating report displayed 506 findings and three unknowns. Floating-to-docked movement retained it. A subsequent direct mouse click on docked Scan completed with an adapter duration of **4,691 ms**, COMPLETE coverage and the same visible counts. Host process remained Responding=true after both panel runs. Final working set was approximately 3.47 GB; this is whole-process memory with retained debugger records and does not establish a leak or a component's allocation cost.

## Interpretation and smallest next patch

- VERIFIED_THIS_SESSION: this unchanged fixture opens in the existing responsive session; adapter-only traversal, diagnostics, serialization, cancellation/full retry and another docked scan complete without sustained host nonresponse.
- HISTORICAL_RECORDED: earlier opening and post-scan nonresponse remains preserved. It is not erased or relabeled a pass.
- UNKNOWN: original sustained-stall cause; differences between earlier launch paths and this session. The new test does not show that automation, the file, the host, or report rendering alone caused it.
- Measured remaining limitation: a 599 ms UXP timer gap. Timer scheduling differs from its requested 5 ms interval, and this is not an OS-wide mouse-latency measurement. No broad responsiveness certification is made.
- PROPOSED performance patch: bound the number of finding cards rendered at once and serialize raw evidence only when opened. Current `index.js` eagerly serializes the complete report and creates all 765 finding cards. This is a code-backed candidate for reducing UI work, not a demonstrated fix for the earlier opening stall. Keep the complete report and exports intact; validate annotations across pages, counts/unknowns, cancel/retry, and native full-report equality. No such patch was made in this investigation.

## Evidence and final state

`large-stable-open-process.json`, `large-adapter-only-process.json`, `large-isolation-native.json`, `large-panel-recheck-native.json`, both saved harness sources, and `large-recheck-summary.json` contain the bounded evidence. Native originals remain in the beta plugin data folder. JSON parsing and diagnostic deep equality were checked after copying.

Premiere was left open and responsive with the unchanged large test fixture and beta panel docked. No forced termination, restart, project mutation, commit, push, release, installation or canonical WBS edit occurred in this investigation.
