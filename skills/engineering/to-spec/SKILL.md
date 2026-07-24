---
name: to-spec
description: Turn the current conversation — ideally the decision log from a grill session — into a spec (a PRD) and publish it to the project's issue tracker, or to a local file if there is none. No interview; this is pure synthesis of what has already been decided. Use when the user says "write the spec", "turn this into a spec", or after grilling has reached shared understanding.
disable-model-invocation: true
---

# To Spec

Take the current conversation and codebase understanding and produce a spec. Do **not** interview the user — that is grill's job, and it should already have happened. This skill only synthesises what is already decided.

If a grill decision log exists in the conversation, it is your primary source: every decision in the spec should trace back to a log entry or to something the user explicitly said. Do not invent requirements the grilling did not settle.

## Process

### 1. Understand the code

Explore the repo to understand its current state, if you have not already. Use the project's domain glossary (`CONTEXT.md`) vocabulary throughout the spec, and respect any ADRs in the area you are touching. If a term in the conversation conflicts with the glossary, resolve it before writing — a spec that uses words loosely produces code that does the wrong thing precisely.

### 2. Sketch the test seams

Sketch the seams at which the feature will be tested. Prefer existing seams to new ones, and prefer the highest seam possible — the fewer seams across the codebase, the better, and the ideal is one. If a new seam is needed, propose it at the highest point you can.

Check with the user that these seams match their expectations before writing the spec. This is the one place to pause — everything else is synthesis.

### 3. Write and publish

Write the spec using the template below, then publish it. Where it goes depends on what the project has:

- **A real issue tracker** (GitHub, Linear, …) — publish as one issue. On GitHub use `gh issue create`. Apply a `ready-for-agent` label if the project uses one.
- **No tracker** — write it to `docs/specs/<feature-slug>.md` and **commit it**. A spec is durable, not scratch: `spec-execution` reads it in a later session, the second-failure rule assumes it survives, and a fresh clone must still find it. Never write a spec to `.scratch/` — that directory is ephemeral and git-ignored (ADR 0002, 0006).

If you cannot tell which the project uses, ask — it is a one-line decision, not an interview.

**Clearing a `returned` marker (the second-failure gate's exit).** If you are republishing a spec that a previous `spec-execution` sent back as defective — the source carries a `returned` label, or a `Returned: spec-defect` line — this rewrite heals it, and the rewritten spec is the *same* entity, not a new one (ADR 0008). So republish to the **same** source and clear the marker: remove the `returned` label and add a brief "rewritten" comment (tracker), or delete the `Returned:` line (local). `spec-execution` sets that marker; the republisher clears it. You clear it for a **spec** (the source `to-spec` owns); a marked **ticket** is cleared by `to-tickets`, the source it owns (ADR 0006/0008) — do not clear across the ownership line. Clearing is the only thing that lets the gate release. Do not open a new issue for the rewrite — that would strip the blocking edges of every ticket pointing at the old one.

<spec-template>

## Problem Statement

The problem the user faces, from the user's perspective.

## Solution

The solution to that problem, from the user's perspective.

## User Stories

A long, numbered list of user stories, each in the form:

1. As an `<actor>`, I want `<capability>`, so that `<benefit>`.

Cover every aspect of the feature. Be extensive — a thin story list is a spec that will grow surprises during implementation.

## Implementation Decisions

The decisions that were actually made — trace each to the grill decision log where possible:

- Modules built or modified, and the interfaces that change
- Architectural decisions and technical clarifications
- Schema changes and API contracts
- Specific interactions

Do **not** include file paths or code snippets — they go stale fast. Exception: if a prototype produced a snippet that encodes a decision more precisely than prose can (a state machine, reducer, schema, or type shape), inline just the decision-rich part and note it came from a prototype.

## Testing Decisions

- What makes a good test here: exercise external behaviour, not implementation details
- Which modules will be tested
- Prior art — similar tests already in the codebase

## Out of Scope

What this spec deliberately does not cover. Pull straight from the "out of scope" items the grilling surfaced.

## Further Notes

Anything else worth recording.

</spec-template>

## Traceability

Before you publish, re-read the spec and check every claim traces to a decision, a user statement, or a codebase fact. Anything that traces to none of those is invented — cut it or turn it into an open question for the user. A spec's job is to encode what was decided, not to quietly decide more.
