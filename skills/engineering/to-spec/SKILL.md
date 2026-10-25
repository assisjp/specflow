---
name: to-spec
description: Turn the current conversation — ideally the decision log from a grill session — into a spec (a PRD) and publish it to the project's issue tracker, or to a local file if there is none. No interview; this is pure synthesis of what has already been decided. Use when the user says "write the spec", "turn this into a spec", or after grilling has reached shared understanding.
disable-model-invocation: true
---

# To Spec

Synthesize accepted decisions and codebase facts into the smallest useful specification. A settled request can be enough; a `grill` session is not a prerequisite. Do not invent requirements or restart an interview already resolved.

## 1. Reuse context and decisions

Read the relevant request, existing source, glossary and architectural decisions. Inspect implementation boundaries only where needed to establish the contract. Reuse approved test seams; otherwise select conventional seams proportional to risk. Ask only if an unresolved choice changes behavior, scope or material cost. Do not pause for routine test placement.

## 2. Write a bounded contract

Use the project's established format or this short shape:

- **Problem and outcome:** what changes for the user and why.
- **Acceptance criteria:** concrete observable examples, including important failure paths.
- **Decisions and constraints:** accepted interfaces, relevant architecture and compatibility requirements.
- **Verification:** useful existing/new coverage, affected consumers and authorized environment.
- **Out of scope/open questions:** excluded work and genuinely unresolved decisions.

Scale detail with risk and uncertainty; do not generate a long user-story list by default. Paths or short snippets are useful when they precisely locate a contract; qualify mutable references with the relevant source version rather than banning them. Reuse durable decisions by reference instead of duplicating their full text.

Check each claim against an accepted decision, user statement or codebase fact. If an open question leaves a criterion unbuildable, resolve that question before calling the source ready; publish a clearly labeled draft if that is what the user requested. Harmless contextual uncertainties need not block the whole task.

## 3. Save or publish as authorized

Use the existing tracker or repository convention. With no chosen location, infer from the project or ask only if publishing scope is ambiguous. A local default is `docs/specs/<feature-slug>.md`; durable specs should be versioned according to the repo's delivery workflow, not hidden in scratch. Do not create an issue or commit merely because a template mentions one if the user requested only a draft.

### Healing a returned spec

Read a `returned` label or `Returned:` line as an unresolved source defect. Correct the same source, preserving identity, edges and other contributors' work. Apply the accepted clarification, record its reason and verify that the particular criterion is observable before clearing. Remove the `returned` label and record the correction on the tracker, or delete the `Returned:` line after saving the corrected local source. Do not clear merely because some text changed. An authorized implementer may perform the same bounded correction under `spec-execution` (ADR 0009); another skill invocation is not required.

## 4. Deliver

State what was saved/published and any unresolved requirements. A source that fits one coherent change can proceed to `spec-execution`; use `to-tickets` only when independent deliverables or substantial size warrant it. Reuse the user's authorization to continue rather than adding a ceremonial approval round.
