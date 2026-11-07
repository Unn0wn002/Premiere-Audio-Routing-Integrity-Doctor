// Independently validate native exports; preserve originals and identical copies.
const fs=require('node:fs'), path=require('node:path'), crypto=require('node:crypto'), assert=require('node:assert/strict');
const {toHTML,findings}=require('../../src/report.js');
const {diagnose}=require('../../src/diagnostics.js');
const [label,stem,expectedDuration]=process.argv.slice(2);
assert.ok(['narrow','wide'].includes(label));
assert.match(stem,/^audio-preflight-[0-9TZ-]+$/);
const originalDir=path.resolve(__dirname,'../panel-layout-20261027');
const jsonPath=path.join(originalDir,stem+'.json'), htmlPath=path.join(originalDir,stem+'.html');
const jsonBytes=fs.readFileSync(jsonPath), htmlBytes=fs.readFileSync(htmlPath);
const report=JSON.parse(jsonBytes.toString('utf8')), html=htmlBytes.toString('utf8');
const raw=html.match(/<h2>Raw evidence<\/h2><pre>([\s\S]*?)<\/pre>/);assert.ok(raw);
const entities={amp:'&',lt:'<',gt:'>',quot:'"','#39':"'"};
assert.deepEqual(JSON.parse(raw[1].replace(/&(amp|lt|gt|quot|#39);/g,(_,e)=>entities[e])),report);
assert.equal(html,toHTML(report));assert.deepEqual(report.diagnostics,diagnose(report.observation));
assert.equal(report.observation.durationMs,Number(expectedDuration));
assert.equal(report.observation.completion,'completed');assert.equal(report.diagnostics.status,'COMPLETE');
assert.equal(report.diagnostics.coverage.failedReads,0);assert.equal(report.diagnostics.risk.length,0);assert.equal(report.diagnostics.unknown.length,3);
for(const [scope,n] of Object.entries({sequences:4,tracks:15,clips:7,components:18})) {
  assert.equal(report.diagnostics.coverage[scope].expected,n);assert.equal(report.diagnostics.coverage[scope].known,n);assert.equal(report.diagnostics.coverage[scope].status,'COMPLETE');
}
const articles=(html.match(/<article>/g)||[]).length;assert.equal(articles,findings(report).length);assert.equal(articles,7);
const sha=b=>crypto.createHash('sha256').update(b).digest('hex');
const files=[['json',jsonBytes,jsonPath],['html',htmlBytes,htmlPath]].map(([ext,bytes,original])=>{
  const file=`${label}-scan.${ext}`, target=path.join(__dirname,file);
  if(fs.existsSync(target))assert.equal(sha(fs.readFileSync(target)),sha(bytes));else fs.writeFileSync(target,bytes,{flag:'wx'});
  return {file,original,sha256:sha(bytes),bytes:bytes.length,originalPreserved:true,copyByteIdentical:true};
});
const result={verifiedAt:new Date().toISOString(),status:'VERIFIED_THIS_SESSION_BOUNDED_NATIVE_EXPORT_PAIR',label,runtimeIdentity:'03757105692238f9fdc51a17a39aa4a3c6021ca08a6e8c799aa51d43db8d29a4',durationMs:report.observation.durationMs,coverage:report.diagnostics.coverage,reviewFindings:0,capabilityUnknowns:3,embeddedJSONEquals:true,rendererEquals:true,diagnosticsReproduce:true,findingArticles:articles,files,executionProvenance:label==='narrow'?'Assistant-triggered scan/native export dialogs; JSON saved through automation, final HTML Save clicked by user after focus disagreement':'See native wide trial record for scan/dialog/final-Save provenance',qualification:'Bounded panel/export-content evidence; no routing correctness, customer installation or full lifecycle qualification'};
fs.writeFileSync(path.join(__dirname,label+'-pair-verification.json'),JSON.stringify(result,null,2)+'\n');
console.log(JSON.stringify({status:result.status,label,durationMs:result.durationMs,embeddedJSONEquals:true,rendererEquals:true,diagnosticsReproduce:true,files},null,2));
