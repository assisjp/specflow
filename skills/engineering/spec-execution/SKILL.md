---
name: spec-execution
description: Execute one already-written specification (a .md file, PRD, or GitHub issue) into one reviewable PR, with closed scope and attached evidence. Delegates the test loop to tdd and the review to code-review, and reads the canonical commands from the repo's agent-context file (AGENTS.md or CLAUDE.md). Use whenever the user asks to implement a spec, an issue, a ticket, or an already-written plan. Do not use to write the spec.
disable-model-invocation: true
argument-hint: "[spec path or issue #]"
---

# Spec Execution

Turn **one** specification into **one** reviewable PR.

This skill is a sequence, not a rulebook. The prohibitions (`--no-verify`, disabling lint, the attempt limit) live in the repo's verification block (`AGENTS.md` or `CLAUDE.md`, per ADR 0003) and hold always. Here is only the order of things.

It does **not** reimplement TDD or review — it calls `tdd` and `code-review`.

Human review happens **once**, on the final diff.

## 1. Contract

Read the verification block from the repo's agent-context file — `AGENTS.md`, or `CLAUDE.md` if that is where the harness loads it and the block lives there. Extract the canonical commands, including the **Run** command for the evidence gate.

**The file must be in the repository** — tracked by git, in this working tree. A user-level or global `CLAUDE.md` is not it, however faithfully the harness loads it: it describes its author's habits across every project, not this repo's contract, and the commands it names (`npm test`, `npm run lint`) routinely do not exist here. Borrowing them is the improvisation this step exists to prevent, wearing the costume of a contract. `git ls-files` decides what counts, not `find`.

**If no block exists**: stop. Suggest running `repo-hardening` first. Do not improvise commands, install tooling, or continue.

## 2. Read before writing

Read the whole source — a spec, a PRD, or a **ticket** (in no-tracker mode you are run once per ticket from `docs/tickets/<slug>/`, and that ticket is the spec for this PR) — every file it names, the files those import, and `CONTEXT.md` if it exists, before editing a single line. Note the source's path; step 7 hands it to `code-review`.

**First, check the source for a return marker** — a `returned` label on the issue (`gh issue view <n> --json labels`), or a `Returned:` line in the local ticket/spec file. Read it **per issue**, never through a `gh issue list --label returned` filter: GitHub's label index lags writes by seconds (`to-tickets` hits the same lag after bulk creation), so a filtered read can miss a marker that was just set and wave a defective spec straight through. If the source is marked, it was already sent back as a spec defect and not yet healed: do **not** implement — go straight to the second-failure rule below. The marker is what makes that rule a gate instead of relying on someone remembering (see the rule for why). The way out is to heal the source and republish it — `to-spec` for a spec, `to-tickets` for a ticket — because republishing is what clears the marker (ADR 0008). If the source has not actually been rewritten yet, that healing starts with a fresh `grill`.

**Then check the source's blocking edges.** A ticket carries `Blocked by: #N` (or "None — can start immediately") because `to-tickets` declares the dependency graph there, and its rule is to work the **frontier**: a ticket whose blockers are all *done*. Done means merged, not "a PR exists" — an open PR can still change in review. If a blocker is unfinished, **stop** and name it: which blocker is open, and that it is the ticket to run first. Do not build on it anyway. Basing this PR on an unmerged branch produces a diff whose base is another open PR — not independently reviewable, which is the one thing this skill promises, and its base moves if that review changes anything. The graph is declared in the ticket; reading it is your half.

**How to tell that a blocker is done**, because "merged" has to be observable or this check is a guess:

- **Tracker** — the blocker's issue is closed *and* the pull request that closed it is merged (`gh issue view <n> --json state,closedByPullRequestsReferences`). A closed issue alone does not mean merged; someone may have closed it by hand. This is why step 9 writes `Closes #N` rather than a loose mention — the linkage the closer needs is created by the opener.
- **Local** — there is no PR to merge. The blocker is done when its work is already in the branch you are building from: the behaviour its acceptance criteria describe passes against your base, checked with the canonical test command, not inferred from the ticket file. Nothing updates a local ticket's status field or its checkboxes, so neither is evidence of anything.

**If you cannot observe it either way, stop and ask** — which is cheap, whereas guessing "probably done" produces exactly the stacked, unreviewable diff this check exists to prevent.

- **Ambiguity that changes the result**: stop and ask. Do not guess. **Then write the answer back into the source** — the criterion it settles is now part of the spec, and an answer that lives only in this conversation dies with it: the next session reads the same ambiguous line and asks the same question. On a tracker, a comment recording the decision is enough. **Locally there are no comments** — append the decision to the source file instead, dated and marked as an implementation note. Appending is not rewriting: the body still belongs to its publisher (`to-spec`, `to-tickets`), and a note added below it clobbers nothing, which is why the ownership rule permits it. Saying "the file is not mine" and writing nowhere would leave the answer in the conversation, which is the failure this whole clause exists to close. If the ambiguity was a criterion that cannot be verified as written, the criterion itself must be rewritten, which makes the source defective — **mark it** (see *Returning the source* below) and hand it back for the republisher to heal. Answering in chat and implementing anyway leaves a criterion that can never go green.
- **Minor ambiguity**: decide, record it, deliver it in the report.

