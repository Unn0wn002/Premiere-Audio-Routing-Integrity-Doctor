# Package, install and docked check of Audio Preflight 0.3.0 (2026-11-02, Claude Sonnet 5.5)

Class: PASS_ARCHIVE_INTEGRITY (package) and PASS_BOUNDED_NATIVE (installed, docked smoke check) on one machine, Premiere Pro 26.5.2.5, Creative Cloud Desktop, the owner's normal profile (NOT a clean profile).

## Candidate
- Source: `main` at 3feb14b (`release/package-0.3.0-20261102` built from it, working tree clean). Version 0.3.0, plugin id `com.unn0wn002.audio-preflight.beta`.
- Staging identity `38a3997af84e` (7 runtime files). Unsigned developer ZIP sha256 `89969c174e627a898512aefe45f2ba55ef13c9479c6a77a85f07d61d20adeb66`.
- CCX made with the supported UDT Package action (the existing UDT row for the same id, bound to the 0.2.1 staging folder, was removed first and the 0.3.0 staging manifest added; the workspace now stays bound to 0.3.0). CCX sha256 `fb61d5deeb330ec8ecbe6f32f99306af939ef69cf407990a12069b76eec1dcea`, 27,479 bytes.
- Files (git-ignored, in the project folder): `artifacts\audio-preflight-0.3.0-38a3997af84e*` and `artifacts\ccx-0.3.0-38a3997af84e\com.unn0wn002.audio-preflight.beta_premierepro.ccx`. Copies of the receipt and the CCX verification are here.

## Results
| Check | Result | Evidence |
|---|---|---|
| Developer ZIP verified against the receipt (`verify-package.ps1`): bytes and identity match | PASS_ARCHIVE_INTEGRITY | `package-receipt.json` |
| CCX verified with `-AllowManifestReformat`: 6 runtime files byte-exact, manifest values equal (UDT reformats the manifest) | PASS_ARCHIVE_INTEGRITY | `ccx-verification.json` |
| Installing through Creative Cloud: first launch showed "Compatible app required" although Premiere 26.5.2.5 is installed (manifest minVersion 26.5.2); cause not found | OBSERVED (transient) | `01` |
| Second launch of the same CCX: "Install a non-marketplace plugin" confirmation, then the install dialog; the install finished with no administrator (UAC) prompt: "Audio Preflight - Private Beta is now installed", Version Installed 0.3.0 | PASS_BOUNDED_NATIVE | `02`, `03` |
| Installed files equal the package: 6 byte-exact, manifest values equal; Premiere's plugin registry lists the plugin enabled, version 0.3.0 | PASS (file and registry check) | n/a |
| Installed panel opened in Premiere, docked as a tab beside Project (about 380 px wide), English scan of `Large_1024.prproj`: 0 to review, 3 unknown, 1 information, 7.6 s, nothing cut off | PASS_BOUNDED_NATIVE | `04` |
| Same docked panel in Japanese: coverage, export buttons, timeline note, grouped lane with no bar text, legend all fit | PASS_BOUNDED_NATIVE | `05` |
| Clean-profile installation, restart, upgrade from the prior beta, uninstall and reinstall (cases I01-I06) | NOT_RUN | no clean profile; the owner's profile was used |

## Notes
- The earlier record (BLOCKED_INSTALLATION on 19 October) was a UAC stop in a non-clean profile. This install needed no UAC prompt, but the first launch's "Compatible app required" message was not explained.
- The installed plugin is in `%APPDATA%\Adobe\UXP\Plugins\External\com.unn0wn002.audio-preflight.beta_0.3.0`. To remove it: Creative Cloud > Plugins > Manage plugins > the plugin's "..." > Uninstall.
- Scanning was read-only; `Large_1024.prproj` was not saved or changed. Japanese wording is not native-reviewed. Nothing was published or released.
