# 0008 — A returned spec is the same entity, and `to-spec` clears its marker on republish

- **Status:** Accepted
- **Date:** 2026-07-24

## Context

The second-failure gate (0.9.0–0.9.1) marks a source `returned` when `spec-execution` hands it back as a spec defect, and step 2 refuses to implement a marked source. That closed the write→read loop but left no exit: nothing ever removes the marker. A spec rewritten via `grill` still carries `returned`, so step 2 refuses it forever — the fix cannot unblock the work, because what step 2 reads is "this was returned once", which never stops being true. Confirmed live on a real issue: after rewriting the criterion to a verifiable one, the gate still refused.

The missing decision is ownership of the *clear*, and it turns on a modelling question: is a rewritten spec the **same** spec, healed, or a **new** one?

## Decision

A rewritten source is the **same entity** — same issue, same local file, same identity. The rewrite heals it; it does not replace it. **The skill that republishes the source clears the marker** — the *republisher*, not `to-spec` by name. That keeps ADR 0006's ownership split intact: `to-spec` owns and republishes specs (`docs/specs/`), `to-tickets` owns and republishes tickets (`docs/tickets/`), and each clears the marker on the source type it owns. Since `spec-execution` runs tickets on the frontier, the ticket is the marked source there, and `to-tickets` is its clearer. Clearing = remove the `returned` label and leave a "rewritten" comment (tracker), or delete the returned-state line (local). That is the gate's exit, and it generalises to any future publisher without amendment.

The marker is a **state, not a counter**: a source is either `returned` (sent back as a spec defect, not yet rewritten) or not. Step 2 fires on the state's presence. It is only ever written when the blocker is the *spec* (not the code), so retrying against an unchanged spec is pointless and refusing is correct — but the honest name for that is a *blocked-pending-rewrite* state, not a "number of returns".

## Alternatives considered

- **Clear it in `grill`.** `grill` does the rewriting, but it does not own the published artifact — publication belongs to the republisher (`to-spec` / `to-tickets`), and the clear must happen exactly when the healed source is published, not when the conversation ends.
- **Name `to-spec` as the sole clearer.** Simpler to state, but wrong: the frontier runs *tickets*, so the marked source is usually a ticket, which `to-spec` does not own (ADR 0006). Tying the clear to the republisher instead of one named skill keeps the ownership split honest.
- **Rewrite produces a new spec/issue; leave the marker on the old one.** No clear needed, but it breaks the blocking edges of every ticket that referenced the old identifier, and orphans its history. Same-entity keeps the graph intact.
- **Keep `Returns: N` as a real counter, fire at N ≥ 2.** Implies a first implementation attempt against an unchanged spec is worth making, which it is not — the mark means the spec is the blocker. A counter would be theatre; a state is the truth.

## Consequences

- **Easier:** the loop has an exit — heal the spec, republish, the gate releases. Tickets keep their identity and blocking edges.
- **Harder / accepted:** the republisher (`to-spec` or `to-tickets`) now has a side effect — clearing a marker — beyond writing content, and must recognise an existing marked source rather than blindly creating a new one. The marker has one owner per transition: `spec-execution` **sets** it, the **republisher clears** it — one edge each, no shared write.
