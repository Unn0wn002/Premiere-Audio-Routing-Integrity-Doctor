const COMPLETION = {
  completed: 'Bounded scan completed. Routing and audio output require manual verification.',
  partial: 'Scan partial. Failed reads require manual verification.',
  failed: 'Scan failed. Review the evidence and try again.',
  cancelled: 'Scan cancelled. Unvisited state has not been checked.'
};
// ---- Language (display only) ----
// Texts for the panel and the readable report in English and Japanese. The scan, the diagnostics and the JSON evidence are
// never translated: they stay English so reports remain comparable. Names, paths and host error text are shown as observed.
// The Japanese wording has NOT been reviewed by a native speaker.
const LANGS = ['en', 'ja'];
const MESSAGES = {
  en: {
    project: 'Project', unknown: 'Unknown',
    loc_sequence_n: 'sequence #{n}', loc_track_n: 'Track {n}', loc_clip_n: 'clip #{n}', loc_component_n: 'component #{n}', loc_component_named: 'component #{n} ({name})',
    loc_parameter_n: 'parameter #{n}', loc_parameter_named: 'parameter #{n} ({name})', loc_seconds: '{s} seconds from sequence start', loc_ticks: 'ticks {t}',
    host_unknown: 'Unknown host', host_version_unknown: '(version Unknown)', host_line: '{name} {version} · UXP {uxp} · plugin {plugin} · locale {locale}',
    cov_none: 'Coverage UNKNOWN: no inventory proof available.',
    cov_sequences: 'sequences', cov_tracks: 'tracks', cov_clips: 'clips', cov_components: 'components',
    cov_scope: '{name}: {known}/{expected} known ({status})',
    cov_line: 'Observation coverage {state} · {scopes}. Mapping, output buses and playback/export correctness: UNKNOWN.',
    completion_completed: 'Bounded scan completed. Routing and audio output require manual verification.',
    completion_partial: 'Scan partial. Failed reads require manual verification.',
    completion_failed: 'Scan failed. Review the evidence and try again.',
    completion_cancelled: 'Scan cancelled. Unvisited state has not been checked.',
    completion_unverified: 'Unverified scan.',
    card_risk: 'To review', card_unknown: 'Unknown', card_information: 'Information',
    scope_line: '{sequences} · {tracks} · {clips}',
    scope_sequence_one: '{n} sequence', scope_sequence_many: '{n} sequences', scope_track_one: '{n} audio track', scope_track_many: '{n} audio tracks', scope_clip_one: '{n} clip', scope_clip_many: '{n} clips',
    show_clip: 'Show clip: {name}', show_clip_track: 'Show clip: {name} ({track})', show_sequence: 'Show sequence: {name}',
    sev_Warning: 'Warning', sev_Review: 'Review', sev_Information: 'Information', sev_Unknown: 'Unknown',
    confidence: 'Confidence: {v}', review_state: 'Review state ', review_unreviewed: 'Unreviewed', review_reviewed: 'Reviewed', review_intentional: 'Intentional',
    title: 'Audio Preflight', subtitle: 'Read-only audio review · Private beta',
    intro: 'Review muted tracks, disabled clips and sequence audio settings. Routing and audio output need manual verification.',
    btn_scan: 'Scan active project', btn_cancel: 'Cancel', btn_json: 'Export JSON', btn_html: 'Readable report', btn_prev: 'Previous', btn_next: 'Next', btn_details: 'Show / hide raw evidence',
    btn_lang: '日本語',
    sec_export: 'Export report', sec_timeline: 'Audio timeline', sec_findings: 'Findings', sec_evidence: 'Evidence & environment',
    note_timeline: 'Click a clip to open its sequence and move the playhead to it (view only; nothing is edited).',
    legend_clip: 'Clip', legend_disabled: 'Disabled', legend_review: 'To review', legend_muted: 'On a muted track',
    foot_note: 'Review tags reset each scan. Reports include local names and paths; review before sharing.',
    aria_output: 'Raw scan evidence',
    status_ready: 'Ready. Open a project to begin.',
    status_scanning: 'Scanning read-only observable state. Avoid editing or switching projects during the scan.',
    status_cancel: 'Cancellation requested. Waiting for the current inventory item to finish.',
    status_failed: 'Scan failed. Try again; host reads may be unavailable.',
    status_done: '{completion} Diagnostic status: {status}.',
    summary: '{project} · {risk} review findings · {unknown} unknowns · {ms} ms', summary_no_project: 'No active project',
    page_status: 'Findings {a}–{b} of {n} · Page {p} of {pages}', page_none: 'No findings to display.',
    map_incomplete: 'scan incomplete: only the observed clips are drawn', map_grouped: '{n} clips grouped into spans', map_omitted: '{n} flagged clips not drawn',
    map_unplaced: '{n} clips without time data', map_empty: '{n} empty tracks hidden', map_track_one: '{n} track', map_track_many: '{n} tracks',
    block_span: '{n} clips', block_grouped: ' · {n} clips grouped', block_disabled: ' · disabled', block_muted: ' · track muted',
    preview_moved: 'Playhead moved to "{name}".', preview_opened: 'Opened: sequence "{name}".', preview_already: 'Already open: sequence "{name}".', preview_failed: 'Could not show it: {msg}',
    export_cancelled: 'Export cancelled.', export_saved: 'Saved {fmt} report. Review project names and paths before sharing.', export_failed: 'Export failed: {msg}',
    html_title: 'Audio Preflight report', html_unverified: 'Unverified scan', html_project: 'Project: {name} | {at} | Duration: {ms} ms',
    html_note: 'Read-only review. Intent is unknown. No routing or playback/export certification. Reports may contain project paths and names; review before sharing.',
    html_confidence: 'Confidence: {c} | Review: {r}', html_raw: 'Raw evidence', html_raw_note: 'The raw evidence is not included in this readable report, to keep it small. Use "Export JSON" for the full evidence.'
  },
  ja: {
    project: 'プロジェクト', unknown: '不明',
    loc_sequence_n: 'シーケンス #{n}', loc_track_n: 'トラック {n}', loc_clip_n: 'クリップ #{n}', loc_component_n: 'コンポーネント #{n}', loc_component_named: 'コンポーネント #{n}（{name}）',
    loc_parameter_n: 'パラメーター #{n}', loc_parameter_named: 'パラメーター #{n}（{name}）', loc_seconds: 'シーケンス開始から {s} 秒', loc_ticks: 'ticks {t}',
    host_unknown: '不明なホスト', host_version_unknown: '（バージョン不明）', host_line: '{name} {version} · UXP {uxp} · プラグイン {plugin} · ロケール {locale}',
    cov_none: 'カバレッジ不明：インベントリの証拠がありません。',
    cov_sequences: 'シーケンス', cov_tracks: 'トラック', cov_clips: 'クリップ', cov_components: 'コンポーネント',
    cov_scope: '{name}：{known}/{expected} 件確認済み（{status}）',
    cov_line: '観測カバレッジ {state} · {scopes}。マッピング、出力バス、再生／書き出しの正しさ：不明。',
    completion_completed: '範囲を限定したスキャンが完了しました。ルーティングとオーディオ出力は手動で確認してください。',
    completion_partial: 'スキャンは一部のみです。読み取りに失敗した部分は手動で確認してください。',
    completion_failed: 'スキャンに失敗しました。証拠を確認して、もう一度お試しください。',
    completion_cancelled: 'スキャンをキャンセルしました。未確認の状態は検査されていません。',
    completion_unverified: '未検証のスキャンです。',
    card_risk: '要確認', card_unknown: '不明', card_information: '情報',
    scope_line: '{sequences} · {tracks} · {clips}',
    scope_sequence_one: '{n} シーケンス', scope_sequence_many: '{n} シーケンス', scope_track_one: '{n} オーディオトラック', scope_track_many: '{n} オーディオトラック', scope_clip_one: '{n} クリップ', scope_clip_many: '{n} クリップ',
    show_clip: 'クリップを表示：{name}', show_clip_track: 'クリップを表示：{name}（{track}）', show_sequence: 'シーケンスを表示：{name}',
    sev_Warning: '警告', sev_Review: '要確認', sev_Information: '情報', sev_Unknown: '不明',
    confidence: '確度：{v}', review_state: 'レビュー状態 ', review_unreviewed: '未確認', review_reviewed: '確認済み', review_intentional: '意図的',
    title: 'Audio Preflight（オーディオ事前チェック）', subtitle: '読み取り専用のオーディオ確認 · 非公開ベータ',
    intro: 'ミュートされたトラック、無効なクリップ、シーケンスのオーディオ設定を確認します。ルーティングとオーディオ出力は手動での確認が必要です。',
    btn_scan: 'アクティブなプロジェクトをスキャン', btn_cancel: 'キャンセル', btn_json: 'JSON を出力', btn_html: '読みやすいレポート', btn_prev: '前へ', btn_next: '次へ', btn_details: '生データの表示／非表示',
    btn_lang: 'English',
    sec_export: 'レポート出力', sec_timeline: 'オーディオタイムライン', sec_findings: '検出結果', sec_evidence: '証拠と環境',
    note_timeline: 'クリップをクリックすると、そのシーケンスを開き、再生ヘッドをクリップへ移動します（表示のみ。何も編集しません）。',
    legend_clip: 'クリップ', legend_disabled: '無効', legend_review: '要確認', legend_muted: 'ミュートされたトラック上',
    foot_note: 'レビュー状態はスキャンごとにリセットされます。レポートにはローカルの名前とパスが含まれます。共有前に確認してください。',
    aria_output: 'スキャンの生データ',
    status_ready: '準備完了。プロジェクトを開いてください。',
    status_scanning: '読み取り専用でスキャン中です。スキャン中はプロジェクトの編集や切り替えを避けてください。',
    status_cancel: 'キャンセルを要求しました。現在の項目の処理が終わるまでお待ちください。',
    status_failed: 'スキャンに失敗しました。もう一度お試しください。ホストの読み取りができない可能性があります。',
    status_done: '{completion} 診断ステータス：{status}。',
    summary: '{project} · 要確認 {risk} 件 · 不明 {unknown} 件 · {ms} ms', summary_no_project: 'アクティブなプロジェクトなし',
    page_status: '検出結果 {a}–{b} / {n} 件 · {p} / {pages} ページ', page_none: '表示する検出結果はありません。',
    map_incomplete: 'スキャン未完了：観測できたクリップのみ表示', map_grouped: '{n} 件のクリップをまとめて表示', map_omitted: '{n} 件の要確認クリップは未表示',
    map_unplaced: '{n} 件のクリップは時間情報なし', map_empty: '{n} 本の空トラックを非表示', map_track_one: '{n} トラック', map_track_many: '{n} トラック',
    block_span: '{n} クリップ', block_grouped: ' · {n} 件のクリップをまとめて表示', block_disabled: ' · 無効', block_muted: ' · トラックがミュート',
    preview_moved: '再生ヘッドを「{name}」へ移動しました。', preview_opened: '開きました：シーケンス「{name}」。', preview_already: '既に開いています：シーケンス「{name}」。', preview_failed: '表示できませんでした：{msg}',
    export_cancelled: '出力をキャンセルしました。', export_saved: '{fmt} レポートを保存しました。共有前にプロジェクト名とパスを確認してください。', export_failed: '出力に失敗しました：{msg}',
    html_title: 'Audio Preflight レポート', html_unverified: '未検証のスキャン', html_project: 'プロジェクト：{name} | {at} | 所要時間：{ms} ms',
    html_note: '読み取り専用の確認です。意図は不明です。ルーティングや再生／書き出しの保証はしません。レポートにはプロジェクトのパスと名前が含まれる場合があります。共有前に確認してください。',
    html_confidence: '確度：{c} | レビュー：{r}', html_raw: '生データ', html_raw_note: '読みやすいレポートを小さく保つため、生データは含まれていません。完全な証拠が必要な場合は「JSON を出力」を使ってください。'
  }
};
const FINDING_TEXT = {
  ja: {
    'ARID-001': { observed: '空でないオーディオトラック {n} 本すべてが muted=true と報告されています。', why: 'トラックのミュートは直接観測でき、期待する音を消す可能性がありますが、制作上の意図は不明です。', remediation: '納品前にトラックのミュート状態を確認してください。自動でミュート解除しないでください。' },
    'ARID-002': { observed: 'オーディオトラックが muted=true と報告され、オーディオクリップを含んでいます。', why: '意図的な場合もあります。このトラックの音が必要な場合にのみ、納品上のリスクになります。', remediation: 'ミュートが意図的か確認してください。自動でミュート解除しないでください。' },
    'ARID-003': { observed: 'オーディオクリップのトラックアイテムが disabled=true と報告されています。', why: '無効なクリップはタイムラインの音に寄与しませんが、無効化は意図的な場合があります。', remediation: 'クリップの無効化が意図的か確認してください。自動で有効化しないでください。' },
    'ARID-I01': { observed: 'シーケンスのオーディオチャンネルタイプ={type}、チャンネル数={count}。', why: 'チャンネル構成は観測できます。このルールは記録するだけで、モノラル、ステレオ、5.1、マルチチャンネルをそれだけで不具合とは判定しません。', remediation: '納品要件と素材の想定に照らして確認してください。' },
    'ARID-U-READ': { why: 'この読み取りは利用できないか不完全です。独立して観測できた他の状態は引き続き利用できますが、この範囲は不明です。', remediation: 'この範囲を Premiere で手動確認し、もう一度スキャンしてください。' },
    'ARID-U-CANCELLED': { observed: 'スキャンをキャンセルしました。未確認の状態は検査されていません。', why: '収集済みの観測のみ利用できます。', remediation: 'プロジェクト全体を検査するには、新しいスキャンを実行してください。' },
    'ARID-U0': { why: '現在の公開 API による観測では、この状態を確認できません。', remediation: 'ホストテストで公開 API が実証されるまで、Premiere で手動確認してください。' }
  }
};
function t(lang, key, params) {
  const table = MESSAGES[lang] || MESSAGES.en;
  const template = table[key] !== undefined ? table[key] : MESSAGES.en[key];
  if (template === undefined) return key;
  return template.replace(/\{(\w+)\}/g, (match, name) => (params && Object.prototype.hasOwnProperty.call(params, name) ? (params[name] == null ? '' : String(params[name])) : match));
}
function plural(lang, kind, count) { return t(lang, `${kind}_${count === 1 ? 'one' : 'many'}`, { n: count }); }
function completionText(lang, completion) { return MESSAGES.en[`completion_${completion}`] !== undefined ? t(lang, `completion_${completion}`) : t(lang, 'completion_unverified'); }
function severityLabel(lang, severity) { return MESSAGES.en[`sev_${severity}`] !== undefined ? t(lang, `sev_${severity}`) : severity; }
function reviewLabel(lang, state) { return MESSAGES.en[`review_${state}`] !== undefined ? t(lang, `review_${state}`) : state; }
// The finding with its fixed texts in the chosen language. Observed text that carries host data (a read error, an unknown
// the adapter reported) is kept as observed; only the fixed explanation and remediation are translated. English is unchanged.
function localizeFinding(lang, finding) {
  if (lang === 'en' || !FINDING_TEXT[lang] || !finding) return finding;
  const table = FINDING_TEXT[lang];
  const id = String(finding.ruleId || '');
  const entry = table[id] || (/^ARID-U0\d/.test(id) ? table['ARID-U0'] : null);
  if (!entry) return finding;
  const out = { ...finding };
  if (entry.why) out.why = entry.why;
  if (entry.remediation) out.remediation = entry.remediation;
  if (entry.observed) {
    let params = null;
    if (id === 'ARID-001') { const m = /All (\d+) non-empty/.exec(finding.observed || ''); params = m ? { n: m[1] } : null; }
    else if (id === 'ARID-I01') { const m = /type=(.+), count=(.+)\.$/.exec(finding.observed || ''); params = m ? { type: m[1], count: m[2] } : null; }
    else params = {};
    if (params) out.observed = entry.observed.replace(/\{(\w+)\}/g, (match, name) => (params[name] !== undefined ? params[name] : match));
  }
  return out;
}
function findings(report) {
  return ['risk', 'information', 'unknown'].flatMap(category =>
    (report.diagnostics[category] || []).map((finding, index) => ({ ...finding, category, key: `${category}:${index}` })));
}
function locationText(location = {}, lang = 'en') {
  const parts = [location.sequence || location.project || location.scope || t(lang, 'project')];
  if (location.sequenceOccurrenceIndex != null) parts.push(t(lang, 'loc_sequence_n', { n: location.sequenceOccurrenceIndex + 1 }));
  if (location.track || location.trackIndex != null) parts.push(location.track || t(lang, 'loc_track_n', { n: location.trackIndex + 1 }));
  if (location.clip) parts.push(location.clip);
  if (location.clipOccurrenceIndex != null) parts.push(t(lang, 'loc_clip_n', { n: location.clipOccurrenceIndex + 1 }));
  if (location.componentIndex != null) parts.push(location.component ? t(lang, 'loc_component_named', { n: location.componentIndex + 1, name: location.component }) : t(lang, 'loc_component_n', { n: location.componentIndex + 1 }));
  const parameterIndex = location.parameterIndex ?? location.paramIndex;
  if (parameterIndex != null) parts.push(location.parameter ? t(lang, 'loc_parameter_named', { n: parameterIndex + 1, name: location.parameter }) : t(lang, 'loc_parameter_n', { n: parameterIndex + 1 }));
  if (location.startTime) {
    if (Number.isFinite(location.startTime.seconds)) parts.push(t(lang, 'loc_seconds', { s: location.startTime.seconds.toFixed(3) }));
    if (location.startTime.ticks != null) parts.push(t(lang, 'loc_ticks', { t: location.startTime.ticks }));
  }
  return parts.join(' / ');
}
function hostText(host = {}, lang = 'en') {
  const unknown = t(lang, 'unknown');
  return t(lang, 'host_line', { name: host.name || t(lang, 'host_unknown'), version: host.version || t(lang, 'host_version_unknown'), uxp: host.uxpVersion || unknown, plugin: host.pluginVersion || unknown, locale: host.uiLocale || unknown });
}
function coverageText(coverage, lang = 'en') {
  if (!coverage) return t(lang, 'cov_none');
  const scopes = ['sequences', 'tracks', 'clips', 'components'].map(key => {
    const scope = coverage[key] || {};
    const expected = scope.expected == null ? '?' : scope.expected;
    return t(lang, 'cov_scope', { name: t(lang, `cov_${key}`), known: scope.known ?? 0, expected, status: scope.status || 'UNKNOWN' });
  });
  return t(lang, 'cov_line', { state: coverage.state || 'UNKNOWN', scopes: scopes.join(' · ') });
}
function groups(report, lang = 'en') {
  const grouped = new Map();
  for (const finding of findings(report)) {
    const l = finding.location || {};
    const key = JSON.stringify([l.sequenceGuid, l.sequenceOccurrenceIndex, l.sequence, l.trackId, l.trackIndex, l.track]);
    if (!grouped.has(key)) grouped.set(key, { label: locationText({ ...l, clip: null, clipOccurrenceIndex: null, startTime: null }, lang), findings: [] });
    grouped.get(key).findings.push(finding);
  }
  return [...grouped.values()];
}
function createReport(observation, diagnostics) {
  return { reportVersion: '1.0.0', observation, diagnostics, annotations: {} };
}
function annotate(report, key, value) {
  if (!findings(report).some(f => f.key === key)) throw Error('Unknown finding');
  if (!['unreviewed', 'reviewed', 'intentional'].includes(value)) throw Error('Invalid review state');
  if (value === 'unreviewed') delete report.annotations[key];
  else report.annotations[key] = value;
}
function escapeHTML(value) {
  return String(value == null ? '' : value).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
}
function toHTML(report, lang = 'en') {
  const e = escapeHTML;
  const L = (key, params) => t(lang, key, params);
  const completion = MESSAGES.en[`completion_${report.observation.completion}`] !== undefined ? L(`completion_${report.observation.completion}`) : L('html_unverified');
  const status = e(report.diagnostics.status || 'UNKNOWN');
  const lead = lang === 'ja' ? `${e(completion)} ${e(L('status_done', { completion: '', status: report.diagnostics.status || 'UNKNOWN' }).trim())}` : `${e(completion)} Diagnostic status: ${status}.`;
  const articles = group => group.findings.map(raw => {
    const f = localizeFinding(lang, raw);
    return `<article><strong>${e(severityLabel(lang, f.severity))} · ${e(f.ruleId)}</strong><p>${e(locationText(f.location, lang))}</p><p>${e(f.observed)}</p><p>${e(f.why)}</p><p>${e(f.remediation)}</p><small>${e(L('html_confidence', { c: f.confidence, r: lang === 'ja' ? reviewLabel(lang, report.annotations[f.key] || 'unreviewed') : (report.annotations[f.key] || 'unreviewed') }))}</small></article>`;
  }).join('');
  return `<!doctype html><html lang="${lang === 'ja' ? 'ja' : 'en'}"><head><meta charset="utf-8"><title>${e(L('html_title'))}</title><style>body{font:16px system-ui;max-width:960px;margin:32px auto;padding:0 20px}article{border:1px solid #bbb;padding:16px;margin:12px 0}small{color:#555}</style></head><body><h1>Audio Preflight</h1><p>${lead}</p><p>${e(L('html_project', { name: report.observation.project && report.observation.project.name, at: report.observation.generatedAt, ms: report.observation.durationMs }))}</p><p>${e(hostText(report.observation.host, lang))}</p><p>${e(coverageText(report.diagnostics.coverage, lang))}</p><p>${e(L('html_note'))}</p>${groups(report, lang).map(group => `<h2>${e(group.label)}</h2>${articles(group)}`).join('')}<h2>${e(L('html_raw'))}</h2><p>${e(L('html_raw_note'))}</p></body></html>`;
}
// Colour tone for the overall result badge (display only; does not change any diagnosis).
// Red when the scan failed, amber when there are review findings, green only for a COMPLETE scan
// with no findings AND no unknowns, grey otherwise. Unknowns (for example output routing that the
// public API cannot verify) must not be shown as an all-clear green.
function resultTone(report, failed) {
  if (failed) return 'BAD';
  if (!report || !report.diagnostics) return 'INFO';
  if ((report.diagnostics.risk || []).length > 0) return 'WARN';
  if ((report.diagnostics.unknown || []).length > 0) return 'INFO';
  if (report.diagnostics.status === 'COMPLETE') return 'OK';
  return 'INFO';
}

