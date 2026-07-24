# Domain Glossary

The ubiquitous language of specflow. Glossary only — no implementation, no decisions (those live in [docs/adr/](./docs/adr/)).

## Grill

A relentless interview that stress-tests a plan or decision before code exists — one question at a time, each with a recommended answer, walking the decision tree until nothing is ambiguous.

- **Relates to:** Decision Log, Spec, Domain Model

## Decision Log

The ordered trail a Grill produces: each settled decision as *decision → choice → reason*. Ephemeral — it feeds the next step and lives in the conversation, not the repo (unless promoted to an ADR).

- **Not to be confused with:** ADR (durable), Handoff (session state)
- **Relates to:** Grill, Spec

## Spec

A synthesis of decided requirements (a PRD), traceable to a Decision Log or explicit user statements, published to the issue tracker or a local file. Never the place where new decisions are made.

- **Relates to:** Decision Log, Ticket

## Domain Model

The project's canonical vocabulary (`CONTEXT.md`) plus its architectural decisions (ADRs). The shared language code must speak.

- **Relates to:** ADR, Grill

## ADR

Architecture Decision Record. A durable record of one decision that is hard to reverse, surprising without context, and the result of a real trade-off. The owner of durable "why".

- **Not to be confused with:** Decision Log (ephemeral), Handoff (state)

## Handoff

An ephemeral summary of a session's state — including git state — for the next session or tool to consume once and discard. Records state, not decisions.

- **Not to be confused with:** ADR, Spec, a durable project-state document
- **Relates to:** ADR (where durable items get promoted)

## Deterministic Verification Layer

The machine-checkable gate: formatter, linter, types, tests, git hooks, CI. Zero hallucination, zero per-run cost. Every error it catches is an agent cycle and a human review saved.

- **Relates to:** Evidence Gate, Canonical Commands

## Canonical Commands

The one agreed set of verification commands for a repo, recorded in `AGENTS.md` so every agent and human runs the same checks.

- **Relates to:** Deterministic Verification Layer

## Evidence Gate

The rule that a change with observable effect is accepted only with a real artifact — a screenshot of the flow running, actual output. A green test does not prove the feature appears.

- **Relates to:** Deterministic Verification Layer

## Closed Scope

The discipline of implementing exactly what a Spec asks and nothing adjacent — unrelated bugs, tempting refactors, and stale dependencies are noted, not touched.

- **Relates to:** Spec

## Phase

A closed sub-flow of specflow's build: a set of skills that together deliver a coherent, self-contained slice of the whole flow, shipped and used before the next phase begins.
