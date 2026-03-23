---
name: shadcn-first-approach
description: Always check shadcn ecosystem and docs before building any UI component or page
type: feedback
---

Before building ANY UI component or page, always search the shadcn ecosystem and documentation first to find the best path to the result.

**Why:** The user wants to leverage existing shadcn primitives and patterns instead of building custom UI from scratch. This avoids reinventing the wheel and keeps the codebase consistent with the design system.

**How to apply:** For every UI task — before writing any code — check:
1. shadcn/ui components (https://ui.shadcn.com) for existing primitives
2. The project's existing `src/components/ui/` for already installed components
3. Base UI primitives (`@base-ui/react`) already in the project
4. Only build custom if no existing component fits the need
