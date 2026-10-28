---
name: review-loop
description: Drive a bounded, evidence-based review-and-fix loop for a risky or consequential change. Use when the user asks for iterative review, reviewer convergence, a review loop, or coordinated multi-agent review before a PR is delivered. Do not use for a small ordinary diff that one focused code-review pass can settle.
disable-model-invocation: true
argument-hint: "[base SHA, PR, or change description]"
---

# Review Loop

Converge on a reviewable candidate without turning review into scope growth. This is an explicit, higher-confidence complement to `code-review`, not a replacement for its ordinary focused pass.

Choose the mode at the start. **Review-only** reports and reconciles findings but never edits. **Review-and-fix** allows the designated integration owner to apply bounded corrections only when the user's task authorizes implementation. Neither mode independently authorizes a commit, push, PR comment, merge, deployment, browser/production access, or permission change.

## 1. Freeze the review contract

Resolve and record the base SHA, candidate mode (`commits`, `staged`, or `working-tree`), owned paths, source/acceptance criteria, evidence, intent, and out-of-scope work. Capture one fixed candidate as `code-review` describes; include relevant owned untracked files without staging them. Do not review a moving branch or silently use `HEAD` in place of uncommitted work.

State the group's responsibility boundaries before delegation: reviewers are read-only; one integration owner decides whether a finding is valid and, only in review-and-fix mode, makes the minimal fix; no participant commits, pushes, changes PR state, starts a new reviewer, or overwrites another participant's work without task authorization.

## 2. Choose proportionate reviewers and budget

Use one focused independent reviewer for a normal consequential change. Add independent reviewers only for distinct, material risks — for example public API compatibility, authorization, concurrency/data integrity, or a separate spec axis. Reviewers may use the same available model; do not claim provider diversity or substitute a named model when it is unavailable. Inherit the session model unless the user asks otherwise.

Default to at most three rounds. A later round examines only changed hunks and unresolved findings. Extend to five only when the remaining issue concerns security, permissions, authentication, data loss, state/concurrency, or the user explicitly asks. Stop early only when no remaining open finding or change creates a reviewable behavior/risk surface; instructions, documentation, and policy can themselves be executable behavior. A timeout, unavailable reviewer, or empty response is a limitation, never approval.

## 3. Review a shared snapshot

Give every reviewer the same artifact and a bounded brief:

```text
Read-only review. Do not edit, commit, push, comment, change PR state, or start subagents.
Base: <SHA>; candidate: <mode + identity>; owned paths: <paths>
Intent: <1–2 sentences>; out of scope: <scope>
Acceptance source: <path/issue/request>; evidence and checks: <results/limits>
Review the fixed artifact and necessary surrounding code. Find concrete regressions,
broken consumers, mismatches with intent, and evidence gaps. Skip style unless it
hides a real defect. Prefer the smallest fix; flag unneeded code/tests/guards.
Reply only with:
VERDICT: APPROVE or CHANGES
<reviewer-id>-<number> [blocker|should|nit] <file>:<line> <claim>. Fix: <smallest suggestion>
```

Assign each reviewer a unique `<reviewer-id>` before it starts. The integration owner preserves those IDs or remaps them once to unique loop-wide IDs before the ledger is shared; never let two findings share an ID. Treat **blocker** as an intended behavior that is wrong, **should** as a real in-scope defect a caller can hit, and **nit** as everything else. Preserve reviewer/axis provenance in the result.

## 4. Reconcile, fix, and keep the ledger

The integration owner confirms each finding against code, source, and evidence before acting. Record a ledger entry for every ID: `open`, `fix-applied`, `resolved`, `declined`, `out-of-scope`, or `duplicate`, with a short evidence-backed reason. `fix-applied` means a change exists but has not yet been verified on the current candidate; only evidence and an appropriate re-review can mark it `resolved`. A reviewer severity is a hypothesis; frequency alone does not lower severity, particularly for security, authorization, data integrity, or concurrency.

In review-and-fix mode, make the smallest change that repairs an accepted finding. In review-only mode, report the bounded correction without editing. Add or update focused coverage when it proves the repair; do not add speculative guards, abstractions, or tests merely to satisfy a reviewer. Re-run only checks/evidence invalidated by the change. If the diff grows materially during review, first ask whether part of it should be removed or split rather than accepting scope creep.

Keep the ledger in the task report or a permitted durable evidence artifact when another session/reviewer must consume it. It must name the snapshot, round, ID, severity, owner, outcome, evidence, and any reviewer/model information actually exposed. Never guess usage, model identity, or consensus.

## 5. Re-review only the delta

Run another round only when a blocker/should remains open, an accepted fix changed behavior, or the previous approval does not cover the final behavior diff. Give reviewers the same base, the updated fixed snapshot, the changed hunks, and the ledger. Ask them to inspect unresolved IDs and the delta; do not restart a broad review merely because a loop exists. Do not repeat a disputed finding unless there is new evidence, a changed candidate, or a user/authorized owner asks to revisit it.

Call the loop **converged** only when every selected reviewer/scope has explicitly covered the current candidate, no blocker/should remains open, the integration owner has no substantiated concern, and required affected verification is current. A declined material finding remains a dispute until its reviewer accepts the evidence or the user/authorized owner explicitly accepts the risk; report that state as a non-consensus stop, never consensus. If the budget ends or a material disagreement persists after two evidence-backed exchanges, report both positions and leave the decision visible for the user or authorized owner. Budget exhaustion is not approval.

## 6. Hand off to delivery

Pass the final snapshot, ledger, checks/evidence, limitations, and remaining follow-ups to `spec-execution` or the delivery workflow. If work must pause, use `session-handoff` to record the active snapshot, consumed/remaining budget, reviewer/task state, unresolved IDs, and next action. Reconcile the delivered diff against the approved snapshot; later behavior changes require affected verification and delta review.
