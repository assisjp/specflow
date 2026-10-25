# 0009 — Let repository policy and accepted scope bound the workflow

- **Status:** Accepted
- **Date:** 2026-10-25
- **Supersedes:** [0008](./0008-returned-marker-lifecycle.md), preserving its source identity and marker tokens

## Context

Universal gates accumulated around individual incidents: no existing test could change, a third failing check stopped work, every seam needed confirmation, and implementation required a particular generated block. These rules conflicted with legitimate refactors and with each other. Source ownership also required a second skill invocation after the user had already resolved a specification defect. The process could spend more effort preserving the workflow than establishing the requested behavior.

## Decision

Specflow provides defaults proportional to the change and uncertainty, bounded by the user's accepted scope and the repository's policy. Reuse established decisions, authorization and evidence; add a step only when it resolves a relevant risk or unknown. Repository-specific execution restrictions and explicit budgets remain authoritative until an authorized migration.

The same principle applies to source correction: an authorized implementer or publisher can repair the named defect in place, verify the acceptance criterion and clear the existing `returned` label or `Returned:` line with a correction record. Source identity, dependencies and concurrent work remain protected. Merely changing text is not proof of healing, and a marker is never cleared to bypass an unresolved defect.

## Alternatives considered

- **Keep universal gates and add exceptions for each incident.** This keeps growing a policy that cannot express the relevant distinctions and demands repeated human intervention.
- **Remove deterministic verification and source state.** This loses useful evidence and lets unresolved specifications be retried blindly.
- **Build a configurable orchestration engine.** More runtime and configuration would not fix the instructions' authority and scope mistakes; existing repository policy is sufficient.

## Consequences

Work can use existing checks without installing a marker, evolve tests with accepted contracts, delegate independent work and repair settled criteria without ceremonial transitions. Review must identify the actual committed/index/worktree candidate and invalidate affected evidence after changes.

Agents must explain their verification scope and limitations; proportional judgment cannot guarantee complete coverage. Old generated blocks retain their effect until explicitly migrated. The plugin does not rewrite repositories, broaden operational permissions or claim a check it could not run.
