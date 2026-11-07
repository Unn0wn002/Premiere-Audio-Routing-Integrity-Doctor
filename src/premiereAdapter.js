const ppro = require("premierepro");
const { host, versions } = require("uxp");

function errorText(error) {
  if (!error) return "Unknown error";
  return error.stack || error.message || String(error);
}

const { plainValue } = require("./valueSerializer");

async function scanParam(param, index) {
  const result = {
    index,
    displayName: null,
    isTimeVarying: null,
    startValue: null,
    keyframeTimes: null,
    errors: []
  };
  try { result.displayName = metadata(await param.displayName); } catch (e) { result.errors.push(`displayName: ${errorText(e)}`); }
  try { result.isTimeVarying = boolean(await param.isTimeVarying()); } catch (e) { result.errors.push(`isTimeVarying: ${errorText(e)}`); }
  try {
    const keyframe = required(await param.getStartValue(), 'Keyframe');
    // Keyframe.value is the documented value wrapper. A missing value is not a
    // successful observation, even though the general serializer supports null.
    const wrappedValue = required(keyframe.value, 'Keyframe.value');
    keyframeValue(required(wrappedValue.value, 'Keyframe.value.value'));
    result.startValue = plainValue(keyframe);
    tickTime(required(keyframe.position, 'Keyframe.position'));
  } catch (e) {
    result.errors.push(`getStartValue: ${errorText(e)}`);
  }
  if (result.isTimeVarying) {
    try {
      const times = await param.getKeyframeListAsTickTimes();
      result.keyframeTimes = inventory(times).map((v, timeIndex) => {
        try { tickTime(v); return plainValue(v); }
        catch (e) { result.errors.push(`getKeyframeListAsTickTimes[${timeIndex}]: ${errorText(e)}`); return null; }
      });
    } catch (e) {
      result.errors.push(`getKeyframeListAsTickTimes: ${errorText(e)}`);
    }
  }
  return result;
}

async function scanComponent(component, index) {
  const result = { index, displayName: null, matchName: null, paramCount: null, paramInventoryComplete: false, params: [], errors: [] };
  try { result.displayName = metadata(await component.getDisplayName()); } catch (e) { result.errors.push(`getDisplayName: ${errorText(e)}`); }
  try { result.matchName = metadata(await component.getMatchName()); } catch (e) { result.errors.push(`getMatchName: ${errorText(e)}`); }
  let count = 0;
  try { count = validCount(await component.getParamCount()); result.paramCount = count; result.paramInventoryComplete = true; } catch (e) { result.errors.push(`getParamCount: ${errorText(e)}`); }
  for (let i = 0; i < count; i += 1) {
    try {
      const param = required(await component.getParam(i), 'ComponentParam');
      result.params.push(await scanParam(param, i));
    } catch (e) {
      result.params.push({ index: i, errors: [`getParam: ${errorText(e)}`] });
    }
  }
  return result;
}

async function scanChain(chain) {
  if (!chain) throw Error('Missing component chain');
  const result = { componentCount: null, componentInventoryComplete: false, components: [], errors: [] };
  let count = 0;
  try { count = validCount(await chain.getComponentCount()); result.componentCount = count; result.componentInventoryComplete = true; } catch (e) { result.errors.push(`getComponentCount: ${errorText(e)}`); }
  for (let i = 0; i < count; i += 1) {
    try {
      result.components.push(await scanComponent(required(await chain.getComponentAtIndex(i), 'Component'), i));
    } catch (e) {
      result.components.push({ index: i, errors: [`getComponentAtIndex: ${errorText(e)}`] });
    }
  }
  return result;
}

