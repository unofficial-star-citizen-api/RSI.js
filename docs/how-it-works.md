---
title: How it works
group: Guides
order: 6
---

# How it works

RSI has no public API. The data is spread across HTML pages, internal JSON endpoints and a GraphQL endpoint, and each one changes shape on its own schedule. RSI.js wraps all of them behind one client.

```
             ┌────────────────────────────── RSI ──────────────────────────────┐
             │ users  organizations  ships  versions  roadmaps  starmaps  ...  │
             └────────────────────────────────┬────────────────────────────────┘
                                              │ one shared HttpClient
             ┌────────────────────────────────▼────────────────────────────────┐
             │ HttpClient (axios)                                              │
             │  • proxy agent per request (HTTP / HTTPS / SOCKS, NO_PROXY)     │
             │  • never throws on HTTP status: commands decide what an error is│
             │  • optional request/response logging                           │
             └────────────────────────────────┬────────────────────────────────┘
                                              │
            HTML pages ──► cheerio      JSON APIs ──► typed     /graphql ──► typed
            (users, orgs, patch notes)  (ships, starmap,         (progress tracker)
                                         roadmap, telemetry...)
```

- **HTML pages** (citizens, organizations, patch notes) are parsed with [cheerio](https://cheerio.js.org/).
- **JSON APIs** (ships, starmap, roadmap, telemetry, funding) are typed with exported interfaces. Raw field names are kept as RSI returns them.
- **GraphQL** (progress tracker) results are paged through automatically.

Results are normalized: relative links become absolute, dates are ISO strings or `Date` objects, and every parsed resource exposes `meta.url`.

## Responsible use

RSI.js reads publicly available pages. Please:

- Cache results and avoid hammering RSI. Most of this data changes a few times a day at most.
- Set a meaningful `userAgent` so RSI can identify your application.
- Respect the [RSI Terms of Service](https://robertsspaceindustries.com/tos) and the privacy of the citizens whose public profiles you read.

> RSI.js is an **unofficial** Star Citizen fan project. It is not affiliated with, endorsed by, or supported by Cloud Imperium Games or Roberts Space Industries.
