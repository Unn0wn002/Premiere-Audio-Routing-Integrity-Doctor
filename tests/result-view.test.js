'use strict';
// Result view: counters, Show targets, audio timeline map, the panel wiring (test doubles, NOT host evidence),
// and the guard that keeps the only view-changing Premiere calls inside showLocation.
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const reporting = require('../src/report');
const { shortName, blockLabel, summaryCards, scopeLine, showTarget, trackMap } = reporting;

const adapterSource = fs.readFileSync(path.join(__dirname, '../src/premiereAdapter.js'), 'utf8');
// Objects built inside the vm sandbox have another realm's prototypes, so they are compared as plain JSON.
const plain = value => JSON.parse(JSON.stringify(value));
const t = (seconds, ticks = String(seconds * 254016000000)) => ({ seconds, ticks });

function observation(extra = {}) {
  return Object.assign({
    completion: 'completed', durationMs: 5, project: { name: 'P' }, unknowns: ['Routing unknown'],
    sequences: [{
      name: 'Seq', guid: 'g1', occurrenceIndex: 0,
      audioTracks: [
        { name: 'Audio 1', index: 0, muted: true, clips: [
          { name: 'dialog.wav', occurrenceIndex: 0, disabled: false, startTime: t(0), endTime: t(10) },
          { name: 'music.wav', occurrenceIndex: 1, disabled: true, startTime: t(10), endTime: t(20) }] },
        { name: 'Audio 2', index: 1, muted: false, clips: [] }
      ]
    }]
  }, extra);
}
const clipLocation = { sequence: 'Seq', sequenceGuid: 'g1', sequenceOccurrenceIndex: 0, track: 'Audio 1', trackIndex: 0, clip: 'music.wav', clipOccurrenceIndex: 1, startTime: t(10) };
const finding = (ruleId, severity, location) => ({ ruleId, severity, confidence: 'C', location, observed: 'o', why: 'w', remediation: 'r' });
const diagnostics = () => ({
  status: 'COMPLETE',
  risk: [finding('ARID-003', 'Review', clipLocation), finding('ARID-002', 'Review', { sequence: 'Seq', sequenceGuid: 'g1', sequenceOccurrenceIndex: 0, track: 'Audio 1', trackIndex: 0 })],
  information: [finding('ARID-I01', 'Information', { sequence: 'Seq', sequenceGuid: 'g1', sequenceOccurrenceIndex: 0 })],
  unknown: [finding('ARID-U01', 'Unknown', { project: 'P' }), finding('ARID-U02', 'Unknown', { project: 'P' })]
});

test('shortName keeps the start and the ending; blockLabel fits the block width', () => {
  assert.equal(shortName('dialog.wav', 26), 'dialog.wav');
  const s = shortName('Interview_2026-10-13T17_38_49.629Z_final.wav', 26);
  assert.ok(s.length <= 26 && s.startsWith('Interview_') && s.endsWith('final.wav'.slice(-8)) && s.includes('…'), s);
  assert.equal(shortName(undefined, 26), '');
  assert.equal(blockLabel('music.wav', 100), 'music.wav');
  assert.equal(blockLabel('music_long_name.wav', 20), 'music…');
  assert.equal(blockLabel('music.wav', 5), '');
  assert.equal(blockLabel('x', 'bad'), '');
});

test('summaryCards counts review, unknown and information findings; scopeLine counts what was observed', () => {
  const report = reporting.createReport(observation(), diagnostics());
  assert.deepEqual(summaryCards(report).map(c => [c.key, c.count]), [['risk', 2], ['unknown', 2], ['information', 1]]);
  assert.deepEqual(summaryCards(null).map(c => c.count), [0, 0, 0]);
  assert.equal(scopeLine(report), '1 sequence · 2 audio tracks · 2 clips');
  assert.equal(scopeLine(null), '0 sequences · 0 audio tracks · 0 clips');
});

test('showTarget: clip findings place the playhead, track/sequence findings open the sequence, project findings have no target', () => {
  assert.deepEqual(showTarget(clipLocation), { kind: 'clip', label: 'Show clip: music.wav (Audio 1)' });
  assert.deepEqual(showTarget({ sequence: 'Seq', sequenceGuid: 'g1', track: 'Audio 1' }), { kind: 'sequence', label: 'Show sequence: Seq' });
  assert.equal(showTarget({ project: 'P' }), null);
  assert.equal(showTarget(null), null);
  assert.equal(showTarget({ sequenceOccurrenceIndex: 0 }).label, 'Show sequence: sequence');
  assert.equal(showTarget({ ...clipLocation, startTime: null }).kind, 'sequence');
  assert.equal(showTarget({ ...clipLocation, track: null, trackIndex: 2 }).label, 'Show clip: music.wav (A3)');
  assert.ok(showTarget({ ...clipLocation, clip: 'A_very_long_clip_name_that_would_overflow_a_narrow_dock.wav' }).label.length <= 'Show clip: '.length + 22 + ' (Audio 1)'.length);
});

