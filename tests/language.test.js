'use strict';
// Language (English / Japanese): message coverage, finding text, report helpers, the readable report and the panel switch.
// Test doubles, NOT host evidence. The Japanese wording has not been reviewed by a native speaker.
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const reporting = require('../src/report');
const { diagnose } = require('../src/diagnostics');
const { MESSAGES, t, localizeFinding, locationText, hostText, coverageText, scopeLine, showTarget, summaryCards, toHTML, createReport, completionText, severityLabel, reviewLabel } = reporting;

const placeholders = text => [...String(text).matchAll(/\{(\w+)\}/g)].map(m => m[1]).sort();
const tk = (seconds) => ({ seconds, ticks: String(seconds * 254016000000) });
const observation = () => ({
  completion: 'completed', generatedAt: '2026-11-02T00:00:00.000Z', durationMs: 7, project: { name: 'P' }, unknowns: ['Routing unknown'], sequenceInventoryComplete: true,
  settings: undefined,
  sequences: [
    { name: 'Seq', guid: 'g1', occurrenceIndex: 0, settings: { audioChannelType: 1, audioChannelCount: 2 }, audioTracks: [
      { name: 'Audio 1', index: 0, muted: true, clips: [{ name: 'dialog.wav', occurrenceIndex: 0, disabled: false, startTime: tk(0), endTime: tk(10) }] }] },
    { name: 'Seq B', guid: 'g2', occurrenceIndex: 1, settings: { audioChannelType: 0, audioChannelCount: 1 }, audioTracks: [
      { name: 'Audio 1', index: 0, muted: false, clips: [{ name: 'music.wav', occurrenceIndex: 0, disabled: true, startTime: tk(0), endTime: tk(5) }] },
      { name: 'Audio 2', index: 1, muted: true, clips: [{ name: 'fx.wav', occurrenceIndex: 0, disabled: false, startTime: tk(0), endTime: tk(5) }] }] }
  ]
});

test('Japanese and English have the same message keys and the same placeholders', () => {
  assert.deepEqual(Object.keys(MESSAGES.ja).sort(), Object.keys(MESSAGES.en).sort());
  for (const key of Object.keys(MESSAGES.en)) assert.deepEqual(placeholders(MESSAGES.ja[key]), placeholders(MESSAGES.en[key]), key);
});

test('t fills placeholders, keeps unknown ones, treats null as empty and falls back to English and then the key', () => {
  assert.equal(t('ja', 'confidence', { v: 'X' }), '確度：X');
  assert.equal(t('en', 'confidence', {}), 'Confidence: {v}');
  assert.equal(t('en', 'html_project', { name: null, at: 'now', ms: undefined }), 'Project:  | now | Duration:  ms');
  assert.equal(t('fr', 'btn_scan'), 'Scan active project');
  assert.equal(t('en', 'no_such_key'), 'no_such_key');
});

test('every static text id used by the panel exists in index.html and has a message', () => {
  const html = fs.readFileSync(path.join(__dirname, '../index.html'), 'utf8');
  const js = fs.readFileSync(path.join(__dirname, '../index.js'), 'utf8');
  const block = /const STATIC_TEXT = \[([\s\S]*?)\];/.exec(js)[1];
  const pairs = [...block.matchAll(/\['(\w+)', '(\w+)'\]/g)].map(m => [m[1], m[2]]);
  assert.ok(pairs.length >= 20);
  for (const [id, key] of pairs) {
    assert.ok(html.includes(`id="${id}"`), `index.html has no id ${id}`);
    assert.ok(MESSAGES.en[key] !== undefined && MESSAGES.ja[key] !== undefined, `message ${key}`);
  }
  assert.ok(html.includes('id="langButton"'));
});

