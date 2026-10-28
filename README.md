# RSI Scraper

A TypeScript library for retrieving Star Citizen data from the Roberts Space Industries website.

## Installation

```bash
npm install RSI.js
```

## Usage

```typescript
import { RSI } from 'RSI.js';

const rsi = new RSI();

// Get user information
const userInfo = async () => {
  const result = await rsi.users.execute('example_handle');
  console.log(result);
};

// Get version information
const versionInfo = async () => {
  const result = await rsi.versions.execute();
  console.log(result);
};

// Get ship information
const shipInfo = async () => {
  const result = await rsi.ships.execute({ name: 'Aurora' });
  console.log(result);
};
```

## Logging

Logging is disabled by default. To log command activity, HTTP requests and
responses, and proxy or request errors to the console in either Node.js or a
browser, enable it in the `RSI` constructor:

```typescript
const rsi = new RSI({
  httpConfig: {
    timeout: 15000
  },
  logging: true
});
```

Command logs describe the operation being performed and may include relevant
identifiers. HTTP request logs include the method and URL; response logs
include the status code. Request and response bodies and headers are not logged.
The logging toggle is global: creating an `RSI` instance sets
it for all existing instances, so the most recently created instance determines
whether logs are enabled.

## Available Classes

- `Users`: Retrieve user information
- `Organizations`: Retrieve organization information and members
- `Ships`: Retrieve ship information
- `Versions`: Retrieve version information
- `FundingGoals`: Retrieve game statistics
- `Telemetries`: Retrieve telemetry data
- `Roadmaps`: Retrieve roadmap information
- `ProgressTrackers`: Retrieve progress tracker information
- `Starmaps`: Retrieve starmap data

## Resource metadata

Parsed resource results expose a `meta` property (the exported `RSIResourceMeta` interface) for data about the resource itself, such as its public RSI page URL. More metadata can be added to this shared interface over time.

```typescript
const profile = await rsi.users.getProfile('example_handle');
console.log(profile?.meta.url);
```

This is a breaking result-shape change: resource URLs previously exposed as top-level `url`, `href`, or `link` are now exposed as `meta.url`. Other fields, such as a user's `website`, are unchanged. This applies to parsed library results; raw upstream response fields retain their source shape.

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
  httpConfig: {
    httpAgent: proxyAgent,
    httpsAgent: proxyAgent
  }
});

// Now use the library with proxy support
const stats = await rsi.fundingGoals.get();
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
  const { RSI } = RsiScraper;

  async function getUserInfo() {
    const rsi = new RSI();
    const result = await rsi.users.execute('example_handle');
    console.log(result);
  }

  getUserInfo();
</script>
```

## License

MIT
