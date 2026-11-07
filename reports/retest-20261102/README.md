# Retests of the result view (2026-11-02, Claude Sonnet 5.5)

Branch `ui/result-view-20261101` (PR #3), version 0.3.0, not packaged. Premiere 26.5.2.5, UDT, temporary plugin copy with another id
(`...retesttest`, removed afterwards). Disposable projects only: `_qa_scratch\Large_1024.prproj` (a byte-identical copy of the 1,024-clip
`stage-1024-30fps.prproj` evidence project; the evidence file itself was never opened) and the earlier `mid_v030c` / `mid_mask_test`
projects. The deletions and edits made in them were undone or discarded; no project was saved.

## Results (PASS_BOUNDED_NATIVE unless stated)
| # | Retest | Result | Image |
|---|---|---|---|
| 1 | Large project (1,024 clips on A1) | Scan completed in 6.4-6.5 s (1,024/1,024 clips, 4,096 components). **Flaw found:** the timeline drew only the first 300 clips and said "724 clips not drawn", so a disabled or flagged clip further along could have been hidden. **Fixed** (below) and re-checked | 01, 08 |
| 2 | Narrow width (floating panel about 330 px wide; not an actual dock) | Counters, wrapped text, export buttons, timeline map, legend, finding cards and the Show chip with a long name all fit; no overflow | 06, 07 |
| 3 | Cancelled scan | Native: "Scan cancelled. Unvisited state has not been checked. Diagnostic status: PARTIAL." (157-258 ms, 20-37 clips), counters 0 / 8 / 1. **Flaw found:** the timeline stretched the few observed clips over the whole lane as if complete. **Fixed** (below) and re-checked. Failed scan: unit-tested only | 02, 09 |
| 4 | Show on a stale scan | Findings from `mid_mask_test`, then another project made active: "Could not show it: Sequence not found. It may have changed since the scan; scan again." | 04 |
| - | Empty project (0 sequences) | Counters 0 / 3 / 0, scope "0 sequences · 0 audio tracks · 0 clips", no timeline section | 05 |
| - | Cancel responsiveness | Installed panel and the retest copy both cancelled one second into the same 1,024-clip scan (1,181 ms/174 clips and 1,175 ms/180 clips). Earlier missed Cancel clicks were timing in the automation (clicks right after switching windows were dropped), not the plugin | 10, 11 |

## Fixes made because of the retests (82 tests pass, 0 skipped; 3 new)
- **Dense tracks:** above 300 clips on a track (or a shared budget of 1,200 blocks) the timeline draws every disabled or review-flagged clip individually and
  groups all other clips into spans, so the lane keeps its full coverage and nothing that needs review is hidden. 1,024 clips become one span labelled
  "1024 clips" plus any flagged clip, computed in about 2 ms. The note reads "N clips grouped into spans".
- **Incomplete scans:** cancelled, partial or failed scans add "scan incomplete: only the observed clips are drawn" to each sequence line.

## Observations (not changed)
- After deleting a sequence in Premiere, the API kept returning it for a moment: Show answered "Already open: sequence ..." for the deleted
  sequence (image 03). A later scan of the same project correctly reported 0 sequences. Show can only relay what the host says.
- With two or three projects open, clicking a timeline tab of another project makes that project the active one for every scan and Show; the summary
  line names the scanned project.

## Not covered
Real multichannel material, an actual docked panel (only the width was emulated), installed-context cases I01-I06 (need a clean profile), packaging of this runtime,
a failed scan natively, Japanese (the Audio Doctor is English only).
