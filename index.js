const uxp = require('uxp');
const { entrypoints, storage } = uxp;
const { scanActiveProject, showLocation } = require('./src/premiereAdapter');
const { diagnose } = require('./src/diagnostics');
const { createReport, groups, locationText, hostText, coverageText, annotate, toHTML, resultTone, shortName, blockLabel, summaryCards, scopeLine, showTarget, trackMap, t, plural, completionText, severityLabel, reviewLabel, localizeFinding } = require('./src/report');
// Readability: the status line becomes a coloured badge once a scan finishes (display only).
function setTone(tone) { const node = el('status'); if (node) node.className = tone ? `badge tone-${tone}` : ''; }
let inFlight = false;
let exporting = false;
let cancelRequested = false;
let currentReport = null;
const PAGE_SIZE = 25;
let findingRows = [];
let findingPage = 0;
let rawDirty = true;
let scanError = '';
const el = id => document.getElementById(id);
function text(id, value) { if (el(id)) el(id).textContent = value; }

// ---- Language (display only; the scan, the diagnostics and the JSON evidence stay English) ----
// The saved choice wins; otherwise Japanese when the host UI locale is Japanese, else English.
const LANG_KEY = 'arid.lang';
function initialLang() {
  try {
    const saved = typeof localStorage !== 'undefined' ? localStorage.getItem(LANG_KEY) : null;
    if (saved === 'ja' || saved === 'en') return saved;
  } catch (ignored) { /* storage can be unavailable */ }
  try {
    const locale = uxp && uxp.host && (uxp.host.uiLocale || uxp.host.locale);
    if (typeof locale === 'string' && /^ja/i.test(locale)) return 'ja';
  } catch (ignored) { /* host info can be unavailable */ }
  return 'en';
}
let lang = initialLang();
const L = (key, params) => t(lang, key, params);
// Status lines are stored as functions so a language switch can redraw them without re-scanning.
let statusFn = () => L('status_ready');
let exportFn = () => '';
let previewFn = () => '';
function setStatus(fn) { statusFn = fn; text('status', fn()); }
function setExportStatus(fn) { exportFn = fn; text('exportStatus', fn()); }
function setPreview(fn) { previewFn = fn; text('previewStatus', fn()); }
const STATIC_TEXT = [['panelTitle', 'title'], ['panelSubtitle', 'subtitle'], ['panelIntro', 'intro'], ['scanButton', 'btn_scan'], ['cancelButton', 'btn_cancel'],
  ['exportTitle', 'sec_export'], ['jsonButton', 'btn_json'], ['htmlButton', 'btn_html'], ['mapTitle', 'sec_timeline'], ['mapNote', 'note_timeline'],
  ['legendClip', 'legend_clip'], ['legendDisabled', 'legend_disabled'], ['legendReview', 'legend_review'], ['legendMuted', 'legend_muted'],
  ['findingsTitle', 'sec_findings'], ['previousPageButton', 'btn_prev'], ['nextPageButton', 'btn_next'], ['evidenceTitle', 'sec_evidence'],
  ['detailsButton', 'btn_details'], ['footNote', 'foot_note'], ['langButton', 'btn_lang']];
function applyStatic() {
  for (const [id, key] of STATIC_TEXT) text(id, L(key));
  const output = el('output');
  if (output && typeof output.setAttribute === 'function') output.setAttribute('aria-label', L('aria_output'));
}
function buildRows() {
  findingRows = currentReport ? groups(currentReport, lang).flatMap((group, groupIndex) => group.findings.map(finding => ({ groupIndex, label: group.label, finding }))) : [];
}
function toggleLanguage() {
  lang = lang === 'ja' ? 'en' : 'ja';
  try { if (typeof localStorage !== 'undefined') localStorage.setItem(LANG_KEY, lang); } catch (ignored) { /* storage can be unavailable */ }
  applyStatic();
  text('status', statusFn()); text('exportStatus', exportFn()); text('previewStatus', previewFn());
  buildRows();
  if (findingPage * PAGE_SIZE >= findingRows.length) findingPage = 0;
  render();
}

