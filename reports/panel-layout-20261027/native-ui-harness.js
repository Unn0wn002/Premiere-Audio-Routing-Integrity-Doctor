// Run in the loaded plugin's UDT console, with a disposable project open.
// Programmatic native UXP DOM events; no stubs, host setters, or source edits.
// Does not qualify physical mouse selection, large-project cancellation, or installation.
(async function () {
  const record = globalThis.aridNativeUI = {
    method: 'NATIVE_PREMIERE_UXP_PROGRAMMATIC_DOM_EVENTS',
    startedAt: new Date().toISOString(), results: [], reports: {},
    qualification: 'Native panel handlers and actual host reads; not physical mouse interaction.'
  };
  const el = id => document.getElementById(id);
  const report = () => JSON.parse(el('output').textContent);
  const assert = (name, ok, actual) => {
    record.results.push({ name, pass: Boolean(ok), actual });
    if (!ok) throw Error(name);
  };
  const idle = async () => {
    const started = Date.now();
    while (el('scanButton').disabled) {
      if (Date.now() - started > 10000) throw Error('UI did not become idle within 10 seconds');
      await new Promise(resolve => setTimeout(resolve, 10));
    }
  };
  let countAcceptedClicks = 0;
  const countClick = () => { countAcceptedClicks++; };
  try {
    assert('initial report available', report().observation.completion === 'completed', report().observation.completion);
    const selector = document.querySelector('select');
    selector.value = 'intentional';
    selector.dispatchEvent(new Event('change'));
    record.reports.annotated = report();
    assert('annotation change reaches raw report', Object.values(record.reports.annotated.annotations).includes('intentional'), record.reports.annotated.annotations);
    assert('selector retains annotation', selector.value === 'intentional', selector.value);

    el('scanButton').addEventListener('click', countClick);
    el('scanButton').dispatchEvent(new Event('click'));
    assert('scan disables start and exports', el('scanButton').disabled && el('jsonButton').disabled && el('htmlButton').disabled, { scan: el('scanButton').disabled, json: el('jsonButton').disabled, html: el('htmlButton').disabled });
    assert('cancel enabled during scan', !el('cancelButton').disabled, el('cancelButton').disabled);
    el('scanButton').dispatchEvent(new Event('click'));
    record.acceptedClickEvents = countAcceptedClicks;
    // Synthetic dispatch deliberately bypasses disabled DOM hit-testing to exercise inFlight.
    // Two delivered events and a stable busy state are observed; no scanner-call counter is injected.
    assert('duplicate synthetic click leaves busy state intact', countAcceptedClicks === 2 && el('scanButton').disabled && !el('cancelButton').disabled, { deliveredEvents: countAcceptedClicks, busy: el('scanButton').disabled });
    el('cancelButton').dispatchEvent(new Event('click'));
    await idle();
    record.reports.cancelled = report();
    assert('immediate cancellation retained', record.reports.cancelled.observation.completion === 'cancelled', record.reports.cancelled.observation.completion);
    assert('cancellation message honest', /cancel/i.test(el('status').textContent), el('status').textContent);
    assert('cancel cleanup restores controls', !el('scanButton').disabled && el('cancelButton').disabled && !el('jsonButton').disabled, { scan: el('scanButton').disabled, cancel: el('cancelButton').disabled, json: el('jsonButton').disabled });

    el('scanButton').dispatchEvent(new Event('click'));
    await idle();
    record.reports.retry = report();
    assert('retry completes native host traversal', record.reports.retry.observation.completion === 'completed' && record.reports.retry.diagnostics.status === 'COMPLETE', { completion: record.reports.retry.observation.completion, status: record.reports.retry.diagnostics.status });
    assert('new scan resets annotations', Object.keys(record.reports.retry.annotations).length === 0, record.reports.retry.annotations);
    assert('new selector resets review state', document.querySelector('select').value === 'unreviewed', document.querySelector('select').value);
    const hiddenBefore = el('output').hidden;
    el('detailsButton').dispatchEvent(new Event('click'));
    assert('raw evidence toggle works', el('output').hidden !== hiddenBefore, el('output').hidden);
    el('detailsButton').dispatchEvent(new Event('click'));
    record.status = 'PASS';
  } catch (error) {
    record.status = 'FAIL_OR_UNSUPPORTED'; record.error = error.stack || String(error);
  } finally {
    el('scanButton').removeEventListener('click', countClick);
    record.finishedAt = new Date().toISOString();
  }
  return JSON.stringify({ status: record.status, results: record.results, error: record.error });
})()
