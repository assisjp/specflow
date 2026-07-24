# ADR format

An Architecture Decision Record captures one decision that was hard to reverse, surprising without context, and the result of a real trade-off. If a decision is missing any of those three, it does not need an ADR.

## Filename

`docs/adr/NNNN-short-kebab-title.md` — zero-padded sequence, e.g. `0007-inline-session-handoff-git-state.md`.

## Shape

```markdown
# NNNN — <Short title in the imperative or as a statement>

- **Status:** Accepted | Superseded by NNNN | Deprecated
- **Date:** YYYY-MM-DD

## Context

The forces at play. What made this decision necessary, and what constraints and
priorities bounded it. State the trade-off honestly — what you were balancing.

## Decision

The choice made, stated plainly. One or two sentences.

## Alternatives considered

The genuine options that were on the table and why each lost. An ADR with no
rejected alternatives is not recording a decision — it is recording a default.

## Consequences

What becomes easier and what becomes harder as a result. Include the costs you
are knowingly accepting, not just the benefits.
```

## Rules

- **One decision per ADR.** If you are describing two, write two.
- **Record the losers.** The value of an ADR is the reader understanding why the obvious-looking alternative was *not* taken.
- **State the cost.** Every real decision has one. An ADR that lists only upsides is marketing, not a record.
- **Immutable once accepted.** Do not edit a past ADR to reflect a new decision — write a new one and mark the old as `Superseded by NNNN`.
