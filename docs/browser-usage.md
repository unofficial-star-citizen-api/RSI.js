---
title: Browser usage
group: Guides
order: 5
---

# Browser usage

The build also produces an IIFE bundle that exposes a global `RSI` namespace:

```html
<script src="https://cdn.jsdelivr.net/npm/@unofficial-star-citizen-api/rsi.js/dist/index.browser.min.js"></script>
<script>
  const rsi = new RSI.RSI();
  rsi.users.getProfile('Dymerz').then(console.log);
</script>
```

> **Warning:** browsers enforce CORS, and robertsspaceindustries.com does not allow cross-origin requests from arbitrary sites. The browser bundle is meant for environments that are not bound by CORS (browser extensions, Electron, userscripts) or for use behind your own proxy.

Proxy options and environment variables only apply in Node.js. Logging works in both.
