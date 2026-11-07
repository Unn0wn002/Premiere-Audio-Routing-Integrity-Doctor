> **Historical status document (last updated 2026-10-18; date from git, the file has no update date).** For current status see [PROJECT_STATUS.md](../PROJECT_STATUS.md). Content below is kept unchanged for history; known outdated: the 53-test suite and 0.2.1 status (94/94 tests on 0.3.0 at the 2026-11-04 audit).

# Test Matrix

## Static rule tests

These tests validate deterministic rule behavior against synthetic observations. They do not validate the Premiere API or acoustic output.

| Case | Expected | Status before execution |
|---|---|---|
| Healthy stereo | No risk finding | PASS - STATICALLY VERIFIED |
| All non-empty tracks muted | ARID-001 | PASS - STATICALLY VERIFIED |
| Mixed mute state | ARID-002 | PASS - STATICALLY VERIFIED |
| Disabled clip | ARID-003 | PASS - STATICALLY VERIFIED |
| Mono sequence | Informational only | PASS - STATICALLY VERIFIED |
| Multichannel sequence | Informational only | PASS - STATICALLY VERIFIED |
| Unknown topology | Unknown only | PASS - STATICALLY VERIFIED |

## Premiere 26.5 host matrix

See `fixtures/premiere/README.md` for controlled host fixtures.

Required host record fields:
- Premiere exact version/build;
- OS version;
- fixture ID;
- source asset type/channel layout;
- sequence type/channel count;
- track mute state;
- pan/balance state;
- expected observation/diagnosis;
- actual probe output;
- manual Premiere observation;
- TP/FP/FN/Unknown classification;
- scan runtime;
- reopen/export notes.

Historical 0.1.0 status: PARTIAL host qualification on Premiere 26.5.2 Build 5. F01-F07/F10/F11 ran; F08/F09 remained blocked. See `../reports/host-20261001-214943/HOST_VALIDATION_REPORT_FINAL.md` for precise assertion limits.

Current 0.2.1 status and exact native run: `PROJECT_STATUS.md`. The changed adapter, diagnostics, panel, exports and cancellation must be exercised against the packaged candidate; prior results do not qualify it. Additional acceptance matrix is in `BETA_RELEASE_CHECKLIST.md`.

## Current mocked adapter and diagnostic regressions

The 53-test suite includes direct synchronous returns, Promise resolution/rejection, failed project/sequence/track/clip/component/parameter reads, invalid/missing host and value shapes, successful empty projects/tracks, failed collection enumeration, count mismatches, partial source/component data and retained independent findings. FrameRate, exact TickTime strings and nested Keyframe values/positions are checked. These tests exercise the adapter with stubs; they do not execute UXP or establish native value-shape agreement.

Coverage regressions verify null unknown denominators, explicit Partial/Unknown causes, no aggregate ARID-001 from incomplete inventories and traceable component/parameter locations. Panel/export regressions verify overlap prevention, recovery, annotations, HTML escaping and visible host/coverage summaries. Packaging regressions verify allowlist, reproducibility, tamper rejection and explicit manifest-reformat handling. Full results: `reports/verification-20261017/static-checks.json`.
