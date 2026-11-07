# Submission closeout package audit — 19 October 2026

Branch `codex/validated-beta-20261017`; audit HEAD `d1b2b091e28d76af60e33c99261d01108e2000db`. This audit reads archives, receipts, staging and Git blobs. No package was installed/repackaged, no runtime/native evidence was changed, and no host lifecycle outcome is inferred.

## Current prepared CCX

**ARCHIVE_INTEGRITY_PASS**, with installation qualification separate. Exact target: `artifacts/ccx-0.2.1-7b544bd27f3b/com.unn0wn002.audio-preflight.beta_premierepro.ccx`, 14,797 bytes, SHA256 `8c3c27a8dc281db5e3f4fe0555dd7455a77e7860c5e63036b728b1596f8209e2`. Manifest identity is `com.unn0wn002.audio-preflight.beta`, version `0.2.1`, Premiere minimum `26.5.2`.

The existing verifier was executed with `-AllowManifestReformat` against `artifacts/audio-preflight-0.2.1-7b544bd27f3b-receipt.json`; the [new verification result](current-ccx-verification.json) retains the exact archive hash and seven-file results. Six files match receipt bytes exactly; UDT's manifest formatting differs but parsed manifest values match the authenticated staged manifest. Archive qualification is `NOT_ESTABLISHED_BY_PACKAGING` for native validation and `installationQualified=false`.

```powershell
./scripts/verify-package.ps1 -Package artifacts/ccx-0.2.1-7b544bd27f3b/com.unn0wn002.audio-preflight.beta_premierepro.ccx -Receipt artifacts/audio-preflight-0.2.1-7b544bd27f3b-receipt.json -Output reports/submission-closeout-20261019/current-ccx-verification.json -AllowManifestReformat
```

[Source/stage verification](package-source-stage-verification.json) independently compares all seven files to their frozen receipt hashes, implementation Git blob `64e75e382cfee9626bb743d949f412d290f180e1`, audit HEAD, working source and staged bytes. Every comparison passes. Working text uses the documented CRLF-to-LF normalization; stage and Git blob comparisons use exact bytes. Runtime identity remains `7b544bd27f3b12b11b21eb695187af4ed51be661385f2821657e73f23225f408`.

## Optional previous-package upgrade baseline

**ELIGIBLE_PACKAGE_ARTIFACT; UPGRADE_NOT_RUN.** A genuine retained earlier same-ID beta CCX exists at `artifacts/com.unn0wn002.audio-preflight.beta_premierepro.ccx`, 11,458 bytes, SHA256 `70726062905df989c2f59d11b007c41be562a85219906eace5fef37210c76a97`. Its manifest version is `0.2.0`, plugin ID `com.unn0wn002.audio-preflight.beta`, Premiere minimum `26.5.2`.

The [previous-package audit](previous-beta-ccx-audit.json) independently confirms the exact seven-file allowlist, all staged hashes and the receipt identity `29d17cda3a16f0637d812e733740fe32d3da4ca527a44d67bc676fb542e1d6d9` from `artifacts/audio-preflight-0.2.0-29d17cda3a16-receipt.json`. Six package files match that receipt exactly; manifest values match after formatting. The whole archive hash matches `reports/beta-20261004/package-verification.json`, verified on 4 October 2026. The legacy receipt lacks a Git source SHA and modern `receiptVersion`; it was inspected without modifying or upgrading its schema. This limits provenance to retained receipt/archive/staging hashes and the historical verification record.

The earlier CCX is suitable as an optional controlled **package** baseline for a 0.2.0-to-0.2.1 upgrade exercise. Archive inspection does not establish a previously installed version. The native operator must independently observe an installed 0.2.0 baseline, then install the exact prepared 0.2.1 CCX and record the actual upgrade outcome. Historical and current installation qualification remain unestablished by this audit. No developer ZIP is treated as an installed CCX. The other root-level prototype CCX has a different plugin ID and is excluded from in-place beta upgrade qualification.
