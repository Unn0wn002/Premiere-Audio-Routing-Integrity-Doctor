const CHANNEL_TYPE = {
  0: "Mono",
  1: "Stereo",
  2: "5.1",
  3: "Multichannel"
};

function issue(ruleId, severity, confidence, location, observed, why, remediation) {
  return { ruleId, severity, confidence, location, observed, why, remediation };
}

function riskFindings(report) {
  const findings = [];
  const requiresInventoryProof = Boolean(report.schemaVersion || report.completion);
  for (const sequence of list(report.sequences)) {
    const tracks = list(sequence.audioTracks);
    const nonEmptyTracks = tracks.filter((track) => list(track.clips).length > 0);
    const mutedNonEmpty = nonEmptyTracks.filter((track) => track.muted === true);

    const trackCountMatches = Array.isArray(sequence.audioTracks) && tracks.length === sequence.audioTracks.length && (!Number.isInteger(sequence.audioTrackCount) || sequence.audioTrackCount === tracks.length);
    if (trackCountMatches && (requiresInventoryProof ? sequence.trackInventoryComplete === true : sequence.trackInventoryComplete !== false) && !(sequence.errors || []).some(e => /getAudioTrackCount/.test(e)) && tracks.every(t => (requiresInventoryProof ? t.clipInventoryComplete === true : t.clipInventoryComplete !== false) && Array.isArray(t.clips) && list(t.clips).length === t.clips.length && (!Number.isInteger(t.clipCount) || t.clipCount === t.clips.length) && typeof t.muted === "boolean" && !(t.errors || []).some(e => /getTrackItems|getAudioTrack:|isMuted/.test(e))) && nonEmptyTracks.length > 0 && mutedNonEmpty.length === nonEmptyTracks.length) {
      findings.push(issue(
        "ARID-001",
        "Warning",
        "HIGH_OBSERVATION_LOW_INTENT_CONFIDENCE",
        location(sequence),
        `All ${nonEmptyTracks.length} non-empty audio tracks report muted=true.`,
        "Track mute is directly observable and can suppress expected audio, but the creative intent is unknown.",
        "Review track mute state before delivery. Do not auto-unmute."
      ));
    } else {
      for (const track of mutedNonEmpty) {
        findings.push(issue(
          "ARID-002",
          "Review",
          "HIGH_OBSERVATION_LOW_INTENT_CONFIDENCE",
          location(sequence, track),
          "Audio track reports muted=true and contains audio clips.",
          "This can be intentional. It is a delivery risk only if audio from this track is expected.",
          "Confirm whether the mute is intentional. Do not auto-unmute."
        ));
      }
    }

    for (const track of tracks) {
      for (const clip of list(track.clips)) {
        if (clip.disabled === true) {
          findings.push(issue(
            "ARID-003",
            "Review",
            "HIGH_OBSERVATION_LOW_INTENT_CONFIDENCE",
            location(sequence, track, clip),
            "Audio clip track item reports disabled=true.",
            "A disabled clip will not contribute expected timeline audio, but disabling may be intentional.",
            "Confirm whether the clip disable state is intentional. Do not auto-enable."
          ));
        }
      }
    }
  }
  return findings;
}

function informationalFindings(report) {
  const findings = [];
  for (const sequence of list(report.sequences)) {
    const typeCode = sequence.settings ? sequence.settings.audioChannelType : null;
    const count = sequence.settings ? sequence.settings.audioChannelCount : null;
    if (Number.isInteger(typeCode) && typeCode >= 0) {
      findings.push(issue(
        "ARID-I01",
        "Information",
        "DIRECT_OBSERVATION",
        location(sequence),
        `Sequence audio channel type=${CHANNEL_TYPE[typeCode] || `Unknown(${typeCode})`}, count=${Number.isInteger(count) && count >= 0 ? count : 'Unknown'}.`,
        "Channel configuration is observable. This rule records it but does not label mono, stereo, 5.1, or multichannel as faulty by itself.",
        "Compare against delivery requirements and source expectations."
      ));
    }
  }
  return findings;
}

