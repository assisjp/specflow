# guide

The specflow **router**. Describe what you are trying to do, and it names the one skill to run now — and where you are in the flow.

You do not need `guide` once the flow is familiar; the [README diagram](../../README.md) shows the same map. It exists for the moment you are staring at a task and unsure which door to open.

## When to use it

- "Which skill do I use for this?"
- "Where do I start?" / "What's next?"
- You describe a task without naming a skill.

## What it does

Reads the situation and routes to exactly one skill — the next step, not the whole chain — with the reason. It knows the flow's guard rails:

- If the repo has no verification block (in `AGENTS.md` or `CLAUDE.md`) and you want to build, it sends you to `repo-hardening` first — `spec-execution` refuses to run without it.
- If a spec has come back twice, it routes to `grill`, not `spec-execution` — a double return is a spec defect, not an execution one.
- If you already named a skill, it confirms rather than second-guesses.

## The flow it routes across

`grill` → `to-spec` → `to-tickets` (if too big for one PR) → `spec-execution` (calls `tdd` + `code-review`, under `repo-hardening`'s gates) → human review → merge. `domain-modeling` runs alongside `grill docs`; `session-handoff` catches you when you must stop mid-work.

## Related

Every specflow skill — `guide` is the index to all of them.
