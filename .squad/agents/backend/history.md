# Backend History

## Project Context

- **Project:** RSI.js — npm library for scraping Robert's Space Industries website
- **Owner:** Dymerz
- **Stack:** TypeScript, Jest, ESLint, Rollup
- **Compatibility:** Node.js + Browser
- **API Target:** https://robertsspaceindustries.com

## Team

- **Lead:** Tech Lead (architecture decisions)
- **Backend:** You — HTTP & scraping logic
- **Frontend:** Module exports & browser compatibility
- **Tester:** Test coverage & quality gates
- **Scribe:** Session logging & decision archival

## Architecture Overview

HTTP Client (`src/http-client.ts`):
- Abstract HTTP requests (Node.js fetch/axios vs Browser fetch)
- Handle retries, timeouts, user-agent headers
- Parse responses (JSON, HTML as needed)
- Error handling with meaningful messages

Scrapers (`src/commands/*/`):
- Organization scraper — org profiles, members search
- Ship scraper — ship data
- Funding goals scraper — stretch goals
- Progress tracker scraper — development deliverables
- Roadmap scraper — feature roadmap
- Starmap scrapers — celestial objects, systems, routes, species, tunnels
- Telemetry scraper — server metrics
- User scraper — user profiles
- Version scraper — patch notes, spectrum posts, roadmap entries

## Key Decisions

(None yet — team just hired)

## Learnings

(To be filled as work progresses)
