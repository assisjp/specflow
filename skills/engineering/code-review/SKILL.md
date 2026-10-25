---
name: code-review
description: Review committed, staged or work-in-progress changes against repository standards and requested behavior. Pin the actual candidate and evidence; use independent reviewers when risk warrants them, and report actionable findings with honest limitations.
argument-hint: "[fixed point — SHA, branch, tag, or merge-base]"
---

# Code Review

Review the actual candidate against two questions: **Standards** (repo contracts and correctness) and **Spec** (requested behavior). Preserve the origin of each finding, but prioritize the final report by demonstrated impact. A finding is a hypothesis to confirm, not an instruction to manufacture a fix.

## 1. Resolve the candidate before reviewing

Use the caller's source, scope and review base first. Otherwise derive the base from the PR or unambiguous upstream; ask only if the choice changes what is reviewed. Resolve refs to SHAs and record the checkout, mode and paths. A moving branch name is not a snapshot.

Choose the mode explicitly:

| Mode | Candidate | Tracked diff |
|---|---|---|
| `commits` | fixed candidate commit | `git diff <base-sha> <candidate-sha> -- <paths>` |
| `staged` | current index, including staged additions | `git diff --cached <base-sha> -- <paths>` |
| `working-tree` | current tracked files, including staged and unstaged edits | `git diff <base-sha> -- <paths>` |

Resolve a merge-base when the task is a branch/PR review; use an exact supplied comparison commit when that is the request. Before a feature's first commit, `working-tree` is normally the relevant mode. Do not silently substitute `HEAD` for uncommitted work.

For `working-tree`, enumerate untracked files with `git ls-files --others --exclude-standard -z`; include the relevant owned new files in the review artifact without staging them. Record excluded unrelated files and the reason. Check status for conflicts and submodule changes; report surfaces the textual patch cannot represent. Do not review secrets by copying them into artifacts.

Capture the selected patch once, along with relevant new file contents, the base/candidate identifiers, file list and content hashes. Store the artifact in the permitted task workspace outside the candidate paths. For a working tree that may change concurrently, compare status/content hashes before and after capture; retry capture only if they changed. Give reviewers the same fixed artifact, not commands against moving refs. Context reads must correspond to that snapshot; if files moved during review, identify the changed hunks and reassess them.

An empty artifact means there is no candidate in that mode; inspect whether the intended changes are uncommitted/untracked before concluding there is nothing to review. Never silently certify an empty `HEAD` diff as the feature review.

## 2. Assemble focused context

Use the source the caller passed. Otherwise inspect linked issues or matching specs/tickets and the accepted request; ask for missing requirements only when they are needed to judge behavior. If no spec exists, report that limitation and review the available contract. Do not invent a spec just to enable an axis.

Read applicable `AGENTS.md`, `CLAUDE.md`, contribution standards, relevant interfaces and affected consumers. Explore dependencies to resolve concrete questions, not to recursively load all imports. Evidence should include the candidate identity and show the criteria actually met. Distinguish real output from mocks and claims that cannot be established from a screenshot or test log.

## 3. Review by risk

- **Standards:** report concrete correctness, safety or maintainability problems introduced by the candidate. Cite the relevant rule and affected path. The repository's architecture wins over generic preferences; do not duplicate formatter/linter/type diagnostics already covered by current checks.
- **Spec:** identify missing/incorrect requirements, unrequested behavior and evidence gaps, citing the source criterion. A green test is evidence only for the behavior it exercises.

Use smells as prompts, not mandatory transformations: ambiguous names, accidental duplication, speculative abstraction, related data scattered without a reason or changes with surprising ripple effects. Similar code does not automatically need extraction, primitives do not automatically need wrapper types, switches do not automatically need polymorphism, and a delegating layer may enforce a critical boundary. Require a concrete consequence and prefer the smallest useful fix.

For substantial or risky work, independent subagents can review the axes or specific risks. Supply bounded briefs, the same snapshot and only relevant context; reviewers are read-only and do not change others' work. For a small change, one focused pass may suffice. State whether review was independent or shared-context; never promise to erase context. Inherit the selected session model unless the user explicitly chooses otherwise. There is no fixed reviewer count or model generation.

## 4. Reconcile and deliver

Confirm findings against code and evidence, merge duplicates, retain the axis/source and distinguish blocking defects from optional suggestions. Report only actionable findings with file/line, impact and rationale; no findings is a valid result. Note unreviewed surfaces or missing evidence.

After fixes, review the changed hunks and invalidate only checks/evidence that depend on changed inputs. A full repeat is needed only when the changed scope warrants it. Before delivery, compare the final candidate to the reviewed snapshot; state any remaining difference rather than passing off the earlier review as current. Report scope, snapshot identity, key findings and limitations concisely.
