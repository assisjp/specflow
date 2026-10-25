# tdd

Use red, green and useful refactoring to test behavior with independent expectations.

## When to use it

Use when test-first work is requested or useful for a meaningful behavioral increment.

## Behavior

- Reuse established seams and decisions. Choose focused unit, repository, API or workflow coverage according to risk; there is no ideal of one highest seam.
- Mocks can isolate external boundaries, but do not prove database locking, transactions or other semantics they replace. Persisted state and exact output can be legitimate public contracts.
- Existing tests may change with accepted behavior or correction of an invalid/coupled test; explain why and retain required invariants. Never weaken assertions to conceal regressions.
- Observe the intended red, implement the increment, observe green and simplify touched code. Report when the environment prevents observing a result.
- Expected reds are not failed repair attempts. Diagnose unexpected failures; reuse green checks for unchanged inputs. Do not invent tests for trivial changes already adequately verified.

## Source

The [skill instructions](../../skills/engineering/tdd/SKILL.md) define the full contract. Repository policy and the user's authorization take precedence over the defaults.
