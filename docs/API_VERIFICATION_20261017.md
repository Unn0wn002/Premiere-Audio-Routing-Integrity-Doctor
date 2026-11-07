# Public API and native evidence audit — 17 October 2026

Branch at audit: `codex/validated-beta-20261017`; baseline Git SHA: `cc7adbbe805767924812f32cb6bbe6e87bb2f851`. The final candidate commit and runtime receipt belong in `PROJECT_STATUS.md` and the native run record. Working target: 22 October 2026; official submission deadline unconfirmed.

17 October audit verdict: **DOCUMENTED_CONTRACT_REVIEW**. The public read calls are documented; that initial audit did not execute Premiere. The 18 October continuation below adds **OBSERVED_REPRESENTATIVE_NATIVE_API_CONTRACTS** for one bounded native getter probe. A source review, a stubbed adapter test, a representative getter probe and a complete fixture run are different evidence layers. None qualifies the changed beta on its own.

Earlier recovery checkpoint recorded 18 October 2026 (Asia/Jakarta): the documentation audit was preserved after the session interruption. Strict host/FrameRate/Keyframe/TickTime validation and inventory-count checks were independently reviewed after repair. Source commit `64e75e382cfee9626bb743d949f412d290f180e1`, runtime identity `7b544bd27f3b12b11b21eb695187af4ed51be661385f2821657e73f23225f408`, version 0.2.1 subsequently loaded in Premiere 26.5.2 Build 5 and produced a correctly failed/Unknown native no-project scan plus native JSON export. Safe file-list selection recovered the initial picker issue, but Premiere became unresponsive while opening the new disposable copy; at that checkpoint no fixture scan had started. Later native work, including the representative API probe below, is recorded separately in the [current native record](../reports/verification-20261017/NATIVE_VALIDATION_20261018.md). No historical result was promoted to a current pass.

## Contracts checked against official Adobe references

All links below were opened on 17 October 2026. All listed Premiere members are documented since 25.6; the manifest's 26.5 target is therefore above their documented introduction. Documentation can still differ from a particular installed build.

