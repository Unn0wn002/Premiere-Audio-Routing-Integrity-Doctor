# English / Japanese interface (2026-11-02, Claude Sonnet 5.5)

Branch `ui/japanese-20261102`, built on `main` (result view 0.3.0 already merged). Still version `0.3.0`, **not packaged**: the
packaged CCX (K01) covers only 0.2.1 and installed-context cases I01-I06 are still NOT_RUN.

## What changed (display only)
- A language button in the panel header (shows the other language's name) switches the whole panel without re-scanning:
  title, buttons, section titles, status lines, counters, scope line, timeline notes and legend, Show chips, finding headings,
  fixed explanation and remediation texts, review state, export messages and the readable HTML report.
- Default: the saved choice, else Japanese when the host UI locale starts with `ja`, else English. The choice is kept in the panel's
  local storage (nothing else is stored). On this machine (English host) the panel starts in English.
- **Not translated by design**: the JSON evidence and the raw evidence view (so reports stay comparable), the scanner and the
  diagnostic rules, project/sequence/track/clip names and paths, host error text, and the `observed` text of Unknown findings
  (it carries what the host reported). Fixed observed sentences of ARID-001, 002, 003, I01 and the cancelled notice are translated.
- Code: texts and `localizeFinding` in `src/report.js` (no new runtime file, so the 7-file packaging allowlist is unchanged);
  `index.js` keeps status lines as functions so a switch redraws them; `index.html` gained ids and the language button.
- The Japanese wording has NOT been reviewed by a native speaker.

## Checks
| Check | Result | Evidence |
|---|---|---|
| Unit tests: 91 pass / 0 fail / 0 skipped (9 new in `tests/language.test.js`: same keys and placeholders in both languages, every rule translated and English unchanged, helpers, readable report, panel default/saved/host-locale choice, switch redraw, failed scan, export messages) | PASS (test doubles, not host evidence) | `npm test` |
| Native, Premiere 26.5.2.5, temporary test copy loaded through UXP Developer Tools (removed afterwards), project `Large_1024.prproj`: scan, switch to Japanese, switch back | PASS_BOUNDED_NATIVE (floating panel, about 475 px wide) | `01`-`07` images |
| Japanese: status, counters, scope line, coverage, timeline notes, legend, finding I01 and Unknown finding, review state, Show status "既に開いています：シーケンス「…」。" | PASS_BOUNDED_NATIVE | `02`-`06` |
| A finding with a clip location (ARID-003/002) in Japanese; the readable HTML report in Japanese opened in a browser; export dialogs | NOT_RUN natively (unit-tested only) | n/a |
| Docked at a narrow width, real multichannel material, installed-context cases | NOT_RUN | n/a |

Note: the floating panel could not be made taller in this session (it stayed about 265 px high), so the panel was scrolled.
Scanning `Large_1024.prproj` took 6205 ms. No project was saved or changed.
