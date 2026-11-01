<div align="center">

# RSI.js

**A typed TypeScript client for the data published on [robertsspaceindustries.com](https://robertsspaceindustries.com).**

Citizens, organizations, ships, the starmap, the roadmap, the progress tracker, game versions, telemetry and crowdfunding stats, all behind a single client.

[![npm version](https://img.shields.io/npm/v/@unofficial-star-citizen-api/rsi.js?logo=npm&color=cb3837)](https://www.npmjs.com/package/@unofficial-star-citizen-api/rsi.js)[![npm downloads](https://img.shields.io/npm/dm/@unofficial-star-citizen-api/rsi.js?logo=npm)](https://www.npmjs.com/package/@unofficial-star-citizen-api/rsi.js)[![CI/CD](https://github.com/unofficial-star-citizen-api/RSI.js/actions/workflows/ci-cd.yaml/badge.svg?branch=main)](https://github.com/unofficial-star-citizen-api/RSI.js/actions/workflows/ci-cd.yaml)[![TypeScript](https://img.shields.io/badge/TypeScript-strict-3178c6?logo=typescript&logoColor=white)](tsconfig.json)[![License: MIT](https://img.shields.io/badge/license-MIT-green.svg)](#license)

[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](CONTRIBUTING.md)[![Good first issues](https://img.shields.io/github/issues/unofficial-star-citizen-api/RSI.js/good%20first%20issue?label=good%20first%20issues&color=7057ff)](https://github.com/unofficial-star-citizen-api/RSI.js/issues?q=is%3Aissue+is%3Aopen+label%3A%22good+first+issue%22)[![Open issues](https://img.shields.io/github/issues/unofficial-star-citizen-api/RSI.js)](https://github.com/unofficial-star-citizen-api/RSI.js/issues)[![GitHub stars](https://img.shields.io/github/stars/unofficial-star-citizen-api/RSI.js?style=social)](https://github.com/unofficial-star-citizen-api/RSI.js/stargazers)

[Installation](#installation) •
[Quick start](#quick-start) •
[API reference](#api-reference) •
[Configuration](#configuration) •
[Contributing](#contributing)

</div>

---

> [!NOTE]
> RSI.js is an **unofficial** Star Citizen fan project. It is not affiliated with, endorsed by, or supported by Cloud Imperium Games or Roberts Space Industries. Star Citizen®, Squadron 42®, Roberts Space Industries® and Cloud Imperium® are trademarks of Cloud Imperium Rights LLC.

## Why RSI.js?

RSI has no public API. The data is spread across HTML pages, internal JSON endpoints and a GraphQL endpoint, and each one changes shape on its own schedule. RSI.js wraps all of them and gives you:

- **One client, many sources**: HTML scraping (via [cheerio](https://cheerio.js.org/)), RSI's internal JSON APIs and its GraphQL endpoint, all behind one `RSI` object.
- **Fully typed results**: every response has an exported TypeScript interface, and every filter has an enum, so your editor autocompletes ship classifications, org activities, roadmap boards and so on.
- **Clean, normalized output**: relative links are made absolute, dates are ISO strings, and every resource exposes a consistent `meta.url`.
- **Typed errors**: `RSIUserNotFoundError` and `RSIOrganizationNotFoundError` are distinct from generic upstream failures.
- **Proxy support built in**: HTTP, HTTPS and SOCKS proxies, `NO_PROXY` matching, plus a ready-to-run Tor rotating proxy for heavy workloads.
- **Runs anywhere**: CommonJS, ES modules and a browser IIFE bundle.

## Installation

```bash
npm install @unofficial-star-citizen-api/rsi.js
# or
pnpm add @unofficial-star-citizen-api/rsi.js
# or
yarn add @unofficial-star-citizen-api/rsi.js
```

`axios` and `cheerio` are peer dependencies. npm 7+ and pnpm install them automatically; with other package managers, add them yourself:

```bash
npm install axios cheerio
```

Release candidates are published to GitHub Packages under the `next` dist-tag. Stable releases go to npm under `latest`.

## Quick start

```typescript
import { RSI } from '@unofficial-star-citizen-api/rsi.js';

const rsi = new RSI();

// A citizen's public profile
const profile = await rsi.users.getProfile('Dymerz');
console.log(profile?.handle, profile?.enlisted, profile?.meta.url);

// An organization
const org = await rsi.organizations.get('PROTECTORA');
console.log(org.name, org.membersCount);

// Ships matching a name
const ships = await rsi.ships.search({ name: 'Cutlass' });
console.log(ships.map(ship => `${ship.name}: $${ship.price}`));

// The current LIVE game version
const live = await rsi.versions.roadmap.getLiveVersion();
console.log(live);
```

CommonJS works too:

```javascript
const { RSI } = require('@unofficial-star-citizen-api/rsi.js');
```

## API reference

Every module hangs off an `RSI` instance. All methods are `async` and return typed results.

### `rsi.users`: Citizens

| Method | Returns | Source |
|---|---|---|
| `getProfile(handle)` | `RSIUserProfile`: citizen record number, display name, handle, badge, avatar, enlisted date, location, fluency, website, bio | `/citizens/{handle}` |
| `getOrganization(handle)` | `RSIUserOrganization`: main org (with rank, stars and characteristics) plus every public affiliation | `/citizens/{handle}/organizations` |

Handles must match `[a-zA-Z0-9_-]{1,60}`. An unknown handle throws `RSIUserNotFoundError`. Redacted (hidden) affiliations are skipped.

```typescript
const { organization, affiliations } = await rsi.users.getOrganization('Dymerz');
```

### `rsi.organizations`: Organizations

| Method | Returns | Source |
|---|---|---|
| `get(sid)` | `RSIOrganization`: name, logo, banner, member count, archetype, commitment, focus, history, manifesto, charter | `/orgs/{sid}` |
| `search(params?)` | `RSIOrganizationSearch[]` | `/api/orgs/getOrgs` |
| `searchMembers(params)` | `RSIOrganizationMember[]` | `/api/orgs/getOrgMembers` |

```typescript
import {
  RSIOrganizationSearchParamsActivities,
  RSIOrganizationSearchParamsBoolean,
  RSIOrganizationSearchParamsLanguage,
} from '@unofficial-star-citizen-api/rsi.js';

const orgs = await rsi.organizations.search({
  search: 'mining',
  activity: [RSIOrganizationSearchParamsActivities.Resources],
  languages: [RSIOrganizationSearchParamsLanguage.French],
  recruiting: [RSIOrganizationSearchParamsBoolean.Yes],
  page: 1,
});

const members = await rsi.organizations.searchMembers({ sid: 'PROTECTORA', search: 'Dymerz' });
```

### `rsi.ships`: Ships

| Method | Returns | Source |
|---|---|---|
| `search(params)` | `RSIShipSearch[]`: full ship-matrix specs plus the lowest current store price | `/api/store/getShips` + `/ship-matrix/index` + ship pages |

Filters: `name`, `classification` (`RSIShipClassification`), `size` (`RSIShipSize`), `status` (`RSIShipStatus`), `sale`, `length_min/max`, `crew_min/max`, `price_min/max`, `mass_min/max`, `page` and `page_max`.

```typescript
import { RSIShipClassification, RSIShipSize } from '@unofficial-star-citizen-api/rsi.js';

const freighters = await rsi.ships.search({
  classification: RSIShipClassification.Transport,
  size: RSIShipSize.Large,
  page_max: 5, // walk up to 5 store pages
});
```

> [!TIP]
> Each matched ship costs one extra request to fetch its price. Search pages are fetched in batches of 5, and ship details with a concurrency of 5. Keep `page_max` small, or use a [proxy](#rotating-proxy-service), when you scan the whole store.

### `rsi.versions`: Game versions and patch notes

| Method | Returns | Source |
|---|---|---|
| `roadmap.getVersions()` | `{ live, ptu, etf }` version strings (`null` when a channel isn't announced) | `/api/roadmap/v1/init` |
| `roadmap.getLiveVersion()` / `getPTUVersion()` / `getETFVersion()` | A single channel's version string, or `null` | `/api/roadmap/v1/init` |
| `patchNote.getAll()` | `RSIPatchNote[]` | `/patch-notes` |
| `patchNote.getLatest()` | The most recent `RSIPatchNote` | `/patch-notes` |
| `patchNote.find(version)` | The `RSIPatchNote` for a given version | `/patch-notes` |
| `spectrum.get()` / `getLive()` / `getPtu()` / `getEtf()` | `RSISpectrumVersion[]` from Spectrum patch-note threads | Spectrum forum API |

### `rsi.roadmaps`: Release roadmap

| Method | Returns | Source |
|---|---|---|
| `getBoardReleases(board)` | `RSIRoadmap` with releases, cards and statuses | `/api/roadmap/v1/boards/{1,2}` |

```typescript
import { RSIRoadmapBoard } from '@unofficial-star-citizen-api/rsi.js';

const sc = await rsi.roadmaps.getBoardReleases(RSIRoadmapBoard.StarCitizen);
const s42 = await rsi.roadmaps.getBoardReleases(RSIRoadmapBoard.Squadron42);
```

### `rsi.progressTrackers`: Progress tracker

| Method | Returns | Source |
|---|---|---|
| `getTeams()` | `RSIProgressTrackerTeam[]` | `/graphql` |
| `getTeamBySlug(slug)` | `RSIProgressTrackerTeam \| undefined` | `/graphql` |
| `getDeliverables()` | `RSIProgressTrackerDeliverable[]` | `/graphql` |
| `getDeliverablesByTeamSlug(slug)` | `RSIProgressTrackerDeliverable[]` | `/graphql` |

### `rsi.starmaps`: ARK Starmap

| Method | Returns |
|---|---|
| `search(query)` | Systems and celestial objects matching a name |
| `findRoutes(from, to, shipSize)` | Shortest and fewest-jumps routes (`RSIStarmapRouteShipSize.Small \| Medium \| Large`) |
| `getStarSystemByCode(code)` | A single star system |
| `getCelestialObjectByCode(code)` | A single planet, moon, station and so on (for example `TOHIL.PLANETS.TOHILIII`) |
| `getAllCelestialObject()` | Every celestial object |
| `getSystems()` | Every star system |
| `getTunnels()` | Every jump tunnel |
| `getSpecies()` | Every species |
| `getAffiliations()` | Every political affiliation |

### `rsi.telemetries`: Community telemetry

| Method | Returns | Source |
|---|---|---|
| `community(timetable, version)` | `RSITelemetry` (current vs. past period) | `/api/telemetry/v2/community/` |

```typescript
import { RSITelemetryTimetable } from '@unofficial-star-citizen-api/rsi.js';

const telemetry = await rsi.telemetries.community(RSITelemetryTimetable.Week, 'sc-alpha-4.0');
```

### `rsi.fundingGoals`: Crowdfunding stats

| Method | Returns | Source |
|---|---|---|
| `getCrowdfundingStats(period)` | `RSIFundingGoals`: funds, fans, fleet and alpha slots | `/api/stats/getCrowdfundStats` |

```typescript
import { RSIFundingGoalsTimePeriod } from '@unofficial-star-citizen-api/rsi.js';

const stats = await rsi.fundingGoals.getCrowdfundingStats(RSIFundingGoalsTimePeriod.Day);
```

### Resource metadata

Parsed resources expose a `meta` property (the exported `RSIResourceMeta` interface) for data about the resource itself, such as its public RSI page:

```typescript
const profile = await rsi.users.getProfile('Dymerz');
console.log(profile?.meta.url); // https://robertsspaceindustries.com/citizens/Dymerz
```

> [!IMPORTANT]
> **Breaking change.** Resource URLs used to be top-level `url`, `href` or `link` fields. They are now under `meta.url`. Other fields, such as a user's `website`, are unchanged, and raw upstream response fields keep their source shape.

## Error handling

Every upstream failure is an `RSIError`, or a subclass of it. `getStatus()` returns a suggested HTTP status, which is handy when you put RSI.js behind your own API.

| Error | When | `getStatus()` |
|---|---|---|
| `RSIUserNotFoundError` | The citizen handle does not exist | `404` |
| `RSIOrganizationNotFoundError` | The organization SID does not exist | `404` |
| `RSIError` | RSI returned a non-2xx status, an empty body, or `success !== 1` | `500` |
| `Error` | Invalid input, such as a malformed handle, an unknown timetable, or a bad telemetry version | n/a |

```typescript
import { RSIError, RSIUserNotFoundError } from '@unofficial-star-citizen-api/rsi.js';

try {
  await rsi.users.getProfile('someone');
} catch (error) {
  if (error instanceof RSIUserNotFoundError) {
    // 404: the handle does not exist
  } else if (error instanceof RSIError) {
    // RSI is down, rate-limiting you, or changed its page
  } else {
    throw error;
  }
}
```

## Configuration

```typescript
const rsi = new RSI({
  httpConfig: {
    timeout: 15_000,                       // ms, default 15000
    userAgent: 'MyBot/1.0 (me@example.com)',
    httpProxy: 'http://proxy:8080',
    httpsProxy: 'socks5://localhost:5566', // http(s):// and socks:// proxies are supported
    noProxy: 'localhost,*.internal',
  },
  logging: false,                           // default false
});
```

### Environment variables

In Node.js, unset `httpConfig` options fall back to these environment variables. Values passed to the constructor take precedence.

| Variable | Option |
|---|---|
| `HTTP_PROXY` | `httpProxy` |
| `HTTPS_PROXY` | `httpsProxy` |
| `NO_PROXY` | `noProxy` (comma-separated; supports `*.domain` and `.domain`) |
| `USER_AGENT` | `userAgent` |
| `HTTP_TIMEOUT` | `timeout` (ms) |

### Logging

Logging is off by default. Set `logging: true` to print command activity, HTTP requests (method and URL), HTTP responses (status code) and proxy errors to the console, in Node.js or in the browser. Request and response bodies and headers are never logged.

The toggle is global: creating an `RSI` instance sets it for every existing instance, so the most recently created instance decides whether logs are enabled.

## Rotating proxy service

RSI rate-limits aggressive clients. The repository ships a `docker-compose.yml` that runs [`mattes/rotating-proxy`](https://hub.docker.com/r/mattes/rotating-proxy): several Tor instances behind HAProxy, with automatic circuit rotation.

```bash
docker compose up -d
```

| Port | Purpose |
|---|---|
| `5566` | Proxy endpoint (no authentication, **for local use only**) |
| `4444` | HAProxy stats page: <http://localhost:4444/> |

Point RSI.js at it:

```typescript
const rsi = new RSI({
  httpConfig: { httpsProxy: 'socks5://localhost:5566' },
});
```

To force new Tor circuits, run `curl -x localhost:5566 http://1.1.1.1`. To tune the pool, edit `docker-compose.yml`:

```yaml
environment:
  - TOR_INSTANCES=10          # number of Tor instances
  - TOR_NewCircuitPeriod=120  # seconds between circuit rotations
```

## Browser usage

The build also produces an IIFE bundle that exposes a global `RSI` namespace:

```html
<script src="https://cdn.jsdelivr.net/npm/@unofficial-star-citizen-api/rsi.js/dist/index.browser.min.js"></script>
<script>
  const rsi = new RSI.RSI();
  rsi.users.getProfile('Dymerz').then(console.log);
</script>
```

> [!WARNING]
> Browsers enforce CORS, and robertsspaceindustries.com does not allow cross-origin requests from arbitrary sites. The browser bundle is meant for environments that are not bound by CORS (browser extensions, Electron, userscripts) or for use behind your own proxy. Proxy options only apply in Node.js.

## How it works

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

Each module lives in `src/commands/<module>/` with its implementation, interfaces, typed errors, HTML/JSON fixtures and co-located tests. See [CONTRIBUTING.md](CONTRIBUTING.md#project-structure) for the full layout.

## Contributing

**Contributions are very welcome**, whether it is a bug report, a fix for a page RSI just changed, a new endpoint or better docs.

RSI changes its website without warning, so scrapers break. If something returns empty fields or throws, an [issue with the handle, SID or URL you used](https://github.com/unofficial-star-citizen-api/RSI.js/issues/new/choose) is already a great contribution.

```bash
git clone https://github.com/unofficial-star-citizen-api/RSI.js.git
cd RSI.js
pnpm install
pnpm run check   # lint + tests, no network needed
```

Read **[CONTRIBUTING.md](CONTRIBUTING.md)** for the workflow, code style, how to add a new module, and how to write tests against fixtures. Not sure where to start? Look at the [good first issues](https://github.com/unofficial-star-citizen-api/RSI.js/issues?q=is%3Aissue+is%3Aopen+label%3A%22good+first+issue%22).

## Responsible use

RSI.js reads publicly available pages. Please:

- Cache results and avoid hammering RSI. Most of this data changes a few times a day at most.
- Set a meaningful `userAgent` so RSI can identify your application.
- Respect the [RSI Terms of Service](https://robertsspaceindustries.com/tos) and the privacy of the citizens whose public profiles you read.

## License

[MIT](https://opensource.org/licenses/MIT). Built by the Star Citizen community, for the Star Citizen community. o7
