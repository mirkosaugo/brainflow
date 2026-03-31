# BrainFlow — AI-Powered Brainstorming Canvas

@AGENTS.md

## What is BrainFlow

BrainFlow is a canvas-based brainstorming tool where you organize ideas by color and let AI synthesize them. The core loop:

1. **Create elements on the canvas** — text notes, concept cards, goal cards, perplexity cards, images, and **Digital Twins** (AI personas with programmable mood/behavior)
2. **Group by color** — each node has a selectable color; nodes sharing a color form a logical group
3. **Run by Color** — select a color from the prompt bar and hit "Generate" to synthesize all nodes of that color
4. **Get structured AI output** — BrainFlow produces a `SynthesisOutput` node with organized sections: synthesis narrative, conflicts, open questions, next steps, and goal alignment
5. **Digital Twins respond in-character** — any twin in the color group generates its own response based on its behavior mode

### Digital Twins
The distinctive feature: AI personas that live on the canvas and participate in synthesis. Each twin has a programmable behavior mode:
- **Contraddici** — challenges and pushes back on ideas (devil's advocate)
- **Collabora** — builds on ideas, suggests expansions
- **Analizza** — breaks down ideas critically, finds gaps
- **Provoca** — provocative, pushes thinking to extremes

When a "Run by Color" synthesis includes Digital Twins, each twin generates an **in-character response** that appears directly inside the twin node on canvas. The API uses `===TWIN:nodeId===` markers to parse individual responses. This creates a simulated team dynamic — multiple perspectives from programmable AI agents, all visible on the canvas.

### Canvas Elements
| Element | Purpose |
|---------|---------|
| Text Node | Free-form text notes |
| Concept Card | Structured idea (title, description, tags) |
| Image Node | Visual reference with caption |
| Goal Card | Define objectives/targets (criteria, timeframe, priority) |
| Perplexity Card | Open questions, doubts, unknowns (context, blocking flag) |
| Digital Twin | AI persona with behavior mode and in-canvas responses |
| Run Node | Manual synthesis trigger (color-based) |
| Synthesis Output | Auto-generated structured output from Run by Color |

### Smart Create
The prompt bar supports **AI-powered node generation**: type a natural language description and the `/api/smart-create` endpoint determines the best node type and generates rich content (title, tags, description, etc.) using Claude Sonnet.

### Color-Based Grouping
Instead of edges/connections, BrainFlow uses **color as the semantic link** between nodes:
- Every node has a **selectable color** (not tied to its type)
- Each node type has a default color (`NODE_COLORS` in constants), but users can change it freely via the node edit drawer
- "Run by Color" synthesizes all nodes sharing a color into a `SynthesisOutput`
- Run nodes can also be assigned a color; other Run nodes' colors are disabled to prevent duplicates

### Structured Synthesis Output
The `/api/run` endpoint returns a `StructuredOutput` with organized sections:
- **synthesis** — narrative summary of the color group
- **conflicts** — tensions and contradictions between ideas
- **openQuestions** — unresolved points worth exploring
- **nextSteps** — actionable recommendations with priority levels
- **goalAlignment** — optional assessment of how ideas align with goals

### Use Cases
- **Solo brainstorming** — externalize ideas, group by color, get structured AI synthesis
- **Market research** — perplexity cards with questions + research nodes, same color → synthesize findings
- **Product ideation** — goal cards + concept cards + devil's advocate twin, all same color → refined ideas
- **Decision making** — map pros/cons with collaborating and contradicting twins in the same color group
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
│   ├── canvas/       # Node components, toolbar, color filter bar, edit drawer
│   ├── layout/       # Header
│   ├── panels/       # Status bar
│   ├── prompt/       # Prompt input bar
│   └── ui/           # shadcn components
├── config/           # Constants, initial demo data
├── hooks/            # useNodeData
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
