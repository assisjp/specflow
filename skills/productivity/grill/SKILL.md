---
name: grill
description: Stress-test a plan or decision by resolving consequential ambiguity, looking up facts and recommending choices against the user priorities. Use when asked to sharpen thinking, pressure-test an idea or grill a decision. Pass docs to capture meaningful glossary and architecture decisions.
disable-model-invocation: true
argument-hint: "[docs]  — add 'docs' to also write CONTEXT.md and ADRs"
---

# Grill

Stress-test a plan or decision before committing to it. Resolve the uncertainty that matters to the user's outcome; do not try to enumerate every imaginable branch.

## The interview

- Look up discoverable facts in the repository or tools instead of asking the user.
- Ask the next consequential question with a recommended answer and concrete trade-off. Reuse priorities and decisions already given. Group closely related short questions when it reduces effort; avoid a long questionnaire.
- Resolve upstream decisions before dependent ones. Challenge contradictions with the user's stated constraints, and ask only when evidence cannot resolve them.
- Judge options against the user's priorities, not generic best practice. Offer sensible defaults for routine reversible choices.
- Keep a compact decision log: decision → choice → reason, plus deliberately deferred items.

Grilling itself is discussion, not implicit permission to edit application code. Do not treat a vague conversational “yes” as new authority. If the user explicitly asks to implement the resolved work, recognize that changed scope and continue through the appropriate execution workflow using the existing authorization; do not demand another named skill command. A separate elaborate spec is unnecessary when the accepted request already defines an observable outcome.

## `docs` mode

When requested, use `domain-modeling` for settled vocabulary and meaningful architectural decisions. Create files lazily. An ADR is warranted only when the choice is hard to reverse, surprising without context and a real trade-off. Temporary hypotheses and ordinary implementation reasoning stay in the decision log or task record; not every “why” needs an ADR.

Without `docs`, keep the log in the conversation unless the user requests a saved artifact. Do not duplicate a durable source just to satisfy a template.

## Finish

Summarize the accepted outcome, important decisions and unresolved blockers. Stop when the relevant decisions are settled or deliberately deferred. Ask for a necessary decision if one remains; otherwise name or perform the next authorized action. Do not add a second approval solely to confirm that the previous approval was understood.
