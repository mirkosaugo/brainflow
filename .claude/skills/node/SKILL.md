---
name: node
description: Create a new canvas node type for BrainFlow, composing from shared primitives (NodeHandles, NodeHeader, NodeActions, EditableField)
---

# Canvas Node Builder

Create a new node type for the BrainFlow canvas.

## BrainFlow Node Types (current + planned)
- **Text** — free-form notes (built)
- **Concept Card** — structured idea with title, description, tags (built)
- **Image** — visual reference (built)
- **Run Flow** — AI synthesis of connected graph (built)
- **Goal Card** — objectives/targets for brainstorm (planned, accent: #FBBF24)
- **Perplexity Card** — doubts, open questions, unknowns (planned, accent: #FF6B9D)
- **Digital Twin** — AI persona with programmable behavior mode (planned, accent: #818CF8)

## Node Request
$ARGUMENTS

## Composition Pattern

Every node MUST be composed from these shared primitives:

```
NodeHandles (8 connection points)
└── wrapper div (styled with getCardStyle or getRunStyle)
    ├── NodeActions (connect/edit/delete toolbar)
    ├── NodeHeader (colored icon + label)
    └── Content area (type-specific UI)
```

### Required imports
```typescript
import { NodeHandles } from "./node-handles";
import { NodeActions } from "./node-actions";
import { NodeHeader } from "./node-header";
import { EditableField } from "./editable-field";
import { useNodeData } from "@/hooks/use-node-data";
import { useConnectMode } from "@/hooks/use-connect-mode";
import { getCardStyle, tintBg, getConnectHoverShadow } from "@/lib/node-style";
import { NODE_COLORS } from "@/config/constants";
```

### Steps

1. **Define the data type** in `src/types/canvas.ts`:
   - Add to `CanvasNodeData` union type
   - Add to `CanvasNode` type union

2. **Choose an accent color** — add to `NODE_COLORS` in `src/config/constants.ts` if new

3. **Create the component** in `src/components/canvas/[name]-node.tsx`:
   - Use `useNodeData<YourDataType>(id, data)` for type-safe state
   - Use `useConnectMode()` for connection UI state
   - Apply `getCardStyle(color, selected)` for left-accent style (or `getRunStyle` for uniform border)
   - Handle connect mode hover with `getConnectHoverShadow(color)`

4. **Register in FlowCanvas** — add to `nodeTypes` map in `src/components/canvas/flow-canvas.tsx`

5. **Add creation logic** — add a button/action in prompt bar or toolbar

6. **Create Storybook story** in `src/stories/`

## Reference: Existing Node Types
- `text-node.tsx` — simplest example (single editable text field)
- `concept-card-node.tsx` — multi-field example (title, description, tags)
- `image-node.tsx` — file input example (drag-drop + base64)
- `run-node.tsx` — AI output example (different styling with getRunStyle)
