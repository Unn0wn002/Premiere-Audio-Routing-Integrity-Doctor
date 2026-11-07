# Diagnostic Rules Specification

## ARID-001 - All non-empty audio tracks muted

- Required observable inputs: track mute state, track clip count.
- Condition: every non-empty audio track reports `muted=true`.
- Severity: Warning.
- Confidence: high confidence in observed mute state; low confidence in creative intent.
- False-positive risk: intentionally silent sequence or intentionally muted delivery version.
- False-negative risk: audio can still fail for reasons outside track mute state.
- Guidance: review mute state; never auto-unmute.

## ARID-002 - Muted non-empty audio track

- Required observable inputs: track mute state, track clip count.
- Condition: a directly observed non-empty track is muted and a whole-inventory ARID-001 assertion cannot be established (mixed mute or incomplete observations).
- Severity: Review.
- Confidence: high confidence in state; low confidence in intent.
- False-positive risk: intentional layer mute.
- False-negative risk: other active tracks may still have routing defects not observable here.
- Guidance: confirm whether mute is intentional.

## ARID-003 - Disabled audio clip track item

- Required observable input: `AudioClipTrackItem.isDisabled()`.
- Condition: clip reports disabled.
- Severity: Review.
- Confidence: high confidence in state; low confidence in intent.
- False-positive risk: intentional editorial disable.
- False-negative risk: enabled clips may still be silent for other reasons.
- Guidance: confirm expected clip contribution.

## ARID-I01 - Sequence channel configuration record

- Inputs: channel type and channel count.
- Condition: channel type is observable.
- Severity: Information. This is a configuration fact, not a health guarantee.
- Important constraint: mono, stereo, 5.1, and multichannel are not faults by themselves.

## ARID-U01/U02/U03 - Unverifiable topology/output

- Inputs: capability boundary, not inferred media state.
- Severity: Unknown.
- Confidence: UNKNOWN / CANNOT VERIFY.
- Covers: output-bus topology, source-channel mapping, end-to-end playback/export correctness.

## Pan/balance experiment

Schema 0.2.0 adds scoped ARID-U-READ Unknowns and completeness guards; see OBSERVATION_SCHEMA.md. Failed enumeration never establishes an empty inventory.

No production diagnostic rule is enabled yet. The generic Component/ComponentParam APIs can inventory candidate parameters, but exact stable component match names and value semantics must first be verified in Premiere 26.5 across at least normal-center, hard-left, hard-right, keyframed, and intentional-pan controls. Until then, pan/balance remains an experiment, not a defect rule.
