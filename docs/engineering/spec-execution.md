# spec-execution

Deliver a bounded accepted request with evidence and review of the actual candidate.

## When to use it

Use for an accepted spec, issue, ticket or written plan; a new spec ceremony is unnecessary when the contract is already clear.

## Behavior

- Discover repository commands from instructions, scripts and CI. A missing marker does not force hardening. Record source, starting state, review base and authorized delivery.
- Read relevant contracts, consumers and tests rather than recursively following every import. Resolve only consequential unknown decisions; reuse accepted answers.
- Check dependency readiness against the real base or an explicit integration plan. Parallelize independent work only with ownership and integration responsibility.
- Use appropriate regression tests and real evidence. Execute within environment/resource authorization; reuse valid results and distinguish tests, builds and deployments.
- Review a fixed commits/staged/working-tree snapshot, including relevant new files. Revalidate affected checks/evidence after review fixes and verify delivery matches the reviewed content.
- A returned source remains blocked while its defect is unresolved. An authorized implementer or publisher may correct it in place, verify the criterion, record why and clear the existing returned marker (ADR 0009).
- Deliver only what was authorized: local diff, commit, PR or expressly requested merge/deploy. A local spec may produce a PR; use Closes linkage only for a real issue.

## Source

The [skill instructions](../../skills/engineering/spec-execution/SKILL.md) define the full contract. Repository policy and the user's authorization take precedence over the defaults.
