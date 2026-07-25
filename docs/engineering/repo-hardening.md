# repo-hardening

Prepare a repository for agent work: install the **deterministic verification layer** — formatter, linter, types, tests, git hooks, CI — without breaking what already exists, and record the canonical commands where agents read them.

The core bet of specflow: an error a machine can catch, a model should never have to. Every check `repo-hardening` installs is an agent cycle and a human review saved. It attacks the top three priorities — reliability, cost, effort — at once.

## When to use it

- A fresh repo that needs its checks set up.
- An existing repo with no verification, or partial config you want standardised.
- Before `spec-execution` — that skill refuses to build without the verification block this installs.

Idempotent — re-run any time to re-verify and correct drift.

## How it runs

1. **Inventory** (writes nothing) — detects the ecosystem, finds existing formatter/linter/types/tests/hooks/CI, and runs what it finds to measure health.
2. **Report & decide** — shows what is kept, what is failing, what is missing; waits for your confirmation.
3. **Install what's missing** — ecosystem defaults, in order: formatter, linter, types, hooks, CI. The hook is bypassable; CI is the real gate; both must exist.
4. **Don't break an old repo** — formatter applied in one isolated commit; linter/types baselined or scoped; a slow suite recorded, not masked.
5. **Write to the agent-context file** (`AGENTS.md` or `CLAUDE.md`, whichever the harness auto-loads; ADR 0003) — the canonical commands and prohibitions, only between its own markers.
6. **Verify** — the "all" command passes, the hook fires, CI and hook run the same commands, and (if not `n/a`) the `Run` command actually brings the app up — so the evidence gate's contract is tested here, not discovered broken mid-`spec-execution`. The hardening is then **committed as one isolated commit** — left loose it would ride into the next feature PR and break its closed scope.

## Ownership

`repo-hardening` owns the `<!-- repo-hardening:start -->` / `:end -->` block in the agent-context file and writes nowhere else in it. It never touches `CONTEXT.md` or ADRs — those belong to `domain-modeling`.

## Related

- [spec-execution](./spec-execution.md) — reads the verification block this skill writes; refuses to run without it.
