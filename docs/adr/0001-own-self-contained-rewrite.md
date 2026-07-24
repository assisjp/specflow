# 0001 — Own, self-contained skills; rewrite rather than fork or depend

- **Status:** Accepted
- **Date:** 2026-07-24

## Context

specflow's flow was inspired by an existing, well-organised MIT-licensed skill
collection. Three ways to reuse it were on the table, and the choice is hard to
reverse once the repo is public and others install it. The governing priority is
reliability first, then cost, then less manual effort, then speed. A separate
principle already held: never edit third-party skills in place, and never fork
without inheriting upstream updates — a fork that does not track upstream is
"maintenance without benefit".

## Decision

specflow is its own self-contained project. Every skill in it is **rewritten
from scratch** in its own words. It takes no runtime dependency on the upstream
collection, vendors none of its files, and forks nothing. Upstream is treated as
design inspiration only; specflow's docs and skill names do not reference it.

## Alternatives considered

- **Depend on upstream, pin the version.** Clean and low-maintenance, but the
  goal was to *improve* the skills and own them outright, which a dependency
  cannot deliver — you cannot improve what you do not control.
- **Vendor the upstream skills into this repo.** A partial fork: the copied
  files go stale, upstream improvements are lost, and their code must be
  maintained here — the exact "maintenance without benefit" the principle
  forbids. It also raises a licence obligation (see below) that a rewrite avoids.
- **Fork the upstream repo wholesale.** Same staleness and maintenance cost at
  full scale, plus dozens of skills that are not part of this flow.

## Consequences

- **Easier:** total control to improve, rename, and reshape any skill; a repo
  with a single coherent identity; no external install order for users beyond
  specflow itself.
- **Harder / costs accepted:** the full flow must be built as original skills
  over time (phased, not all at once), and specflow does not automatically
  benefit from upstream improvements — re-deriving a good idea is on us.
- **Licence:** the upstream is MIT, whose one condition is retaining the notice
  for copies or substantial portions. A genuine rewrite is neither a copy nor a
  substantial portion, so no attribution obligation attaches — provided skills
  are written fresh, not pasted and renamed. This is also the only method that
  actually yields improvement, so licence-clean and goal-aligned coincide.
