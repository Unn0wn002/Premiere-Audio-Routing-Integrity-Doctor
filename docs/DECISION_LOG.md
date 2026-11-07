# Decision Log

## 2026-09-23 - D001 - Initialize isolated Project 37 workspace

Decision: create a new isolated canonical folder because no existing Project 37 development folder or installed GitHub repository was found in live verification.

Status: VERIFIED for Drive folder existence; GitHub remote absent in accessible installed repositories.

## 2026-09-23 - D002 - Read-only getter-only probe

Decision: the first prototype must use supported getter/read APIs only. No setter/action/transaction calls are permitted in the scan path.

Reason: safety and diagnostic validity precede remediation.

## 2026-09-23 - D003 - Do not diagnose pan/balance yet

Decision: inventory generic component/parameter state but do not enable a pan/balance defect rule until exact host semantics are measured in Premiere 26.5.

Reason: display names can be localized, effect graphs vary, and undocumented assumptions would create false confidence.

## 2026-09-23 - D004 - Provisional product boundary

Decision: treat complete routing topology as UNKNOWN until proven. Current evidence supports an observable-state preflight more strongly than a full routing-graph doctor.

Gate implication: provisional recommendation is NARROW, pending host validation.