test('trackMap: positions clips on the sequence length, flags review clips, dims muted lanes, hides empty tracks', () => {
  const report = reporting.createReport(observation(), diagnostics());
  const [seq] = trackMap(report);
  assert.equal(seq.length, 20);
  assert.equal(seq.emptyTracks, 1);
  assert.equal(seq.lanes.length, 1);
  const [lane] = seq.lanes;
  assert.equal(lane.muted, true);
  assert.deepEqual(lane.blocks.map(b => [b.name, b.left, b.width, b.disabled, b.flagged]), [['dialog.wav', 0, 50, false, false], ['music.wav', 50, 50, true, true]]);
  assert.equal(lane.blocks[1].location.clipOccurrenceIndex, 1);
  assert.deepEqual(lane.blocks[1].location.startTime, t(10));
});

test('trackMap keeps repeated sequence names apart, counts clips without time data and omits beyond the cap', () => {
  const o = observation();
  const second = JSON.parse(JSON.stringify(o.sequences[0])); second.occurrenceIndex = 1; second.guid = 'g2';
  o.sequences.push(second);
  const flaggedSecond = { ...clipLocation, sequenceGuid: 'g2', sequenceOccurrenceIndex: 1 };
  const report = reporting.createReport(o, { risk: [finding('ARID-003', 'Review', flaggedSecond)], information: [], unknown: [] });
  const maps = trackMap(report);
  assert.deepEqual(maps.map(m => m.lanes[0].blocks.map(b => b.flagged)), [[false, false], [false, true]]);

  const odd = observation();
  odd.sequences[0].audioTracks[0].clips = [
    { name: 'a', occurrenceIndex: 0, startTime: t(0), endTime: t(10) },
    { name: 'b', occurrenceIndex: 1, startTime: t(10) },
    { name: 'c', occurrenceIndex: 2, startTime: t(12), endTime: t(14) },
    { name: 'd', occurrenceIndex: 3, startTime: t(14), endTime: t(16) }
  ];
  const sparse = trackMap(reporting.createReport(odd, { risk: [], information: [], unknown: [] }), 2)[0];
  assert.equal(sparse.unplaced, 1);
  assert.equal(sparse.grouped, 3, 'above the cap, normal clips are grouped into spans');
  assert.deepEqual(sparse.lanes[0].blocks.map(b => [b.name, b.merged]), [['a', 1], ['2 clips', 2]]);
  const empty = trackMap(reporting.createReport({ completion: 'completed', sequences: [] }, { risk: [], information: [], unknown: [] }));
  assert.deepEqual(empty, []);
});

test('trackMap on a dense track keeps full lane coverage and never hides a disabled or flagged clip', () => {
  const clips = Array.from({ length: 1024 }, (_, i) => ({ name: `c${i}`, occurrenceIndex: i, disabled: i === 800, startTime: t(i), endTime: t(i + 1) }));
  const o = observation(); o.sequences[0].audioTracks = [{ name: 'Audio 1', index: 0, muted: false, clips }];
  const flaggedLocation = { sequence: 'Seq', sequenceGuid: 'g1', sequenceOccurrenceIndex: 0, track: 'Audio 1', trackIndex: 0, clip: 'c900', clipOccurrenceIndex: 900, startTime: t(900) };
  const started = Date.now();
  const [seq] = trackMap(reporting.createReport(o, { risk: [finding('ARID-003', 'Review', flaggedLocation)], information: [], unknown: [] }));
  assert.ok(Date.now() - started < 1000);
  const blocks = seq.lanes[0].blocks;
  assert.ok(blocks.length < 10, `blocks: ${blocks.length}`);
  assert.equal(seq.grouped, 1022);
  assert.deepEqual(blocks.filter(b => b.disabled || b.flagged).map(b => [b.name, b.disabled, b.flagged]), [['c800', true, false], ['c900', false, true]]);
  const span = blocks[0];
  assert.equal(span.name, '1022 clips'); assert.equal(span.left, 0); assert.equal(span.width, 100);
  assert.equal(seq.omitted, 0);
  // moderate density below the cap is still drawn clip by clip
  const small = observation();
  const few = trackMap(reporting.createReport(small, { risk: [], information: [], unknown: [] }), 300)[0];
  assert.equal(few.grouped, 0); assert.equal(few.lanes[0].blocks.length, 2);
});

