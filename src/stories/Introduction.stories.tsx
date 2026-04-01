import type { Meta, StoryObj } from "@storybook/nextjs-vite";

function IntroductionPage() {
  return (
    <div className="w-full max-w-4xl space-y-8 bg-background p-8 text-foreground">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">SymposiumAI Design System</h1>
        <div className="mt-3 flex flex-wrap gap-2">
          <span className="rounded-full bg-primary px-3 py-0.5 text-xs font-medium text-primary-foreground">
            v1.0
          </span>
          <span className="rounded-full border border-border px-3 py-0.5 text-xs font-medium text-muted-foreground">
            Next.js 16
          </span>
          <span className="rounded-full border border-border px-3 py-0.5 text-xs font-medium text-muted-foreground">
            React 19
          </span>
          <span className="rounded-full border border-border px-3 py-0.5 text-xs font-medium text-muted-foreground">
            Tailwind 4
          </span>
        </div>
        <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
          Interactive documentation for the <strong className="text-foreground">SymposiumAI</strong> design system —
          a canvas-based application for visual thinking with AI.
        </p>
      </div>

      {/* Architecture */}
      <div className="space-y-3">
        <h2 className="text-lg font-semibold">Architecture</h2>
        <div className="overflow-hidden rounded-xl border border-border">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/50">
                <th className="px-4 py-2 text-left font-medium text-muted-foreground">
                  Layer
                </th>
                <th className="px-4 py-2 text-left font-medium text-muted-foreground">
                  Technology
                </th>
                <th className="px-4 py-2 text-left font-medium text-muted-foreground">
                  Details
                </th>
              </tr>
            </thead>
            <tbody>
              {[
                ["Framework", "Next.js 16 + React 19", "App Router, Server Components"],
                ["Styling", "Tailwind CSS v4", "OKLCH color space, CSS variables"],
                ["UI Primitives", "@base-ui/react", "Headless, accessible"],
                ["Variants", "class-variance-authority", "Type-safe variant system"],
                ["Theme", "next-themes", "Dark/Light with .dark class"],
                ["Canvas", "@xyflow/react", "Node graph editing"],
                ["Icons", "lucide-react", "Consistent icon set"],
              ].map(([layer, tech, detail]) => (
                <tr key={layer} className="border-b border-border/50">
                  <td className="px-4 py-2 font-medium text-foreground">{layer}</td>
                  <td className="px-4 py-2 font-mono text-xs text-foreground">{tech}</td>
                  <td className="px-4 py-2 text-muted-foreground">{detail}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Navigation Guide */}
      <div className="space-y-3">
        <h2 className="text-lg font-semibold">How to Navigate</h2>
        <div className="grid gap-3 sm:grid-cols-3">
          <div className="rounded-xl border border-border p-4">
            <h3 className="text-sm font-semibold text-foreground">Foundations</h3>
            <p className="mt-1 text-xs text-muted-foreground">
              Building blocks: colors, typography, spacing, border radius, and icons.
            </p>
          </div>
          <div className="rounded-xl border border-border p-4">
            <h3 className="text-sm font-semibold text-foreground">Design Tokens</h3>
            <p className="mt-1 text-xs text-muted-foreground">
              High-level patterns: glass morphism and canvas node colors.
            </p>
          </div>
          <div className="rounded-xl border border-border p-4">
            <h3 className="text-sm font-semibold text-foreground">Components</h3>
            <p className="mt-1 text-xs text-muted-foreground">
              All UI components with interactive variants, states, and compositions.
            </p>
          </div>
        </div>
      </div>

      {/* Design Principles */}
      <div className="space-y-3">
        <h2 className="text-lg font-semibold">Design Principles</h2>
        <div className="space-y-2">
          {[
            {
              title: "Chromatic neutrality",
              desc: "Palette based on OKLCH grays. Color is reserved for semantic states and canvas node accents.",
            },
            {
              title: "Glass morphism",
              desc: "Toolbars and overlays use transparency + backdrop-blur to create depth without visual heaviness.",
            },
            {
              title: "Dark-first",
              desc: "The dark theme is the default. Light mode is supported with full token mapping.",
            },
            {
              title: "Accessibility",
              desc: "Components built on headless primitives (@base-ui/react) with native ARIA attributes.",
            },
            {
              title: "Typographic consistency",
              desc: "A single font (Satoshi) for sans and headings, Geist Mono for code.",
            },
          ].map((p, i) => (
            <div
              key={p.title}
              className="flex gap-3 rounded-lg border border-border/50 p-3"
            >
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
                {i + 1}
              </span>
              <div>
                <p className="text-sm font-medium text-foreground">{p.title}</p>
                <p className="text-xs text-muted-foreground">{p.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Theme Toggle Hint */}
      <div className="rounded-xl border border-dashed border-border bg-muted/30 p-4">
        <p className="text-sm text-muted-foreground">
          Use the <strong className="text-foreground">theme toggle</strong> in the Storybook toolbar
          to compare light and dark mode on every component.
        </p>
      </div>
    </div>
  );
}

const meta: Meta = {
  title: "Introduction",
  parameters: {
    layout: "fullscreen",
  },
};

export default meta;
type Story = StoryObj;

export const Overview: Story = {
  render: () => <IntroductionPage />,
};
