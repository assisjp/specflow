# code-review

Review the diff since a fixed point along **two independent axes**, run as parallel sub-agents and reported side by side.

- **Standards** — does the code follow the repo's documented standards and avoid known code smells?
- **Spec** — does the code faithfully implement what the originating issue/spec asked for?

A change can pass one and fail the other — code that follows every convention but builds the wrong thing, or does exactly what was asked while breaking conventions. Keeping the axes separate stops one from masking the other.

## When to use it

- Reviewing a branch, a PR, or work-in-progress changes.
- "Review since `<X>`" for any commit, branch, tag, or merge-base.
- Invoked by [spec-execution](./spec-execution.md) before the PR.

## How it runs

1. **Pin the fixed point** — a SHA, branch, tag, `main`, `HEAD~5`. Confirms it resolves and the diff is non-empty before spawning anything.
2. **Find the spec** — a path the caller passed (`spec-execution` passes the exact spec/ticket), commit issue references, or a spec under `docs/specs/` or a ticket under `docs/tickets/<slug>/` (in no-tracker mode the ticket is the per-PR spec).
3. **Assemble standards** — the repo's documented standards, plus a fixed **smell baseline** (Fowler's code smells) that applies even when the repo documents nothing. The repo always overrides; baseline smells are always judgement calls; anything tooling enforces is skipped.
4. **Two parallel sub-agents** — Standards and Spec, each with its own brief, so their contexts stay clean.
5. **Aggregate** — both reports under separate headings, never merged or reranked.

## A finding is a hypothesis

Especially when consumed by `spec-execution`: an automated finding is confident and sometimes wrong. Confirm each against the code before acting — fixing a phantom bug costs a whole round.

## Related

- [spec-execution](./spec-execution.md) — runs `code-review` on the final diff and reconciles the findings.
- [tdd](./tdd.md) — the refactor step this review calls for lives there.
