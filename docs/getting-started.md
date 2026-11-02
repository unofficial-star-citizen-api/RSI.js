---
title: Getting started
slug: getting-started
group: Guides
order: 1
---

# Getting started

## Install

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

Stable releases are published to npm under the `latest` dist-tag. Release candidates are published to GitHub Packages under `next`.

## First requests

Everything goes through one `RSI` client. Each data source is a module on it, and every method is `async` and returns typed results.

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

## Modules

| Module | What it returns | Reference |
|---|---|---|
| `rsi.users` | Citizen profiles and organization affiliations | {@link Users} |
| `rsi.organizations` | Organization pages, directory search and member lists | {@link Organizations} |
| `rsi.ships` | Ship search with ship-matrix specs and store prices | {@link Ships} |
| `rsi.versions` | LIVE, PTU and ETF versions, patch notes | {@link Versions} |
| `rsi.roadmaps` | Star Citizen and Squadron 42 release roadmaps | {@link Roadmaps} |
| `rsi.progressTrackers` | Progress tracker teams and deliverables | {@link ProgressTrackers} |
| `rsi.starmaps` | ARK Starmap systems, celestial objects, tunnels and routes | {@link Starmaps} |
| `rsi.telemetries` | Community performance telemetry | {@link Telemetries} |
| `rsi.fundingGoals` | Crowdfunding stats | {@link FundingGoals} |

Each module page lists every method, its parameters, the errors it throws and an example.

## Resource metadata

Parsed resources expose a `meta` property ({@link RSIResourceMeta}) with data about the resource itself, such as its public RSI page:

```typescript
const profile = await rsi.users.getProfile('Dymerz');
console.log(profile?.meta.url); // https://robertsspaceindustries.com/citizens/Dymerz
```

## Next steps

- the [Configuration](/configuration) guide: timeouts, user agent, environment variables and logging
- the [Proxies](/proxies) guide: route requests through HTTP, HTTPS or SOCKS proxies
- the [Error handling](/error-handling) guide: the error classes and when they are thrown
