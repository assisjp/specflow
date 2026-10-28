# file-pr

Publish an authorized pull request with a concise reviewer-facing narrative: the problem, the behavior-level solution, and evidence tied to the final head.

## When to use it

Use `$file-pr` when the user asks to create, open, file, or update a PR. It does not apply to ordinary review or work that has not been authorized for publication.

## Boundaries

- Check for an existing PR before creating another.
- Reconcile the final candidate with the reviewed snapshot before publishing.
- Stage only owned paths and never expose secrets in PR metadata.
- Opening a PR does not authorize merge, auto-merge, force-push, browser access, deployment, or unrelated comments.

Use [pr-maintenance](./pr-maintenance.md) only when the user asks to monitor or reassess the resulting PR.
