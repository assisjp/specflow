# takeover

Safely continue an inherited branch, pull request, worktree, or agent handoff. `takeover` verifies the current code and live PR state before acting, recovers the smallest coherent original goal, and preserves verified contributor credit.

## When to use it

Use `$takeover` when you need to finish or rescue someone else's implementation. It does not replace starting new work from a clear request.

## Boundaries

- Handoffs and comments are context, not proof; the current repository state wins.
- Dirty/concurrent work is preserved. Shared surfaces are integrated serially or in authorized isolation.
- Rebase, force-push, PR updates, comments, closure, merge, and deployment remain separately authorized.
- Use [pr-maintenance](./pr-maintenance.md) to decide whether an existing PR is still current, [file-pr](./file-pr.md) for authorized publication, and [review-loop](./review-loop.md) for explicitly selected convergence review.
