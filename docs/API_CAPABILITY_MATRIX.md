# Premiere Pro 26.5 Audio API Capability Matrix

## Current beta contract review — 17 October 2026

Official public Adobe documentation was rechecked for the calls actually used by `src/premiereAdapter.js`. This section records **DOCUMENTED_CONTRACT_REVIEW**. Current 0.2.1 native fixture qualification is **NATIVE_FIXTURES_BOUNDED_PASS**: F01–F11 have eighteen independently reviewed repeated panel scans plus fifteen console-driven staged-adapter reads across ten physical setups; F03/F04 share three runs. F08/F09 establish bounded Mono1 and Multichannel4 configuration/clip agreement. F10's UI-proven source assignment swap leaves collected observations unchanged and mapping Unknown. F11 preserves the inspected combined mute/disabled state over save-close-reopen with six matching reports. A separate 57-read native probe records direct/Promise and nested value behavior; a no-project JSON export records UNKNOWN handling. Opening/reopen interruptions recovered naturally and remain a responsiveness limitation. See the [current native record](../reports/verification-20261017/NATIVE_VALIDATION_20261018.md) for exact outcomes and limits. Historical 0.1.0 execution below cannot qualify changed beta code. Full source links, value examples and unexercised native paths are in [API_VERIFICATION_20261017.md](API_VERIFICATION_20261017.md); the machine-readable documentation record is [api-contract.json](../reports/verification-20261017/api-contract.json).

| Adapter observation | Documented return contract | Current qualification boundary |
|---|---|---|
| Active project and sequences | `Project.getActiveProject(): Promise<Project>`; `getSequences(): Promise<Sequence[]>` | Missing project and failed enumeration must remain Unknown; `[]` is a successfully empty project |
| Project / sequence metadata | Direct `name: string`, `guid: Guid`; project `path: string`; `Guid.toString(): string` | Host getters may throw; missing identity does not prove enumeration failure |
| Audio tracks and settings | Sequence count / track / settings calls return Promises | Zero tracks is valid; an unavailable count is not zero |
| Sequence channel configuration | Count/type: `Promise<number>`; type `0/1/2/3` = Mono/Stereo/5.1/Multichannel; sample rate: `Promise<FrameRate>` | Stereo2, Mono1 and Multichannel4 agree with current native UI; 5.1 is documented but not natively exercised. Layout alone is descriptive |
| Track state / clips | Direct `id: number`, `name: string`; index/mute return Promises; `getTrackItems(CLIP, false): AudioClipTrackItem[]` is synchronous | An awaited direct array is supported JavaScript; null/non-array results are not empty collections |
| Clip state / locator | Name/match name, disabled, start/end TickTime, project item and component chain return Promises | Exact string ticks and occurrence context identify inspected clips; failed reads reduce coverage |
| Source components | `ClipProjectItem.cast()` is synchronous; `getComponentChain(AUDIO): Promise<AudioComponentChain \| VideoComponentChain \| null>` | A documented null chain means unavailable component coverage, not a verified empty chain |
| Component enumeration | Chain count/index and component parameter count/index return direct values; component display/match names return Promises | Partial parameter reads stay inspectable with scoped Unknown coverage |
| Parameter values | Direct `displayName`, synchronous `isTimeVarying()` and TickTime list; `getStartValue(): Promise<Keyframe>` | Preserve nested `Keyframe.value.value`; do not coerce values or infer pan semantics |
| Runtime identity | Direct `require('uxp').host` name/version/uiLocale and `versions` uxp/plugin | Runtime identity must be recorded from the target host, not copied from a test double |
| Source mapping, bus topology, audible/export correctness | No proof established by this read-only adapter | Explicit Unknown; no complete routing or output-correctness claim |

`await` accepts both direct values and Promises. The current native probe records 24 thenables and 33 direct values, each representative call invoked once, with no sampled shape/settlement mismatches. See `current-native-api-review.json` for exact coverage. Natural rejected getters, animated/nonempty keyframe lists and other host builds remain unexercised; mocked failure tests provide separate evidence. No private API or setter is needed for these observations.

## Preserved September research table

Status date: 2026-09-23
Verification level: DOCUMENTED from public Adobe UXP references. No Premiere 26.5 host execution has occurred in this environment.

