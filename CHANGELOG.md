# Changelog

All notable changes to specflow. Format based on [Keep a Changelog](https://keepachangelog.com); this project follows semantic versioning.

## [0.4.0] — 2026-07-24

### Added
- `guide` — the router skill: describe a task, get the one skill to run now and why.
- `scripts/check.mjs` — zero-dependency consistency check enforcing the CLAUDE.md invariants (manifest/version sync, plugin↔disk↔README↔docs wiring, promoted vs non-promoted rules).
- CI workflow (`.github/workflows/ci.yml`) running the consistency check on every push and PR.
- `npm run check` script.

## [0.3.0] — 2026-07-24

### Added
- Phase 3 — scale & continuity: `to-tickets` (slice a spec into dependency-ordered tracer-bullet tickets) and `session-handoff` (ephemeral session handoff with git state, `.scratch/` + gitignore guarantee, state-not-decisions rule).

## [0.2.0] — 2026-07-24

### Added
- Phase 2 — execution: `repo-hardening` (deterministic verification layer + `AGENTS.md` block), `spec-execution` (one spec → one reviewable PR with closed scope and evidence), `tdd` (red → green loop reference), `code-review` (two-axis Standards + Spec review).

## [0.1.0] — 2026-07-24

### Added
- Phase 1 — spec pipeline: `grill` (relentless interview with contradiction rule, priority lens, structured choices, decision-log output), `domain-modeling` (glossary + ADR discipline), `to-spec` (decision log → published spec).
- Plugin and marketplace manifests, per-skill docs, `CONTEXT.md` glossary, ADR 0001 (own self-contained rewrite) and ADR 0002 (ephemeral handoff), and `scripts/link-skills.sh`.

[0.4.0]: https://github.com/assisjp/specflow/releases/tag/v0.4.0
[0.3.0]: https://github.com/assisjp/specflow/releases/tag/v0.3.0
[0.2.0]: https://github.com/assisjp/specflow/releases/tag/v0.2.0
[0.1.0]: https://github.com/assisjp/specflow/releases/tag/v0.1.0
