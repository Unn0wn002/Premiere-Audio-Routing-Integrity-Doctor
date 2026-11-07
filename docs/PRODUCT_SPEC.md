# Product Specification - Technical Probe

## Product hypothesis

A read-only Premiere preflight can reduce delivery risk by exposing supported audio state, locating suspicious states, explaining why they matter, and explicitly declaring what it cannot verify.

## Current gate

See `PROJECT_STATUS.md` for the exact current gate, source and package identity.

Audio Preflight 0.2.1 is a focused read-only beta candidate; it is not qualified for distribution or sale. The first release is a private beta for Windows / Premiere 26.5.2. The old 0.1.0 has partial host evidence; this candidate requires a fresh run. Working target is 22 October 2026; official submission deadline is unconfirmed.

## Scope

In scope for the probe:
- sequence audio configuration;
- audio-track enumeration and mute state;
- audio clip enumeration and disabled state;
- audio component-chain and parameter inventory;
- evidence-oriented reporting with confidence state;
- explicit Unknown results for unsupported topology.
- grouped findings, scan-local review annotations, progress/cancellation, and local JSON/HTML export.

Out of scope:
- automatic routing repair;
- mixer replacement;
- mastering, synchronization, transcription, cleanup, enhancement;
- private or undocumented Premiere APIs.

## Safety contract

The prototype calls only documented getters/read operations in its scan path. It does not call `setMute`, action creation, project transactions, or any setter/remapping API.

## Output model

Each diagnosis contains:
- rule id;
- severity;
- confidence;
- affected sequence/track/clip;
- observed state;
- why it may matter;
- remediation/manual verification guidance.

## Required host gate

Before technical validation, execute the controlled Premiere 26.5 fixture matrix and measure observed true positives, false positives, false negatives, and Unknowns. The current static tests do not substitute for this gate.