async function scanClip(clip, sequenceName, trackIndex, occurrenceIndex) {
  const result = {
    sequenceName,
    trackIndex,
    occurrenceIndex,
    startTime: null,
    endTime: null,
    name: null,
    matchName: null,
    disabled: null,
    componentChain: null,
    sourceProjectItem: null,
    errors: []
  };
  for (const [field, method] of [["startTime", "getStartTime"], ["endTime", "getEndTime"]]) {
    try {
      result[field] = plainValue(required(await clip[method](), 'TickTime'));
      tickTime(result[field]);
    } catch (e) { result.errors.push(`${method}: ${errorText(e)}`); }
  }
  try { result.name = metadata(await clip.getName()); } catch (e) { result.errors.push(`getName: ${errorText(e)}`); }
  try { result.matchName = metadata(await clip.getMatchName()); } catch (e) { result.errors.push(`getMatchName: ${errorText(e)}`); }
  try { result.disabled = boolean(await clip.isDisabled()); } catch (e) { result.errors.push(`isDisabled: ${errorText(e)}`); }
  try { result.componentChain = await scanChain(await clip.getComponentChain()); } catch (e) { result.errors.push(`clip.getComponentChain: ${errorText(e)}`); }
  try {
    const projectItem = required(await clip.getProjectItem(), 'ProjectItem');
    const clipProjectItem = required(ppro.ClipProjectItem.cast(projectItem), 'ClipProjectItem');
    result.sourceProjectItem = { name: null, componentChain: null, errors: [] };
    try { result.sourceProjectItem.name = metadata(await clipProjectItem.name); }
    catch (e) { result.sourceProjectItem.errors.push(`name: ${errorText(e)}`); }
    try { result.sourceProjectItem.componentChain = await scanChain(await clipProjectItem.getComponentChain(ppro.Constants.MediaType.AUDIO)); }
    catch (e) { result.sourceProjectItem.errors.push(`getComponentChain: ${errorText(e)}`); }
  } catch (e) {
    result.errors.push(`sourceProjectItem: ${errorText(e)}`);
  }
  return result;
}

async function scanTrack(track, sequenceName, fallbackIndex, control) {
  const result = {
    id: null,
    name: null,
    index: fallbackIndex,
    muted: null,
    clipInventoryComplete: false,
    clipCount: null,
    clips: [],
    errors: []
  };
  try { result.id = identity(track.id); } catch (e) { result.errors.push(`id: ${errorText(e)}`); }
  try { result.name = metadata(track.name); } catch (e) { result.errors.push(`name: ${errorText(e)}`); }
  try { result.index = validCount(await track.getIndex()); } catch (e) { result.errors.push(`getIndex: ${errorText(e)}`); }
  try { result.muted = boolean(await track.isMuted()); } catch (e) { result.errors.push(`isMuted: ${errorText(e)}`); }
  try {
    const items = inventory(await track.getTrackItems(ppro.Constants.TrackItemType.CLIP, false));
    result.clipCount = items.length;
    for (let i = 0; i < items.length; i++) {
      if (await control.checkpoint({ phase: 'clips', sequence: sequenceName, track: result.name, item: i, total: items.length })) break;
      try { result.clips.push(await scanClip(items[i], sequenceName, result.index, i)); }
      catch (e) { result.clips.push({ occurrenceIndex: i, errors: [`scanClip: ${errorText(e)}`] }); }
    }
    result.clipInventoryComplete = result.clips.length === items.length;
  } catch (e) {
    result.errors.push(`getTrackItems: ${errorText(e)}`);
  }
  return result;
}

