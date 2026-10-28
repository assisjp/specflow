# review-loop

Run a bounded, evidence-based review-and-fix loop for a consequential change. It complements [code-review](./code-review.md) when a single focused review is insufficient — for example, a high-risk API, authorization, concurrency, or data-integrity change.

## What it adds

- A fixed candidate snapshot shared by every reviewer.
- Independent read-only reviewers with explicit ownership boundaries.
- A ledger of stable finding IDs and evidence-backed outcomes.
- Delta-only rounds after behavior changes, with a proportionate round budget.
- An honest stop condition: budget exhaustion and unavailable reviewers are limitations, not approval.
- Separate review-only from review-and-fix, so feedback does not grant implementation authority.

The loop preserves `code-review`'s standards/spec axes and the repository's authorization policy. It does not require any particular model or provider, and it never independently authorizes commits, pushes, merges, deployments, browser access, or production access.

Each ledger item is `open`, `fix-applied`, `resolved`, `declined`, `out-of-scope`, or `duplicate`. A correction becomes resolved only after current evidence and appropriate re-review. Reviewers receive unique IDs; convergence requires every selected scope to cover the current candidate. A material disputed finding is reported as non-consensus unless its reviewer accepts the evidence or an authorized owner explicitly accepts the risk.

## When to use it

Ask for `$review-loop` when you want iterative reviewer convergence or coordinated multi-agent review before delivery. For a small ordinary diff, use [code-review](./code-review.md) instead.

## Related

- [code-review](./code-review.md) — captures and reviews the candidate.
- [spec-execution](./spec-execution.md) — implements, verifies, reviews, and delivers a bounded change.
