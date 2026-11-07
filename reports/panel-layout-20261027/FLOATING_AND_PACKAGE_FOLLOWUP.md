# Wide floating layout and current package follow-up

Date: 2026-10-27. Runtime identity: `48bb1d177f4cb8ec4b8e90ff4d23fe618baec155a814db80f7b19e5d9096b28f`.

## VERIFIED_THIS_SESSION: native layout

In the existing responsive Premiere 26.5.2 session, the current panel was undocked through its native panel menu. Dragging its right border expanded it from approximately 326 px to 800 px wide. The outer floating window was approximately 800 x 375 px, with a shorter usable panel viewport. Text wrapped within the window; Scan/Cancel, export/raw-evidence controls and page navigation reflowed into horizontal rows. The native scrollbar exposed finding cards and their review selector without horizontal clipping in the observed views.

A physical Next click changed Findings 1-25 / Page 1 to Findings 26-50 / Page 2 and displayed the sequence #14 Audio 2 finding. A subsequent physical Scan click showed busy controls and completed with COMPLETE observation coverage: 256/256 sequences, 771/771 tracks, 511/511 clips and 2,034/2,034 components; 506 review findings and three capability unknowns, displayed adapter duration 4,286 ms. The native scan reset the page to 1. The panel was redocked and retained this result. Premiere PID 37304 remained Responding=true; all three saved fixture hashes remained unchanged.

This supersedes the earlier lack of wider-floating coverage only for the observed width and interactions. Bottom-border height drags did not change the height. No new arbitrary-height, DPI, keyboard-accessibility or every-control-at-every-size pass is claimed. No runtime edits were needed.

## VERIFIED_THIS_SESSION: package archive

UDT generated a fresh, separate CCX from the current staged candidate:

`artifacts/ccx-0.2.1-48bb1d177f4c/com.unn0wn002.audio-preflight.beta_premierepro.ccx`

- Size: 15,420 bytes.
- SHA256: `15026dd9df78c2437ab0e295a6d62c7df5f0276486ba130981c68dc9876662f5`.
- Plugin ID: `com.unn0wn002.audio-preflight.beta`; version: `0.2.1`.
- Independent verifier: `scripts/verify-package.ps1`, with the current receipt and `-AllowManifestReformat`.
- Result: seven allowed runtime files; six exact byte matches and equivalent parsed manifest values after UDT reformatting. Evidence: `current-ccx-verification.json`.

The CCX and developer ZIP have different container hashes, as expected. This is archive integrity evidence only. No installation was launched, consent accepted, installed runtime identified, upgrade performed or distribution approved. Older package identities and their historical closeout remain preserved.

## Operator handoff for this candidate

Customer installation remains UNVERIFIED. The historical 19 October UAC incident is dated evidence; no live UAC prompt was observed in this follow-up. The available desktop is still a development profile with a same-ID UDT registration, so it cannot establish clean-customer installation by itself.

1. Prepare a dedicated clean test profile with normal Creative Cloud access and Premiere 26.5.2. Record pre-install plugin state. Do not remove the existing development registration merely to call this profile clean.
2. In that profile, open the exact CCX above through the normal Creative Cloud installation flow. The operator must handle any login or operating-system consent. Record the exact installer result/error and leave the desktop available.
3. Resume validation: verify installed runtime bytes against the receipt, open through Premiere's standard plugin menu, test docked/floating behavior and installed-runtime lifecycle. Uninstall/reinstall and eligible upgrade remain separate checks. Developer-loaded results do not satisfy them.

Computer-use guidance requires this handoff: `computer-use/26.1021.31345/docs/guidance.md` says, "Do not act on security or privacy permission requests." Its `confirmations.md` also requires action-time confirmation for installation via Windows UI. No installation approval was requested or presumed in this follow-up; all feasible layout/package preparation was completed first.

The earlier opening/nonresponse root cause and the scanner's mapping, output-bus and playback/export correctness unknowns remain unresolved. No project edits, restart, source changes, commit, push, release, canonical WBS edit or other-repository change occurred.
