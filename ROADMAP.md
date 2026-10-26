# Roadmap

## Completed

- [x] Working static prototype and separated model/UI files
- [x] Behavioral tests and verified setup commands
- [x] Responsive styles, visible focus and reduced-motion support

## Next

- [ ] Integrate an attributed station directory after verifying terms
- [ ] Add codec-aware station health (session-only retry, filename hints and browser capability summary complete)
- [ ] Add globe view and persistent last-played station

## Continuity

2026-10-25: Added a session-only playback-attempt counter covering initial plays and retries, explicitly separated from remote health. Next: attributed directory adapter with resilient broken-stream handling.

2026-10-24: Added a local `canPlayType` capability summary for common audio containers/codecs while explicitly separating browser-declared capability from remote stream availability. Next: an attributed directory adapter with resilient broken-stream handling.

2026-10-23: Added immediate, non-authoritative format hints for common audio filename extensions. Hints never probe the remote stream or claim browser capability/availability. Next: capability checks that remain distinct from remote health.

2026-10-22: Added an explicit, user-initiated retry for the last validated stream URL. The URL stays only in page memory, is never added to local storage and is cleared on reload/page exit. Next: surface codec capability hints without claiming remote stream availability.

2026-10-22: Added wrapping arrow-key navigation and Home/End shortcuts for the filtered city list, with model and real-browser coverage. Next: codec-aware stream health and retry controls before any directory integration.

2026-10-21: Added validated, local-only restoration of the last selected fictional station without persisting stream URLs; browser reload coverage included. Next: codec-aware health/retry controls before any directory integration.

2026-10-20: Added repeatable Playwright regression checks and a public-repository-only CI workflow. Desktop, mobile and motion-enabled scenarios passed locally using Chromium 153; model tests and syntax checks passed. Screenshots generated locally for inspection. Earlier browser-unavailable notes below are historical. No deployment or live-provider validation performed. Next: expand browser coverage and review the existing PR before merging.

Initial prototype created 2026-10-17. Re-read repository contents and latest commits before continuing. No hosted deployment. No live data integrations.

## Verification

- 3 model tests passed with Node.js 24.
- JavaScript syntax checks passed.
- Local HTTP document/module/style serving and HTML anchor/ID integrity checked.
- Browser rendering and interaction QA **not completed**: no installed Chromium; browser download failed. No screenshot is claimed.
- Implementation is proposed on `feat/initial-experience` for review; inspect open PRs before starting the next change. Prioritize desktop/mobile and keyboard browser review next.


2026-10-18: Added saved-city filtering, consistent empty selections, native audio controls, bounded connection/buffering waits, media-error explanations and stream cleanup. Six model tests pass. Real browser/audio playback, directory integration and codec-aware station health remain unverified or pending.


