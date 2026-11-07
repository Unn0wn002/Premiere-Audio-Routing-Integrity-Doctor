'use strict';
// Repository hygiene: keeps debug material (crash dumps, traces, debugger tools) and huge files out of git.
// It checks every file git would commit: tracked files plus untracked files that are not ignored.
const test = require('node:test');
const assert = require('node:assert');
const fs = require('node:fs');
const path = require('node:path');
const { execFileSync } = require('node:child_process');

const root = path.join(__dirname, '..');
const MAX_BYTES = 2 * 1024 * 1024;
const FORBIDDEN_EXT = /\.(dmp|mdmp|etl|msix|pdb)$/i;

function committableFiles() {
  try {
    const out = execFileSync('git', ['ls-files', '-z', '--cached', '--others', '--exclude-standard'], { cwd: root, maxBuffer: 64 * 1024 * 1024 });
    return out.toString('utf8').split('\0').filter(Boolean);
  } catch (error) {
    return null; // not a git checkout (for example an extracted archive)
  }
}

test('no file git would commit is 2 MB or larger', { skip: committableFiles() === null }, () => {
  const tooBig = [];
  for (const file of committableFiles()) {
    const full = path.join(root, file);
    if (!fs.existsSync(full)) continue; // deleted but still listed
    const size = fs.statSync(full).size;
    if (size >= MAX_BYTES) tooBig.push(`${file} (${(size / 1048576).toFixed(1)} MB)`);
  }
  assert.deepStrictEqual(tooBig, [], 'Add big files to .gitignore or keep them outside the repo');
});

test('no crash dump, trace, installer or symbol file would be committed', { skip: committableFiles() === null }, () => {
  const bad = committableFiles().filter((file) => FORBIDDEN_EXT.test(file) || /(^|\/)debugger-tools\//.test(file));
  assert.deepStrictEqual(bad, []);
});

test('.gitignore keeps blocking dumps, traces and agent tool state', () => {
  const text = fs.readFileSync(path.join(root, '.gitignore'), 'utf8');
  for (const rule of ['*.dmp', '*.etl', '*.msix', '*.pdb', '.agents/', '.claude/', 'skills-lock.json']) {
    assert.ok(text.split(/\r?\n/).includes(rule), `.gitignore must contain ${rule}`);
  }
});
