---
name: spec-execution
description: Execute one already-written specification (a .md file, PRD, or GitHub issue) into one reviewable PR, with closed scope and attached evidence. Delegates the test loop to tdd and the review to code-review, and reads the canonical commands from AGENTS.md. Use whenever the user asks to implement a spec, an issue, a ticket, or an already-written plan. Do not use to write the spec.
disable-model-invocation: true
---

# Spec Execution

Turn **one** specification into **one** reviewable PR.

This skill is a sequence, not a rulebook. The prohibitions (`--no-verify`, disabling lint, the attempt limit) live in the repo's `AGENTS.md` and hold always. Here is only the order of things.

It does **not** reimplement TDD or review — it calls `tdd` and `code-review`.

Human review happens **once**, on the final diff.

## 1. Contract

Read the verification block in `AGENTS.md` and extract the canonical commands.

**If it does not exist**: stop. Suggest running `repo-hardening` first. Do not improvise commands, install tooling, or continue.

## 2. Read before writing

Read the whole spec, every file it names, the files those import, and `CONTEXT.md` if it exists — before editing a single line.

- **Ambiguity that changes the result**: stop and ask. Do not guess.
- **Minor ambiguity**: decide, record it, deliver it in the report.

If the spec does not fit in one reviewable PR, say so now and propose the cut.

## 3. Closed scope

Implement exactly what the spec asks. Ugly code alongside, an obvious refactor, an unrelated bug, a stale dependency: **do not touch.** Note each in the out-of-scope findings list and deliver it in the report.

## 4. Implement

Use `tdd` at the seams agreed in the spec. The spec's test scenarios are the initial red. Tests in the same work as the implementation — never a separate task.

A spec scenario that is not testable as written: report it as a spec defect, do not write a test that verifies nothing.

## 5. Verify

Run the canonical commands. Fix. Repeat, within the attempt limit `AGENTS.md` defines.

## 6. Automated review

Run `code-review` over the diff, before the PR.

A finding is a **hypothesis, not a task**. Confirm each against the code before fixing — an automated reviewer errs with confidence, and fixing a non-existent bug costs a whole round. A false positive: do not fix it, record it with the justification.

## 7. One diff, one concern

- mechanical change (rename, move, format) separated from behavioural change — two clean commits or two PRs
- a non-trivial diff over ~400 lines: flag it and propose the cut
- re-read your own diff hunting for anything that entered without being in the spec, and remove it

## 8. Evidence

A change with an observable effect (UI, endpoint, flow, CLI): bring the app up for real, walk the spec's flow, capture a screenshot or real output, attach it to the PR.

A green test does not prove the feature appears — that is the class of error code review does not catch. With no observable effect, the test output is the evidence.

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
