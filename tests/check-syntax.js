const fs = require('node:fs');
const { spawnSync } = require('node:child_process');
const files = ['index.js', ...['src', 'tests', 'scripts'].flatMap(dir => fs.readdirSync(dir).filter(f => f.endsWith('.js')).map(f => `${dir}/${f}`))];
for (const file of files) {
  const r = spawnSync(process.execPath, ['--check', file], { encoding: 'utf8' });
  console.log(`${file}: ${r.status === 0 ? 'PASS' : 'FAIL'}`);
  if (r.status !== 0) { console.error(r.stderr); process.exitCode = 1; }
}
