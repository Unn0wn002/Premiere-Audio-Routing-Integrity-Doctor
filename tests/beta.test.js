const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const os = require('node:os');
const { diagnose } = require('../src/diagnostics');
const reporting = require('../src/report');
const { prepareBeta, files } = require('../scripts/prepare-beta');
const observation = (completion = 'completed') => ({ completion, generatedAt: '2026-10-04T00:00:00.000Z', durationMs: 5, project: { name: 'Captured' }, sequences: [], unknowns: ['Routing unknown'] });
function adapter(project) {
  const module = { exports: {} };
  vm.runInNewContext(fs.readFileSync(path.join(__dirname, '../src/premiereAdapter.js'), 'utf8'), {
    module, Date, setTimeout,
    require: name => name === 'premierepro' ? { Project: { getActiveProject: () => project }, Constants: { TrackItemType: { CLIP: 1 }, MediaType: { AUDIO: 1 } }, ClipProjectItem: { cast: x => x } } : name === 'uxp' ? { host: { name: 'Mock Premiere', version: '26.5.2', uiLocale: 'en_US' }, versions: { uxp: 'mock', plugin: '0.2.0' } } : require('../src/valueSerializer')
  });
  return module.exports;
}
function element(tag = 'div') {
  return { tag, dataset: {}, children: [], handlers: {}, hidden: false, valueText: '', get textContent() { return this.valueText; }, set textContent(value) { this.valueText = value; this.children = []; }, appendChild(child) { this.children.push(child); }, addEventListener(event, handler) { this.handlers[event] = handler; } };
}
function ui(scan, picker = async () => null, diagnostic = diagnose) {
  const elements = Object.fromEntries(['scanButton', 'cancelButton', 'jsonButton', 'htmlButton', 'detailsButton', 'previousPageButton', 'nextPageButton', 'pageStatus', 'status', 'summary', 'progress', 'exportStatus', 'findings', 'output'].map(id => [id, element()]));
  elements.output.hidden = true;
  let setup;
  vm.runInNewContext(fs.readFileSync(path.join(__dirname, '../index.js'), 'utf8'), {
    document: { getElementById: id => elements[id], createElement: element },
    require: name => name === 'uxp' ? { entrypoints: { setup: value => { setup = value; } }, storage: { localFileSystem: { getFileForSaving: picker }, formats: { utf8: 'utf8' } } } : name.includes('premiereAdapter') ? { scanActiveProject: scan } : name.includes('report') ? reporting : { diagnose: diagnostic }
  });
  const panel = setup.panels['audio-routing-integrity-probe']; panel.create(); panel.show();
  return elements;
}
test('A4 initial panel render failure releases scan lock and allows retry', async () => {
  let calls = 0, fail = true;
  const e = ui(async () => { calls++; return observation(); });
  Object.defineProperty(e.summary, 'textContent', {
    get() { return this.valueText; },
    set(value) { if (fail) { fail = false; throw Error('panel render unavailable'); } this.valueText = value; }
  });
  await e.scanButton.handlers.click();
  assert.equal(calls, 0, 'failed initialization must not start host reads');
  assert.match(e.status.textContent, /failed/i);
  assert.equal(e.scanButton.disabled, false);
  await e.scanButton.handlers.click();
  assert.equal(calls, 1);
  assert.match(e.status.textContent, /completed/i);
  assert.equal(e.jsonButton.disabled, false);
});

test('A4 initial export control failure releases export lock and allows retry', async () => {
  let pickerCalls = 0, written;
  const e = ui(async () => observation(), async () => {
    pickerCalls++;
    return { write: async value => { written = value; } };
  });
  await e.scanButton.handlers.click();
  let fail = true, disabled = e.jsonButton.disabled;
  Object.defineProperty(e.jsonButton, 'disabled', {
    get() { return disabled; },
    set(value) { if (fail) { fail = false; throw Error('export controls unavailable'); } disabled = value; }
  });
  await e.jsonButton.handlers.click();
  assert.equal(pickerCalls, 0);
  assert.match(e.exportStatus.textContent, /Export failed: export controls unavailable/);
  assert.equal(e.scanButton.disabled, false);
  assert.equal(e.jsonButton.disabled, false);
  await e.jsonButton.handlers.click();
  assert.equal(pickerCalls, 1);
  assert.equal(JSON.parse(written).observation.project.name, 'Captured');
  assert.equal(e.scanButton.disabled, false);
});

