---
name: guide
description: The specflow router — map what the user is trying to do to the right specflow skill and the right point in the flow. Use when the user explicitly signals they do not know which step to take: "which specflow skill do I use", "where do I start with this", "how do I begin", "what's next in the flow", "I have a spec/idea — now what". The trigger is the user asking *which step*, not merely describing a coding task — a plain "write a function that slugs a string" is not a routing request and must not surface this. Reads the situation, names the one skill to run now, and says why.
---

# specflow guide

Use this router when the user asks which step to take. A plain coding request is not a routing request; do the authorized work instead of turning every task into a pipeline.

| Situation | Useful next skill |
|---|---|
| A consequential plan/decision needs clarification | `grill` |
| Domain vocabulary or an architectural decision is changing | `domain-modeling` |
| Accepted requirements need a saved specification | `to-spec` |
| Work genuinely needs multiple deliverables | `to-tickets` |
| The user wants verification tooling/policy prepared | `repo-hardening` |
| An accepted spec, ticket or written request is ready to implement | `spec-execution` |
| Test-first development is requested or useful | `tdd` |
| A candidate diff needs review | `code-review` |
| A risky change needs iterative reviewer convergence | `review-loop` |
| Continuing another agent's branch, PR, or handoff | `takeover` |
| An authorized reviewed change needs a PR | `file-pr` |
| An existing PR needs reassessment, rebase, or monitoring | `pr-maintenance` |
| Work must survive closing this session | `session-handoff` |

Name the smallest useful next step and why. Reuse accepted decisions and authorization; do not require the user to invoke the whole chain. If the request includes continuing, continue within that scope. Do not install tooling just because a verification marker is absent: discover the existing repo contract first.

Read a `returned` label or `Returned:` line as an unresolved specification defect. When the marked decision remains unknown, a focused question or `grill` can resolve it. When the correction is accepted, `to-spec`, `to-tickets` or an authorized `spec-execution` may correct the same source and clear the `returned` label or delete the `Returned:` line after verifying the defect is healed (ADR 0009). Do not route already-settled work through another interview. The marker is not a failure counter or permission to bypass a real blocker.
