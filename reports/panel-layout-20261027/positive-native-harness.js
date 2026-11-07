// Execute only in the loaded beta UDT console. Actual host reads; no mocks.
(async function () {
  const record = globalThis.aridPositiveChecks = {method: 'Native UXP DOM events and real Premiere reads; programmatic interaction', startedAt: new Date().toISOString(), assertions: [], runs: []};
  const el = id => document.getElementById(id);
  const check = (name, pass, detail) => {record.assertions.push({name, pass: Boolean(pass), detail}); if (!pass) throw Error(name);};
  const wait = async () => {const start=Date.now(); while(el('scanButton').disabled) {if(Date.now()-start>10000) throw Error('Bounded scan timeout'); await new Promise(r=>setTimeout(r,10));}};
  try {
    const p = await require('premierepro').Project.getActiveProject();
    check('Exact disposable project active', p && p.path.replace(/^\\\\\?\\/, '') === 'C:\\Users\\unn0w\\Downloads\\02_Projects\\Premiere-Audio-Routing-Integrity-Doctor\\reports\\panel-layout-20261027\\Positive_Signal_Test.prproj', p && p.path);
    check('Panel idle', !el('scanButton').disabled);
    for(let n=0;n<3;n++) {
      el('scanButton').dispatchEvent(new Event('click')); await wait();
      const r=JSON.parse(el('output').textContent); record.runs.push(r);
      check('Run '+n+' completes', r.observation.completion==='completed' && r.diagnostics.status==='COMPLETE',r.observation.durationMs);
      check('Run '+n+' clears original mute/disable risks',r.diagnostics.risk.length===0,r.diagnostics.risk);
      check('Run '+n+' retains capability unknowns',r.diagnostics.unknown.length===3,r.diagnostics.unknown.map(x=>x.ruleId));
      check('Run '+n+' full sequence inventory',r.observation.sequences.length===4 && r.diagnostics.coverage.failedReads===0,r.diagnostics.coverage);
      if(n) check('Run '+n+' stable diagnostics',JSON.stringify(r.diagnostics)===JSON.stringify(record.runs[0].diagnostics));
    }
    el('scanButton').dispatchEvent(new Event('click'));
    el('cancelButton').dispatchEvent(new Event('click')); await wait();
    record.cancelReport=JSON.parse(el('output').textContent);
    check('Immediate cancellation retained',record.cancelReport.observation.completion==='cancelled',record.cancelReport.observation.completion);
    check('Cancel cleanup returns controls',!el('scanButton').disabled && el('cancelButton').disabled);
    el('scanButton').dispatchEvent(new Event('click')); await wait();
    record.retryReport=JSON.parse(el('output').textContent);
    check('Retry complete',record.retryReport.observation.completion==='completed' && record.retryReport.diagnostics.status==='COMPLETE');
    check('Retry still zero risks',record.retryReport.diagnostics.risk.length===0);
    record.status='PASS';
  } catch(e) {record.status='FAIL';record.error=String(e.stack||e);}
  const folder=await require('uxp').storage.localFileSystem.getDataFolder();
  const file=await folder.createFile('arid-positive-native-20261027.json',{overwrite:false});
  await file.write(JSON.stringify(record,null,2));
  console.log(JSON.stringify({status:record.status,assertions:record.assertions.length,passed:record.assertions.filter(x=>x.pass).length,durations:record.runs.map(r=>r.observation.durationMs),path:file.nativePath,error:record.error||null}));
})();
