# domain-modeling

Actively build and sharpen your project's **domain model** — its vocabulary and its architectural decisions — as you design.

This is the *active* discipline. Reading `CONTEXT.md` to reuse a term is a one-line habit any skill can do. `domain-modeling` is for when you are *changing* the model: challenging a fuzzy word, inventing an edge-case scenario that forces precision, and writing the result down the moment it crystallises.

## When to use it

- Pinning down terminology so code and conversation speak the same language.
- Recording an architectural decision that will be surprising without context later.
- As the docs half of [`grill docs`](../productivity/grill.md).

## What it does

- **Challenges the glossary.** A term that conflicts with existing `CONTEXT.md` language gets flagged on the spot.
- **Sharpens fuzzy words.** "Account" → is that the Customer or the User? It makes you choose one canonical name.
- **Stress-tests with scenarios.** Concrete edge cases probe where one concept ends and the next begins.
- **Cross-references code.** If what you say contradicts what the code does, it surfaces the contradiction.
- **Writes inline.** Resolved terms go straight into `CONTEXT.md` — a glossary, never a spec or scratch pad.

## Ownership

`domain-modeling` owns `CONTEXT.md` and `docs/adr/`. No other specflow skill creates or edits them. It offers an ADR **only** when a decision is hard to reverse, surprising without context, *and* a real trade-off — otherwise it skips it.

## Related

- [grill](../productivity/grill.md) — `grill docs` drives this skill during an interview.
- [to-spec](./to-spec.md) — uses the glossary vocabulary when writing the spec.
