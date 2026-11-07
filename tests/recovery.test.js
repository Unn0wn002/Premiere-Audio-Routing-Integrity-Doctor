const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const path = require('node:path');
const { diagnose } = require('../src/diagnostics');
function adapter(project) {
  const module = { exports: {} };
  vm.runInNewContext(fs.readFileSync(path.join(__dirname, '../src/premiereAdapter.js'), 'utf8'), {
    module, require: name => name === 'premierepro' ? {
      Project: { getActiveProject: project }, Constants: { TrackItemType: { CLIP: 1 }, MediaType: { AUDIO: 1 } },
      ClipProjectItem: { cast: x => x }
    } : name === 'uxp' ? { host: { name: 'Mock Premiere', version: '26.5.2', uiLocale: 'en_US' }, versions: { uxp: 'mock', plugin: '0.2.0' } } : require(path.join(__dirname, '../src', name)), Date
  });
  return module.exports;
}
const seq = () => ({ name: 'healthy', guid: 'seq', getSettings: async () => ({
  getAudioChannelCount: () => 2, getAudioChannelType: () => 1, getAudioSampleRate: () => ({ value: 48000, ticksPerFrame: 5292000 })
}), getAudioTrackCount: () => 0 });
test('A1 no project fails and empty project completes', async () => {
  assert.equal((await adapter(() => null).scanActiveProject()).completion, 'failed');
  assert.equal((await adapter(() => ({ name: 'p', path: '', guid: 'p', getSequences: () => [] })).scanActiveProject()).completion, 'completed');
});
test('A2 project and enumeration sync/rejected failures are structured', async () => {
  for (const fail of [() => { throw Error('cause'); }, () => Promise.reject(Error('cause'))]) {
    const r = await adapter(fail).scanActiveProject();
    assert.equal(r.completion, 'failed'); assert.match(r.errors.join(' '), /getActiveProject.*cause/);
    const s = await adapter(() => ({ name: 'p', path: '', guid: 'p', getSequences: fail })).scanActiveProject();
    assert.equal(s.completion, 'failed'); assert.match(s.errors.join(' '), /getSequences.*cause/);
  }
});
test('A2 throwing metadata does not hide later sequence', async () => {
  const bad = seq(); Object.defineProperty(bad, 'name', { get() { throw Error('name broken'); } });
  const p = { path: '', guid: 'p', getSequences: () => [bad, seq()] };
  Object.defineProperty(p, 'name', { get() { throw Error('project name'); } });
  const r = await adapter(() => p).scanActiveProject();
  assert.equal(r.completion, 'partial'); assert.equal(r.sequences.length, 2);
  assert.equal(r.sequences[1].name, 'healthy'); assert.ok(diagnose(r).unknown.length);
});
test('A1 incomplete inventory suppresses whole-track assertion but retains local finding', () => {
  const r = { errors: [], sequences: [{ name: 's', audioTracks: [
    { index: 0, muted: true, clips: [{ disabled: true, name: 'x' }] },
    { index: 1, clips: [], errors: ['getTrackItems: failed'] }
  ] }] };
  const d = diagnose(r); assert.ok(!d.risk.some(x => x.ruleId === 'ARID-001'));
  assert.ok(d.risk.some(x => x.ruleId === 'ARID-003')); assert.ok(d.unknown.length);
});
test('A3 nested wrappers and exact ticks survive', () => {
  const a = adapter(() => null);
  for (const v of [0, false, '', 0.5, null]) assert.deepEqual(JSON.parse(JSON.stringify(a.plainValue({ value: { value: v } }))), { value: { value: v } });
  assert.equal(a.plainValue({ ticks: '90071992547409931234' }).ticks, '90071992547409931234');
});
test('A5 repeated clips have distinct occurrence locations', () => {
  const r = { sequences: [{ name: 's', guid: 'sg', audioTracks: [{ id: 't', index: 0, clips: [
    { name: 'same', disabled: true, occurrenceIndex: 0 }, { name: 'same', disabled: true, occurrenceIndex: 1 }
  ] }] }] };
  const f = diagnose(r).risk; assert.notDeepEqual(f[0].location, f[1].location);
});
function ui(scan) {
  const button = () => ({ dataset: {}, handlers: [], addEventListener(_, f) { this.handlers.push(f); } });
  const elements = { status: {}, output: {}, scanButton: button(), detailsButton: button() };
  let setup;
  vm.runInNewContext(fs.readFileSync(path.join(__dirname, '../index.js'), 'utf8'), {
    document: { getElementById: id => elements[id] }, require: n => n === 'uxp' ? { entrypoints: { setup: s => { setup = s; } } } : n.includes('premiereAdapter') ? { scanActiveProject: scan } : n.includes('report') ? require('../src/report') : { diagnose }, console
  });
  const panel = setup.panels['audio-routing-integrity-probe']; panel.create(); panel.show();
  return elements;
}
test('A4 single flight, duplicate binding, cleanup and recovery', async () => {
  let resolve, reject, calls = 0;
  const e = ui(() => { calls++; return new Promise((a, b) => { resolve = a; reject = b; }); });
  assert.equal(e.scanButton.handlers.length, 1);
  const click = e.scanButton.handlers[0]; const first = click(); const second = click();
  assert.equal(calls, 1); assert.equal(e.scanButton.disabled, true);
  resolve({ completion: 'completed', project: { name: 'captured' }, sequences: [] }); await first; await second;
  e.detailsButton.handlers[0]();
  assert.equal(e.scanButton.disabled, false); assert.match(e.output.value, /captured/);
  const third = click(); reject(Error('failure')); await third;
  assert.equal(e.scanButton.disabled, false); assert.match(e.status.textContent, /failed/i);
  const fourth = click(); resolve({ completion: 'partial', sequences: [] }); await fourth;
  assert.match(e.status.textContent, /partial/i);
});
test('A3 unsupported, cyclic, throwing and bounded values fail explicitly', () => {
  const { plainValue } = require('../src/valueSerializer');
  const cycle = {}; cycle.value = cycle;
  const throwing = { get value() { throw Error('getter cause'); } };
  let deep = 1; for (let i = 0; i < 10; i++) deep = { value: deep };
  for (const v of [cycle, throwing, deep, { unexpected: 2 }, { value: 1, unexpected: 2 }, Symbol('s'), () => 1, 9007199254740992, Array(1025)]) assert.throws(() => plainValue(v));
  assert.deepEqual(plainValue(undefined), { $type: 'undefined' }); assert.equal(plainValue(null), null);
  assert.deepEqual(plainValue(90071992547409931234n), { $type: 'bigint', value: '90071992547409931234' });
  for (const v of [NaN, Infinity, -Infinity, -0]) assert.ok(JSON.stringify(plainValue(v)).includes('$type'));
  assert.deepEqual(plainValue(new Float32Array([0, 0.5])), [0, 0.5]);
  assert.deepEqual(plainValue({ value: { x: 0, y: 1 } }), { value: { x: 0, y: 1 } });
  assert.deepEqual(plainValue({ red: 0, green: 1, blue: 0.5, alpha: 1 }), { red: 0, green: 1, blue: 0.5, alpha: 1 });
});
function mockClip() {
  return { getName: () => 'same', getMatchName: () => 'clip', isDisabled: () => true,
    getStartTime: () => ({ ticks: '90071992547409931234', seconds: 1 }), getEndTime: () => ({ ticks: '90071992547409931235', seconds: 2 }),
    getComponentChain: () => ({ getComponentCount: () => 0 }), getProjectItem: () => ({ name: 'source', getComponentChain: () => ({ getComponentCount: () => 0 }) }) };
}
function mockTrack(items) { return { id: 'track', name: 'A1', getIndex: () => 0, isMuted: () => false, getTrackItems: () => items }; }
test('A1/A5 full scanner preserves locations and healthy completion; mutation traps untouched', async () => {
  let mutations = 0;
  const trap = object => new Proxy(object, { get(target, key) { if (/^(set|create|execute|save|import)/i.test(String(key))) { mutations++; throw Error('mutation access'); } return target[key]; } });
  const clips = [trap(mockClip()), trap(mockClip())];
  const s = seq(); s.getAudioTrackCount = () => 1; s.getAudioTrack = () => trap(mockTrack(clips));
  const r = await adapter(() => trap({ name: 'p', path: '', guid: 'p', getSequences: () => [trap(s)] })).scanActiveProject();
  assert.equal(r.completion, 'completed'); assert.equal(mutations, 0);
  const observed = r.sequences[0].audioTracks[0].clips;
  assert.deepEqual(observed.map(c => c.occurrenceIndex).join(','), '0,1');
  assert.equal(observed[0].startTime.ticks, '90071992547409931234');
  const loc = diagnose(r).risk[1].location;
  assert.equal(loc.sequenceGuid, 'seq'); assert.equal(loc.trackId, 'track'); assert.equal(loc.clipOccurrenceIndex, 1);
});
test('A1 invalid enumeration/mute and partial tracks remain Unknown, retain supported clips', async () => {
  for (const items of [null, undefined, {}, Promise.reject(Error('inventory rejected'))]) {
    const s = seq(); s.getAudioTrackCount = () => 2;
    s.getAudioTrack = i => i === 0 ? mockTrack([mockClip()]) : mockTrack(items);
    const r = await adapter(() => ({ name: 'p', path: '', guid: 'p', getSequences: () => [s] })).scanActiveProject();
    assert.equal(r.completion, 'partial'); assert.ok(diagnose(r).unknown.some(f => /getTrackItems/.test(f.observed)));
    assert.ok(diagnose(r).risk.some(f => f.ruleId === 'ARID-003'));
  }
  const s = seq(); s.getAudioTrackCount = () => 1;
  s.getAudioTrack = () => ({ ...mockTrack([mockClip()]), isMuted: () => undefined });
  const r = await adapter(() => ({ name: 'p', path: '', guid: 'p', getSequences: () => [s] })).scanActiveProject();
  assert.equal(r.completion, 'partial'); assert.ok(diagnose(r).unknown.some(f => /isMuted/.test(f.observed)));
});
test('A2 individual sequence and track failures continue', async () => {
  const s = seq(); s.getAudioTrackCount = () => 2; s.getAudioTrack = i => { if (!i) throw Error('bad track'); return mockTrack([]); };
  const r = await adapter(() => ({ name: 'p', path: '', guid: 'p', getSequences: () => [null, s, seq()] })).scanActiveProject();
  assert.equal(r.sequences.length, 3); assert.equal(r.completion, 'partial');
  assert.equal(r.sequences[1].audioTracks.length, 2); assert.equal(r.sequences[2].name, 'healthy');
});
test('A3 parameter serializer failures are scoped and promise metadata awaited', async () => {
  const component = { getDisplayName: () => 'c', getMatchName: () => 'm', getParamCount: () => 2,
    getParam: i => ({ displayName: 'p', isTimeVarying: () => Promise.resolve(true), getStartValue: () => i ? { value: { value: false }, position: { ticks: '0', seconds: 0 } } : { get value() { throw Error('value cause'); } }, getKeyframeListAsTickTimes: () => Promise.resolve([{ ticks: '12345678901234567890', seconds: 1 }]) }) };
  const c = mockClip(); c.getComponentChain = () => ({ getComponentCount: () => 1, getComponentAtIndex: () => component });
  const s = seq(); s.getAudioTrackCount = () => 1; s.getAudioTrack = () => mockTrack([c]);
  const r = await adapter(() => ({ name: 'p', path: '', guid: 'p', getSequences: () => [s] })).scanActiveProject();
  assert.equal(r.completion, 'partial');
  const params = r.sequences[0].audioTracks[0].clips[0].componentChain.components[0].params;
  assert.match(params[0].errors.join(' '), /getStartValue.*value cause/s);
  assert.equal(params[1].startValue.value.value, false); assert.equal(params[1].keyframeTimes[0].ticks, '12345678901234567890');
});
test('A5 missing/throwing time getter retains occurrence and scoped cause', async () => {
  const c = mockClip(); c.getStartTime = () => Promise.reject(Error('time cause')); delete c.getEndTime;
  const s = seq(); s.getAudioTrackCount = () => 1; s.getAudioTrack = () => mockTrack([c]);
  const r = await adapter(() => ({ name: 'p', path: '', guid: 'p', getSequences: () => [s] })).scanActiveProject();
  assert.equal(r.completion, 'partial'); const clip = r.sequences[0].audioTracks[0].clips[0];
  assert.equal(clip.occurrenceIndex, 0); assert.equal(clip.startTime, null); assert.equal(clip.endTime, null);
  assert.match(clip.errors.join(' '), /getStartTime.*time cause/s); assert.ok(clip.errors.some(e => e.includes('getEndTime')));
});
test('A4 failed scan with no project never displays complete, repeat clicks ignored during failure', async () => {
  let reject, calls = 0;
  const e = ui(() => { calls++; return new Promise((_, b) => { reject = b; }); });
  const click = e.scanButton.handlers[0]; const first = click(); await click(); await click();
  assert.equal(calls, 1); reject(Error('first fails')); await first;
  assert.equal(e.scanButton.disabled, false);
  const empty = ui(() => Promise.resolve({ completion: 'failed', project: null, errors: ['No active Premiere project.'], sequences: [] }));
  await empty.scanButton.handlers[0](); assert.match(empty.status.textContent, /failed/i); assert.ok(!/complete/i.test(empty.status.textContent));
});
