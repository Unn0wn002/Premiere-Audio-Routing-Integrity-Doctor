// Read-only verification of the inherited candidate and historical report pair.
// Writes only this session's evidence directory; never rebuilds/replaces a package.
const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');
const assert = require('node:assert/strict');
const { spawnSync } = require('node:child_process');
const { isDeepStrictEqual } = require('node:util');
const root = path.resolve(__dirname, '../..');
const read = file => JSON.parse(fs.readFileSync(file, 'utf8').replace(/^\uFEFF/, ''));
const hash = bytes => crypto.createHash('sha256').update(bytes).digest('hex');
const sha = file => hash(fs.readFileSync(file));
const git = args => {
  const r = spawnSync('git', args, { cwd: root, encoding: 'utf8' });
  assert.equal(r.status, 0, r.stderr);
  return r.stdout.trim();
};
const destination = path.join(__dirname, 'checkpoint-verification.json');
assert.ok(!fs.existsSync(destination), 'Keep the first verification immutable');
const inheritedStatus = git(['status', '--porcelain=v1', '-uall']);
fs.writeFileSync(path.join(__dirname, 'inherited-git-status.txt'), inheritedStatus + '\n', { flag: 'wx' });
const trackedDiff = spawnSync('git', ['diff', '--binary', '--no-ext-diff'], { cwd: root, encoding: 'utf8', maxBuffer: 8 * 1024 * 1024 });
assert.equal(trackedDiff.status, 0);
fs.writeFileSync(path.join(__dirname, 'inherited-tracked.patch'), trackedDiff.stdout, { flag: 'wx' });
const dirtyPaths = git(['diff', '--name-only']).split('\n').filter(Boolean);
const untrackedPaths = git(['-c', 'core.quotepath=false', 'ls-files', '--others', '--exclude-standard', '-z']).split('\0').filter(Boolean);
const inventoryPaths = [...dirtyPaths, ...untrackedPaths];
const inventory = inventoryPaths.map(file => {
  const info = fs.statSync(path.join(root, file));
  return { file, bytes: info.size, mtime: info.mtime.toISOString(), sha256: dirtyPaths.includes(file) ? sha(path.join(root, file)) : undefined };
});
fs.writeFileSync(path.join(__dirname, 'inherited-inventory.json'), JSON.stringify(inventory, null, 2) + '\n', { flag: 'wx' });
const receipt = read(path.join(root, 'artifacts/audio-preflight-0.2.1-037571056922-receipt.json'));
const stage = path.join(root, 'artifacts/audio-preflight-0.2.1-037571056922');
const sourceFiles = receipt.files.map(item => {
  const file = path.join(root, item.file);
  const normalized = Buffer.from(fs.readFileSync(file, 'utf8').replace(/\r\n/g, '\n'));
  const sourceSha256 = hash(normalized);
  const stageSha256 = sha(path.join(stage, item.file));
  assert.equal(sourceSha256, item.sha256, item.file + ' source drift');
  assert.equal(stageSha256, item.sha256, item.file + ' stage drift');
  return { file: item.file, sha256: sourceSha256, stageMatches: true, rawSourceSha256: sha(file) };
});
const identity = hash(JSON.stringify(sourceFiles.map(({file, sha256}) => ({file, sha256}))));
assert.equal(identity, receipt.identity);
assert.equal(sha(path.join(root, 'artifacts/audio-preflight-0.2.1-037571056922-developer.zip')), receipt.packageSha256);
const installed = 'C:/Users/unn0w/AppData/Roaming/Adobe/UXP/Plugins/External/com.unn0wn002.audio-preflight.beta_0.2.1';
const olderReceipt = read(path.join(root, 'artifacts/audio-preflight-0.2.1-48bb1d177f4c-receipt.json'));
const installedFiles = olderReceipt.files.map(item => {
  const file = path.join(installed, item.file);
  if (!fs.existsSync(file)) return {file: item.file, present: false};
  const exact = sha(file) === item.sha256;
  const manifestValuesEqual = item.file === 'manifest.json' ? isDeepStrictEqual(read(file), read(path.join(root, 'artifacts/audio-preflight-0.2.1-48bb1d177f4c', item.file))) : null;
  return {file: item.file, sha256: sha(file), exact, manifestValuesEqual, matchesPredecessor: exact || manifestValuesEqual === true};
});
const historicalRoot = path.join(root, 'reports/panel-layout-20261027');
const aggregate = read(path.join(historicalRoot, 'session-result.json'));
const historical = aggregate.layoutPostRestartValidation;
assert.equal(historical.runtimeIdentity, identity);
const exportHashes = historical.exports.files.map(item => {
  const actual = sha(path.join(historicalRoot, item.file));
  assert.equal(actual, item.sha256);
  return {file: item.file, sha256: actual};
});
const report = read(path.join(historicalRoot, exportHashes.find(x => x.file.endsWith('.json')).file));
const html = fs.readFileSync(path.join(historicalRoot, exportHashes.find(x => x.file.endsWith('.html')).file), 'utf8');
const raw = html.match(/<h2>Raw evidence<\/h2><pre>([\s\S]*?)<\/pre>/);
assert.ok(raw);
const entities = {amp:'&', lt:'<', gt:'>', quot:'"', '#39':"'"};
assert.deepEqual(JSON.parse(raw[1].replace(/&(amp|lt|gt|quot|#39);/g, (_, entity) => entities[entity])), report);
assert.equal(html, require('../../src/report.js').toHTML(report));
assert.deepEqual(report.diagnostics, require('../../src/diagnostics.js').diagnose(report.observation));
assert.equal(report.observation.durationMs, 42);
assert.deepEqual(report.diagnostics.coverage, historical.exports.coverage);
const fixtureSha256 = sha(path.join(historicalRoot, 'Positive_Signal_Test.prproj'));
assert.equal(fixtureSha256, historical.fixtureSha256);
const result = {
  verifiedAt: new Date().toISOString(), evidenceClass: 'VERIFIED_THIS_SESSION_STATIC_AND_FILESYSTEM',
  branch: git(['branch', '--show-current']), head: git(['rev-parse', 'HEAD']),
  inheritedDirtyPaths: dirtyPaths, inheritedUntrackedCount: untrackedPaths.length,
  normalizedRuntimeIdentity: identity, sourceFiles, packageSha256: receipt.packageSha256,
  installedPredecessor: {expectedIdentity: olderReceipt.identity, files: installedFiles, allMatch: installedFiles.every(x => x.matchesPredecessor)},
  historicalAggregateSha256: sha(path.join(historicalRoot, 'session-result.json')),
  historicalExportsRechecked: {files: exportHashes, embeddedJSONEquality: true, rendererEquality: true, reproducibleDiagnostics: true, historicalScanMs: 42, newNativeScan: false},
  fixtureSha256,
  limits: ['Source/stage/archive identity is not proof of a currently loaded native runtime.', 'Historical scan/export origins remain HISTORICAL_RECORDED; this run verifies retained file contents only.', 'Installed predecessor bytes do not qualify clean-customer installation or lifecycle.']
};
fs.writeFileSync(destination, JSON.stringify(result, null, 2) + '\n', {flag:'wx'});
console.log(JSON.stringify({branch: result.branch, head: result.head, identity, dirty: dirtyPaths.length, untracked: untrackedPaths.length, installedPredecessorMatches: result.installedPredecessor.allMatch, historicalExportReadback: 'PASS', fixtureSha256}, null, 2));