Historical-table correction (October 4, 2026): the table below records September 23 research status. Subsequent 0.1.0 host testing confirmed bounded enumeration/configuration, mute/disable, serialization examples and duplicate-clip locations on Premiere 26.5.2 Build 5. Pan, source mapping, routing and acoustic output remain unverified. See `../reports/host-20261001-214943/HOST_VALIDATION_REPORT_FINAL.md`. All changed 0.2.0 behavior requires fresh qualification.

| Condition / state | Public API path | Documentation status | Prototype handling | Host verification |
|---|---|---|---|---|
| Enumerate project sequences | `Project.getSequences()` | DOCUMENTED since 25.6 | Observe | NOT RUN |
| Enumerate audio tracks | `Sequence.getAudioTrackCount()` + `getAudioTrack()` | DOCUMENTED since 25.6 | Observe | NOT RUN |
| Sequence audio channel type | `Sequence.getSettings()` -> `SequenceSettings.getAudioChannelType()` | DOCUMENTED since 25.6 | Observe as Mono/Stereo/5.1/Multichannel | NOT RUN |
| Sequence audio channel count | `SequenceSettings.getAudioChannelCount()` | DOCUMENTED since 25.6 | Observe | NOT RUN |
| Sequence audio sample rate | `SequenceSettings.getAudioSampleRate()` | DOCUMENTED since 25.6 | Observe | NOT RUN |
| Track mute state | `AudioTrack.isMuted()` | DOCUMENTED since 25.6 | Direct risk observation; intent unknown | NOT RUN |
| Audio clip enumeration | `AudioTrack.getTrackItems(CLIP, false)` | DOCUMENTED since 25.6 | Observe | NOT RUN |
| Audio clip disabled state | `AudioClipTrackItem.isDisabled()` | DOCUMENTED since 25.6 | Direct risk observation; intent unknown | NOT RUN |
| Clip component chain | `AudioClipTrackItem.getComponentChain()` | DOCUMENTED since 25.6 | Enumerate component metadata and params | NOT RUN |
| Source project-item audio component chain | `ClipProjectItem.getComponentChain(MediaType.AUDIO)` | DOCUMENTED since 25.6 | Enumerate component metadata and params | NOT RUN |
| Component identity | `Component.getDisplayName()`, `getMatchName()` | DOCUMENTED since 25.6 | Observe | NOT RUN |
| Component parameter identity/value | `Component.getParamCount()`, `getParam()`, `ComponentParam.displayName`, `getStartValue()`, `isTimeVarying()` | DOCUMENTED since 25.6 | Generic observation only until semantics are host-validated | NOT RUN |
| Pan/balance semantic mapping | Generic component/param APIs exist; exact stable match-name/value semantics not established in this session | UNVERIFIED | Capture candidates, do not diagnose broken routing yet | NOT RUN |
| Modify > Audio Channels source-channel mapping | No supported public mapping API identified in the documented classes searched | UNKNOWN / CANNOT VERIFY | Explicit Unknown | NOT RUN |
| Audio Track Mixer output-bus topology | No supported public routing/bus graph API identified in the documented classes searched | UNKNOWN / CANNOT VERIFY | Explicit Unknown | NOT RUN |
| End-to-end playback/export correctness | DOM state does not prove rendered acoustic output | UNKNOWN / CANNOT VERIFY | Require manual/export verification | NOT RUN |

## Official sources checked

- https://developer.adobe.com/premiere-pro/uxp/ppro-reference/
- https://developer.adobe.com/premiere-pro/uxp/ppro-reference/classes/project
- https://developer.adobe.com/premiere-pro/uxp/ppro-reference/classes/sequence
- https://developer.adobe.com/premiere-pro/uxp/ppro-reference/classes/sequencesettings
- https://developer.adobe.com/premiere-pro/uxp/ppro-reference/classes/audiotrack
- https://developer.adobe.com/premiere-pro/uxp/ppro-reference/classes/audiocliptrackitem
- https://developer.adobe.com/premiere-pro/uxp/ppro-reference/classes/clipprojectitem
- https://developer.adobe.com/premiere-pro/uxp/ppro-reference/classes/audiocomponentchain
- https://developer.adobe.com/premiere-pro/uxp/ppro-reference/classes/component
- https://developer.adobe.com/premiere-pro/uxp/ppro-reference/classes/componentparam
- https://developer.adobe.com/premiere-pro/uxp/ppro-reference/constants/
