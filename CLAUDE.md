# BrainFlow — AI-Powered Brainstorming Canvas

@AGENTS.md

## What is BrainFlow

BrainFlow is a canvas-based brainstorming tool where you build visual flows of ideas and let AI synthesize them. The core loop:

1. **Create elements on the canvas** — text notes, concept cards, goal cards, perplexity cards, images, and **Digital Twins** (AI personas with programmable mood/behavior)
2. **Connect them freely** — link any element to any other, building a graph of relationships
3. **Attach to a "Run Flow" node** — this is the final synthesis point
4. **Get the AI output** — BrainFlow processes the entire connected graph and produces a structured reflection
5. **Chain flows** — the output of one Run Flow can feed into a new flow, enabling iterative deepening

### Digital Twins
The distinctive feature: AI personas that live on the canvas and interact with your ideas. Each twin has a programmable behavior mode:
- **Contraddici** — challenges and pushes back on ideas (devil's advocate)
- **Collabora** — builds on ideas, suggests expansions
- **Analizza** — breaks down ideas critically, finds gaps
- **Provoca** — provocative, pushes thinking to extremes
- More modes to be defined

Twins interact with other nodes they're connected to, generating responses based on their mode. This creates a simulated team dynamic — multiple perspectives from programmable AI agents.

### Canvas Elements (current + planned)
| Element | Status | Purpose |
|---------|--------|---------|
| Text Node | Built | Free-form text notes |
| Concept Card | Built | Structured idea (title, description, tags) |
| Image Node | Built | Visual reference with caption |
| Run Flow | Built | AI synthesis of connected graph |
| Goal Card | Planned | Define objectives/targets for the brainstorm |
| Perplexity Card | Planned | Capture doubts, open questions, unknowns |
| Digital Twin | Planned | AI persona with programmable behavior |

### Use Cases
- **Solo brainstorming** — externalize ideas, connect them, get AI synthesis
- **Market research** — create perplexity cards with questions, connect to research nodes, synthesize findings
- **Product ideation** — goal cards + concept cards + devil's advocate twin → refined ideas
- **Decision making** — map pros/cons with collaborating and contradicting twins
- **Creative writing** — narrative elements as nodes, twins as character voices
- **Strategic planning** — goals + constraints + multiple twin perspectives → action plan

## Tech Stack

- **Next.js 16.2** (App Router) + **React 19** + **TypeScript 5**
- **@xyflow/react 12** (React Flow v12) — canvas/node graph
- **Tailwind CSS v4** + **shadcn/ui** + **class-variance-authority**
- **@anthropic-ai/sdk** — Claude API for AI synthesis and Digital Twins
- **Storybook 10** — component documentation
- **Vitest + Playwright** — testing

## Architecture Rules

1. **Next.js version warning:** This uses Next.js 16 with breaking changes. Always read `node_modules/next/dist/docs/` before writing code.
2. **shadcn-first:** Check shadcn/ui + existing `src/components/ui/` before building custom UI.
3. **Shared utilities:** Reuse `src/config/constants.ts`, `src/lib/node-style.ts`, hooks in `src/hooks/`.
4. **Glassmorphism:** All app overlays (header, prompt bar, status bar, toolbars) use `GLASS_CONTAINER_CLASS` with `backdrop-blur`. Canvas nodes are **exempt** — they use `--node-bg`.
5. **Node composition:** New node types = `NodeHandles` + `NodeActions` + `NodeHeader` + `EditableField` + style utilities.

## Design System Tokens

### Colors
| Token | Light | Dark |
|-------|-------|------|
| `--background` | `oklch(1 0 0)` white | `#202124` dark gray |
| `--foreground` | `oklch(0.145 0 0)` | `oklch(0.985 0 0)` |
| `--glass-bg` | `rgba(0,0,0,0.04)` | `rgba(255,255,255,0.06)` |
| `--node-bg` | `oklch(0.97 0 0)` | `#2a2b2e` |

### Node Accent Colors
| Node Type | Color | Hex |
|-----------|-------|-----|
| Text | Slate | `#64748b` |
| Concept Card | Purple | `#A78BFA` |
| Image Upload | Cyan | `#38BDF8` |
| Run Flow | Emerald | `#34D399` |
| Goal Card | Amber | `#FBBF24` (planned) |
| Perplexity Card | Rose | `#FF6B9D` (planned) |
| Digital Twin | Indigo | `#818CF8` (planned) |

### Typography
- **Sans/Heading:** Satoshi (Fontshare)
- **Mono:** Geist Mono

### Radius Scale
Base `--radius: 0.875rem`, scaled via `--radius-sm` through `--radius-4xl`.

## File Structure

```
src/
├── app/              # Next.js App Router (layout, page, API routes)
├── components/
│   ├── canvas/       # Node components, edges, toolbar, glow effects
│   ├── layout/       # Header
│   ├── panels/       # Status bar
│   ├── prompt/       # Prompt input bar
│   └── ui/           # shadcn components
├── config/           # Constants, initial demo data
├── hooks/            # useNodeData, useConnectMode
├── lib/              # Utils, node-style helpers
├── providers/        # Theme provider
├── stories/          # Storybook stories
└── types/            # TypeScript types (CanvasNode, etc.)
```

## Custom Skills

This project includes custom Claude Code skills in `.claude/skills/`:

| Skill | Usage | Purpose |
|-------|-------|---------|
| `/design` | `/design [task]` | Any design task — enforces design system tokens |
| `/component` | `/component [name]` | Create new UI component following architecture |
| `/node` | `/node [type-name]` | Create new canvas node type with full composition |
| `/present` | `/present [topic]` | Generate presentation/marketing materials |
| `/audit` | `/audit [scope]` | Architecture and code quality audit |
| `/document` | `/document [what]` | Document decisions, progress, rationale |

## Context for Conversations

When working on BrainFlow, you have full context to discuss:
- **Product strategy** — features, roadmap, user experience decisions
- **Market research** — competitors, positioning, target audience
- **Technical architecture** — how to implement new node types, AI integration patterns
- **Design** — visual identity, UX patterns, accessibility
- **Business** — pitch materials, case studies, documentation

This is a portfolio/case-history project by Mirko, a web architect AI with creative frontend background. The project demonstrates solo AI orchestration — one person directing AI agents across design, engineering, docs, and presentation.
