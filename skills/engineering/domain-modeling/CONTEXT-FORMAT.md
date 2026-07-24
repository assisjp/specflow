# CONTEXT.md format

`CONTEXT.md` is a glossary of the project's ubiquitous language. It is **only** a glossary — no implementation details, no decisions, no todos. If a line reads like a spec or a note-to-self, it does not belong here.

## Shape

```markdown
# Domain Glossary

## <Term>

<One or two sentences defining the term precisely, from the domain's point of view.>

- **Not to be confused with:** <the near-neighbour term this is often conflated with, if any>
- **Relates to:** <other glossary terms, linked>
```

## Rules

- **One canonical name per concept.** If the team says "account", "user", and "customer" for the same thing, pick one and record the others as aliases pointing to it.
- **Define from the domain, not the database.** "A Cancellation is a customer's request to reverse an Order before fulfilment" — not "a row in the cancellations table".
- **Capitalise domain terms** when used as terms, so prose stays unambiguous.
- **Write the moment it resolves.** A term settled in conversation but not written down is a term that will drift by next week.
- **Keep it short.** A glossary people actually read is one they can skim in a minute.

## Example

```markdown
# Domain Glossary

## Order

A customer's committed request for one or more Line Items at agreed prices. An Order exists from checkout until it is fully Fulfilled or Cancelled.

- **Not to be confused with:** Cart (uncommitted, mutable, no price lock)
- **Relates to:** Line Item, Fulfilment, Cancellation

## Cancellation

A customer's request to reverse an Order, or specific Line Items within it, before Fulfilment. Partial Cancellation is possible.

- **Relates to:** Order, Line Item, Refund
```
