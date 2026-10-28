# Focused validation for 0.10.0

Run only in the task's authorized environment. Use an isolated disposable repo and explicit resource limits where required. These scenarios are a release checklist, not claims of completed runs. Record source commit/patch, harness, outcome and limitations; reuse evidence for unchanged inputs.

## Automated checks

- `npm run check`: manifest/version/metadata/docs wiring and marker-token consistency.
- `npm run eval`: marker prose contracts plus local fixture transitions. Fixture transitions are executable documentation, not proof of agent behavior or tracker operations.
- `npm run test:links`: exercises the real development-link helper against isolated destinations, including real files/directories, foreign/dangling links and repeated invocation.
- `claude plugin validate . --strict`: supported Claude distribution validation. Use available Codex validation tooling too; report unavailable tooling rather than inventing a machine-specific path.

## Agent scenarios for changed behavior

| Scenario | Observable result |
|---|---|
| A healthy repo has existing scripts/CI but no Specflow block | Execution identifies the existing checks without installing tooling or forcing a hardening step. |
| An accepted API contract changes an old test expectation | The test changes with a recorded reason; unchanged invariants remain covered, with no duplicate compatibility code solely to satisfy an obsolete expectation. |
| Three intentional red-green increments occur | Expected reds do not stop implementation; unexpected repeated failures are diagnosed instead of replayed unchanged. |
| The feature is entirely unstaged and includes a new file | Review captures the actual tracked edits and the owned new file, even when `HEAD` equals the base. |
| Review fixes change one tested behavior | Affected tests/evidence are refreshed; unchanged checks are reused; the delivered content matches the recorded review snapshot. |
| A consequential change enters a review loop | Reviewers receive one fixed snapshot; the ledger records every finding; later rounds examine only changed hunks and open IDs; an exhausted budget is reported as a limitation rather than approval. |
| The repo requires remote checks and prohibits local browser access | No local tests/build/browser start occurs; checks run only where authorized, or the limitation is reported. |
| Existing real integration output proves the criterion | The evidence is inspected and attributed to the candidate without requiring another full app launch merely for a screenshot. |
| The user requests a handoff before closing the chat | A usable checkpoint identifies dirty contents and the next action; reading it does not delete the only checkpoint or create ADRs for temporary hypotheses. |

## Returned-source correction

When marker transitions change, use an authorized disposable tracker repo with no pre-existing `returned` label. Exercise: return an unverifiable source; verify label creation/application and the reason; read it unchanged without duplicating comments; accept a correction; have an authorized implementer correct the same source; verify the criterion before clearing the marker; verify issue identity and dependency edges remain intact. Repeat the affected path for a ticket or local file when that backend changed.

A body edit that leaves the same criterion unverifiable must remain blocked. An unavailable write capability must leave the marker intact and report the needed correction. Do not create or close issues in a real project merely to simulate this scenario. Historical 0.9.15 tracker evidence does not establish the new implementer-clear behavior.

## Source validation record — 2026-10-25

Candidate based on `6e31e227`, published with this 0.10.0 source change. Checks ran over SSH in an isolated Linux checkout, with one CPU, 512 MiB for the built-in scripts and 1 GiB for the official Claude validator, no extra swap. No application build, browser, local tests or global plugin installation was used.

- `npm run check`: passed; 10 promoted skills wired.
- `npm run eval`: passed; 16 prose contract guards and 8 fixture lifecycle steps. These remain executable documentation, not live tracker/agent evidence.
- `npm run test:links`: passed; real files, directories, foreign/dangling symlinks and existing owned links preserved.
- `claude plugin validate . --strict`: passed with Claude Code 2.1.310 after moving contributor instructions to canonical `AGENTS.md` and adding the repository-only Claude rule.
- The separate catalog-submission check reports a missing listing icon. This source update does not submit to that catalog; no listing approval is claimed.
- No compatible standalone Codex plugin validator was available in the execution environment. The repository consistency script checked Codex metadata and manifest wiring; the generic skill-creator validator rejects the preserved Claude frontmatter and is not a dual-harness validator.
- Independent static review found no blocking inconsistency in skills/docs. Live agent acceptance scenarios and the new tracker returned-marker transition above were not exercised; do not treat this record as proof of those behaviors.
