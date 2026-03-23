# Flow — Idea Board

A canvas-based brainstorming app built with React Flow for artists and creatives. Connect text, concepts, images, and AI processing nodes to develop your ideas visually.

## Features

- **Text Nodes** — Free-form text for quick notes and ideas
- **Concept Cards** — Structured cards with title, description, and tags
- **Image Upload** — Drag & drop or click to upload visual references
- **Run Nodes** — Connect your content and process it with Claude AI to synthesize creative outputs
- **Full connectivity** — All node types can be linked to each other
- **Dark/Light theme** — Glassmorphic UI with theme support

## Getting Started

### Prerequisites

- Node.js 18+
- An [Anthropic API key](https://console.anthropic.com/)

### Installation

```bash
npm install
```

### Environment

Create a `.env` file in the project root:

```
ANTHROPIC_API_KEY=your-api-key-here
```

### Run

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Usage

1. Use the **prompt bar** at the bottom to type ideas (press Enter to create a text node) or click the icons to add nodes
2. **Double click** any text field on a node to edit it
3. **Drag from handles** (dots on node edges) to connect nodes together
4. Connect content nodes to a **Run node**, then press the **sparkle button** in the prompt bar to process everything with AI
5. Delete nodes/edges by selecting them and pressing Backspace

## Tech Stack

- [Next.js 16](https://nextjs.org/) + React 19
- [XY Flow (React Flow)](https://reactflow.dev/) for the canvas
- [Anthropic SDK](https://docs.anthropic.com/) for AI processing
- [Tailwind CSS v4](https://tailwindcss.com/)
- [Lucide Icons](https://lucide.dev/)
