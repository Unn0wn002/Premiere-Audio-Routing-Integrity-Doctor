// Local evidence integrity only; no host API, installation or lifecycle execution.
const fs = require('node:fs');
const path = require('node:path');
const cp = require('node:child_process');
const crypto = require('node:crypto');
const root = path.resolve(__dirname, '../..');
const baseline = 'd1b2b091e28d76af60e33c99261d01108e2000db';
const git = args => cp.execFileSync('git', args, { cwd: root, maxBuffer: 64 * 1024 * 1024 });
const runtime = ['manifest.json', 'index.html', 'index.js', 'src/premiereAdapter.js', 'src/diagnostics.js', 'src/valueSerializer.js', 'src/report.js'];
git(['diff', '--exit-code', baseline, '--', ...runtime, 'reports/verification-20261017']);
const output = 'reports/submission-closeout-20261019/index-integrity.json';
const files = git(['ls-files', 'reports/submission-closeout-20261019']).toString('utf8').trim().split(/\r?\n/).filter(file => file && file !== output);
const artifacts = files.map(file => {
  const bytes = fs.readFileSync(path.join(root, file));
  return { file, bytes: bytes.length, sha256: crypto.createHash('sha256').update(bytes).digest('hex'), indexBytesMatch: bytes.equals(git(['show', ':' + file])) };
});
if (!artifacts.length || artifacts.some(item => !item.indexBytesMatch)) throw Error('Closeout evidence is missing or differs from Git index');
fs.writeFileSync(path.join(root, output), JSON.stringify({
  recordedAt: new Date().toISOString(), branch: git(['branch', '--show-current']).toString('utf8').trim(),
  evidenceParentGitSha: baseline, frozenRuntimeAndPriorEvidenceUnchanged: true,
  qualification: 'Git-index byte integrity only; no native execution or installation. The receipt itself is excluded from its artifact list.',
  command: 'node reports/submission-closeout-20261019/verify-closeout-index.cjs', artifacts
}, null, 2) + '\n');
console.log(JSON.stringify({ artifactsVerified: artifacts.length, indexBytesMatch: true, frozenRuntimeAndPriorEvidenceUnchanged: true }));
