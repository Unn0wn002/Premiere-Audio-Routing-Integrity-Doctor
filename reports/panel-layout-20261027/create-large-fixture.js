// SETUP ONLY: explicit mutations confined to a new disposable test project.
// Never packaged or called by the read-only scanner.
// Adobe Project.saveAs/lockedAccess/executeTransaction and Sequence.createCloneAction.
(async function () {
  const record = globalThis.aridLargeFixtureRecord = { startedAt: new Date().toISOString(), status: 'BUILDING', transactions: [] };
  try {
    const p = await require('premierepro').Project.getActiveProject();
    const root = 'C:\\Users\\unn0w\\Downloads\\02_Projects\\Premiere-Audio-Routing-Integrity-Doctor\\reports\\panel-layout-20261027\\';
    // The native host returns Windows extended-length paths with a \\?\ prefix.
    const normalizedPath = value => value.startsWith('\\\\?\\') ? value.slice(4) : value;
    if (!p || normalizedPath(p.path) !== root + 'Layout_Test_Copy.prproj') throw Error('Unexpected source project; no mutations permitted');
    if (document.getElementById('scanButton').disabled) throw Error('Panel busy');
    record.source = p.path;
    const before = await p.getSequences();
    if (before.length !== 4) throw Error('Unexpected source sequence count');
    record.initialSequences = before.length;
    record.target = root + 'Large_Inventory_Test.prproj';
    if (!await p.saveAs(record.target)) throw Error('saveAs failed');
    // saveAs updates this Project handle in place (documented Adobe behavior).
    if (normalizedPath(p.path) !== record.target || normalizedPath((await require('premierepro').Project.getActiveProject()).path) !== record.target) throw Error('New disposable project not active');
    const base = (await p.getSequences())[0];
    for (let offset = 0; offset < 252; offset += 12) {
      let success = false;
      p.lockedAccess(() => {
        success = p.executeTransaction(compound => {
          for (let n = 0; n < Math.min(12, 252 - offset); n++) compound.addAction(base.createCloneAction());
        }, 'Create disposable audio scanner stress fixture');
      });
      record.transactions.push({ offset, success });
      if (!success) throw Error('Fixture clone transaction failed at ' + offset);
      await new Promise(resolve => setTimeout(resolve, 0));
    }
    record.finalSequences = (await p.getSequences()).length;
    if (record.finalSequences !== 256) throw Error('Unexpected final sequence count');
    record.saved = await p.save();
    if (!record.saved) throw Error('Disposable fixture save failed');
    record.status = 'READY';
  } catch (error) { record.status = 'BLOCKED'; record.error = error.stack || String(error); }
  record.finishedAt = new Date().toISOString();
  console.log('LARGE_FIXTURE ' + JSON.stringify(record));
})()
