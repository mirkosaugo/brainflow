# SymposiumAI

AI-powered thinking canvas where ideas meet structured debate.

## How it works

Place content cards on a canvas and group them by color. Each color is a topic. Add Digital Twins — AI personas with distinct thinking styles — to challenge, analyze, and debate your ideas.

### The flow

```
Content Cards → Think → Debate → Synthesize
```

1. **Content cards** — text notes, concept cards, goals, open questions, images. Assign them a color to group by topic.

2. **Think** — each Digital Twin reads the content cards of its color and generates an individual opinion. Triggered per-twin via the brain icon on the card.

3. **Debate** — when 2+ twins have opinions, they debate each other in turns. Each twin responds to what the previous one said. Produces a Debate Output card.

4. **Synthesize** — takes all content cards + the Debate Output and generates a structured synthesis: narrative, conflicts, open questions, next steps, and goal alignment.

### Digital Twins

AI personas with programmable behavior:

- **Challenge** — devil's advocate, finds weaknesses
- **Collaborate** — builds on ideas, finds connections
- **Analyze** — logical gaps, feasibility assessment
- **Provoke** — radical reframes, uncomfortable questions

Each twin has a custom name and personality. In the demo, Greek gods debate the fate of Olympus.

### Smart Create

Type a natural language description in the prompt bar and AI generates the right card type with rich content.

## Tech stack

- [Next.js 16](https://nextjs.org/) + React 19 + TypeScript
- [@xyflow/react 12](https://reactflow.dev/) (React Flow) for the canvas
- [Tailwind CSS v4](https://tailwindcss.com/) + [shadcn/ui](https://ui.shadcn.com/)
- [Anthropic SDK](https://docs.anthropic.com/) — Claude API for all AI features
- [Lucide Icons](https://lucide.dev/)

## Getting started

```bash
npm install
cp .env.example .env.local  # add ANTHROPIC_API_KEY
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). Clear localStorage to see the demo canvas.

## Project

Side project by Mirko — a portfolio piece demonstrating AI-orchestrated development. One person, full stack, AI agents as the team.
