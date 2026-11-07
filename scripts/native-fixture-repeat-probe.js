/* Paste this whole file in the frozen 0.2.1 plugin's UDT console while its panel
 * is idle. Then: await aridRepeatNativeFixture(['F08'], 'Mono1 before reopen')
 * Do not edit/switch projects during the three sequential native traversals.
 * This verification helper is outside the seven packaged runtime files.
 * Independently inspect fixture UI before and after; labels are declarations,
 * not ground truth. This does not exercise panel controls or its export guard.
 */
(function registerNativeRepeats() {
  if (globalThis.aridRepeatNativeFixture && globalThis.aridRepeatNativeFixture.running) {
    throw new Error('A native repeat batch is already running.');
  }
  const expected = {
    pluginVersion: '0.2.1', hostName: 'premierepro', hostVersion: '26.5.2',
    implementationGitSha: '64e75e382cfee9626bb743d949f412d290f180e1',
    declaredRuntimeIdentity: '7b544bd27f3b12b11b21eb695187af4ed51be661385f2821657e73f23225f408'
  };
  async function repeat(fixtureIds, stateLabel = '') {
    if (repeat.running) throw new Error('A native repeat batch is already running.');
    if (!Array.isArray(fixtureIds) || fixtureIds.length < 1 || fixtureIds.length > 2 ||
        new Set(fixtureIds).size !== fixtureIds.length ||
        fixtureIds.some(id => !/^F(?:0[1-9]|1[01])$/.test(id))) {
      throw new Error('Supply one or two distinct fixture IDs F01-F11.');
    }
    if (typeof stateLabel !== 'string' || stateLabel.length > 200) throw new Error('Invalid state label.');
    repeat.running = true;
    try {
      const uxp = require('uxp');
      if (uxp.versions.plugin !== expected.pluginVersion || uxp.host.name !== expected.hostName ||
          uxp.host.version !== expected.hostVersion) throw new Error('Unexpected host/plugin identity; no scans started.');
      const { scanActiveProject } = require('./src/premiereAdapter');
      const { diagnose } = require('./src/diagnostics');
      const { createReport } = require('./src/report');
      if (![scanActiveProject, diagnose, createReport].every(v => typeof v === 'function')) {
        throw new Error('Staged runtime module exports unavailable; no scans started.');
      }
      const batchId = fixtureIds.join('-') + '-' + new Date().toISOString().replace(/[:.]/g, '-') + '-' + Math.random().toString(16).slice(2, 8);
      const batch = {
        recordType: 'arid-native-fixture-repeat-batch', helperVersion: '1.0.1',
        helperFile: 'scripts/native-fixture-repeat-probe.js', batchId,
        fixtureIds: fixtureIds.slice(), stateLabel, expectedRuntime: { ...expected },
        runtimeIdentityEvidence: 'UDT loaded staging path and source-identity.json; helper does not recompute source hashes.',
        executionMethod: 'UDT_CONSOLE_STAGED_ADAPTER_SEQUENTIAL_NATIVE_READS',
        scope: 'Actual native adapter, diagnostics and report modules; no stubs, setters or project actions. Panel controls/export guard are not exercised by this helper.',
        prerequisites: 'Operator verified frozen staging context and idle panel, with independent before/after fixture UI truth and no project edits/switch during batch.',
        batchStartedAt: new Date().toISOString(), executionStatus: 'COLLECTING',
        scansRequested: 3, scanAttempts: 0, runs: []
      };
      // Publish captured evidence before traversal so an unexpected later-run
      // exception cannot hide already completed reports.
      repeat.lastBatch = batch;
      // Retry saving this same captured batch after a cancelled picker without rescanning.
      globalThis.aridSaveNativeRepeatBatch = async function saveCapturedNativeBatch() {
        if (batch.executionStatus === 'COLLECTING') throw new Error('Native reads are still running.');
        if (saveCapturedNativeBatch.running) throw new Error('Batch save is already running.');
        saveCapturedNativeBatch.running = true;
        try {
          const filename = 'arid-native-' + batchId + '.json';
          const file = await uxp.storage.localFileSystem.getFileForSaving(filename, { types: ['json'] });
          if (!file) return { saved: false, reason: 'Picker cancelled', batchId };
          await file.write(JSON.stringify(batch, null, 2), { format: uxp.storage.formats.utf8 });
          return { saved: true, filename, batchId };
        } finally { saveCapturedNativeBatch.running = false; }
      };
      for (let index = 0; index < 3; index++) {
        const startedAt = new Date().toISOString();
        batch.scanAttempts++;
        try {
          const observation = await scanActiveProject();
          const report = createReport(observation, diagnose(observation));
          batch.runs.push({ runId: batchId + ':' + (index + 1), runIndex: index + 1,
            startedAt, finishedAt: new Date().toISOString(), report });
        } catch (error) {
          batch.executionError = { attemptedRunIndex: index + 1, startedAt,
            failedAt: new Date().toISOString(), message: String(error && error.message || error) };
          break;
        }
      }
      batch.executionStatus = batch.runs.length === 3 ? 'THREE_REPORTS_COLLECTED' : 'INCOMPLETE_UNEXPECTED_EXCEPTION';
      batch.batchFinishedAt = new Date().toISOString();
      const summary = { batchId, fixtureIds: batch.fixtureIds, executionStatus: batch.executionStatus,
        scanAttempts: batch.scanAttempts, retainedNativeReports: batch.runs.length,
        runs: batch.runs.map(({ runId, report }) => ({ runId, generatedAt: report.observation.generatedAt,
          durationMs: report.observation.durationMs, completion: report.observation.completion,
          diagnosticStatus: report.diagnostics.status, risk: report.diagnostics.risk.length,
          unknown: report.diagnostics.unknown.length, failedReads: report.diagnostics.coverage.failedReads })) };
      console.log('ARID_NATIVE_REPEAT_SUMMARY', JSON.stringify(summary));
      const saved = await globalThis.aridSaveNativeRepeatBatch();
      console.log('ARID_NATIVE_REPEAT_SAVE', JSON.stringify(saved));
      return { ...summary, ...saved };
    } finally { repeat.running = false; }
  }
  repeat.running = false;
  globalThis.aridRepeatNativeFixture = repeat;
  console.log("Ready: await aridRepeatNativeFixture(['F08'], 'independently verified state label')");
})();
