# to-spec

Turn a settled conversation — ideally a [`grill`](../productivity/grill.md) decision log — into a **spec** (a PRD) and publish it.

`to-spec` does **not** interview you. That is `grill`'s job, and it should already have happened. This skill is pure synthesis: it encodes what was decided, and refuses to decide more.

## When to use it

- Right after grilling reaches shared understanding.
- Any time you say "write the spec" or "turn this into a spec" over an already-settled discussion.

## How it runs

1. **Understands the code** — explores the repo, and uses the `CONTEXT.md` glossary vocabulary and respects existing ADRs.
2. **Sketches the test seams** — prefers existing, high seams; the ideal is one. This is the single point where it pauses to check with you.
3. **Writes and publishes** — fills a spec template (problem, solution, user stories, implementation decisions, testing decisions, out of scope) and publishes it: a GitHub/Linear issue if the project has a tracker, otherwise a committed `docs/specs/<slug>.md`. A spec is durable, so the local form is versioned, never left in `.scratch/` (ADR 0006).

## Traceability

Before publishing, `to-spec` re-reads the spec and checks every claim traces to a decision, a user statement, or a codebase fact. Anything tracing to none of those is invented — it gets cut or turned into an open question. A spec encodes what was decided; it does not quietly add scope.

It then names the next step, since it is the only thing that can judge the size of what it just wrote: one reviewable PR's worth goes to `spec-execution`, anything plainly larger goes to `to-tickets` first.

## Related

- [grill](../productivity/grill.md) — produces the decision log this skill consumes.
- [domain-modeling](./domain-modeling.md) — owns the glossary the spec speaks in.
