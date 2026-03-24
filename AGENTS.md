<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# Agent Orchestration Guide — BrainFlow

This project is designed to be operated by a single developer (Mirko) orchestrating AI agents as a full team. The following agent patterns are used:

## Product Context

**BrainFlow** is a canvas-based brainstorming tool with:
- Visual node graph for connecting ideas
- **Digital Twins** — AI personas with programmable behaviors (contraddici, collabora, analizza, provoca)
- Multiple card types: text, concept, goal, perplexity, images
- **Run Flow** node that synthesizes connected elements via Claude AI
- Chainable flows — output of one Run Flow feeds into another

## Agent Roles

### Explorer Agent
**When:** Understanding unfamiliar parts of the codebase, finding patterns across files, deep research.
**How:** Use `subagent_type=Explore` with clear scope.

### Design Agent (via `/design` skill)
**When:** Any visual/design task — logos, color choices, layout decisions, slides, graphics.
**Constraint:** Must respect the design system tokens defined in `CLAUDE.md` and `src/app/globals.css`.

### Component Builder (via `/component` skill)
**When:** Creating new UI components. Follows shadcn-first + glassmorphism rules automatically.

### Node Builder (via `/node` skill)
**When:** Adding new canvas node types (goal cards, perplexity cards, digital twins). Composes from shared primitives.

### Presenter (via `/present` skill)
**When:** Generating pitch decks, case study pages, marketing materials for BrainFlow.

### Auditor (via `/audit` skill)
**When:** Reviewing architecture, performance, accessibility, code quality.

### Documenter (via `/document` skill)
**When:** Recording decisions, progress, and rationale for future reference.

## Orchestration Philosophy

> "One person, full orchestration — not replacing a team, but proving what's possible when human creativity directs AI execution."

The goal is to demonstrate that a web architect with AI tools can:
1. **Design** — consistent visual systems, not random outputs
2. **Build** — production-quality components, not prototypes
3. **Document** — every decision with rationale, not just code
4. **Present** — professional materials, not afterthoughts
5. **Audit** — systematic quality, not ad-hoc reviews

Each skill encodes the project's standards so the AI agents produce work that's coherent across all these disciplines.

## Conversation Context

When Mirko opens BrainFlow with Claude (including Cowork), the AI should:
- Know the full product vision (Digital Twins, card types, Run Flow, chaining)
- Be ready to discuss strategy, market research, UX, technical implementation
- Use the appropriate skill when the conversation turns into action
- Maintain the case-history documentation mindset (document interesting decisions)
