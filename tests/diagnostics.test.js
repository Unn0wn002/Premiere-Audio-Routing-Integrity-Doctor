const test = require("node:test");
const assert = require("node:assert/strict");
const { diagnose } = require("../src/diagnostics");

function report(sequence) {
  return { project: { name: "test" }, unknowns: [], sequences: [sequence] };
}

function sequence(tracks, type = 1, count = 2) {
  return { name: "S1", settings: { audioChannelType: type, audioChannelCount: count }, audioTracks: tracks };
}

function track(name, muted, clips) {
  return { name, index: 0, muted, clips };
}

test("healthy active audio does not create a risk finding", () => {
  const result = diagnose(report(sequence([track("A1", false, [{ name: "x", disabled: false }])])));
  assert.equal(result.risk.length, 0);
});

test("all non-empty tracks muted emits ARID-001 only once", () => {
  const result = diagnose(report(sequence([
    track("A1", true, [{ name: "x", disabled: false }]),
    track("A2", true, [{ name: "y", disabled: false }])
  ])));
  assert.deepEqual(result.risk.map((x) => x.ruleId), ["ARID-001"]);
});

test("mixed mute state emits per-track review", () => {
  const result = diagnose(report(sequence([
    track("A1", true, [{ name: "x", disabled: false }]),
    track("A2", false, [{ name: "y", disabled: false }])
  ])));
  assert.deepEqual(result.risk.map((x) => x.ruleId), ["ARID-002"]);
});

test("disabled audio clip emits ARID-003", () => {
  const result = diagnose(report(sequence([track("A1", false, [{ name: "x", disabled: true }])])));
  assert.deepEqual(result.risk.map((x) => x.ruleId), ["ARID-003"]);
});

test("mono and multichannel are informational, not risk classifications", () => {
  for (const [type, count] of [[0, 1], [3, 4]]) {
    const result = diagnose(report(sequence([track("A1", false, [{ name: "x", disabled: false }])], type, count)));
    assert.equal(result.risk.length, 0);
    assert.equal(result.information.length, 1);
  }
});

test("unverifiable routing facts are emitted only as Unknown", () => {
  const input = report(sequence([]));
  input.unknowns = ["Output bus topology not observable."];
  const result = diagnose(input);
  assert.equal(result.unknown.length, 1);
  assert.equal(result.unknown[0].severity, "Unknown");
  assert.equal(result.unknown[0].confidence, "UNKNOWN_CANNOT_VERIFY");
});