| Official reference | Calls/properties used and return shape |
|---|---|
| [Project](https://developer.adobe.com/premiere-pro/uxp/ppro-reference/classes/project) | Active project and sequence inventory resolve from Promises. Inventory resolves to `Sequence[]`. Direct name/path are strings; guid is `Guid`. |
| [Sequence](https://developer.adobe.com/premiere-pro/uxp/ppro-reference/classes/sequence) | Audio track count resolves to number; indexed audio track to `AudioTrack`; settings to `SequenceSettings`. Direct name is string and guid is `Guid`. |
| [SequenceSettings](https://developer.adobe.com/premiere-pro/uxp/ppro-reference/classes/sequencesettings) | Audio count/type resolve to numbers. Type values: 0 Mono, 1 Stereo, 2 5.1, 3 Multichannel. Audio sample rate resolves to `FrameRate`. |
| [AudioTrack](https://developer.adobe.com/premiere-pro/uxp/ppro-reference/classes/audiotrack) | Direct numeric id/string name. Index and mute resolve from Promises. `getTrackItems(type, includeEmptyTrackItems)` directly returns `AudioClipTrackItem[]`. |
| [AudioClipTrackItem](https://developer.adobe.com/premiere-pro/uxp/ppro-reference/classes/audiocliptrackitem) | `getName`, `getMatchName`, `isDisabled`, `getStartTime`, `getEndTime`, `getProjectItem`, `getComponentChain` return Promises resolving respectively to strings, boolean, TickTimes, ProjectItem, AudioComponentChain. |
| [ClipProjectItem](https://developer.adobe.com/premiere-pro/uxp/ppro-reference/classes/clipprojectitem) | `cast(ProjectItem)` directly returns ClipProjectItem; name is direct string. `getComponentChain(mediaType)` resolves to an audio/video chain **or null**. |
| [AudioComponentChain](https://developer.adobe.com/premiere-pro/uxp/ppro-reference/classes/audiocomponentchain) | Component count directly returns number; indexed component directly returns Component. |
| [Component](https://developer.adobe.com/premiere-pro/uxp/ppro-reference/classes/component) | Display/match name return Promises of strings. Parameter count/index return direct number/ComponentParam; indexes are zero based. |
| [ComponentParam](https://developer.adobe.com/premiere-pro/uxp/ppro-reference/classes/componentparam) | Direct displayName string; synchronous `isTimeVarying(): boolean` and `getKeyframeListAsTickTimes(): TickTime[]`; `getStartValue(): Promise<Keyframe>`. |
| [Keyframe](https://developer.adobe.com/premiere-pro/uxp/ppro-reference/classes/keyframe) | `value` has a wrapper `{value: string \| number \| boolean \| Color \| PointF}`; `position` is TickTime. The page labels access `W`; retained historical read evidence is separate from that documentation ambiguity. No `getValue()` member is documented here. |
| [FrameRate](https://developer.adobe.com/premiere-pro/uxp/ppro-reference/classes/framerate), [TickTime](https://developer.adobe.com/premiere-pro/uxp/ppro-reference/classes/ticktime) | FrameRate exposes numeric value/ticksPerFrame; TickTime exposes seconds:number, ticks:string and ticksNumber:number. Preserve exact string ticks; numeric ticks may lose integer precision. |
| [Guid](https://developer.adobe.com/premiere-pro/uxp/ppro-reference/classes/guid), [Color](https://developer.adobe.com/premiere-pro/uxp/ppro-reference/classes/color), [PointF](https://developer.adobe.com/premiere-pro/uxp/ppro-reference/classes/pointf) | Guid has synchronous `toString()`. Color uses red/green/blue/alpha numbers; PointF uses x/y numbers. Reading known fields avoids arbitrary host-object enumeration. |
| [Constants](https://developer.adobe.com/premiere-pro/uxp/ppro-reference/constants/) | Public names include TrackItemType.CLIP, MediaType.AUDIO, AudioChannelType.MONO/STEREO/SURROUND_51/MULTI. The constants page lists symbols; numeric channel values above come from SequenceSettings. |
| [UXP host environment](https://developer.adobe.com/uxp/guides/how-to/recipes/host-info/) | `require('uxp')` exports host name/version/uiLocale and versions uxp/plugin directly. Host values and the About build must be captured during the native run. |

Awaiting a synchronous value is valid JavaScript; the adapter can await both kinds while retaining synchronous throws and Promise rejections in its error handling. Mocks should cover direct returns and actual Promise resolution/rejection. A collection getter resolving null/undefined or failing must not be normalized to `[]`; count failures must not become zero. A source chain may legitimately be null according to its contract; its components are then unobserved, without proving a broken clip.

## Value evidence and code implications

The retained F01 native JSON has sample rate `{"value":48000}`, exact clip TickTime `{"ticks":"762048000000","seconds":3}`, and the following real parameter shape:

```json
{"value":{"value":false},"position":{"ticks":"-91445760000000000","seconds":-360000}}
```

The wrapper must remain nested; false/zero/empty names must not disappear through truthiness checks. A Keyframe is not a bare numeric pan value. Negative keyframe positions are retained observations rather than corruption evidence. FrameRate.ticksPerFrame was missing from the initial serializer allowlist and was reported to the implementation owner for explicit bounded support. Failure/missing-value diagnostics, null component chains and collection validation were also reported. Review current source/tests for the resolved implementation; this record documents the audit finding, not a source snapshot.

## Historical native evidence correction

The audit lead that eleven fixtures lacked execution evidence is superseded by the retained [final continuation report](../reports/host-20261001-214943/HOST_VALIDATION_REPORT_FINAL.md) and raw fixture JSON. It reports Premiere 26.5.2 Build 5, en_US, UXP `uxp-9.3.0-local`, plugin 0.1.0, baseline Git SHA above, and candidate content SHA256 `28c4c5f401358c1751f7f43280bd38e19740ddd74f293c3daade664d4192dac8`. That content digest is **not a Git SHA**. The current beta has changed and needs new qualification.

| Fixtures | Historical observation and remaining qualification |
|---|---|
| F01 | Stereo2, enabled clip, unmuted track; no unsupported risk. Fresh beta scan/repeats required. |
| F02/F03 | Visible Balance -100/+100; returned component chain omitted UI panner. Successful uncertainty handling; pan semantics stayed unproven. |
| F04 | Visible deliberate +50 pan; no risk solely from pan. Original creative hard-pan setup was not reproduced exactly here. |
| F05/F06 | Only nonempty muted track / mixed nonempty muted-active tracks produced ARID-001 / ARID-002 as expected. |
| F07 | Disabled second same-name clip produced ARID-003 with distinct occurrence/tick locator. |
| F08/F09 | Blocked: F08_Mono was actually Stereo2; actual Mono and Multichannel were not established. Names cannot serve as ground truth. |
| F10 | UI mapping deliberately changed and unchanged after scanning; scanner retained Unknown. Source mapping detection and acoustic output were not established. |
| F11 | Saved, closed and reopened disposable project; parsed reports equal except generatedAt; visible +50 pan retained. Mapping fixture was created later and mapping drift was not assessed. |

Historical metrics were limited to observable conditions: 3 expected rule TP, 0 FN for F05–F07; 0 FP across four risk-negative F01–F04. Two blocked fixtures were unassessed. Product-boundary Unknowns remained separate. Wall-clock scan durations were **not instrumented**, and systematic per-fixture repeatability was not established. The F11 equality check does not prove the host cannot drift. The final report supersedes the interim all-blocked record, not current-beta qualification.

## Native completion steps

1. Record final branch/Git SHA, staged runtime/package receipt, exact Premiere version/build, UXP/plugin versions and locale. Load that candidate with supported UDT; exercise packaged installation separately. Use disposable copies of fixture projects only.
2. Establish each F01–F11 state independently in Premiere UI before scanning. For F08/F09, verify actual sequence channel type/count in Settings; recreate them if necessary. Verify track mutes, clip Enable status, occurrence locations and deliberate pan/mapping states from UI, without deriving truth from fixture names or scanner JSON.
3. For one representative instance of each API contract, record whether its single call returns a thenable and record the resolved primitive/object/array shape. Check actual Keyframe.value wrapper, position, FrameRate.value, exact TickTime ticks, empty arrays, component absence, and time-varying parameter TickTime list. Preserve raw JSON and host console errors. Awaited output alone does not prove whether a call was synchronous.
4. For every fixture capture expected/actual observations, raw JSON, UI before/after evidence and measured durationMs. Run three scans of unchanged state, record times and compare stable observation fields; ignore generatedAt/duration/progress only as documented. Treat a mismatch as failure or Unknown, not a negative result.
5. Save, close, reopen the disposable project for F11 and repeat the UI plus observation comparison, including mapping before/after if mapping drift is assessed. Check unchanged inspected mute, Enable, channel settings and relevant pan/mapping state; distinguish intentional setup/save changes from scanner effects.
6. Exercise no project, successfully empty project/tracks, multiple sequences/duplicate clips, cancellation and rapid scan clicks. Check scoped Partial/Unknown messages, no overlapping host scan, control recovery, and JSON export matching panel host/coverage/findings/locations. Failure simulation remains adapter-test evidence unless safely and reproducibly induced in the native host.
7. Calculate TP/FP/FN only for observed fixture conditions with independently established truth. Record Unknown, blocked/not-run and uncertainty-boundary assertions separately. Keep source-channel mapping, output buses and playback/export correctness Unknown without additional proof. Stop speculative pan/routing research at two hours; this documentation audit used no such native investigation.

If no supported host-control/UDT execution surface is available, the current candidate disposition is **BLOCKED_NATIVE_VALIDATION**, with these steps outstanding. Do not relabel synthetic tests or historical 0.1.0 runs as current native success.

## Standalone representative getter probe

`scripts/native-api-probe.js` is a read-only helper for step 3, outside the seven-file plugin runtime. In the loaded candidate's UDT Debug console, paste the complete file once while a disposable project with a representative audio clip is open. It calls each selected getter once, records `typeof returned.then` before awaiting, and logs `ARID_NATIVE_API_PROBE_JSON` with resolved shapes, errors, exact TickTime strings, FrameRate fields, and nested `Keyframe.value.value`/position. Search is bounded to four sequences, eight tracks per sequence, four components per chain and one parameter per selected component; a missing representative remains Unknown. A static parameter's empty keyframe list does not establish time-varying behavior.

After its Promise resolves, run `await globalThis.aridSaveNativeApiProbe()` to save through the UXP user picker with a timestamp/random filename; cancellation leaves the console JSON available. The globals `aridNativeApiProbeResult` and `aridNativeApiProbePromise` retain this run until the next invocation. Retain raw JSON and record branch/SHA, runtime receipt, fixture/UI identity and About build alongside it. A saved file or `OBSERVATIONS_COLLECTED` status alone does not qualify any fixture or establish unchanged host state. Creating the helper and `node --check scripts/native-api-probe.js` are syntax evidence only; execution must be recorded separately.

## Representative native API execution — 18 October 2026

Disposition: **OBSERVED_REPRESENTATIVE_NATIVE_API_CONTRACTS**. The probe was executed in the loaded beta's UDT console at `2026-10-18T04:31:40.896Z` (11:31:40 Asia/Jakarta). The raw host record identifies Premiere `26.5.2`, locale `en_US`, UXP `uxp-9.3.0-local`, plugin `0.2.1`; the separate UI host record establishes Build 5. It selected sequence index 0 (`stereo-l440-r880`), track index 0 and clip occurrence 0 in disposable `ARID_Disposable_20261018.prproj`. The plugin runtime remains source commit `64e75e382cfee9626bb743d949f412d290f180e1`, identity `7b544bd27f3b12b11b21eb695187af4ed51be661385f2821657e73f23225f408`. Review HEAD was `4ec285a7a18e0d53cedd52d135838060b694ed05` on `codex/validated-beta-20261017`; the helper is outside the frozen runtime.

The [retained native export](../reports/verification-20261017/current-native-api-export.json) is byte-identical to `reports/beta-20261004/arid-native-api-2026-10-18T04-31-40-896Z-dff77a.json`: 22,027 bytes, SHA256 `9f1186c90996d697ffe740032ccbb5fe019f3c1167f3bf3d4364ff056fd3ff3e`. Probe script SHA256 is `06f356228e1f059efe531801bedb313ca2db15694532854cfe3ed31667dac541`. The [independent review](../reports/verification-20261017/current-native-api-review.json) records identities, values, call counts and remaining coverage gaps. These hashes identify content, not Git commits.

All 57 calls recorded `OBSERVED`, no shape issues, raw errors or raw Unknowns. Twenty-four calls returned an object whose `then` property was a function; 33 had `typeof returned.then === 'undefined'`. Every sampled call labelled `Promise<...>` in the documentation table returned a thenable; all sampled direct getters/properties returned direct values. There were no Promise/direct mismatches in this sample. The probe's measured 9 ms covers getter traversal only and excludes full plugin scanning, picker/export and UI work.

| Representative contract | Native result and implication |
|---|---|
| Project, sequence settings, audio track lookup/count and clip getters | Thenables resolved to the documented object/string/number/boolean categories. Sequence inventory resolved to an array of length 2; the selected track's clip inventory was a direct array of length 2. This does not exercise an empty project or empty track. |
| AudioTrack identity/mute | Direct `id=2`, name `Audio 1`; `getIndex()` resolved to 0 and `isMuted()` to false. Track identity and index remain distinct. |
| Component/parameter contracts, in both clip and source chains | Component count/index and parameter count/index were direct; component names and `getStartValue()` were thenable; parameter displayName and `isTimeVarying()` were direct. The selected component was `Volume` / `Internal Volume Stereo`, parameter `Mute`. |
| FrameRate | Resolved `value=48000` and `ticksPerFrame=5292000`, both finite positive numbers. The frozen serializer/adapter retains and validates both fields. |
| Keyframe | Both sampled start values were nested `{value:{value:false},position:{ticks:"-91445760000000000",seconds:-360000}}`. The false value and exact negative tick string survive serialization; the numeric tick convenience field is not the precision authority. The adapter's nested-value validation matches this observed shape. |
| TickTime | Clip start `ticks="0"`, seconds 0; end `ticks="762810048000"`, seconds 3.003. Exact tick strings were retained. |
| Keyframe-time list | Both sampled parameters had direct `isTimeVarying() === false`; the direct `getKeyframeListAsTickTimes()` results were successfully empty arrays. No animated/nonempty keyframe list was exercised. |
| Public constants | `TrackItemType.CLIP` was direct number 1; `MediaType.AUDIO` was a direct opaque object, accepted by the public source-chain getter. The adapter passes the public token unchanged; it makes no numeric-enum assumption. |

The [ComponentParam](https://developer.adobe.com/premiere-pro/uxp/ppro-reference/classes/componentparam), [Keyframe](https://developer.adobe.com/premiere-pro/uxp/ppro-reference/classes/keyframe), [FrameRate](https://developer.adobe.com/premiere-pro/uxp/ppro-reference/classes/framerate) and [Constants](https://developer.adobe.com/premiere-pro/uxp/ppro-reference/constants/) pages were reopened on 18 October. No sampled return-category discrepancy was found. Adobe still marks Keyframe value/position and FrameRate ticksPerFrame access `W`; the latter's description explicitly includes reading. This build's successful read observations establish bounded host behavior while preserving that documentation annotation ambiguity.

Unexercised representatives remain **Unknown**: `isTimeVarying=true` and a nonempty keyframe-time list; numeric/string/Color/PointF Keyframe value variants; a legal null source chain; native throwing/rejected/missing getters; successfully empty project/track inventories; other components/parameters and other host builds. Failure/missing-data regressions remain mocked-adapter evidence until separately induced in Premiere. No runtime defect was identified by this probe, so the frozen runtime was preserved. The probe contributes no fixture TP/FP/FN and does not establish source-channel mapping, output buses, playback/export correctness or unchanged inspected state.
