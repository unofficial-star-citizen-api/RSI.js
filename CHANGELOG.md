# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.8.4] - TBD

### Added

- `RSINotFoundError` (status `404`, with `resource` and `identifier`), the base class of every "resource does not exist" error. `RSIUserNotFoundError` and `RSIOrganizationNotFoundError` now extend it.
- `RSIShipNotFoundError`, `RSIShipChassisNotFoundError`, `RSIStarSystemNotFoundError`, `RSICelestialObjectNotFoundError` and `RSIProgressTrackerTeamNotFoundError`.
- `RSIHttpError` (extends `RSIError`) for an unreachable RSI or an unexpected HTTP status, with the upstream `status` (`undefined` when no response arrived) and `url`.
- `rsi.spectrum` module for the Spectrum forums: `getCommunities`, `getChannels`, `getThreads` (pagination, sort order, label filter) and `getThread`, which returns the opening post as normalized text, image and video blocks, its plain text, its links and its tracked replies.
- `RSISpectrumThreadNotFoundError`, `RSISpectrumChannelNotFoundError` and `RSISpectrumCommunityNotFoundError`.
- `roadmaps.getBoards()`: every roadmap board with its name, Markdown description (which announces the current game versions on the Star Citizen board), notification banner, images and last update date, without its releases.

### Changed

- **Breaking:** network failures (timeout, DNS failure, connection reset) throw `RSIHttpError` instead of a raw axios error. The axios error is kept in the stack trace as `Caused by:`.
- Every command that fails on an unexpected HTTP status throws `RSIHttpError` instead of a plain `RSIError`. Messages are unchanged, and `instanceof RSIError` still matches, but `getStatus()` now suggests `502` instead of `500`.
- `versions.spectrum` reads threads through `rsi.spectrum`, from the Spectrum v2 API that the website uses. An unsuccessful payload now throws `Spectrum query failed (<code>: <message>)`.
- `versions.roadmap` reads the Star Citizen board through `roadmaps.getBoards()`, and throws `RSIError` if that board is missing.
- **Breaking:** `versions.spectrum` reports threads whose title names no release channel (LIVE, PTU or ETF), such as Tech Previews, with `environment: undefined` instead of `ptu`.
- **Breaking:** `ships.getById`, `starmaps.getStarSystemByCode`, `starmaps.getCelestialObjectByCode` and `progressTrackers.getTeamBySlug` throw a not-found error instead of returning `null`/`undefined`, and their return types are no longer nullable.
- **Breaking:** `ships.getByChassisId` throws `RSIShipChassisNotFoundError` instead of returning an empty array for an unknown chassis.
- `progressTrackers.getDeliverablesByTeamSlug` throws `RSIProgressTrackerTeamNotFoundError` for an unknown team slug.
- `users.getProfile` and `users.getOrganization` return types are no longer nullable; they never returned `null`.

### Fixed

- `starmaps.getCelestialObjectByCode` returned an empty array instead of an object for an unknown code.
- Progress tracker GraphQL errors were checked in the wrong place, so RSI rejections surfaced as "API returned no teams/deliverables".
- `versions.spectrum` missed the PTU wave of current thread titles: `[Wave 3]`, `[All Waves]`, `[All Wave]` and `[All Backers]` are now recognized, as well as the older `[Wave 1 PTU]` and `[ALL WAVES PTU]`.
- `versions.roadmap` kept the punctuation after a version, for example `3.18.0,`.

### Removed

- The raw Spectrum and roadmap response types exported by the versions module, which were hidden from the documentation and no method returned: `RSISpectrumThreadResponse`, `RSISpectrumThreadData*`, `RSISpectrumThreadMeta`, `RSISpectrumThreadContent*`, `RSIPresence` and `RSIVersionRoadmap*`.

## [0.8.3] - 2026-11-03

### Added

- Ship retrieval by RSI ID or chassis ID, full ship catalog retrieval, and ship search.
- Version data retrieval for patch notes, roadmaps, and Spectrum discussions.
- TypeDoc configuration and expanded API documentation, including Vitest and clean-jsdoc-theme skill guides.
- GitHub issue templates and expanded contribution and funding guidance.

### Changed

- Expanded structured API data and response handling for organizations, users, star maps, telemetry, roadmaps, progress trackers, funding goals, and ships.
- Updated CI and release workflows to support staging prereleases and stable releases from `main`.
- Improved generated documentation navigation and pull request documentation checks.

### Fixed

- Corrected organization-name handling when retrieving organizations.
- Improved parsing of redacted user profiles and organization memberships.
- Refined patch-note version matching and Spectrum comment-count parsing.
