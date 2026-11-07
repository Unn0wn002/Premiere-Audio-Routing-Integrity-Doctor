// Synthetic diagnostics only; no native Premiere result is asserted here.
const test = require('node:test');
const assert = require('node:assert/strict');
const { diagnose } = require('../src/diagnostics');
function complete() {
  return { schemaVersion: '0.3.0', completion: 'completed', sequenceInventoryComplete: true, scanTraversalComplete: true, sequenceCount: 1, project: { name: 'P' }, sequences: [{ name: 'S', guid: 'seq', occurrenceIndex: 0, trackInventoryComplete: true, audioTrackCount: 1, settings: { audioChannelType: 1, audioChannelCount: 2 }, audioTracks: [{ name: 'A1', id: 'track', index: 0, muted: true, clipCount: 1, clipInventoryComplete: true, clips: [{ name: 'Clip', occurrenceIndex: 0, disabled: false, componentChain: { componentCount: 0, componentInventoryComplete: true, components: [] }, sourceProjectItem: { componentChain: { componentCount: 0, componentInventoryComplete: true, components: [] } } }] }] }] };
}
test('diagnostics distinguish observation coverage from capability Unknowns', () => {
  const report = complete(); report.unknowns = ['Output bus topology is not established.'];
  const result = diagnose(report);
  assert.equal(result.status, 'COMPLETE'); assert.equal(result.unknown.length, 1);
  assert.equal(result.coverage.capabilities.outputBusTopology, 'UNKNOWN');
  assert.equal(result.coverage.tracks.known, 1); assert.equal(result.coverage.clips.unknown, 0);
});
test('modern reports require inventory proof before an aggregate mute finding', () => {
  const report = complete(); delete report.sequences[0].audioTracks[0].clipInventoryComplete;
  const result = diagnose(report);
  assert.equal(result.status, 'PARTIAL');
  assert.deepEqual(result.risk.map(f => f.ruleId), ['ARID-002']);
});
test('declared counts and malformed slots cannot support an aggregate mute finding', () => {
  for (const mutation of [
    report => { report.sequences[0].audioTrackCount = 2; },
    report => { report.sequences[0].audioTracks[0].clipCount = 2; },
    report => { report.sequences[0].audioTracks.push(null); },
    report => { report.sequences[0].audioTracks[0].clips.push(null); }
  ]) {
    const report = complete(); mutation(report);
    assert.ok(!diagnose(report).risk.some(f => f.ruleId === 'ARID-001'));
  }
});
test('explicit incomplete enumeration and missing component evidence have diagnostic causes', () => {
  const report = complete(); report.sequenceInventoryComplete = false;
  delete report.sequences[0].audioTracks[0].clips[0].componentChain;
  const result = diagnose(report);
  assert.equal(result.status, 'PARTIAL');
  assert.ok(result.unknown.some(f => /Sequence enumeration incomplete/.test(f.observed)));
  assert.ok(result.unknown.some(f => /Clip component-chain observation unavailable/.test(f.observed) && f.location.clipOccurrenceIndex === 0));
});
test('missing diagnostic inputs become scoped Unknowns even without adapter error strings', () => {
  const report = complete(), sequence = report.sequences[0], track = sequence.audioTracks[0];
  sequence.settings.audioChannelCount = null; track.muted = undefined; track.clips[0].disabled = null;
  const result = diagnose(report);
  assert.equal(result.status, 'PARTIAL'); assert.equal(result.risk.length, 0);
  assert.equal(result.unknown.length, 3); assert.equal(result.coverage.clips.unknown, 1);
  assert.ok(result.unknown.every(f => f.severity === 'Unknown' && f.location.sequenceGuid === 'seq'));
  assert.ok(result.unknown.some(f => f.location.trackId === 'track' && f.location.clipOccurrenceIndex === 0));
  assert.match(result.information[0].observed, /count=Unknown/);
});
test('a failed enumeration has an unavailable denominator; a verified empty one has zero', () => {
  const report = complete(), track = report.sequences[0].audioTracks[0];
  track.clips = []; track.clipCount = null; track.clipInventoryComplete = false; track.errors = ['getTrackItems: access rejected']; report.completion = 'partial';
  const failure = diagnose(report);
  assert.equal(failure.coverage.clips.status, 'UNKNOWN'); assert.equal(failure.coverage.clips.expected, null); assert.equal(failure.coverage.clips.unknown, null);
  track.clipCount = 0; track.clipInventoryComplete = true; track.errors = []; report.completion = 'completed';
  const empty = diagnose(report);
  assert.equal(empty.status, 'COMPLETE'); assert.equal(empty.coverage.clips.expected, 0); assert.equal(empty.coverage.clips.unknown, 0);
});
test('failed project acquisition is UNKNOWN; local component failures retain risk intent wording', () => {
  assert.equal(diagnose({ completion: 'failed', project: null, sequences: [], errors: ['getActiveProject: denied'] }).status, 'UNKNOWN');
  const report = complete(), clip = report.sequences[0].audioTracks[0].clips[0];
  clip.disabled = true; clip.componentChain.errors = ['getComponentCount: unavailable']; clip.componentChain.componentInventoryComplete = false;
  report.completion = 'partial';
  const result = diagnose(report);
  assert.equal(result.status, 'PARTIAL');
  assert.deepEqual(result.risk.map(f => f.ruleId), ['ARID-001', 'ARID-003']);
  assert.ok(result.risk.every(f => /intent|creative/.test(f.why)));
  assert.equal(result.unknown[0].location.clipOccurrenceIndex, 0);
});
