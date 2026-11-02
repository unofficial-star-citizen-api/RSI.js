---
title: Proxies
group: Guides
order: 3
---

# Proxies

RSI rate-limits aggressive clients. RSI.js can send its requests through a proxy, in Node.js only.

## Proxy options

```typescript
import { RSI } from '@unofficial-star-citizen-api/rsi.js';

const rsi = new RSI({
  httpConfig: {
    httpsProxy: 'socks5://localhost:5566',
    noProxy: 'localhost,*.internal',
  },
});
```

- `httpsProxy` is the option that matters for RSI: every RSI endpoint is HTTPS.
- `httpProxy` applies to plain `http://` requests.
- Both accept `http://`, `https://` and `socks://` (including `socks5://`) proxy URLs. RSI.js picks the matching agent for each request.
- `noProxy` lists hosts that bypass the proxy: exact hosts, `*.domain` and `.domain`, comma-separated.

The same options can come from the `HTTP_PROXY`, `HTTPS_PROXY` and `NO_PROXY` environment variables (see the **Configuration** guide).

## Rotating proxy service

The repository ships a `docker-compose.yml` that runs [`mattes/rotating-proxy`](https://hub.docker.com/r/mattes/rotating-proxy): several Tor instances behind HAProxy, with automatic circuit rotation.

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
