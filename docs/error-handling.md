---
title: Error handling
slug: error-handling
group: Guides
order: 4
---

# Error handling

Every upstream failure is an `RSIError`, or a subclass of it. `getStatus()` returns a suggested HTTP status, which is handy when you put RSI.js behind your own API.

| Error | When | `getStatus()` |
|---|---|---|
| {@link RSINotFoundError} | Base class of every error below: the requested resource does not exist. Exposes `resource` and `identifier` | `404` |
| {@link RSIUserNotFoundError} | The citizen handle does not exist | `404` |
| {@link RSIOrganizationNotFoundError} | The organization SID does not exist | `404` |
| {@link RSIShipNotFoundError} | The ship-matrix ID does not exist | `404` |
| {@link RSIShipChassisNotFoundError} | The chassis ID does not exist | `404` |
| {@link RSIStarSystemNotFoundError} | The star system code does not exist | `404` |
| {@link RSICelestialObjectNotFoundError} | The celestial object code does not exist | `404` |
| {@link RSIProgressTrackerTeamNotFoundError} | The progress tracker team slug does not exist | `404` |
| {@link RSIError} | RSI returned a non-2xx status, an empty body, `success !== 1`, or a page the scraper can no longer parse | `500` |
| `Error` | Invalid input, such as a malformed handle, an unknown timetable, or a bad telemetry version. Thrown before any request is sent | n/a |

Catch {@link RSINotFoundError} to handle every missing resource at once, or a subclass to handle a single kind.

```typescript
import { RSI, RSIError, RSINotFoundError } from '@unofficial-star-citizen-api/rsi.js';

const rsi = new RSI();

try {
  await rsi.users.getProfile('someone');
} catch (error) {
  if (error instanceof RSINotFoundError) {
    // 404: error.resource is 'User', error.identifier is 'someone'
  } else if (error instanceof RSIError) {
    // RSI is down, rate-limiting you, or changed its page
  } else {
    throw error;
  }
}
```

## Behind your own API

```typescript
import { RSIError } from '@unofficial-star-citizen-api/rsi.js';

app.get('/citizens/:handle', async (req, res) => {
  try {
    res.json(await rsi.users.getProfile(req.params.handle));
  } catch (error) {
    if (error instanceof RSIError)
      return res.status(error.getStatus()).json({ error: error.message });
    res.status(400).json({ error: String(error) });
  }
});
```

## When RSI changes its website

RSI changes its pages without warning, so a scraper can start returning empty fields or throwing `RSIError`. If that happens, [open an issue](https://github.com/unofficial-star-citizen-api/RSI.js/issues/new/choose) with the handle, SID or URL you used.
