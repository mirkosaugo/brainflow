---
name: present
description: Generate presentation materials (pitch decks, case studies, marketing pages) using Flow's design system and brand identity
---

# Presentation Builder

Generate professional presentation materials for BrainFlow.

## Request
$ARGUMENTS

## Brand Guidelines

### Visual Identity
- **Primary background:** `#202124` (dark) — use for slide backgrounds
- **Text:** `oklch(0.985 0 0)` (near-white) on dark backgrounds
- **Accent palette:**
  - Purple `#A78BFA` — primary brand accent, creativity
  - Cyan `#38BDF8` — media, technology
  - Emerald `#34D399` — AI, success, growth
  - Slate `#64748b` — neutral, supporting text
- **Font:** Satoshi (sans), Geist Mono (code snippets)
- **Style:** Minimal, generous whitespace, glassmorphic accents

### Narrative Voice
- **Product:** BrainFlow — AI-powered brainstorming canvas with Digital Twins, idea synthesis, chainable flows
- **Positioning:** Web architect AI — creative frontend developer who orchestrates AI agents
- **Key message:** "One person orchestrating like a full team — not replacing humans, but showing what's possible when human creativity directs AI execution"
- **Tone:** Professional but not corporate, confident but not arrogant, technical but accessible

### Content Principles
1. Show the **process**, not just the result
2. Emphasize **human decision-making** directing AI execution
3. Highlight **consistency** across design, code, documentation, presentation
4. Frame as **case history** — what was done, why, and how

### Output Formats
- **HTML slides:** Self-contained HTML with inline CSS, dark theme, responsive
- **Markdown:** For documentation/README contexts
- **Component:** React component if it should live in the app

### When creating case study materials
- Include: problem, approach, architecture decisions, results
- Show the orchestration workflow (which agents/skills were used)
- Include code snippets in Geist Mono
- Use screenshots or diagrams where helpful
- Always credit the human-AI collaboration model
