# Readability pass — colour-coded result badge (2026-11-01)

Branch: `ui/readability-20261101`, cut from local `9330e24` on `codex/validated-beta-20261017`.

## What changed (display only)

- `17dbcc1` baseline: commits the UI (`index.html`, `index.js`) of frozen runtime
  `artifacts/audio-preflight-0.2.1-037571056922` plus its matching `tests/beta.test.js` and
  `tests/recovery.test.js`, which were uncommitted. Verified identical to the stage apart from CRLF.
- `e47d644` badge: the status line becomes a coloured badge after a scan.
- `c74a4aa` stricter rule in `src/report.js` `resultTone()`:
  red = scan failed; amber = review findings; grey = any unknowns, not COMPLETE, or no report;
  green only for a COMPLETE scan with zero findings AND zero unknowns.

No diagnosis, rule, export or JSON field changed.

## Checks

| Check | Result | Class |
|---|---|---|
| `npm test` | 63 tests: 59 pass, 0 fail, 4 skipped (PowerShell 7 not installed) | VERIFIED_THIS_SESSION |
| `tests/readability.test.js` (5 tone tests) | pass | VERIFIED_THIS_SESSION |
| Native, Premiere 26.5.2.5, test copy loaded via UDT, `mid_test.prproj` | before `c74a4aa`: badge was GREEN with 0 findings / 3 unknowns (led to the stricter rule). After: badge GREY, same scan. Screenshot `badge-grey-unknowns.jpg` | VERIFIED_THIS_SESSION |
| Green / amber / red seen natively | not exercised natively (covered by unit tests only) | NOT_RUN |

The native test used a temporary copy with a different manifest id
(`com.unn0wn002.audio-preflight.readabilitytest`). It was unloaded, removed from UDT and deleted afterwards.
The installed private beta was not changed.

## Limits

- The CCX K01 evidence still describes the frozen 0.2.1 package; this branch's runtime is **not packaged**.
- Japanese UI was not added to this plugin.
