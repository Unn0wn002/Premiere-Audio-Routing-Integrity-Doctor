// Mocked public-API contracts. These tests do not execute Premiere/UXP.
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const { diagnose } = require('../src/diagnostics');

const runtime = fs.readFileSync(path.join(__dirname, '../src/premiereAdapter.js'), 'utf8');
function scanner(getActiveProject, identity = { host: { name: 'Mock Premiere', version: '26.5.2', uiLocale: 'en_US' }, versions: { uxp: 'mock', plugin: '0.2.0' } }) {
  const module = { exports: {} };
  vm.runInNewContext(runtime, { module, Date, require: name => name === 'premierepro' ? {
    Project: { getActiveProject }, Constants: { TrackItemType: { CLIP: 1 }, MediaType: { AUDIO: 1 } }, ClipProjectItem: { cast: value => value }
  } : name === 'uxp' ? identity : require('../src/valueSerializer') });
  return module.exports.scanActiveProject;
}
function model(promises = false) {
  const read = value => () => promises ? Promise.resolve(value) : value;
  const param = { displayName: 'Mock parameter', isTimeVarying: read(true), getStartValue: read({ value: { value: false }, position: { ticks: '-91445760000000000', seconds: -360000 } }), getKeyframeListAsTickTimes: read([{ ticks: '90071992547409931234', seconds: 1 }]) };
  const component = { getDisplayName: read('Mock component'), getMatchName: read('mock'), getParamCount: read(1), getParam: read(param) };
  const chain = { getComponentCount: read(1), getComponentAtIndex: read(component) };
  const sourceChain = { getComponentCount: read(0) };
  const source = { name: 'Source', getComponentChain: read(sourceChain) };
  const clip = { getStartTime: read({ ticks: '90071992547409931234', seconds: 1 }), getEndTime: read({ ticks: '90071992547409931235', seconds: 2 }), getName: read('Clip'), getMatchName: read('clip'), isDisabled: read(false), getComponentChain: read(chain), getProjectItem: read(source) };
  const track = { id: 1, name: 'A1', getIndex: read(0), isMuted: read(true), getTrackItems: read([clip]) };
  const settings = { getAudioChannelCount: read(2), getAudioChannelType: read(1), getAudioSampleRate: read({ value: 48000, ticksPerFrame: 5292000 }) };
  const sequence = { name: 'Sequence', guid: { toString: () => 'sequence-guid' }, getSettings: read(settings), getAudioTrackCount: read(1), getAudioTrack: read(track) };
  const project = { name: 'Project', path: '', guid: { toString: () => 'project-guid' }, getSequences: read([sequence]) };
  return { project, sequence, settings, track, clip, source, sourceChain, chain, component, param };
}
async function inspect(m) { const report = await scanner(() => m.project)(); return { report, diagnostics: diagnose(report) }; }

