# Extended native validation — 27 October 2026

Result: **BOUNDED_POSITIVE_CONTROL_AND_LIFECYCLE_PASS**. This is not a release or general routing qualification.

## Preserved baseline and isolated setup

Native Save As created `Positive_Signal_Test.prproj` before audio edits. The existing `Layout_Test_Copy.prproj` remains SHA256 `F243358DE98EB0024A0364EB6F8A90A7D8EF1B5250DB2169AE2EC1D973E82A8E`.

Only the new project was changed: Audio 1 unmuted, Audio 2 clip enabled, source stereo mapping changed from Left/Left to Left/Right with matching-clip application enabled. The first export retained the first clip's existing Balance 100.0. Effect Controls inspection confirmed that hard-right value; it was then centered to 0.0 in the test copy for a second export. Shared source-media bytes were not edited.

Saved final test project SHA256: `6403C37515E1A96FF6E34B049E5845F21BA2D692E3BF2A8202D51737FACF7012`.

## Rendered output comparisons

All renders used the active six-second sequence, Entire Source, Waveform Audio, 48 kHz stereo 16-bit PCM. A source-clip selection initially presented a three-second source export; this was caught before export, and timeline focus restored the six-second sequence scope.

| Artifact | Observed result |
| --- | --- |
| `active-sequence-baseline.wav` | 288,288 frames, 6.006 seconds; every sample exactly zero |
| `positive-signal.wav` | Nonzero, unclipped output; first-half Left silent, Right 880 Hz; second-half Left 440 Hz and Right 880 Hz. Full stereo-positive check correctly returned REVIEW |
| `positive-centered.wav` | 288,288 frames, 6.006 seconds; nonzero unclipped output on both channels; Left 440 Hz and Right 880 Hz in both interior test windows |

`analyze-positive-wav.js` parses RIFF PCM, examines every sample for peak/RMS/nonzero/clipping, and projects 440/880 Hz over one-second interior windows starting at 0.5 and 3.5 seconds. The final check requires desired-tone amplitude above 0.01 and at least 100 times the opposite tone. All four final checks pass. First-half desired tones are approximately -12.04 dBFS; second-half Left is approximately -15.05 dBFS, Right -12.04 dBFS. This does not assert equal channel loudness.

Reproduce locally from the repository root:

```text
node reports/panel-layout-20261027/analyze-positive-wav.js
node reports/panel-layout-20261027/analyze-positive-wav.js positive-centered.wav positive-centered-analysis.json
```

No physical speaker listening or device-loopback capture was performed. These are rendered-file measurements, not certification of every routing path.

## Scanner, lifecycle and report checks

`positive-native-harness.js` ran in the native beta UDT console with real Premiere reads, no mocks, no runtime-source edits and no injected scanner delays. DOM interactions were programmatic and are distinguished from physical mouse timing.

- **20/20 assertions PASS**: three complete scans, original mute/disable findings cleared, all three capability unknowns retained, full inventory with zero failed reads, stable diagnostics, immediate cancellation and control cleanup, successful retry.
- Scan durations: **43, 38, 36 ms**. Retry: **41 ms**.
- Coverage: **4 sequences, 15 tracks, 7 clips, 18 components**.
- Full native records were written to the beta plugin data folder and copied unchanged as `positive-native-results.json`.
- `positive-report.json` is the retry report extracted locally from that record. `positive-report.html` was generated locally with the repository report helper; decoded embedded raw JSON deep-equals the report. This is not another native Save As path test.
- Reopening through Window > UXP Plugins retained the 0-risk/3-unknown report. Floating-to-docked drag retained the report. A subsequent **physical docked Scan click completed in 34 ms**, with COMPLETE, 0 review findings and 3 unknowns.

The scanner's capability unknowns remain unchanged: source mapping, final output-bus topology, and playback/export correctness. Manual/render evidence does not grant the scanner new capabilities. Large-project responsiveness and customer installation remain unqualified.

## Final state

Premiere remained responsive, with the saved `Positive_Signal_Test` project open and the beta panel docked. The original fixture was preserved. No commit, push, release, installation, canonical WBS edit or production runtime edit occurred during this extended validation. The existing `index.html` working-tree change predates these tests.

Machine-readable consolidation: `extended-validation-summary.json`; full audio measurements: `positive-signal-analysis.json` and `positive-centered-analysis.json`.
