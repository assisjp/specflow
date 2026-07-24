# spec-execution

Execute **one** written spec — a `.md` file, PRD, or GitHub issue — into **one** reviewable PR, with closed scope and attached evidence.

This is where specflow spends its reliability budget. The agent delivers a single verified diff, scope closed, evidence attached, and human review happens **once** on the final diff — instead of granular reviews that multiply rounds and cost.

## When to use it

- The user asks to implement a spec, an issue, a ticket, or an already-written plan.
- Not for *writing* the spec — that is `grill` → `to-spec`.

## How it runs

1. **Contract** — reads the canonical commands from `AGENTS.md`. If the block is missing, it **stops** and points you at `repo-hardening`. No improvised commands.
2. **Read before writing** — the whole spec, the files it names, their imports, `CONTEXT.md`. Result-changing ambiguity stops and asks; minor ambiguity is decided and recorded.
3. **Closed scope** — implements exactly the spec; adjacent smells, refactors, and unrelated bugs are noted, not touched.
4. **Implement** — calls [tdd](./tdd.md) at the agreed seams; tests in the same work, never separate.
5. **Verify** — runs the canonical commands within the `AGENTS.md` attempt limit.
6. **Automated review** — calls [code-review](./code-review.md); each finding is a hypothesis confirmed against the code before acting.
7. **One diff, one concern** — mechanical split from behavioural; a >~400-line diff flagged for a cut.
8. **Evidence** — an observable change is brought up for real and captured; a green test is not proof the feature appears.
9. **Deliver** — commit, push, open a PR referencing the issue. Never merges — the merge is the human's.
10. **Report** — a fixed-format summary of scope, decisions, checks, evidence, and PR link.

## The second-failure rule

A spec that comes back twice is a specification defect, not an execution one. `spec-execution` refuses to reimplement — it names the ambiguous or non-verifiable part and sends it back to a fresh `grill` session.

## Related

- [repo-hardening](./repo-hardening.md) — provides the `AGENTS.md` contract this skill requires.
- [tdd](./tdd.md) and [code-review](./code-review.md) — delegated to for the loop and the review.
