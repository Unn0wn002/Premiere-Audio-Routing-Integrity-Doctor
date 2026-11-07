// Native UDT console only. Does not invoke the panel renderer or mutate projects.
(async function () {
  const record=globalThis.aridLargeIsolation={startedAt:new Date().toISOString(),method:'Actual host adapter then diagnostics/serialization, without panel render',metrics:{}};
  try {
    const p=await require('premierepro').Project.getActiveProject();
    if(!p || p.path.replace(/^\\\\\?\\/,'')!=='C:\\Users\\unn0w\\Downloads\\02_Projects\\Premiere-Audio-Routing-Integrity-Doctor\\reports\\panel-layout-20261027\\Large_Inventory_Test.prproj') throw Error('Wrong project');
    record.sequenceCount=(await p.getSequences()).length;
    if(record.sequenceCount!==256) throw Error('Wrong inventory');
    let start=Date.now();
    const observation=await require('./src/premiereAdapter').scanActiveProject();
    record.metrics.adapterWallMs=Date.now()-start;
    await new Promise(r=>setTimeout(r,0)); start=Date.now();
    const diagnostics=require('./src/diagnostics').diagnose(observation);
    record.metrics.diagnosticsMs=Date.now()-start;
    record.report=require('./src/report').createReport(observation,diagnostics);
    await new Promise(r=>setTimeout(r,0)); start=Date.now();
    const json=JSON.stringify(record.report,null,2);
    record.metrics.jsonMs=Date.now()-start; record.metrics.jsonCharacters=json.length;
    await new Promise(r=>setTimeout(r,0)); start=Date.now();
    const html=require('./src/report').toHTML(record.report);
    record.metrics.htmlMs=Date.now()-start;record.metrics.htmlCharacters=html.length;
    record.findings=Object.fromEntries(['risk','information','unknown'].map(k=>[k,diagnostics[k].length]));
    record.coverage=diagnostics.coverage;
    if(observation.completion!=='completed'||diagnostics.status!=='COMPLETE'||diagnostics.coverage.failedReads!==0) throw Error('Traversal incomplete');
    record.status='PASS_ADAPTER_REPORT_ONLY';
  } catch(e){record.status='FAIL';record.error=String(e.stack||e);}
  const folder=await require('uxp').storage.localFileSystem.getDataFolder();
  const file=await folder.createFile('arid-large-isolation-20261027.json',{overwrite:false});await file.write(JSON.stringify(record,null,2));
  console.log(JSON.stringify({status:record.status,metrics:record.metrics,findings:record.findings,path:file.nativePath,error:record.error||null}));
})();
