# Audio Preflight (Premiere Audio Routing Integrity Doctor): user guide

Host: Adobe Premiere Pro 26.5.2 on Windows. Status: beta, not released.

## What it does
A read-only UXP panel that reviews the active project for muted non-empty audio tracks, disabled audio clips and sequence audio settings, and lists findings with their locations, the observation coverage and explicit Unknowns.

## What it does not do
It does not and cannot certify source mapping, output-bus routing or playback/export correctness. Those stay Unknown. It changes nothing in the project; the only host action beyond reading is the optional "show location" playhead move.

## Install
1. Open the packaged `.ccx` with Creative Cloud Desktop and follow its install flow (it may ask you to confirm a non-marketplace plugin). Restart Premiere Pro.
2. Open Window > UXP Plugins > Audio Preflight and dock it as a tab.
3. For development: load the staged `manifest.json` in Adobe UXP Developer Tools.
4. A first launch once showed an unexplained "Compatible app required" message; a second launch of the same package installed normally.

## Use
1. Open the project and press **Scan active project**.
2. Read the counts (to review, unknown, information), the coverage line and the findings. Findings link to their location.
3. Mark findings Reviewed or Intentional if useful; marks reset on the next scan.
4. Export the JSON or HTML report. Reports contain project paths, so check them before sharing.
5. The language button switches English and Japanese.

## Reading the result
"0 to review" means no supported rule fired within the coverage shown; it is not a clean bill for your audio output. Unknowns are listed on purpose and are never counted as passes.

## Remove
Creative Cloud Desktop > Plugins > Manage plugins > the plugin's menu > Uninstall. (Removal and reinstall have not been tested in a clean profile.)

## Limits
- Clean-profile install, upgrade, uninstall and reinstall have not been run.
- Source mapping, output topology and playback/export correctness are Unknown by design.
- Beta, not released and not approved for distribution. Verified on one Windows machine only; no macOS, other-build or clean-profile claim is made (see `PROJECT_STATUS.md`).
- The Japanese wording has not had a native-speaker review.
- A scan describes what was checked. It never certifies the final output of your project.

Full status and evidence: `PROJECT_STATUS.md`. Licence: MIT (see `LICENSE`).