test('trackMap marks cancelled, partial and failed scans as incomplete', () => {
  for (const completion of ['cancelled', 'partial', 'failed']) {
    const [seq] = trackMap(reporting.createReport(observation({ completion }), { risk: [], information: [], unknown: [] }));
    assert.equal(seq.incomplete, true, completion);
  }
  assert.equal(trackMap(reporting.createReport(observation(), { risk: [], information: [], unknown: [] }))[0].incomplete, false);
});

// ---- panel wiring with the same style of fake DOM as the other panel tests ----
function element(tag = 'div') {
  return { tag, dataset: {}, style: {}, children: [], handlers: {}, hidden: false, valueText: '', get textContent() { return this.valueText; }, set textContent(value) { this.valueText = value; this.children = []; }, appendChild(child) { this.children.push(child); }, addEventListener(event, handler) { this.handlers[event] = handler; } };
}
function panel(scan, show, diagnostic = diagnostics) {
  const ids = ['scanButton', 'cancelButton', 'jsonButton', 'htmlButton', 'detailsButton', 'previousPageButton', 'nextPageButton', 'pageStatus', 'status', 'summary', 'progress', 'exportStatus', 'findings', 'output', 'cards', 'scopeLine', 'mapSection', 'trackMap', 'previewStatus'];
  const elements = Object.fromEntries(ids.map(id => [id, element()]));
  elements.output.hidden = true; elements.mapSection.hidden = true;
  let setup;
  vm.runInNewContext(fs.readFileSync(path.join(__dirname, '../index.js'), 'utf8'), {
    document: { getElementById: id => elements[id], createElement: element },
    require: name => name === 'uxp' ? { entrypoints: { setup: value => { setup = value; } }, storage: { localFileSystem: { getFileForSaving: async () => null }, formats: { utf8: 'utf8' } } }
      : name.includes('premiereAdapter') ? { scanActiveProject: scan, showLocation: show }
      : name.includes('report') ? reporting : { diagnose: diagnostic }
  });
  const p = setup.panels['audio-routing-integrity-probe']; p.create(); p.show();
  return elements;
}
const walk = (node, visit) => { visit(node); (node.children || []).forEach(child => walk(child, visit)); };
const all = (node, predicate) => { const out = []; walk(node, n => { if (predicate(n)) out.push(n); }); return out; };

test('panel shows counters, the scope line and the audio timeline after a scan; hidden again before the next one', async () => {
  const e = panel(async () => observation(), async () => ({ opened: true, positioned: true }));
  assert.equal(e.mapSection.hidden, true);
  await e.scanButton.handlers.click();
  assert.deepEqual(e.cards.children.map(c => [c.children[0].textContent, c.children[1].textContent]), [['2', 'To review'], ['2', 'Unknown'], ['1', 'Information']]);
  assert.equal(e.scopeLine.textContent, '1 sequence · 2 audio tracks · 2 clips');
  assert.equal(e.mapSection.hidden, false);
  const blocks = all(e.trackMap, n => n.className && n.className.startsWith('block'));
  assert.deepEqual(blocks.map(b => b.className), ['block inmuted', 'block disabled flagged inmuted']);
  assert.equal(blocks[1].style.left, '50%'); assert.equal(blocks[1].style.width, '50%');
  assert.ok(all(e.trackMap, n => n.className === 'lane muted').length === 1);
  assert.match(blocks[1].title, /music\.wav · disabled · track muted/);
});

test('findings keep their structure and gain a coloured header and a Show chip only where a target exists', async () => {
  const e = panel(async () => observation(), async () => ({ opened: false, positioned: true }));
  await e.scanButton.handlers.click();
  const cards = e.findings.children.filter(n => n.className && n.className.startsWith('finding '));
  assert.equal(cards.length, 5);
  const classes = cards.map(c => c.className);
  assert.ok(classes.includes('finding unknown'));
  const chips = all(e.findings, n => n.className === 'showchip');
  assert.deepEqual(chips.map(c => c.textContent).sort(), ['Show clip: music.wav (Audio 1)', 'Show sequence: Seq', 'Show sequence: Seq']);
  const header = cards.map(c => c.children.find(n => n.tag === 'strong'));
  assert.ok(header.every(h => /^(Review|Information|Unknown) · ARID-/.test(h.textContent)));
  assert.ok(header.some(h => h.className === 'sevtext sev-Review'));
  const reviewCard = cards.find(c => c.children.some(n => n.tag === 'strong' && n.textContent === 'Review · ARID-003'));
  assert.equal(reviewCard.style.borderColor, '#ffc74d');
});

