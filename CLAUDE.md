# SymposiumAI — AI-Powered Thinking Canvas

@AGENTS.md

## What is SymposiumAI

SymposiumAI is a canvas-based structured thinking tool. You place ideas on a spatial canvas, group them by color, and use AI-powered Digital Twins to challenge, analyze, and debate your thinking before generating a final synthesis.

### The Core Loop

1. **Create content cards** — text notes, concept cards, goal cards, open questions, images
2. **Group by color** — each card has a selectable color; same color = same topic/theme
3. **Think** — each Digital Twin individually analyzes the content cards of its color and generates an in-character opinion
4. **Debate** — when 2+ twins have opinions, they debate each other in turns, producing a Debate Output card
5. **Synthesize** — all content cards + the debate output are synthesized into a structured Synthesis Output (conflicts, open questions, next steps, goal alignment)

Each step produces visible output on the canvas. The user controls when to trigger each action.

### Digital Twins

AI personas that live on the canvas. Each twin has a name, a personality, and a behavior mode:

| Mode | Label | Behavior |
|------|-------|----------|
| `contraddici` | Challenge | Devil's advocate — finds weaknesses, pushes back |
| `collabora` | Collaborate | Builds on ideas, finds connections, proposes developments |
| `analizza` | Analyze | Logical analysis — finds gaps, assesses feasibility |
| `provoca` | Provoke | Radical reframes, uncomfortable questions, breaks paradigms |

**Think** — triggered per-twin via the BrainCircuit button on the card. The twin reads all content cards (text, concept, goal, question, image) of its same color and generates an opinion based on its mode and personality. The response appears inside the twin card.

**Debate** — triggered via the prompt bar (MessageSquare button). Requires 2+ twins of the same color that have already generated a Think response. Twins take turns responding to each other sequentially. Each twin sees what previous twins said. Produces a **Debate Output** card in the color column.

### Canvas Elements

| Element | Type Key | Purpose |
|---------|----------|---------|
| Text Node | `text` | Free-form text notes |
| Concept Card | `conceptCard` | Structured idea (title, description, tags) |
| Image Node | `imageUpload` | Visual reference with caption |
| Goal Card | `goalCard` | Objectives/targets (criteria, timeframe, priority) |
| Open Question | `perplexityCard` | Questions, doubts, unknowns (context, blocking flag) |
| Digital Twin | `digitalTwin` | AI persona with behavior mode and in-canvas responses |
| Debate Output | `debateOutput` | Auto-generated transcript from twin debate |
| Synthesis Output | `synthesisOutput` | Auto-generated structured synthesis |

### Three Actions

| Action | Trigger | Input | Output |
|--------|---------|-------|--------|
| **Think** | BrainCircuit button on twin card | Content cards of same color | Twin's `lastResponse` updated in-place |
| **Debate** | MessageSquare in prompt bar → pick color | Twin opinions + content cards | Debate Output card + updated twin responses |
| **Synthesize** | Sparkles in prompt bar → pick color | Content cards + Debate Output (if exists) | Synthesis Output card |

### Color-Based Grouping

Instead of edges/connections, SymposiumAI uses **color as the semantic link**:
- Every node has a **selectable color** (not tied to its type)
- Each node type has a default color (`NODE_COLORS` in constants), but users can change it freely via the node edit drawer
- Color pills in the filter bar can be labeled (hover → pencil icon → edit)
- Synthesis Output cards can be reassigned to a different color, feeding into another group's synthesis

### Smart Create

The prompt bar supports **AI-powered node generation**: type a natural language description and `/api/smart-create` determines the best node type and generates rich content using Claude Sonnet.

### API Endpoints

| Endpoint | Purpose |
|----------|---------|
| `/api/run` | Synthesize content cards → structured JSON output (synthesis, conflicts, openQuestions, nextSteps, goalAlignment) |
| `/api/twin` | Single twin generates opinion from board context |
| `/api/debate` | Multiple twins debate in sequential turns |
| `/api/smart-create` | AI determines node type and generates content from natural language |

