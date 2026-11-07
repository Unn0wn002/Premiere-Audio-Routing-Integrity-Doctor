// Checks staged raw evidence bytes. Artifact count is not a native scan count.
const fs = require('node:fs');
const path = require('node:path');
const cp = require('node:child_process');
const crypto = require('node:crypto');
const root = path.resolve(__dirname, '../..');
const sourceGitSha = '64e75e382cfee9626bb743d949f412d290f180e1';
const runtime = ['manifest.json', 'index.html', 'index.js', 'src/premiereAdapter.js', 'src/diagnostics.js', 'src/valueSerializer.js', 'src/report.js'];
const git = args => cp.execFileSync('git', args, { cwd: root, maxBuffer: 64 * 1024 * 1024 });
git(['diff', '--exit-code', sourceGitSha, '--', ...runtime]);
const files = git(['ls-files', 'reports/verification-20261017']).toString('utf8').trim().split(/\r?\n/)
  .filter(file => file.endsWith('-export.json') || file.endsWith('inherited-working-tree.patch'));
const artifacts = files.map(file => {
  const bytes = fs.readFileSync(path.join(root, file));
  return { file, bytes: bytes.length,
    sha256: crypto.createHash('sha256').update(bytes).digest('hex'),
    indexBytesMatch: bytes.equals(git(['show', ':' + file])) };
});
if (artifacts.some(item => !item.indexBytesMatch)) throw Error('Evidence bytes differ from Git index');
fs.writeFileSync(path.join(__dirname, 'artifact-integrity.json'), JSON.stringify({
  recordedAt: new Date().toISOString(), branch: git(['branch', '--show-current']).toString('utf8').trim(),
  evidenceParentHead: git(['rev-parse', 'HEAD']).toString('utf8').trim(), sourceGitSha,
  scope: 'Verbatim raw native-export and inherited-patch bytes verified against Git index; seven runtime files unchanged from source commit',
  command: 'node reports/verification-20261017/verify-evidence-index.cjs', artifacts
}, null, 2) + '\n');
console.log(JSON.stringify({ artifactsVerified: artifacts.length, indexBytesMatch: true, frozenRuntimeUnchanged: true }));
