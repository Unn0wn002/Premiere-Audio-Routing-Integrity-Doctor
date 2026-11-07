# Premiere Pro 26.5 Host Test Runbook

## Preconditions

For the current candidate, use `PROJECT_STATUS.md`, its exact content-addressed stage/receipt under `artifacts/`, and the [current lifecycle plan](LIFECYCLE_QUALIFICATION_PLAN_20261029.md). Records in `reports/verification-20261017/` keep their original candidate binding. A UDT load and no-project scan/export are separate from fixture qualification. A blocked picker, missing independent UI truth, absent timings or missing repeats/reopen evidence must remain blocked/unassessed in the fixture ledger.

- Premiere Pro exact version/build recorded.
- UXP Developer Tool 2.2+ available.
- Plugin loaded from the content-addressed runtime staging folder, with its receipt retained; test the packaged CCX installation separately.
- Controlled fixture project created from `fixtures/premiere/README.md`.
- No production project used for validation.

## Procedure

1. Start with F01 Healthy Stereo.
2. Record the visible Premiere state before scan.
3. Run `Scan active project` once.
4. Save the JSON output without editing it.
5. Compare each observed field with the Premiere UI.
6. Repeat F02-F11.
7. For pan experiments, record component match name, component display name, parameter display name, start value, time-varying state, and any keyframe positions. Repeat with English and Japanese UI if available.
8. For reopen drift, capture before-save, after-reopen, and probe state. Do not label a Premiere bug unless the change is reproducible.
9. For mapping mismatch, verify whether any public observable changes correlate with Modify > Audio Channels. If none do, retain UNKNOWN.
10. Record scan runtime for each fixture.
11. Use the report envelope's `observation` for comparison with historical raw observations. Preserve `diagnostics` and `annotations` alongside it. Check `durationMs`, progress, cancellation, review reset and both exports.
12. Complete `BETA_RELEASE_CHECKLIST.md`; historical 0.1.0 passes do not approve 0.2.1.
13. For F01–F11, retain expected/actual observations and independent UI before/after evidence, three measured scans of unchanged state, repeatability comparison, and save/close/reopen comparison. Null/unassessed values are required for blocked work; do not write a zero duration or negative result for an unexecuted scan. TP/FP/FN denominators include only independently observable exercised conditions. Unknown capabilities and blocked fixtures are counted separately.

For actual Mono/Multichannel fixtures, select the preset first, then set **New Sequence > Tracks > Mix** and its channel count before creation. Mix differs from individual audio-track type. Independently reopen Sequence Settings to verify the created format/count; a sequence named “Mono” can still be Stereo2. Import the independently checked source asset and inspect its enabled, unmuted timeline occurrence before accepting scans.

## Optional native repeat helper

After separately qualifying panel scans/export, `scripts/native-fixture-repeat-probe.js` can reduce repeated save dialogs. It is a development verification helper outside the packaged runtime. Keep the panel idle, select the exact staged plugin's UDT console, paste the whole helper, then run e.g. `await aridRepeatNativeFixture(['F08'], 'UI verified Mono1 before reopen')`. It checks host/plugin versions and calls the staged adapter, diagnostics and report modules three times sequentially, then saves one JSON batch through the native picker. A cancelled picker can retry `await aridSaveNativeRepeatBatch()` without rescanning.

An unexpected traversal/diagnostic exception retains already completed envelopes and records `INCOMPLETE_UNEXPECTED_EXCEPTION`, scan attempts and the error. A partial batch is evidence of incomplete execution, never a three-run pass. Ordinary failed getters remain the adapter's own Partial/Unknown reports.

Before/after UI truth and absence of setup edits during the batch remain operator requirements. The helper declares the expected runtime identity; it does not independently hash loaded sources or prove the truth of its fixture label. Retain UDT staging evidence and the source receipt. The panel still shows its previous panel scan. Helper results qualify actual native adapter traversal, not panel progress, cancellation, export controls or overlap prevention. Keep those checks separate.

Retain each batch's raw bytes unchanged. Its three full report envelopes are under `runs[index].report`, with unique run IDs, timestamps and durations. Analyses must cite the parent batch SHA256 and run index; extracted/reformatted envelopes are not separately host-saved exports. If two fixture assertions share one physical state/run set, record both assertions and count the three physical scans once. Cap speculative pan/routing investigation at two hours; source mapping, output buses and playback/export correctness remain Unknown.

## Pass criteria

The prototype may advance only if:
- sequence and audio track enumeration is reliable;
- documented state agrees with the UI in controlled fixtures;
- useful risky configurations are detected;
- intentional configurations are not labeled as broken without context;
- affected items are locatable;
- Unknowns remain explicit;
- measured false-positive/false-negative behavior is acceptable for a preflight tool.

## Fail / narrow criteria

NARROW if useful read-only preflight remains possible but channel mapping/output-bus topology is not exposed.

REJECT the original routing-integrity promise if useful failures cannot be distinguished from intentional states without private APIs or unacceptable false positives.