If the spec does not fit in one reviewable PR, say so now and propose the cut. Estimate the diff the spec implies against the same ~400-line figure §8 measures on the real one: plainly beyond it, propose the cut here rather than discover it there. The estimate is a prompt to think, never a refusal — pre-implementation sizing is imprecise, some specs implement small, and §8 remains the backstop.

## 3. Closed scope

Implement exactly what the spec asks. Ugly code alongside, an obvious refactor, an unrelated bug, a stale dependency: **do not touch.** Note each in the out-of-scope findings list and deliver it in the report.

## 4. Implement

Use `tdd` at the seams agreed in the spec. The spec's test scenarios are the initial red. Tests in the same work as the implementation — never a separate task.

A spec scenario that is not testable as written: **mark the source** (see *Returning the source* below), then report it as a spec defect. Do not write a test that verifies nothing.

## 5. Verify

Run the canonical commands. Fix. Repeat, within the attempt limit the verification block defines. If you hit the limit and the blocker is the spec (not the code), **mark the source** (see *Returning the source* below) before you stop and report.

## 6. Evidence

Produce the evidence **before** the review — so someone other than the implementer looks at it. That someone is the review in step 7, not just the human at merge; capturing evidence after review would leave the human as its only reader, which is the moment you wanted it caught before.

A change with an observable effect (UI, endpoint, flow, CLI): bring the app up **with the canonical `Run` command from step 1** — do not guess a command; guessing is exactly what step 1 exists to prevent. Walk the spec's flow, capture a screenshot or real output, and save it where the PR can reference it — **or, with no tracker and therefore no PR, to `docs/evidence/<source-slug>.md`, committed**. Evidence is durable for the same reason a spec is (ADR 0006): whoever reads this change months from now wants the proof the behaviour appeared, not just the diff that claims it. Never `.scratch/`.

**Capture it from the process, not from a shell measurement of it.** Read the child's stdout and stderr directly rather than redirecting to a file and measuring that file: shell wrappers, pagers and output filters sit between you and the truth, and a byte count that disagrees with the file's contents means your instrument is lying, not the app. Evidence whose capture method you cannot vouch for is not evidence — say how it was captured, in the artifact.

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
- a committed evidence artifact (step 6, no-tracker mode) belongs in this diff — it *is* this change's concern, not a second one; do not flag it as scope creep, and say so if a reviewer does

## 9. Deliver

Commit describing the behavioural change, not the file touched. Push to the spec's branch. Open a PR whose body says **`Closes #N`** — not a loose mention of the issue — with what changed, how to verify, and the evidence. The linked form is what lets a later run decide whether this ticket's blockers are actually merged (step 2); a bare `#N` leaves that undiscoverable.

**With no remote there is no push and no PR** — `git remote -v` decides, the same way `git ls-files` decides in step 1. Deliver locally instead: name the branch, the commits on it, and where the evidence was written, and say plainly that the change is unpushed because the repository has no remote. Report only remote state you have just measured; a remote that does not exist has no state, and inventing one ("the remote is behind by N commits") sends the reader to do work that cannot be done. The same holds for any repo state in the step 10 report — measure it at report time rather than recalling it from earlier in the session, because the tree moved while you were working in it.

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

A source that carries a `returned` marker: **do not reimplement.** A returned source is a specification defect, not an execution one. Point out which part was ambiguous or had a non-verifiable criterion, and send it back for a rewrite — preferably to a fresh `grill` session. Relaunching against the unchanged text is the most expensive way to discover the problem was the text.

### Returning the source

**Every time you hand a source back as defective — at step 2, 4, 5, or here — mark it durably first**, so the *next* session enforces the rule without anyone remembering. This is the write half of the gate; step 2 is the read half. The mark must survive the session that dies, exactly like ADR 0006's durable artifacts:

- **Tracker** → **create the label first** — `gh label create returned --force` (idempotent; `--force` is what makes the re-run safe) — then add a `returned` label to the issue and a comment naming the non-verifiable part. On a repo that has never returned a source the label does not exist, and `gh issue edit --add-label` fails with `'returned' not found`: the write half errors out and the gate never arms. Verified live.
- **Local** → add a `Returned: spec-defect — <reason>` line at the top of the spec/ticket file.

The marker is a **state, not a counter** (ADR 0008): a source is either `returned` (sent back as a spec defect, not yet rewritten) or it is not. It is written only when the blocker is the *spec*, not the code, so step 2 refusing on its mere presence is correct — retrying against an unchanged spec is pointless.

Marking is not optional and not only for the second return — the *first* return is what the next session reads. Skip it and the gate reads a marker nothing wrote, and the rule collapses back to advice.

**The exit:** `spec-execution` **sets** this marker; the **republisher clears** it when the rewritten source is published (ADR 0008) — `to-spec` for a spec, `to-tickets` for a ticket, since the frontier runs tickets and a ticket is the marked source there. You do not clear it here — if you cleared your own marker, healing would be back to memory-dependent. Heal the source through `grill` → `to-spec`/`to-tickets`, and republishing is what releases the gate.