test('every rule the diagnostics can produce is translated to Japanese; English findings are returned unchanged', () => {
  const report = diagnose(Object.assign(observation(), { completion: 'cancelled', sequenceInventoryComplete: false, errors: ['getSequences failed'] }));
  const all = [...report.risk, ...report.information, ...report.unknown];
  const ids = new Set(all.map(f => f.ruleId));
  for (const expected of ['ARID-002', 'ARID-003', 'ARID-I01', 'ARID-U01', 'ARID-U-READ', 'ARID-U-CANCELLED']) assert.ok(ids.has(expected), expected);
  const all001 = diagnose({ sequences: [{ name: 'S', occurrenceIndex: 0, audioTracks: [{ name: 'A1', index: 0, muted: true, clips: [{ name: 'c' }] }] }] });
  assert.equal(all001.risk[0].ruleId, 'ARID-001');
  all.push(all001.risk[0]);
  for (const finding of all) {
    assert.deepEqual(localizeFinding('en', finding), finding);
    const ja = localizeFinding('ja', finding);
    assert.notEqual(ja.why, finding.why, `${finding.ruleId} why`);
    assert.notEqual(ja.remediation, finding.remediation, `${finding.ruleId} remediation`);
    assert.ok(/[぀-ヿ一-鿿]/.test(ja.why + ja.remediation));
    for (const field of ['observed', 'why', 'remediation']) assert.ok(!/\{\w+\}/.test(ja[field]), `${finding.ruleId} ${field} has a placeholder left`);
    assert.equal(ja.ruleId, finding.ruleId);
    assert.deepEqual(ja.location, finding.location);
  }
  const i01 = localizeFinding('ja', report.information[0]);
  assert.match(i01.observed, /チャンネルタイプ=Stereo、チャンネル数=2/);
  assert.match(localizeFinding('ja', all001.risk[0]).observed, /1 本すべて/);
  // Observed text that carries host data stays as the host reported it.
  const read = report.unknown.find(f => f.ruleId === 'ARID-U-READ');
  assert.equal(localizeFinding('ja', read).observed, read.observed);
  assert.equal(localizeFinding('ja', null), null);
  assert.equal(localizeFinding('ja', { ruleId: 'ARID-X', observed: 'o', why: 'w', remediation: 'r' }).why, 'w');
});

test('report helpers read in Japanese and keep English as before', () => {
  const location = { sequence: 'Seq', sequenceOccurrenceIndex: 1, trackIndex: 0, clipOccurrenceIndex: 2, componentIndex: 0, component: 'Volume', parameterIndex: 1, startTime: { seconds: 1.5, ticks: '9' } };
  assert.equal(locationText(location), 'Seq / sequence #2 / Track 1 / clip #3 / component #1 (Volume) / parameter #2 / 1.500 seconds from sequence start / ticks 9');
  assert.equal(locationText(location, 'ja'), 'Seq / シーケンス #2 / トラック 1 / クリップ #3 / コンポーネント #1（Volume） / パラメーター #2 / シーケンス開始から 1.500 秒 / ticks 9');
  assert.equal(locationText({}, 'ja'), 'プロジェクト');
  assert.equal(hostText({ name: 'Premiere Pro', version: '26', uxpVersion: '9', pluginVersion: '0.3', uiLocale: 'ja_JP' }, 'ja'), 'Premiere Pro 26 · UXP 9 · プラグイン 0.3 · ロケール ja_JP');
  assert.equal(hostText(undefined, 'ja'), '不明なホスト （バージョン不明） · UXP 不明 · プラグイン 不明 · ロケール 不明');
  assert.match(coverageText({ state: 'PARTIAL', sequences: { known: 1, expected: 2, status: 'PARTIAL' } }, 'ja'), /^観測カバレッジ PARTIAL · シーケンス：1\/2 件確認済み（PARTIAL） · トラック：0\/\? 件確認済み（UNKNOWN）/);
  assert.equal(coverageText(null, 'ja'), 'カバレッジ不明：インベントリの証拠がありません。');
  const report = createReport(observation(), diagnose(observation()));
  assert.equal(scopeLine(report), '2 sequences · 3 audio tracks · 3 clips');
  assert.equal(scopeLine(report, 'ja'), '2 シーケンス · 3 オーディオトラック · 3 クリップ');
  assert.deepEqual(summaryCards(report, 'ja').map(c => c.label), ['要確認', '不明', '情報']);
  assert.equal(showTarget({ sequence: 'Seq', sequenceOccurrenceIndex: 0, clip: 'a.wav', track: 'Audio 1', startTime: { seconds: 1 } }, 'ja').label, 'クリップを表示：a.wav（Audio 1）');
  assert.equal(showTarget({ sequence: 'Seq', sequenceOccurrenceIndex: 0 }, 'ja').label, 'シーケンスを表示：Seq');
  assert.equal(completionText('ja', 'cancelled'), 'スキャンをキャンセルしました。未確認の状態は検査されていません。');
  assert.equal(completionText('en', 'nonsense'), 'Unverified scan.');
  assert.equal(severityLabel('ja', 'Review'), '要確認');
  assert.equal(severityLabel('ja', 'Other'), 'Other');
  assert.equal(reviewLabel('ja', 'intentional'), '意図的');
});

