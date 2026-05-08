# Team Ceremonies

## Auto-Triggered Ceremonies

None configured yet. Manual ceremonies available on request.

## Manual Ceremonies

### Sprint Planning
**Participants:** Lead (facilitator), Backend, Frontend, Tester  
**When:** On request via "Team, plan sprint" or similar  
**Duration:** ~30 min sync  
**Output:** Work items prioritized, dependencies mapped, assignments clear

### Code Review (Built-in)
**Participants:** Tester (reviewer)  
**Trigger:** Every code change  
**Rule:** Tester approves or rejects before merge  
**Rejection:** Original author locked out; different agent revises

### Architecture Review
**Participants:** Lead (facilitator), Backend, Frontend  
**When:** Major design decisions  
**Output:** Decision recorded in `.squad/decisions.md`

## Cooldowns

- No automatic ceremony cooldowns configured
- Manual ceremonies can be called back-to-back if needed
| **When** | weekly |
| **Condition** | No *retrospective* log in .squad/log/ within the last 7 days |
| **Facilitator** | lead |
| **Participants** | all |
| **Time budget** | focused |
| **Enabled** | yes |
| **Enforcement skill** | retro-enforcement |

**Agenda:**
1. What shipped this week? (closed issues, merged PRs)
2. What did not ship? (open issues, blockers)
3. Root cause on any failures
4. Action items -- each MUST become a GitHub Issue labeled retro-action

**Coordinator integration:**
At round start, call Test-RetroOverdue (see skill retro-enforcement). If overdue, run this ceremony before the work queue.

**Why GitHub Issues, not markdown:**
Production data: 0% completion across 6 retros using markdown checklists, 100% after switching to GitHub Issues.