function controls() {
  for (const id of ['scanButton', 'jsonButton', 'htmlButton']) {
    if (el(id)) el(id).disabled = inFlight || exporting || (id !== 'scanButton' && !currentReport);
  }
  if (el('cancelButton')) el('cancelButton').disabled = !inFlight || cancelRequested;
  if (el('previousPageButton')) el('previousPageButton').disabled = inFlight || exporting || findingPage === 0;
  if (el('nextPageButton')) el('nextPageButton').disabled = inFlight || exporting || (findingPage + 1) * PAGE_SIZE >= findingRows.length;
  if (el('detailsButton')) el('detailsButton').disabled = inFlight || exporting || (!currentReport && !scanError);
}
function append(parent, tag, value, className) {
  const node = document.createElement(tag);
  if (value != null) node.textContent = value;
  if (className) node.className = className;
  parent.appendChild(node);
  return node;
}
function renderRawEvidence() {
  const output = el('output');
  if (!output) return;
  if (output.hidden) { output.value = ''; rawDirty = true; return; }
  if (rawDirty) {
    output.value = currentReport ? JSON.stringify(currentReport, null, 2) : scanError;
    rawDirty = false;
  }
}
function renderFindings() {
  const report = currentReport;
  const container = el('findings');
  if (!container) return;
  container.textContent = '';
  const start = findingPage * PAGE_SIZE;
  text('pageStatus', findingRows.length ? L('page_status', { a: start + 1, b: Math.min(start + PAGE_SIZE, findingRows.length), n: findingRows.length, p: findingPage + 1, pages: Math.ceil(findingRows.length / PAGE_SIZE) }) : L('page_none'));
  controls();
  if (!report) return;
  let previousGroup = -1;
  for (const row of findingRows.slice(start, start + PAGE_SIZE)) {
      const finding = localizeFinding(lang, row.finding);
      if (row.groupIndex !== previousGroup) { append(container, 'h3', row.label); previousGroup = row.groupIndex; }
      const card = append(container, 'div', null, `finding ${finding.category}`);
      if (card.style && SEVERITY_COLOR[finding.severity]) card.style.borderColor = SEVERITY_COLOR[finding.severity];
      append(card, 'strong', `${severityLabel(lang, finding.severity)} · ${finding.ruleId}`, `sevtext sev-${finding.severity}`);
      append(card, 'p', locationText(finding.location, lang), 'location');
      append(card, 'p', finding.observed);
      append(card, 'p', finding.why);
      append(card, 'p', finding.remediation);
      append(card, 'small', L('confidence', { v: finding.confidence }));
      const target = showTarget(finding.location, lang);
      if (target) {
        const row = append(card, 'div', null, 'showrow');
        // A wrapping chip, not a fixed-height button, so long clip names never run past the card in a narrow dock.
        const chip = append(row, 'div', target.label, 'showchip');
        chip.title = locationText(finding.location, lang);
        chip.addEventListener('click', () => showAt(finding.location));
      }
      const label = append(card, 'label', L('review_state'));
      const select = append(label, 'select');
      for (const value of ['unreviewed', 'reviewed', 'intentional']) {
        const option = append(select, 'option', reviewLabel(lang, value)); option.value = value;
      }
      select.value = report.annotations[finding.key] || 'unreviewed';
      select.addEventListener('change', () => {
        if (inFlight || exporting || report !== currentReport) return;
        annotate(report, finding.key, select.value);
        rawDirty = true; renderRawEvidence();
      });
  }
}
const SEVERITY_COLOR = { Warning: '#ff9f5a', Review: '#ffc74d', Information: '#77aabb', Unknown: '#aaaaaa' };
function renderCards() {
  const box = el('cards');
  if (!box) return;
  box.textContent = '';
  if (!currentReport) { text('scopeLine', ''); return; }
  for (const item of summaryCards(currentReport, lang)) {
    const card = append(box, 'div', null, `card c-${item.key}`);
    append(card, 'div', String(item.count), 'num');
    append(card, 'div', item.label, 'lbl');
  }
  text('scopeLine', scopeLine(currentReport, lang));
}
function renderMap() {
  const box = el('trackMap');
  if (!box) return;
  box.textContent = '';
  const maps = currentReport ? trackMap(currentReport) : [];
  if (el('mapSection')) el('mapSection').hidden = !maps.some(map => map.lanes.length > 0);
  for (const map of maps) {
    if (!map.lanes.length) continue;
    const wrap = append(box, 'div', null, 'seq');
    const notes = [];
    if (map.incomplete) notes.push(L('map_incomplete'));
    if (map.grouped) notes.push(L('map_grouped', { n: map.grouped }));
    if (map.omitted) notes.push(L('map_omitted', { n: map.omitted }));
    if (map.unplaced) notes.push(L('map_unplaced', { n: map.unplaced }));
    if (map.emptyTracks) notes.push(L('map_empty', { n: map.emptyTracks }));
    append(wrap, 'div', `${shortName(map.name, 40)} · ${plural(lang, 'map_track', map.lanes.length)}${notes.length ? ` · ${notes.join(' · ')}` : ''}`, 'seqname');
    for (const lane of map.lanes) {
      const row = append(wrap, 'div', null, 'track');
      append(row, 'div', `A${lane.index + 1}`, 'tlabel');
      const laneNode = append(row, 'div', null, lane.muted ? 'lane muted' : 'lane');
      for (const block of lane.blocks) {
        const blockName = block.merged > 1 ? L('block_span', { n: block.merged }) : block.name;
        // A grouped span carries no text in the bar: a disabled or flagged clip is drawn on top of it and used to cover its first
        // characters in a narrow dock. The count is in the sequence note above the lanes and in the tooltip.
        const node = append(laneNode, 'div', block.merged > 1 ? '' : blockLabel(blockName, block.width), `block${block.disabled ? ' disabled' : ''}${block.flagged ? ' flagged' : ''}${lane.muted ? ' inmuted' : ''}`);
        if (node.style) { node.style.left = `${block.left}%`; node.style.width = `${block.width}%`; }
        node.title = `${blockName}${block.merged > 1 ? L('block_grouped', { n: block.merged }) : ''}${block.disabled ? L('block_disabled') : ''}${lane.muted ? L('block_muted') : ''}`;
        node.addEventListener('click', () => showAt(block.location));
      }
    }
  }
}
// View-only: opens the sequence and moves the playhead (see showLocation in the adapter). Never edits the project.
async function showAt(location) {
  if (inFlight || exporting || typeof showLocation !== 'function') return;
  try {
    const result = await showLocation(location);
    setPreview(() => result.positioned ? L('preview_moved', { name: shortName(location.clip, 28) }) : L(result.opened ? 'preview_opened' : 'preview_already', { name: shortName(location.sequence, 28) }));
  } catch (error) {
    setPreview(() => L('preview_failed', { msg: error.message || String(error) }));
  }
}
function render() {
  const report = currentReport;
  renderRawEvidence();
  text('summary', report ? L('summary', { project: report.observation.project ? report.observation.project.name : L('summary_no_project'), risk: report.diagnostics.risk.length, unknown: report.diagnostics.unknown.length, ms: report.observation.durationMs ?? '—' }) : '');
  text('hostIdentity', report ? hostText(report.observation.host, lang) : '');
  text('coverage', report ? coverageText(report.diagnostics.coverage, lang) : '');
  if (!report) setPreview(() => '');
  renderCards();
  renderMap();
  renderFindings();
}
async function runScan() {
  if (inFlight || exporting) return;
  inFlight = true; cancelRequested = false; currentReport = null;
  findingRows = []; findingPage = 0; scanError = ''; rawDirty = true;
  try {
    if (el('output')) el('output').hidden = true;
    controls(); render();
    setTone('');
    setStatus(() => L('status_scanning'));
    setExportStatus(() => '');
    const observation = await scanActiveProject({
      isCancelled: () => cancelRequested,
      onProgress: progress => text('progress', `${progress.phase}${progress.sequence ? ` · ${progress.sequence}` : ''}${progress.track ? ` · ${progress.track}` : ''}${progress.total != null ? ` · ${progress.item + 1}/${progress.total}` : ''}`)
    });
    currentReport = createReport(observation, diagnose(observation));
    buildRows();
    render();
    const completion = observation.completion;
    setStatus(() => L('status_done', { completion: completionText(lang, completion), status: currentReport.diagnostics.status || 'UNKNOWN' }));
    setTone(resultTone(currentReport, false));
  } catch (error) {
    setStatus(() => L('status_failed'));
    setTone('BAD');
    scanError = error.stack || error.message || String(error); rawDirty = true; renderRawEvidence();
  } finally {
    inFlight = false; text('progress', ''); controls();
  }
}
async function exportReport(format) {
  if (!currentReport || inFlight || exporting) return;
  const snapshot = JSON.parse(JSON.stringify(currentReport));
  exporting = true;
  try {
    controls();
    const file = await storage.localFileSystem.getFileForSaving(`audio-preflight-${snapshot.observation.generatedAt.replace(/[:.]/g, '-')}.${format}`, { types: [format] });
    if (!file) { setExportStatus(() => L('export_cancelled')); return; }
    await file.write(format === 'html' ? toHTML(snapshot, lang) : JSON.stringify(snapshot, null, 2), { format: storage.formats.utf8 });
    setExportStatus(() => L('export_saved', { fmt: format.toUpperCase() }));
  } catch (error) {
    setExportStatus(() => L('export_failed', { msg: error.message || String(error) }));
  } finally { exporting = false; controls(); }
}
function bind() {
  const handlers = {
    scanButton: runScan,
    cancelButton: () => { cancelRequested = true; setStatus(() => L('status_cancel')); controls(); },
    jsonButton: () => exportReport('json'),
    htmlButton: () => exportReport('html'),
    detailsButton: () => { if (inFlight || exporting) return; if (el('output')) { el('output').hidden = !el('output').hidden; renderRawEvidence(); } },
    previousPageButton: () => { if (!inFlight && !exporting && findingPage > 0) { findingPage--; renderFindings(); } },
    nextPageButton: () => { if (!inFlight && !exporting && (findingPage + 1) * PAGE_SIZE < findingRows.length) { findingPage++; renderFindings(); } },
    langButton: toggleLanguage
  };
  for (const [id, handler] of Object.entries(handlers)) {
    const button = el(id);
    if (button && !button.dataset.bound) { button.dataset.bound = 'true'; button.addEventListener('click', handler); }
  }
  applyStatic();
  text('status', statusFn());
  controls();
}
entrypoints.setup({ panels: { 'audio-routing-integrity-probe': { create() { bind(); }, show() { bind(); } } } });
