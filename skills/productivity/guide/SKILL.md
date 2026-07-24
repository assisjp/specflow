---
name: guide
description: The specflow router — map what the user is trying to do to the right specflow skill and the right point in the flow. Use whenever the user is unsure which step to take: "which skill do I use", "where do I start", "how do I begin", "what's next", "I want to add/build/implement X — where do I begin", "I have a spec/idea, now what", or any description of a coding task (a feature, a fix, setting up a repo, breaking down work) where they have NOT named a specflow skill themselves. Reads the situation, names the one skill to run now, and says why. When in doubt about which specflow skill applies, this is the one to reach for.
---

# specflow guide

Route the user to the right skill. Do not do the work — name the next skill, say why, and stop.

## The flow

```
grill ──▶ to-spec ──▶ to-tickets ──▶ spec-execution ──▶ human review ──▶ merge
  │           (decision      (only if       │
  └ domain-modeling            log)          too big     └ calls tdd + code-review,
    (grill docs)                             for 1 PR)      under repo-hardening's gates
                                    session-handoff ─ when you must stop mid-work
```

## Route by situation

| The user is… | Run | Why |
|---|---|---|
| unsure about a plan / decision, wants it stress-tested | **grill** (`grill docs` to also capture glossary + ADRs) | resolve ambiguity before code exists |
| pinning down domain terms or recording an architectural decision | **domain-modeling** | owns `CONTEXT.md` and ADRs |
| done deciding, wants the spec written | **to-spec** | synthesise the decision log into a published spec |
| holding a spec too big for one PR | **to-tickets** | slice into dependency-ordered tickets |
| setting up a repo for agent work (no linter/tests/CI) | **repo-hardening** | install the deterministic gate; write canonical commands |
| ready to build one spec/ticket into a PR | **spec-execution** | one spec → one reviewable PR, closed scope + evidence |
| building a feature/fix test-first | **tdd** | the red → green loop (usually invoked by spec-execution) |
| wanting a diff reviewed | **code-review** | two-axis Standards + Spec review |
| forced to stop mid-work | **session-handoff** | ephemeral handoff with git state for the next session |

## Rules

- **Name exactly one skill** — the next one, not the whole chain. The flow advances one step at a time.
- **If the repo has no verification block (in `AGENTS.md` or `CLAUDE.md`) and the user wants to build**, route to `repo-hardening` first — `spec-execution` refuses to run without it.
- **If a spec has come back twice**, do not route to `spec-execution` again — route to `grill`. A double return is a spec defect, not an execution one.
- **If the user already named a skill**, don't second-guess it — just confirm it fits and let them run it.
