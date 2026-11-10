# Radio Browser adapter contract

The browser UI still makes **no live directory request**. A future server adapter must:

1. discover a current mirror through `all.api.radio-browser.info` rather than pinning an arbitrary host;
2. send a descriptive `User-Agent` with application name and version;
3. apply a hard result limit and short cache lifetime;
4. normalize every response through `src/integrations/radioBrowser.ts`;
5. return freshness, selected mirror and an explicit failure state to the UI;
6. preserve Radio Browser attribution and station homepage metadata.

The official [API overview](https://api.radio-browser.info/) documents mirror discovery. The official [API reference](https://docs.radio-browser.info/) requests a descriptive User-Agent and notes that the service is provided without an uptime guarantee. These pages were rechecked on 2026-11-09. No rate limit is invented here; the adapter must stay bounded and document any published limit found at implementation time.
