# Frontend History

## Project Context

- **Project:** RSI.js — npm library for scraping Robert's Space Industries website
- **Owner:** Dymerz
- **Stack:** TypeScript, Jest, ESLint, Rollup
- **Compatibility:** Node.js + Browser (dual-platform)
- **Export Format:** CommonJS + ESM

## Team

- **Lead:** Tech Lead (architecture decisions)
- **Backend:** HTTP & scraping logic
- **Frontend:** You — module exports & browser compatibility
- **Tester:** Test coverage & quality gates
- **Scribe:** Session logging & decision archival

## Architecture Overview

Entry Point (`src/index.ts`):
- Default export: main RSI client
- Named exports: individual commands and helpers
- Tree-shakeable structure

Build Output:
- `dist/index.js` (CommonJS)
- `dist/index.esm.js` (ESM)
- `dist/index.d.ts` (TypeScript declarations)
- Rollup configuration handles dual build

Current Export Structure:
- `export default RSI` — main client class
- `export { RSI }` — named
- `export * from './commands'` — command exports
- `export * from './types'` — type exports

## Key Decisions

(None yet — team just hired)

## Learnings

(To be filled as work progresses)
