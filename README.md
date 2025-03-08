# RSI Scraper

A TypeScript library for retrieving Star Citizen data from the Roberts Space Industries website.

## Installation

```bash
npm install RSI.js
```

## Usage

```typescript
import { User, Version, Ship } from 'RSI.js';

// Get user information
const userInfo = async () => {
  const user = new User('example_handle');
  const result = await user.execute();
  console.log(result);
};

// Get version information
const versionInfo = async () => {
  const version = new Version();
  const result = await version.execute();
  console.log(result);
};

// Get ship information
const shipInfo = async () => {
  const ship = new Ship({ name: 'Aurora' });
  const result = await ship.execute();
  console.log(result);
};
```

## Available Classes

- `User`: Retrieve user information
- `Organization`, `OrganizationMembers`: Retrieve organization information and members
- `Ship`: Retrieve ship information
- `Version`: Retrieve version information
- `Stats`: Retrieve game statistics
- `Telemetry`: Retrieve telemetry data
- `Roadmap`: Retrieve roadmap information
- `ProgressTracker`, `ProgressTrackerInfo`: Retrieve progress tracker information
- `StarmapSystems`, `StarmapTunnels`, `StarmapSpecies`, `StarmapAffiliations`, `StarmapStarSystems`, `StarmapCelestialObjects`, `StarmapSearch`, `StarmapRouteSearch`: Retrieve starmap data

## Browser Usage

For browser usage, you'll need to include axios and cheerio:

```html
<script src="https://cdn.jsdelivr.net/npm/axios/dist/axios.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/cheerio/lib/cheerio.min.js"></script>
<script src="dist/index.browser.min.js"></script>
<script>
  const { User } = RsiScraper;

  async function getUserInfo() {
    const user = new User('example_handle');
    const result = await user.execute();
    console.log(result);
  }

  getUserInfo();
</script>
```

## License

MIT
