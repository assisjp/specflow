---
name: tdd
description: Test-driven development — the red-green loop, done so the tests are worth keeping. Use when building a feature or fixing a bug test-first, when the user mentions red-green-refactor, or when spec-execution reaches an agreed test seam.
---

# Test-Driven Development

TDD is the red → green loop. This skill is the reference that makes the loop produce tests worth keeping: what a good test is, where tests go, the anti-patterns to avoid, and the rules of the loop. Every section applies on every cycle — consult them during the loop, not after.

When exploring the code, read `CONTEXT.md` if it exists so test names and interface vocabulary match the project's domain language, and respect ADRs in the area you touch.

## What a good test is

A good test verifies **behaviour through a public interface**, not implementation details. The internals can change entirely; the test should not. It reads like a specification — `"user can checkout with a valid cart"` tells you exactly what capability exists — and it survives refactors because it does not care about internal structure.

The value of a test is the bugs it catches minus the refactors it obstructs. A test coupled to internals has that subtraction come out negative.

## Seams — where tests go

A **seam** is the public boundary you test at: the interface where you observe behaviour without reaching inside. Tests live at seams, never against internals.

**Test only at pre-agreed seams.** Before writing any test, write down the seams under test and confirm them with the user. No test at an unconfirmed seam. You cannot test everything — agreeing seams up front is how effort lands on the critical paths and the complex logic instead of on every trivial edge case. Prefer the fewest, highest seams; the ideal is one.

Ask: "What is the public interface here, and which seams should we test?"

## Anti-patterns

- **Implementation-coupled** — mocks internal collaborators, tests private methods, or verifies through a side channel (querying the database instead of using the interface). The tell: the test breaks on a refactor when behaviour did not change.
- **Tautological** — the assertion recomputes the expected value the same way the code does (`expect(add(a, b)).toBe(a + b)`, a hand-derived snapshot, a constant equal to itself). It passes by construction and can never disagree with the code. Expected values must come from an independent source of truth — a known-good literal, a worked example, the spec.
- **Horizontal slicing** — writing all the tests first, then all the implementation. Bulk tests verify *imagined* behaviour, go insensitive to real changes, and lock in test structure before the implementation is understood. Work in **vertical slices**: one test → one implementation → repeat, each test a tracer bullet responding to what the last cycle taught you.

## Rules of the loop

- **Red before green.** Write the failing test first, then only enough code to pass it. No speculative features, no anticipating future tests.
- **One slice at a time.** One seam, one test, one minimal implementation per cycle.
- **Refactoring is not part of the loop.** Cleanup happens outside the red → green cycle: running under `spec-execution`, its step 7 executes the in-diff cleanup at review; standalone, do a refactor pass over the code this loop touched after each green. Keep the loop tight; keep the diff honest.
