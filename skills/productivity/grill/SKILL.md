---
name: grill
description: A relentless interview that stress-tests a plan, design, or decision before any code is written — one question at a time, each with a recommended answer, walking the full decision tree until nothing is left ambiguous. It challenges choices that contradict your own stated principles, scores options against your declared priorities, and ends by emitting a decision log the rest of the pipeline can consume. Pass `docs` to also capture the durable glossary and architectural decisions as you go. Use when the user wants to sharpen thinking, pressure-test an idea, align on scope before building, or says "grill me".
disable-model-invocation: true
argument-hint: "[docs]  — add 'docs' to also write CONTEXT.md and ADRs"
---

# Grill

Interview the user relentlessly until you both reach a shared understanding they can build from. Walk down every branch of the decision tree, resolving dependencies between decisions one at a time.

The goal is not to be agreeable. It is to find the ambiguity, the contradiction, and the unexamined trade-off *before* they become code.

## The loop

1. **One question at a time.** Asking several at once is bewildering and lets the hard one hide behind the easy ones. Ask, wait for the answer, then ask the next.

2. **Recommend an answer to every question.** Never ask a bare question. State your recommended choice and the reason, so the user is reacting to a proposal, not staring at a blank field. A question without a recommendation is you offloading the thinking you were asked to do.

3. **Facts you look up. Decisions you ask.** If something can be discovered by exploring the environment — filesystem, git, tools, docs, existing code — look it up instead of asking. Only genuine decisions, where the answer is the user's judgment and not a fact, get put to them. Asking the user a question you could have answered yourself wastes the session.

4. **Resolve dependencies in order.** Find the most upstream decision — the one the others hang off — and settle it first. Do not ask a downstream question whose framing depends on an answer you do not have yet.

5. **Do not act until the user confirms shared understanding.** Grilling produces alignment, not artifacts (unless `docs` is passed — see below). Present the resolved picture and get an explicit go before building anything.

## The four sharpeners

These are what separate a real grilling from a polite Q&A. Apply all four throughout.

### Challenge contradictions

When a choice contradicts a principle, priority, or earlier decision the user *themselves* stated, stop and confront it before accepting it. Do not quietly comply with a self-contradiction — name it, quote the principle back, and ask them to either reconcile it or knowingly override it.

> "You picked X, but earlier you said your top priority is Y, and X trades Y away. Which one gives?"

Often the user is reaching for a real need by the wrong means; surfacing the contradiction lets you find the means that actually serves it. This is the single highest-value move in the whole skill — a grilling that never pushes back is theatre.

### Score against declared priorities

Early on, get the user's priorities in explicit order (reliability, cost, effort, speed — whatever they are). From then on, evaluate every option **against that order**, not against generic "best practice". When two options trade off, say which priority each one serves and let the ranking decide. Make the priorities do the work.

If the user has not declared priorities yet, that is itself the first question.

### Prefer structured choices

When a decision has a small set of discrete options, present them as an explicit list — recommended option first, each with its trade-off — rather than an open-ended prose question. Structured options converge faster and make the trade-off visible. Reserve open questions for genuinely open-ended judgment. (If your harness has a native structured-question affordance, use it; otherwise a tight numbered list is fine.)

### Keep a running decision log

Track every settled decision as you go: **decision → choice → reason**. When you reach shared understanding, emit the log as a compact table. This is not a nicety — it is the handoff artifact. The next step in the pipeline (a spec, a plan, an implementation) consumes it directly, so the reasoning does not evaporate into chat scrollback.

## `docs` mode

If the user passes `docs`, also maintain the durable record as decisions crystallise — invoke the `domain-modeling` skill and follow it: write the glossary to `CONTEXT.md` inline as terms resolve, and offer an ADR only when a decision is hard to reverse, surprising without context, and the result of a real trade-off. Without `docs`, the decision log stays in the conversation and feeds the next skill; nothing is written to the repo.

Keep the two artifacts distinct: the **decision log** is the ephemeral trail of this session; **ADRs** are the durable subset that will still matter months from now. A log entry that would still need explaining in six months is an ADR in disguise — promote it.

## Reaching the end

You are done when every branch of the tree is resolved and the user has explicitly confirmed the shared understanding — not before. Then present:

- the decision log (table)
- any open items that were deliberately deferred, and why
- the concrete next action

Then stop and wait for the go-ahead.
