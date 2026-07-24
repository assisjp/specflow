# Changelog

All notable changes to specflow. Format based on [Keep a Changelog](https://keepachangelog.com); this project follows semantic versioning.

## [0.8.4] — 2026-07-24

### Fixed
- `to-tickets` expand→migrate→contract now states the two things that actually keep the batches green, both found running a real wide refactor: **tests are call sites** (a test reading the old field must migrate before contract), and expand is only non-breaking if tests assert behaviour not object shape — prefactor full-object assertions first.

## [0.8.3] — 2026-07-24

### Fixed
Found by running the flow in **tracker mode** on a real GitHub repo (notes-api):
- `to-tickets` no longer implies GitHub has native issue-blocking. `gh issue` cannot set issue dependencies (a Projects/preview feature), so on GitHub the `Blocked by #N` text form is the norm, not a degraded fallback — the skill now says so, and reserves "native blocking" for CLIs that actually expose it (e.g. Linear). It also warns that GitHub's label index lags creation by a few seconds, so verify freshly-created issues with a per-issue `--json` query, not a `--label` filter.

## [0.8.2] — 2026-07-24

### Fixed
- `code-review` §2 no longer contradicts itself. The source-finding list said "In order:" but ranked a caller-passed path second while telling you to "prefer this". The caller-passed path (which `spec-execution` always provides) is now #1, so a commit's `Closes #45` cannot send the review refetching an issue when the exact file was already handed to it — the same guessing class 0.8.0 removed.
- `repo-hardening`'s "format your own output" rule now covers the class, not just the instance: it says the **repo's formatter, installed or adopted**, so it also applies in a repo that already had a formatter (where Phase 3 installs nothing) — the aligned `AGENTS.md` block breaks Phase 6 there too.

## [0.8.1] — 2026-07-24

### Fixed
Both found by running the full flow end-to-end on a real Node/TS repo:
- `repo-hardening` Phase 4: the "generate a baseline" advice was linter-shaped. A type-checker like `tsc` has no baseline mechanism — the skill now says so and points to scope-restrict or fix-in-an-isolated-commit instead of sending the agent to look for a baseline that does not exist.
- `repo-hardening` Phase 5: the skill now formats the files it just wrote (the `AGENTS.md` block, any configs). A freshly-installed formatter reflows an aligned block, so without this the Phase 6 check failed on the very file the skill created — the skill's output must pass the skill's own gate.

## [0.8.0] — 2026-07-24

### Fixed
- **`code-review` now finds the ticket as the spec.** ADR 0006 made tickets a durable per-PR spec under `docs/tickets/`, but `code-review` only searched `docs/specs/` — so in no-tracker mode the Spec axis silently skipped every locally-ticketed PR. It now also searches `docs/tickets/<slug>/`, and `spec-execution` passes the exact spec/ticket path to `code-review` so the source is never guessed. `spec-execution` step 2 acknowledges the source may be a ticket.

### Added
- ADR 0007 (evidence before review) — moves the reasoning that was in the 0.7.0 CHANGELOG entry into a proper decision record, per the "decisions go in an ADR" boundary. The 0.7.0 entry now points to it.

### Changed
- `scripts/check.mjs` steps renumbered sequentially (was `… 7, 7b, 9, 8`). Cosmetic, but drift is drift.

## [0.7.0] — 2026-07-24

### Changed
- **Evidence is produced before review, not after.** `spec-execution` reorders its steps so the evidence artifact exists before `code-review` runs, and the review's Spec axis checks it against the acceptance criteria. Rationale in ADR 0007.
- `repo-hardening` Phase 6 now **executes the `Run` command** (unless `n/a`) to confirm the app comes up — the evidence gate's contract was the one line in the block that was never tested, and it would first run mid-`spec-execution` at the worst time.

### Added
- `scripts/check.mjs` guard #7b: no orphan docs pages (every `docs/<bucket>/<name>.md` maps to a promoted skill) — the reverse direction of the existing docs check.
- `scripts/check.mjs` guard #9: every `ADR NNNN` cited in a skill or doc must resolve to a file in `docs/adr/`.

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

[0.8.4]: https://github.com/assisjp/specflow/releases/tag/v0.8.4
[0.8.3]: https://github.com/assisjp/specflow/releases/tag/v0.8.3
[0.8.2]: https://github.com/assisjp/specflow/releases/tag/v0.8.2
[0.8.1]: https://github.com/assisjp/specflow/releases/tag/v0.8.1
[0.8.0]: https://github.com/assisjp/specflow/releases/tag/v0.8.0
[0.7.0]: https://github.com/assisjp/specflow/releases/tag/v0.7.0
[0.6.0]: https://github.com/assisjp/specflow/releases/tag/v0.6.0
[0.5.0]: https://github.com/assisjp/specflow/releases/tag/v0.5.0
[0.4.1]: https://github.com/assisjp/specflow/releases/tag/v0.4.1
[0.4.0]: https://github.com/assisjp/specflow/releases/tag/v0.4.0
[0.3.0]: https://github.com/assisjp/specflow/releases/tag/v0.3.0
[0.2.0]: https://github.com/assisjp/specflow/releases/tag/v0.2.0
[0.1.0]: https://github.com/assisjp/specflow/releases/tag/v0.1.0
