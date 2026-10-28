---
name: pr-maintenance
description: Reassess, update, or monitor an existing pull request against its current base, CI, and review state. Use when the user asks to babysit, monitor, rebase, modernize, refresh, or determine whether a PR is still worth landing. Do not use to create a new PR or merge one.
disable-model-invocation: true
argument-hint: "[PR number or URL]"
---

# PR Maintenance

Keep a pull request aligned with its current goal and base branch. A clean rebase, green check, or notification is evidence to inspect — none alone proves that the PR still belongs or is ready to merge.

## 1. Observe the live PR

Resolve the PR URL/number, repository, state, author, base/head branches and SHAs, mergeability, checks, review decisions, unresolved threads, linked source, and current diff. Fetch the actual base and head before judging the work. Record the observed head SHA; reviews, checks, and comments attached to an older head do not certify a newer one.

Read the original goal, later user corrections, review feedback, and affected contracts. Treat comments and automation output as claims to verify against the current candidate. Do not start a second caretaker for the same PR without coordinating ownership.

## 2. Choose a disposition

Compare the PR's goal with changes on its base since divergence, related merged/open work, current architecture, APIs/types/schemas, and real user-facing behavior. Look for overlap and obsolescence beyond textual conflicts.

Choose and explain one result:

- **CURRENT** — the goal and implementation still fit; monitor or update only as authorized.
- **REWORK** — the goal remains useful, but the implementation needs a bounded redesign; describe it and stop before changing code unless authorized.
- **SUPERSEDED** — equivalent work landed, the goal is obsolete, or landing this PR would restore the wrong behavior; report evidence. Do not close the PR without explicit permission.

Age and sunk effort are not evidence. Do not rebase merely because a branch is old.

## 3. Update safely when authorized

For a `CURRENT` PR that the task authorizes updating, work from an isolated checkout when the active tree is dirty or in use. Rebase only onto the recorded current base. Resolve conflicts according to the PR's still-valid goal and base invariants; a product/architecture disagreement changes the disposition to `REWORK`, not a guess.

Compare pre/post series and final diff, then run affected checks and review the final candidate. If the repository permits pushing a rewritten branch, use the narrowest safe mechanism against the observed head and reassess if it changed; never use an unqualified force push. Updating a branch never authorizes merging, closing, base changes, comments, deployment, or bypassing protection.

## 4. Monitor without manufacturing approval

Monitor only when the user asks and a supported authorized mechanism is available. Prefer the host's recurring monitor or a single GitHub CLI watch operation; do not write a polling/sleep loop or use local browser automation. One wake/event is news, not a merge decision: re-read the current head, checks, reviews, conflicts, and unresolved threads before acting.

Address only findings and failures attributable to the current candidate. Verify each finding, distinguish infrastructure/pre-existing failures, and apply corrections only within authorization. After a behavior change, refresh affected evidence and review the delta; use `$review-loop` when iterative convergence is explicitly selected. If monitoring cannot continue in the available environment, report the limitation and leave the PR unchanged.

## 5. Stop with an accurate state

Report the PR URL, observed head/base, disposition, relevant base/architecture changes, checks/reviews and their candidate identity, actions taken, remaining risks, and whether monitoring remains active. Do not merge or enable auto-merge unless expressly authorized. Use `session-handoff` when an authorized monitor or unresolved PR state must survive this session.
