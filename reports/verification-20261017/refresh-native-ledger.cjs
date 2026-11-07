// Reconcile independently reviewed retained native exports. No host calls/runtime edits.
const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');
const base = __dirname;
const filename = path.join(base,'native-fixtures-current.json');
const ledger = JSON.parse(fs.readFileSync(filename,'utf8'));
const reviews = fs.readdirSync(base).filter(n => /^F\d{2}-current-independent-review\.json$/.test(n)).map(n => ({file:n,review:JSON.parse(fs.readFileSync(path.join(base,n),'utf8'))}));
const byId = new Map(reviews.map(r=>[r.review.fixture,r]));
const physicalRuns = item => item.review.observedCurrentEvidence.physicalRunIds || Array.from({length:item.review.observedCurrentEvidence.runs||0},(_,i)=>item.review.fixture+'-R'+(i+1));
const physicalSetup = item => item.review.observedCurrentEvidence.physicalSetupId || item.review.fixture;
for (const {review} of reviews) if (review.sourceGitSha !== ledger.sourceGitSha || review.runtimeIdentity !== ledger.runtimeIdentity) throw Error('Mixed runtime identities');
if (!ledger.initialOpeningAttempt) ledger.initialOpeningAttempt = {
  status:ledger.status,disposableProject:{...ledger.disposableProject},blocker:ledger.blocker,
  note:'Historical interruption before fixtures; recovered naturally and is not current evidence of host unavailability.'
};
ledger.updatedAt = new Date().toISOString();
const allFixturesReviewed = ledger.fixtures.every(f=>byId.has(f.id));
const f11Review = byId.get('F11')?.review;
const boundedReopenPass = f11Review?.observedCurrentEvidence.reopen?.result === 'BOUNDED_PASS';
const allFixtureAssertionsAgree = allFixturesReviewed && reviews.every(r=>r.review.expectedActual.agreement === true && !/BLOCKED|PENDING/.test(r.review.disposition));
ledger.status = allFixtureAssertionsAgree && boundedReopenPass ? 'NATIVE_FIXTURES_BOUNDED_PASS' : 'NATIVE_QUALIFICATION_IN_PROGRESS';
ledger.qualificationLimit = 'Current-host observable fixture assertions only. Unknown mapping/output/playback, unsampled API paths, overlap instrumentation and distribution installation are separate qualifications.';
ledger.blocker = null;
ledger.recoveredOpeningInterruption = {
  history:'initialOpeningAttempt',responsiveWorkspaceEstablished:true,
  evidence:['current-environment-and-process.json','F01-settings-before-current.png','F01-R1-scan-current.png'],
  method:'Natural host recovery followed by independently observed fixture UI; no force quit.'
};
ledger.disposableProject.workspaceReady = true;
ledger.disposableProject.fixtureScansExecuted = new Set(reviews.flatMap(physicalRuns)).size;
ledger.disposableProject.fixtureScanCountMeaning = 'Unique retained native report envelopes in the independently reviewed fixture repeat sets; any supplemental final panel execution is recorded separately and does not increase fixture condition denominators.';
if (f11Review?.evidenceParentGitSha) ledger.latestEvidenceParentGitSha = f11Review.evidenceParentGitSha;
ledger.disposableProject.fixtureAssertionsReviewed = reviews.length;
ledger.disposableProject.uniqueFixtureSetupsReviewed = new Set(reviews.filter(r=>(r.review.observedCurrentEvidence.runs||0)>0).map(physicalSetup)).size;
const runMethods=new Map();
for (const item of reviews) for (const id of physicalRuns(item)) {
  const method=item.review.observedCurrentEvidence.executionMethod||'NATIVE_PANEL_SCAN_AND_JSON_EXPORT';
  if (runMethods.has(id) && runMethods.get(id)!==method) throw Error('Conflicting physical run method');
  runMethods.set(id,method);
}
ledger.disposableProject.fixtureScanMethodCounts=Object.fromEntries([...new Set(runMethods.values())].map(method=>[method,[...runMethods.values()].filter(v=>v===method).length]));
ledger.disposableProject.fixtureStateSetupMutationsOccurred = true;
const projectFile = path.resolve(base,'../..',ledger.disposableProject.file);
if (fs.existsSync(projectFile)) {
  ledger.disposableProject.sha256After = crypto.createHash('sha256').update(fs.readFileSync(projectFile)).digest('hex');
  ledger.disposableProject.unchangedFileHash = ledger.disposableProject.sha256Before === ledger.disposableProject.sha256After;
  ledger.disposableProject.hashCheckedAt = ledger.updatedAt;
  ledger.disposableProject.hashMeaning = 'Disk hash only. Deliberate fixture setup edits occur in the disposable project; per-scan nonmutation is assessed from before/after UI and stable raw observations.';
}
ledger.disposableProject.inspectedNativeStateUnchanged = null;
if (boundedReopenPass) ledger.boundedNativeChecks.saveCloseReopen = {
  result:'BOUNDED_PASS',independentReview:'F11-current-independent-review.json',
  rawAnalysis:'F11-six-runs-independent-export-review.json',savedFileEvidence:'F11-project-file-snapshots.json',
  scope:'One deliberately authored compound state, three retained reads before save/close/reopen and three after; independently inspected UI and unchanged saved-file bytes. Earlier individual fixture layouts were not each reopened.'
};
const apiReviewFile=path.join(base,'current-native-api-review.json');
if (fs.existsSync(apiReviewFile)) {
  const api=JSON.parse(fs.readFileSync(apiReviewFile,'utf8'));
  if (api.checks.independentDescriptorValidationPass && api.checks.adapterCompatible && api.checks.documentedPromiseDirectMismatches.length===0) {
    ledger.boundedNativeChecks.apiThenableInstrumentation={
      result:'BOUNDED_PASS',evidence:['current-native-api-export.json','current-native-api-review.json'],
      reads:api.checks.totalCalls,thenables:api.checks.returnedThenFunction,direct:api.checks.returnedThenUndefined,mismatches:0,
      scope:'One representative static clip/source parameter path in current host; no broad host/version contract qualification.'
    };
    ledger.boundedNativeChecks.keyframeAndFrameRateNativeQualification={
      result:'BOUNDED_PASS',evidence:['current-native-api-export.json','current-native-api-review.json'],
      observed:'Finite positive FrameRate fields; exact TickTime tick strings; boolean nested Keyframe.value.value and position; direct empty keyframe lists on static clip/source params.',
      unexercised:api.unexercised,
      additionalScanEvidence:'All observed parameter start values in each independently reviewed fixture export satisfy strict supported nested value/position shape checks; exact counts are retained in the individual export analyses.'
    };
  }
}
for (const fixture of ledger.fixtures) {
  const item=byId.get(fixture.id);
  if (!item) { fixture.execution='PENDING'; continue; }
  const r=item.review;
  fixture.execution=r.disposition;
  fixture.actualSequenceScope=r.scope;
  fixture.actualObservation=r.expectedActual.actual;
  fixture.independentUiTruth=r.independentUiTruth;
  fixture.durationMs=r.observedCurrentEvidence.durationMs;
  fixture.repeatability=r.observedCurrentEvidence.repeatability;
  fixture.reopen=r.observedCurrentEvidence.reopen;
  fixture.inspectedStateUnchanged=r.observedCurrentEvidence.inspectedStateUnchanged;
  fixture.independentReview=item.file;
  fixture.rawExportFiles=r.observedCurrentEvidence.repeatability?.rawExports || (r.expectedActual.rawExport ? [r.expectedActual.rawExport] : []);
  fixture.rawReportReferences=r.observedCurrentEvidence.repeatability?.rawReportReferences || fixture.rawExportFiles.map(source=>({source,reportJsonPointer:''}));
  fixture.physicalRunIds=physicalRuns(item);
  fixture.physicalSetupId=physicalSetup(item);
  fixture.executionMethod=r.observedCurrentEvidence.executionMethod||'NATIVE_PANEL_SCAN_AND_JSON_EXPORT';
  fixture.observableFixtureMetrics=r.observableFixtureMetrics;
}
const evaluated=[...new Map(reviews.filter(r=>r.review.observableFixtureMetrics.observableEvaluatedFixtures>0).map(r=>[r.review.observableFixtureMetrics.evaluationGroupId||r.review.fixture,r])).values()];
const sum=key=>evaluated.reduce((n,r)=>n+(r.review.observableFixtureMetrics[key]||0),0);
ledger.fixtureMetrics={
  TP:evaluated.length?sum('TP'):null,FP:evaluated.length?sum('FP'):null,FN:evaluated.length?sum('FN'):null,
  observableEvaluatedFixtures:sum('observableEvaluatedFixtures'),positiveObservableRiskConditions:sum('positiveObservableRiskConditions'),
  fixtureAssertionIdsReviewed:reviews.length,uniquePhysicalSetupsObserved:ledger.disposableProject.uniqueFixtureSetupsReviewed,
  unknownOnlyFixtureAssertions:reviews.filter(r=>(r.review.observableFixtureMetrics.unknownFixtureConditions||0)>0).map(r=>r.review.fixture),
  preservationOnlyFixtureAssertions:reviews.filter(r=>(r.review.observableFixtureMetrics.preservationFixtureConditions||0)>0).map(r=>r.review.fixture),
  pendingUnassessedFixtures:ledger.fixtures.filter(f=>f.execution==='PENDING').length,
  blockedUnassessedFixtures:reviews.filter(r=>/BLOCKED/.test(r.review.disposition)).length,
  unknownCapabilities:['source-channel mapping','output-bus topology','playback correctness','export correctness'],
  productBoundaryUnknownFindingsPerCurrentFixtureScan:3,
  note:'Counts concern only independently established observable risk conditions in reviewed current fixtures. Repeated scans and multiple assertion IDs sharing one physical setup do not increase setup/condition denominators; physical run IDs are deduplicated. No playback/export or mapping correctness, user-intent error rate, or native sensitivity outside these conditions is claimed; pending/blocked/Unknown are separate.'
};
ledger.remainingSteps=[
  ...(ledger.fixtures.some(f=>f.execution==='PENDING')?['Complete independently verified current native cases: '+ledger.fixtures.filter(f=>f.execution==='PENDING').map(f=>f.id).join(', ')]:[]),
  ...(['F08','F09'].some(id=>!byId.get(id)?.review.expectedActual.agreement)?['Qualify remaining actual channel-layout case(s) '+['F08','F09'].filter(id=>!byId.get(id)?.review.expectedActual.agreement).join(', ')+' in Settings with enabled content; never infer configuration from fixture names']:[]),
  'Current representative API probe passed bounded direct/thenable and static value-shape contracts; animated nonempty keyframe lists and unsampled value variants remain unqualified',
  ...(!boundedReopenPass?['Run F11 save-close-reopen with independently verified before/after inspected state and raw export comparison']:[]),
  'Record native empty zero-sequence project and cancellation/overlap controls if feasible; six successfully empty track collections already observed in F01',
  'Keep CCX installation/restart/upgrade/uninstall/reinstall separate from archive verification and UDT loading; no distribution qualification yet'
];
fs.writeFileSync(filename,JSON.stringify(ledger,null,2)+'\n');
process.stdout.write(JSON.stringify({status:ledger.status,reviewed:reviews.map(r=>r.review.fixture),fixtureScansExecuted:ledger.disposableProject.fixtureScansExecuted,fixtureMetrics:ledger.fixtureMetrics},null,2)+'\n');
