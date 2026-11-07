# Finding pagination and lazy evidence validation

Date: 2026-10-27. Status: VERIFIED_THIS_SESSION for the bounded developer-loaded runtime and fixture below. This is not installation or release qualification.

## Implemented scope

`index.js` renders at most 25 findings per page, retains stable review annotations across pages, resets pagination and annotations on a new scan, and serializes raw evidence only when explicitly shown. Hiding raw evidence clears its rendered text. JSON and readable exports retain the entire report. `index.html` adds the page status and Previous/Next controls. Diagnostic and host-adapter modules are unchanged. Regression coverage is in `tests/beta.test.js` and `tests/recovery.test.js`.

## Runtime identity

- Source base: branch `codex/validated-beta-20261017`, HEAD `c7d63f7f568900d941acdb658ea1123c352ccb0e`, with uncommitted working-tree changes.
- Loaded developer stage: `artifacts/audio-preflight-0.2.1-48bb1d177f4c`.
- Runtime identity: `48bb1d177f4cb8ec4b8e90ff4d23fe618baec155a814db80f7b19e5d9096b28f`.
- Developer ZIP SHA256: `689df3d49c9987e4390c69ed4381cb7bd839ed448a1394b136e449db50e8dd3e`.
- Plugin: `com.unn0wn002.audio-preflight.beta`, version 0.2.1, Premiere Pro 26.5.2 / UXP 9.3-local. UDT build-folder registration was switched to the new stage; the older stage was preserved.

## Controlled checks

Direct Node commands corresponding to package scripts passed: `node --test tests/*.test.js` (56/56), `node tests/evaluate-fixtures.js` (6/6), and `node tests/check-syntax.js`. The tests cover complete page traversal, annotation retention, full exports, lazy evidence refresh, busy guards, cancellation and retry. These checks alone are not native host evidence.

## Native results

`pagination-native-harness.js` ran inside the actual loaded UXP panel using the real host adapter and the unchanged `Large_Inventory_Test.prproj`. It used programmatic DOM interaction, without mocks. `pagination-native-results.json` records 47/47 passing assertions: three complete scans, all 765 findings traversed in grouped order across 31 pages without omission, maximum 25 cards, annotation retention, lazy raw evidence, cancellation cleanup and complete retry/reset. Diagnostics deep-equal the earlier adapter-only large-fixture report.

| Run | Full scan wall time | Maximum sampled UXP timer gap | Cards rendered | Hidden raw characters |
| --- | ---: | ---: | ---: | ---: |
| 1 | 4,575 ms | 114 ms | 25 | 0 |
| 2 | 4,512 ms | 106 ms | 25 | 0 |
| 3 | 4,425 ms | 107 ms | 25 | 0 |

Maximum measured page-handler time was 17 ms. Explicitly showing, parsing and hiding raw evidence took 135 ms. Each full scan still had one sampled gap above 100 ms. The earlier unpaged run recorded a 599 ms maximum gap and 5,055 ms wall time; these same-session observations are bounded comparisons, not a controlled benchmark or an OS-wide responsiveness guarantee.

The harness ran with the panel floating. Physical interaction subsequently verified Next in the narrow docked panel, native Undock Panel and redocking with results preserved, and Previous returning to page 1. The dark layout wrapped within the approximately 324 px dock and 326 px floating panel. A physical floating resize attempt did not change the window dimensions; this attempt does not establish new larger-floating-size coverage.

Actual native Save As exports produced `pagination-export.json` (26,308,531 bytes) and `pagination-export.html` (32,011,500 bytes). Exported JSON deep-equals the complete native retry report. Decoded HTML raw evidence deep-equals that JSON, and HTML contains all 765 finding articles. See `pagination-export-validation.json`. No browser visual-render qualification is inferred from content validation.

## Preserved state and limits

Premiere PID 37304 remained responsive after testing. All three saved fixture hashes match their pre-patch values; see `pagination-summary.json`. No project edits, restart, preference/cache changes, commit, push or release were performed for this patch. The panel was left docked on page 1 with the complete large-fixture report available.

The earlier project-opening/nonresponse incident was not reproduced in this existing responsive session; its root cause remains UNKNOWN. This patch addresses measured finding-render overhead, without claiming to fix that incident. Output-bus topology, source-channel mapping and end-to-end playback/export correctness remain the report's three capability unknowns. Developer loading does not qualify customer installation.
