---
name: code-review
description: Review the diff since a fixed point (commit, branch, tag, merge-base) along two independent axes — Standards (does it follow the repo's coding standards and avoid known smells?) and Spec (does it match what the originating issue/spec asked for?). Runs both as parallel sub-agents and reports them side by side. Use when reviewing a branch, a PR, work-in-progress changes, or when spec-execution reaches its review step.
---

# Code Review

A two-axis review of the diff between `HEAD` and a fixed point the user supplies:

- **Standards** — does the code follow the repo's documented standards and avoid known code smells?
- **Spec** — does the code faithfully implement the originating issue / spec?

The two axes run as **parallel sub-agents** so they do not pollute each other's context, then this skill aggregates their findings without merging them.

## Process

### 1. Pin the fixed point

Use whatever the user gave — a SHA, branch, tag, `main`, `HEAD~5`. If none, ask.

Capture the diff once with three-dot (compares against the merge-base): `git diff <fixed-point>...HEAD`, and the commit list: `git log <fixed-point>..HEAD --oneline`.

Confirm the ref resolves (`git rev-parse <fixed-point>`) and the diff is non-empty **before** spawning sub-agents. A bad ref or empty diff should fail here, not inside two agents.

### 2. Find the spec source

In order: (1) issue references in the commit messages (`#123`, `Closes #45`) — fetch with `gh issue view` where available; (2) a path the user passed; (3) a spec file under `docs/specs/` matching the branch or feature; (4) if nothing, ask. If the user says there is no spec, the Spec axis reports "no spec available" and is skipped. (Specs are versioned under `docs/specs/`, never `.scratch/` — see ADR 0006.)

### 3. Assemble the standards sources

Anything the repo documents about how code should be written — `CODING_STANDARDS.md`, `CONTRIBUTING.md`, `CLAUDE.md`. On top of whatever the repo documents, the Standards axis always carries the **smell baseline** below, under two rules:

- **The repo overrides.** A documented repo standard always wins; suppress a baseline smell where a repo standard endorses it.
- **Always a judgement call.** Each smell is a labelled heuristic ("possible Feature Envy"), never a hard violation — and skip anything tooling already enforces (formatter, linter, types).

Smell baseline (Fowler, *Refactoring* ch.3), each *what it is* → *fix*:

- **Mysterious Name** — name doesn't reveal what it does/holds → rename; if no honest name comes, the design is murky.
- **Duplicated Code** — same logic shape in more than one hunk → extract, call from both.
- **Feature Envy** — a method reaching into another object's data more than its own → move it onto the data it envies.
- **Data Clumps** — the same few fields travel together → bundle into one type.
- **Primitive Obsession** — a primitive standing in for a domain concept → give the concept its own small type.
- **Repeated Switches** — the same switch on the same type recurs → polymorphism, or one shared map.
- **Shotgun Surgery** — one logical change forces scattered edits → gather what changes together.
- **Divergent Change** — one module edited for several unrelated reasons → split by reason-to-change.
- **Speculative Generality** — abstraction/hooks for needs the spec doesn't have → delete, inline back.
- **Message Chains** — long `a.b().c().d()` navigation → hide behind one method.
- **Middle Man** — a unit that mostly just delegates → cut it, call the target direct.
- **Refused Bequest** — a subclass ignoring most of what it inherits → composition over inheritance.

### 4. Run both axes with clean, separate context

The two axes must not share context — cross-contamination is exactly what the separation exists to prevent. How you achieve that depends on the harness:

- **If it has parallel sub-agents** (e.g. Claude Code: one message, two `general-purpose` Agent calls) — spawn both at once. Fastest, and their contexts are isolated by construction.
- **If it does not** — run the two axes **sequentially, with a clean context between them**: complete the Standards pass, clear or set aside its working context, then run the Spec pass so the second axis is not primed by the first's findings. Slower, same guarantee.

Either way, give each axis only its own inputs:

**Standards sub-agent** — give it the diff command + commit list, the standards-source files from step 3, **and the full smell baseline pasted in** (it has no other access to it). Brief: "Report, per file/hunk: (a) every place the diff violates a documented standard — cite the file + rule; (b) any baseline smell — name it and quote the hunk. Distinguish hard violations from judgement calls; documented standards can be hard, baseline smells are always judgement calls and the repo overrides the baseline. Skip anything tooling enforces. Under 400 words."

**Spec sub-agent** — give it the diff command + commit list, the spec path/contents, and any **evidence artifact** (screenshot/output) the caller produced. Brief: "Report: (a) requirements the spec asked for that are missing or partial; (b) behaviour in the diff nobody asked for (scope creep); (c) requirements that look implemented but wrong; (d) if an evidence artifact is provided, whether it actually shows the acceptance criteria met — a green test is not that proof. Quote the spec line per finding. Under 400 words."

Skip the Spec sub-agent if there is no spec, and note it.

### 5. Aggregate

Present both reports under `## Standards` and `## Spec`, verbatim or lightly cleaned. **Do not merge or rerank** — the axes are deliberately separate. End with a one-line summary: findings per axis and the worst issue *within each axis*. Do not pick a single cross-axis winner — that reranking is exactly what the separation prevents.

## Why two axes

A change can pass one and fail the other:

- Follows every standard but implements the wrong thing → Standards pass, Spec fail.
- Does exactly what the issue asked but breaks conventions → Spec pass, Standards fail.

Reporting them separately stops one axis from masking the other.

## For the reviewer's consumer

When `code-review` is run inside `spec-execution`, remember: **a finding is a hypothesis, not a task.** Confirm each against the code before acting — an automated reviewer is confident and wrong often enough that fixing a phantom costs a whole round.
