// Native UXP panel event test, with actual 256-sequence project reads.
// No scanner mocks, artificial delays, project edits, or modified runtime code.
(async function () {
  const record = globalThis.aridLargeInventoryTest = { startedAt: new Date().toISOString(), method: 'NATIVE_UXP_PROGRAMMATIC_UI_REAL_HOST_256_SEQUENCES', results: [], runs: [] };
  const el = id => document.getElementById(id);
  const assert = (name, pass, actual) => { record.results.push({ name, pass: Boolean(pass), actual }); if (!pass) throw Error(name); };
  const percentile = (values, p) => values.slice().sort((a,b) => a-b)[Math.min(values.length-1, Math.floor(values.length*p))] ?? null;
  async function scan(cancel) {
    const run = { mode: cancel ? 'MID_INVENTORY_CANCEL' : 'FULL_RETRY', startedAt: new Date().toISOString(), progress: [], timerGapsMs: [] };
    record.runs.push(run);
    const start = Date.now(); let last = start, timer;
    try {
      el('scanButton').dispatchEvent(new Event('click'));
      assert(run.mode + ' enters busy state', el('scanButton').disabled, el('scanButton').disabled);
      timer = setInterval(() => {
        const now = Date.now(); run.timerGapsMs.push(now-last); last=now;
        const progress = el('progress').textContent;
        if (run.progress.length < 1000 && progress !== run.progress[run.progress.length-1]?.text) run.progress.push({ elapsedMs: now-start, text: progress });
        if (cancel && !run.cancelRequestedAtMs && now-start >= 100 && /sequences|tracks|clips/.test(progress) && !el('cancelButton').disabled) {
          run.progressAtCancellation = progress; run.cancelRequestedAtMs = now-start;
          el('cancelButton').dispatchEvent(new Event('click'));
        }
      }, 5);
      while (el('scanButton').disabled) {
        if (Date.now()-start > 30000) throw Error('Scan exceeded bounded 30 second observation');
        await new Promise(resolve => setTimeout(resolve, 10));
      }
      // Include the final render's event-loop delay in the observed gap.
      run.timerGapsMs.push(Date.now()-last);
      run.wallDurationMs = Date.now()-start;
      run.report = JSON.parse(el('output').textContent);
      run.statusText = el('status').textContent;
      run.responsiveness = { timerPeriodMs: 5, samples: run.timerGapsMs.length, maxGapMs: Math.max(...run.timerGapsMs), p95GapMs: percentile(run.timerGapsMs,0.95), gapsOver100ms: run.timerGapsMs.filter(v=>v>100).length, qualification: 'UXP event-loop timer latency including final report render; not OS-wide or mouse latency.' };
      if (cancel) {
        run.cancelToIdleMs = run.wallDurationMs - run.cancelRequestedAtMs;
        assert('cancellation requested after traversal started', Boolean(run.cancelRequestedAtMs) && run.report.observation.project !== null, { requestedAtMs: run.cancelRequestedAtMs, progress: run.progressAtCancellation });
        assert('mid-inventory completion cancelled', run.report.observation.completion === 'cancelled', run.report.observation.completion);
        assert('partial sequence evidence retained', run.report.observation.sequences.length > 0 && run.report.observation.sequences.length < 256, run.report.observation.sequences.length);
        assert('cancelled inventory not COMPLETE', run.report.diagnostics.status !== 'COMPLETE', run.report.diagnostics.status);
        assert('cancel cleanup allows retry', !el('scanButton').disabled && el('cancelButton').disabled, { scan: el('scanButton').disabled, cancel: el('cancelButton').disabled });
      } else {
        assert('full retry completion complete', run.report.observation.completion === 'completed' && run.report.diagnostics.status === 'COMPLETE', { completion: run.report.observation.completion, status: run.report.diagnostics.status });
        assert('all 256 sequences observed', run.report.observation.sequences.length === 256, run.report.observation.sequences.length);
        assert('coverage no failed reads', run.report.diagnostics.coverage.failedReads === 0, run.report.diagnostics.coverage.failedReads);
      }
    } finally { if (timer) clearInterval(timer); run.finishedAt = new Date().toISOString(); }
  }
  try {
    const p = await require('premierepro').Project.getActiveProject();
    assert('exact disposable stress fixture active', p && p.path.endsWith('\\panel-layout-20261027\\Large_Inventory_Test.prproj'), p && p.path);
    assert('independent native sequence count 256', (await p.getSequences()).length === 256, (await p.getSequences()).length);
    assert('panel initially idle', !el('scanButton').disabled, el('scanButton').disabled);
    await scan(true);
    await scan(false);
    record.status = 'PASS';
  } catch (error) { record.status = 'FAIL_OR_BLOCKED'; record.error = error.stack || String(error); }
  record.finishedAt = new Date().toISOString();
  console.log('LARGE_INVENTORY ' + JSON.stringify({status:record.status,results:record.results,runs:record.runs.map(r=>({mode:r.mode,wallDurationMs:r.wallDurationMs,cancelToIdleMs:r.cancelToIdleMs,responsiveness:r.responsiveness})),error:record.error}));
})()