function unknownFindings(report) {
  return (report.unknowns || []).map((text, index) => issue(
    `ARID-U0${index + 1}`,
    "Unknown",
    "UNKNOWN_CANNOT_VERIFY",
    { project: report.project ? report.project.name : null },
    text,
    "The current public-observable probe does not establish this state.",
    "Verify manually in Premiere until a supported public API is proven in host testing."
  ));
}

function location(sequence, track, clip) {
  return { sequence: sequence.name || null, sequenceGuid: sequence.guid || null,
    sequenceOccurrenceIndex: sequence.occurrenceIndex ?? null,
    track: track ? track.name || null : null, trackId: track ? track.id ?? null : null,
    trackIndex: track ? track.index ?? null : null,
    clip: clip ? clip.name || null : null, clipOccurrenceIndex: clip ? clip.occurrenceIndex ?? null : null,
    startTime: clip ? clip.startTime ?? null : null, endTime: clip ? clip.endTime ?? null : null };
}
function list(value) { return Array.isArray(value) ? value.filter(v => v && typeof v === 'object') : []; }
function intact(value) { return Array.isArray(value) && list(value).length === value.length; }
function errors(value) { return Array.isArray(value && value.errors) ? value.errors : []; }
function validChannel(value) { return Number.isInteger(value) && value >= 0; }
function readFailures(report) {
  const out = [];
  const modern = Boolean(report.schemaVersion || report.completion);
  const projectLocation = { project: report.project ? report.project.name || null : null };
  function add(value, scope, at, inferred = []) {
    for (const error of [...errors(value), ...inferred]) out.push(issue('ARID-U-READ', 'Unknown', 'UNKNOWN_CANNOT_VERIFY', { ...projectLocation, ...at, scope }, String(error), 'This read is unavailable or incomplete. Other independently observed states remain usable; this scope is Unknown.', 'Verify this scope manually in Premiere, then repeat the scan.'));
  }
  function missing(value, condition, label, pattern) {
    return condition && !errors(value).some(e => pattern.test(String(e))) ? [label] : [];
  }
  function chain(value, scope, at) {
    if (!value) return;
    add(value, scope, at, missing(value, value.componentInventoryComplete === false, 'Component enumeration incomplete or unavailable.', /getComponentCount/));
    list(value.components).forEach((component, i) => {
      const componentAt = { ...at, componentIndex: component.index ?? i, component: component.displayName || null };
      const componentScope = `${scope}.components[${i}]`;
      add(component, componentScope, componentAt, missing(component, component.paramInventoryComplete === false, 'Parameter enumeration incomplete or unavailable.', /getParamCount/));
      list(component.params).forEach((param, j) => {
        const absent = [
          ...missing(param, typeof param.isTimeVarying !== 'boolean', 'Parameter time-varying state unavailable.', /isTimeVarying|getParam:/),
          ...missing(param, param.startValue == null, 'Parameter start value unavailable.', /getStartValue|getParam:/),
          ...missing(param, param.isTimeVarying === true && !Array.isArray(param.keyframeTimes), 'Keyframe time enumeration unavailable.', /getKeyframeListAsTickTimes|getParam:/)
        ];
        add(param, `${componentScope}.params[${j}]`, { ...componentAt, parameterIndex: param.index ?? j, parameter: param.displayName || null }, absent);
      });
    });
  }
  add(report, 'project', {}, missing(report, report.sequenceInventoryComplete === false, 'Sequence enumeration incomplete or unavailable.', /getSequences|getActiveProject|No active/));
  list(report.sequences).forEach((sequence, i) => {
    const sequenceScope = `sequences[${i}]`;
    const settings = sequence.settings || {};
    add(sequence, sequenceScope, location(sequence), [
      ...missing(sequence, sequence.trackInventoryComplete === false, 'Audio track enumeration incomplete or unavailable.', /getAudioTrackCount|scanSequence:/),
      ...missing(sequence, modern && (!intact(sequence.audioTracks) || Number.isInteger(sequence.audioTrackCount) && sequence.audioTrackCount !== sequence.audioTracks.length), 'Audio track inventory does not match its declared count or contains unavailable items.', /getAudioTrackCount|scanSequence:/),
      ...missing(sequence, !validChannel(settings.audioChannelCount), 'Sequence audio channel count unavailable.', /getAudioChannelCount|getSettings|scanSequence:/),
      ...missing(sequence, !validChannel(settings.audioChannelType), 'Sequence audio channel type unavailable.', /getAudioChannelType|getSettings|scanSequence:/)
    ]);
    list(sequence.audioTracks).forEach((track, j) => {
      const trackScope = `${sequenceScope}.audioTracks[${j}]`;
      add(track, trackScope, location(sequence, track), [
        ...missing(track, typeof track.muted !== 'boolean', 'Track mute state unavailable.', /isMuted|getAudioTrack:/),
        ...missing(track, track.clipInventoryComplete === false || !Array.isArray(track.clips), 'Clip enumeration incomplete or unavailable.', /getTrackItems|getAudioTrack:/),
        ...missing(track, modern && (!intact(track.clips) || Number.isInteger(track.clipCount) && track.clipCount !== track.clips.length), 'Clip inventory does not match its declared count or contains unavailable items.', /getTrackItems|getAudioTrack:/)
      ]);
      list(track.clips).forEach((clip, k) => {
        const clipScope = `${trackScope}.clips[${k}]`;
        const at = location(sequence, track, clip);
        add(clip, clipScope, at, [
          ...missing(clip, typeof clip.disabled !== 'boolean', 'Clip disabled state unavailable.', /isDisabled|scanClip:/),
          ...missing(clip, modern && !clip.componentChain, 'Clip component-chain observation unavailable.', /getComponentChain|scanClip:/),
          ...missing(clip, modern && !clip.sourceProjectItem, 'Source project-item observation unavailable.', /sourceProjectItem|scanClip:/)
        ]);
        chain(clip.componentChain, `${clipScope}.componentChain`, at);
        if (clip.sourceProjectItem) {
          add(clip.sourceProjectItem, `${clipScope}.sourceProjectItem`, at, missing(clip.sourceProjectItem, modern && !clip.sourceProjectItem.componentChain, 'Source component-chain observation unavailable.', /getComponentChain/));
          chain(clip.sourceProjectItem.componentChain, `${clipScope}.sourceProjectItem.componentChain`, at);
        }
      });
    });
  });
  return out;
}
function coverage(report, failedReads) {
  const sequences = list(report.sequences);
  const tracks = sequences.flatMap(s => list(s.audioTracks));
  const clips = tracks.flatMap(t => list(t.clips));
  const chains = clips.flatMap(c => [c.componentChain, c.sourceProjectItem && c.sourceProjectItem.componentChain]).filter(Boolean);
  const components = chains.flatMap(c => list(c.components));
  const hasErrors = value => errors(value).length > 0 || (value && typeof value === 'object' && Object.entries(value).some(([key, child]) => key !== 'errors' && child && typeof child === 'object' && hasErrors(child)));
  function scope(expected, observed, known, complete, failed = false) {
    return { status: complete && !failed && known === observed ? 'COMPLETE' : known > 0 || observed > 0 ? 'PARTIAL' : 'UNKNOWN', expected, observed, known,
      unknown: expected == null ? null : Math.max(0, expected - known) };
  }
  const total = (objects, field) => objects.every(o => Number.isInteger(o[field]) && o[field] >= 0) ? objects.reduce((n, o) => n + o[field], 0) : null;
  const sequenceExpected = Number.isInteger(report.sequenceCount) ? report.sequenceCount : report.sequenceInventoryComplete === true ? sequences.length : null;
  const trackExpected = sequenceExpected === sequences.length ? total(sequences, 'audioTrackCount') : null;
  const clipExpected = trackExpected === tracks.length ? total(tracks, 'clipCount') : null;
  const componentExpected = clipExpected === clips.length && clips.every(c => c.componentChain && c.sourceProjectItem && c.sourceProjectItem.componentChain) ? total(chains, 'componentCount') : null;
  const sequenceComplete = report.sequenceInventoryComplete === true && report.scanTraversalComplete === true && intact(report.sequences) && sequenceExpected === sequences.length;
  const trackComplete = sequenceComplete && sequences.every(s => s.trackInventoryComplete === true && intact(s.audioTracks)) && trackExpected === tracks.length;
  const clipComplete = trackComplete && tracks.every(t => t.clipInventoryComplete === true && intact(t.clips)) && clipExpected === clips.length;
  const componentComplete = clipComplete && clips.every(c => c.componentChain && c.sourceProjectItem && c.sourceProjectItem.componentChain) && chains.every(c => c.componentInventoryComplete === true) && componentExpected === components.length;
  const result = {
    state: 'UNKNOWN',
    project: scope(1, report.project ? 1 : 0, report.project ? 1 : 0, Boolean(report.project), errors(report).some(e => /project\./.test(String(e)))),
    sequences: scope(sequenceExpected, sequences.length, sequences.filter(s => s.settings && validChannel(s.settings.audioChannelType) && validChannel(s.settings.audioChannelCount)).length, sequenceComplete, sequences.some(s => errors(s).length > 0)),
    tracks: scope(trackExpected, tracks.length, tracks.filter(t => typeof t.muted === 'boolean' && t.clipInventoryComplete === true).length, trackComplete, tracks.some(t => errors(t).length > 0)),
    clips: scope(clipExpected, clips.length, clips.filter(c => typeof c.disabled === 'boolean').length, clipComplete, clips.some(c => errors(c).length > 0)),
    components: scope(componentExpected, components.length, components.filter(c => c.paramInventoryComplete === true && !hasErrors(c)).length, componentComplete, chains.some(hasErrors)),
    failedReads,
    capabilities: { sourceChannelMapping: 'UNKNOWN', outputBusTopology: 'UNKNOWN', playbackExportCorrectness: 'UNKNOWN' }
  };
  // Empty, successfully enumerated projects/tracks are complete observations.
  // Unknown capabilities are excluded from this traversal completeness status.
  const hasEvidence = Boolean(report.project) || sequences.length > 0 || tracks.length > 0 || clips.length > 0;
  result.state = report.completion === 'completed' && sequenceComplete && !failedReads && ['project','sequences','tracks','clips','components'].every(k => result[k].status === 'COMPLETE') ? 'COMPLETE' : hasEvidence ? 'PARTIAL' : 'UNKNOWN';
  return result;
}
function diagnose(report = {}) {
  report = report || {};
  const failures = readFailures(report);
  const observedCoverage = coverage(report, failures.length);
  return {
    schemaVersion: "0.3.0",
    completion: report.completion || "unverified-legacy",
    status: observedCoverage.state,
    coverage: observedCoverage,
    risk: riskFindings(report),
    information: informationalFindings(report),
    unknown: [...unknownFindings(report), ...failures, ...(report.completion === 'cancelled' ? [issue('ARID-U-CANCELLED', 'Unknown', 'UNKNOWN_CANNOT_VERIFY', { project: report.project ? report.project.name : null }, 'Scan cancelled. Unvisited state has not been checked.', 'Only observations already collected are available.', 'Run a new scan to inspect the entire project.')] : [])]
  };
}

module.exports = { diagnose, riskFindings, informationalFindings, unknownFindings, CHANNEL_TYPE };
