import type { Node, Edge } from "@xyflow/react";

// --- Node data interfaces ---

export interface TextNodeData extends Record<string, unknown> {
  text: string;
  color: string;
}

export interface ConceptCardData extends Record<string, unknown> {
  title: string;
  description: string;
  tags: string[];
  color: string;
}

export interface ImageUploadData extends Record<string, unknown> {
  src: string | null; // base64 data URL or null if empty
  caption: string;
  color: string;
}

export interface StructuredOutput {
  synthesis: string;
  conflicts: Array<{ between: string; tension: string }>;
  openQuestions: Array<{ question: string; isBlocking: boolean; suggestedApproach: string }>;
  nextSteps: Array<{ action: string; priority: "high" | "medium" | "low"; rationale: string }>;
  goalAlignment?: string;
}

export interface RunNodeData extends Record<string, unknown> {
  label: string;
  status: "idle" | "running" | "done" | "error";
  result: string;
  structuredOutput?: StructuredOutput;
  color: string;
}

export interface GoalCardData extends Record<string, unknown> {
  title: string;
  successCriteria: string;
  timeframe: string;
  priority: "high" | "medium" | "low";
  color: string;
}

export interface PerplexityCardData extends Record<string, unknown> {
  question: string;
  context: string;
  isBlocking: boolean;
  color: string;
}

export interface DigitalTwinData extends Record<string, unknown> {
  name: string;
  mode: "contraddici" | "collabora" | "analizza" | "provoca";
  personality: string;
  lastResponse: string;
  status: "idle" | "thinking" | "debating" | "done";
  color: string;
}

export interface SynthesisOutputData extends Record<string, unknown> {
  sourceRunNodeId: string;
  title: string;
  synthesis: string;
  timestamp: number;
  label: string;
  color: string;
}

export interface DebateOutputData extends Record<string, unknown> {
  transcript: Array<{ name: string; text: string }>;
  summary: string;
  timestamp: number;
  label: string;
  color: string;
}

// --- Node type aliases ---

export type TextNode = Node<TextNodeData, "text">;
export type ConceptCardNode = Node<ConceptCardData, "conceptCard">;
export type ImageUploadNode = Node<ImageUploadData, "imageUpload">;
export type RunNode = Node<RunNodeData, "run">;
export type GoalCardNode = Node<GoalCardData, "goalCard">;
export type PerplexityCardNode = Node<PerplexityCardData, "perplexityCard">;
export type DigitalTwinNode = Node<DigitalTwinData, "digitalTwin">;
export type SynthesisOutputNode = Node<SynthesisOutputData, "synthesisOutput">;
export type DebateOutputNode = Node<DebateOutputData, "debateOutput">;

export type CanvasNode = TextNode | ConceptCardNode | ImageUploadNode | RunNode | GoalCardNode | PerplexityCardNode | DigitalTwinNode | SynthesisOutputNode | DebateOutputNode;
export type CanvasEdge = Edge;

export type ToolMode = "select" | "hand";

// --- Run Flow semantic input ---

export interface NodeInput {
  nodeId: string;
  nodeType: string;
  role: "goal" | "idea" | "question" | "evidence" | "perspective" | "context";
  content: string;
  metadata?: Record<string, string>;
}
