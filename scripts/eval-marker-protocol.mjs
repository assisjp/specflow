#!/usr/bin/env node
// specflow marker-protocol eval — runs the second-failure ("returned") gate's
// LOCAL file backend over a real temp filesystem, deterministically. Zero
// dependencies, zero network: `node scripts/eval-marker-protocol.mjs`.
//
// The contract is EXTRACTED from the four gate skills' prose, never typed here
// a second time — the gate runs on the token as written in the skills, so text
// drift breaks this eval instead of silently breaking the gate. 0.9.4 shipped
// exactly that drift: spec-execution WROTE `Returned:` but its step-2 reader
// looked for `Returns:`, and the 4-attempt live run missed it because only the
// tracker backend was exercised.
//
// SCOPE: local backend ONLY. The tracker backend (GitHub `returned` label +
// comment) needs a network and a real issue, so it stays a manual release-
// checklist item, deliberately — a flaky CI gate on a reliability skill is
// worse than an honest gap.
import { readFileSync, writeFileSync, mkdirSync, mkdtempSync, rmSync } from "node:fs";
import { join, dirname } from "node:path";
import { tmpdir } from "node:os";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
// Overridable so a test can point the eval at a corrupted scratch copy of
// skills/ and prove it bites. Defaults to this repo's skills.
const SKILLS = process.env.SPECFLOW_SKILLS_ROOT ?? join(ROOT, "skills");

const errors = [];
const fail = (m) => errors.push(m);
let transitions = 0; // lifecycle state changes (Part B)
let guards = 0; // contract + regression assertions (Parts A and C)
const step = (cond, m) => (cond ? transitions++ : fail(m));
const guard = (cond, m) => (cond ? guards++ : fail(m));
const bail = () => {
  console.error(`✗ ${errors.length} eval failure(s):`);
  for (const e of errors) console.error(`  - ${e}`);
  process.exit(1);
};

// ── Part A: extract the marker contract from the skills' own prose. ──────────
// setter+reader: spec-execution. clearers: to-spec (spec), to-tickets (ticket).
// router: guide.
const GATE = [
  ["spec-execution", "engineering/spec-execution/SKILL.md"],
  ["to-spec", "engineering/to-spec/SKILL.md"],
  ["to-tickets", "engineering/to-tickets/SKILL.md"],
  ["guide", "productivity/guide/SKILL.md"],
];
// Line token: a backticked span opening `<Token>: …` that the prose calls a
// "line". Label candidates: any backticked `<token>` the prose calls a "label".
const LINE_RE = /`([A-Za-z][\w-]*):[^`]*` line/g;
const LABEL_RE = /`([a-z][\w-]*)` label/g;
const texts = {};
const lineToks = {};
const labelToks = {};
for (const [name, rel] of GATE) {
  const body = readFileSync(join(SKILLS, rel), "utf8");
  texts[name] = body;
  lineToks[name] = [...new Set([...body.matchAll(LINE_RE)].map((m) => `${m[1]}:`))];
  labelToks[name] = new Set([...body.matchAll(LABEL_RE)].map((m) => m[1]));
  if (lineToks[name].length === 0)
    fail(`${name}: no marker line token found in its prose — its half of the local gate is undocumented, so nothing pins it`);
  if (lineToks[name].length > 1)
    fail(`${name}: uses ${lineToks[name].length} marker line tokens (${lineToks[name].join(", ")}) — its own writer and reader disagree, so the local gate would mark the source and then fail to recognise its own mark (the 0.9.4 bug)`);
}

// All four skills must agree on one identical line token.
let lineToken = null;
{
  const byTok = new Map();
  for (const [name] of GATE)
    for (const t of lineToks[name]) byTok.set(t, [...(byTok.get(t) ?? []), name]);
  if (byTok.size === 1) {
    lineToken = [...byTok.keys()][0];
    guards++;
  } else {
    const sides = [...byTok].map(([t, ns]) => `${ns.join("+")} use "${t}"`).join(" vs ");
    fail(`the gate skills do not agree on one marker line token: ${sides} — setter, reader, clearers and router must run on the same token, or the reader never matches what the writer wrote and the local gate silently never fires (the 0.9.4 class)`);
  }
}

// The tracker label: skills also name unrelated labels (`ready-for-agent`), so
// the gate's label is the one label token ALL FOUR protocol skills share.
let labelToken = null;
{
  const sets = GATE.map(([n]) => labelToks[n]);
  const shared = [...sets[0]].filter((t) => sets.every((s) => s.has(t)));
  if (shared.length === 1) {
    labelToken = shared[0];
    guards++;
  } else {
    const per = GATE.map(([n]) => `${n}={${[...labelToks[n]].join(", ")}}`).join("; ");
    fail(`expected exactly one tracker label token shared by all four gate skills, found ${shared.length ? shared.join(", ") : "none"} (${per}) — the tracker backend's label is no longer pinned by shared prose, so setter and router could drift apart`);
  }
}
if (lineToken && labelToken)
  guard(
    labelToken === lineToken.slice(0, -1).toLowerCase(),
    `tracker label \`${labelToken}\` and local line token \`${lineToken}\` name different states — the two backends of one gate must name the same state, or routing and healing diverge by backend`
  );
