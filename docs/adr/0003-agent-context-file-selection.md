# 0003 — Write the verification block to the harness's auto-loaded context file

- **Status:** Accepted
- **Date:** 2026-07-24

## Context

The whole flow assumes the prohibitions in the verification block (`--no-verify`, don't disable lint, the attempt limit) "hold always" — which is only true if the block sits in the file the agent harness **auto-loads into every session**. That file is not universal: Claude Code loads `CLAUDE.md`; many other harnesses load `AGENTS.md`; some load both. Early drafts hard-coded `AGENTS.md`, so on a Claude Code repo — the primary target, since specflow ships as a Claude plugin — the block could land in a file the harness never reads, and the premise silently fails.

## Decision

`repo-hardening` writes the verification block to the auto-loaded context file, chosen by precedence: existing `AGENTS.md` → existing `CLAUDE.md` → create `AGENTS.md`. When the block goes in `AGENTS.md` but a `CLAUDE.md` also exists, it adds a one-line pointer in `CLAUDE.md` (between its own markers) so the block is reachable from whichever file the harness loads. `spec-execution` reads the block from whichever file holds it.

## Alternatives considered

- **Always `AGENTS.md`.** Simple, but fails on a Claude Code repo that only loads `CLAUDE.md` — the exact primary case.
- **Always `CLAUDE.md`.** Ties the flow to one harness and breaks cross-harness portability, which the `AGENTS.md` standard exists to provide.
- **Duplicate the full block into both files.** Two sources drift; a pointer keeps one owner of the content.

## Consequences

- **Easier:** the block is where the harness will actually read it, on Claude Code and elsewhere; portability is preserved.
- **Harder / accepted:** `repo-hardening` carries harness-detection logic and, in the both-files case, owns markers in two files instead of one — still single-owner per piece of content, just split between a block and a pointer.
- **Still open:** markdown instructions have less binding force than a hook that physically blocks `--no-verify`. This ADR puts the block in the right file; enforcing it outside a skill-driven session remains a hook-layer concern, not solved here.
