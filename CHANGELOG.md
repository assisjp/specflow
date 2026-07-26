# Changelog

All notable changes to specflow. Format based on [Keep a Changelog](https://keepachangelog.com); this project follows semantic versioning.

## [0.9.14] — 2026-07-25

### Fixed
- **Evidence had nowhere to live without a tracker.** Step 6 said to save it "where the PR can reference it" — and with no remote there is no PR, so the location was undefined. On a live no-tracker run the model invented `docs/evidence/<slug>.md` and committed it: a good choice, and entirely its own. The ownership list in `CLAUDE.md` names a home for specs, tickets, the glossary, ADRs, the verification block and `.scratch/`, and forgot the one artifact the evidence gate exists to produce. Now stated: with no tracker, `docs/evidence/<source-slug>.md`, committed, durable for the same reason a spec is (ADR 0006) — whoever reads the change months later wants the proof the behaviour appeared, not just the diff claiming it.
- **Evidence could be captured through a lying instrument.** On the same run, recapturing evidence for the error paths, `wc -c` on a redirected file reported zero bytes for a file with contents — a shell filter sitting between the command and its output. The model caught it, stopped trusting shell measurement and read the child process's stdout and stderr directly. Step 6 now says to do that by default and to record the capture method in the artifact: a byte count that disagrees with the file means the instrument is lying, not the app, and evidence whose capture you cannot vouch for is not evidence.

## [0.9.13] — 2026-07-25

### Fixed
- **`to-spec` published a spec it already knew was not implementable.** Its traceability rule says an untraceable claim is cut or turned into an open question — and on a live run it did exactly that, recording honestly in *Further Notes* that one decision had never been made. Then it declared the spec ready and named `spec-execution` as the next step. But that open question left three of ten user stories with no verifiable acceptance criterion, so `spec-execution` read it at step 2, refused, marked the spec `Returned: spec-defect` and handed it straight back — a full execution round spent learning what the author knew while writing. The rule said what to do with an open question and nothing about what an open question *costs*. It now distinguishes the two: one that records context is publishable, one that leaves a story unbuildable and untestable means the spec is not ready, and the next step is `grill` to settle it. Found by the flow itself — `spec-execution` named the upstream cause in its own report.

## [0.9.12] — 2026-07-25

### Fixed
- **`spec-execution` never read the blocking edges `to-tickets` writes.** Every ticket carries `Blocked by: #N`, and `to-tickets` states the rule beside it — work the **frontier**, tickets whose blockers are all done. `spec-execution` consumes those tickets and had no matching rule, so on a live run it read a ticket saying `Blocked by: #3`, with #3 still open and its PR unmerged, and implemented anyway. It handled the consequence sensibly — based the branch on the blocker's branch and reported the merge order — but the result is a PR whose base is another open PR: not independently reviewable, which is the single thing this skill promises, and whose base moves if that review changes anything. `guide` had said to wait and `to-tickets` had declared the edge; the missing half was the consumer. Step 2 now checks the edges and stops on an unfinished blocker, naming which ticket to run first. Done means merged — an open PR can still change.

## [0.9.11] — 2026-07-25

### Fixed
- **`spec-execution` step 2 answered a result-changing ambiguity in the conversation and never wrote it back.** On a live run the frontier ticket carried an unverifiable criterion ("*Confirm the accepted behaviour for a Title such as 'Straße'*"); step 2 correctly stopped and asked, got an answer, and implemented — leaving the criterion on the issue exactly as it was, unable ever to go green, waiting to stop the next session with the same question. Step 4 already covers "a scenario not testable as written" by marking the source, but step 2 is reached first and had no such duty, so the two rules disagreed on the same input. Step 2 now says it: write the answer back into the source, and where the ambiguity *was* an unverifiable criterion, rewriting it is the fix — so mark the source and hand it to the republisher. The decision-that-evaporates is the failure ADR 0008 was written against; it had survived one skill upstream of the marker.
- **`to-spec` ended without naming the next step**, and filled the gap wrongly on a live run: it pointed a 26-story, five-endpoint spec at `spec-execution`, which would have spent a round refusing and proposing the cut that `to-tickets` exists to make. `to-spec` is the only thing that can judge the size of what it just wrote, so it now states whether the spec fits one reviewable PR and routes accordingly — the completion-side counterpart to the house rule that a refusal names its exit.

### Added
- README: **`/reload-plugins` after updating.** A `marketplace update` refreshes the disk, but a session resolves its typed slash commands once at start — so an open session keeps running the version it began with while model-invoked skills pick up the new one. Measured on a live run: three typed skills ran 0.9.8 while two internally-invoked ones ran 0.9.9, in the same session, after two updates. That mix matters here specifically, because the second-failure marker's setter and clearer live in different skills and must agree. `/reload-plugins` refreshes the typed commands in place — measured on the same session, which went from serving 0.9.10 to 0.9.11 without restarting.

## [0.9.10] — 2026-07-25

### Fixed
- **`grill` could be talked into writing the feature, skipping the entire pipeline.** Rule 5 said "Grilling produces alignment, not artifacts (unless `docs` is passed)" and, in the same breath, "get an explicit go **before building anything**" — a clause that only makes sense if building is on the table, contradicting both the rule beside it and the skill's own description ("before any code is written"). On a live run the user answered a question with "tudo", the model read it as the go, and `grill docs` committed `src/slug.ts` and `tests/slug.test.ts` — no spec, no ticket, no closed scope, no evidence, no review. The one thing specflow exists to prevent, reachable through the skill that opens the flow. Rule 5 now states the prohibition outright: `grill` never writes source or tests however broad the go sounds, `docs` widens its output to `CONTEXT.md` and ADRs and no further, and the "go" it waits for is the go to the next step, never a licence to build. A contradiction removed rather than a rule added.

## [0.9.9] — 2026-07-25

### Fixed
- **`repo-hardening` never committed its own work**, so the verification layer it installs leaked into the next feature PR. Phase 6 ended at "report what was installed", leaving config, hooks, CI, the test scaffold and the agent-context file loose in the tree — eleven files, on a real run. The next `spec-execution` then inherits a dirty tree and breaks its own closed scope (§3) and one-diff-one-concern rule (§8) *by construction*, while `code-review`'s Standards axis reviews the hardening config as if it were feature work. The same shape as the marker bugs: the instruction exists at one end (`spec-execution` demands closed scope) and the mechanism was missing at the other (nothing put the hardening into history). Its sibling publishers already got this right — `to-spec` commits its spec, `to-tickets` commits its tickets — and the skill that writes the most files said nothing. Phase 6 now commits the hardening as one isolated commit, with a formatter reflow of pre-existing code kept as a separate one. Found by running the real pipeline against a real repo and looking at `git status` afterwards.

## [0.9.8] — 2026-07-25

### Fixed
- **The tracker half of the second-failure gate never armed on a fresh repo.** *Returning the source* said "add a `returned` label to the issue" — but nothing created the label, and on a repository that has never returned a source it does not exist. `gh issue edit --add-label returned` then fails with `'returned' not found` (exit 1, nothing written), so the write half errors out, no marker is set, and the next session implements a spec already known to be defective. Every live exercise of this path so far ran on a repo where the label happened to exist already, which is exactly why four attempts missed it. Now the label is created first, idempotently — `gh label create returned --force` — with the failure mode recorded so the step is not "optimised" away. Found by running the gate against a real fresh private repo rather than reading the skill.

## [0.9.7] — 2026-07-25

### Fixed
- **The eval detected a drifted token, never a deleted role.** Delete step 2's reader half, or the whole *Returning the source* setter, and the marker token still litters the rest of the file: `check.mjs` guard #11 passed, token agreement passed, the gate was dead and CI was green. That is the **0.9.1 class** — the write half existed, the read half never met it — so 0.9.6's net covered the 0.9.4 bug while leaving its predecessor open, and *looked* like it covered both, which is worse than no net. Five role-presence guards close it, anchored on role rather than phrasing: step 2 must still read the marker; `spec-execution` must instruct the SET on both backends (identified by what it does, so the section may be retitled or moved); each clearer must instruct the CLEAR on both backends; `guide` must still route a marked source to `grill`; `to-tickets`' healing mode is anchored on its own section, so a cross-reference cannot stand in for the mode. Two silent passes surfaced while building it: the clearer guard was satisfied by a section *title* naming the clear, and an unbounded `mark\w*` matched the noun "marker" throughout step 2, so the setter guard was being satisfied by the reader — the exact confusion it exists to detect. Mutation battery: 16 mutations, 14 bite; the two that pass do so correctly (a redundant token anchor in `to-spec`, and a renamed setter heading — no false positive by design).
- **`spec-execution` step 2 could be "optimised" back into a false negative.** It read the tracker marker via `gh issue view`, which is per-issue and therefore correct — but nothing stopped a later hand from turning it into a `gh issue list --label returned` filter, and `to-tickets` already documents why that breaks: GitHub's label index lags writes by seconds. The failure is a few-second false negative — mark, read the stale index, see nothing, implement a spec already known defective. Now explicitly `gh issue view <n> --json labels`, per issue, with the reason attached so it stays shut.
- **`guide` was the protocol's single point of failure for token extraction.** Every other gate skill anchored the marker token twice; `guide` anchored it once, so rephrasing one bullet would have failed CI. It now names both backends where it describes the clear — better prose, and the redundancy the other three already had.

### Changed
- The eval's success line counted 15 contract guards and 8 lifecycle steps as one total. The guards read the skills' own prose and can disagree with it — that is detection. The lifecycle steps run over fixtures the eval controls, with reader and setter derived from the same extracted token; a couple cannot fail without editing a fixture. Real value as executable documentation of the local backend's semantics, but not coverage, and one total invited reading 23 units of net where there are 15. Now reported apart.

### Added
- `CLAUDE.md`: the **tracker backend's manual release checklist**, once per minor in a throwaway repo. That half stays out of CI on purpose — network, `gh` auth, a real issue; a reliability plugin whose CI dies on GitHub API rate limits is worse than an honest gap. Step 4 (the same cycle with a *ticket*, where the clear belongs to `to-tickets` and not `to-spec`) is the one tracker transition never exercised live, and is marked unskippable. What CI does pin on that side is nomenclature, not behaviour: the label token is derived from prose shared by all four gate skills and checked against the local line token, so the two backends cannot drift apart by name.

## [0.9.6] — 2026-07-25

### Fixed
- **`to-tickets` had the marker's clear instruction but no mode that could execute it.** Step 5 told it to republish a rewritten ticket to the same issue/file so the neighbours' blocking edges survive — but the documented process is a single path: take a whole spec and slice it. An agent following it literally to heal one marked ticket would re-slice everything and move exactly the edges that paragraph forbids moving. Same shape as the 0.9.1 bug: the instruction existed at one end, the mechanism did not exist at the other, and guard #11 could not see it because the tokens were all present. `to-tickets` now opens its process with a mode selector — a single ticket carrying a `returned` marker means healing mode: rewrite that one ticket, republish to the same source, clear the marker, skip steps 1–4, touch no neighbour.
- **`spec-execution`'s step 2 refused without naming its exit.** Step 1 already models the convention ("stop. Suggest running `repo-hardening` first"); step 2 sent the user to the second-failure rule and left them there. It now names the way out: heal and republish via `to-spec` (spec) or `to-tickets` (ticket), which is what clears the marker (ADR 0008), starting from a fresh `grill` if the source is not yet rewritten.
- **`guide` routed a marked source to `grill` unconditionally**, so a user who had already rewritten the spec by hand was sent through a grill they did not need, and the actual exit was never named. Now it routes by state: defect unresolved → `grill`; already rewritten → `to-spec`/`to-tickets` to republish. No transition changed owner — republishing still clears, and `spec-execution` still waits.
- **`tdd` pointed at the wrong owner of the refactor beat.** "Cleanup belongs to the review stage (see `code-review`)" — but `spec-execution`'s step 7 is what executes the in-diff cleanup. The rule was not moved into `tdd`: `tdd` is model-invoked and runs standalone, where no fixed point is pinned and "the diff boundary" is undefined, so a diff-phrased rule there would be non-executable. One sentence names both cases instead — in-flow, step 7; standalone, a refactor pass over what the loop touched after each green.
- **`code-review`'s no-sub-agent fallback promised a capability the model does not have** ("clear or set aside its working context"). Replaced with honest layers: sub-agents available at all → one per axis, sequential if need be, isolation by construction; none at all → a single combined pass labelled as such. The report shape `spec-execution` step 7 consumes (`## Standards` / `## Spec`, unmerged, unranked) is unchanged — only the isolation claim degrades. Its `description` no longer promises parallelism as the contract.
- **`session-handoff`'s "three sessions" rule was a counter with nothing to count in.** ADR 0002 makes the handoff ephemeral — consumed once, then dead — so no session can observe how long an item has survived. The same bug class ADR 0008 named in the marker gate. Replaced with a stateless test any single session applies unaided: a line recording a *why* rather than a *where things stand* is a decision disguised as state — promote it to an ADR now. ADR 0002 amended (not superseded; its decision is unchanged) to record the retired test and why it could not work.
- `repo-hardening`'s `description` ended with a trigger the model can never observe (it is user-invoked). Same information, reframed for the human who actually reads it in `/plugin` and the README: run it before `spec-execution`, which refuses to build without the block it installs.

### Added
- **`scripts/eval-marker-protocol.mjs` — a deterministic eval of the returned-marker lifecycle**, wired into `npm run eval` and CI. It builds a temp repo and runs the local backend end to end for both source types: clean → set → refuse-while-uncleared → clear-on-republish → release, plus regressions for the retired `Returns:` token, a marker below line 1, and set-idempotency (state, not counter). The contract is **extracted from the four gate skills' prose**, never typed a second time, so text drift fails the eval instead of silently opening the gate — reproducing the 0.9.4 divergence makes it fail by name. Scope is deliberate: local backend only. The tracker backend needs a network and a real issue, so it stays a manual release-checklist item — an honest gap beats a flaky gate on a reliability skill. This inverts the 0.9.x pattern of discovering protocol breaks live.
- `argument-hint` on `spec-execution`, `to-tickets` and `code-review` — the three skills that always ask for their input anyway. Inert metadata; saves a round trip.
- README: **First feature, start to finish** — the literal command sequence for a fresh install. Adoption outside the router's trigger is a README problem, not a reason to re-widen `guide` (ADR 0005).
- `CLAUDE.md`: two house rules — **a refusal names its exit** (the convention `spec-execution` step 1 already modelled), and a **docs-sync ritual**, since `check.mjs` verifies a docs page exists but not that its content matches the `SKILL.md`.

### Changed
- `check.mjs` guard #7 matched skill names by raw substring. Now word-boundary-aware with hyphens treated as part of the token — `\b` alone would let a future skill named `spec` match inside `spec-execution`. Theoretical today; one line.
- `spec-execution` step 2 gained §8's ~400-line figure as an **estimate**, explicitly not a gate — pre-implementation sizing is imprecise and a hard gate there would produce false refusals. §8 still measures the real diff and remains the backstop.

## [0.9.5] — 2026-07-24

### Added
- `scripts/check.mjs` guard #11 is now bidirectional: besides requiring the current marker tokens in every protocol skill, it fails if the retired `Returns:` token survives in any of them — catching the class (old token lingering beside new) that caused the 0.9.4 bug, not just the instance. Same shape as the other bidirectional guards (#3, #6, #8).

## [0.9.4] — 2026-07-24

### Fixed
- **The local (no-tracker) second-failure gate never closed.** `spec-execution` wrote the marker as a `Returned:` line but step 2 read for a `Returns:` line — the old counter name's residue. So off a tracker it marked the source and then failed to recognise its own mark, and the gate silently did nothing. The 4-attempt live run missed it because it was in tracker mode, where both ends use the `returned` label; the marker had two backends and only one was exercised. Reader aligned to `Returned:`, and the local backend's full lifecycle (set → refuse → refuse-while-uncleared → clear → release) is now run and passing.
- Counter-era phrasing ("come back once", "a double return", "comes back twice") replaced with the state framing ADR 0008 fixed, in `spec-execution` and its docs page.

### Added
- `scripts/check.mjs` guard #11: the second-failure marker's tokens (`Returned:`, `returned`) must be identical across every skill in the protocol — setter, reader, clearers, router. The specific check for the one cross-skill protocol that exists, exactly the divergence that had already bitten; it generalises when a second protocol appears.

## [0.9.3] — 2026-07-24

### Fixed
- **The gate's exit now respects the ownership split.** ADR 0008 gave the clear to `to-spec`, but `spec-execution` runs *tickets* on the frontier, and `to-spec` does not own tickets (ADR 0006). The clear now belongs to the **republisher** of the source — `to-spec` for a spec, `to-tickets` for a ticket — each clearing only the source type it owns. `to-tickets` gains the clear-on-republish instruction it was missing; ADR 0008 generalised from "`to-spec` clears" to "the republisher clears", covering any future publisher without amendment.
- `guide` no longer says "if a spec has come back **twice**" — a counter's phrasing left over from before the marker became a state. It now routes to `grill` when the source carries a `returned` marker (the gate fires on the first mark), so it stops sending work to a `spec-execution` that would refuse it. Fixed in the skill and its docs page.

## [0.9.2] — 2026-07-24

### Fixed
- **The second-failure gate now has an exit.** 0.9.1 closed write→read but nothing ever removed the marker, so a spec healed via `grill` still carried `returned` and step 2 refused it forever — the fix could not unblock the work. Confirmed live on a real issue (rewrite the criterion, gate still refused). Now `to-spec` clears the marker when it republishes the rewritten spec to the same source, and that is the only clear path — `spec-execution` sets, `to-spec` clears, one owner per transition (ADR 0008). Proven end-to-end on real GitHub state: set → refuse → heal+clear → release.
- The marker is named for what it is: a **state** (`Returned: spec-defect`), not a `Returns: N` counter — it is written only when the spec is the blocker, and step 2 fires on its presence, so a count was never compared to anything (ADR 0008).

### Added
- ADR 0008 (a returned spec is the same entity; `to-spec` clears the marker on republish).

## [0.9.1] — 2026-07-24

### Fixed
- **The second-failure gate now closes its own loop.** 0.9.0 taught step 2 to *read* the return marker but only told the second-failure section to *write* it — a section reached only on the second return. So the first return (at steps 2, 4, or 5) wrote nothing, and the gate read a marker that never existed. Marking is now required at every point where a source is handed back as defective (steps 2/4/5 and the rule itself), via a single canonical *Returning the source* action. The write half and the read half finally meet.
- `guide`'s description was over-widened in 0.9.0 into a catch-all ("any description of a coding task", "when in doubt reach for it"), against ADR 0005's own lever ("narrow, don't broaden"). It now triggers only on an explicit *which-step* request and states that a plain coding task (e.g. "write a function that slugs a string") must not surface it — removing the noise and the three-way contention with `tdd`/`code-review`.

## [0.9.0] — 2026-07-24

### Added
- **The second-failure rule is now a gate, not advice.** When `spec-execution` returns a spec for a defect it marks the source durably — a `returned` label + comment on the issue, or a `Returns: N` line in the local ticket/spec — and step 2 reads that marker on open and refuses to reimplement. Previously the rule relied on the human remembering there had been a first attempt, the one thing the rule exists to save them from (same durability logic as ADR 0006).

### Changed
- `repo-hardening` Phase 3 no longer assumes formatter and linter are two separate tools. Modern Python (`ruff`) and Biome (JS/TS) do both in one tool; the skill now says install one-or-two by ecosystem default rather than always reaching for a second tool. Also names ecosystem-default hook managers (husky / the `pre-commit` framework). Found running `repo-hardening` on a real Python repo, which also confirmed the "type-checkers have no baseline" fix (0.8.1) generalises from `tsc` to `mypy`.
- `guide`'s description widened to fire on the natural phrasings of a user who does not know which skill to use ("how do I begin", "I want to add X — where do I start", "now what"), closing the model-invoked failure mode where the router stays silent because its triggers were too narrow.

## [0.8.4] — 2026-07-24

### Fixed
- `to-tickets` expand→migrate→contract now states the two things that actually keep the batches green, both found running a real wide refactor: **tests are call sites** (a test reading the old field must migrate before contract), and expand is only non-breaking if tests assert behaviour not object shape — prefactor full-object assertions first.

## [0.8.3] — 2026-07-24

### Fixed
Found by running the flow in **tracker mode** on a real GitHub repo (notes-api):
- `to-tickets` no longer implies GitHub has native issue-blocking. `gh issue` cannot set issue dependencies (a Projects/preview feature), so on GitHub the `Blocked by #N` text form is the norm, not a degraded fallback — the skill now says so, and reserves "native blocking" for CLIs that actually expose it (e.g. Linear). It also warns that GitHub's label index lags creation by a few seconds, so verify freshly-created issues with a per-issue `--json` query, not a `--label` filter.

## [0.8.2] — 2026-07-24

### Fixed
- `code-review` §2 no longer contradicts itself. The source-finding list said "In order:" but ranked a caller-passed path second while telling you to "prefer this". The caller-passed path (which `spec-execution` always provides) is now #1, so a commit's `Closes #45` cannot send the review refetching an issue when the exact file was already handed to it — the same guessing class 0.8.0 removed.
- `repo-hardening`'s "format your own output" rule now covers the class, not just the instance: it says the **repo's formatter, installed or adopted**, so it also applies in a repo that already had a formatter (where Phase 3 installs nothing) — the aligned `AGENTS.md` block breaks Phase 6 there too.

## [0.8.1] — 2026-07-24

### Fixed
Both found by running the full flow end-to-end on a real Node/TS repo:
- `repo-hardening` Phase 4: the "generate a baseline" advice was linter-shaped. A type-checker like `tsc` has no baseline mechanism — the skill now says so and points to scope-restrict or fix-in-an-isolated-commit instead of sending the agent to look for a baseline that does not exist.
- `repo-hardening` Phase 5: the skill now formats the files it just wrote (the `AGENTS.md` block, any configs). A freshly-installed formatter reflows an aligned block, so without this the Phase 6 check failed on the very file the skill created — the skill's output must pass the skill's own gate.

## [0.8.0] — 2026-07-24

### Fixed
- **`code-review` now finds the ticket as the spec.** ADR 0006 made tickets a durable per-PR spec under `docs/tickets/`, but `code-review` only searched `docs/specs/` — so in no-tracker mode the Spec axis silently skipped every locally-ticketed PR. It now also searches `docs/tickets/<slug>/`, and `spec-execution` passes the exact spec/ticket path to `code-review` so the source is never guessed. `spec-execution` step 2 acknowledges the source may be a ticket.

### Added
- ADR 0007 (evidence before review) — moves the reasoning that was in the 0.7.0 CHANGELOG entry into a proper decision record, per the "decisions go in an ADR" boundary. The 0.7.0 entry now points to it.

### Changed
- `scripts/check.mjs` steps renumbered sequentially (was `… 7, 7b, 9, 8`). Cosmetic, but drift is drift.

## [0.7.0] — 2026-07-24

### Changed
- **Evidence is produced before review, not after.** `spec-execution` reorders its steps so the evidence artifact exists before `code-review` runs, and the review's Spec axis checks it against the acceptance criteria. Rationale in ADR 0007.
- `repo-hardening` Phase 6 now **executes the `Run` command** (unless `n/a`) to confirm the app comes up — the evidence gate's contract was the one line in the block that was never tested, and it would first run mid-`spec-execution` at the worst time.

### Added
- `scripts/check.mjs` guard #7b: no orphan docs pages (every `docs/<bucket>/<name>.md` maps to a promoted skill) — the reverse direction of the existing docs check.
- `scripts/check.mjs` guard #9: every `ADR NNNN` cited in a skill or doc must resolve to a file in `docs/adr/`.

## [0.6.0] — 2026-07-24

### Changed
- **Durable local artifacts are versioned, not scratch.** With no tracker, `to-spec` writes the spec to `docs/specs/<slug>.md` and `to-tickets` writes tickets to `docs/tickets/<slug>/`, both committed — instead of `.scratch/`, which was ephemeral and git-ignored, so specs/tickets vanished on a fresh clone. `.scratch/` is now exclusively `session-handoff`'s. `code-review` looks for the spec in one place (`docs/specs/`). See ADR 0006.
- `code-review` now degrades gracefully across harnesses: parallel sub-agents where available, otherwise the two axes run sequentially with clean context between them — the isolation guarantee no longer depends on a Claude Code-specific feature (consistent with ADR 0003's portability stance).

### Added
- `spec-execution` now assigns the refactor beat an owner: a code smell **inside the diff** is in scope (clean it up — this is red-green-**refactor**'s third beat); a smell **outside the diff** is out of scope (record it, don't fix it). Closes the gap where a smell in new code belonged to no one.
- `scripts/check.mjs` guard #8: the current plugin version must have a `CHANGELOG.md` entry.
- ADR 0006 (durable artifacts versioned under `docs/`, not `.scratch/`).

## [0.5.0] — 2026-07-24

### Changed
- `guide` (the router) is now model-invoked, so it surfaces when a user describes a task without naming a skill — the situation it exists for — instead of being reachable only by those who already know to type it. See ADR 0005.
- Every general reference to the verification-block location now reads "`AGENTS.md` or `CLAUDE.md`" (glossary, ownership rule, README, skills, docs), consistent with ADR 0003. Previously six files still hard-coded `AGENTS.md`.

### Added
- `scripts/check.mjs` now enforces the **invocation contract** (frontmatter invocation mode must match the README User-invoked / Model-invoked grouping) and **router coverage** (every promoted skill except `guide` must appear in `guide/SKILL.md`). The `domain-modeling` regression can no longer return silently.
- CI now also runs `claude plugin validate . --strict` as a gate, not just an instruction.
- ADR 0005 (the router is model-invoked).
- Git tags for all releases (`v0.1.0` … `v0.5.0`), so the CHANGELOG links resolve.

## [0.4.1] — 2026-07-24

### Fixed
- `link-skills.sh` no longer destroys a real directory or file at a target path — it refuses to overwrite anything that is not its own symlink, and reports skips. Prevents data loss for users who already have a real `tdd`/`code-review` skill dir.
- `domain-modeling` is now model-invoked, so `grill docs` can actually reach it (it was user-invoked and unreachable by another skill). See ADR 0004.

### Changed
- `repo-hardening` writes the verification block to the harness's auto-loaded context file (`AGENTS.md` or `CLAUDE.md`), with a pointer when both exist, instead of hard-coding `AGENTS.md`. See ADR 0003.
- The verification block gains a `Run:` command so the evidence gate has a contract; `spec-execution` uses it instead of guessing a dev-server command.

### Added
- ADR 0003 (agent-context file selection) and ADR 0004 (utility skills model-invoked, ambient triggering accepted).

## [0.4.0] — 2026-07-24

### Added
- `guide` — the router skill: describe a task, get the one skill to run now and why.
- `scripts/check.mjs` — zero-dependency consistency check enforcing the CLAUDE.md invariants (manifest/version sync, plugin↔disk↔README↔docs wiring, promoted vs non-promoted rules).
- CI workflow (`.github/workflows/ci.yml`) running the consistency check on every push and PR.
- `npm run check` script.

## [0.3.0] — 2026-07-24

### Added
- Phase 3 — scale & continuity: `to-tickets` (slice a spec into dependency-ordered tracer-bullet tickets) and `session-handoff` (ephemeral session handoff with git state, `.scratch/` + gitignore guarantee, state-not-decisions rule).

## [0.2.0] — 2026-07-24

### Added
- Phase 2 — execution: `repo-hardening` (deterministic verification layer + `AGENTS.md` block), `spec-execution` (one spec → one reviewable PR with closed scope and evidence), `tdd` (red → green loop reference), `code-review` (two-axis Standards + Spec review).

## [0.1.0] — 2026-07-24

### Added
- Phase 1 — spec pipeline: `grill` (relentless interview with contradiction rule, priority lens, structured choices, decision-log output), `domain-modeling` (glossary + ADR discipline), `to-spec` (decision log → published spec).
- Plugin and marketplace manifests, per-skill docs, `CONTEXT.md` glossary, ADR 0001 (own self-contained rewrite) and ADR 0002 (ephemeral handoff), and `scripts/link-skills.sh`.

[0.9.5]: https://github.com/assisjp/specflow/releases/tag/v0.9.5
[0.9.4]: https://github.com/assisjp/specflow/releases/tag/v0.9.4
[0.9.3]: https://github.com/assisjp/specflow/releases/tag/v0.9.3
[0.9.2]: https://github.com/assisjp/specflow/releases/tag/v0.9.2
[0.9.1]: https://github.com/assisjp/specflow/releases/tag/v0.9.1
[0.9.0]: https://github.com/assisjp/specflow/releases/tag/v0.9.0
[0.8.4]: https://github.com/assisjp/specflow/releases/tag/v0.8.4
[0.8.3]: https://github.com/assisjp/specflow/releases/tag/v0.8.3
[0.8.2]: https://github.com/assisjp/specflow/releases/tag/v0.8.2
[0.8.1]: https://github.com/assisjp/specflow/releases/tag/v0.8.1
[0.8.0]: https://github.com/assisjp/specflow/releases/tag/v0.8.0
[0.7.0]: https://github.com/assisjp/specflow/releases/tag/v0.7.0
[0.6.0]: https://github.com/assisjp/specflow/releases/tag/v0.6.0
[0.5.0]: https://github.com/assisjp/specflow/releases/tag/v0.5.0
[0.4.1]: https://github.com/assisjp/specflow/releases/tag/v0.4.1
[0.4.0]: https://github.com/assisjp/specflow/releases/tag/v0.4.0
[0.3.0]: https://github.com/assisjp/specflow/releases/tag/v0.3.0
[0.2.0]: https://github.com/assisjp/specflow/releases/tag/v0.2.0
[0.1.0]: https://github.com/assisjp/specflow/releases/tag/v0.1.0
