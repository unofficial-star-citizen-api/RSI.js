---
title: Configuration
slug: configuration
group: Guides
order: 2
---

# Configuration

Pass options ({@link RSIConfig}) to the {@link RSI} constructor. Every option is optional.

```typescript
import { RSI } from '@unofficial-star-citizen-api/rsi.js';

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

| Option | Default | Description |
|---|---|---|
| `httpConfig.timeout` | `15000` | Request timeout in milliseconds |
| `httpConfig.userAgent` | `StarCitizen REST API/<version> (starcitizen-api.com)` | `User-Agent` header sent with every request |
| `httpConfig.httpProxy` | none | Proxy for `http://` requests |
| `httpConfig.httpsProxy` | none | Proxy for `https://` requests (every RSI endpoint) |
| `httpConfig.noProxy` | none | Comma-separated hosts that bypass the proxy |
| `logging` | `false` | Log command activity, requests and responses to the console |

Set a meaningful `userAgent` so RSI can identify your application.

## Environment variables

In Node.js, unset `httpConfig` options fall back to these environment variables. Values passed to the constructor take precedence.

| Variable | Option |
|---|---|
| `HTTP_PROXY` | `httpProxy` |
| `HTTPS_PROXY` | `httpsProxy` |
| `NO_PROXY` | `noProxy` (comma-separated; supports `*.domain` and `.domain`) |
| `USER_AGENT` | `userAgent` |
| `HTTP_TIMEOUT` | `timeout` (ms) |

## Logging

Logging is off by default. Set `logging: true` to print command activity, HTTP requests (method and URL), HTTP responses (status code) and proxy errors to the console, in Node.js or in the browser. Request and response bodies and headers are never logged.

The toggle is global: creating an `RSI` instance sets it for every existing instance, so the most recently created instance decides whether logs are enabled.
