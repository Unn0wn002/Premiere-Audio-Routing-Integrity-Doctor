> **Historical status document (last updated 2026-10-19; date from git, the file has no update date).** For current status see [PROJECT_STATUS.md](../PROJECT_STATUS.md). Content below is kept unchanged for history; known outdated: version references to 0.2.0/0.2.1 (current is 0.3.0), while the API and intent limitations still apply.

# Known Limitations

1. The old 0.1.0 candidate was partially host-tested on Premiere 26.5.2 Build 5; see `../reports/host-20261001-214943/HOST_VALIDATION_REPORT_FINAL.md`. Current 0.2.1 qualification is tracked in `PROJECT_STATUS.md`. Prior host evidence is not transferable approval.
2. No supported public API for complete Audio Track Mixer output-bus/routing topology was identified in the Adobe public classes searched on 2026-09-23.
3. No supported public API for Modify > Audio Channels source-channel mapping was identified in the Adobe public classes searched on 2026-09-23.
4. Generic component and parameter enumeration does not prove which parameter is the canonical pan/balance control across clip types, effects, locales, and Premiere builds.
5. DOM observation cannot by itself guarantee playback or export audio correctness.
6. Intent is not observable. Mute, disabled clips, mono delivery, multichannel delivery, and hard pan can all be intentional.
7. The 0.2.0 panel adds grouped findings, annotations, progress/cancellation, and local JSON/HTML exports. UXP rendering, file picker behavior, installation, and large-project responsiveness require host verification. Only Windows 11 / Premiere 26.5.2 is the initial qualification target.
8. No automatic fix is implemented.
9. Cancellation is cooperative between sequences, tracks, and clips. A pending host API call or current clip inspection cannot be interrupted; a hung call can delay cancellation.
10. Scans are sequential observations, not atomic snapshots. Avoid editing or switching projects during a scan. Review annotations are scan-local and are never applied to subsequent scans.
11. Current native fixtures establish Stereo2, Mono1 and Multichannel4 configuration agreement, with three timed repetitions per setup. Missing-media, larger-project performance and other host versions remain unqualified. Intentional mute/disable remains a review item, not proof of an error.
12. Exported reports include project paths/names and raw observations. No automatic redaction or upload is performed; inspect before sharing.
13. COMPLETE refers only to bounded observation coverage. A successfully empty collection is known empty; a failed collection has an unknown denominator. Strict shape validation may expose host/documentation differences as Partial/Unknown without erasing known mute or disabled-clip facts.
14. The deterministic developer ZIP is unsigned. Archive integrity does not qualify UDT loading, Creative Cloud installation or runtime responsiveness. CI contains no Premiere host. Current measured results must be read from the candidate-specific native record.
15. Premiere became unresponsive during disposable-project opening and the F11 reopen, then recovered naturally. No scan ran during the observed frozen state; no force termination was used. The cause is unverified and is not attributed to the scanner. Recovered fixture execution does not establish reliable reopen latency or larger-project responsiveness; see the dated process/UI evidence in the current native record.