test('the readable report is Japanese on request, escapes names, and leaves the raw evidence to the JSON export', () => {
  const obs = observation();
  obs.project = { name: '<b>案件</b>' };
  const report = createReport(obs, diagnose(obs));
  const html = toHTML(report, 'ja');
  assert.match(html, /<html lang="ja">/);
  assert.ok(html.includes('読み取り専用の確認です'));
  assert.ok(html.includes('&lt;b&gt;案件&lt;/b&gt;'));
  assert.ok(!html.includes('<b>案件</b>'));
  assert.ok(html.includes('診断ステータス：'));
  assert.ok(!html.includes('<pre>') && !html.includes('&quot;reportVersion&quot;'), 'no raw JSON in the readable report');
  assert.ok(html.includes('生データは含まれていません') && html.includes('「JSON を出力」'));
  assert.ok(toHTML(report).includes('Use &quot;Export JSON&quot; for the full evidence.'));
  assert.match(toHTML(report), /<html lang="en">/);
  assert.ok(toHTML(report).includes('Diagnostic status: '));
});

// ---- the panel ----
function element(tag = 'div') {
  return { tag, dataset: {}, style: {}, children: [], handlers: {}, hidden: false, valueText: '', attrs: {}, get textContent() { return this.valueText; }, set textContent(value) { this.valueText = value; this.children = []; }, appendChild(child) { this.children.push(child); }, addEventListener(event, handler) { this.handlers[event] = handler; }, setAttribute(name, value) { this.attrs[name] = value; } };
}
function panel({ stored = null, locale = null, scan } = {}) {
  const html = fs.readFileSync(path.join(__dirname, '../index.html'), 'utf8');
  const ids = [...html.matchAll(/id="(\w+)"/g)].map(m => m[1]);
  const elements = Object.fromEntries(ids.map(id => [id, element()]));
  elements.output.hidden = true; elements.mapSection.hidden = true;
  const saved = [];
  let setup;
  const sandbox = {
    document: { getElementById: id => elements[id], createElement: element, documentElement: { lang: 'en' } },
    require: name => name === 'uxp' ? { entrypoints: { setup: value => { setup = value; } }, storage: { localFileSystem: { getFileForSaving: async () => null }, formats: { utf8: 'utf8' } }, host: locale ? { uiLocale: locale } : undefined }
      : name.includes('premiereAdapter') ? { scanActiveProject: scan || (async () => observation()), showLocation: async () => ({ opened: true, positioned: true }) }
      : name.includes('report') ? reporting : { diagnose }
  };
  if (stored !== undefined) sandbox.localStorage = { getItem: () => stored, setItem: (k, v) => saved.push([k, v]) };
  vm.runInNewContext(fs.readFileSync(path.join(__dirname, '../index.js'), 'utf8'), sandbox);
  const p = setup.panels['audio-routing-integrity-probe']; p.create(); p.show();
  return { e: elements, saved, root: sandbox.document.documentElement };
}

test('the page lang attribute follows the panel language, at start and after a switch', () => {
  const ja = panel({ stored: 'ja' });
  assert.equal(ja.root.lang, 'ja');
  ja.e.langButton.handlers.click();
  assert.equal(ja.root.lang, 'en');
  ja.e.langButton.handlers.click();
  assert.equal(ja.root.lang, 'ja');
  assert.equal(panel({ stored: 'en' }).root.lang, 'en');
});

test('panel language: a saved choice wins, then a Japanese host locale, else English', () => {
  assert.equal(panel({ stored: 'ja' }).e.scanButton.textContent, 'アクティブなプロジェクトをスキャン');
  assert.equal(panel({ stored: 'en', locale: 'ja_JP' }).e.scanButton.textContent, 'Scan active project');
  assert.equal(panel({ stored: null, locale: 'ja_JP' }).e.scanButton.textContent, 'アクティブなプロジェクトをスキャン');
  assert.equal(panel({ stored: null, locale: 'en_US' }).e.scanButton.textContent, 'Scan active project');
  assert.equal(panel({ stored: 'xx' }).e.scanButton.textContent, 'Scan active project');
  assert.equal(panel({ stored: undefined }).e.scanButton.textContent, 'Scan active project'); // no storage at all
});

