# 0002 — Handoff is ephemeral session state, not a durable project-state document

- **Status:** Accepted
- **Date:** 2026-07-24

## Context

specflow needs a way to carry work from one session (or tool) to the next. Two
artifacts were conflated in early thinking: an ephemeral summary of the current
conversation to let a fresh agent resume, and a durable, versioned
"where-are-we" document that would live in the repo and be updated over many
sessions. The durable layer already has established owners in this flow: the
glossary (`CONTEXT.md`), architectural decisions (ADRs), the spec, the
`AGENTS.md` verification block, and the issue tracker each own a slice of durable
truth.

## Decision

The `session-handoff` skill produces an **ephemeral** handoff only: a summary of
the current session's state for the next one to consume once, then discard. It
writes to `.scratch/` and ensures `.scratch/` is git-ignored. It records **git
state** (branch, HEAD SHA, dirty files, unpushed commits), not file contents, and
references durable artifacts by path rather than duplicating them. State goes in
the handoff; decisions go in an ADR. If a handoff item survives three sessions
without becoming action, it is a decision disguised as state — promote it to an
ADR and drop it from the handoff.

## Alternatives considered

- **A durable `PROJECT-STATE.md`.** Rejected: it would be a fifth, partially
  overlapping source of durable truth, and the only one with no rule for who
  updates it or when. A durable doc nobody is obliged to maintain rots, and
  rotten state is worse than absent state — an agent reads it, trusts it, and
  acts on stale information. Reference-by-path also breaks in the durable case,
  forcing duplication so the doc still makes sense months later.
- **One skill with both an ephemeral and a durable mode.** Rejected: the two are
  not two settings of one thing; they are two artifacts with different owners.
  A single skill straddling both would do each badly.

## Consequences

- **Easier:** the handoff is consumed once and dies, so it cannot rot; it stays
  small; and the "state vs decision" rule keeps durable reasoning flowing to
  ADRs where it belongs.
- **Harder / costs accepted:** durable project narrative is not in one place —
  a reader assembles it from the glossary, ADRs, spec, and tracker. That is the
  price of every durable source having exactly one owner.
- **Implementation note:** because it writes into `.scratch/`, the skill must
  guarantee the `.gitignore` entry, or the next implementation run would sweep
  the handoff file into a pull request.
