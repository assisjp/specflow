#!/usr/bin/env bash
# Link every promoted specflow skill into Claude Code and Codex discovery directories,
# so a `git pull` in this repo keeps the installed skills current.
# Optional positional target directories override the default discovery paths.
# Existing entries are never removed; stale/foreign links need an explicit decision.
set -euo pipefail

REPO_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
# ~/.agents/skills is the Codex user-level discovery directory.
if [ "$#" -gt 0 ]; then
  TARGETS=("$@")
else
  TARGETS=("$HOME/.claude/skills" "$HOME/.agents/skills")
fi

linked=0
unchanged=0
skipped=0
for target in "${TARGETS[@]}"; do
  mkdir -p "$target"
  for bucket in engineering productivity; do
    src_bucket="$REPO_ROOT/skills/$bucket"
    [ -d "$src_bucket" ] || continue
    for skill in "$src_bucket"/*/; do
      [ -f "${skill}SKILL.md" ] || continue
      name="$(basename "$skill")"
      link="$target/$name"
      # Exact existing links already point to this checkout. Do not unlink them.
      if [ -L "$link" ] && [ "$(readlink "$link")" = "${skill%/}" ]; then
        unchanged=$((unchanged + 1))
        continue
      fi
      # -e alone misses dangling symlinks. A link owned by another checkout or
      # plugin is not ours to replace, even if its target no longer exists.
      if [ -e "$link" ] || [ -L "$link" ]; then
        echo "SKIP $name: $link already exists and is not this checkout's link (preserved)" >&2
        skipped=$((skipped + 1))
        continue
      fi
      ln -s "${skill%/}" "$link"
      echo "linked $name -> $link"
      linked=$((linked + 1))
    done
  done
done

echo "done: $linked symlink(s) created, $unchanged unchanged, $skipped preserved conflicts"
[ "$skipped" -gt 0 ] && echo "note: choose the intended discovery source before explicitly changing a preserved conflict" >&2
exit 0
