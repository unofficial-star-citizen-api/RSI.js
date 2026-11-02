---
title: Getting started
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

| Module | What it returns |
|---|---|
| `rsi.users` | Citizen profiles and organization affiliations |
| `rsi.organizations` | Organization pages, directory search and member lists |
| `rsi.ships` | Ship search with ship-matrix specs and store prices |
| `rsi.versions` | LIVE, PTU and ETF versions, patch notes |
| `rsi.roadmaps` | Star Citizen and Squadron 42 release roadmaps |
| `rsi.progressTrackers` | Progress tracker teams and deliverables |
| `rsi.starmaps` | ARK Starmap systems, celestial objects, tunnels and routes |
| `rsi.telemetries` | Community performance telemetry |
| `rsi.fundingGoals` | Crowdfunding stats |

Each module has its own page in the API reference, with every method, its parameters, the errors it throws and an example.

## Resource metadata

Parsed resources expose a `meta` property with data about the resource itself, such as its public RSI page:

```typescript
const profile = await rsi.users.getProfile('Dymerz');
console.log(profile?.meta.url); // https://robertsspaceindustries.com/citizens/Dymerz
```

## Next steps

- the **Configuration** guide: timeouts, user agent, environment variables and logging
- the **Proxies** guide: route requests through HTTP, HTTPS or SOCKS proxies
- the **Error handling** guide: the error classes and when they are thrown
