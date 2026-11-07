const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');
const assert = require('node:assert/strict');
const renderer = require('../../src/report.js');
const {diagnose} = require('../../src/diagnostics.js');
const root = __dirname;
const stem = 'audio-preflight-2026-10-28T15-26-38-306Z';
const json = fs.readFileSync(path.join(root, stem+'.json'), 'utf8');
const html = fs.readFileSync(path.join(root, stem+'.html'), 'utf8');
const report = JSON.parse(json);
const entities = {amp:'&',lt:'<',gt:'>',quot:'"','#39':"'"};
const raw = html.match(/<h2>Raw evidence<\/h2><pre>([\s\S]*?)<\/pre>/);
assert.ok(raw);
assert.deepStrictEqual(JSON.parse(raw[1].replace(/&(amp|lt|gt|quot|#39);/g, (_, e) => entities[e])), report);
assert.equal(html, renderer.toHTML(report));
assert.deepStrictEqual(report.diagnostics, diagnose(report.observation));
assert.equal(report.observation.durationMs, 42);
assert.equal(report.observation.completion, 'completed');
assert.equal(report.diagnostics.status, 'COMPLETE');
assert.equal(report.diagnostics.risk.length, 0);
assert.equal(report.diagnostics.unknown.length, 3);
assert.equal(report.diagnostics.coverage.failedReads, 0);
const articles = (html.match(/<article>/g)||[]).length;
assert.equal(articles, 7);
const hashes = ['json','html'].map(ext => ({file:stem+'.'+ext,sha256:crypto.createHash('sha256').update(fs.readFileSync(path.join(root,stem+'.'+ext))).digest('hex')}));
const result = {verifiedAt:new Date().toISOString(),status:'VERIFIED_THIS_SESSION_BOUNDED_EXPORT_CONTENT',
  runtimeIdentity:'03757105692238f9fdc51a17a39aa4a3c6021ca08a6e8c799aa51d43db8d29a4',
  provenance:'Assistant-operated native docked scan and save dialogs; exported content independently verified',
  durationMs:42,checks:{embeddedHTMLDeepEqualsJSON:true,fullHTMLMatchesRenderer:true,diagnosticsReproduce:true,htmlFindingArticles:articles},
  coverage:report.diagnostics.coverage,files:hashes,
  limits:['These exports bind to the final 037571056922 raw-textarea candidate after manual restart and post-settling reconnection.','No full lifecycle or customer installation qualification.']};
fs.writeFileSync(path.join(root,'layout-final-export-validation-20261028.json'), JSON.stringify(result,null,2)+'\n');
console.log(JSON.stringify(result,null,2));
