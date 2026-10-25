# repo-hardening

Prepare useful verification without replacing healthy project tooling.

## When to use it

Use when verification tooling or policy needs work, not merely because a Specflow marker is absent.

## Behavior

- Inventory scripts, CI, hooks, checks, dirty work and the authorized execution environment before editing.
- Reuse authorization and existing decisions. Add or repair only the requested gaps; hooks and CI need not be a mandatory pair or run identical costly commands.
- Record scoped commands and environment in one canonical marker block, preserving project-specific constraints. Plugin upgrades do not migrate old blocks automatically.
- Allow legitimate test evolution without hiding regressions. Diagnose failures before retrying; expected TDD reds are not repair failures.
- Validate changed tooling in the permitted environment and report what was not run. Keep unrelated work out of the delivery.

## Source

The [skill instructions](../../skills/engineering/repo-hardening/SKILL.md) define the full contract. Repository policy and the user's authorization take precedence over the defaults.