test('mock contract: direct and Promise results preserve documented nested Keyframe/FrameRate/TickTime shapes', async () => {
  for (const promises of [false, true]) {
    const { report, diagnostics } = await inspect(model(promises));
    assert.equal(report.completion, 'completed'); assert.equal(diagnostics.status, 'COMPLETE');
    const sequence = report.sequences[0], clip = sequence.audioTracks[0].clips[0];
    assert.equal(sequence.settings.audioSampleRate.ticksPerFrame, 5292000);
    assert.equal(clip.componentChain.components[0].params[0].startValue.value.value, false);
    assert.equal(clip.componentChain.components[0].params[0].startValue.position.ticks, '-91445760000000000');
    assert.equal(clip.startTime.ticks, '90071992547409931234');
    assert.equal(diagnostics.coverage.components.known, 1);
    assert.equal(diagnostics.coverage.capabilities.playbackExportCorrectness, 'UNKNOWN');
  }
});
test('mock contract: failed project enumeration never becomes successfully empty', async () => {
  for (const value of [undefined, null, {}, 'not a collection']) {
    const m = model(); m.project.getSequences = () => value;
    const { report, diagnostics } = await inspect(m);
    assert.equal(report.completion, 'failed'); assert.equal(report.sequenceInventoryComplete, false);
    assert.equal(diagnostics.coverage.sequences.status, 'UNKNOWN'); assert.equal(diagnostics.coverage.sequences.expected, null);
    assert.ok(diagnostics.unknown.some(f => /getSequences/.test(f.observed)));
  }
  const report = await scanner(() => { throw Error('project acquisition failed'); })();
  assert.equal(diagnose(report).status, 'UNKNOWN');
});
test('mock contract: unavailable host identity prevents a complete observation', async () => {
  const m = model(); m.project.getSequences = () => [];
  const report = await scanner(() => m.project, { host: {}, versions: {} })();
  const diagnostics = diagnose(report);
  assert.equal(report.completion, 'partial'); assert.equal(diagnostics.status, 'PARTIAL');
  assert.equal(diagnostics.unknown.length, 8); // Five failed host reads plus three fixed capability Unknowns.
  assert.ok(report.errors.every(error => /host\./.test(error)));
  assert.equal(report.host.version, null);
});
test('mock contract: successfully empty projects, sequences and tracks have complete zero denominators', async () => {
  for (const scope of ['project', 'sequence', 'track']) {
    const m = model();
    if (scope === 'project') m.project.getSequences = () => [];
    if (scope === 'sequence') m.sequence.getAudioTrackCount = () => 0;
    if (scope === 'track') m.track.getTrackItems = () => [];
    const { report, diagnostics } = await inspect(m);
    assert.equal(report.completion, 'completed'); assert.equal(diagnostics.status, 'COMPLETE');
    assert.equal(diagnostics.risk.length, 0); assert.equal(diagnostics.coverage.clips.expected, 0);
    assert.equal(diagnostics.coverage.clips.unknown, 0);
  }
});
test('mock contract: missing/throwing/rejected getters at every scope yield partial or unknown diagnostics', async () => {
  const cases = [
    ['sequence', 'getSettings', () => undefined, /getSettings/],
    ['sequence', 'getAudioTrackCount', () => Promise.reject(Error('count failed')), /getAudioTrackCount/],
    ['settings', 'getAudioChannelCount', () => null, /getAudioChannelCount/],
    ['settings', 'getAudioSampleRate', () => undefined, /getAudioSampleRate/],
    ['settings', 'getAudioSampleRate', () => 48000, /getAudioSampleRate/],
    ['settings', 'getAudioSampleRate', () => ({ value: 48000 }), /getAudioSampleRate/],
    ['track', 'isMuted', () => undefined, /isMuted/],
    ['track', 'getTrackItems', () => { throw Error('inventory failed'); }, /getTrackItems/],
    ['clip', 'isDisabled', () => undefined, /isDisabled/],
    ['clip', 'getStartTime', () => null, /getStartTime/],
    ['clip', 'getEndTime', () => ({ seconds: 2 }), /getEndTime/],
    ['chain', 'getComponentCount', () => undefined, /getComponentCount/],
    ['component', 'getParamCount', () => Promise.reject(Error('params failed')), /getParamCount/],
    ['component', 'getParam', () => null, /getParam/],
    ['param', 'getStartValue', () => undefined, /getStartValue/],
    ['param', 'getStartValue', () => ({ value: {} }), /getStartValue/],
    ['param', 'getStartValue', () => ({ value: { value: false } }), /getStartValue/],
    ['param', 'getStartValue', () => ({ value: { value: { ticks: '0' } }, position: { ticks: '0', seconds: 0 } }), /getStartValue/],
    ['param', 'isTimeVarying', () => null, /isTimeVarying/],
    ['param', 'getKeyframeListAsTickTimes', () => undefined, /getKeyframeListAsTickTimes/],
    ['param', 'getKeyframeListAsTickTimes', () => [{ ticks: '0' }, null], /getKeyframeListAsTickTimes/]
  ];
  for (const [scope, method, read, expected] of cases) {
    const m = model(); m[scope][method] = read;
    const { report, diagnostics } = await inspect(m);
    assert.equal(report.completion, 'partial', `${scope}.${method}`);
    assert.equal(diagnostics.status, 'PARTIAL', `${scope}.${method}`);
    assert.ok(diagnostics.unknown.some(f => expected.test(f.observed)), `${scope}.${method}`);
  }
});
test('mock contract: partial component/source data retains independent values and locator', async () => {
  const m = model();
  Object.defineProperty(m.source, 'name', { get() { throw Error('source name unavailable'); } });
  m.component.getParamCount = () => 2;
  m.component.getParam = i => i ? m.param : { ...m.param, getStartValue: () => Promise.reject(Error('value unavailable')) };
  const { report, diagnostics } = await inspect(m);
  const clip = report.sequences[0].audioTracks[0].clips[0];
  assert.equal(clip.sourceProjectItem.componentChain.componentCount, 0);
  assert.equal(clip.componentChain.components[0].params[1].startValue.value.value, false);
  const failure = diagnostics.unknown.find(f => /value unavailable/.test(f.observed));
  assert.equal(failure.location.sequenceGuid, 'sequence-guid'); assert.equal(failure.location.trackId, '1');
  assert.equal(failure.location.clipOccurrenceIndex, 0); assert.equal(failure.location.componentIndex, 0); assert.equal(failure.location.parameterIndex, 0);
  assert.match(failure.location.scope, /clips\[0\].componentChain.components\[0\].params\[0\]/);
  assert.equal(diagnostics.coverage.components.known, 0);
});
test('mock contract: documented nullable source chain is Unknown and never an empty inspection', async () => {
  const m = model(); m.source.getComponentChain = () => null;
  const { report, diagnostics } = await inspect(m);
  assert.equal(report.completion, 'partial'); assert.equal(diagnostics.coverage.components.expected, null);
  assert.ok(diagnostics.unknown.some(f => /sourceProjectItem$/.test(f.location.scope) && /getComponentChain/.test(f.observed)));
});
test('mock contract: unavailable tracks suppress aggregate mute while preserving directly observed local facts', async () => {
  const m = model(); m.clip.isDisabled = () => true; m.sequence.getAudioTrackCount = () => 2;
  m.sequence.getAudioTrack = i => i ? Promise.reject(Error('track unavailable')) : m.track;
  const { diagnostics } = await inspect(m);
  assert.ok(!diagnostics.risk.some(f => f.ruleId === 'ARID-001'));
  assert.ok(diagnostics.risk.some(f => f.ruleId === 'ARID-002'));
  assert.ok(diagnostics.risk.some(f => f.ruleId === 'ARID-003'));
  assert.equal(diagnostics.coverage.tracks.expected, 2); assert.equal(diagnostics.coverage.tracks.unknown, 1);
});
