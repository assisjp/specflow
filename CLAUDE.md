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
- `.scratch/` is ephemeral and git-ignored. Any skill that writes there must guarantee the `.gitignore` entry exists first.

## Versioning & validation

- Keep `.claude-plugin/plugin.json`'s `version` in sync with `package.json`'s. Claude uses the plugin `version` to decide when installed users see an update.
- After touching either manifest, run `claude plugin validate . --strict`.

## Language

All shipped artifacts — `SKILL.md`, `README.md`, docs — are written in **English**.
