# session-handoff

Compact the current session into an **ephemeral** handoff so another session or tool can pick the work up once and continue.

A handoff is session state, not a durable record. It is consumed once and dies — which is exactly why it is safe. Durable "where are we" documents that nobody is obliged to update rot, and rotten state is worse than no state: an agent reads it, trusts it, and acts on stale information. A handoff cannot rot because it is read once and discarded. See [ADR 0002](../adr/0002-ephemeral-session-handoff.md).

## When to use it

- You have to stop mid-work and hand off to a fresh session or another tool.
- The user asks for a handoff.
- Not for durable project state — that lives in ADRs, `CONTEXT.md`, the spec, and the tracker, each with its own owner.

## What it captures

- **Focus** of the next session (from your argument, if passed).
- **Git state** — branch, HEAD SHA, dirty files, unpushed commits. This pins the tree so the handoff's path references actually resolve on the receiving side.
- **Where things stand** — a few lines of state: what is half-done, what just broke.
- **Artifacts by reference** — spec, ADRs, files, by path or URL. Never copied — copies go stale.
- **Open threads** and **suggested skills** to run next.

## The rules that keep it honest

- **State, not decisions.** A decision that will matter months from now is an ADR, not a handoff line.
- **The *why* test.** If a line records a *why* rather than a *where things stand*, it is a decision disguised as state — promote it to an ADR now, do not carry it forward.
- **Writes to `.scratch/handoffs/`** and guarantees `.scratch/` is git-ignored first, so the next implementation run cannot sweep it into a PR.
- **Redacts secrets.**

## Related

- [domain-modeling](../engineering/domain-modeling.md) — where a promoted handoff item becomes an ADR.
