# pr-maintenance

Reassess, update, or monitor an existing PR against its current base, checks, reviews, and architecture. It distinguishes a PR that is current from one requiring rework or one that is superseded.

## When to use it

Use `$pr-maintenance` to babysit, monitor, rebase, modernize, refresh, or decide whether a PR is still worth landing. It does not create or merge PRs.

## Behavior

- Records the live head/base and does not treat old reviews/checks as evidence for a newer candidate.
- Chooses `CURRENT`, `REWORK`, or `SUPERSEDED` based on the goal and current architecture, not branch age or conflict status.
- Updates only when authorized, with a safe observed-head check and affected verification/review.
- Monitors only through an authorized supported mechanism; notifications are rechecked facts, not merge approval.

## Related

- [takeover](./takeover.md) — recover inherited work.
- [file-pr](./file-pr.md) — publish an authorized candidate.
- [review-loop](./review-loop.md) — explicitly selected convergence review after behavior fixes.
