const test = require('node:test');
const assert = require('node:assert/strict');
const { hostText, coverageText, locationText, createReport, toHTML } = require('../src/report');

test('coverage summary preserves unknown denominator and bounded complete scope', () => {
  const coverage = { state: 'PARTIAL',
    sequences: { status: 'COMPLETE', expected: 0, known: 0 },
    tracks: { status: 'UNKNOWN', expected: null, known: 0 },
    clips: { status: 'PARTIAL', expected: 3, known: 2 },
    components: { status: 'UNKNOWN', expected: null, known: 0 } };
  const summary = coverageText(coverage);
  assert.match(summary, /sequences: 0\/0 known \(COMPLETE\)/);
  assert.match(summary, /tracks: 0\/\? known \(UNKNOWN\)/);
  assert.match(summary, /clips: 2\/3 known \(PARTIAL\)/);
  assert.match(summary, /playback\/export correctness: UNKNOWN/);
  assert.match(coverageText(), /Coverage UNKNOWN/);
});

test('host and failed parameter locations remain visible in readable export', () => {
  const host = { name: 'Premiere Pro', version: '26.5.2', uxpVersion: '9.3', pluginVersion: '0.2.0', uiLocale: 'en_US' };
  assert.match(hostText(host), /26.5.2.*UXP 9.3.*plugin 0.2.0.*en_US/);
  assert.match(hostText(), /Unknown host/);
  assert.match(locationText({ sequence: 'S', trackIndex: 0, clipOccurrenceIndex: 1, componentIndex: 0, parameterIndex: 2 }), /clip #2.*component #1.*parameter #3/);
  const report = createReport({ completion: 'partial', project: { name: 'Demo' }, host }, { status: 'PARTIAL', risk: [], information: [], unknown: [] });
  const html = toHTML(report);
  assert.match(html, /Diagnostic status: PARTIAL/);
  assert.match(html, /Premiere Pro 26.5.2/);
  assert.match(html, /Coverage UNKNOWN/);
});
