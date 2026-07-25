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

// 6. Invocation contract: frontmatter invocation mode must match README grouping.
const isModelInvoked = (s) =>
  !readFileSync(s.skillMd, "utf8").includes("disable-model-invocation: true");
const afterUser = readme.split("### User-invoked")[1] ?? "";
const userSection = afterUser.split("### Model-invoked")[0] ?? "";
const modelSection = (readme.split("### Model-invoked")[1] ?? "").split(/\n## /)[0];
for (const s of onDisk) {
  const linkedUser = userSection.includes(`skills/${s.bucket}/${s.name}/SKILL.md`);
  const linkedModel = modelSection.includes(`skills/${s.bucket}/${s.name}/SKILL.md`);
  if (isModelInvoked(s)) {
    if (!linkedModel) fail(`${s.name} is model-invoked but not under README "### Model-invoked"`);
    if (linkedUser) fail(`${s.name} is model-invoked but listed under README "### User-invoked"`);
  } else {
    if (!linkedUser) fail(`${s.name} is user-invoked but not under README "### User-invoked"`);
    if (linkedModel) fail(`${s.name} is user-invoked but listed under README "### Model-invoked"`);
  }
}

// 7. Router coverage: guide must route to every other promoted skill.
const guide = onDisk.find((s) => s.name === "guide");
if (guide) {
  const guideText = readFileSync(guide.skillMd, "utf8");
  // Word-boundary match with hyphens as part of the token — `\b` alone would let
  // a name like "spec" falsely match inside "spec-execution".
  for (const s of onDisk)
    if (s.name !== "guide" && !new RegExp(`(^|[^\\w-])${s.name}([^\\w-]|$)`).test(guideText))
      fail(`guide does not route to promoted skill "${s.name}" (add it to guide/SKILL.md)`);
}

// 8. No orphan docs pages — every docs/<bucket>/<name>.md must map to a promoted skill.
const promotedNames = new Set(onDisk.map((s) => `${s.bucket}/${s.name}`));
for (const bucket of PROMOTED) {
  const dir = join(ROOT, "docs", bucket);
  if (!existsSync(dir)) continue;
  for (const f of readdirSync(dir)) {
    if (!f.endsWith(".md")) continue;
    const key = `${bucket}/${f.replace(/\.md$/, "")}`;
    if (!promotedNames.has(key)) fail(`orphan docs page docs/${bucket}/${f} — no promoted skill "${key}"`);
  }
}

// 9. ADR citations resolve — any "ADR NNNN" in a skill or doc must exist.
const adrDir = join(ROOT, "docs/adr");
const adrNums = new Set(
  existsSync(adrDir) ? readdirSync(adrDir).filter((f) => /^\d{4}-/.test(f)).map((f) => f.slice(0, 4)) : []
);
const citingFiles = [
  ...onDisk.map((s) => s.skillMd),
  ...["README.md", "CLAUDE.md", "CONTEXT.md"].map((f) => join(ROOT, f)),
];
for (const bucket of PROMOTED) {
  const dir = join(ROOT, "docs", bucket);
  if (existsSync(dir)) for (const f of readdirSync(dir)) if (f.endsWith(".md")) citingFiles.push(join(dir, f));
}
for (const file of citingFiles) {
  if (!existsSync(file)) continue;
  for (const m of readFileSync(file, "utf8").matchAll(/ADR (\d{4})/g))
    if (!adrNums.has(m[1]))
      fail(`${file.replace(ROOT + "/", "")} cites ADR ${m[1]}, which does not exist`);
}

// 10. Release hygiene: the current version must have a CHANGELOG entry.
if (plugin) {
  const changelog = existsSync(join(ROOT, "CHANGELOG.md"))
    ? readFileSync(join(ROOT, "CHANGELOG.md"), "utf8")
    : "";
  if (!changelog.includes(`## [${plugin.version}]`))
    fail(`CHANGELOG.md has no entry for version ${plugin.version}`);
}

// 11. Marker protocol: the second-failure marker's setter, reader, clearers and
// router must all use the same tokens. A local reader once drifted to `Returns:`
// while everything else wrote `Returned:`, silently breaking the no-tracker gate.
const GATE_SKILLS = ["spec-execution", "to-spec", "to-tickets", "guide"];
for (const n of GATE_SKILLS) {
  const s = onDisk.find((x) => x.name === n);
  if (!s) continue;
  const body = readFileSync(s.skillMd, "utf8");
  for (const token of ["Returned:", "`returned`"])
    if (!body.includes(token)) fail(`${n} is missing the canonical second-failure marker token ${token}`);
  // Reverse direction: the retired counter token must not survive alongside the new one.
  if (body.includes("Returns:")) fail(`${n} still contains the retired token "Returns:" (use "Returned:")`);
}

if (errors.length) {
  console.error(`✗ ${errors.length} consistency error(s):`);
  for (const e of errors) console.error(`  - ${e}`);
  process.exit(1);
}
console.log(`✓ specflow consistency OK — ${onDisk.length} promoted skills, all wired.`);
