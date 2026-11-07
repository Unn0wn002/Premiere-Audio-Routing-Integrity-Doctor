# Controlled Premiere 26.5 Host Fixtures

Historical table: original fixture specification. The 0.1.0 October 2 final continuation executed F01-F07/F10/F11; F08/F09 remained blocked. See `../../reports/host-20261001-214943/HOST_VALIDATION_REPORT_FINAL.md`. Current 0.2.1 requires a new run against a copy of the disposable project; exact status is in `../../docs/PROJECT_STATUS.md`. NOT RUN cells below describe the original specification, not current evidence.

Create one isolated Premiere Pro 26.5 project named `ARID_26_5_Fixtures.prproj` and create these sequences. Use generated tone or licensed local audio so the fixture can be redistributed safely.

| Fixture | Sequence setup | Track / clip state | Expected probe behavior | Host status |
|---|---|---|---|---|
| F01 Healthy Stereo | Stereo, 2 channels | A1 active; clip enabled | No risk finding; sequence config recorded | NOT RUN |
| F02 Hard Left | Stereo | Known panner hard-left | Component/param state captured; no broken-routing claim until param semantics validated | NOT RUN |
| F03 Hard Right | Stereo | Known panner hard-right | Same as F02 | NOT RUN |
| F04 Intentional Pan | Stereo | Deliberate creative hard pan, labeled as intentional | Must not classify as broken solely from pan | NOT RUN |
| F05 Muted Single Track | Stereo | Only non-empty audio track muted | ARID-001 Warning | NOT RUN |
| F06 Mixed Mute | Stereo | A1 muted, A2 active | ARID-002 Review on A1 | NOT RUN |
| F07 Disabled Clip | Stereo | A1 active; one clip disabled | ARID-003 Review | NOT RUN |
| F08 Mono | Mono, 1 channel | Normal mono content | Config only, not risk by itself | NOT RUN |
| F09 Multichannel | Multichannel, 4+ channels | Normal multichannel source | Config only, not risk by itself | NOT RUN |
| F10 Mapping Mismatch | Stereo or multichannel | Intentionally alter Modify > Audio Channels mapping | Probe must label source-channel mapping UNKNOWN unless a supported API proves it | NOT RUN |
| F11 Reopen Drift | Reproduction attempt based on public incident reports | Save, close, reopen; inspect panner/mapping | Record observed DOM state before/after; classify host bug only with reproducible evidence | NOT RUN |

For every fixture, record screen-observed Premiere state separately from probe JSON. Never treat the fixture name as proof of actual host state.
