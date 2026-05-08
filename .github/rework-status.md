# RSI.js — Rework Status (Python → TypeScript)

_Last reviewed: 2026-05-08_

## Library Implementation Status

| Python endpoint | RSI.js command | Status |
|---|---|---|
| `/user/<handle>` (HTML scrape) | `user.getProfile` + `user.getOrganization` | ✅ Complete |
| `/organization/<sid>` (HTML + POST API) | `organization.get` | ✅ Extended (adds history/manifesto/charter) |
| `/organization_members/<sid>` (POST API) | `organization.searchMembers` | ✅ Complete |
| `/ships` (POST + ship-matrix) | `ships.search` | ✅ Complete |
| `/versions` (HTML scrape) | `version.patchNote` | ✅ Complete |
| `/roadmap/<board>` (GET API) | `roadmap.getBoardReleases` | ✅ Complete |
| `/progress-tracker` (GraphQL) | `progressTracker.getTeamsInRange` | ✅ Complete |
| `/progress-tracker/<slug>` (GraphQL) | `progressTracker.getTeamDeliverableInfo` | ✅ Complete |
| `/starmap/<field>` (various endpoints) | `starmap.*` (8 methods) | ✅ Complete |
| `/stats` (crowdfunding + Firebase versions) | `fundingGoals.getCrowStats` | ⚠️ Partial — live/PTU/ETF game versions are split into `version.roadmap` / `version.spectrum`; no single unified `/stats` equivalent |
| `/telemetry/<version>` (GET API) | `telemetry.community` | ✅ Complete |

## Known Issues / TODOs

1. **Stale ProgressTracker date range** — default `2020-01-01` to `2022-12-31` is outdated; should be a rolling window or configurable default.
2. **Typo in public API** — `starmap.findAffilations()` should be `findAffiliations()` (missing 'i').
3. **Missing test** — `User.getOrganization` has no dedicated test; only `getProfile` is covered.
4. **Starmap implementation discrepancy** — `findSystems`, `findTunnels`, `findSpecies`, `findAffilations` all funnel through `POST /api/starmap/bootup` + client-side filtering. `rsi-endpoints.md` documents individual per-resource endpoints that may actually exist and be more efficient.
5. **Fragile integration tests** — several test files (`stats.test.ts`, `roadmap.test.ts`, `ship.test.ts`, `starmap.test.ts`, `telemetry.test.ts`, `progress-tracker.test.ts`) hit the live RSI API. These will break if RSI changes their responses. Ideally these should be mocked.

## Test Coverage Summary

| Module | Test type | Coverage |
|---|---|---|
| `RSI` (constructor) | Unit | ✅ |
| `HttpClient` | Integration (real HTTP) | ✅ |
| `FundingGoals` | Integration + schema | ✅ |
| `Organization.get` | Unit (HTML mock) | ✅ |
| `Organization.search` | Unit (mock) | ✅ |
| `Organization.searchMembers` | Unit (mock) | ✅ |
| `ProgressTracker` | Mixed (mock teams, real deliverables) | ⚠️ Partial |
| `Roadmap` | Integration + schema | ✅ |
| `Ship` | Integration + schema | ✅ |
| `Starmap` | Integration + schema (all 8 methods) | ✅ |
| `Telemetry` | Integration + schema | ✅ |
| `User.getProfile` | Unit (HTML mock) | ✅ |
| `User.getOrganization` | — | ❌ Missing |
| `Version` (structure) | Unit | ✅ |
| `version.spectrum` | Unit (private method) | ✅ |
| `version.patchNote` | Unit (HTML mock) | ✅ |
| `version.roadmap` | Unit (JSON mocks) | ✅ |

## Architecture Notes

- Built on **axios** with proxy support (HTTP/HTTPS/SOCKS via env vars `HTTP_PROXY`, `HTTPS_PROXY`, `NO_PROXY`, `USER_AGENT`).
- Builds to **CJS + ESM + UMD** via Rollup — compatible with Node.js and browser.
- Organization module uses **factory pattern** (closures over `httpClient`). Other modules use classes.
- `StarMapHelper.getStarmapData<T>()` is a shared helper for the four bootup-backed methods.
- `version.roadmap`, `version.patchNote`, `version.spectrum` are sub-instances on the `Version` class — no namespace collision with top-level `Roadmap`.
