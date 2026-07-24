---
name: domain-modeling
description: Actively build and sharpen a project's domain model as you design — challenge fuzzy terms, invent edge-case scenarios, and write the glossary and architectural decisions down the moment they crystallise. Use when the user wants to pin down domain terminology or a ubiquitous language, record an architectural decision, or when another skill (such as grill in docs mode) needs to maintain the domain model. This is the active discipline of *changing* the model — merely reading CONTEXT.md for vocabulary is a one-line habit, not this skill.
---

# Domain Modeling

Actively build and sharpen the project's domain model as you design. This is the *active* discipline — challenging terms, inventing edge-case scenarios, and writing the glossary and decisions down the moment they crystallise. Use it when you are changing the model, not just consuming it.

## File structure

Most repos have a single context:

```
/
├── CONTEXT.md
├── docs/
│   └── adr/
│       ├── 0001-event-sourced-orders.md
│       └── 0002-postgres-for-write-model.md
└── src/
```

If a `CONTEXT-MAP.md` exists at the root, the repo has multiple bounded contexts, and the map points to where each one lives:

```
/
├── CONTEXT-MAP.md
├── docs/adr/                         ← system-wide decisions
├── src/
│   ├── ordering/
│   │   ├── CONTEXT.md
│   │   └── docs/adr/                 ← context-specific decisions
│   └── billing/
│       ├── CONTEXT.md
│       └── docs/adr/
```

Create files lazily — only when you have something to write. No `CONTEXT.md` yet? Create it when the first term resolves. No `docs/adr/`? Create it when the first ADR is warranted.

## During the session

### Challenge against the glossary

When the user uses a term that conflicts with the language already in `CONTEXT.md`, call it out immediately. "Your glossary defines 'cancellation' as X, but you seem to mean Y — which is it?"

### Sharpen fuzzy language

When the user uses a vague or overloaded term, propose a precise canonical one. "You said 'account' — do you mean the Customer or the User? Those are different things."

### Stress-test with concrete scenarios

When domain relationships are on the table, invent specific scenarios that probe the edges and force precision about where one concept ends and the next begins.

### Cross-reference with the code

When the user states how something works, check whether the code agrees. On a contradiction, surface it: "Your code cancels whole Orders, but you just said partial cancellation is possible — which is right?"

### Update CONTEXT.md inline

When a term resolves, write it to `CONTEXT.md` right there — do not batch. `CONTEXT.md` is a glossary and nothing else: no implementation details, no spec, no scratch pad, no decisions. Use the format in [CONTEXT-FORMAT.md](./CONTEXT-FORMAT.md).

### Offer ADRs sparingly

Offer an ADR only when all three hold:

1. **Hard to reverse** — changing your mind later carries real cost.
2. **Surprising without context** — a future reader will wonder "why did they do it this way?"
3. **The result of a real trade-off** — there were genuine alternatives and one was chosen for specific reasons.

If any of the three is missing, skip it. Use the format in [ADR-FORMAT.md](./ADR-FORMAT.md).
