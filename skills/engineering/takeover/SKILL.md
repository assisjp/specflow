---
name: takeover
description: Take over an existing branch, pull request, worktree, or agent handoff while preserving the original goal, contributor credit, and concurrent work. Use when the user asks to take over, finish, rescue, or continue someone else's implementation. Do not use to replace a clear request to start new work.
disable-model-invocation: true
argument-hint: "[PR, branch, worktree, or handoff]"
---

# Takeover

Finish the original goal based on the current code and repository state, not on a handoff's claims. Preserve human contributor credit and do not defend an inherited implementation merely because it already exists.

## 1. Establish the source of truth

Record the requested outcome, source PR/branch/worktree/handoff, current checkout, base and head SHAs, git status, existing reviews/checks, and later user corrections. Read the full candidate diff and relevant source/acceptance criteria. Treat handoffs, comments, and agent transcripts as context; verify them against the actual files and live PR state.

Do not discard, stash, overwrite, rebase, or publish user/contributor work without authorization. If the active checkout is dirty or in use by another task, use an authorized isolated worktree or stop with the concrete conflict. Re-check the source before delivery: it may have moved while you worked.

## 2. Recover intent before changing code

State the smallest coherent goal the inherited work was trying to achieve, what is complete, what remains, and whether the implementation still matches current architecture. Read changed contracts, callers, tests, linked issues, review threads, and applicable repository instructions. Separate observed facts from assumptions and material decisions.

If the goal is obsolete, already delivered elsewhere, or directionally wrong, report that with evidence instead of polishing it. Use `$pr-maintenance` when the question is whether an existing PR should be updated, reworked, or superseded. Do not silently expand into unrelated cleanup.

## 3. Continue with clear ownership

Reuse valid checks and accepted decisions whose candidate, dependencies, and environment remain unchanged. Implement only the necessary continuation. Follow `spec-execution` for bounded implementation, `code-review` for ordinary review, and `$review-loop` when the user requests iterative convergence or it is recommended for a consequential change.

When parallel contributors must edit the same surface, serialize integration or use authorized isolation. Define owned paths/responsibilities and one integration owner. An inherited branch is not permission to overwrite concurrent edits.

## 4. Preserve attribution and delivery boundaries

Preserve existing commit authorship and verified co-author trailers. Do not invent names, email addresses, or credit. If you create a successor PR, explain its relationship to the original in the description when the user authorizes publication.

Do not update, close, merge, rebase, force-push, comment on, or change the base of a PR unless the task and repository policy authorize that action. `$file-pr` can create or update an authorized PR; `$pr-maintenance` can monitor an authorized PR. Neither substitutes for publication or merge permission.

## 5. Report the takeover

Report the inherited source and measured state, recovered goal, work completed, preserved attribution, checks/evidence, changed or unresolved decisions, and delivery status. If work pauses, use `session-handoff` with the source identity, current snapshot, concurrent-work constraints, and one concrete next action.