// ---- Result view helpers (counters, Show targets, audio timeline map). Pure: no host or DOM access. ----

// Shortens a long name in the middle so the start and the ending (file extension) stay visible.
function shortName(name, max) {
  const s = String(name === undefined || name === null ? '' : name);
  const limit = Math.max(8, Number(max) || 26);
  if (s.length <= limit) return s;
  const tail = Math.min(10, Math.floor(limit / 3));
  return s.slice(0, limit - tail - 1) + '…' + s.slice(s.length - tail);
}

// Label for a timeline block that is widthPct percent of its lane: only as many characters as fit a narrow dock
// (about 0.34 characters per percent), ending in an ellipsis when cut; nothing when there is no room.
function blockLabel(name, widthPct) {
  const s = String(name === undefined || name === null ? '' : name);
  const n = Math.floor(Number(widthPct) * 0.34);
  if (!(n >= 3)) return '';
  return s.length <= n ? s : s.slice(0, n - 1) + '…';
}

// Counters shown above the findings. Counts come straight from the diagnostics; nothing is inferred.
function summaryCards(report, lang = 'en') {
  const d = (report && report.diagnostics) || {};
  const n = value => (Array.isArray(value) ? value.length : 0);
  return [
    { key: 'risk', label: t(lang, 'card_risk'), count: n(d.risk) },
    { key: 'unknown', label: t(lang, 'card_unknown'), count: n(d.unknown) },
    { key: 'information', label: t(lang, 'card_information'), count: n(d.information) }
  ];
}

