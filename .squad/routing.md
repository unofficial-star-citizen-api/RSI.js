# Work Routing Rules

## By Signal

| Signal | Primary Agent | Secondary | Reason |
|--------|---------------|-----------|--------|
| Architecture, scope decisions | Lead | — | Owns project direction |
| HTTP client, API logic, scraping | Backend | Lead | Implements core scraping logic |
| Module exports, browser compat | Frontend | Lead | Ensures cross-platform export |
| Test coverage, edge cases | Tester | Lead | Validates quality, gates approvals |
| Decisions, logs, session state | Scribe | — | Mechanical append-only ops |

## Default Routing

- **Code review required:** All changes → Tester (approval gate)
- **Architecture questions:** → Lead (decision + routing)
- **Multi-domain work:** → Lead coordinates parallel agents
- **Unknown domain:** → Lead (triage + re-route)

## Reviewer Gates

- **Tester** approves all code before merge
- **Lead** reviews architecture decisions before implementation

## Issue Routing

| Label | Action | Who |
|-------|--------|-----|
| `squad` | Triage: analyze issue, assign `squad:{member}` label | Lead |
| `squad:{name}` | Pick up issue and complete the work | Named member |

### How Issue Assignment Works

1. When a GitHub issue gets the `squad` label, the **Lead** triages it — analyzing content, assigning the right `squad:{member}` label, and commenting with triage notes.
2. When a `squad:{member}` label is applied, that member picks up the issue in their next session.
3. Members can reassign by removing their label and adding another member's label.
4. The `squad` label is the "inbox" — untriaged issues waiting for Lead review.

## Rules

1. **Eager by default** — spawn all agents who could usefully start work, including anticipatory downstream work.
2. **Scribe always runs** after substantial work, always as `mode: "background"`. Never blocks.
3. **Quick facts → coordinator answers directly.** Don't spawn an agent for "what port does the server run on?"
4. **When two agents could handle it**, pick the one whose domain is the primary concern.
5. **"Team, ..." → fan-out.** Spawn all relevant agents in parallel as `mode: "background"`.
6. **Anticipate downstream work.** If a feature is being built, spawn the tester to write test cases from requirements simultaneously.
7. **Issue-labeled work** — when a `squad:{member}` label is applied to an issue, route to that member. The Lead handles all `squad` (base label) triage.

## Token Optimization

- **Caveman Skill:** All agents operate in caveman mode (`/caveman full`) by default
- **Token Budget:** Target ~75% reduction vs. normal mode while maintaining technical accuracy
- **Clarity Override:** Auto-switch to normal mode for security warnings, destructive operations, or multi-step sequences where fragment order risks misunderstanding
- **Intensity Levels:** Use `lite` for formal documentation, `ultra` for high-volume operations, `full` (default) for standard work
- **Resume:** Return to caveman mode after clarity requirement satisfied
