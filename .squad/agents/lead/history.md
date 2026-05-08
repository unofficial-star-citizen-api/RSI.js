# Lead History

## Project Context

- **Project:** RSI.js — npm library for scraping Robert's Space Industries website
- **Owner:** Dymerz
- **Stack:** TypeScript, Jest, ESLint, Rollup
- **Compatibility:** Node.js + Browser
- **Scope:** Scrape https://robertsspaceindustries.com — organizations, ships, funding goals, star maps, progress tracker, roadmap, telemetry, user profiles, version info

## Team

- **Lead:** Tech Lead (you)
- **Backend:** HTTP client & scraping logic
- **Frontend:** Module exports & browser compatibility
- **Tester:** Test coverage & quality gates
- **Scribe:** Session logging & decision archival

## Architecture Overview

Current structure (from codebase):
- `src/http-client.ts` — HTTP abstraction layer
- `src/rsi.ts` — Main RSI API client
- `src/commands/` — Domain-specific scrapers (organization, ship, starmap, funding-goals, progress-tracker, roadmap, telemetry, user, version)
- `src/helpers/` — Utility functions
- `src/types/` — Shared TypeScript definitions

## Key Decisions

(None yet — team just hired)

## Learnings

(To be filled as work progresses)