## Tech Stack

- **Next.js 16.2** (App Router) + **React 19** + **TypeScript 5**
- **@xyflow/react 12** (React Flow v12) — canvas/node graph
- **Tailwind CSS v4** + **shadcn/ui** + **class-variance-authority**
- **@anthropic-ai/sdk** — Claude API (Sonnet) for all AI features
- **Storybook 10** — component documentation
- **Vitest + Playwright** — testing

## Architecture Rules

1. **Next.js version warning:** This uses Next.js 16 with breaking changes. Always read `node_modules/next/dist/docs/` before writing code.
2. **shadcn-first:** Check shadcn/ui + existing `src/components/ui/` before building custom UI.
3. **Shared utilities:** Reuse `src/config/constants.ts`, `src/lib/node-style.ts`, hooks in `src/hooks/`.
4. **Glassmorphism:** All app overlays (header, prompt bar, status bar, toolbars) use `GLASS_CONTAINER_CLASS` with `backdrop-blur`. Canvas nodes are **exempt** — they use `--node-bg`.
5. **Node composition:** New node types = `NodeHandles` + `NodeActions` + `NodeHeader` + `EditableField` + style utilities.
6. **All UI text in English.**

## Design System Tokens

### Colors
| Token | Light | Dark |
|-------|-------|------|
| `--background` | `oklch(1 0 0)` white | `#202124` dark gray |
| `--foreground` | `oklch(0.145 0 0)` | `oklch(0.985 0 0)` |
| `--glass-bg` | `rgba(0,0,0,0.04)` | `rgba(255,255,255,0.06)` |
| `--node-bg` | `oklch(0.97 0 0)` | `#2a2b2e` |

### Node Default Colors
Colors are **selectable per node** via the edit drawer's `ColorSwatchPicker`. These are the defaults from `NODE_COLORS`:
| Node Type | Default Color | Hex |
|-----------|---------------|-----|
| Text | Slate | `#64748b` |
| Concept Card | Purple | `#A78BFA` |
| Image Upload | Cyan | `#38BDF8` |
| Run Flow | Emerald | `#34D399` |
| Goal Card | Amber | `#FBBF24` |
| Perplexity Card | Rose | `#FF6B9D` |
| Digital Twin | Indigo | `#818CF8` |

### Twin Mode Colors (pastel, distinct from node colors)
| Mode | Color |
|------|-------|
| Challenge | `#F9A8D4` |
| Collaborate | `#86EFAC` |
| Analyze | `#FDE68A` |
| Provoke | `#C4B5FD` |

### Typography
- **Sans/Heading:** Satoshi (Fontshare)
- **Mono:** Geist Mono

### Radius Scale
Base `--radius: 0.875rem`, scaled via `--radius-sm` through `--radius-4xl`.

## File Structure

```
src/
├── app/              # Next.js App Router (layout, page, API routes)
│   └── api/          # run/, twin/, debate/, smart-create/
├── components/
│   ├── canvas/       # Node components, toolbar, color filter bar, edit drawer
│   ├── layout/       # Header
│   ├── panels/       # Status bar
│   ├── prompt/       # Prompt input bar
│   └── ui/           # shadcn components
├── config/           # Constants, initial demo data, flow templates
├── hooks/            # useNodeData, useNodeEditor, useCanvasActions, useCanvasStorage
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

When working on SymposiumAI, you have full context to discuss:
- **Product strategy** — features, roadmap, user experience decisions
- **Technical architecture** — node types, AI integration patterns, API design
- **Design** — visual identity, UX patterns, accessibility
- **Business** — pitch materials, case studies, documentation

This is a portfolio/case-history project by Mirko, a web architect with creative frontend background. The project demonstrates solo AI orchestration — one person directing AI agents across design, engineering, docs, and presentation.
