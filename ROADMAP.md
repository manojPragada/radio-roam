# Roadmap
## Completed
- [x] Build a synthetic station map and searchable directory
- [x] Add persistent browser-local favorites
- [x] Add user-initiated demo playback and unavailable-signal state
- [x] Add responsive, keyboard-accessible empty and error messaging
- [x] Define and test bounded Radio Browser response normalization
## Next
- [ ] Add Radio Browser mirror discovery through a small documented server adapter
- [ ] Send the required descriptive User-Agent and cache only bounded search results
- [ ] Add real stream playback with timeout, codec and mixed-content failures
- [ ] Add station/homepage attribution from the directory response
## Continuity
2026-11-09: Added a provider-boundary normalizer that rejects unsafe stream schemes, caps tags/results and preserves explicit Radio Browser provenance. Documented mirror discovery, User-Agent and failure requirements without making a live request. Next: implement the small server adapter and expose freshness/mirror state.

2026-11-09: Established the first Radio Roam interface with fictional map pins, search, local favorites, generated user-initiated audio and a deliberately broken signal. No directory or broadcast request occurs. Next: add a server-side Radio Browser adapter because browser fetch cannot reliably supply the service's requested descriptive User-Agent or mirror discovery.
