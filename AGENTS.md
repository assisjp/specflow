# specflow — repository conventions

specflow supports Claude Code and Codex from one skill source. Claude Code ships it as a single-plugin marketplace; Codex discovers the same skills directly. These rules keep both integrations consistent as skills are added. `AGENTS.md` is the canonical source for contributors using either harness. Claude Code loads the repository-only pointer in `.claude/rules/repository.md`; plugin consumers receive the promoted skills, not these development conventions.

## Buckets

Skills live under `skills/` in bucket folders:

- `engineering/` — code and codebase work
- `productivity/` — non-code workflow tools
- `in-progress/` — drafts not ready to ship
- `misc/` — kept but not promoted
- `personal/` — tied to one person's setup
- `deprecated/` — no longer used

`engineering/` and `productivity/` are the **promoted** buckets — the plugin ships exactly that set.

## What every promoted skill needs

A skill in `engineering/` or `productivity/` MUST have all four, kept in sync:

1. A folder `skills/<bucket>/<name>/` containing `SKILL.md`, where the folder name equals the `name:` in the frontmatter.
2. An entry in the top-level `README.md`, with the skill name linked to its `SKILL.md`, grouped under **User-invoked** or **Model-invoked**.
3. An entry in `.claude-plugin/plugin.json`'s `skills` array (`./skills/<bucket>/<name>`).
4. An `agents/openai.yaml` with Codex UI metadata. User-invoked skills set `policy.allow_implicit_invocation: false`; model-invoked skills leave it enabled.

Skills in `in-progress/`, `misc/`, `personal/`, and `deprecated/` MUST NOT appear in `README.md` or `plugin.json`.

## Docs pages

Every promoted skill also gets a human-facing page at `docs/<bucket>/<name>.md`, mirroring the two promoted bucket folders. When you add, rename, or change a promoted skill's behaviour, create or re-sync its docs page. Non-promoted skills get no docs page.

## Invocation

Every `SKILL.md` is either **user-invoked** or **model-invoked**. Retain Claude Code's existing `disable-model-invocation: true` field for user-invoked skills. Mirror it in Codex's `agents/openai.yaml` policy: `allow_implicit_invocation: false` is user-invoked (still explicitly available as `$skill-name` in Codex), while the default `true` is model-invoked. Keep the shared required frontmatter (`name` and `description`) present in every skill; do not remove Claude-specific fields from an existing skill. specflow's skills are user-invoked by default: the flow is deliberate, and each step is chosen, not triggered.

## Authority and shared files

The user's request and repository policy govern scope, execution environment and delivery. These skills supply defaults where the project is silent; they do not erase prior authorization or impose a fresh confirmation at every transition. Do not bake particular model generations or one user's operational environment into reusable rules (ADR 0009).

Use a canonical source for each artifact and preserve concurrent/user edits:

- `domain-modeling` provides the glossary/ADR discipline, including the threshold for creating an ADR. Other authorized tasks may make bounded corrections without invoking a nominal owner solely for permission.
- `repo-hardening` edits its verification markers only. Preserve project-specific restrictions and present a scoped migration when changing older generated policy.
- Specs normally live under `docs/specs/`, local tickets under `docs/tickets/`, and durable evidence under `docs/evidence/`, unless the project already has an equivalent convention/tracker. Create only artifacts the work needs; version them according to the authorized delivery workflow.
- `to-spec`, `to-tickets` and an authorized `spec-execution` may correct the same source and clear its returned state only after resolving the named defect. Preserve source identity and dependency edges; the marker is not a counter or a process-only veto.
- Handoffs default to ignored `.scratch/handoffs/`. Keep the last usable checkpoint until it is superseded or continuation is durably recorded; reading it is not permission to delete it (ADR 0010).

A blocked action names the concrete obstacle and next useful action. Continue independent authorized work. Do not reroute a healthy repository to hardening solely because its marker is absent.

## Versioning & validation

- Keep `.claude-plugin/plugin.json` and `.codex-plugin/plugin.json` versions in sync with `package.json`. Claude uses its plugin version to decide when installed users see an update; the Codex plugin manifest uses the same release version.
- Validate changed manifests with the supported `claude plugin validate . --strict` and available Codex/plugin validation tooling in the authorized environment; report unavailable validators, never invent a path.
- Preserve the existing distribution format and IDs. Do not migrate packaging formats or install global plugins as an incidental part of editing skill behavior.
- After changing a promoted skill, run `node scripts/check.mjs` in the authorized environment; it validates wiring, metadata and manifests. For marker-contract changes also run `node scripts/eval-marker-protocol.mjs`; for the link helper run `node scripts/test-link-skills.mjs`. Reuse passing results for unchanged inputs.
- **Docs-sync ritual.** `scripts/check.mjs` verifies a docs page *exists*, not that its content matches the `SKILL.md` — content drift is a bug class CI cannot catch. Every version bump that touches a `SKILL.md` must re-read the corresponding `docs/<bucket>/<name>.md` and re-sync it in the same commit.

## Behavioral validation

Structural checks do not prove agent behavior. `scripts/eval-marker-protocol.mjs` checks prose contracts and runs local fixture transitions as executable documentation, reported separately. It does not execute an agent or prove the GitHub API path. `scripts/test-link-skills.mjs` exercises the actual link helper in isolated target directories and never changes global discovery paths.

Use the focused scenarios in [docs/validation-0.10.md](./docs/validation-0.10.md) for changed behaviors. Run tracker scenarios only with authorization in a disposable repository, never in a user's real project as a test. Do not require unrelated application builds or repeated demonstrations of unchanged behavior.

Historical tracker baseline: the full 0.9.15 protocol was exercised on 2026-07-25 against two fresh private repos. That is historical evidence, not a passing result for 0.10.0's authorized-correction path. Record current results and unrun scenarios honestly in release evidence.

## Language

All shipped artifacts — `SKILL.md`, `README.md`, docs — are written in **English**.

## Codex distribution

- Preserve the existing Claude Code frontmatter fields (`disable-model-invocation` and `argument-hint`) where present. Codex requires `name` and `description` and uses `agents/openai.yaml` for its policy; the shared frontmatter keeps Claude's behavior intact.
- Keep `agents/openai.yaml` in every promoted skill. User-invoked skills set `policy.allow_implicit_invocation: false`; model-invoked skills omit that policy or leave it true.
- Codex distributes specflow through `.codex-plugin/plugin.json` and `.agents/plugins/marketplace.json`; keep both manifests versioned with `package.json`. It also discovers repository skills through `.agents/skills` and user skills through `~/.agents/skills`; use `scripts/link-skills.sh` to create safe user-level symlinks during development.
- Preserve `.claude-plugin/` and its validation: it remains the Claude Code distribution channel.
