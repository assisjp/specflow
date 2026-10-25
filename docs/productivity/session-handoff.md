# session-handoff

Save a usable checkpoint so the user can close the chat and work can resume.

## When to use it

Use when asked to hand over or stop mid-work; do not restart a clarification interview to summarize known state.

## Behavior

- Record objective, accepted scope, constraints, exact checkout, measured git state, dirty-work location, completed/remaining work, checks tied to source identity and the concrete next action.
- Record owned active processes, remote actions and temporary recovery controls when relevant. Do not infer unknown remote state or repeat a deployment from stale notes.
- Reference durable artifacts and exclude secrets. A dirty-file list and HEAD do not transport the dirty contents to another checkout; state that limitation.
- Keep temporary reasoning in the checkpoint; only meaningful architectural decisions need ADRs.
- Retain the last usable checkpoint until a successor exists or continuation is durably recorded. Reading does not authorize deletion. Follow user/project retention policy (ADR 0010).

## Source

The [skill instructions](../../skills/productivity/session-handoff/SKILL.md) define the full contract. Repository policy and the user's authorization take precedence over the defaults.
