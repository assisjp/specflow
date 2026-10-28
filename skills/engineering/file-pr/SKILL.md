---
name: file-pr
description: Prepare and open or update an authorized pull request with a concise problem-first description and verifiable evidence. Use when the user asks to create, file, open, or update a PR. Do not use merely to review a diff or when publication is not authorized.
disable-model-invocation: true
argument-hint: "[base branch or PR]"
---

# File PR

Publish an authorized candidate so a reviewer can understand the problem, the solution, and the proof without reconstructing the implementation history.

## 1. Confirm the publishable candidate

Read repository instructions and the user's delivery scope. Resolve the base branch, current head SHA, owned paths, source/acceptance criteria, checks/evidence, and review status. Inspect the diff against the resolved base and compare it with the reviewed snapshot. Do not publish a candidate whose later changes have not received affected verification and review.

Check whether a PR already exists for the branch before creating another. Preserve an existing PR unless the user explicitly asks for a replacement. A dirty worktree, unrelated changes, missing remote, or unclear base is a concrete condition to report or resolve within authorization — never a reason to stage everything or guess.

## 2. Write the reviewer-facing story

Follow repository title conventions and inspect recent merged work if they are unclear. Make the title concise and outcome-oriented. The description should normally contain:

```markdown
## Problem
<what a user, maintainer, or system could not reliably do>

## Solution
<the smallest behavior-level change>

## Evidence
<commands/observations tied to the final head, plus meaningful limitations>
```

Lead with the problem and behavior, not a file inventory. Include source links, screenshots, migration notes, rollout/rollback notes, or follow-ups only when relevant. Check title, body, pasted logs, links, and attachments for secrets and private material. Do not invent model, reviewer, benchmark, or user attribution.

## 3. Publish only what is authorized

Commit, push, create, or update a PR only when each action is within the task's authorization and the repository workflow. Stage only owned paths. Use the configured GitHub CLI/API or tracker integration; if an API action fails, report the measured failure rather than changing credentials or using a browser without authorization.

Use `Closes #N` only for an actual issue that this PR should close. Do not post follow-up comments merely to narrate work; comments require a purpose and authorization. Opening a PR does not authorize merge, auto-merge, base changes, force-push, deployment, or closing another PR.

## 4. Hand off accurately

Report the PR URL or local delivery state, final head/base, title and evidence summary, review status, and limitations. If the user asks to monitor it, use `$pr-maintenance`; otherwise stop after publication.
