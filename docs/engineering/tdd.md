# tdd

Test-driven development — the red → green loop, done so the tests are worth keeping.

Passing tests are cheap; *good* tests are the point. `tdd` is the reference that keeps the loop producing tests that catch bugs without obstructing refactors: what a good test is, where tests go, the anti-patterns, and the rules of the loop.

## When to use it

- Building a feature or fixing a bug test-first.
- The user mentions red-green-refactor or integration tests.
- Invoked by [spec-execution](./spec-execution.md) at an agreed seam.

## What it enforces

- **Behaviour through public interfaces**, never internals — a good test reads like a spec and survives refactors.
- **Seams, agreed up front.** A seam is the public boundary you observe behaviour at. Tests live only at pre-agreed seams; the ideal is one. You cannot test everything, so effort lands on the critical paths.
- **The anti-patterns to avoid** — implementation-coupled tests, tautological assertions (expected values must come from an independent source of truth), and horizontal slicing (write all tests then all code). Work in vertical slices instead: one test → one implementation → repeat.
- **The rules of the loop** — red before green; one slice at a time; refactoring is not part of the loop (it belongs to review).

## Related

- [spec-execution](./spec-execution.md) — drives `tdd` at the spec's seams.
- [code-review](./code-review.md) — where the refactor step lives.
