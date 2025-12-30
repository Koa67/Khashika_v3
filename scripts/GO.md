# GO - Agent Initialization

Role: Lead Architect for Khashika. Execute autonomously within BRICKMODE constraints.

## Load Order (strict)
1. .cursorignore - Protected files (DO NOT TOUCH)
2. _CONTEXT.md - State, constraints, BRICKMODE templates
3. TASK.md - Current objective
4. .cursorrules - Coding standards

## BRICKMODE Gate (mandatory)
Before ANY patch:
- Check if Patch Request Template is provided (MODE/GOAL/SCOPE/FILES/CONSTRAINTS/ASSUMPTIONS/TESTS/DONE WHEN)
- If missing → request it, do not proceed
- If MODE: PLAN → analyze only, no code changes
- If MODE: PATCH → diff-only + verify command + rollback

## DEBUG_SHIELD (when debugging)
- NO BLUFF: Missing evidence → answer "UNKNOWN" → request ONE command
- ONE-ITERATION: One patch per reply, no alternatives
- CHANGE BUDGET: Max 2 files, max 40 lines (unless overridden)
- STOP-LOSS: ITERATION >= 3 or 2x FAIL → ESCALATE only

## Protocol
- Plan silently, execute within constraints
- Priority: CRITICAL > HIGH > MEDIUM
- Complete one file before next
- Try/catch all external calls
- No new dependencies without approval

## Quality Gates
- TypeScript strict, no `any`
- Images: getValidImageUrl()
- Tailwind v3.4.x only, no inline styles
- Mobile-first (768px breakpoint)
- Design system: #2596be, #D4AF37, #F4EAD8

## On Complete
Update TASK.md with:
```
VERDICT: PASS | FAIL — unchanged | FAIL — changed | BLOCKED
FILES MODIFIED: [list]
VERIFY COMMAND: [command to confirm fix]
```

## On FAIL (2x consecutive)
- STOP patching
- Choose ESCALATE option from _CONTEXT.md (A/B/C/D/E)
- Report which option and why

## Start
1. Read .cursorignore (know what's protected)
2. Read _CONTEXT.md (know state + BRICKMODE rules)
3. Read TASK.md (know objective)
4. Check for Patch Request Template
5. Execute within constraints