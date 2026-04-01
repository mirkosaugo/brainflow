---
name: component
description: Create a new UI component following the SymposiumAI architecture patterns — shadcn-first, glassmorphism for overlays, shared utilities
---

# Component Builder

Create a new component following SymposiumAI's architecture standards.

## Component Request
$ARGUMENTS

## Pre-flight Checklist (execute in order)

1. **shadcn check:** Search https://ui.shadcn.com for an existing component that fits. If found, install it with `npx shadcn@latest add <name>` and customize.
2. **Existing check:** Look in `src/components/ui/` for already-installed shadcn components that could be composed.
3. **Base UI check:** Check if `@base-ui/react` has a headless primitive that fits.
4. **Custom build:** Only if steps 1-3 don't cover the need.

## Architecture Rules

### File placement
- UI primitives → `src/components/ui/`
- Canvas-related → `src/components/canvas/`
- Layout chrome → `src/components/layout/`
- Panels/sidebars → `src/components/panels/`
- Input/action bars → `src/components/prompt/`

### Styling
- Use Tailwind CSS v4 utilities
- For **app overlays** (floating UI, toolbars, panels): apply `GLASS_CONTAINER_CLASS` from `src/config/constants.ts`
- For **icon buttons**: use `ICON_BTN_CLASS` from `src/config/constants.ts`
- For **canvas nodes**: use `--node-bg`, `--node-border` CSS vars (NO glassmorphism)
- Use `cn()` from `src/lib/utils.ts` for conditional classes

### Patterns
- Use `class-variance-authority` (cva) for component variants
- Export with named exports, not default
- TypeScript strict — define prop interfaces
- Use React 19 patterns (no forwardRef needed)

### Testing
- Create a Storybook story in `src/stories/` matching the component category
- Follow existing story patterns (see `src/stories/components/`)

## Output
1. The component file(s)
2. A Storybook story
3. Brief explanation of decisions made
