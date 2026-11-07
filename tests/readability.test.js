'use strict';
// Display-only colour tone for the result badge (test doubles; not host evidence).
const test = require('node:test');
const assert = require('node:assert');
const { resultTone } = require('../src/report');

test('failed scan is red regardless of report', () => {
  assert.strictEqual(resultTone(null, true), 'BAD');
  assert.strictEqual(resultTone({ diagnostics: { risk: [], status: 'COMPLETE' } }, true), 'BAD');
});

test('review findings are amber', () => {
  assert.strictEqual(resultTone({ diagnostics: { risk: [{}], status: 'COMPLETE' } }, false), 'WARN');
});

test('unknowns are never shown as green', () => {
  assert.strictEqual(resultTone({ diagnostics: { risk: [], unknown: [{}, {}, {}], status: 'COMPLETE' } }, false), 'INFO');
});

test('green only for a COMPLETE scan with no findings and no unknowns', () => {
  assert.strictEqual(resultTone({ diagnostics: { risk: [], unknown: [], status: 'COMPLETE' } }, false), 'OK');
  assert.strictEqual(resultTone({ diagnostics: { risk: [], status: 'PARTIAL' } }, false), 'INFO');
  assert.strictEqual(resultTone({ diagnostics: { risk: [], status: 'UNKNOWN' } }, false), 'INFO');
});

test('missing report or diagnostics is grey', () => {
  assert.strictEqual(resultTone(null, false), 'INFO');
  assert.strictEqual(resultTone({}, false), 'INFO');
});
