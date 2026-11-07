// Native UDT console: actual host scans, programmatic DOM interactions, no mocks.
(async function () {
  const record=globalThis.aridPaginationTest={runtime:'48bb1d177f4c',runs:[],assertions:[]};
  const el=id=>document.getElementById(id), click=id=>el(id).dispatchEvent(new Event('click'));
  const check=(name,pass,actual)=>{record.assertions.push({name,pass:Boolean(pass),actual});if(!pass)throw Error(name);};
  const cards=()=>Array.from(el('findings').children).filter(n=>String(n.className).startsWith('finding '));
  async function wait(){const start=Date.now();while(el('scanButton').disabled){if(Date.now()-start>20000)throw Error('Scan timeout');await new Promise(r=>setTimeout(r,10));}}
  function raw(){click('detailsButton');const r=JSON.parse(el('output').textContent);click('detailsButton');return r;}
  try {
    const p=await require('premierepro').Project.getActiveProject();
    check('Exact large fixture',p&&p.path.endsWith('\\panel-layout-20261027\\Large_Inventory_Test.prproj'));
    check('Paged UI loaded',Boolean(el('nextPageButton')));
    for(let n=0;n<3;n++){
      let last=Date.now();const start=last,gaps=[];
      const timer=setInterval(()=>{const now=Date.now();gaps.push(now-last);last=now;},5);
      try {click('scanButton');await wait();await new Promise(r=>setTimeout(r,0));}
      finally {clearInterval(timer);}
      const run={wallMs:Date.now()-start,maxGapMs:Math.max(...gaps),gapsOver100ms:gaps.filter(x=>x>100).length,cardCount:cards().length,rawHidden:el('output').hidden,rawCharacters:el('output').textContent.length};
      record.runs.push(run);
      check('Run '+n+' complete',/Diagnostic status: COMPLETE/.test(el('status').textContent));
      check('Run '+n+' bounded cards and hidden raw',run.cardCount===25&&run.rawHidden&&run.rawCharacters===0,run);
    }
    const rawStart=Date.now();record.report=raw();record.rawOpenParseHideMs=Date.now()-rawStart;
    check('All evidence retained',record.report.observation.sequences.length===256&&record.report.diagnostics.coverage.failedReads===0);
    const expected=require('./src/report').groups(record.report).flatMap(g=>g.findings.map(f=>`${f.severity} · ${f.ruleId}|${require('./src/report').locationText(f.location)}`));
    const select=cards()[0].querySelector('select');select.value='intentional';select.dispatchEvent(new Event('change'));
    const seen=[];let page=0,maxPageMs=0;
    do {
      check('Page '+page+' bounded',cards().length<=25,cards().length);
      seen.push(...cards().map(c=>c.querySelector('strong').textContent+'|'+c.querySelector('.location').textContent));
      if(el('nextPageButton').disabled)break;
      const start=Date.now();click('nextPageButton');maxPageMs=Math.max(maxPageMs,Date.now()-start);page++;
    } while(page<40);
    check('Every finding in grouped order',JSON.stringify(seen)===JSON.stringify(expected),{seen:seen.length,expected:expected.length});
    record.pages=page+1;record.maxPageMs=maxPageMs;
    while(!el('previousPageButton').disabled)click('previousPageButton');
    check('Review survives paging',cards()[0].querySelector('select').value==='intentional');
    const annotated=raw();check('Review in complete report',Object.values(annotated.annotations).includes('intentional'));
    check('Hidden raw cleared after review',el('output').textContent===''&&el('output').hidden);
    click('scanButton');click('cancelButton');await wait();
    const cancelled=raw();check('Cancellation cleanup',cancelled.observation.completion==='cancelled'&&!el('scanButton').disabled);
    click('scanButton');await wait();record.retry=raw();
    check('Retry complete and review reset',record.retry.diagnostics.status==='COMPLETE'&&Object.keys(record.retry.annotations).length===0);
    check('Page reset',/Page 1 of 31/.test(el('pageStatus').textContent));
    record.status='PASS';
  }catch(e){record.status='FAIL';record.error=String(e.stack||e);}
  const f=await require('uxp').storage.localFileSystem.getDataFolder();const out=await f.createFile('arid-pagination-native-20261027.json',{overwrite:false});await out.write(JSON.stringify(record,null,2));
  console.log(JSON.stringify({status:record.status,runs:record.runs,pages:record.pages,maxPageMs:record.maxPageMs,rawOpenParseHideMs:record.rawOpenParseHideMs,assertions:record.assertions.length,passed:record.assertions.filter(x=>x.pass).length,path:out.nativePath,error:record.error||null}));
})();