// "2 sequences · 5 audio tracks · 12 clips" from what the scan observed.
function scopeLine(report, lang = 'en') {
  const sequences = (((report && report.observation) || {}).sequences || []).filter(s => s && typeof s === 'object');
  const tracks = sequences.flatMap(s => (Array.isArray(s.audioTracks) ? s.audioTracks : [])).filter(t => t && typeof t === 'object');
  const clips = tracks.reduce((total, t) => total + (Array.isArray(t.clips) ? t.clips.length : 0), 0);
  return t(lang, 'scope_line', { sequences: plural(lang, 'scope_sequence', sequences.length), tracks: plural(lang, 'scope_track', tracks.length), clips: plural(lang, 'scope_clip', clips) });
}

// What the Show chip of a finding does: open the sequence and put the playhead on the clip (clip findings) or just
// open the sequence (track and sequence findings). Findings about the whole project have no target.
function showTarget(location, lang = 'en') {
  const l = location || {};
  if (l.sequenceGuid == null && !Number.isInteger(l.sequenceOccurrenceIndex)) return null;
  const seconds = l.startTime ? Number(l.startTime.seconds) : NaN;
  if (l.clip != null && Number.isFinite(seconds)) {
    const track = l.track || (Number.isInteger(l.trackIndex) ? `A${l.trackIndex + 1}` : null);
    return { kind: 'clip', label: track ? t(lang, 'show_clip_track', { name: shortName(l.clip, 22), track }) : t(lang, 'show_clip', { name: shortName(l.clip, 22) }) };
  }
  return { kind: 'sequence', label: t(lang, 'show_sequence', { name: shortName(l.sequence || 'sequence', 24) }) };
}