test('Show chips and timeline blocks call showLocation with the finding or clip location and report the outcome', async () => {
  const calls = [];
  const e = panel(async () => observation(), async location => { calls.push(location); return { opened: location.clip == null, positioned: location.clip != null }; });
  await e.scanButton.handlers.click();
  assert.equal(calls.length, 0, 'scanning must not move the playhead or open sequences');
  const chips = all(e.findings, n => n.className === 'showchip');
  const clipChip = chips.find(c => c.textContent.startsWith('Show clip'));
  await clipChip.handlers.click();
  assert.equal(calls.length, 1); assert.equal(calls[0].clip, 'music.wav'); assert.deepEqual(calls[0].startTime, t(10));
  assert.match(e.previewStatus.textContent, /Playhead moved to "music\.wav"/);
  await chips.find(c => c.textContent.startsWith('Show sequence')).handlers.click();
  assert.match(e.previewStatus.textContent, /Opened: sequence "Seq"/);
  const block = all(e.trackMap, n => n.className && n.className.startsWith('block'))[0];
  await block.handlers.click();
  assert.equal(calls[2].clip, 'dialog.wav'); assert.equal(calls[2].sequenceGuid, 'g1');
});

test('a failed Show is reported in the panel and never blocks scanning; Show is ignored while a scan runs', async () => {
  const e = panel(async () => observation(), async () => { throw Error('Sequence not found'); });
  await e.scanButton.handlers.click();
  const chip = all(e.findings, n => n.className === 'showchip')[0];
  await chip.handlers.click();
  assert.match(e.previewStatus.textContent, /Could not show it: Sequence not found/);
  assert.equal(e.scanButton.disabled, false);

  // A chip from the previous scan must do nothing while the next scan is running.
  let finish, shown = 0, scans = 0;
  const busy = panel(() => { scans++; return scans === 1 ? Promise.resolve(observation()) : new Promise(resolve => { finish = resolve; }); }, async () => { shown++; return { opened: true, positioned: false }; });
  await busy.scanButton.handlers.click();
  const staleChip = all(busy.findings, n => n.className === 'showchip')[0];
  const second = busy.scanButton.handlers.click();
  assert.equal(busy.scanButton.disabled, true);
  await staleChip.handlers.click();
  assert.equal(shown, 0);
  finish(observation()); await second;
  await all(busy.findings, n => n.className === 'showchip')[0].handlers.click();
  assert.equal(shown, 1);
});

test('panel renders empty, cancelled and failed scans without a timeline lie or an exception', async () => {
  const real = require('../src/diagnostics').diagnose;
  const empty = panel(async () => ({ completion: 'completed', durationMs: 3, project: { name: 'Empty' }, sequences: [], unknowns: ['u'] }), async () => ({}), real);
  await empty.scanButton.handlers.click();
  assert.deepEqual(empty.cards.children.map(c => c.children[0].textContent), ['0', '1', '0']);
  assert.equal(empty.scopeLine.textContent, '0 sequences · 0 audio tracks · 0 clips');
  assert.equal(empty.mapSection.hidden, true);

  const cancelled = observation({ completion: 'cancelled' });
  const c = panel(async () => cancelled, async () => ({}), real);
  await c.scanButton.handlers.click();
  assert.match(c.status.textContent, /cancelled/i);
  const note = all(c.trackMap, n => n.className === 'seqname')[0].textContent;
  assert.match(note, /scan incomplete: only the observed clips are drawn/);

  const failed = panel(async () => ({ completion: 'failed', durationMs: 1, project: null, sequences: [], errors: ['No active Premiere project.'] }), async () => ({}), real);
  await failed.scanButton.handlers.click();
  assert.equal(failed.mapSection.hidden, true);
  assert.equal(failed.cards.children.length, 3);
  assert.equal(failed.scanButton.disabled, false);
});

