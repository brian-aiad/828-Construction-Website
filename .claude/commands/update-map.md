Regenerate PROJECT-MAP.md by scanning the current codebase state.

Steps:
1. List all files in app/ to get routes
2. List all files in components/ organized by subdirectory
3. List all files in public/images/ with exact paths and extensions
4. List all files in .claude-work/scripts/ and .claude-work/research/
5. Note the last-known Lighthouse scores from CLAUDE.md page status table
6. Write PROJECT-MAP.md at the repo root using the template below

Template:
```
# PROJECT-MAP — 828 Construction Website
_Auto-generated. Run /update-map to refresh._
_Last generated: [TODAY'S DATE]_

## Routes
| Route | Page File | Content Component | Status |
|-------|-----------|-------------------|--------|
[one row per route from CLAUDE.md page status table]

## Shared Components
| Component | File | Affects |
|-----------|------|---------|
[Header, Footer, LenisProvider, CustomCursor, ScrollProgress, etc.]

## Image Assets
### /images/about/ (N files)
[list each file]
### /images/hero/ (N files)
[list each file]
[... all folders ...]

## Scripts & Research
| Script | Purpose |
|--------|---------|
[list .claude-work/scripts/ files]
[list .claude-work/research/ functional-qa.mjs files]

## Skills (global)
| Skill | Path | Purpose |
|-------|------|---------|
| 828-construction-methodology | ~/.claude/skills/828-construction-methodology/SKILL.md | 6-phase redesign protocol |
| 828-preflight | ~/.claude/skills/828-preflight/SKILL.md | pre-push test gate |
| ux-architecture-methodology | ~/.claude/skills/ux-architecture-methodology/SKILL.md | page structure audits |

## Known Gaps
[list any image paths referenced in code but not found on disk]
[list any image files on disk not referenced in any component]
```

After writing PROJECT-MAP.md, confirm: "PROJECT-MAP.md updated. N image paths verified, N gaps found."
