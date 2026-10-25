---
name: to-tickets
description: Break a spec, plan, or settled conversation into a set of tracer-bullet tickets, each declaring the tickets that block it, published to the configured tracker — native blocking links on a real tracker, or one file per ticket locally. Use when a spec is too big for one PR and needs slicing into dependency-ordered, agent-grabbable units. Do not use to write the spec or to implement a ticket.
disable-model-invocation: true
argument-hint: "[spec path or issue #]"
---

# To Tickets

Split work only when multiple reviewable deliverables make it easier to execute safely. Reuse an approved breakdown and settled conversation; do not replan a small task that already fits one change.

### Mode: healing a returned ticket

Read the `returned` label or `Returned:` line and its reason. Heal one ticket in place, without re-slicing the surrounding graph. Apply an accepted clarification, preserve identity/dependencies and concurrent edits, and verify that the specific defect is resolved. Remove the `returned` label with a correction record, or delete the `Returned:` line after saving the corrected local source. A changed body alone is insufficient. An authorized implementer may make this bounded correction too (ADR 0009). If the decision is still unknown, ask the focused question rather than blindly clearing the marker.

## 1. Gather only missing context

Use the source, comments and accepted decisions already available. Inspect relevant contracts, tests and consumers when needed. Respect the project's domain vocabulary; no full codebase reread is required.

## 2. Propose coherent deliverables

Each ticket should have a verifiable outcome, necessary context and explicit blocking edges. Prefer a complete behavioral slice; do not invent schema/API/UI work where the change does not need those layers. Prefactoring belongs only when it concretely reduces risk or effort, and should remain bounded.

For a wide refactor, use expand → migrate → contract when incremental compatibility is necessary. Tests are consumers too: update expectations when the accepted contract changes, preserving invariants. Exact object assertions may be correct for an exact public contract; do not weaken them indiscriminately. If independently green batches are impossible, an explicitly agreed integration branch may collect the work, with the combined gate at the final integration step and intermediate limitations reported honestly.

Estimate reviewability by complexity and dependencies, not a rigid line/context-window budget. Independent tickets may proceed concurrently with explicit file/responsibility ownership, communication and an integration owner. Dependent tickets need their prerequisites present in the actual base. Do not claim to clear a model's context; start a real fresh session/subagent when beneficial and available.

## 3. Resolve consequential choices once

Show title, outcome and blockers. Reuse approved granularity/edges; ask only about unresolved decisions that materially affect scope, risk or delivery. Ordinary ticket drafting does not require repeated quizzes.

## 4. Save or publish

Use the chosen tracker or repository convention and the task's authorization. Local defaults are `docs/tickets/<feature-slug>/<NN>-<slug>.md`, in dependency order, with outcome, acceptance criteria and blockers. Version durable tickets as part of the repo's delivery workflow; do not leave the only copy in scratch.

For trackers, detect what the available connector/API/CLI supports. Use native dependencies when available; otherwise explicit `Blocked by #N` text is sufficient. Do not assume a platform capability is permanently absent based on an old CLI. Read freshly written state per issue where search indexes may lag. Do not close or rewrite a parent issue unless requested.

Work the ready frontier: prerequisite behavior must be integrated in the chosen base or covered by the agreed integration plan. Ticket checkboxes alone are not proof. Report the breakdown and saved links/paths; continue authorized execution without requiring the user to invoke every stage manually.
