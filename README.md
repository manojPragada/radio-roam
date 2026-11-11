# Radio Roam
A map-led internet-radio discovery interface, beginning with a safe synthetic station demo.

**Status:** working offline foundation. Search, station selection, persistent favorites, user-initiated generated audio, blocked-playback messaging and a known-unavailable signal are implemented. A tested server-side Radio Browser adapter exists but is not connected to the UI, so there is still no live directory, radio stream or hosted demo.

## Run and verify
Requires Node.js 22+ and npm 11+.
```bash
npm install
npm run dev
npm run check
npm run build
```
`check` runs strict TypeScript and station-search tests. No linter is configured.

## Demo behavior
All four stations are fictional and tagged `synthetic-demo`. Play creates a quiet Web Audio oscillator only after a button press; it is not broadcast content. “Silent Harbor” intentionally exercises the unavailable-stream state. Favorites persist only in localStorage.

## Planned directory source
[Radio Browser](https://www.radio-browser.info/) documents a free, federated API but requests a descriptive User-Agent, recommends discovering mirrors instead of hard-coding one, and warns that downtime is possible. `src/integrations/radioBrowserAdapter.server.ts` implements that server-only boundary: it discovers an HTTPS mirror, supplies a descriptive application/version User-Agent, applies a five-second timeout, caps results at 50 and caches successful queries for 60 seconds. It has no side effects on import and the browser-only foundation does not contact the service. A later opt-in endpoint will provide live/cached/error state to the UI. Station streams and favicons remain the property of their stations.

## Structure and architecture
```text
src/stations.ts       typed synthetic fixtures, search and projection
src/main.ts           UI state, Web Audio lifecycle and local favorites
src/styles.css        responsive map/directory visual system
src/stations.test.ts  search, provenance and favorites tests
src/integrations/     Radio Browser normalization and server adapter
docs/                 provider contract and operating notes
ROADMAP.md            integration sequence and continuity
```
No environment variables are used; see `.env.example`. The dependency-light frontend makes no runtime network request.

## Accessibility, privacy and performance
Audio never autoplays, every map pin is mirrored in native station buttons, player status is announced, and empty results explain recovery. The SVG map and small bundle use no image or model downloads. Favorites do not leave the browser.

## Deployment and troubleshooting
Run `npm run build` and serve `dist/` statically. No deployment has been performed.
- No sound: ensure the station is available and retry after interacting with the page; browsers can suspend AudioContext.
- Favorites missing: localStorage may be disabled or cleared.
- No stations: clear search or switch from favorites to all stations.

All UI assets and demo data are original. Preserve user-initiated playback, provenance, failure handling and source attribution in contributions. No license has been selected.
