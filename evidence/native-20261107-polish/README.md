# Native check: polished Audio Preflight build (U4, 2026-11-07, Claude Code via computer use)

Class: PASS_ARCHIVE_INTEGRITY (CCX) and PASS_BOUNDED_NATIVE (development load, DOM read), Premiere Pro 26.5.2 on one Windows machine. Screenshots were viewed and not saved; the console output is recorded here.

## Package
- Source: local branch `polish/lang-aria-20261107` (commit `21f23ec`), version 0.3.0 unchanged, staging identity `0a90b97428d3ca72a73a13512d1fafb42fae37ae4e8a2ed3bca5cf4608fe07dd`.
- CCX made with the UXP Developer Tools Package action: `com.unn0wn002.audio-preflight.beta_premierepro.ccx`, 27,564 bytes, sha256 `183378d1a6202ffc92d05ebbb1181a22002211c70ac2315308eacb94e07519fa`.
- `scripts/verify-package.ps1 -AllowManifestReformat` against the receipt: `runtimeMatchesStaging` true, manifest values equal; archive integrity only, installation not qualified. (`developerArchiveHashMatches` is false because the package is a CCX, not the developer ZIP.)

## Native check (dev-loaded exact staging build via UDT into Premiere)
- Console in the plugin context: `document.documentElement.lang` was **ja** when the panel started in Japanese (scan button アクティブなプロジェクトをスキャン, language button English). Before this change the attribute was fixed at `en`.
- After switching language: **en**, button 日本語, scan button "Scan active project". Switching back: **ja**, button English.

## Side effects and limits
- The first Package attempt wrote the CCX into the staging folder (the dialog's folder field could not be typed into); I moved it to the CCX folder and confirmed the staging folder again holds exactly the 7 receipt files.
- Development-loading the same plugin id displaced the installed panel in that Premiere session; after quitting and restarting Premiere the installed panel was listed again (installed files were untouched). The panels were reopened as floating panels, so a docked layout may need re-docking. Entries for both staged plugins remain in the UXP Developer Tools workspace (state Not loaded).
- **Not installed.** Installing the CCX goes through a Creative Cloud dialog owned by Adobe Desktop Service, whose window access was declined, so I did not operate it. The CCX is ready for the owner to open and install; the installed 0.3.x panels were not replaced.
- The language toggle was driven by dispatching a click event from the debug console (a plain `click()` call did not toggle in UXP), not by a mouse click. One Premiere version (26.5.2), one machine.
- Distribution remains NOT approved.
