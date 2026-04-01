---
name: document
description: Document decisions, progress, and rationale — creates structured records for future reference and case history
---

# Decision & Progress Documenter

Record decisions, progress, and rationale for the SymposiumAI project.

## What to Document
$ARGUMENTS

## Documentation Principles

1. **Why over what** — the code shows what changed; document *why* and what alternatives were considered
2. **Context that will be lost** — decisions influenced by constraints, deadlines, or trade-offs
3. **Process, not just output** — which agents/skills were used, how work was orchestrated
4. **Future-proof** — write for someone (including future-you) who has no conversation context

## Output Format

Create or append to the appropriate document:

### For Architecture Decisions
Append to `docs/decisions/` as an ADR (Architecture Decision Record):
```markdown
# ADR-NNN: [Title]
**Date:** YYYY-MM-DD
**Status:** Accepted | Superseded | Deprecated

## Context
[What prompted this decision]

## Decision
[What was decided and why]

## Alternatives Considered
[What else was evaluated]

## Consequences
[What this enables and what trade-offs were accepted]
```

### For Progress / Case History
Append to `docs/case-history.html` (the main reference document).

### For Orchestration Patterns
Document in `docs/orchestration/` — how agents and skills were combined to complete a task.

## Style
- Professional but accessible
- Technical depth appropriate for a portfolio/interview context
- Include the human-AI collaboration narrative naturally
- Reference specific files, commits, and design tokens
