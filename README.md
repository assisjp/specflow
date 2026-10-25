# specflow

A self-contained development workflow for Claude Code and Codex: clarify what matters, implement a bounded change, and verify the behavior with evidence. Process follows risk and the repository's policy; an accepted request does not need every stage.

## The flow

Use `grill` for unresolved decisions, `to-spec` for a durable specification, and `to-tickets` only when multiple deliverables help. `spec-execution` builds the accepted work with appropriate tests and `code-review`. `repo-hardening` improves verification when requested; its marker is not required to implement in an already healthy repo. `session-handoff` preserves a checkpoint when work must continue elsewhere.

Existing decisions and authorization carry forward. Routine reversible choices do not need repeated approval. Publication, merge, deployment and access to restricted environments remain governed by the user's request and repository policy.

## Skills

### User-invoked

These deliberate entry points retain their existing Claude/Codex invocation policy:

- [grill](./skills/productivity/grill/SKILL.md) — resolve consequential uncertainty and record accepted decisions; `docs` also uses domain modeling.
- [to-spec](./skills/engineering/to-spec/SKILL.md) — save a specification proportional to the change, without inventing requirements.
- [repo-hardening](./skills/engineering/repo-hardening/SKILL.md) — adopt or improve scoped checks and record where/how they may run.
- [spec-execution](./skills/engineering/spec-execution/SKILL.md) — implement accepted work, verify affected behavior and review the actual candidate.
- [to-tickets](./skills/engineering/to-tickets/SKILL.md) — create coherent deliverables and explicit dependencies only when needed.
- [session-handoff](./skills/productivity/session-handoff/SKILL.md) — save scope, source state, authorization, evidence and the next action before closing a session.

### Model-invoked

These utilities can be requested directly or selected for their documented task:

- [guide](./skills/productivity/guide/SKILL.md) — suggest the next step when the user asks which step to take; ordinary coding requests do not trigger a pipeline.
- [domain-modeling](./skills/engineering/domain-modeling/SKILL.md) — refine vocabulary and record meaningful architectural trade-offs.
- [tdd](./skills/engineering/tdd/SKILL.md) — red, green and useful refactoring with tests that observe behavior.
- [code-review](./skills/engineering/code-review/SKILL.md) — review a fixed committed, staged or working-tree candidate against standards and requested behavior.

## Install

Choose one primary discovery source per harness: the released plugin for normal use, or checkout links for development. Installing both can expose duplicate names or divergent versions. An update to one does not update the other; inspect provenance before changing links.

### Codex

```bash
codex plugin marketplace add assisjp/specflow --ref main
codex plugin add specflow@specflow
```

Start a new session after installation. To update with the supported CLI, refresh the marketplace (`codex plugin marketplace upgrade specflow`), reinstall `specflow@specflow`, and restart if the running session still serves the earlier version. Confirm the installed version rather than assuming a disk update changed every active skill.

### Claude Code

```text
/plugin marketplace add assisjp/specflow
/plugin install specflow@specflow
```

After updating the marketplace/plugin, reload plugins or start a fresh session so skills in one workflow use a consistent release.

### Development links

```bash
git clone https://github.com/assisjp/specflow
cd specflow
./scripts/link-skills.sh
```

The helper links promoted skills into `~/.claude/skills` and `~/.agents/skills`. Existing links to this exact checkout are left unchanged. Real files/directories and links to any other destination, including dangling links, are preserved and reported; replacement requires an explicit decision outside the helper. Optional positional target directories let you choose a project discovery directory or an isolated destination, for example `./scripts/link-skills.sh /path/to/project/.agents/skills`. It does not uninstall an existing plugin or delete stale links.

## Upgrading from 0.9.x

Version 0.10.0 keeps skill names, invocation metadata, marketplace identity, the `returned` label and `Returned:` local marker. It replaces universal process gates with scoped verification, actual candidate snapshots, accepted-decision reuse and retained handoffs. See [CHANGELOG](./CHANGELOG.md), [ADR 0009](./docs/adr/0009-adaptive-execution-policy.md) and [ADR 0010](./docs/adr/0010-retain-handoff-checkpoints.md).

Previously generated `AGENTS.md`/`CLAUDE.md` blocks are still repository policy. Plugin updates do not rewrite them or silently relax stricter limits. Migrate a block only within an authorized instruction change, preserving local execution environments, security gates, deployment limits and rules outside the markers. No extra configuration engine or profile file is required.

## Verification and evidence

Run the source checks in the environment authorized for the task:

```bash
npm run check
npm run eval
npm run test:links
claude plugin validate . --strict
```

The first commands validate structure, marker contracts and the actual link helper. They do not prove that an agent follows every instruction. [Focused behavioral scenarios](./docs/validation-0.10.md) describe the remaining human/agent evaluation, including tracker behavior. Reuse successful checks for unchanged inputs; report unrun checks accurately.

## Design principles

- A small useful check is better than a large ritual with no new signal. Broaden for affected consumers and concrete risks.
- Do not change tests to conceal a regression; do update them when an accepted contract changes while retaining required coverage.
- Review the same candidate you deliver. Revalidate only checks and evidence invalidated by later edits.
- Delegate independent work where it helps, with clear ownership and integration responsibility. No fixed agent count or model generation.
- Preserve work and decisions across sessions without creating documents for their own sake.

## License

MIT — see [LICENSE](./LICENSE).

Repository contributors: follow [AGENTS.md](AGENTS.md). The Claude project rule points to the same source; these contributor instructions are not plugin runtime context. See [Claude project rules](https://code.claude.com/docs/en/memory#organize-rules-with-clauderules).
