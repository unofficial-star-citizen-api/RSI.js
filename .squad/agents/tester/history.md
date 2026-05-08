# Tester History

## Project Context

- **Project:** RSI.js — npm library for scraping Robert's Space Industries website
- **Owner:** Dymerz
- **Stack:** TypeScript, Jest, ESLint, Rollup
- **Compatibility:** Node.js + Browser
- **Test Framework:** Jest

## Team

- **Lead:** Tech Lead (architecture decisions)
- **Backend:** HTTP & scraping logic
- **Frontend:** Module exports & browser compatibility
- **Tester:** You — test coverage & quality gates
- **Scribe:** Session logging & decision archival

## Testing Structure

Test Framework: **Jest** (`jest.config.js`)

Test Files:
- `tests/http-client.test.ts` — HTTP client tests
- `tests/rsi.test.ts` — Main RSI client
- `tests/roadmap.test.ts` — Roadmap scraper
- `tests/ship.test.ts` — Ship scraper
- `tests/starmap.test.ts` — Starmap scrapers
- `tests/stats.test.ts` — Stats
- `tests/telemetry.test.ts` — Telemetry
- `tests/user.test.ts` — User scraper
- `tests/version/` — Version-related tests
- `tests/organization/` — Organization scraper tests
- `tests/progress-tracker/` — Progress tracker tests

Test Fixtures:
- `tests/schemas/` — JSON schemas for API responses
- `tests/mocks/` — Mock HTTP client and fixtures

Test Configuration:
- TypeScript support via `tests/tsconfig.json`
- ESLint: `eslint.config.mjs`

## Key Decisions

(None yet — team just hired)

## Learnings

(To be filled as work progresses)