// ---- adapter: showLocation with mocks ----
function loadAdapter(project, ticks = { createWithSeconds: seconds => ({ made: 'seconds', seconds }) }) {
  const module = { exports: {} };
  vm.runInNewContext(adapterSource, {
    module, Date, setTimeout,
    require: name => name === 'premierepro' ? { Project: { getActiveProject: async () => project }, TickTime: ticks, Constants: { TrackItemType: { CLIP: 1 }, MediaType: { AUDIO: 1 } }, ClipProjectItem: { cast: x => x } }
      : name === 'uxp' ? { host: { name: 'Mock', version: '26.5.2', uiLocale: 'en_US' }, versions: { uxp: 'mock', plugin: '0.3.0' } } : require('../src/valueSerializer')
  });
  return module.exports;
}
function world({ active = 0, activate = async () => true } = {}) {
  const log = { activated: [], positioned: [] };
  const makeSequence = (name, guid) => ({ name, guid: { toString: () => guid }, setPlayerPosition: async time => { log.positioned.push([name, time]); return true; } });
  const sequences = [makeSequence('A', 'ga'), makeSequence('B', 'gb')];
  const project = { getSequences: async () => sequences, getActiveSequence: async () => sequences[active], setActiveSequence: async sequence => { log.activated.push(sequence.name); return activate(sequence); } };
  return { project, sequences, log };
}

test('showLocation opens another sequence by guid, then puts the playhead on the clip start', async () => {
  const { project, log } = world({ active: 0 });
  const result = await loadAdapter(project).showLocation({ sequenceGuid: 'gb', clip: 'c', startTime: t(12.5) });
  assert.deepEqual(plain(result), { opened: true, positioned: true });
  assert.deepEqual(log.activated, ['B']);
  assert.deepEqual(log.positioned, [['B', { made: 'seconds', seconds: 12.5 }]]);
});

test('showLocation does not reopen the active sequence, opens without moving for track-level locations, and falls back to the occurrence index', async () => {
  let w = world({ active: 1 });
  assert.deepEqual(plain(await loadAdapter(w.project).showLocation({ sequenceGuid: 'gb', clip: 'c', startTime: t(1) })), { opened: false, positioned: true });
  assert.deepEqual(w.log.activated, []);
  w = world({ active: 1 });
  assert.deepEqual(plain(await loadAdapter(w.project).showLocation({ sequenceOccurrenceIndex: 0, track: 'Audio 1' })), { opened: true, positioned: false });
  assert.deepEqual(w.log.activated, ['A']); assert.deepEqual(w.log.positioned, []);
  w = world({ active: 0 });
  await loadAdapter(w.project, { createWithTicks: ticksText => ({ made: 'ticks', ticksText }) }).showLocation({ sequenceGuid: 'ga', clip: 'c', startTime: t(2, '508032000000') });
  assert.deepEqual(w.log.positioned, [['A', { made: 'ticks', ticksText: '508032000000' }]]);
});

test('showLocation reports missing sequences and projects instead of guessing', async () => {
  const { project } = world();
  await assert.rejects(() => loadAdapter(project).showLocation({ sequenceGuid: 'gone' }), /Sequence not found/);
  await assert.rejects(() => loadAdapter(project).showLocation({ project: 'P' }), /Sequence not found/);
  const nothing = loadAdapter(null);
  await assert.rejects(() => nothing.showLocation({ sequenceGuid: 'ga' }), /No active project/);
  await assert.rejects(() => loadAdapter(world().project, {}).showLocation({ sequenceGuid: 'ga', clip: 'c', startTime: t(1) }), /TickTime factory not available/);
});

test('guard: setActiveSequence and setPlayerPosition appear only inside showLocation, never in the scanner', () => {
  const start = adapterSource.indexOf('async function showLocation');
  const end = adapterSource.indexOf('module.exports', start);
  assert.ok(start > 0 && end > start);
  const outside = adapterSource.slice(0, start) + adapterSource.slice(end);
  assert.ok(!/setActiveSequence|setPlayerPosition/.test(outside));
  assert.ok(/setActiveSequence/.test(adapterSource.slice(start, end)) && /setPlayerPosition/.test(adapterSource.slice(start, end)));
});

test('a grouped span has no bar text, so a disabled clip drawn on top of it cannot cover a label', async () => {
  const e = panel(async () => observation({ sequences: [{ name: 'Seq', guid: 'g1', occurrenceIndex: 0, audioTracks: [{ name: 'Audio 1', index: 0, muted: false, clips: Array.from({ length: 400 }, (_, i) => ({ name: `c${i}.wav`, occurrenceIndex: i, disabled: i === 0, startTime: t(i), endTime: t(i + 1) })) }] }] }), async () => ({ opened: true, positioned: true }));
  await e.scanButton.handlers.click();
  const blocks = all(e.trackMap, n => n.className && n.className.startsWith('block'));
  const span = blocks.find(b => b.title.includes(' clips grouped') && !b.className.includes('disabled'));
  assert.ok(span, 'the grouped span exists');
  assert.equal(span.textContent, '');
  const disabled = blocks.find(b => b.className.includes('disabled'));
  assert.ok(disabled && disabled.title.startsWith('c0.wav'), 'the disabled clip is its own block');
});