// Without an agreed line token there is no reader predicate to run Part B on.
if (!lineToken) bail();

// ── Part A2: role presence. Divergence is not the only way a gate dies — so is
// deletion, and the checks above cannot see it. Delete step 2's reader half, or
// the whole "Returning the source" setter, and the token still litters the rest
// of the file: check.mjs guard #11 passes, token agreement passes, the gate is
// dead and CI is green. That is the 0.9.1 class (the write half existed, the
// read half never met it), which token identity alone will never catch.
//
// Anchored on structure — headings, and verb↔token proximity — never on a
// particular sentence, so the prose stays free to be rewritten. Fails closed:
// a role that cannot be found is reported as missing, because shipping a dead
// gate is the worse error.
const esc = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
const sectionOf = (text, headingRe) => {
  const lines = text.split("\n");
  const start = lines.findIndex((l) => headingRe.test(l));
  if (start === -1) return null;
  const depth = lines[start].match(/^#+/)[0].length;
  const rest = lines.slice(start + 1);
  const end = rest.findIndex((l) => /^#+ /.test(l) && l.match(/^#+/)[0].length <= depth);
  return rest.slice(0, end === -1 ? rest.length : end).join("\n");
};

const readerHalf = sectionOf(texts["spec-execution"], /^## 2\. /);
guard(
  readerHalf !== null && readerHalf.includes(lineToken),
  `spec-execution step 2 no longer reads the \`${lineToken}\` marker — the gate's READ half is gone while the setter still writes it, so every later session implements a source already sent back as defective. Token identity cannot see this: the token survives elsewhere in the file (the 0.9.1 class)`
);
// The setter is identified by what it DOES, not by where it sits or what it is
// called: somewhere in spec-execution one passage must instruct marking on both
// backends. Heading-agnostic, so the section can be retitled or moved freely —
// only losing the instruction fails.
// Word-bounded: an unbounded `mark\w*` also matches the NOUN "marker", which
// step 2's reader paragraph is full of — the setter guard would then be
// satisfied by the reader, and M9 (delete the setter) would sail through.
const SET_VERB = "\\b(?:[Aa]dd|[Mm]ark|[Ww]rite)(?:s|es|ing)?\\b";
const setsLabel = new RegExp(`${SET_VERB}[^.]{0,120}\`${esc(labelToken ?? "returned")}\` label`).test(texts["spec-execution"]);
const setsLine = new RegExp(`${SET_VERB}[^.]{0,120}\`${esc(lineToken)}[^\`]*\` line`).test(texts["spec-execution"]);
guard(
  setsLabel && setsLine,
  `spec-execution no longer instructs how to SET the marker (${setsLabel ? "" : "tracker label; "}${setsLine ? "" : "local line; "}missing) — the gate's write half is gone, so step 2 reads a marker nothing ever writes and the second-failure rule collapses back to advice (the 0.9.1 bug itself)`
);
// Each clearer must carry the clear INSTRUCTION for both backends, not merely a
// section title that names the clear — a heading reading "Clearing a `returned`
// marker" above a paragraph that no longer says how is a dead clear that reads
// alive. Verb↔token proximity, once per backend.
const VERB = "(?:[Cc]lear|[Rr]emove|[Dd]elete)\\w*";
for (const n of ["to-spec", "to-tickets"]) {
  const clearsLabel = new RegExp(`${VERB}[^.]{0,120}\`${esc(labelToken ?? "returned")}\` label`).test(texts[n]);
  const clearsLine = new RegExp(`${VERB}[^.]{0,120}\`${esc(lineToken)}[^\`]*\` line`).test(texts[n]);
  guard(
    clearsLabel && clearsLine,
    `${n} no longer instructs how to clear the marker on republish (${clearsLabel ? "" : "tracker label; "}${clearsLine ? "" : "local line; "}missing) — it owns the clear for the source type it publishes (ADR 0008), so a healed source keeps its marker and the gate never releases (the 0.9.2 bug). A heading naming the clear is not the instruction`
  );
}
guard(
  new RegExp(`(${esc(labelToken ?? "returned")}|marker)[^.]{0,160}grill`, "i").test(texts["guide"]),
  `guide no longer routes a marked source to grill — it would hand returned work to a spec-execution that refuses it, and the user never hears where the exit is`
);

// ── Reader predicate and setter, built FROM the extracted token — never from
// a literal typed here. ───────────────────────────────────────────────────────
const isMarked = (text) => new RegExp(`^${esc(lineToken)}`, "m").test(text);
const markerLines = (text) => text.split("\n").filter((l) => l.startsWith(lineToken)).length;
// The setter, as spec-execution's "Returning the source" describes the local
// backend: a `Returned: spec-defect — <reason>` line at the top of the file.
// A state, not a counter (ADR 0008): setting an already-marked source is a no-op.
const setMarker = (file, reason) => {
  const text = readFileSync(file, "utf8");
  if (isMarked(text)) return;
  writeFileSync(file, `${lineToken} spec-defect — ${reason}\n\n${text}`);
};

// ── Parts B + C on a real temp repo, cleaned up on success AND failure. ──────
const tmp = mkdtempSync(join(tmpdir(), "specflow-marker-eval-"));
try {
  // Part B: the full local lifecycle — clean → set → refuse-while-uncleared →
  // clear-on-republish — for BOTH source types the gate covers.
  const slug = "slug-search";
  const sources = [
    {
      type: "spec",
      clearer: "to-spec",
      file: join(tmp, "docs/specs", `${slug}.md`),
      body: "# Spec — slug search\n\n## Problem Statement\n\nUsers cannot look a note up by its slug.\n\n## Solution\n\nAdd a slug lookup that returns the matching note.\n",
      rewritten: "# Spec — slug search\n\n## Problem Statement\n\nUsers cannot look a note up by its slug.\n\n## Solution\n\nAdd GET /notes/:slug; a request for an existing slug returns that note as JSON with status 200.\n",
    },
    {
      type: "ticket",
      clearer: "to-tickets",
      file: join(tmp, "docs/tickets", slug, `01-${slug}.md`),
      body: "# 01 — Slug lookup\n\n**What to build:** looking a note up by its slug shows that note.\n\n**Blocked by:** None — can start immediately.\n\n**Status:** ready-for-agent\n\n- [ ] a slug resolves to its note\n",
      rewritten: "# 01 — Slug lookup\n\n**What to build:** looking a note up by its slug shows that note.\n\n**Blocked by:** None — can start immediately.\n\n**Status:** ready-for-agent\n\n- [ ] GET /notes/:slug for an existing slug returns that note with status 200\n",
    },
  ];
  for (const src of sources) {
    mkdirSync(dirname(src.file), { recursive: true });
    writeFileSync(src.file, src.body);
    // 1. clean → reader false → spec-execution step 2 proceeds.
    step(
      !isMarked(readFileSync(src.file, "utf8")),
      `${src.type}: a clean source reads as marked — step 2 would refuse work that was never returned, blocking every fresh source`
    );
    // 2. spec-execution returns the source → set → refuse.
    setMarker(src.file, "acceptance criterion is not verifiable as written");
    step(
      isMarked(readFileSync(src.file, "utf8")),
      `${src.type}: after spec-execution sets \`${lineToken}\` its own reader does not see it — reader token does not match setter token, the local gate silently never fires (the 0.9.4 bug)`
    );
    // 3. re-read with no intervening change → still refuse. The gate is a
    // state (ADR 0008): it does not decay, re-reading does not release it.
    step(
      isMarked(readFileSync(src.file, "utf8")),
      `${src.type}: the marker stopped reading as set on a bare re-read — the gate is a state, not a counter (ADR 0008); nothing cleared it, so it must still refuse`
    );
    // 4. the owning republisher rewrites the body AND deletes the marker line
    // (to-spec for a spec, to-tickets for a ticket) → release.
    writeFileSync(src.file, src.rewritten);
    step(
      !isMarked(readFileSync(src.file, "utf8")),
      `${src.type}: after ${src.clearer} republishes the rewrite the gate still refuses — deleting the \`${lineToken}\` line did not release it, so healed work stays blocked forever (the 0.9.2 bug)`
    );
    // 4b. the clear must ride a real rewrite of the source.
    guard(
      readFileSync(src.file, "utf8") !== src.body,
      `${src.type}: the republish cleared the marker without changing the body — marker laundering: the gate released against an unhealed source, exactly what "the republisher clears" exists to prevent`
    );
  }

  // Part C: regressions, each named for the bug it guards.
  // C1 (0.9.4): the retired counter token must NOT satisfy the reader.
  guard(
    !isMarked("Returns: 2\n\n# some spec\n"),
    `the retired token "Returns:" satisfies the reader predicate built from \`${lineToken}\` — the counter era's token would re-open the 0.9.4 hole`
  );
  // C2: the marker is a state of the FILE, not of line 1.
  guard(
    isMarked(`# spec\n\nbody\n\n${lineToken} spec-defect — pushed down by a later edit\n\nmore body\n`),
    `a \`${lineToken}\` line below line 1 does not read as marked — a first-line-only reader misses a marker an edit pushed down, and the gate silently opens`
  );
  // C3 (ADR 0008): setting twice is idempotent — state, not counter.
  const twice = join(tmp, "docs/specs", "set-twice.md");
  writeFileSync(twice, "# set twice\n\nbody\n");
  setMarker(twice, "first return");
  const afterOnce = readFileSync(twice, "utf8");
  setMarker(twice, "second return");
  const afterTwice = readFileSync(twice, "utf8");
  guard(
    markerLines(afterTwice) === 1,
    `setting the marker twice left ${markerLines(afterTwice)} marker lines — the marker is a state, not a counter (ADR 0008); a second return must not stack`
  );
  guard(
    afterTwice === afterOnce,
    `a second set changed the file — marked-once and marked-twice must be the identical state (ADR 0008), or one clear no longer releases the gate`
  );
  // C4: to-tickets must document single-ticket healing — republishing ONE
  // marked ticket without re-slicing. Without it the ticket half of the cycle
  // is unreachable in practice: slicing a whole spec again would move the
  // neighbouring tickets' blocking edges.
  // Anchored on the mode's own heading, so a cross-reference elsewhere in the
  // file cannot stand in for the mode actually being there.
  const tt = texts["to-tickets"];
  const heading = tt.split("\n").find((l) => /^#{2,4} .*heal/i.test(l));
  const mode = heading ? sectionOf(tt, new RegExp(`^${esc(heading)}$`)) : null;
  guard(
    mode !== null && /one ticket/i.test(mode) && /slic/i.test(mode),
    `to-tickets has no single-ticket healing mode section (rewrite ONE marked ticket, never re-slice) — the ticket half of the gate's exit is unreachable: its only documented process would re-slice the whole spec and move neighbouring tickets' blocking edges. A pointer to the mode from elsewhere is not the mode`
  );
} finally {
  rmSync(tmp, { recursive: true, force: true });
}

if (errors.length) bail();
console.log(
  `✓ marker-protocol eval OK — ${transitions} lifecycle transitions and ${guards} guards on token \`${lineToken}\` / label \`${labelToken}\` (local backend only; the tracker backend stays a manual release-checklist item).`
);
