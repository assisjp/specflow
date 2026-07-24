---
name: session-handoff
description: Compact the current session into an ephemeral handoff document so another session or tool can pick the work up once and continue. Records session state and git state, references durable artifacts by path instead of duplicating them, and suggests which skills to run next. Use when you have to stop mid-work and hand off, or the user asks for a handoff. Not for durable project state — that lives in ADRs, the glossary, the spec, and the tracker.
disable-model-invocation: true
argument-hint: "[what the next session will focus on]"
---

# Session Handoff

Write an **ephemeral** handoff so a fresh agent can resume this work. The handoff is consumed once and then dies — it is session state, not a durable record.

Durable truth already has owners: architectural decisions live in ADRs, vocabulary in `CONTEXT.md`, requirements in the spec, verification commands in the block (`AGENTS.md` or `CLAUDE.md`), and tasks in the tracker. The handoff does not compete with any of them. **State goes in the handoff; decisions go in an ADR.**

## Where it writes

Write to `.scratch/handoffs/<short-slug>.md`. **First, guarantee `.scratch/` is in `.gitignore`** — if it is not, add it before writing. A handoff swept into a PR by the next `spec-execution` run is a leak, not a handoff.

## What goes in it

Reference durable artifacts by path or URL — never duplicate a spec, ADR, or issue body. But a path only resolves if the receiving session sees the same version of the tree, so record the **git state** that pins it:

```markdown
# Handoff — <one-line topic>

## Focus of the next session
<If the user passed an argument, this is it: what the next session should do.>

## Git state
- Branch: <branch>
- HEAD: <short SHA>
- Dirty files: <list, or "clean">
- Unpushed commits: <count, or "none">

## Where things stand
<2-6 lines of session state: what was being done, what is half-done, what
just broke. State, not decisions.>

## Artifacts (by reference, not copied)
- Spec: <path or issue URL>
- ADRs touched: <paths>
- Relevant files: <paths>

## Open threads
<What is unresolved and needs a decision or a next step.>

## Suggested skills
<Which skills the next session should invoke, e.g. `spec-execution <issue>`,
`grill` to resolve an open decision.>
```

## Rules

- **State, not decisions.** A decision that will still matter months from now is an ADR, not a handoff line. If a handoff item survives **three sessions** without becoming action, it is a decision disguised as state — promote it to an ADR (via `domain-modeling`) and drop it from the handoff.
- **Reference, don't duplicate.** Paths and URLs, pinned by the git state above. Copying content means it goes stale the moment the source changes.
- **Redact secrets.** No API keys, passwords, tokens, or PII in the handoff.
- **Keep it short.** A handoff nobody can read in a minute is one the next session skims and mistrusts.
