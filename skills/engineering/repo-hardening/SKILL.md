---
name: repo-hardening
description: Prepare a repository verification layer by adopting existing tooling, repairing requested gaps and recording scoped commands and execution policy. Use when the user asks to set up or improve lint, types, tests, hooks or CI; not as a prerequisite merely because a Specflow marker is absent.
disable-model-invocation: true
---

# Repo Hardening

Prepare the verification layer the repository actually needs. Adopt healthy existing tooling, repair relevant gaps, and record the commands and execution environment. User instructions and repository policy take precedence over these defaults (ADR 0009).

## 1. Inventory before changing anything

Inspect manifests, scripts, CI, formatter/linter/types/test configuration, hook managers, applicable `AGENTS.md`/`CLAUDE.md`, and the dirty tree. Detect the run command only if a runnable surface needs verification. In a monorepo, infer scope from the request and affected consumers; ask only when a consequential scope choice remains unresolved.

Run existing checks only in the authorized environment and within the agreed resource budget. Local execution, browser access, remote access and production operations are separate capabilities: a request to prepare a repo does not grant all of them. If execution is unavailable, inventory the commands and clearly report that their health is unverified.

## 2. Choose the smallest useful change

Report what is healthy, what fails, and what is missing. Reuse decisions and authorization already given. Ask before material unrequested policy/dependency changes or broad formatting; do not ask again for the same approved scope.

- Adopt existing config and the existing hook manager; never silently replace them or install a second manager.
- Add a formatter, linter, type checker or test runner only where it contributes to this repo's requested verification. One tool may cover several roles.
- Respect the repository's enforcement policy. Hooks and CI are options with different costs, not a mandatory pair for every repo. Reuse existing jobs and hooks; an authorized adjustment may modify them instead of adding duplicate jobs.
- Hooks and CI should enforce the same relevant contracts, but may use different scopes: quick staged-file checks, affected-package checks, and a broader release gate need not be identical commands.
- Do not format the whole repo as an incidental step. If explicitly wanted, keep that mechanical change separate.
- Do not hide failures with disabled rules or blanket ignores. Existing debt may use a documented tool-supported baseline or a clearly bounded scope, without claiming a full green gate. Fix new failures in the affected scope; report unrelated debt separately.

## 3. Record the project contract

Prefer an existing `AGENTS.md`, otherwise an existing `CLAUDE.md`, otherwise create `AGENTS.md`. If both exist, keep one canonical block and a pointer in the other (ADR 0003). Edit only your `<!-- repo-hardening:start -->` / `:end -->` region, or append it if absent. Preserve project-specific restrictions and work by others. Do not overwrite a customized block with generic defaults.

The block is a concise project contract, not a mandatory Specflow installation marker. Discover commands from the repo's scripts and CI, not from global examples. Use this shape, omitting inapplicable commands:

```markdown
<!-- repo-hardening:start -->
## Verification

- Environment: <local / CI / isolated remote checkout; authorization and resource limits>
- Format: <command and scope>
- Lint: <command and scope>
- Types: <command and affected consumers>
- Tests: <focused regression command; broader gate when warranted>
- Run/evidence: <authorized command or existing evidence source; n/a when inapplicable>
- Full gate: <optional command; when it is required>

Run checks required by the change and affected consumers. Documentation-only work
normally needs diff/link review, not application suites. Reuse passing results
for unchanged source, dependencies and relevant environment; report each check's
scope and any check not run. A build or deployment is a separate result.
Do not bypass required hooks. Do not disable checks or weaken assertions to hide a failure.
Existing tests may change for an accepted behavior change or an incorrect/coupled
test; explain why and preserve the still-required behavioral coverage.
After a failure, diagnose before retrying. Repeat only with a changed hypothesis,
input or environment. Expected TDD reds are not repair failures. If the same
cause repeats without progress, report the obstacle and continue independent work;
respect any explicit project attempt or resource budget.
<!-- repo-hardening:end -->
```

Old blocks remain valid project policy until an authorized migration. Updating the plugin does not rewrite them. Present the scoped policy diff when migrating; do not silently relax local release limits, security gates or execution restrictions.

## 4. Verify and deliver

Format the files you changed with the adopted formatter in the permitted environment. Run checks affected by the tooling/policy change; verify a hook or run command when that behavior changed and execution is authorized. Do not repeatedly run a green full suite for unchanged inputs.

Keep hardening separate from feature work. Stage only your paths, and commit/publish according to the task's delivery authorization and repo conventions. Preserve pre-existing dirty files. Report installed/adopted tooling, exact checks and environment, what remains unverified, and any required next action. A missing capability is a concrete limitation, not a reason to invent a green result.
