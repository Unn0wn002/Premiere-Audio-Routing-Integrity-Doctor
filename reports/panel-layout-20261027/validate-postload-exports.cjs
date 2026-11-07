const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');
const assert = require('node:assert/strict');
const {isDeepStrictEqual} = require('node:util');
const renderer = require('../../src/report.js');
const {diagnose} = require('../../src/diagnostics.js');
const root = __dirname;
const read = file => JSON.parse(fs.readFileSync(file, 'utf8').replace(/^\uFEFF/, ''));
const sha = file => crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex');
const jsonFile = 'audio-preflight-2026-10-28T13-37-12-486Z.json';
const htmlFile = 'audio-preflight-2026-10-28T13-37-12-486Z.html';
const report = read(path.join(root, jsonFile));
const html = fs.readFileSync(path.join(root, htmlFile), 'utf8');
const screen = read(path.join(root, 'postload-manual-scan-20261028.json')).displayedResult;
const encoded = html.match(/<h2>Raw evidence<\/h2><pre>([\s\S]*?)<\/pre>/);
assert.ok(encoded, 'HTML raw evidence block exists');
const entities = {'amp':'&', 'lt':'<', 'gt':'>', 'quot':'"', '#39':"'"};
const raw = encoded[1].replace(/&(amp|lt|gt|quot|#39);/g, (_, entity) => entities[entity]);
assert.deepStrictEqual(JSON.parse(raw), report, 'Embedded HTML evidence equals JSON');
assert.equal(html, renderer.toHTML(report), 'Full HTML equals complete renderer output');
assert.deepStrictEqual(report.diagnostics, diagnose(report.observation), 'Diagnostics reproduce from exported observations');
assert.equal(report.observation.project.name, screen.project);
assert.equal(report.observation.durationMs, screen.reportedDurationMs);
assert.equal(report.observation.completion, 'completed');
assert.equal(report.observation.scanTraversalComplete, true);
assert.equal(report.observation.sequenceInventoryComplete, true);
assert.equal(report.diagnostics.status, screen.diagnosticStatus);
assert.equal(report.diagnostics.coverage.failedReads, 0);
assert.equal(report.diagnostics.risk.length, screen.reviewFindings);
assert.equal(report.diagnostics.unknown.length, screen.unknowns);
for (const key of ['sequences','tracks','clips','components']) {
  const coverage = report.diagnostics.coverage[key];
  assert.equal(coverage.status, 'COMPLETE');
  assert.equal(coverage.known, screen.coverage[key].known);
  assert.equal(coverage.expected, screen.coverage[key].total);
}
const articles = (html.match(/<article>/g) || []).length;
assert.equal(articles, renderer.findings(report).length);
assert.equal(articles, 7);
for (const finding of renderer.findings(report)) assert.ok(html.includes(finding.ruleId));
const receipt = read(path.join(root, '../../artifacts/audio-preflight-0.2.1-48bb1d177f4c-receipt.json'));
const stage = path.join(root, '../../artifacts/audio-preflight-0.2.1-48bb1d177f4c');
const installed = 'C:/Users/unn0w/AppData/Roaming/Adobe/UXP/Plugins/External/com.unn0wn002.audio-preflight.beta_0.2.1';
const installedFiles = receipt.files.map(file => {
  const exactBytes = sha(path.join(installed, file.file)) === file.sha256;
  const equivalentManifest = file.file === 'manifest.json' && isDeepStrictEqual(read(path.join(installed,file.file)), read(path.join(stage,file.file)));
  assert.ok(exactBytes || equivalentManifest, 'Installed file matches receipt: '+file.file);
  return {file:file.file, exactBytes, manifestValuesEqual:file.file === 'manifest.json' ? equivalentManifest : null};
});
const fixtureHash = sha(path.join(root,'Positive_Signal_Test.prproj'));
assert.equal(fixtureHash, '7bfc2f703ec78c5592f4150986a4635270feb6e197806f11d02d61f478d723ec');
const earlier = read(path.join(root,'installed-test.json'));
const withoutTiming = value => {
  const copy = structuredClone(value);
  delete copy.observation.generatedAt;
  delete copy.observation.durationMs;
  return copy;
};
const result = {
  verifiedAt:new Date().toISOString(),status:'VERIFIED_THIS_SESSION_BOUNDED_EXPORT_CONTENT',
  provenance:'User-performed native exports; saved file contents independently checked',
  json:{file:jsonFile,bytes:fs.statSync(path.join(root,jsonFile)).size,sha256:sha(path.join(root,jsonFile))},
  html:{file:htmlFile,bytes:fs.statSync(path.join(root,htmlFile)).size,sha256:sha(path.join(root,htmlFile))},
  checks:{jsonParsed:true,embeddedHTMLDeepEqualsJSON:true,fullHTMLMatchesRenderer:true,
    diagnosticsReproduce:true,screenshotCountsAndDurationAgree:true,fullTraversalComplete:true,
    sequenceInventoryComplete:true,htmlFindingArticles:articles,allFindingRuleIdsPresent:true},
  project:report.observation.project.name,generatedAt:report.observation.generatedAt,
  durationMs:report.observation.durationMs,host:report.observation.host,
  diagnosticStatus:report.diagnostics.status,reviewFindings:report.diagnostics.risk.length,
  information:report.diagnostics.information.length,unknown:report.diagnostics.unknown.length,
  unknownRuleIds:report.diagnostics.unknown.map(finding=>finding.ruleId),
  coverage:report.diagnostics.coverage,annotations:report.annotations,
  installedRuntimeIdentity:receipt.identity,installedFiles,fixtureSha256:fixtureHash,
  earlierExportComparison:{file:'installed-test.json',equalExceptGeneratedAtAndDuration:isDeepStrictEqual(withoutTiming(report),withoutTiming(earlier)),
    qualification:'Equality covers exported observations/diagnostics only, not all native project semantics'},
  limits:['No browser visual-render QA was performed.','This validates one completed scan/export pair; it does not resolve the opening delay or qualify full lifecycle reliability.',
    'Mapping, output buses and playback/export correctness remain UNKNOWN.','No new native input or scan was performed by the assistant during file verification.']
};
fs.writeFileSync(path.join(root,'postload-export-validation-20261028.json'),JSON.stringify(result,null,2)+'\n');
const aggregate = read(path.join(root,'session-result.json'));
aggregate.postLoadExportValidation = result;
fs.writeFileSync(path.join(root,'session-result.json'),JSON.stringify(aggregate,null,2)+'\n');
assert.deepStrictEqual(read(path.join(root,'postload-export-validation-20261028.json')),read(path.join(root,'session-result.json')).postLoadExportValidation);
console.log(JSON.stringify(result,null,2));
