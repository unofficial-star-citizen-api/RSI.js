<div align="center">

# RSI.js

**A typed TypeScript client for the data published on [robertsspaceindustries.com](https://robertsspaceindustries.com).**

Citizens, organizations, ships, the starmap, the roadmap, the progress tracker, game versions, telemetry and crowdfunding stats, all behind a single client.

[![npm version](https://img.shields.io/npm/v/@unofficial-star-citizen-api/rsi.js?logo=npm&color=cb3837)](https://www.npmjs.com/package/@unofficial-star-citizen-api/rsi.js)[![npm downloads](https://img.shields.io/npm/dm/@unofficial-star-citizen-api/rsi.js?logo=npm)](https://www.npmjs.com/package/@unofficial-star-citizen-api/rsi.js)[![CI/CD](https://github.com/unofficial-star-citizen-api/RSI.js/actions/workflows/ci-cd.yaml/badge.svg?branch=main)](https://github.com/unofficial-star-citizen-api/RSI.js/actions/workflows/ci-cd.yaml)[![Docs](https://img.shields.io/badge/docs-github%20pages-blue?logo=readthedocs&logoColor=white)](https://unofficial-star-citizen-api.github.io/RSI.js/)[![TypeScript](https://img.shields.io/badge/TypeScript-strict-3178c6?logo=typescript&logoColor=white)](https://github.com/unofficial-star-citizen-api/RSI.js/blob/main/tsconfig.json)[![License: MIT](https://img.shields.io/badge/license-MIT-green.svg)](#license)

[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](https://github.com/unofficial-star-citizen-api/RSI.js/blob/main/CONTRIBUTING.md)[![Good first issues](https://img.shields.io/github/issues/unofficial-star-citizen-api/RSI.js/good%20first%20issue?label=good%20first%20issues&color=7057ff)](https://github.com/unofficial-star-citizen-api/RSI.js/issues?q=is%3Aissue+is%3Aopen+label%3A%22good+first+issue%22)[![Open issues](https://img.shields.io/github/issues/unofficial-star-citizen-api/RSI.js)](https://github.com/unofficial-star-citizen-api/RSI.js/issues)[![GitHub stars](https://img.shields.io/github/stars/unofficial-star-citizen-api/RSI.js?style=social)](https://github.com/unofficial-star-citizen-api/RSI.js/stargazers)

[Installation](#installation) •
[Quick start](#quick-start) •
[Documentation](#documentation) •
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

## Documentation

**Full documentation: [unofficial-star-citizen-api.github.io/RSI.js](https://unofficial-star-citizen-api.github.io/RSI.js/)**

- Guides: [Getting started](https://unofficial-star-citizen-api.github.io/RSI.js/getting-started), [Configuration](https://unofficial-star-citizen-api.github.io/RSI.js/configuration), [Proxies](https://unofficial-star-citizen-api.github.io/RSI.js/proxies), [Error handling](https://unofficial-star-citizen-api.github.io/RSI.js/error-handling), [Browser usage](https://unofficial-star-citizen-api.github.io/RSI.js/browser-usage), [How it works](https://unofficial-star-citizen-api.github.io/RSI.js/how-it-works)
- API reference: every module, method, type and error, with examples, generated from the source code

Every module hangs off an `RSI` instance. All methods are `async` and return typed results.

| Module | What it returns | Reference |
|---|---|---|
| `rsi.users` | Citizen profiles and organization affiliations | [Users](https://unofficial-star-citizen-api.github.io/RSI.js/users) |
| `rsi.organizations` | Organization pages, directory search and member lists | [Organizations](https://unofficial-star-citizen-api.github.io/RSI.js/organizations) |
| `rsi.ships` | Ships by ID, chassis or search, with ship-matrix specs and store prices | [Ships](https://unofficial-star-citizen-api.github.io/RSI.js/ships) |
| `rsi.versions` | LIVE, PTU and ETF versions, patch notes | [Versions](https://unofficial-star-citizen-api.github.io/RSI.js/versions) |
| `rsi.roadmaps` | Star Citizen and Squadron 42 release roadmaps | [Roadmaps](https://unofficial-star-citizen-api.github.io/RSI.js/roadmaps) |
| `rsi.progressTrackers` | Progress tracker teams and deliverables | [ProgressTrackers](https://unofficial-star-citizen-api.github.io/RSI.js/progresstrackers) |
| `rsi.starmaps` | ARK Starmap systems, celestial objects, tunnels and routes | [Starmaps](https://unofficial-star-citizen-api.github.io/RSI.js/starmaps) |
| `rsi.telemetries` | Community performance telemetry | [Telemetries](https://unofficial-star-citizen-api.github.io/RSI.js/telemetries) |
| `rsi.fundingGoals` | Crowdfunding stats | [FundingGoals](https://unofficial-star-citizen-api.github.io/RSI.js/fundinggoals) |

## Error handling

Every upstream failure is an `RSIError`, or a subclass such as `RSIUserNotFoundError` and `RSIOrganizationNotFoundError`. Invalid input throws a plain `Error` before any request is sent.

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

See the [Error handling guide](https://unofficial-star-citizen-api.github.io/RSI.js/error-handling) for every error and when it is thrown.

## Configuration

```typescript
const rsi = new RSI({
  httpConfig: {
    timeout: 15_000,                       // ms, default 15000
    userAgent: 'MyBot/1.0 (me@example.com)',
    httpsProxy: 'socks5://localhost:5566', // http(s):// and socks:// proxies are supported
  },
  logging: false,                           // default false
});
```

Options can also come from environment variables, and the repository ships a ready-to-run Tor rotating proxy. See the [Configuration](https://unofficial-star-citizen-api.github.io/RSI.js/configuration) and [Proxies](https://unofficial-star-citizen-api.github.io/RSI.js/proxies) guides.

## Contributing

**Contributions are very welcome**, whether it is a bug report, a fix for a page RSI just changed, a new endpoint or better docs. Docs improvements count: a typo, a clearer explanation, a missing example or a new guide.

RSI changes its website without warning, so scrapers break. If something returns empty fields or throws, an [issue with the handle, SID or URL you used](https://github.com/unofficial-star-citizen-api/RSI.js/issues/new/choose) is already a great contribution.

```bash
git clone https://github.com/unofficial-star-citizen-api/RSI.js.git
cd RSI.js
pnpm install
pnpm run check   # lint + tests, no network needed

# preview the documentation site
pnpm run docs && pnpm run docs:serve
```

The API reference is generated from the doc comments in `src/`, and the guides live in `docs/`. See [Documentation](https://github.com/unofficial-star-citizen-api/RSI.js/blob/main/CONTRIBUTING.md#documentation) in the contributing guide for the conventions.

Read **[CONTRIBUTING.md](https://github.com/unofficial-star-citizen-api/RSI.js/blob/main/CONTRIBUTING.md)** for the workflow, code style, how to add a new module, and how to write tests against fixtures. Not sure where to start? Look at the [good first issues](https://github.com/unofficial-star-citizen-api/RSI.js/issues?q=is%3Aissue+is%3Aopen+label%3A%22good+first+issue%22).

## Responsible use

RSI.js reads publicly available pages. Please:

- Cache results and avoid hammering RSI. Most of this data changes a few times a day at most.
- Set a meaningful `userAgent` so RSI can identify your application.
- Respect the [RSI Terms of Service](https://robertsspaceindustries.com/tos) and the privacy of the citizens whose public profiles you read.

## License

[MIT](https://opensource.org/licenses/MIT). Built by the Star Citizen community, for the Star Citizen community. o7
