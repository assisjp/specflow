# Domain Glossary

The ubiquitous language of specflow. Glossary only — no implementation, no decisions (those live in [docs/adr/](./docs/adr/)).

## Grill

An interview that resolves consequential uncertainty in a plan or decision, using discovered facts, recommended choices and the user's priorities.

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

Architecture Decision Record. A durable record of one decision that is hard to reverse, surprising without context, and the result of a real trade-off. Ordinary rationale and temporary hypotheses do not automatically require an ADR.

- **Not to be confused with:** Decision Log (ephemeral), Handoff (state)

## Handoff

A session checkpoint containing scope, authorization, source state, evidence and the next action. Retained until safely superseded; references durable decisions without losing temporary reasoning needed to resume.

- **Not to be confused with:** ADR, Spec, a durable project-state document
- **Relates to:** ADR (where durable items get promoted)

## Deterministic Verification Layer

The checks that observe specified properties of the code: formatting, lint, types, tests and any required hooks or CI. Their scope, cost, environment and limitations determine which evidence they provide.

- **Relates to:** Evidence Gate, Canonical Commands

## Canonical Commands

The repository's established verification commands and applicable scopes/environments, discoverable from its instructions, scripts and CI. A Specflow-generated marker is optional.

- **Relates to:** Deterministic Verification Layer

## Evidence Gate

The requirement to support acceptance criteria with appropriate evidence tied to the actual candidate, such as real integration output, a meaningful test or a UI observation. Each proves only the behavior it observes.

- **Relates to:** Deterministic Verification Layer

## Closed Scope

The discipline of implementing exactly what a Spec asks and nothing adjacent — unrelated bugs, tempting refactors, and stale dependencies are noted, not touched.

- **Relates to:** Spec

## Phase

A closed sub-flow of specflow's build: a set of skills that together deliver a coherent, self-contained slice of the whole flow, shipped and used before the next phase begins.
