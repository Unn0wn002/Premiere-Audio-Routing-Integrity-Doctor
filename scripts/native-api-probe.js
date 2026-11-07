// Paste this complete script into the loaded beta's UDT Debug console.
// Read-only public getters only; this file is not part of the seven-file plugin.
// Creating/syntax-checking the probe is not native execution evidence.
// Contracts: docs/API_VERIFICATION_20261017.md and Adobe's public reference:
// https://developer.adobe.com/premiere-pro/uxp/ppro-reference/
// No routing/pan interpretation, fixture acceptance, or state-integrity claim.
globalThis.aridNativeApiProbePromise = (async function aridNativeApiProbe() {
  if (globalThis.aridNativeApiProbeRunning) throw Error('A native API probe is already running.');
  globalThis.aridNativeApiProbeRunning = true;
  const started = Date.now();
  const id = new Date().toISOString().replace(/[:.]/g, '-') + '-' + Math.random().toString(16).slice(2, 8);
  const report = {
    recordType: 'native-api-contract-observation', probeVersion: 1,
    generatedAt: new Date().toISOString(), execution: 'RUNNING', durationMs: null,
    qualification: 'Representative native getter observations only; not fixture acceptance, unchanged-state proof, or routing/output certification.',
    bounds: { sequences: 4, tracksPerSequence: 8, componentsPerChain: 4, parametersPerComponent: 1, keyframeTimeSamples: 4 },
    host: {}, selection: null, calls: [], unknowns: [], errors: []
  };
  globalThis.aridNativeApiProbeResult = report;
  let uxp;
  const message = error => error && error.message ? error.message : String(error);
  const primitive = value => {
    const kind = value === null ? 'null' : Array.isArray(value) ? 'array' : typeof value;
    if (['object', 'function', 'array', 'undefined'].includes(kind)) return { kind };
    return { kind, value: kind === 'bigint' || kind === 'symbol' || (kind === 'number' && !Number.isFinite(value)) ? String(value) : value };
  };
  // Only named documented fields are read; host objects are never enumerated.
  function fields(value, names) {
    if (value == null || typeof value !== 'object') return primitive(value);
    const result = { kind: 'object', fields: {} };
    for (const name of names) {
      try { result.fields[name] = primitive(value[name]); }
      catch (error) { result.fields[name] = { kind: 'UNKNOWN', error: message(error) }; }
    }
    return result;
  }
  function shape(value, type) {
    if (type === 'FrameRate') return fields(value, ['value', 'ticksPerFrame']);
    if (type === 'TickTime') return fields(value, ['ticks', 'seconds', 'ticksNumber']);
    if (type === 'Keyframe' && value != null) {
      const result = { kind: typeof value, fields: {} };
      try {
        const wrapper = value.value;
        result.fields.value = primitive(wrapper);
        if (wrapper != null) {
          const inner = wrapper.value;
          result.fields.value = { kind: typeof wrapper, fields: { value: primitive(inner) } };
          if (inner && typeof inner === 'object') {
            const allowed = ['x', 'y', 'red', 'green', 'blue', 'alpha'].filter(field => field in inner);
            result.fields.value.fields.value = fields(inner, allowed);
          }
        }
      } catch (error) { result.fields.value = { kind: 'UNKNOWN', error: message(error) }; }
      try { result.fields.position = shape(value.position, 'TickTime'); }
      catch (error) { result.fields.position = { kind: 'UNKNOWN', error: message(error) }; }
      return result;
    }
    if (Array.isArray(value)) return {
      kind: 'array', length: value.length,
      samples: value.slice(0, type === 'TickTime[]' ? report.bounds.keyframeTimeSamples : 1).map(item => type === 'TickTime[]' ? shape(item, 'TickTime') : primitive(item)),
      samplesTruncated: value.length > (type === 'TickTime[]' ? report.bounds.keyframeTimeSamples : 1)
    };
    return primitive(value);
  }
  function shapeIssues(observation, expected, type) {
    const issues = [];
    const isNumber = item => item && item.kind === 'number' && typeof item.value === 'number' && Number.isFinite(item.value);
    const requiredField = (item, field, kind) => {
      const result = item && item.fields && item.fields[field];
      if (!result || result.kind !== kind) issues.push(field + ': missing or unexpected ' + kind + ' field');
      return result;
    };
    if (observation.kind === 'undefined' || observation.kind === 'null') {
      if (!(observation.kind === 'null' && expected.includes('| null'))) issues.push('Missing return value');
      return issues;
    }
    if (type === 'FrameRate') {
      for (const field of ['value', 'ticksPerFrame']) {
        const result = requiredField(observation, field, 'number');
        if (!isNumber(result) || result.value <= 0) issues.push(field + ': expected positive finite number');
      }
    } else if (type === 'TickTime') {
      const ticks = requiredField(observation, 'ticks', 'string');
      const seconds = requiredField(observation, 'seconds', 'number');
      if (!ticks || !/^-?\d+$/.test(ticks.value)) issues.push('ticks: expected exact integer string');
      if (!isNumber(seconds)) issues.push('seconds: expected finite number');
    } else if (type === 'Keyframe') {
      const wrapper = requiredField(observation, 'value', 'object');
      const inner = wrapper && wrapper.fields && wrapper.fields.value;
      if (!inner || !['string', 'number', 'boolean', 'object'].includes(inner.kind)) issues.push('value.value: missing or unexpected documented value');
      if (inner && inner.kind === 'number' && !isNumber(inner)) issues.push('value.value: expected finite number');
      const position = requiredField(observation, 'position', 'object');
      issues.push(...shapeIssues(position || { kind: 'undefined' }, 'TickTime', 'TickTime').map(issue => 'position.' + issue));
    } else if (expected.includes('[]')) {
      if (observation.kind !== 'array') issues.push('Expected array; unavailable inventory is not an empty array');
      if (type === 'TickTime[]' && observation.samples) observation.samples.forEach((sample, i) => {
        issues.push(...shapeIssues(sample, 'TickTime', 'TickTime').map(issue => 'sample[' + i + '].' + issue));
      });
    } else {
      const primitiveType = expected.match(/^(?:Promise<)?(number|string|boolean)(?:>|\s|$)/);
      if (primitiveType && observation.kind !== primitiveType[1]) issues.push('Expected ' + primitiveType[1]);
      if (!primitiveType && /^(?:Promise<)?[A-Z]/.test(expected) && observation.kind !== 'object') issues.push('Expected documented host object');
    }
    return issues;
  }
  async function read(label, expected, invoke, type) {
    const call = { label, documented: expected, status: 'PENDING', returnedThenType: null, immediateKind: null, resolved: null, durationMs: null };
    report.calls.push(call);
    const began = Date.now();
    let phase = 'invoke';
    try {
      const returned = invoke(); // Exactly one invocation of this representative getter.
      call.immediateKind = primitive(returned).kind;
      phase = 'inspect-returned-then';
      call.returnedThenType = returned == null ? 'undefined' : typeof returned.then;
      phase = 'await';
      const resolved = await returned; // Handles either the direct value or a thenable.
      phase = 'read-documented-value-fields';
      call.resolved = shape(resolved, type);
      call.shapeIssues = shapeIssues(call.resolved, expected, type);
      if (/\.(?:getAudioTrackCount|getComponentCount|getParamCount|getIndex)\(/.test(label) && (!Number.isInteger(resolved) || resolved < 0)) call.shapeIssues.push('Expected nonnegative integer count/index');
      call.status = call.shapeIssues.length ? 'UNKNOWN' : resolved === null ? 'OBSERVED_NULL' : 'OBSERVED';
      if (call.status === 'UNKNOWN') report.unknowns.push(label + ': ' + call.shapeIssues.join('; '));
      return resolved;
    } catch (error) {
      call.status = 'UNKNOWN'; call.errorPhase = phase; call.error = message(error);
      report.unknowns.push(label + ': ' + phase + ': ' + call.error);
      return undefined;
    } finally { call.durationMs = Date.now() - began; }
  }
  const count = value => Number.isInteger(value) && value >= 0 ? value : 0;
  async function probeChain(chain, label) {
    if (!chain) { report.unknowns.push(label + ': no readable component chain.'); return; }
    const total = await read(label + '.getComponentCount()', 'number (direct)', () => chain.getComponentCount());
    for (let i = 0; i < Math.min(count(total), report.bounds.componentsPerChain); i++) {
      const at = label + '.component[' + i + ']';
      const component = await read(at, 'Component (direct)', () => chain.getComponentAtIndex(i));
      if (!component) continue;
      const params = await read(at + '.getParamCount()', 'number (direct)', () => component.getParamCount());
      if (count(params) === 0) continue;
      await read(at + '.getDisplayName()', 'Promise<string>', () => component.getDisplayName());
      await read(at + '.getMatchName()', 'Promise<string>', () => component.getMatchName());
      const param = await read(at + '.getParam(0)', 'ComponentParam (direct)', () => component.getParam(0));
      if (!param) continue;
      await read(at + '.param[0].displayName', 'string (direct property)', () => param.displayName);
      await read(at + '.param[0].isTimeVarying()', 'boolean (direct)', () => param.isTimeVarying());
      await read(at + '.param[0].getStartValue()', 'Promise<Keyframe>', () => param.getStartValue(), 'Keyframe');
      await read(at + '.param[0].getKeyframeListAsTickTimes()', 'TickTime[] (direct)', () => param.getKeyframeListAsTickTimes(), 'TickTime[]');
      return;
    }
    report.unknowns.push(label + ': no representative parameter within bounded component search.');
  }
  try {
    const ppro = require('premierepro');
    uxp = require('uxp');
    globalThis.aridSaveNativeApiProbe = async function aridSaveNativeApiProbe() {
      const file = await uxp.storage.localFileSystem.getFileForSaving('arid-native-api-' + id + '.json', { types: ['json'] });
      if (!file) return { saved: false, reason: 'Picker cancelled' };
      await file.write(JSON.stringify(report, null, 2), { format: uxp.storage.formats.utf8 });
      return { saved: true, filename: 'arid-native-api-' + id + '.json' };
    };
    for (const [field, object, member] of [['name', uxp.host, 'name'], ['version', uxp.host, 'version'], ['uiLocale', uxp.host, 'uiLocale'], ['uxpVersion', uxp.versions, 'uxp'], ['pluginVersion', uxp.versions, 'plugin']]) {
      report.host[field] = await read('uxp.' + field, 'direct runtime identity property', () => object[member]);
    }
    const clipType = await read('Constants.TrackItemType.CLIP', 'public enum', () => ppro.Constants.TrackItemType.CLIP);
    const audioType = await read('Constants.MediaType.AUDIO', 'public enum', () => ppro.Constants.MediaType.AUDIO);
    const project = await read('Project.getActiveProject()', 'Promise<Project>', () => ppro.Project.getActiveProject());
    if (!project) { report.unknowns.push('No active project; sequence/track/clip/component contracts not observed.'); return report; }
    await read('project.name', 'string (direct property)', () => project.name);
    await read('project.path', 'string (direct property)', () => project.path);
    const guid = await read('project.guid', 'Guid (direct property)', () => project.guid);
    if (guid) await read('project.guid.toString()', 'string (direct)', () => guid.toString());
    const sequences = await read('project.getSequences()', 'Promise<Sequence[]>', () => project.getSequences());
    if (!Array.isArray(sequences)) { report.unknowns.push('Sequence inventory unavailable; not an empty project.'); return report; }
    let selected;
    for (let s = 0; s < Math.min(sequences.length, report.bounds.sequences) && !selected; s++) {
      const sequence = sequences[s];
      const total = await read('sequence[' + s + '].getAudioTrackCount()', 'Promise<number>', () => sequence.getAudioTrackCount());
      for (let t = 0; t < Math.min(count(total), report.bounds.tracksPerSequence) && !selected; t++) {
        const track = await read('sequence[' + s + '].getAudioTrack(' + t + ')', 'Promise<AudioTrack>', () => sequence.getAudioTrack(t));
        if (!track) continue;
        const clips = await read('sequence[' + s + '].track[' + t + '].getTrackItems(CLIP,false)', 'AudioClipTrackItem[] (direct)', () => track.getTrackItems(clipType, false));
        if (Array.isArray(clips) && clips.length) selected = { s, t, sequence, track, clip: clips[0] };
      }
    }
    const sequence = selected ? selected.sequence : sequences[0];
    if (sequence) {
      await read('selectedSequence.name', 'string (direct property)', () => sequence.name);
      const sequenceGuid = await read('selectedSequence.guid', 'Guid (direct property)', () => sequence.guid);
      if (sequenceGuid) await read('selectedSequence.guid.toString()', 'string (direct)', () => sequenceGuid.toString());
      const settings = await read('selectedSequence.getSettings()', 'Promise<SequenceSettings>', () => sequence.getSettings());
      if (settings) {
        await read('settings.getAudioChannelCount()', 'Promise<number>', () => settings.getAudioChannelCount());
        await read('settings.getAudioChannelType()', 'Promise<number>', () => settings.getAudioChannelType());
        await read('settings.getAudioSampleRate()', 'Promise<FrameRate>', () => settings.getAudioSampleRate(), 'FrameRate');
      }
    }
    if (!selected) { report.unknowns.push(sequences.length === 0 ? 'Successfully empty sequence array; no clip/parameter representative.' : 'No nonempty audio track within bounded search; clip/parameter contracts Unknown.'); return report; }
    report.selection = { sequenceIndex: selected.s, trackIndex: selected.t, clipOccurrenceIndex: 0 };
    const { track, clip } = selected;
    await read('track.id', 'number (direct property)', () => track.id);
    await read('track.name', 'string (direct property)', () => track.name);
    await read('track.getIndex()', 'Promise<number>', () => track.getIndex());
    await read('track.isMuted()', 'Promise<boolean>', () => track.isMuted());
    for (const method of ['getName', 'getMatchName', 'isDisabled', 'getStartTime', 'getEndTime']) {
      await read('clip.' + method + '()', method.includes('Time') ? 'Promise<TickTime>' : method === 'isDisabled' ? 'Promise<boolean>' : 'Promise<string>', () => clip[method](), method.includes('Time') ? 'TickTime' : undefined);
    }
    const clipChain = await read('clip.getComponentChain()', 'Promise<AudioComponentChain>', () => clip.getComponentChain());
    await probeChain(clipChain, 'clipChain');
    const source = await read('clip.getProjectItem()', 'Promise<ProjectItem>', () => clip.getProjectItem());
    if (source) {
      const cast = await read('ClipProjectItem.cast(source)', 'ClipProjectItem (direct)', () => ppro.ClipProjectItem.cast(source));
      if (cast) {
        await read('sourceClip.name', 'string (direct property)', () => cast.name);
        const sourceChain = await read('sourceClip.getComponentChain(AUDIO)', 'Promise<AudioComponentChain | VideoComponentChain | null>', () => cast.getComponentChain(audioType));
        await probeChain(sourceChain, 'sourceChain');
      }
    }
    return report;
  } catch (error) { report.errors.push(message(error)); return report; }
  finally {
    report.durationMs = Date.now() - started;
    report.execution = report.errors.length ? 'INCOMPLETE' : report.unknowns.length ? 'OBSERVATIONS_COLLECTED_WITH_UNKNOWNS' : 'OBSERVATIONS_COLLECTED';
    globalThis.aridNativeApiProbeRunning = false;
    console.log('ARID_NATIVE_API_PROBE_JSON\n' + JSON.stringify(report, null, 2));
    console.log('Optional JSON save: await globalThis.aridSaveNativeApiProbe()');
  }
})();
