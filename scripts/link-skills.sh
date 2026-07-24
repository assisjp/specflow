#!/usr/bin/env bash
# Link every promoted specflow skill into the local harness skill directories,
# so a `git pull` in this repo keeps the installed skills current.
# Re-run after adding, removing, or renaming a skill.
set -euo pipefail

REPO_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
TARGETS=("$HOME/.claude/skills" "$HOME/.agents/skills")

linked=0
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
      # Never destroy a real directory or file — only replace our own symlinks.
      if [ -e "$link" ] && [ ! -L "$link" ]; then
        echo "SKIP $name: $link already exists and is not a symlink (refusing to overwrite)" >&2
        skipped=$((skipped + 1))
        continue
      fi
      rm -f "$link"
      ln -s "${skill%/}" "$link"
      echo "linked $name -> $link"
      linked=$((linked + 1))
    done
  done
done

echo "done: $linked symlink(s) created, $skipped skipped"
[ "$skipped" -gt 0 ] && echo "note: skipped entries are real dirs/files, not our symlinks — move or remove them, then re-run" >&2
exit 0
