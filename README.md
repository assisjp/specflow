# specflow

A self-contained, **reliability-first** agent development flow, shipped as a Claude Code plugin.

The bet is simple: the way to get reliable code out of agents while spending less is not to parallelise harder — it is to **decide well before building, verify deterministically, and review once**. specflow is the set of skills that encode that discipline.

## The flow

```
grill ──▶ to-spec ──▶ to-tickets ──▶ spec-execution ──▶ human review ──▶ merge
  │            │                          │
  └ domain-modeling (docs)                └ calls tdd + code-review, under repo-hardening's gates
```

1. **grill** — interrogate the plan until every decision holds. Emits a decision log.
2. **to-spec** — synthesise that log into a spec, published to your tracker.
3. **to-tickets** — break a large spec into dependency-ordered tickets.
4. **spec-execution** — turn one spec/ticket into one reviewable PR, with closed scope and attached evidence.
5. **session-handoff** — carry session state to the next session or tool when you have to stop.

Underneath: **repo-hardening** installs the deterministic verification layer (formatter, linter, types, tests, hooks, CI) so machines catch what agents should never have to.

## Status

specflow ships in phases — each phase a closed, usable slice. See [docs/adr/0001](./docs/adr/0001-own-self-contained-rewrite.md) for why.

| Phase | Skills | State |
|---|---|---|
| **1 — Spec pipeline** | `grill`, `domain-modeling`, `to-spec` | **shipped** |
| **2 — Execution** | `repo-hardening`, `spec-execution`, `tdd`, `code-review` | **shipped** |
| 3 — Scale & continuity | `to-tickets`, `session-handoff` | planned |

## Skills

### User-invoked

Reachable only when you type them (`disable-model-invocation: true`) — the flow is deliberate.

- [grill](./skills/productivity/grill/SKILL.md) — relentless interview that stress-tests a plan; challenges contradictions, scores options against your priorities, and emits a decision log. Pass `docs` to also write the glossary and ADRs.
- [domain-modeling](./skills/engineering/domain-modeling/SKILL.md) — actively build and sharpen the project's `CONTEXT.md` glossary and ADRs as you design.
- [to-spec](./skills/engineering/to-spec/SKILL.md) — turn a settled conversation into a spec and publish it, no interview.
- [repo-hardening](./skills/engineering/repo-hardening/SKILL.md) — install the deterministic verification layer (formatter, linter, types, tests, hooks, CI) without breaking what exists, and record the canonical commands in `AGENTS.md`.
- [spec-execution](./skills/engineering/spec-execution/SKILL.md) — turn one spec/issue into one reviewable PR: closed scope, evidence attached, reviewed once.

### Model-invoked

The utility layer — invokable directly or mid-flow by `spec-execution`.

- [tdd](./skills/engineering/tdd/SKILL.md) — the red → green loop, done so the tests are worth keeping.
- [code-review](./skills/engineering/code-review/SKILL.md) — two-axis review (Standards + Spec) in parallel sub-agents, reported side by side.

## Install

specflow is its own Claude Code marketplace (a single-plugin repo).

```bash
# add the marketplace, then install the plugin
/plugin marketplace add assisjp/specflow
/plugin install specflow@specflow
```

Or link the skills straight into your local harness skill directory for development:

```bash
git clone https://github.com/assisjp/specflow
cd specflow
./scripts/link-skills.sh
```

## Design principles

- **Quality and throughput are separate problems.** specflow buys quality (spec contract, small PR, tests alongside, evidence gate, human merge). It deliberately does not build the coordination layer (DAG, waves, parallel worktrees) — that buys wall-clock, which is the lowest priority here.
- **The biggest lever is the deterministic layer.** Every error a linter catches is an agent cycle and a human review saved.
- **Review once.** One verified diff with closed scope and attached evidence, reviewed once — not granular reviews that multiply rounds.
- **Compose, don't fork.** These skills are original, self-contained work; they take inspiration widely and depend on nothing external.

## License

MIT — see [LICENSE](./LICENSE).
