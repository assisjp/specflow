# grill

A relentless interview that stress-tests a plan, design, or decision **before** any code is written.

Most "let's align" conversations end too early — the easy questions get answered and the hard, load-bearing one slips through. `grill` is built to stop that. It walks the whole decision tree, one question at a time, and refuses to declare alignment until every branch is resolved and you have explicitly confirmed it.

## When to use it

- Before writing a spec, to make sure the plan actually holds.
- When a decision feels 80% settled and you suspect the last 20% hides the risk.
- Any time you say "grill me" or "pressure-test this".

## How it runs

- **One question at a time**, each with a **recommended answer** and the reason for it — you react to a proposal, never a blank field.
- **Facts are looked up, decisions are asked.** If the answer is discoverable in the repo or tools, `grill` finds it rather than asking you.
- **It does not act until you confirm** a shared understanding.

## What makes it different

Four things a polite Q&A skips:

1. **Challenges contradictions.** If a choice contradicts a priority or principle you yourself stated, it stops and confronts it — instead of quietly writing down the inconsistency.
2. **Scores against your priorities.** You declare your priority order once (say: reliability, then cost, then effort, then speed); every option is then judged against *that*, not generic best practice.
3. **Prefers structured choices.** Discrete decisions come as recommended-first option lists with visible trade-offs, so you converge faster.
4. **Emits a decision log.** At the end you get a compact *decision → choice → reason* table — the artifact the next step (`to-spec`) consumes directly.

## `docs` mode

Pass `docs` to also capture the durable record as you go: `grill docs` invokes [domain-modeling](../engineering/domain-modeling.md) to write the `CONTEXT.md` glossary inline and offer an ADR when a decision is hard to reverse, surprising, and a real trade-off. Without `docs`, the decision log stays in the conversation and nothing is written to the repo. Either way `grill` **never writes source or tests** — not even once the design feels settled, and not on a broad "yes, go ahead". Building belongs to `spec-execution`, after a spec exists; `docs` widens the output to `CONTEXT.md` and ADRs and no further.

## Related

- [domain-modeling](../engineering/domain-modeling.md) — the durable-docs half of `grill docs`.
- [to-spec](../engineering/to-spec.md) — consumes the decision log to write the spec.
