# Observation / diagnostic schema 0.3.0 and report envelope 1.0.0

The historical `OBSERVATION_SCHEMA.md` describes 0.2.0. All identity, exact-tick serialization, error isolation and inventory rules remain. New consumers must recognize `cancelled` alongside `completed`, `partial` and `failed`.

- `scanActiveProject({ onProgress?, isCancelled? })` accepts optional synchronous callbacks. Progress events contain phase (`project`, `sequences`, `tracks`, `clips`, `finished`) and optional sequence/track labels, zero-based item index and total. Callbacks are UI control, not host evidence; do not throw from them.
- `durationMs` measures wall-clock elapsed time including cooperative yields; it is recorded on every returned outcome.
- `sequenceInventoryComplete` means the sequence list was acquired, not that every listed sequence was inspected. `scanTraversalComplete` is true only after traversal finishes without cancellation. Track/clip inventory flags never label unvisited items empty.
- Cancellation is checked before project acquisition and between sequence/track/clip inventory items. It cannot abort an in-flight getter/current clip inspection. Collected observations and their scoped errors remain; `ARID-U-CANCELLED` explains unvisited state. Locally proven mute/disable facts remain available. Whole-track ARID-001 still requires complete supporting inventories.
- No API mutates Premiere. Project identity is captured before traversal; observations remain sequential and non-atomic.
- Export/panel envelope is `{ reportVersion: '1.0.0', observation, diagnostics, annotations }`. Annotation keys are `<category>:<array index>` within this report only; values are `reviewed` or `intentional`. `unreviewed` deletes the annotation. They are reset by each new report and never change diagnostics or project state.
- JSON exports preserve exact tick strings, errors, capability Unknowns and annotation values. HTML escapes all dynamic content and, from 0.3.0, does NOT embed the raw evidence (a 1,024-clip project made a 61 MB report); the full evidence is in the JSON export. Exports capture a snapshot before opening the save dialog.

The October 2026 beta adds inventory denominators (`sequenceCount`, `audioTrackCount`, `clipCount`, `componentCount`, `paramCount`) and component/parameter completeness flags without changing the existing schema version. Counts are null on failed enumeration; zero means successfully empty. A true inventory flag establishes enumeration, not successful child reads.

Diagnostics add `status` (`COMPLETE`, `PARTIAL`, `UNKNOWN`) and `coverage`. `coverage.state` matches status. Project, sequences, tracks, clips and components each contain `{status, expected, observed, known, unknown}`; an unavailable denominator is null rather than zero. `failedReads` counts scoped diagnostic read failures. `capabilities` always records `sourceChannelMapping`, `outputBusTopology` and `playbackExportCorrectness` as `UNKNOWN` for this beta. These capabilities are excluded from bounded observation-completeness denominators.

`ARID-U-READ` contains an evidence `scope` plus known sequence/track/clip identities and occurrence/timing context. Component and parameter failures add zero-based `componentIndex` and `parameterIndex`. Locations describe observed scan-local occurrences; they do not imply persistent host identities when getters fail. Review findings remain intent-aware.

Changing the schema/version does not establish UXP host compatibility; qualify this candidate independently.
