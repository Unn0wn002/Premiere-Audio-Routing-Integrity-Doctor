# Native check: grouped timeline span without bar text (2026-11-02)

Class: PASS_BOUNDED_NATIVE for the floating panel at about 320 px wide (screen pixels at the machine's scaling), Premiere 26.5.2.5.
Commit under test: `fa08cad` on `ui/report-fixes-20261102` (built into a temporary test copy loaded through UXP Developer Tools; removed afterwards).

Setup: a byte-identical copy of the 1,024-clip project (`R2_Test_Copy.prproj`, sha256 544b63d0...), track A1 muted and the first clip disabled (Shift+E). Nothing was saved; the copy was closed with "Don't Save". The original `Large_1024.prproj` was not touched.

| Check | Result | Evidence |
|---|---|---|
| Japanese scan with A1 muted only: 1 review finding; the A1 lane is one rose span with no text | PASS_BOUNDED_NATIVE (the lane itself was seen on screen; only the scan summary `01` was saved as an image) | `01` |
| Muted A1 plus a disabled first clip: 2 review findings; the disabled clip is drawn as its own amber block at the left edge on top of the rose span; the span carries no text, so no digit is covered; the note above reads "1023 件のクリップをまとめて表示" | PASS_BOUNDED_NATIVE (this is the case that failed in the second Codex check) | `02`, `03` |
| Hover tooltip of the span | NOT_RUN (tooltips are not observable in this setup) | unit-tested |
| Docked (not floating) at this width | NOT_RUN | n/a |