async function scanSequence(sequence, occurrenceIndex, control) {
  const result = {
    name: null,
    guid: null,
    occurrenceIndex,
    trackInventoryComplete: false,
    audioTrackCount: null,
    settings: {
      audioChannelCount: null,
      audioChannelType: null,
      audioSampleRate: null
    },
    audioTracks: [],
    errors: []
  };
  for (const field of ["name", "guid"]) {
    try { result[field] = field === "guid" ? identity(sequence[field]) : metadata(sequence[field]); }
    catch (e) { result.errors.push(`${field}: ${errorText(e)}`); }
  }
  try {
    const settings = required(await sequence.getSettings(), 'SequenceSettings');
    try { result.settings.audioChannelCount = validCount(await settings.getAudioChannelCount()); } catch (e) { result.errors.push(`getAudioChannelCount: ${errorText(e)}`); }
    try { result.settings.audioChannelType = validCount(await settings.getAudioChannelType()); } catch (e) { result.errors.push(`getAudioChannelType: ${errorText(e)}`); }
    try {
      const rate = required(await settings.getAudioSampleRate(), 'FrameRate');
      result.settings.audioSampleRate = plainValue(rate);
      if (!rate || typeof rate !== 'object' || !Number.isFinite(rate.value) || rate.value <= 0 || !Number.isFinite(rate.ticksPerFrame) || rate.ticksPerFrame <= 0) throw Error('Incomplete FrameRate value/ticksPerFrame');
    } catch (e) { result.errors.push(`getAudioSampleRate: ${errorText(e)}`); }
  } catch (e) {
    result.errors.push(`getSettings: ${errorText(e)}`);
  }
  let count = 0;
  try { count = validCount(await sequence.getAudioTrackCount()); result.audioTrackCount = count; result.trackInventoryComplete = true; } catch (e) { result.errors.push(`getAudioTrackCount: ${errorText(e)}`); }
  for (let i = 0; i < count; i += 1) {
    if (await control.checkpoint({ phase: 'tracks', sequence: result.name, item: i, total: count })) { result.trackInventoryComplete = false; break; }
    try {
      const observedTrack = await scanTrack(await sequence.getAudioTrack(i), result.name, i, control);
      for (const clip of observedTrack.clips) {
        clip.sequenceGuid = result.guid;
        clip.sequenceOccurrenceIndex = occurrenceIndex;
        clip.trackId = observedTrack.id;
      }
      result.audioTracks.push(observedTrack);
    } catch (e) {
      result.audioTracks.push({ index: i, errors: [`getAudioTrack: ${errorText(e)}`] });
    }
  }
  return result;
}

async function scanActiveProject(options = {}) {
  const started = Date.now();
  const control = {
    cancelled: false,
    async checkpoint(progress) {
      // Yield to panel input between inventory items. An in-flight host call is not interrupted.
      if (typeof setTimeout === 'function') await new Promise(resolve => setTimeout(resolve, 0));
      this.cancelled = this.cancelled || Boolean(options.isCancelled && options.isCancelled());
      if (!this.cancelled && options.onProgress) options.onProgress(progress);
      return this.cancelled;
    }
  };
  const report = {
    schemaVersion: "0.3.0",
    completion: "failed",
    scanTraversalComplete: false,
    durationMs: null,
    sequenceInventoryComplete: false,
    sequenceCount: null,
    verification: "HOST OBSERVATION WHEN EXECUTED IN PREMIERE",
    generatedAt: new Date().toISOString(),
    host: {
      name: null, version: null, uiLocale: null, uxpVersion: null, pluginVersion: null
    },
    project: null,
    sequences: [],
    unknowns: [
      "Final Audio Track Mixer output-bus routing topology is not established by this probe.",
      "Modify > Audio Channels source-channel mapping is not established by this probe.",
      "End-to-end playback/export correctness is not established by DOM observation alone."
    ],
    errors: []
  };
  try {
  if (await control.checkpoint({ phase: 'project' })) { report.completion = 'cancelled'; return report; }
  for (const [field, source, key] of [["name",host,"name"],["version",host,"version"],["uiLocale",host,"uiLocale"],["uxpVersion",versions,"uxp"],["pluginVersion",versions,"plugin"]]) {
    try { report.host[field] = metadata(source[key]); if (!report.host[field]) throw Error('Missing host identity'); } catch (e) { report.errors.push('host.' + field + ': ' + errorText(e)); }
  }
  let project;
  try { project = await ppro.Project.getActiveProject(); } catch (e) { report.errors.push('getActiveProject: ' + errorText(e)); return report; }
  if (!project) { report.errors.push('No active Premiere project.'); return report; }
  report.project = { name: null, path: null, guid: null };
  for (const field of ['name','path','guid']) {
    try { report.project[field] = field === 'guid' ? identity(project[field]) : metadata(project[field]); }
    catch (e) { report.errors.push('project.' + field + ': ' + errorText(e)); }
  }
  let sequences;
  try { sequences = inventory(await project.getSequences()); report.sequenceCount = sequences.length; report.sequenceInventoryComplete = true; }
  catch (e) { report.errors.push('getSequences: ' + errorText(e)); return report; }
  for (let i = 0; i < sequences.length; i++) {
    if (await control.checkpoint({ phase: 'sequences', item: i, total: sequences.length })) break;
    try { report.sequences.push(await scanSequence(sequences[i], i, control)); }
    catch (e) { report.sequences.push({ occurrenceIndex: i, errors: ['scanSequence: ' + errorText(e)] }); }
  }
  await control.checkpoint({ phase: 'finished' });
  report.scanTraversalComplete = !control.cancelled;
  report.completion = control.cancelled ? 'cancelled' : hasErrors(report) ? 'partial' : 'completed';
  return report;
  } finally { report.durationMs = Date.now() - started; }
}