// Audio timeline: one lane per non-empty audio track with a block per clip, positioned by its start and end time on the
// sequence's observed length. Flags come from the risk findings (clip identified by sequence, track and clip occurrence).
// A track with more than maxBlocks clips (or beyond a shared budget of four times that) is drawn densely: clips that are
// disabled or named by a review finding are always drawn one by one, and all other clips are grouped into spans, so the
// lane keeps its full coverage and nothing that needs review is hidden. `grouped` counts the clips shown as spans.
// `incomplete` is true for a cancelled, partial or failed scan: the length is then only what was observed.
function trackMap(report, maxBlocks = 300) {
  const observation = (report && report.observation) || {};
  const incomplete = observation.completion !== 'completed';
  const flagged = new Set();
  for (const f of ((report && report.diagnostics && report.diagnostics.risk) || [])) {
    const l = (f && f.location) || {};
    if (l.clipOccurrenceIndex != null) flagged.add(`${l.sequenceOccurrenceIndex}:${l.trackIndex}:${l.clipOccurrenceIndex}`);
  }
  const totalBudget = maxBlocks * 4;
  let drawn = 0;
  const sequences = [];
  ((observation.sequences) || []).forEach((sequence, sequenceIndex) => {
    if (!sequence || typeof sequence !== 'object') return;
    const sequenceKey = sequence.occurrenceIndex ?? sequenceIndex;
    const tracks = (Array.isArray(sequence.audioTracks) ? sequence.audioTracks : []).filter(t => t && typeof t === 'object');
    let length = 0;
    for (const track of tracks) for (const clip of (Array.isArray(track.clips) ? track.clips : [])) {
      const end = Number(clip && clip.endTime && clip.endTime.seconds);
      if (Number.isFinite(end) && end > length) length = end;
    }
    let omitted = 0, unplaced = 0, emptyTracks = 0, grouped = 0;
    const lanes = [];
    const percent = value => Math.round(value * 100) / 100;
    tracks.forEach((track, trackPosition) => {
      const clipList = (Array.isArray(track.clips) ? track.clips : []).filter(c => c && typeof c === 'object');
      if (!clipList.length) { emptyTracks += 1; return; }
      const trackIndex = track.index ?? trackPosition;
      const placed = [];
      clipList.forEach((clip, clipPosition) => {
        const start = Number(clip.startTime && clip.startTime.seconds);
        const end = Number(clip.endTime && clip.endTime.seconds);
        if (!(length > 0) || !Number.isFinite(start) || !Number.isFinite(end)) { unplaced += 1; return; }
        const occurrence = clip.occurrenceIndex ?? clipPosition;
        placed.push({
          start, end, name: clip.name || '(unnamed)', disabled: clip.disabled === true,
          flagged: flagged.has(`${sequenceKey}:${trackIndex}:${occurrence}`),
          location: { sequence: sequence.name || null, sequenceGuid: sequence.guid || null, sequenceOccurrenceIndex: sequenceKey, track: track.name || null, trackIndex, clip: clip.name || null, clipOccurrenceIndex: occurrence, startTime: clip.startTime || null }
        });
      });
      const geometry = item => {
        const left = Math.max(0, Math.min(100, (item.start / length) * 100));
        return { left: percent(left), width: percent(Math.max(0.8, Math.min(100 - left, ((item.end - item.start) / length) * 100))) };
      };
      const blocks = [];
      if (placed.length <= maxBlocks && drawn + placed.length <= totalBudget) {
        for (const item of placed) blocks.push({ name: item.name, ...geometry(item), disabled: item.disabled, flagged: item.flagged, merged: 1, location: item.location });
        drawn += placed.length;
      } else {
        const priority = placed.filter(item => item.disabled || item.flagged);
        const normal = placed.filter(item => !item.disabled && !item.flagged).sort((a, b) => a.start - b.start);
        const tolerance = length * 0.004;
        const spans = [];
        for (const item of normal) {
          const last = spans[spans.length - 1];
          if (last && item.start <= last.end + tolerance) { last.end = Math.max(last.end, item.end); last.count += 1; }
          else spans.push({ start: item.start, end: item.end, count: 1, first: item });
        }
        for (const span of spans) {
          blocks.push({ name: span.count === 1 ? span.first.name : `${span.count} clips`, ...geometry(span), disabled: false, flagged: false, merged: span.count, location: span.first.location });
        }
        grouped += normal.length;
        drawn += spans.length;
        for (const item of priority.slice(0, maxBlocks)) blocks.push({ name: item.name, ...geometry(item), disabled: item.disabled, flagged: item.flagged, merged: 1, location: item.location });
        omitted += Math.max(0, priority.length - maxBlocks);
        drawn += Math.min(priority.length, maxBlocks);
      }
      lanes.push({ index: trackIndex, name: track.name || `A${trackIndex + 1}`, muted: track.muted === true, clipCount: clipList.length, blocks });
    });
    sequences.push({ index: sequenceKey, guid: sequence.guid || null, name: sequence.name || `Sequence ${sequenceIndex + 1}`, length: length > 0 ? length : null, lanes, omitted, unplaced, emptyTracks, grouped, incomplete });
  });
  return sequences;
}

module.exports = { LANGS, MESSAGES, FINDING_TEXT, t, plural, completionText, severityLabel, reviewLabel, localizeFinding, COMPLETION, createReport, findings, groups, locationText, hostText, coverageText, annotate, toHTML, resultTone, shortName, blockLabel, summaryCards, scopeLine, showTarget, trackMap };
