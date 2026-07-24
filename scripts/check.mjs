#!/usr/bin/env node
// specflow consistency check — enforces the invariants in CLAUDE.md with zero
// dependencies. Run in CI and locally: `node scripts/check.mjs`.
import { readFileSync, readdirSync, existsSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const PROMOTED = ["engineering", "productivity"];
const errors = [];
const fail = (m) => errors.push(m);

const readJson = (p) => JSON.parse(readFileSync(join(ROOT, p), "utf8"));

// 1. Manifests parse and versions are in sync.
let plugin, pkg, market;
try {
  plugin = readJson(".claude-plugin/plugin.json");
  pkg = readJson("package.json");
  market = readJson(".claude-plugin/marketplace.json");
} catch (e) {
  fail(`manifest JSON invalid: ${e.message}`);
}
if (plugin && pkg && plugin.version !== pkg.version)
  fail(`version mismatch: plugin.json ${plugin.version} vs package.json ${pkg.version}`);
if (plugin && market && market.plugins?.[0]?.name !== plugin.name)
  fail(`marketplace plugin name ${market?.plugins?.[0]?.name} != plugin name ${plugin?.name}`);

// 2. Discover promoted skills on disk.
const onDisk = [];
for (const bucket of PROMOTED) {
  const dir = join(ROOT, "skills", bucket);
  if (!existsSync(dir)) continue;
  for (const name of readdirSync(dir)) {
    const skillMd = join(dir, name, "SKILL.md");
    if (!existsSync(skillMd)) continue;
    onDisk.push({ bucket, name, skillMd, entry: `./skills/${bucket}/${name}` });
    // 2a. frontmatter name == folder name
    const fm = readFileSync(skillMd, "utf8").match(/^---\n([\s\S]*?)\n---/);
    const declared = fm && fm[1].match(/^name:\s*(.+)$/m)?.[1].trim();
    if (declared !== name) fail(`${bucket}/${name}: frontmatter name "${declared}" != folder "${name}"`);
  }
}

// 3. plugin.json skills <-> disk (both directions, no dangling).
const pluginSkills = plugin?.skills ?? [];
for (const s of onDisk)
  if (!pluginSkills.includes(s.entry)) fail(`${s.entry} on disk but missing from plugin.json`);
for (const p of pluginSkills)
  if (!existsSync(join(ROOT, p, "SKILL.md"))) fail(`plugin.json entry ${p} has no SKILL.md`);

// 4. Every promoted skill has a docs page and a README link.
const readme = existsSync(join(ROOT, "README.md")) ? readFileSync(join(ROOT, "README.md"), "utf8") : "";
for (const s of onDisk) {
  if (!existsSync(join(ROOT, "docs", s.bucket, `${s.name}.md`)))
    fail(`${s.bucket}/${s.name}: missing docs page docs/${s.bucket}/${s.name}.md`);
  if (!readme.includes(`skills/${s.bucket}/${s.name}/SKILL.md`))
    fail(`${s.bucket}/${s.name}: not linked in README.md`);
}

// 5. Non-promoted skills must NOT appear in plugin.json or README.
for (const bucket of ["in-progress", "misc", "personal", "deprecated"]) {
  const dir = join(ROOT, "skills", bucket);
  if (!existsSync(dir)) continue;
  for (const name of readdirSync(dir)) {
    if (!existsSync(join(dir, name, "SKILL.md"))) continue;
    if (pluginSkills.some((p) => p.endsWith(`/${name}`)))
      fail(`non-promoted skill ${bucket}/${name} appears in plugin.json`);
  }
}

if (errors.length) {
  console.error(`✗ ${errors.length} consistency error(s):`);
  for (const e of errors) console.error(`  - ${e}`);
  process.exit(1);
}
console.log(`✓ specflow consistency OK — ${onDisk.length} promoted skills, all wired.`);
