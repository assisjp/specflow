# spec-execution

Execute **one** written spec — a `.md` file, PRD, or GitHub issue — into **one** reviewable PR, with closed scope and attached evidence.

This is where specflow spends its reliability budget. The agent delivers a single verified diff, scope closed, evidence attached, and human review happens **once** on the final diff — instead of granular reviews that multiply rounds and cost.

## When to use it

- The user asks to implement a spec, an issue, a ticket, or an already-written plan.
- Not for *writing* the spec — that is `grill` → `to-spec`.

## How it runs

1. **Contract** — reads the canonical commands from the repo's agent-context file (`AGENTS.md` or `CLAUDE.md`). The file has to be tracked in the repository — a global or user-level `CLAUDE.md` is not this repo's contract, whatever the harness loads. If the block is missing, it **stops** and points you at `repo-hardening`. No improvised commands.
2. **Read before writing** — the whole spec, the files it names, their imports, `CONTEXT.md`. Result-changing ambiguity stops and asks — and the answer is written back into the source, because one that lives only in the conversation dies with it and the next session asks the same question. When the ambiguity was a criterion that cannot be verified as written, rewriting it is the fix, so the source is marked and handed back. Minor ambiguity is decided and recorded. A ticket whose declared blockers are not yet merged stops here too, naming the blocker to run first — building on an unmerged blocker yields a PR based on another open PR, which is not independently reviewable. A spec that plainly implies a diff beyond step 8's ~400 lines gets the cut proposed here — an estimate to think with, not a gate; step 8 measures the real diff.
3. **Closed scope** — implements exactly the spec; adjacent smells, refactors, and unrelated bugs are noted, not touched.
4. **Implement** — calls [tdd](./tdd.md) at the agreed seams; tests in the same work, never separate.
5. **Verify** — runs the canonical commands within the verification block's attempt limit.
6. **Evidence** — an observable change is brought up for real (with the block's `Run` command) and captured *before* review, so someone other than the implementer sees it; a green test is not proof the feature appears. With no tracker to attach it to, the artifact is committed under `docs/evidence/` — durable, like the spec. It is captured from the process itself rather than from a shell measurement of it, and the artifact says how.
7. **Automated review** — calls [code-review](./code-review.md); each finding is a hypothesis confirmed against the code before acting, and the Spec axis checks the evidence against the acceptance criteria. A smell inside the diff is in scope, outside is not.
8. **One diff, one concern** — mechanical split from behavioural; a >~400-line diff flagged for a cut.
9. **Deliver** — commit, push, open a PR referencing the issue. Never merges — the merge is the human's.
10. **Report** — a fixed-format summary of scope, decisions, checks, evidence, and PR link.

## The second-failure rule

A source that carries a `returned` marker is a specification defect, not an execution one. `spec-execution` refuses to reimplement — it names the ambiguous or non-verifiable part and sends it back to a fresh `grill` session. The exit: heal the source and republish it — `to-spec` for a spec, `to-tickets` for a ticket — because republishing is what clears the marker (ADR 0008).

Setting the marker on a tracker **creates the label first** (`gh label create returned --force`, idempotent). On a repo that has never returned a source the label does not exist and `gh issue edit --add-label` fails outright, so without this the write half errors and the gate never arms.

On a tracker the marker is read **per issue** (`gh issue view <n> --json labels`), never through a label filter — GitHub's label index lags writes by seconds, and a filtered read would miss a marker just set and let a defective spec through.

## Related

- [repo-hardening](./repo-hardening.md) — provides the verification-block contract (in `AGENTS.md` or `CLAUDE.md`) this skill requires.
- [tdd](./tdd.md) and [code-review](./code-review.md) — delegated to for the loop and the review.
