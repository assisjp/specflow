---
name: spec-execution
description: Execute one already-written specification (a .md file, PRD, or GitHub issue) into one reviewable PR, with closed scope and attached evidence. Delegates the test loop to tdd and the review to code-review, and reads the canonical commands from the repo's agent-context file (AGENTS.md or CLAUDE.md). Use whenever the user asks to implement a spec, an issue, a ticket, or an already-written plan. Do not use to write the spec.
disable-model-invocation: true
---

# Spec Execution

Turn **one** specification into **one** reviewable PR.

This skill is a sequence, not a rulebook. The prohibitions (`--no-verify`, disabling lint, the attempt limit) live in the repo's verification block (`AGENTS.md` or `CLAUDE.md`, per ADR 0003) and hold always. Here is only the order of things.

It does **not** reimplement TDD or review — it calls `tdd` and `code-review`.

Human review happens **once**, on the final diff.

## 1. Contract

Read the verification block from the repo's agent-context file — `AGENTS.md`, or `CLAUDE.md` if that is where the harness loads it and the block lives there. Extract the canonical commands, including the **Run** command for the evidence gate.

**If no block exists**: stop. Suggest running `repo-hardening` first. Do not improvise commands, install tooling, or continue.

## 2. Read before writing

Read the whole source — a spec, a PRD, or a **ticket** (in no-tracker mode you are run once per ticket from `docs/tickets/<slug>/`, and that ticket is the spec for this PR) — every file it names, the files those import, and `CONTEXT.md` if it exists, before editing a single line. Note the source's path; step 7 hands it to `code-review`.

**First, check the source for a return marker** — a `returned` label on the issue (`gh issue view`), or a `Returns:` line in the local ticket/spec file. If it is marked, this spec has already come back once: do **not** implement — go straight to the second-failure rule below. The marker is what makes that rule a gate instead of relying on someone remembering (see the rule for why).

- **Ambiguity that changes the result**: stop and ask. Do not guess. If the answer is that the spec itself is defective and must be rewritten, **mark the source** (see *Returning the source* below) before handing it back.
- **Minor ambiguity**: decide, record it, deliver it in the report.

If the spec does not fit in one reviewable PR, say so now and propose the cut.

## 3. Closed scope

Implement exactly what the spec asks. Ugly code alongside, an obvious refactor, an unrelated bug, a stale dependency: **do not touch.** Note each in the out-of-scope findings list and deliver it in the report.

## 4. Implement

Use `tdd` at the seams agreed in the spec. The spec's test scenarios are the initial red. Tests in the same work as the implementation — never a separate task.

A spec scenario that is not testable as written: **mark the source** (see *Returning the source* below), then report it as a spec defect. Do not write a test that verifies nothing.

## 5. Verify

Run the canonical commands. Fix. Repeat, within the attempt limit the verification block defines. If you hit the limit and the blocker is the spec (not the code), **mark the source** (see *Returning the source* below) before you stop and report.

## 6. Evidence

Produce the evidence **before** the review — so someone other than the implementer looks at it. That someone is the review in step 7, not just the human at merge; capturing evidence after review would leave the human as its only reader, which is the moment you wanted it caught before.

A change with an observable effect (UI, endpoint, flow, CLI): bring the app up **with the canonical `Run` command from step 1** — do not guess a command; guessing is exactly what step 1 exists to prevent. Walk the spec's flow, capture a screenshot or real output, save it where the PR can reference it.

A green test does not prove the feature appears — that is the class of error code review does not catch. If the `Run` command is `n/a` (no runnable surface), the test output is the evidence.

## 7. Automated review

Run `code-review` over the diff, **passing it the source path from step 2** (the spec or ticket) and the evidence artifact from step 6 — so its Spec axis never has to guess the source and cannot silently skip. It then **checks the evidence against the acceptance criteria** — a second pair of eyes on the observable behaviour, not just a green check.

A finding is a **hypothesis, not a task**. Confirm each against the code before fixing — an automated reviewer errs with confidence, and fixing a non-existent bug costs a whole round. A false positive: do not fix it, record it with the justification.

**Where a smell falls decides who owns it** — this is the refactor beat that `tdd` defers to review:

- A smell **inside the diff** (code this work introduced or touched) is *in scope* — clean it up here. This is the "refactor" of red-green-refactor; it is not scope creep, it is finishing your own change.
- A smell **outside the diff** (pre-existing code you did not touch) is *out of scope* — do not fix it. Add it to the out-of-scope findings list from step 3 and deliver it in the report.

The line is the diff boundary, not the file. Without this rule a smell in new code falls in a gap — fixing it looks like a §3 scope violation, not fixing it drops TDD's third beat.

## 8. One diff, one concern

- mechanical change (rename, move, format) separated from behavioural change — two clean commits or two PRs
- a non-trivial diff over ~400 lines: flag it and propose the cut
- re-read your own diff hunting for anything that entered without being in the spec, and remove it

## 9. Deliver

Commit describing the behavioural change, not the file touched. Push to the spec's branch. Open a PR referencing the issue, with what changed, how to verify, and the evidence.

**Do not merge.** The merge is the human's.

## 10. Report

```
Spec:              <file or issue>
Implemented:       <1-3 lines>
Out-of-scope found: <list, or "none">
Decisions taken:   <or "none">
Code-review:       <fixed / discarded with reason>
Checks:            <result of each>
Evidence:          <what was attached>
Diff:              <lines>
PR:                <link>
```

## The second-failure rule

A spec that has already come back once: **do not reimplement.** A double return is a specification defect, not an execution one. Point out which part was ambiguous or had a non-verifiable criterion, and send it back for a rewrite — preferably to a fresh `grill` session. Relaunching with more context is the most expensive way to discover the problem was the text.

### Returning the source

**Every time you hand a source back as defective — at step 2, 4, 5, or here — mark it durably first**, so the *next* session enforces the rule without anyone remembering. This is the write half of the gate; step 2 is the read half. The mark must survive the session that dies, exactly like ADR 0006's durable artifacts:

- **Tracker** → add a `returned` label to the issue and a comment naming the non-verifiable part.
- **Local** → add a `Returned: spec-defect — <reason>` line at the top of the spec/ticket file.

The marker is a **state, not a counter** (ADR 0008): a source is either `returned` (sent back as a spec defect, not yet rewritten) or it is not. It is written only when the blocker is the *spec*, not the code, so step 2 refusing on its mere presence is correct — retrying against an unchanged spec is pointless.

Marking is not optional and not only for the second return — the *first* return is what the next session reads. Skip it and the gate reads a marker nothing wrote, and the rule collapses back to advice.

**The exit:** `spec-execution` **sets** this marker; `to-spec` **clears** it when it republishes the rewritten spec (ADR 0008). You do not clear it here — if you cleared your own marker, healing would be back to memory-dependent. Heal the spec through `grill` → `to-spec`, and republishing is what releases the gate.
