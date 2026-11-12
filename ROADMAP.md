# Roadmap
## Completed
- [x] Build a synthetic station map and searchable directory
- [x] Add persistent browser-local favorites
- [x] Add user-initiated demo playback and unavailable-signal state
- [x] Add responsive, keyboard-accessible empty and error messaging
- [x] Define and test bounded Radio Browser response normalization
- [x] Add a server-side Radio Browser mirror-discovery/search adapter
- [x] Send a descriptive User-Agent and cache bounded searches briefly
- [x] Validate restored demo favorites and tolerate unavailable browser storage
## Next
- [ ] Expose the adapter through an opt-in local API endpoint and UI source state
- [ ] Add real stream playback with timeout, codec and mixed-content failures
- [ ] Add station/homepage attribution from the directory response
## Continuity
2026-11-11: Hardened synthetic favorites against malformed local storage and unknown IDs, made serialization deterministic and kept session changes usable when persistence is unavailable. Next: expose the server adapter through an opt-in local endpoint with explicit live/cached/error states.

2026-11-10: Added a server-only, dependency-free adapter that discovers an HTTPS mirror, sends a descriptive application/version User-Agent, caps search results at 50, times out requests and caches successful query results for 60 seconds. It is not imported by the static demo and makes no request on module load. Next: expose it through an opt-in local endpoint with explicit live/cached/error source states.

2026-11-09: Added a provider-boundary normalizer that rejects unsafe stream schemes, caps tags/results and preserves explicit Radio Browser provenance. Documented mirror discovery, User-Agent and failure requirements without making a live request. Next: implement the small server adapter and expose freshness/mirror state.

2026-11-09: Established the first Radio Roam interface with fictional map pins, search, local favorites, generated user-initiated audio and a deliberately broken signal. No directory or broadcast request occurs. Next: add a server-side Radio Browser adapter because browser fetch cannot reliably supply the service's requested descriptive User-Agent or mirror discovery.