test('panel in Japanese shows Japanese text after a scan, and the switch redraws everything and saves the choice', async () => {
  const { e, saved } = panel({ stored: 'ja' });
  assert.equal(e.status.textContent, '準備完了。プロジェクトを開いてください。');
  assert.equal(e.langButton.textContent, 'English');
  assert.equal(e.panelTitle.textContent, 'Audio Preflight（オーディオ事前チェック）');
  assert.equal(e.output.attrs['aria-label'], 'スキャンの生データ');
  await e.scanButton.handlers.click();
  assert.match(e.status.textContent, /^範囲を限定したスキャンが完了しました。.* 診断ステータス：\w+。$/);
  assert.deepEqual(e.cards.children.map(c => c.children[1].textContent), ['要確認', '不明', '情報']);
  assert.equal(e.scopeLine.textContent, '2 シーケンス · 3 オーディオトラック · 3 クリップ');
  assert.match(e.summary.textContent, /^P · 要確認 \d+ 件 · 不明 \d+ 件 · 7 ms$/);
  const strongs = e.findings.children.filter(n => n.className && n.className.startsWith('finding ')).map(c => c.children[0].textContent);
  assert.ok(strongs.some(s => s.startsWith('要確認 · ARID-')));
  const chip = e.findings.children.flatMap(c => c.children || []).find(n => n.className === 'showrow');
  assert.ok(chip && /を表示：/.test(chip.children[0].textContent));
  assert.ok(e.trackMap.children[0].children[0].textContent.includes('トラック'));

  e.langButton.handlers.click();
  assert.deepEqual(saved, [['arid.lang', 'en']]);
  assert.equal(e.langButton.textContent, '日本語');
  assert.equal(e.scanButton.textContent, 'Scan active project');
  assert.match(e.status.textContent, /^Bounded scan completed\. .* Diagnostic status: \w+\.$/);
  assert.deepEqual(e.cards.children.map(c => c.children[1].textContent), ['To review', 'Unknown', 'Information']);
  assert.equal(e.scopeLine.textContent, '2 sequences · 3 audio tracks · 3 clips');
  assert.ok(e.findings.children.some(c => c.children && c.children[0] && /^Review · ARID-/.test(c.children[0].textContent)));
  e.langButton.handlers.click();
  assert.deepEqual(saved[1], ['arid.lang', 'ja']);
  assert.equal(e.status.textContent.startsWith('範囲を限定した'), true);
});

test('failed scan, cancel request and export messages follow the language', async () => {
  const { e } = panel({ stored: 'ja', scan: async () => { throw Error('boom'); } });
  await e.scanButton.handlers.click();
  assert.equal(e.status.textContent, 'スキャンに失敗しました。もう一度お試しください。ホストの読み取りができない可能性があります。');
  e.langButton.handlers.click();
  assert.equal(e.status.textContent, 'Scan failed. Try again; host reads may be unavailable.');
  const second = panel({ stored: 'ja' });
  await second.e.scanButton.handlers.click();
  await second.e.jsonButton.handlers.click();
  assert.equal(second.e.exportStatus.textContent, '出力をキャンセルしました。');
  second.e.langButton.handlers.click();
  assert.equal(second.e.exportStatus.textContent, 'Export cancelled.');
});

test('the readable report stays small for a large project (raw evidence is not embedded)', () => {
  const big = observation();
  delete big.completion; // the older observation shape, so the fixture does not add thousands of unrelated read-failure findings
  big.sequences[0].audioTracks[0].clips = Array.from({ length: 1500 }, (_, i) => ({ name: `clip${i}.wav`, occurrenceIndex: i, disabled: i === 7, startTime: tk(i), endTime: tk(i + 1), componentChain: { components: Array.from({ length: 4 }, () => ({ displayName: 'Volume', params: [{ displayName: 'Level', startValue: 0, isTimeVarying: false }] })) } }));
  const report = createReport(big, diagnose(big));
  assert.ok(toHTML(report).length < 200000, `html is ${toHTML(report).length} characters`);
  assert.ok(JSON.stringify(report).length > 500000, 'the JSON evidence is still large, so the size test is meaningful');
});

test('grouped timeline spans carry no text in the bar; their count is in the tooltip and follows the panel language', async () => {
  const dense = observation();
  dense.sequences[0].audioTracks[0].clips = Array.from({ length: 400 }, (_, i) => ({ name: `c${i}.wav`, occurrenceIndex: i, disabled: false, startTime: tk(i), endTime: tk(i + 1) }));
  const labels = e => { const out = []; const walk = node => { if (node.className && String(node.className).startsWith('block')) out.push([node.textContent, node.title]); (node.children || []).forEach(walk); }; walk(e.trackMap); return out; };
  const ja = panel({ stored: 'ja', scan: async () => dense }).e;
  await ja.scanButton.handlers.click();
  assert.equal(labels(ja)[0][0], '', 'a grouped span has no text in the bar');
  assert.ok(labels(ja)[0][1].startsWith('400 クリップ · 400 件のクリップをまとめて表示'));
  ja.langButton.handlers.click();
  assert.equal(labels(ja)[0][0], '');
  assert.ok(labels(ja)[0][1].startsWith('400 clips · 400 clips grouped'));
});
