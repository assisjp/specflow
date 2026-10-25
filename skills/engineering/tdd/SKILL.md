---
name: tdd
description: Test-driven development — the red-green loop, done so the tests are worth keeping. Use when building a feature or fixing a bug test-first, when the user mentions red-green-refactor, or when spec-execution reaches an agreed test seam.
---

# Test-Driven Development

Use red → green → refactor to build confidence in behavior, not to maximize test count. Apply the repository's execution and verification policy; accepted testing decisions do not need repeated approval.

## Choose a useful boundary

Prefer stable public behavior over private structure. Reuse existing tests and seams, and the glossary/ADRs relevant to the change. Infer conventional seams when the task is clear; ask only when the choice materially changes scope, cost or the promised behavior. There is no universal ideal of one highest seam.

Use the smallest combination that covers the risk: a focused rule test, a repository integration test, an API or workflow test. Persisted state is an observable contract for a repository. Real database/transaction/lock behavior needs real integration evidence when that is the claim. Mock external boundaries for isolation where useful, but do not claim a mocked dependency proves its implementation.

## Tests worth keeping

A test's value is the bugs it catches minus the refactors it obstructs. Expected results should come from an independent source: a known example, a specified rule or an accepted contract. Avoid assertions that duplicate the implementation, internal call choreography without a contract, and snapshots maintained without examining their meaning. Exact output/object assertions are valid when exact shape is the contract.

Existing tests may evolve when the requested behavior changes or the old test was incorrect or coupled to internals. Explain why and retain coverage of invariants that remain required. Do not change expectations, delete tests or add ignores merely to hide a regression. Do not add new tests for documentation or trivial changes already adequately covered unless a concrete risk warrants them.

## The loop

1. Select one behavioral increment and a test capable of failing for the intended reason.
2. Observe red in the authorized environment; distinguish a meaningful failing assertion from an import/setup/infrastructure failure. If execution is unavailable, say the red was not observed.
3. Implement enough to satisfy that behavior; avoid speculative features or anticipatory abstractions.
4. Observe green, then simplify touched code under those tests where useful. Repeat with the next increment.

An expected red is not a repair failure. For unexpected failures, diagnose before retrying and change a relevant hypothesis/input; do not repeat an unchanged failing command without new evidence. Report repeated lack of progress and continue independent work. Explicit project resource/attempt budgets still apply.

Prefer short vertical feedback cycles over a large suite written against imagined internals. This does not forbid agreed examples or parameterized cases prepared together. Reuse passing checks for unchanged inputs; broaden only for affected consumers or concrete concerns. Inside `spec-execution`, pass the evidence and remaining limitations to its review step.
