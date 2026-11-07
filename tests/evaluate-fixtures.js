const fs = require("node:fs");
const path = require("node:path");
const { diagnose } = require("../src/diagnostics");

const fixtures = JSON.parse(fs.readFileSync(path.join(__dirname, "../fixtures/synthetic_observations.json"), "utf8"));
let passed = 0;
for (const fixture of fixtures) {
  const actual = diagnose(fixture.report).risk.map((x) => x.ruleId).sort();
  const expected = [...fixture.expectedRiskRuleIds].sort();
  const ok = JSON.stringify(actual) === JSON.stringify(expected);
  console.log(`${ok ? "PASS" : "FAIL"} ${fixture.id}: expected=${expected.join(",") || "none"} actual=${actual.join(",") || "none"}`);
  if (ok) passed += 1;
}
console.log(`STATIC CONTRACT RESULT ${passed}/${fixtures.length} fixtures passed`);
if (passed !== fixtures.length) process.exitCode = 1;
