# 0007 — Evidence is produced before review, not after

- **Status:** Accepted
- **Date:** 2026-07-24

## Context

`spec-execution` originally ran its automated review (`code-review`) before producing evidence, and only opened the PR after. That ordering meant the evidence artifact — the screenshot or real output proving the observable behaviour — was captured by the same agent that implemented the change, and no one else looked at it until the human at merge. The whole point of the evidence gate was never "an artifact exists"; it was "someone other than the implementer confirmed the behaviour". With review running first, that someone was only ever the human, at the exact moment the gate existed to pre-empt.

## Decision

`spec-execution` produces the evidence **before** the automated review. The evidence artifact therefore exists when `code-review` runs, and the review's Spec axis checks it against the acceptance criteria — a green test is not that proof. The human at merge becomes the *second* reader of the evidence, not the first.

## Alternatives considered

- **Keep review first; accept the human as the sole evidence reviewer.** Legitimate, but then the evidence gate is a *collection* step, not a *verification* step — and leaving that implicit is the failure ADR 0005 taught us to avoid. Verification before the human is strictly more reliable, and reliability is the top priority.
- **Add a second reviewer agent just for the evidence.** More machinery for what reordering already gives for free — `code-review`'s Spec axis is exactly the right checker, since matching behaviour to acceptance criteria is its job.

## Consequences

- **Easier:** the evidence is verified against the acceptance criteria before the human sees it; the gate does what it was named for.
- **Harder / accepted:** the app must be brought up (via the block's `Run` command) earlier in the sequence, before the diff is finalised for review. In practice the implementation is already complete by then, so the cost is ordering, not extra work.
- **Boundary set:** decisions of this nature (surprising without context, a real trade-off) go in an ADR, not a CHANGELOG entry — consistent with the `session-handoff` rule "state goes in the handoff, decisions go in an ADR".
