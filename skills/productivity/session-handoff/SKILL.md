---
name: session-handoff
description: Save a concise session checkpoint so another session or tool can resume after the user closes the chat. Record scope, authorization, source state, checks and next action; retain the last usable checkpoint until safely superseded.
disable-model-invocation: true
argument-hint: "[what the next session will focus on]"
---

# Session Handoff

Save a concise checkpoint so the user can close this chat and another session can resume. Do not require another interview to summarize known state. Retain the last usable checkpoint until it is superseded or the receiving session confirms a durable continuation (ADR 0010).

## Save safely

Use the project's handoff location; otherwise `.scratch/handoffs/<short-slug>.md`. Ensure that default is ignored before writing sensitive session state. If changing `.gitignore` is outside scope, use an authorized task-local location and report it. Exclude secrets and unnecessary personal data. Never delete another session's checkpoint or assume reading it authorizes deletion.

Reference durable specs, tickets, glossary and ADRs rather than copying them. Short reasons and temporary debugging hypotheses can remain in a handoff; promote only decisions that satisfy `domain-modeling`'s ADR criteria. Do not create an ADR for every “why”.

## Contents

```markdown
# Handoff — <topic>

- Recorded: <date/time>
- State: active checkpoint; supersedes <path, if any>
- Objective and accepted scope: <including later corrections>
- Authorization/constraints: <execution environment, browser, publication, production>
- Checkout/worktree: <exact path>
- Git: <branch, measured HEAD, dirty paths, measured upstream state or unknown>
- Unsaved/uncommitted work: <where its actual contents survive; patch/commit if available>
- Completed: <outcomes, not a transcript>
- Remaining/blockers: <facts, uncertainties and temporary hypotheses>
- Checks/evidence: <command, result, source identity and environment; unrun items>
- Owned active processes/remote actions: <IDs, state, pending migrations/deploys,
  temporary recovery controls, or none>
- Sources: <spec/ticket/decision/evidence paths or URLs>
- Next action: <one concrete continuation and dependencies>
```

A dirty-file list and HEAD do not preserve the dirty contents on another machine. Say whether the handoff requires the same checkout; reference a saved patch/commit only if it actually exists. Do not claim source portability from path references alone. Record remote state only when measured, otherwise mark it unknown.

For an active `review-loop`, also record its mode (review-only or review-and-fix), base and reviewed snapshot, round budget consumed/remaining, ledger location or unresolved IDs, reviewer/task state, and the exact delta or evidence needed next. A prior approval does not certify a later candidate.

For a `takeover` or `pr-maintenance` handoff, also record the source PR/branch/worktree, observed head/base SHAs and time, disposition, contributor/ownership constraints, active monitor state, and whether the next session may modify or only assess the candidate.

## Resume and retention

The receiving session first verifies checkout/source state and constraints, then reuses still-valid decisions and checks. Stale status must be reconciled with reality; a checkpoint is not authority to repeat a deployment or widen permissions. Do not rerun green checks for unchanged inputs merely because the session changed.

Report the saved path and the next action so the user can close the chat. Mark a checkpoint superseded only when a successor exists or continuation is durably recorded. Deletion/retention follows the user's or project's policy; never remove the last usable checkpoint merely because it was read. Default to retaining it without placing transient state in a feature PR.
