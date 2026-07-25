# specflow — repository conventions

specflow is a single-plugin Claude Code marketplace. These rules keep it consistent as skills are added. IMPORTANT: follow them exactly.

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

A skill in `engineering/` or `productivity/` MUST have all three, kept in sync:

1. A folder `skills/<bucket>/<name>/` containing `SKILL.md`, where the folder name equals the `name:` in the frontmatter.
2. An entry in the top-level `README.md`, with the skill name linked to its `SKILL.md`, grouped under **User-invoked** or **Model-invoked**.
3. An entry in `.claude-plugin/plugin.json`'s `skills` array (`./skills/<bucket>/<name>`).

Skills in `in-progress/`, `misc/`, `personal/`, and `deprecated/` MUST NOT appear in `README.md` or `plugin.json`.

## Docs pages

Every promoted skill also gets a human-facing page at `docs/<bucket>/<name>.md`, mirroring the two promoted bucket folders. When you add, rename, or change a promoted skill's behaviour, create or re-sync its docs page. Non-promoted skills get no docs page.

## Invocation

Every `SKILL.md` is either **user-invoked** (`disable-model-invocation: true` — reachable only when typed) or **model-invoked**. specflow's skills are user-invoked by default: the flow is deliberate, and each step is chosen, not triggered.

## Ownership of shared files

Several skills write to shared files. To avoid one clobbering another:

- `CONTEXT.md` and `docs/adr/` are owned by `domain-modeling`. No other skill creates or edits them.
- The verification block — in the repo's agent-context file (`AGENTS.md` or `CLAUDE.md`, per ADR 0003) — is owned by `repo-hardening`, which edits only between its own `<!-- repo-hardening:start -->` / `:end -->` markers.
- Durable local artifacts are versioned and committed, never in `.scratch/` (ADR 0006): specs under `docs/specs/` (owned by `to-spec`), local tickets under `docs/tickets/` (owned by `to-tickets`).
- `.scratch/` is ephemeral and git-ignored — **only `session-handoff` writes there** (`.scratch/handoffs/`), and it guarantees the `.gitignore` entry first.

## Refusals

**A refusal names its exit.** When a skill refuses to proceed, it must name the skill that unblocks the user, not just state the refusal. Model: `spec-execution` step 1 — "If no block exists: stop. Suggest running `repo-hardening` first."

## Versioning & validation

- Keep `.claude-plugin/plugin.json`'s `version` in sync with `package.json`'s. Claude uses the plugin `version` to decide when installed users see an update.
- After touching either manifest, run `claude plugin validate . --strict`.
- **Docs-sync ritual.** `scripts/check.mjs` verifies a docs page *exists*, not that its content matches the `SKILL.md` — content drift is a bug class CI cannot catch. Every version bump that touches a `SKILL.md` must re-read the corresponding `docs/<bucket>/<name>.md` and re-sync it in the same commit.

## Release checklist — the tracker backend (manual, once per minor)

`scripts/eval-marker-protocol.mjs` covers the returned-marker gate's **local** backend end to end. The **tracker** backend is deliberately not in CI: it needs a network, `gh` auth and a real issue, and a reliability plugin whose CI fails on GitHub API rate limits is worse than an honest gap. Run this by hand in a throwaway repo instead, once per minor:

Start from a repo that has **never** returned a source, so the `returned` label does not exist — that precondition is what hid a real bug through four earlier attempts (0.9.8).

1. Real issue → `spec-execution` returns it → the label is **created**, applied, and a comment names the non-verifiable part.
2. **Re-run against the still-marked issue → it refuses.** ⚠️ *Never yet exercised on a tracker.* It is covered on the local backend by the eval (`refuse` and `refuse-while-uncleared`), so what is untested is this branch reading `gh issue view --json labels` and finding a marker **present**. Do not skip it, and do not re-mark a healed source just to watch the refusal — run this leg between the return and the republish, or record it as not run.
3. The republisher rewrites in place → the label is gone, a "rewritten" comment is there, and the issue **number is unchanged** so blocking edges survive.
4. **The same cycle with a ticket**, where the clear belongs to `to-tickets` and not `to-spec` (the 0.9.3 ownership split). Note that `to-tickets` is user-invoked: the model cannot re-enter it, so in a fresh session the **human** must run the republisher. Inside one session the model may instead follow `to-tickets`' text still in context — substantively the same act, but the ownership split then holds by accident of context rather than by construction.
5. `guide` with the marked issue → routes to `grill`, not `spec-execution`.

**Last full run: 0.9.10, 2026-07-25** — legs 1, 3, 4 and 5 proven against the real API on a fresh private repo; leg 2 not exercised.

What CI *does* pin on the tracker side is nomenclature, not behaviour: the eval derives the label token from prose shared by all four gate skills and checks it against the local line token, so the two backends cannot drift apart by name. Only the API round-trip is manual.

## Language

All shipped artifacts — `SKILL.md`, `README.md`, docs — are written in **English**.