function validCount(v) { if (!Number.isInteger(v) || v < 0 || v > 100000) throw Error('Invalid count/index'); return v; }
function required(v, label) { if (v === undefined || v === null) throw Error('Missing ' + label); return v; }
function tickTime(v) { if (!v || typeof v !== 'object' || typeof v.ticks !== 'string' || !/^-?\d+$/.test(v.ticks) || !Number.isFinite(v.seconds)) throw Error('Incomplete TickTime ticks/seconds'); return v; }
function keyframeValue(v) {
  if (typeof v === 'string' || typeof v === 'boolean' || (typeof v === 'number' && Number.isFinite(v))) return v;
  if (v && typeof v === 'object' && (['x','y'].every(k => Number.isFinite(v[k])) || ['red','green','blue','alpha'].every(k => Number.isFinite(v[k])))) return v;
  throw Error('Unsupported Keyframe.value.value shape');
}
function boolean(v) { if (typeof v !== 'boolean') throw Error('Invalid boolean observation'); return v; }
function metadata(v) { if (typeof v !== 'string') throw Error('Missing/invalid metadata'); return v; }
function identity(v) { if (v == null) throw Error('Missing identity'); const text = String(v); if (!text || text === '[object Object]') throw Error('Unsupported identity'); return text; }
function inventory(v) { if (!v || typeof v === 'string' || typeof v[Symbol.iterator] !== 'function') throw Error('Missing/invalid inventory'); const out = []; for (const item of v) { if (out.length >= 100000) throw Error('Inventory bound exceeded'); out.push(item); } return out; }
function hasErrors(v) { if (!v || typeof v !== 'object') return false; return (Array.isArray(v.errors) && v.errors.length > 0) || Object.entries(v).some(([k,x]) => k !== 'errors' && hasErrors(x)); }

// View-only navigation for the "Show" chips: opens the finding's sequence and, for clips, moves the playhead to the
// clip start. This is the only function in this file that changes anything in Premiere (which sequence is open and
// where the playhead is); it never edits the project, and the scanner above never calls it.
function tickTimeFrom(start) {
  const factory = ppro.TickTime;
  if (factory && typeof factory.createWithSeconds === 'function') return factory.createWithSeconds(Number(start.seconds));
  if (factory && typeof factory.createWithTicks === 'function' && typeof start.ticks === 'string') return factory.createWithTicks(start.ticks);
  throw Error('TickTime factory not available');
}

async function showLocation(location) {
  const l = location || {};
  const project = await ppro.Project.getActiveProject();
  if (!project) throw Error('No active project');
  const sequences = inventory(await project.getSequences());
  let target = null;
  if (l.sequenceGuid != null) target = sequences.find(s => { try { return String(s.guid) === String(l.sequenceGuid); } catch (e) { return false; } }) || null;
  if (!target && Number.isInteger(l.sequenceOccurrenceIndex)) target = sequences[l.sequenceOccurrenceIndex] || null;
  if (!target) throw Error('Sequence not found. It may have changed since the scan; scan again.');
  let opened = false;
  const active = await project.getActiveSequence();
  const alreadyActive = active === target || (active && String(active.guid) === String(target.guid));
  if (!alreadyActive) opened = Boolean(await project.setActiveSequence(target));
  let positioned = false;
  const seconds = l.startTime ? Number(l.startTime.seconds) : NaN;
  if (l.clip != null && Number.isFinite(seconds)) positioned = Boolean(await target.setPlayerPosition(tickTimeFrom(l.startTime)));
  return { opened, positioned };
}

module.exports = { scanActiveProject, plainValue, showLocation };
