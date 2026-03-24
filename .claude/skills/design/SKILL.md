---
name: design
description: Execute any design task (logo, graphics, slides, UI mockups, color palettes) while strictly respecting the BrainFlow design system tokens and brand identity
---

# Design System Enforcement

You are acting as the design arm of a solo web architect. Every visual output must be consistent with the BrainFlow design system.

## Task
$ARGUMENTS

## Design System Reference

### Brand Identity
- **App name:** BrainFlow
- **Personality:** Minimal, glassmorphic, creative-professional
- **Concept:** Brainstorming canvas with Digital Twins (AI personas), idea synthesis, chainable flows
- **Font:** Satoshi (sans/heading), Geist Mono (code)

### Core Palette
| Role | Light | Dark |
|------|-------|------|
| Background | `#ffffff` | `#202124` |
| Foreground | `oklch(0.145 0 0)` | `oklch(0.985 0 0)` |
| Glass BG | `rgba(0,0,0,0.04)` | `rgba(255,255,255,0.06)` |
| Glass Border | `oklch(0 0 0 / 10%)` | `oklch(1 0 0 / 10%)` |
| Node BG | `oklch(0.97 0 0)` | `#2a2b2e` |

### Accent Colors (use these as the primary brand palette)
| Name | Hex | Usage |
|------|-----|-------|
| Slate | `#64748b` | Text nodes, neutral accents |
| Purple | `#A78BFA` | Concept/creative, primary brand accent |
| Cyan | `#38BDF8` | Media, visual elements |
| Emerald | `#34D399` | AI/run, success states |

### Visual Rules
1. **Glassmorphism** for overlays: `backdrop-blur-2xl`, semi-transparent bg, subtle border
2. **No glassmorphism** on canvas nodes — they use solid `--node-bg`
3. **Left accent border** pattern on cards (4px left, 1px others)
4. **Border radius:** base `0.875rem`, use scale from `--radius-sm` to `--radius-4xl`
5. **Shadows:** light = layered subtle, dark = single `0 0 15px` glow
6. **Animations:** smooth ambient waves, no jarring transitions

### When creating logos, icons, or graphics
- Use the accent colors above as the primary palette
- Prefer geometric/minimal shapes
- The "BrainFlow" concept = connected ideas, Digital Twins debating, brainstorm synthesis
- Key visual metaphors: brain/neurons, connected nodes, flowing ideas, twin personas
- SVG format preferred for web assets
- Provide both light and dark variants when relevant

### When creating slides or presentations
- Use dark background (`#202124`) as primary slide bg
- White/light text (`oklch(0.985 0 0)`)
- Accent colors for highlights and emphasis
- Satoshi font family
- Generous whitespace, minimal text per slide
- Include the BrainFlow brand colors consistently

### Output
Always explain your design decisions and how they connect to the design system.
