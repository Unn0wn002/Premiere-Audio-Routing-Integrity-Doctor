# Redaction note, 2026-11-07

A personal contact email address was removed from three archived handoff baseline copies before the repository may be made public. Only the address text was replaced with `[redacted-email]`; nothing else changed. These are copies of a shared handoff file; the address appears once in each, on a line about CutBridge S14B tester contact.

Because the files changed, hashes recorded earlier for them (for example in `verification.json` and `run__verification.json`) no longer match these copies. The pre-redaction hashes are listed so the originals, if the owner still holds them, can be re-verified.

| File | sha256 before | sha256 after |
|---|---|---|
| `reports/lifecycle-qualification-20261029/run-20261031-1049-package/baseline/handoff-before-package.md` | `7e6587f69ba8d694cfaa2d1c55a1a877d3de20441c1e7bb8d2577d4a3816c786` | `c8a593a6547626ad056ba729dfdbb536b7ec47b2adbc0b63cc8435693ffc4bc1` |
| `reports/lifecycle-qualification-20261029/run-20261101-1645-i01-preparation/baseline/before-owner-response/handoff-before.md` | `0ea98adffb93a01a6364496a38857801c52aae5dad2726eeaaf04d8c2fb2e550` | `71cf9331e75e84cf811bb621ef3f90ebd175c2ac9d2a2e8ed3a78286f6d6594c` |
| `reports/lifecycle-qualification-20261029/run-20261101-1645-i01-preparation/baseline/handoff-before.md` | `bb3032a5b07e033b0958671b48b577d9e8cf81e403ebf038fedef4e2527e5cdb` | `2b35a8adeb7459fd7d61e932f2ee1cf2335946c71c8ff6a2b1386b7344f23e65` |

Limits: the address remains in earlier Git history of this repository and in any remote copy of that history. Removing it from history would need a history rewrite and a force push, which needs the owner's explicit approval and was not done.
