# Changelog

All notable changes to specflow. Format based on [Keep a Changelog](https://keepachangelog.com); this project follows semantic versioning.

## [0.6.0] — 2026-07-24

### Changed
- **Durable local artifacts are versioned, not scratch.** With no tracker, `to-spec` writes the spec to `docs/specs/<slug>.md` and `to-tickets` writes tickets to `docs/tickets/<slug>/`, both committed — instead of `.scratch/`, which was ephemeral and git-ignored, so specs/tickets vanished on a fresh clone. `.scratch/` is now exclusively `session-handoff`'s. `code-review` looks for the spec in one place (`docs/specs/`). See ADR 0006.
- `code-review` now degrades gracefully across harnesses: parallel sub-agents where available, otherwise the two axes run sequentially with clean context between them — the isolation guarantee no longer depends on a Claude Code-specific feature (consistent with ADR 0003's portability stance).

### Added
- `spec-execution` now assigns the refactor beat an owner: a code smell **inside the diff** is in scope (clean it up — this is red-green-**refactor**'s third beat); a smell **outside the diff** is out of scope (record it, don't fix it). Closes the gap where a smell in new code belonged to no one.
- `scripts/check.mjs` guard #8: the current plugin version must have a `CHANGELOG.md` entry.
- ADR 0006 (durable artifacts versioned under `docs/`, not `.scratch/`).

## [0.5.0] — 2026-07-24

### Changed
- `guide` (the router) is now model-invoked, so it surfaces when a user describes a task without naming a skill — the situation it exists for — instead of being reachable only by those who already know to type it. See ADR 0005.
- Every general reference to the verification-block location now reads "`AGENTS.md` or `CLAUDE.md`" (glossary, ownership rule, README, skills, docs), consistent with ADR 0003. Previously six files still hard-coded `AGENTS.md`.

### Added
- `scripts/check.mjs` now enforces the **invocation contract** (frontmatter invocation mode must match the README User-invoked / Model-invoked grouping) and **router coverage** (every promoted skill except `guide` must appear in `guide/SKILL.md`). The `domain-modeling` regression can no longer return silently.
- CI now also runs `claude plugin validate . --strict` as a gate, not just an instruction.
- ADR 0005 (the router is model-invoked).
- Git tags for all releases (`v0.1.0` … `v0.5.0`), so the CHANGELOG links resolve.

## [0.4.1] — 2026-07-24

### Fixed
- `link-skills.sh` no longer destroys a real directory or file at a target path — it refuses to overwrite anything that is not its own symlink, and reports skips. Prevents data loss for users who already have a real `tdd`/`code-review` skill dir.
- `domain-modeling` is now model-invoked, so `grill docs` can actually reach it (it was user-invoked and unreachable by another skill). See ADR 0004.

### Changed
- `repo-hardening` writes the verification block to the harness's auto-loaded context file (`AGENTS.md` or `CLAUDE.md`), with a pointer when both exist, instead of hard-coding `AGENTS.md`. See ADR 0003.
- The verification block gains a `Run:` command so the evidence gate has a contract; `spec-execution` uses it instead of guessing a dev-server command.

### Added
- ADR 0003 (agent-context file selection) and ADR 0004 (utility skills model-invoked, ambient triggering accepted).

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

[0.6.0]: https://github.com/assisjp/specflow/releases/tag/v0.6.0
[0.5.0]: https://github.com/assisjp/specflow/releases/tag/v0.5.0
[0.4.1]: https://github.com/assisjp/specflow/releases/tag/v0.4.1
[0.4.0]: https://github.com/assisjp/specflow/releases/tag/v0.4.0
[0.3.0]: https://github.com/assisjp/specflow/releases/tag/v0.3.0
[0.2.0]: https://github.com/assisjp/specflow/releases/tag/v0.2.0
[0.1.0]: https://github.com/assisjp/specflow/releases/tag/v0.1.0
