# Premiere Audio Routing Integrity Doctor — project status

## Current status — 2026-11-06 (authoritative)

Reconciled 2026-11-06 from git (read-only), `PROJECT_LOG.md` (2026-11-02 entries), `reports/` and the 2026-11-04 audit `D:/Work/Projects/_docs/AUDIT_20261104/README.md`. Newest dated evidence wins; nothing below was re-run today. There is no root `CHANGELOG.md`.

**Version / candidate**
- Audio Preflight 0.3.0 (result view + EN/JA language switch), plugin id `com.unn0wn002.audio-preflight.beta`, on `main` at `c15136b` (merge of PR #8); local `main` equals `origin/main` (`git rev-parse main origin/main`, 2026-11-06).
- Packaged from `main` `3feb14b`: staging `38a3997af84e`, CCX sha256 `fb61d5de…dcea` (27,479 bytes) — `reports/installed-0.3.0-20261102/README.md`; packages in git-ignored `artifacts/`.
- Installed in the owner's normal profile (not clean); installed runtime matched the receipt at the 2026-11-04 audit (`_docs/AUDIT_20261104/Premiere-Audio-Routing-Integrity-Doctor-installed-identity.json`).

**Release state & approvals**
- Distribution NOT APPROVED (`AGENTS.md`, "Release gate"). Needs the host matrix, clean-profile I01–I06 and `docs/BETA_RELEASE_CHECKLIST.md` to pass. Install, restart, upgrade, uninstall, reinstall, profile creation, push and merge each need Aria's explicit approval.

**Completed gates (HISTORICAL_RECORDED, one Windows 11 machine, Premiere 26.5.2.5)**
- 0.3.0 package: PASS_ARCHIVE_INTEGRITY; normal-profile install + docked EN/JA smoke: PASS_BOUNDED_NATIVE — `reports/installed-0.3.0-20261102/`.
- 0.3.0 UI work: result view `reports/result-view-20261101/`, retests `reports/retest-20261102/`, language `reports/language-20261102/` (floating), grouped-span label fix `reports/span-label-20261102/` — each PASS_BOUNDED_NATIVE for the scope it records.
- 0.2.1 developer lifecycle P01, D01–D10: PASS_BOUNDED_NATIVE; 0.2.1 K01: PASS_ARCHIVE_INTEGRITY — `reports/lifecycle-qualification-20261029/` (bound to runtime `037571056922`; does not qualify 0.3.0).
- Multichannel 5.1 ARID-I01 read: PASS_BOUNDED_NATIVE recorded only on unmerged branch `docs/multichannel-evidence-20261102` (`b16579f`, `reports/multichannel-20261102/`), PR #9 open at the audit (`_docs/AUDIT_20261104/Premiere-Audio-Routing-Integrity-Doctor-github.json`); PR state today UNVERIFIED.

**Remaining gates**
- Clean-profile LQ-I01–I06 (install, restart, upgrade, uninstall, reinstall): NOT_RUN — no clean profile available (USER_STATED; `docs/LIFECYCLE_QUALIFICATION_PLAN_20261029.md`, `reports/installed-0.3.0-20261102/README.md`).
- Mix = Multichannel (custom count) and Mono masters natively: NOT_RUN (`reports/multichannel-20261102/README.md` on `b16579f`).
- Native-speaker review of Japanese wording: NOT_RUN (`docs/JAPANESE_WORDING_REVIEW.md`).
- Capability Unknowns (cannot be closed with public APIs found so far): source-channel mapping, output-bus topology, playback/export correctness (`docs/KNOWN_LIMITATIONS.md` items 2–5).

**Open defects**
- P2 (2026-11-04 audit): `scripts/verify-package.ps1:49` reads the staged manifest from the receipt's absolute `stagingDirectory`, still `C:\Users\unn0w\Downloads\02_Projects\…`; CCX verification with the original receipts now fails with `DirectoryNotFoundException` after the move to `D:\Work\Projects`. Packages are intact (rebased copies pass) — `_docs/AUDIT_20261104/Premiere-Audio-Routing-Integrity-Doctor-ccx-verification.log`, `…-ccx-rebased-verification.json`, `…-receipt-paths-rebased.json`.
- Unexplained first-launch "Compatible app required" during the 0.3.0 install: OBSERVED (transient), cause unknown (`reports/installed-0.3.0-20261102/README.md`).

**Latest automated test result**
- From the 2026-11-04 audit run (not re-run today): `node --test tests/*.test.js` 94/94 pass, 0 skipped; `node tests/evaluate-fixtures.js` 6/6; `node tests/check-syntax.js` pass — `_docs/AUDIT_20261104/Premiere-Audio-Routing-Integrity-Doctor/results.jsonl`, `check-1.log`–`check-3.log`. Exact-head CI on `c15136b` succeeded (`…-github.json`). Mocks only; not Premiere evidence.

**Where evidence lives**
- Native records: `reports/<topic>-YYYYMMDD/`. Packages/receipts: `artifacts/` (git-ignored). Audit: `D:/Work/Projects/_docs/AUDIT_20261104/`. History: `PROJECT_LOG.md`.
- Not on `main`: local unpushed branch `docs/docked-ja-evidence-20261102` and untracked `reports/docked-ja-20261102/` (Codex docked JA rounds; its R2 FAIL was fixed later, see `reports/span-label-20261102/`); untracked `codex-prompts/`.

**Status documents**
- `PROJECT_STATUS.md` (this file): current and authoritative.
- `docs/BETA_RELEASE_CHECKLIST.md` and `docs/LIFECYCLE_QUALIFICATION_PLAN_20261029.md`: a 0.3.0 current-candidate block was added at the top on 2026-11-07 (AU-01); the 0.2.1 text below it is historical.
- `docs/PROJECT_STATUS.md`: HISTORICAL (to 1 November 2026; leads with the 0.2.1 CCX checkpoint) — bannered.
- `docs/KNOWN_LIMITATIONS.md`: HISTORICAL banner (version references 0.2.0/0.2.1); limitations 2–6, 8–10, 12–13 still apply.
- `docs/TEST_MATRIX.md`: HISTORICAL banner (53-test suite, 0.2.1 status); static rule table still valid.
- `README.md`: version/packaging sentences updated 2026-11-06; its dated 29–31 October "current"/"latest" blocks are historical. `PROJECT_LOG.md`: running history, current to 2026-11-02 plus the 2026-11-06 entry.

**Next recommended step**
- Fix the `verify-package.ps1` relocation defect (explicit staging-directory override authenticated by the receipt hashes, keep original receipts), then with Aria's approval merge PR #9 and decide on the unpushed docked-JA evidence branch.

**Update 2026-11-07 (UI polish, source only):** the source now has the page lang attribute follows the language switch (U4). A CCX of this build was made and natively checked by development load (`evidence/native-20261107-polish/README.md`): sha256 `183378d1a6202ffc92d05ebbb1181a22002211c70ac2315308eacb94e07519fa`, staging `0a90b974...`. That CCX is NOT installed in the owner profile, so the installed package is still the earlier CCX recorded above; install the new CCX to match this source. Not approved for distribution.
