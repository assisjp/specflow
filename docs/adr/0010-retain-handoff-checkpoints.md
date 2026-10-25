# 0010 — Retain the last usable handoff until safely superseded

- **Status:** Accepted
- **Date:** 2026-10-25
- **Supersedes:** [0002](./0002-ephemeral-session-handoff.md)

## Context

A handoff described as consumed once and discarded had no defined consumer, acknowledgment or deletion owner. Reading a file did not prove that its active work survived elsewhere. A branch, HEAD and dirty-file list could also be mistaken for a portable copy of uncommitted changes. Promoting every line containing a reason into an ADR conflicted with the project's stricter architectural-decision threshold.

## Decision

A handoff is a retained session checkpoint. Keep the last usable checkpoint until a successor exists or continuation is durably recorded, and apply the user/project's retention policy rather than deleting on read. Include accepted scope, authorization, source location/state, evidence validity, active operations and the next action; reference durable artifacts and state where dirty contents actually survive.

## Alternatives considered

- **Delete after reading.** Reading is not acknowledgment of a durable continuation and can lose the only actionable state.
- **Version every session transcript.** This duplicates sensitive transient context and obscures the durable sources.
- **Promote every rationale to an ADR.** Temporary hypotheses are useful handoff state, but do not meet the criteria for an architectural decision.

## Consequences

The user can close the chat after a saved checkpoint without another interview. Resume checks actual source/environment state and reuses valid evidence. Handoffs remain concise, normally ignored, and do not replace specs or architectural records.

Retention can accumulate old files; cleanup needs an explicit project/user policy. Keeping a file is not proof it is current, and path references alone do not transport unsaved or uncommitted contents to another machine.
