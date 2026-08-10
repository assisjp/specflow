# specflow — repository conventions for Codex

specflow supports both Codex and Claude Code from the same skill source. The complete repository conventions, ownership rules, release checklist, and validation requirements are maintained in [CLAUDE.md](./CLAUDE.md). Read and follow that file before changing this repository.

Codex-specific rules:

- Preserve the existing Claude Code frontmatter fields (`disable-model-invocation` and `argument-hint`) where present. Codex requires `name` and `description` and uses `agents/openai.yaml` for its policy; the shared frontmatter keeps Claude's behavior intact.
- Keep `agents/openai.yaml` in every promoted skill. User-invoked skills set `policy.allow_implicit_invocation: false`; model-invoked skills omit that policy or leave it true.
- Codex distributes specflow through `.codex-plugin/plugin.json` and `.agents/plugins/marketplace.json`; keep both manifests versioned with `package.json`. It also discovers repository skills through `.agents/skills` and user skills through `~/.agents/skills`; use `scripts/link-skills.sh` to create safe user-level symlinks during development.
- Preserve `.claude-plugin/` and its validation: it remains the Claude Code distribution channel.
