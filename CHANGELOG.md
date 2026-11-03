# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

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
