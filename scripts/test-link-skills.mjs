#!/usr/bin/env node
// Exercise the real helper using explicit temporary targets; never change HOME
// or touch user discovery directories. Run only in the authorized environment.
import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import {
  lstatSync, mkdirSync, mkdtempSync, readFileSync, readdirSync,
  readlinkSync, realpathSync, rmSync, symlinkSync, writeFileSync,
} from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = realpathSync(join(dirname(fileURLToPath(import.meta.url)), ".."));
const helper = join(root, "scripts/link-skills.sh");
const temporary = mkdtempSync(join(tmpdir(), "specflow-links-"));
const sources = new Map();
for (const bucket of ["engineering", "productivity"]) {
  for (const name of readdirSync(join(root, "skills", bucket))) {
    sources.set(name, join(root, "skills", bucket, name));
  }
}
const run = (...targets) => execFileSync("bash", [helper, ...targets], { encoding: "utf8", stdio: "pipe" });

try {
  const target = join(temporary, "target with spaces");
  const secondTarget = join(temporary, "second target");
  mkdirSync(target);
  const file = join(target, "tdd");
  writeFileSync(file, "user-owned file\n");
  const directory = join(target, "code-review");
  mkdirSync(directory);
  writeFileSync(join(directory, "user-data"), "do not replace\n");
  const foreignSource = join(temporary, "foreign skill");
  mkdirSync(foreignSource);
  writeFileSync(join(foreignSource, "SKILL.md"), "foreign skill\n");
  const foreignLink = join(target, "grill");
  symlinkSync(foreignSource, foreignLink);
  const danglingDestination = join(temporary, "missing foreign source");
  const danglingLink = join(target, "guide");
  symlinkSync(danglingDestination, danglingLink);

  run(target, secondTarget);

  assert.equal(readFileSync(file, "utf8"), "user-owned file\n");
  assert.equal(readFileSync(join(directory, "user-data"), "utf8"), "do not replace\n");
  assert.equal(readlinkSync(foreignLink), foreignSource);
  assert.equal(readFileSync(join(foreignSource, "SKILL.md"), "utf8"), "foreign skill\n");
  assert.equal(readlinkSync(danglingLink), danglingDestination);
  const conflicts = new Set(["tdd", "code-review", "grill", "guide"]);
  for (const [name, source] of sources) {
    if (!conflicts.has(name)) assert.equal(readlinkSync(join(target, name)), source);
    assert.equal(readlinkSync(join(secondTarget, name)), source);
  }

  // Idempotency should preserve the existing link itself, not merely recreate
  // an equivalent destination. Birth time/inode are observed on this filesystem.
  const ownLink = join(secondTarget, "tdd");
  const before = lstatSync(ownLink);
  run(target, secondTarget);
  const after = lstatSync(ownLink);
  assert.equal(after.ino, before.ino);
  assert.equal(after.birthtimeMs, before.birthtimeMs);
  assert.equal(readlinkSync(ownLink), sources.get("tdd"));
  assert.equal(readlinkSync(foreignLink), foreignSource);
  assert.equal(readlinkSync(danglingLink), danglingDestination);
  assert.equal(readFileSync(file, "utf8"), "user-owned file\n");
  assert.equal(readFileSync(join(directory, "user-data"), "utf8"), "do not replace\n");
  console.log("✓ link helper: files, directories, foreign/dangling links preserved; explicit targets linked; rerun leaves owned links unchanged");
} finally {
  rmSync(temporary, { recursive: true, force: true });
}
