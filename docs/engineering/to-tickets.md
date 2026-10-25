# to-tickets

Split genuinely larger work into verifiable deliverables with explicit dependencies.

## When to use it

Use when separate outcomes make execution safer or clearer; do not split solely to satisfy a line limit.

## Behavior

- Reuse the source and accepted breakdown. Include only layers a slice needs; prefactoring requires a concrete reason.
- For wide refactors, use expand/migrate/contract when necessary. Tests are consumers and legitimate expectations can migrate. An explicit integration branch may defer the combined gate to its final step.
- Independent tickets can run concurrently with explicit ownership and integration responsibility. Check blockers in the actual base; checkboxes alone are not proof.
- Present consequential granularity/edge decisions once. Publish only as authorized, using actual connector/API/CLI capabilities for native links or explicit textual blockers otherwise.
- Healing mode repairs one returned ticket in place without re-slicing neighbors. Verify the accepted correction before clearing the marker; an authorized implementer may do the same (ADR 0009).

## Source

The [skill instructions](../../skills/engineering/to-tickets/SKILL.md) define the full contract. Repository policy and the user's authorization take precedence over the defaults.
