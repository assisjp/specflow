# 0006 — Durable local artifacts are versioned under `docs/`, not `.scratch/`

- **Status:** Accepted
- **Date:** 2026-07-24

## Context

When there is no issue tracker, `to-spec` and `to-tickets` still need somewhere to put the spec and tickets. Early versions wrote them to `.scratch/` — the same directory ADR 0002 and `CLAUDE.md` define as **ephemeral and git-ignored**. But a spec is the opposite of ephemeral: `CONTEXT.md` defines it as the traceable synthesis `spec-execution` reads, the second-failure rule assumes it survives across sessions, and a fresh clone or a second machine must still find it. Tickets are the durable dependency graph a later session works from. Putting either in `.scratch/` meant they vanished on clone — the exact inversion of the problem ADR 0002 solved for the handoff (there, durable state was wrongly kept in an ephemeral form; here, durable artifacts landed in the ephemeral place). A symptom had already leaked in: `code-review` searched three locations for the spec (`docs/`, `specs/`, `.scratch/`), which is what not-trusting-one-location looks like.

## Decision

Durable local artifacts are versioned and committed:

- Specs (no-tracker mode) → `docs/specs/<slug>.md`.
- Local tickets → `docs/tickets/<slug>/<NN>-<slug>.md`.

`.scratch/` is reserved exclusively for ephemeral artifacts — today only `session-handoff` writes there (`.scratch/handoffs/`). `code-review` looks for the spec under `docs/specs/` (or the tracker), one place.

## Alternatives considered

- **Keep no-tracker mode in `.scratch/`, declare it deliberately disposable.** Legitimate, but it fights the top priority (reliability): a spec that does not survive a clone cannot be the durable contract the flow depends on. Chosen against.
- **A fourth top-level directory (e.g. `.specflow/`).** More surface, no gain over the conventional `docs/`.

## Consequences

- **Easier:** the spec and tickets survive clones and machines; `spec-execution` and the second-failure rule get the persistence they assume; the spec has exactly one home.
- **Harder / accepted:** these artifacts now appear in version control and in PRs — which is correct for durable work, but means the no-tracker mode produces committed files, not throwaway ones. That is the point.
- **Clarified ownership:** `to-spec` owns `docs/specs/`, `to-tickets` owns `docs/tickets/`, `session-handoff` owns `.scratch/handoffs/`. Each durable source has one owner, closing the loose `.scratch/` ownership `CLAUDE.md` previously left generic.
