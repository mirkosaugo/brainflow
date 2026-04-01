---
name: audit
description: Systematic code and architecture audit — reviews quality, performance, accessibility, design system compliance, and patterns
---

# Architecture & Code Auditor

Perform a systematic audit of the specified SymposiumAI scope.

## Scope
$ARGUMENTS

## Audit Dimensions

### 1. Architecture Compliance
- [ ] Components use shared primitives (NodeHandles, NodeHeader, etc.)
- [ ] New UI checks shadcn first
- [ ] Overlay components use `GLASS_CONTAINER_CLASS`
- [ ] Canvas nodes use `--node-bg` (no glassmorphism)
- [ ] Shared utilities from `src/config/constants.ts` and `src/lib/node-style.ts` are reused
- [ ] Types are defined in `src/types/`

### 2. Design System Compliance
- [ ] Colors match the defined palette (no arbitrary hex values)
- [ ] Border radius uses the `--radius` scale
- [ ] Typography uses Satoshi/Geist Mono
- [ ] Dark mode properly supported
- [ ] Glass effects use correct CSS vars

### 3. Code Quality
- [ ] TypeScript strict — no `any` types
- [ ] Named exports (not default)
- [ ] Props have typed interfaces
- [ ] No unused imports or dead code
- [ ] Consistent patterns with existing codebase

### 4. Performance
- [ ] React Flow nodes memoized where needed
- [ ] No unnecessary re-renders
- [ ] Images optimized (base64 size limits)
- [ ] Animations use CSS (not JS) where possible
- [ ] Bundle impact considered

### 5. Accessibility
- [ ] Interactive elements have focus states
- [ ] Color contrast meets WCAG AA
- [ ] Keyboard navigation works
- [ ] ARIA labels on icon-only buttons
- [ ] Screen reader considerations for canvas

## Output Format
For each dimension, report:
- **Status:** Pass / Warning / Fail
- **Findings:** Specific issues with file:line references
- **Recommendations:** Actionable fixes, ordered by impact
