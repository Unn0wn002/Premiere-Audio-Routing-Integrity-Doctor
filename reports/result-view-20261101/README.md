# Result view upgrade: counters, Show chips, audio timeline (2026-11-02, Claude Sonnet 5.5)

Branch `ui/result-view-20261101`, built on the colour-badge branch (`ui/readability-20261101`, PR #2). Version `0.3.0`
(manifest and package.json). **This runtime is not packaged**: the packaged CCX (K01) still covers only 0.2.1, and
installed-context cases I01-I06 are still NOT_RUN.

## What changed (display plus one view-only action; diagnosis, rules and the scanner are untouched)
- **Counters** above the findings: To review / Unknown / Information, and a scope line ("4 sequences · 12 audio tracks · 2 clips").
- **Findings**: header text and card border are coloured by severity (Warning orange, Review amber, Information blue-grey,
  Unknown grey); card class names, header text and review controls are unchanged.
- **Show chips** (wrapping chips with shortened names, never fixed-height buttons): clip findings open the sequence and put the
  playhead on the clip start; track and sequence findings open the sequence; project-level findings have no chip.
- **Audio timeline**: a lane per non-empty audio track with a block per clip, positioned by start and end time on the sequence's
  observed length. Amber = disabled clip, red outline = clip named by a review finding, rose = clip on a muted track. Block labels
  fit the block width; names and states are also in the tooltip. Clicking a block does the same as a clip Show chip. Dense tracks (more than 300
  clips) group normal clips into spans and always draw disabled/flagged clips one by one (changed after the retests, see `reports/retest-20261102/`).
- `src/premiereAdapter.js` gained `showLocation` (open sequence + move playhead). It is the **only** function that calls
  `setActiveSequence` / `setPlayerPosition`; a test fails if either appears anywhere else, and the scanner never calls it.
  It changes which sequence is open and where the playhead is, never the project content.
- All new logic is in the existing files (`src/report.js`, `index.js`, `index.html`, `src/premiereAdapter.js`), so the 7-file packaging
  allowlist is unchanged.

## Automated (test doubles, not host evidence)
79 tests pass, 0 skipped (66 before + 13 in `tests/result-view.test.js`): counters, scope line, Show targets, map layout/flags/cap/
repeated sequence names, panel rendering with the existing fake DOM, Show calls and error path, stale chips ignored during a scan,
`showLocation` with mocks (guid lookup, already-active, occurrence-index fallback, missing sequence/project/factory), and the guard
that confines the two view calls. `npm run check:syntax` and the 6 fixtures pass.

## Native (Premiere 26.5.2.5, UDT, project `mid_v030c.prproj`, disposable; PASS_BOUNDED_NATIVE)
Loaded as a **temporary test copy** with another plugin id (`...resultviewtest`), because the installed Audio Preflight must stay
untouched; the copy was unloaded, removed from UDT and deleted afterwards. The mute and disable used for the checks were undone and
the project was not saved.

| Case | Result | Image |
|---|---|---|
| Counters, scope line and timeline after a scan (no findings) | 0 / 3 / 4; "4 sequences · 12 audio tracks · 2 clips"; grey badge; lanes for the Roblox and twosub clips | 01 |
| A1 muted + its clip disabled in the Roblox sequence | Amber badge, 2 to review; Warning ARID-001 (orange header and border), Review ARID-003 (amber); clip block amber with red outline | 02, 03, 06 |
| Show chip on a finding while another sequence is active | Premiere switched to the Roblox sequence; status "Opened: sequence ..." | 03, 04 |
| Click the clip block in the timeline | Playhead moved from 00:00:00:02 to 00:00:00:00; status "Playhead moved to ..." | 05 |
| Long names (`Roblox-2026-10-13T17_38_49.629Z.mp4`) | Shortened with the ending kept; chips and labels inside the card | 03, 06 |
| States reverted | 0 to review, grey badge, normal clip colour | 07 |
| Clip on a muted track | First version (lane opacity/background) was not visible because the clip fills the lane; changed to a rose clip colour and legend "On a muted track"; confirmed natively | 08 |

Images 04 and 05 are full screenshots; the others are panel crops. They contain file names of the owner's own recording only.

## Findings during the native run
- Premiere had **two projects open** (`mid_v030c` and `mid_mask_test`). Clicking a timeline tab of the other project made it the active
  project, so one scan covered that one (the summary line shows the project name: use it to check which project was scanned).
- Opening Premiere windows or dialogs for UDT through automation needed the taskbar group; nothing in the plugin depends on that.

## Not covered
Japanese UI (the Audio Doctor is English only); real multichannel material; packaging of this runtime. The 1,024-clip fixture, a narrow (330 px)
floating panel, cancelled scans and Show after the scan went stale were retested afterwards: `reports/retest-20261102/README.md`.
