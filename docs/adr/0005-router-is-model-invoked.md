# 0005 — The router (`guide`) is model-invoked

- **Status:** Accepted
- **Date:** 2026-07-24

## Context

`guide` is the router: it exists for the moment a user does not know which skill to use. But it was first shipped user-invoked (`disable-model-invocation: true`), which creates a discoverability paradox — to reach the router you must already know to type `/guide`, i.e. already know the router exists. Its own description promised to fire when "the user describes a task without naming a skill", a promise a user-invoked skill cannot keep. This is the same failure recorded in ADR 0004 for `domain-modeling`, one level up: a skill promising to activate in a situation where its invocation mode forbids it.

## Decision

`guide` is **model-invoked**. It surfaces when a user describes a specflow-shaped task without naming a skill, which is exactly the situation it exists to serve. Its description is scoped to "specflow-shaped" tasks to limit firing outside the flow.

## Alternatives considered

- **Keep it user-invoked, fix the description.** Honest, but leaves the router reachable only by those who already know it — near-useless for the newcomers it is meant to help.
- **Drop the router, rely on the README diagram.** The README serves readers of the repo; it does not help someone mid-conversation who is unsure what to run. The router's value is precisely in-session surfacing.

## Consequences

- **Easier:** the router does what it claims — it appears when someone is lost, without them needing to know it exists.
- **Accepted — ambient triggering:** as with ADR 0004, a model-invoked skill with a situational description may fire when unwanted. `guide` only routes and stops, so the cost of a stray firing is a one-line suggestion, not wasted work. If it becomes noisy, the lever is to narrow the description (as ADR 0004 established), not to re-disable invocation — which would reintroduce the paradox.