test('cancel before acquisition avoids host reads and measures duration', async () => {
  const report = await adapter(null).scanActiveProject({ isCancelled: () => true });
  assert.equal(report.completion, 'cancelled'); assert.equal(report.project, null);
  assert.equal(report.scanTraversalComplete, false); assert.ok(report.durationMs >= 0);
  assert.ok(diagnose(report).unknown.some(f => f.ruleId === 'ARID-U-CANCELLED'));
});
test('cancel inside a track retains evidence without asserting entire inventory muted', async () => {
  let cancelled = false, calls = 0;
  const clip = () => ({ getName: () => 'same', getMatchName: () => 'clip', getStartTime: () => ({ ticks: '12345678901234567890', seconds: 1 }), getEndTime: () => ({ ticks: '12345678901234567891', seconds: 2 }), isDisabled: () => { calls++; cancelled = true; return true; }, getComponentChain: () => ({ getComponentCount: () => 0 }), getProjectItem: () => ({ name: 'source', getComponentChain: () => ({ getComponentCount: () => 0 }) }) });
  const sequence = { name: 's', guid: 's', getSettings: () => ({ getAudioChannelCount: () => 2, getAudioChannelType: () => 1, getAudioSampleRate: () => ({ value: 48000, ticksPerFrame: 5292000 }) }), getAudioTrackCount: () => 1, getAudioTrack: () => ({ name: 'A1', id: 't', getIndex: () => 0, isMuted: () => true, getTrackItems: () => [clip(), clip()] }) };
  const report = await adapter({ name: 'p', guid: 'p', path: '', getSequences: () => [sequence] }).scanActiveProject({ isCancelled: () => cancelled });
  assert.equal(report.completion, 'cancelled'); assert.equal(calls, 1);
  assert.equal(report.sequences[0].audioTracks[0].clipInventoryComplete, false);
  const diagnostics = diagnose(report);
  assert.ok(!diagnostics.risk.some(f => f.ruleId === 'ARID-001'));
  assert.ok(diagnostics.risk.some(f => f.ruleId === 'ARID-003'));
});
test('progress and duration available on successful and failed scans', async () => {
  const progress = [];
  const report = await adapter({ name: 'p', guid: 'p', path: '', getSequences: () => [] }).scanActiveProject({ onProgress: p => progress.push(p.phase) });
  assert.equal(report.completion, 'completed'); assert.equal(report.scanTraversalComplete, true);
  assert.deepEqual(progress, ['project', 'finished']); assert.ok(report.durationMs >= 0);
  assert.ok((await adapter(null).scanActiveProject()).durationMs >= 0);
});
test('HTML export escapes user names and raw evidence; review states are independent', () => {
  const o = observation(); o.project.name = '</pre><script>alert(1)</script>';
  const report = reporting.createReport(o, diagnose(o));
  reporting.annotate(report, 'unknown:0', 'reviewed');
  assert.equal(report.annotations['unknown:0'], 'reviewed');
  const html = reporting.toHTML(report);
  assert.ok(!html.includes('<script>')); assert.ok(html.includes('&lt;script&gt;'));
  assert.ok(html.includes('Review: reviewed')); assert.ok(html.includes('Routing unknown'));
  assert.deepEqual(reporting.createReport(o, diagnose(o)).annotations, {});
  assert.throws(() => reporting.annotate(report, 'unknown:0', 'invalid'));
  assert.throws(() => reporting.annotate(report, 'risk:99', 'reviewed'));
});
test('grouping separates repeated sequence names and preserves exact tick locator', () => {
  const report = reporting.createReport(observation(), { risk: [0, 1].map(i => ({ location: { sequence: 'same', sequenceOccurrenceIndex: i, trackIndex: 0, clip: 'same', clipOccurrenceIndex: i, startTime: { ticks: '12345678901234567890', seconds: 1 } } })), information: [], unknown: [] });
  assert.equal(reporting.groups(report).length, 2);
  assert.match(reporting.locationText(report.diagnostics.risk[1].location), /clip #2.*12345678901234567890/);
});
test('panel cancellation, recovery, duplicate scan guard and review reset', async () => {
  let finish, options, calls = 0;
  const e = ui(o => { calls++; options = o; return new Promise(resolve => { finish = resolve; }); });
  const first = e.scanButton.handlers.click(); await e.scanButton.handlers.click();
  assert.equal(calls, 1); assert.equal(e.cancelButton.disabled, false);
  e.cancelButton.handlers.click(); assert.equal(options.isCancelled(), true);
  finish(observation('cancelled')); await first;
  assert.match(e.status.textContent, /cancelled/i); assert.equal(e.scanButton.disabled, false);
  const second = e.scanButton.handlers.click(); assert.equal(options.isCancelled(), false);
  finish(observation()); await second;
  const select = e.findings.children.find(c => c.className === 'finding unknown').children.find(c => c.tag === 'label').children[0];
  select.value = 'intentional'; select.handlers.change();
  assert.equal(e.output.value, '');
  e.detailsButton.handlers.click();
  assert.equal(JSON.parse(e.output.value).annotations['unknown:0'], 'intentional');
  const third = e.scanButton.handlers.click(); finish(observation()); await third;
  e.detailsButton.handlers.click();
  assert.deepEqual(JSON.parse(e.output.value).annotations, {});
});

const manyDiagnostics = () => ({ status: 'COMPLETE', risk: Array.from({ length: 60 }, (_, i) => ({ruleId: `REVIEW-${i}`, severity: 'Review', location: {sequence: 'Repeated', sequenceOccurrenceIndex: i % 2, trackIndex: 0}, observed: `Evidence ${i}`})), information: [], unknown: [{ruleId: 'CAPABILITY', severity: 'Unknown', location: {project: 'Captured'}, observed: 'Routing unknown'}] });
const cards = e => e.findings.children.filter(n => n.className && n.className.startsWith('finding '));
const reviewSelect = card => card.children.find(n => n.tag === 'label').children[0];

test('paged review reaches every finding once and preserves annotations and full exports', async () => {
  let written;
  const e = ui(async () => observation(), async () => ({write: async value => {written = value;}}), manyDiagnostics);
  await e.scanButton.handlers.click();
  assert.equal(e.output.value, '');
  assert.equal(cards(e).length, 25); assert.equal(e.previousPageButton.disabled, true);
  const seen = [];
  const first = reviewSelect(cards(e)[0]); first.value = 'intentional'; first.handlers.change();
  for (;;) {
    seen.push(...cards(e).map(c => c.children.find(n => n.tag === 'strong').textContent));
    if (e.nextPageButton.disabled) break;
    e.nextPageButton.handlers.click();
  }
  assert.equal(seen.length, 61); assert.equal(new Set(seen).size, 61);
  assert.equal(cards(e).length, 11); assert.match(e.pageStatus.textContent, /51–61 of 61/);
  assert.ok(seen.some(s => s.includes('CAPABILITY')));
  e.nextPageButton.handlers.click(); assert.match(e.pageStatus.textContent, /Page 3 of 3/);
  e.previousPageButton.handlers.click(); e.previousPageButton.handlers.click();
  assert.equal(reviewSelect(cards(e)[0]).value, 'intentional');
  assert.equal(e.output.value, '');
  await e.jsonButton.handlers.click();
  const report = JSON.parse(written);
  assert.equal(report.diagnostics.risk.length, 60); assert.equal(report.diagnostics.unknown.length, 1);
  assert.equal(report.annotations['risk:0'], 'intentional');
  await e.htmlButton.handlers.click();
  for (let i = 0; i < 60; i++) assert.ok(written.includes(`REVIEW-${i}`), `HTML export missing REVIEW-${i}`);
  assert.ok(written.includes('CAPABILITY'));
});

test('raw evidence is demand-driven, refreshed on annotation and cleared/reset by hide or rescan', async () => {
  const e = ui(async () => observation(), undefined, manyDiagnostics);
  await e.scanButton.handlers.click(); assert.equal(e.output.value, '');
  e.detailsButton.handlers.click(); assert.equal(JSON.parse(e.output.value).diagnostics.risk.length, 60);
  const select = reviewSelect(cards(e)[0]); select.value = 'reviewed'; select.handlers.change();
  assert.equal(JSON.parse(e.output.value).annotations['risk:0'], 'reviewed');
  e.detailsButton.handlers.click(); assert.equal(e.output.hidden, true); assert.equal(e.output.value, '');
  e.nextPageButton.handlers.click(); await e.scanButton.handlers.click();
  assert.match(e.pageStatus.textContent, /Page 1 of 3/); assert.equal(e.output.hidden, true);
  e.detailsButton.handlers.click(); assert.deepEqual(JSON.parse(e.output.value).annotations, {});
});

test('pagination and raw controls cannot change during export or scan; failure remains inspectable', async () => {
  let finish, resolvePicker;
  const e = ui(() => new Promise(resolve => {finish = resolve;}), () => new Promise(resolve => {resolvePicker = resolve;}), manyDiagnostics);
  const pending = e.scanButton.handlers.click();
  assert.equal(e.nextPageButton.disabled, true); assert.equal(e.detailsButton.disabled, true);
  finish(observation()); await pending;
  const exporting = e.jsonButton.handlers.click();
  e.nextPageButton.handlers.click(); e.detailsButton.handlers.click();
  assert.match(e.pageStatus.textContent, /Page 1/); assert.equal(e.output.hidden, true);
  resolvePicker(null); await exporting; assert.equal(e.nextPageButton.disabled, false);
  const failed = ui(async () => {throw Error('host unavailable');});
  await failed.scanButton.handlers.click(); assert.equal(failed.output.value, '');
  failed.detailsButton.handlers.click(); assert.match(failed.output.value, /host unavailable/);
  assert.equal(failed.jsonButton.disabled, true); assert.equal(failed.nextPageButton.disabled, true);
});
test('JSON export captures annotations and locks scan while picker is open', async () => {
  let resolvePicker, written;
  const e = ui(async () => observation(), () => new Promise(resolve => { resolvePicker = resolve; }));
  await e.scanButton.handlers.click();
  const exporting = e.jsonButton.handlers.click();
  assert.equal(e.scanButton.disabled, true); assert.equal(e.htmlButton.disabled, true);
  resolvePicker({ write: async (value, options) => { written = { value, options }; } });
  await exporting;
  assert.equal(JSON.parse(written.value).reportVersion, '1.0.0');
  assert.equal(written.options.format, 'utf8'); assert.equal(e.scanButton.disabled, false);
  assert.match(e.exportStatus.textContent, /Saved JSON/);
});
test('picker cancellation and write failure recover export controls', async () => {
  for (const picker of [async () => null, async () => ({ write: async () => { throw Error('disk full'); } })]) {
    const e = ui(async () => observation(), picker);
    await e.scanButton.handlers.click(); await e.htmlButton.handlers.click();
    assert.equal(e.scanButton.disabled, false); assert.equal(e.htmlButton.disabled, false);
    assert.match(e.exportStatus.textContent, /cancelled|disk full/);
  }
});
test('staging whitelist is reproducible and excludes test projects and reports', () => {
  const output = fs.mkdtempSync(path.join(os.tmpdir(), 'audio-preflight-test-'));
  try {
    const first = prepareBeta(output), second = prepareBeta(output);
    assert.equal(first.identity, second.identity); assert.equal(first.files.length, 7);
    assert.ok(files.every(file => fs.existsSync(path.join(first.stagingDirectory, file))));
    assert.ok(!fs.existsSync(path.join(first.stagingDirectory, 'reports')));
    fs.writeFileSync(path.join(first.stagingDirectory, 'unexpected.txt'), 'contamination');
    assert.throws(() => prepareBeta(output), /Unexpected staging file/);
  } finally { fs.rmSync(output, { recursive: true, force: true }); }
});
