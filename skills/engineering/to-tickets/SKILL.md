---
name: to-tickets
description: Break a spec, plan, or settled conversation into a set of tracer-bullet tickets, each declaring the tickets that block it, published to the configured tracker — native blocking links on a real tracker, or one file per ticket locally. Use when a spec is too big for one PR and needs slicing into dependency-ordered, agent-grabbable units. Do not use to write the spec or to implement a ticket.
disable-model-invocation: true
---

# To Tickets

Break the work into **tickets** — tracer-bullet vertical slices, each declaring the tickets that **block** it. The dependency graph is explicit and declared, never inferred from titles.

## Process

### 1. Gather context

Work from what is in the conversation. If the user passes a reference (a spec path, an issue number or URL), fetch it and read the full body and comments.

### 2. Explore the codebase (optional)

If you have not already, explore to understand the current state. Ticket titles and descriptions use the project's `CONTEXT.md` glossary vocabulary, and respect ADRs in the area you touch. Look for prefactoring that makes the implementation easier — "make the change easy, then make the easy change."

### 3. Draft vertical slices

Break the work into **tracer-bullet** tickets:

- Each slice cuts a narrow but **complete** path through every layer (schema, API, UI, tests) — vertical, not a horizontal slice of one layer.
- A completed slice is demoable or verifiable on its own.
- Each slice fits in a single fresh context window.
- Any prefactoring goes first.

Give each ticket its **blocking edges** — the tickets that must complete before it can start. A ticket with no blockers can start immediately.

**Wide refactors are the exception.** A wide refactor is one mechanical change (rename a column, retype a shared symbol) whose blast radius fans across the whole codebase, so a single edit breaks thousands of call sites and no vertical slice can land green. Sequence it as **expand → migrate → contract**: first add the new form beside the old so nothing breaks; then migrate call sites in batches sized by blast radius (per package, per directory), each batch a ticket blocked by the expand, CI green batch to batch because the old form still exists; finally delete the old form in a ticket blocked by every migrate batch. If even the batches cannot stay green alone, share an integration branch that all block a final integrate-and-verify ticket — green is promised only there.

### 4. Quiz the user

Present the breakdown as a numbered list. Per ticket show: **Title**, **Blocked by**, **What it delivers** (the end-to-end behaviour it makes work). Ask:

- Does the granularity feel right? (too coarse / too fine)
- Are the blocking edges correct — does each ticket depend only on tickets that genuinely gate it?
- Should any be merged or split further?

Iterate until the user approves.

### 5. Publish

Publish the approved tickets in dependency order (blockers first). How depends on the tracker:

- **Local files** → one file per ticket under `.scratch/<feature-slug>/issues/<NN>-<slug>.md`, numbered from `01` in dependency order. Ensure `.scratch/` is git-ignored. Use the local template below — one ticket per file, never a combined file.
- **A real tracker (GitHub, Linear)** → one issue per ticket in dependency order so blocking edges reference real identifiers. Use the platform's native blocking / sub-issue relationship; otherwise set each ticket's "Blocked by" to the blocking issues. On GitHub, `gh issue create`; apply a `ready-for-agent` label if the project uses one.

Work the **frontier**: any ticket whose blockers are all done. Do not close or modify a parent issue.

<local-ticket-template>

# <NN> — <Ticket title>

**What to build:** the end-to-end behaviour this ticket makes work, from the user's perspective — not a layer-by-layer implementation list.

**Blocked by:** the numbers/titles of the tickets that gate this one, or "None — can start immediately".

**Status:** ready-for-agent

- [ ] Acceptance criterion 1
- [ ] Acceptance criterion 2

</local-ticket-template>

In either form, avoid file paths and code snippets — they go stale fast. Exception: a prototype snippet that encodes a decision more precisely than prose can (a state machine, reducer, schema, type shape) — inline just the decision-rich part and note it came from a prototype.

Work the frontier one ticket at a time with `spec-execution`, clearing context between tickets. The graph orders the work; it does not parallelise it.
