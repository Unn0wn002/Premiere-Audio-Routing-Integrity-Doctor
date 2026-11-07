// Mock control-flow check for the verification helper. This never loads UXP or
// Premiere and is not native fixture/API evidence.
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const assert = require('node:assert/strict');
const crypto = require('node:crypto');
const { createReport } = require('../../src/report');
const helperPath = path.resolve(__dirname, '../../scripts/native-fixture-repeat-probe.js');
const code = fs.readFileSync(helperPath, 'utf8');
async function scenario(kind) {
  let reads = 0, pickers = 0;
  const saved = [];
  const runtime = {
    uxp: { versions: { plugin: '0.2.1' }, host: { name: 'premierepro', version: '26.5.2' },
      storage: { formats: { utf8: 'utf8' }, localFileSystem: {
        async getFileForSaving() {
          pickers++;
          if (kind === 'cancel-retry' && pickers === 1) return null;
          return { async write(text) { saved.push(JSON.parse(text)); } };
        }
      } }
    },
    './src/premiereAdapter': { async scanActiveProject() {
      reads++;
      if (kind === 'unexpected-second-run' && reads === 2) throw Error('Injected helper recovery failure');
      return { verification: 'MOCK_ONLY_NOT_NATIVE', generatedAt: 'mock-' + reads, durationMs: 1, completion: 'completed' };
    } },
    './src/diagnostics': { diagnose: () => ({ status: 'COMPLETE', risk: [], unknown: [], coverage: { failedReads: 0 } }) },
    './src/report': { createReport }
  };
  const context = vm.createContext({ require: id => {
    if (!(id in runtime)) throw Error('Unexpected dependency ' + id);
    return runtime[id];
  }, console: { log() {} } });
  vm.runInContext(code, context, { filename: helperPath });
  const result = await context.aridRepeatNativeFixture(['F08'], 'MOCK CONTROL ONLY');
  const batch = context.aridRepeatNativeFixture.lastBatch;
  assert.equal(context.aridRepeatNativeFixture.running, false);
  if (kind === 'unexpected-second-run') {
    assert.equal(reads, 2);
    assert.equal(batch.runs.length, 1);
    assert.equal(result.executionStatus, 'INCOMPLETE_UNEXPECTED_EXCEPTION');
    assert.equal(batch.executionError.attemptedRunIndex, 2);
    assert.equal(saved[0].runs[0].report.observation.generatedAt, 'mock-1');
    assert.equal(saved[0].executionError.message, 'Injected helper recovery failure');
  } else {
    assert.equal(reads, 3);
    assert.equal(batch.runs.length, 3);
    assert.equal(result.executionStatus, 'THREE_REPORTS_COLLECTED');
    if (kind === 'cancel-retry') {
      assert.equal(result.saved, false);
      assert.equal(saved.length, 0);
      const priorReports = JSON.stringify(batch.runs.map(run => run.report));
      const retry = await context.aridSaveNativeRepeatBatch();
      assert.equal(retry.saved, true);
      assert.equal(reads, 3, 'Save retry must not rescan');
      assert.equal(JSON.stringify(saved[0].runs.map(run => run.report)), priorReports);
    }
  }
  assert.equal(saved.length, 1);
  assert.equal(batch.scanAttempts, reads);
  return { scenario: kind, passed: true, scanCalls: reads, retainedReports: batch.runs.length,
    executionStatus: batch.executionStatus, savePickers: pickers, savedBatches: saved.length };
}
(async () => {
  const scenarios = [];
  for (const kind of ['three-reports', 'unexpected-second-run', 'cancel-retry']) scenarios.push(await scenario(kind));
  const record = { recordType: 'MOCK_CONTROL_VALIDATION_NOT_NATIVE', recordedAt: new Date().toISOString(),
    command: 'node reports/verification-20261017/check-native-repeat-helper.cjs',
    helperSha256: crypto.createHash('sha256').update(fs.readFileSync(helperPath)).digest('hex'),
    scope: 'Verification-helper batch retention and picker recovery only; no Premiere/UXP executed.', scenarios };
  fs.writeFileSync(path.join(__dirname, 'native-repeat-helper-mock-controls.json'), JSON.stringify(record, null, 2) + '\n');
  console.log(JSON.stringify({ mockControlsPassed: scenarios.length, nativeHostExecuted: false }));
})().catch(error => { console.error(error); process.exitCode = 1; });
