# Static Validation Report

Historical September 23 record. See `PROJECT_STATUS.md` and `../reports/verification-20261017/static-checks.json` for the 0.2.1 candidate. October 2 partial host evidence is in `../reports/host-20261001-214943/HOST_VALIDATION_REPORT_FINAL.md`. Neither this historical static record nor the older native run qualifies changed 0.2.1 host behavior.

Date: 2026-09-23
Status: STATICALLY VERIFIED
Premiere host execution: NOT RUN

## Executed checks

- `npm test`: 6 passed, 0 failed.
- `npm run test:fixtures`: 6 of 6 synthetic fixture contracts passed.
- `npm run check:syntax`: PASS for `index.js`, `src/premiereAdapter.js`, and `src/diagnostics.js`.
- Read-only scan review: no Premiere setter, action creation, transaction, save, import, or project mutation call is used in the scan path.

## What this proves

- The rule engine behaves as specified for the synthetic contracts.
- Healthy mono/stereo/multichannel configurations used by the static fixtures are not labeled broken solely from channel type.
- Muted-track and disabled-clip rules produce the expected review/warning output.
- Explicit Unknown findings remain separate from risk findings.
- JavaScript files parse successfully in Node's syntax checker.

## What this does not prove

- That Premiere Pro 26.5 successfully loads the plugin.
- That every documented API behaves as assumed in the target host/build.
- That panner/balance parameters have stable identifiers or value semantics.
- That source-channel mapping or output-bus topology is observable.
- Any empirical TP/FP/FN rate in Premiere.

Host TP/FP/FN/Unknown metrics remain BLOCKED until the controlled Premiere 26.5 matrix is executed.
