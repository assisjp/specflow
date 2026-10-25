# code-review

Review requested behavior and repository contracts against one fixed candidate.

## When to use it

Use for committed, staged or work-in-progress changes, including before the feature is committed.

## Behavior

- Resolve a base and choose commits, staged or working-tree mode. Capture tracked changes and relevant untracked files without staging user work. Record candidate identity, paths and content hashes.
- Give reviewers the same immutable patch/evidence; do not substitute moving HEAD for the actual candidate. Reconcile concurrent changes and report surfaces a textual patch cannot represent.
- Use the supplied spec first and obtain only missing context. Standards and Spec are separate questions, not fixed agent quotas.
- Delegate independent review where risk warrants it; label shared-context review honestly. Inherit the session model. Smells require concrete consequences, not mandatory abstraction or refactoring.
- Confirm findings, merge duplicates and prioritize by impact while retaining their sources. After fixes, reassess changed hunks and checks/evidence invalidated by them; compare the delivered content with the reviewed snapshot.

## Source

The [skill instructions](../../skills/engineering/code-review/SKILL.md) define the full contract. Repository policy and the user's authorization take precedence over the defaults.
