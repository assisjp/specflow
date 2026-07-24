# 0004 — The utility skills are model-invoked, and accept ambient triggering

- **Status:** Accepted
- **Date:** 2026-07-24

## Context

Most specflow skills are user-invoked (`disable-model-invocation: true`) — the flow is deliberate, each step chosen. But three skills are invoked *by other skills*: `domain-modeling` (by `grill docs`), `tdd` and `code-review` (by `spec-execution`). A skill left user-invoked cannot be reliably reached by another skill programmatically, so a skill that promises to call one while it is user-invoked is making a promise it cannot keep — a bug we hit with `domain-modeling`.

## Decision

`domain-modeling`, `tdd`, and `code-review` are **model-invoked** (no `disable-model-invocation`), so the skills that delegate to them can actually reach them, and they are also directly usable on their own. The other skills remain user-invoked.

## Alternatives considered

- **Keep them user-invoked.** Consistent with the "deliberate flow" principle, but breaks skill-to-skill delegation — the whole reason `spec-execution` and `grill docs` exist as compositions.
- **Inline their content into the callers.** Removes the delegation but duplicates the discipline in several places and loses single ownership (`domain-modeling` owns `CONTEXT.md`/ADRs).

## Consequences

- **Easier:** delegation works; the utility skills are reachable both ways.
- **Accepted — ambient triggering:** because they are model-invoked with broad descriptions, the model may fire them outside the flow. `code-review` in particular will trigger on almost any casual "review this", making review an *ambient capability* rather than only a flow step. This is deliberate — review-on-demand is useful — but it changes the plugin's character from purely deliberate to partly ambient, which is why it is recorded here rather than left implicit. If ambient triggering ever becomes noise, the lever is to narrow the descriptions, not to re-disable invocation (which would rebreak delegation).
