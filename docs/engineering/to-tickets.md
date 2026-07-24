# to-tickets

Break a spec too big for one PR into **tracer-bullet tickets**, each declaring the tickets that block it, published in dependency order.

The dependency graph is explicit and declared — never inferred from titles. It orders the work; in specflow it deliberately does **not** parallelise it (coordination is out of scope — see the design principles). You work the frontier one ticket at a time.

## When to use it

- A spec is larger than a single reviewable PR.
- You need agent-grabbable units with clear blocking edges.
- Not for writing the spec (`to-spec`) or implementing a ticket (`spec-execution`).

## How it runs

1. **Gather context** — from the conversation, or a fetched spec/issue.
2. **Explore (optional)** — use the glossary vocabulary, respect ADRs, look for prefactoring ("make the change easy, then make the easy change").
3. **Draft vertical slices** — each cuts a narrow but complete path through every layer, is demoable on its own, and fits one fresh context window. Each declares its blocking edges. Wide mechanical refactors are the exception, sequenced expand → migrate → contract to keep CI green.
4. **Quiz you** — presents the breakdown (title, blocked-by, what it delivers) and iterates on granularity and edges until you approve.
5. **Publish** — native blocking links on a real tracker (GitHub `gh issue create`, Linear), or one file per ticket under `.scratch/<slug>/issues/`, numbered in dependency order.

## Related

- [to-spec](./to-spec.md) — produces the spec this skill slices.
- [spec-execution](./spec-execution.md) — implements each ticket on the frontier, context cleared between tickets.
