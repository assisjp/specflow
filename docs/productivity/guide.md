# guide

Choose the smallest useful next step when the user asks which step to take.

## When to use it

Use for explicit routing questions; merely describing a coding task does not trigger this router.

## Behavior

- Route to grill, domain-modeling, to-spec, to-tickets, repo-hardening, spec-execution, tdd, code-review or session-handoff according to the actual need.
- A healthy repo without a marker can proceed using existing commands. Already accepted requirements do not need another interview or document.
- A returned marker denotes an unresolved specification defect. Resolve missing decisions; otherwise an authorized correction can heal the same source and clear the state after verification.
- Reuse scope and authorization. If continuing was requested, continue rather than requiring the user to invoke the whole chain.

## Source

The [skill instructions](../../skills/productivity/guide/SKILL.md) define the full contract. Repository policy and the user's authorization take precedence over the defaults.
