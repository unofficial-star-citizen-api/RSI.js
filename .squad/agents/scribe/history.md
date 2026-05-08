# Scribe History

## Project Context

- **Project:** RSI.js — npm library for scraping Robert's Space Industries website
- **Owner:** Dymerz
- **Stack:** TypeScript, Jest, ESLint, Rollup
- **Compatibility:** Node.js + Browser

## Team

- **Lead:** Tech Lead
- **Backend:** HTTP & scraping logic
- **Frontend:** Module exports & browser compatibility
- **Tester:** Test coverage & quality gates
- **Scribe:** You — session logging & decision archival

## Session Files

- `.squad/decisions.md` — Master decision ledger (append-only)
- `.squad/decisions/inbox/` — Drop box for agent decisions (auto-merged and cleared by Scribe)
- `.squad/orchestration-log/` — Agent routing evidence (one file per agent per batch)
- `.squad/log/` — Session summaries and diagnostics
- `.squad/agents/{name}/history.md` — Per-agent learnings
- `.squad/agents/{name}/history-archive.md` — Archived old history entries (when file gets too large)

## Key Responsibilities

1. **Merge inbox to decisions** — Read all `.squad/decisions/inbox/*.md`, consolidate into `.squad/decisions.md`, delete inbox files
2. **Log orchestration** — After each batch of agent work, create `.squad/orchestration-log/{timestamp}-{agent}.md` entries
3. **Archive history** — When an agent's `history.md` exceeds 15KB, archive old entries to `history-archive.md`
4. **Summarize sessions** — Create `.squad/log/{timestamp}-{topic}.md` after substantial work
5. **Commit changes** — Stage and commit only `.squad/` files modified in this session

## Key Decisions

(None yet — team just hired)

## Learnings

(To be filled as work progresses)
