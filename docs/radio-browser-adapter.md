# Radio Browser adapter contract

The browser UI still makes **no live directory request**. The server-only adapter in `src/integrations/radioBrowserAdapter.server.ts` now:

1. discovers a current HTTPS mirror through `all.api.radio-browser.info` rather than pinning an arbitrary host;
2. sends a required descriptive `User-Agent` with application name and version;
3. applies a five-second timeout, hard 50-result limit and 60-second successful-result cache;
4. normalizes every response through `src/integrations/radioBrowser.ts`;
5. returns retrieval time, cache status and selected mirror to its caller;
6. preserves Radio Browser attribution and station homepage metadata.

It intentionally is not exposed as a browser endpoint yet. The next step is a small opt-in local route that maps adapter failures to explicit UI source states without leaking arbitrary upstream URLs.

The official [API overview](https://api.radio-browser.info/) documents mirror discovery. The official [API reference](https://docs.radio-browser.info/) requests a descriptive User-Agent and notes that the service is provided without an uptime guarantee. These pages were rechecked on 2026-11-09. No rate limit is invented here; the adapter must stay bounded and document any published limit found at implementation time.
