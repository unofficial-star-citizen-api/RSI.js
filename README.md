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

## Rotating Proxy Service

This project includes a Docker-based rotating proxy service that can help prevent IP blocking when making frequent requests to the RSI website.

### Features
- Built on Tor network for IP rotation
- Multiple Tor instances with automatic circuit switching
- Simple setup with docker-compose
- HAProxy stats interface for monitoring

### Usage

#### Starting the proxy service

```bash
docker-compose up -d
```

This starts the proxy service on port 5566 with no authentication required (for local use only).

#### Configuring the library to use the proxy

You can configure the RSI.js library to use the proxy with the SocksProxyAgent:

```typescript
import { RSI } from 'RSI.js';
import { SocksProxyAgent } from 'socks-proxy-agent';

const proxyAgent = new SocksProxyAgent('socks5://localhost:5566');

const rsi = new RSI({
  httpClient: {
    httpAgent: proxyAgent,
    httpsAgent: proxyAgent
  }
});

// Now use the library with proxy support
const stats = await rsi.stats.get();
```

#### Checking proxy stats and forcing IP rotation

You can view the proxy statistics by visiting:
```
http://localhost:4444/
```

To force the rotation of IPs (create new Tor circuits), you can run:

```bash
curl -x localhost:5566 http://1.1.1.1
```

#### Customizing the proxy

To adjust the number of Tor instances or rotation frequency, edit the docker-compose.yml:

```yaml
environment:
  - TOR_INSTANCES=10  # Increase number of Tor instances
  - TOR_NewCircuitPeriod=120  # Change rotation time to 120 seconds
```

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
