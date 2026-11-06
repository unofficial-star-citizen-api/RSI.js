# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.8.4] - TBD

### Added

- `RSINotFoundError` (status `404`, with `resource` and `identifier`), the base class of every "resource does not exist" error. `RSIUserNotFoundError` and `RSIOrganizationNotFoundError` now extend it.
- `RSIShipNotFoundError`, `RSIShipChassisNotFoundError`, `RSIStarSystemNotFoundError`, `RSICelestialObjectNotFoundError` and `RSIProgressTrackerTeamNotFoundError`.

### Changed

- **Breaking:** `ships.getById`, `starmaps.getStarSystemByCode`, `starmaps.getCelestialObjectByCode` and `progressTrackers.getTeamBySlug` throw a not-found error instead of returning `null`/`undefined`, and their return types are no longer nullable.
- **Breaking:** `ships.getByChassisId` throws `RSIShipChassisNotFoundError` instead of returning an empty array for an unknown chassis.
- `progressTrackers.getDeliverablesByTeamSlug` throws `RSIProgressTrackerTeamNotFoundError` for an unknown team slug.
- `users.getProfile` and `users.getOrganization` return types are no longer nullable; they never returned `null`.

### Fixed

- `starmaps.getCelestialObjectByCode` returned an empty array instead of an object for an unknown code.
- Progress tracker GraphQL errors were checked in the wrong place, so RSI rejections surfaced as "API returned no teams/deliverables".

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
