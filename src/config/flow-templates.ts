import type { CanvasNode } from "@/types/canvas";
import { NODE_COLORS } from "./constants";

export interface FlowTemplate {
  id: string;
  name: string;
  description: string;
  nodes: CanvasNode[];
}

// --- Template 1: Product Critique ---

const productCritiqueNodes: CanvasNode[] = [
  {
    id: "tpl-goal",
    type: "goalCard",
    position: { x: 400, y: 0 },
    data: { title: "Validate the product concept", successCriteria: "", timeframe: "", priority: "high" as const, color: NODE_COLORS.goalCard },
  },
  {
    id: "tpl-c1",
    type: "conceptCard",
    position: { x: 100, y: 180 },
    data: { title: "", description: "", tags: ["feature"], color: NODE_COLORS.conceptCard },
  },
  {
    id: "tpl-c2",
    type: "conceptCard",
    position: { x: 400, y: 180 },
    data: { title: "", description: "", tags: ["benefit"], color: NODE_COLORS.conceptCard },
  },
  {
    id: "tpl-c3",
    type: "conceptCard",
    position: { x: 700, y: 180 },
    data: { title: "", description: "", tags: ["feature"], color: NODE_COLORS.conceptCard },
  },
  {
    id: "tpl-twin-critico",
    type: "digitalTwin",
    position: { x: 0, y: 380 },
    data: { name: "Critic", mode: "contraddici" as const, personality: "", lastResponse: "", status: "idle" as const, color: NODE_COLORS.digitalTwin },
  },
  {
    id: "tpl-twin-innovatore",
    type: "digitalTwin",
    position: { x: 750, y: 380 },
    data: { name: "Innovator", mode: "collabora" as const, personality: "", lastResponse: "", status: "idle" as const, color: NODE_COLORS.digitalTwin },
  },
  {
    id: "tpl-perp",
    type: "perplexityCard",
    position: { x: 100, y: 560 },
    data: { question: "What problem does it really solve?", context: "", isBlocking: true, color: NODE_COLORS.perplexityCard },
  },
  {
    id: "tpl-run",
    type: "run",
    position: { x: 380, y: 580 },
    data: { label: "Run AI", status: "idle" as const, result: "", color: NODE_COLORS.run },
  },
];

// --- Template 2: Decision Matrix ---

const decisionMatrixNodes: CanvasNode[] = [
  {
    id: "tpl-goal",
    type: "goalCard",
    position: { x: 350, y: 0 },
    data: { title: "Decision to make", successCriteria: "", timeframe: "", priority: "high" as const, color: NODE_COLORS.goalCard },
  },
  {
    id: "tpl-c1",
    type: "conceptCard",
    position: { x: 100, y: 180 },
    data: { title: "Option A", description: "", tags: [], color: NODE_COLORS.conceptCard },
  },
  {
    id: "tpl-c2",
    type: "conceptCard",
    position: { x: 600, y: 180 },
    data: { title: "Option B", description: "", tags: [], color: NODE_COLORS.conceptCard },
  },
  {
    id: "tpl-twin-analista",
    type: "digitalTwin",
    position: { x: 0, y: 380 },
    data: { name: "Analyst", mode: "analizza" as const, personality: "", lastResponse: "", status: "idle" as const, color: NODE_COLORS.digitalTwin },
  },
  {
    id: "tpl-twin-devil",
    type: "digitalTwin",
    position: { x: 700, y: 380 },
    data: { name: "Devil's Advocate", mode: "provoca" as const, personality: "", lastResponse: "", status: "idle" as const, color: NODE_COLORS.digitalTwin },
  },
  {
    id: "tpl-perp1",
    type: "perplexityCard",
    position: { x: 50, y: 560 },
    data: { question: "What don't you know about Option A?", context: "", isBlocking: false, color: NODE_COLORS.perplexityCard },
  },
  {
    id: "tpl-perp2",
    type: "perplexityCard",
    position: { x: 600, y: 560 },
    data: { question: "What don't you know about Option B?", context: "", isBlocking: false, color: NODE_COLORS.perplexityCard },
  },
  {
    id: "tpl-run",
    type: "run",
    position: { x: 330, y: 580 },
    data: { label: "Run AI", status: "idle" as const, result: "", color: NODE_COLORS.run },
  },
];

// --- Template 3: Research Synthesis ---

const researchSynthesisNodes: CanvasNode[] = [
  {
    id: "tpl-goal",
    type: "goalCard",
    position: { x: 350, y: 0 },
    data: { title: "What do I want to understand?", successCriteria: "", timeframe: "", priority: "medium" as const, color: NODE_COLORS.goalCard },
  },
  {
    id: "tpl-c1",
    type: "conceptCard",
    position: { x: 50, y: 180 },
    data: { title: "", description: "", tags: ["key-theme"], color: NODE_COLORS.conceptCard },
  },
  {
    id: "tpl-c2",
    type: "conceptCard",
    position: { x: 330, y: 180 },
    data: { title: "", description: "", tags: ["key-theme"], color: NODE_COLORS.conceptCard },
  },
  {
    id: "tpl-c3",
    type: "conceptCard",
    position: { x: 610, y: 180 },
    data: { title: "", description: "", tags: ["key-theme"], color: NODE_COLORS.conceptCard },
  },
  {
    id: "tpl-c4",
    type: "conceptCard",
    position: { x: 890, y: 180 },
    data: { title: "", description: "", tags: ["key-theme"], color: NODE_COLORS.conceptCard },
  },
  {
    id: "tpl-t1",
    type: "text",
    position: { x: 0, y: 380 },
    data: { text: "", color: NODE_COLORS.text },
  },
  {
    id: "tpl-t2",
    type: "text",
    position: { x: 300, y: 380 },
    data: { text: "", color: NODE_COLORS.text },
  },
  {
    id: "tpl-twin-ricercatore",
    type: "digitalTwin",
    position: { x: 620, y: 380 },
    data: { name: "Researcher", mode: "analizza" as const, personality: "", lastResponse: "", status: "idle" as const, color: NODE_COLORS.digitalTwin },
  },
  {
    id: "tpl-perp1",
    type: "perplexityCard",
    position: { x: 50, y: 560 },
    data: { question: "", context: "", isBlocking: false, color: NODE_COLORS.perplexityCard },
  },
  {
    id: "tpl-perp2",
    type: "perplexityCard",
    position: { x: 600, y: 560 },
    data: { question: "", context: "", isBlocking: false, color: NODE_COLORS.perplexityCard },
  },
  {
    id: "tpl-run",
    type: "run",
    position: { x: 380, y: 720 },
    data: { label: "Run AI", status: "idle" as const, result: "", color: NODE_COLORS.run },
  },
];

// --- Export ---

export const FLOW_TEMPLATES: FlowTemplate[] = [
  {
    id: "product-critique",
    name: "Product Critique",
    description: "Validate a product concept with critic and innovator twins",
    nodes: productCritiqueNodes,
  },
  {
    id: "decision-matrix",
    name: "Decision Matrix",
    description: "Compare options with analyst and devil's advocate",
    nodes: decisionMatrixNodes,
  },
  {
    id: "research-synthesis",
    name: "Research Synthesis",
    description: "Synthesize research with key themes, quotes, and questions",
    nodes: researchSynthesisNodes,
  },
];
