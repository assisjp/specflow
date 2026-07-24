---
name: repo-hardening
description: Prepare a repository for agent work — install the deterministic verification layer (formatter, linter, types, tests, git hooks, CI) without breaking what already exists, and record the canonical commands and prohibitions in AGENTS.md. Use whenever the user wants to set up a linter, pre-commit, pre-push or CI, "get the repo ready for agents", standardise checks, or when another skill needs the canonical commands and the AGENTS.md block is missing. Works on a fresh repo and on an old one with partial config. Idempotent — re-run any time to re-verify.
disable-model-invocation: true
---

# Repo Hardening

Ensure a **deterministic** verification layer exists in the repository, and that it is recorded where agents read.

Principle: **an error a machine can catch, a model should never have to.** Every check here is an agent cycle and a human review saved.

**Idempotent.** Re-running re-verifies and corrects drift — it never duplicates.

## Inviolable rules

1. Never overwrite existing config. If it exists, adopt it and record it.
2. Never install a second hook manager. A repo has at most one.
3. Never change an existing CI rule. Only add, and only with authorisation.
4. Never make a bulk change without confirmation.
5. **Never write outside your own markers in `AGENTS.md`.**
6. **Never create or edit `CONTEXT.md`, ADRs, or domain docs.** Those have another owner (`domain-modeling`).
7. Stop and ask whenever a choice is irreversible or opinionated.

## Phase 1 — Inventory

Write nothing in this phase.

**Ecosystem** — detect from the manifest:

| File | Ecosystem |
|---|---|
| `package.json` | Node/TS |
| `pyproject.toml`, `requirements.txt`, `setup.py` | Python |
| `go.mod` | Go |
| `Cargo.toml` | Rust |
| `mix.exs` | Elixir |
| `Gemfile` | Ruby |
| `composer.json` | PHP |
| `pom.xml`, `build.gradle` | JVM |

Multiple manifests or a monorepo: list them all and ask which is in scope.

**What already exists:**

- hook manager: `.husky/`, `lefthook.yml`, `.pre-commit-config.yaml`, `.githooks/`, `core.hooksPath`, a `.git/hooks/` with real content
- formatter, linter, type-checker config
- test runner and where tests live
- CI: `.github/workflows/`, `.gitlab-ci.yml`
- scripts in the manifest, Makefile, justfile
- `AGENTS.md`, `CLAUDE.md`, `CONTRIBUTING.md` — and whether a `repo-hardening` block is already inside

**Health of what exists** — run the checks you found and count the failures. A linter configured but unrun for two years is not a verification layer, it is a liability.

## Phase 2 — Report and decide

Present, briefly:

- ecosystem detected
- what exists and is healthy → **kept**
- what exists and is failing → how many failures, and a proposal
- what is missing → a proposal
- whether any bulk change is involved

**Wait for confirmation.** If the user wants only part, do only that part.

## Phase 3 — Install what is missing

Only what the inventory found missing, in this order:

1. **Formatter** — the ecosystem's default config, zero customisation.
2. **Linter** — the recommended default ruleset. Do not invent custom rules now.
3. **Type checker** — where the language supports it.
4. **Hooks** — if a manager exists, **add a step to it**; otherwise install the ecosystem default. `pre-commit` = formatter + lint + types on staged files. `pre-push` = the test suite.
5. **CI** — a job running **exactly the same commands**. If a workflow exists, add a new job rather than editing existing ones.

The hook is bypassable; CI is the real gate. Both must exist.

## Phase 4 — Existing repo: don't break everything

Turning on strict mode in an old repo spews thousands of errors and the user quits on day one.

- **Formatter**: apply across the whole repo in **one isolated commit**, mixed with nothing. Confirm first.
- **Linter and types**: generate a baseline, or restrict scope to the folders where work will happen. Record that scope is partial.
- **Tests**: if the suite is slow or flaky, record it as a known problem rather than masking it. A slow suite is the second-largest cost leak in agent work.

Never disable a rule to make a check pass. Either it enters the baseline, or it becomes a task.

## Phase 5 — Write to AGENTS.md

Create the file if missing. If it exists, **edit only between the markers below**; if there are no markers, append the block at the end without touching anything else.

This block enters context in every session in the repo. Keep it lean — only what must hold even with no skill invoked. Procedure does not go here.

```markdown
<!-- repo-hardening:start -->
## Verification

- Format: <command>
- Lint:   <command>
- Types:  <command>
- Tests:  <command>
- All:    <single command>

Lint/type scope: <full | folders X, Y>

Work is only done when every check is green.
Do not disable a lint rule, or add ignore/noqa/any, to make a check pass.
Do not use `--no-verify`.
Do not change an existing test to accommodate a change.
If the same check fails three times, stop and report the obstacle.
<!-- repo-hardening:end -->
```

If the block already exists, compare it against reality and update only what diverged.

## Phase 6 — Verify

1. Run the "All" command and confirm it passes.
2. Test commit: did the hook fire?
3. Do CI and the hook run the same commands? Divergence is the classic source of "passes local, breaks in the PR".
4. Report what was installed, what was kept, and what is still pending.
