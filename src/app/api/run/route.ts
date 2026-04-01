import Anthropic from "@anthropic-ai/sdk";
import type { NodeInput, StructuredOutput } from "@/types/canvas";

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

const SYSTEM_PROMPT = `You are a strategic facilitator. Your task is to synthesize a brainstorming board and produce structured, actionable output.

ALWAYS respond in the following JSON format:

{
  "title": "Short descriptive title for this synthesis (max 6 words)",
  "synthesis": "Cohesive narrative synthesis of all ideas (2-4 paragraphs)",
  "conflicts": [
    { "between": "Node A vs Node B", "tension": "Description of the conflict or tension" }
  ],
  "openQuestions": [
    { "question": "Unresolved question", "isBlocking": true, "suggestedApproach": "How to explore it" }
  ],
  "nextSteps": [
    { "action": "Concrete action", "priority": "high", "rationale": "Why this action" }
  ],
  "goalAlignment": "If Goal Cards are present: assessment of how well ideas align with objectives"
}

If a section is not applicable (e.g., no conflicts found), use an empty array [].
If there are no Goal Cards, omit goalAlignment.
Be specific and direct. Avoid generalities.
Respond ONLY with JSON, no markdown code fences or other text.`;

function buildSemanticPrompt(inputs: NodeInput[]): string {
  const goals = inputs.filter((i) => i.role === "goal");
  const ideas = inputs.filter((i) => i.role === "idea");
  const questions = inputs.filter((i) => i.role === "question");
  const previousOutputs = inputs.filter((i) => i.metadata?.source === "previous-run-flow");
  const context = inputs.filter((i) => i.role === "context" && i.metadata?.source !== "previous-run-flow");
  const evidence = inputs.filter((i) => i.role === "evidence");
  const perspectives = inputs.filter((i) => i.role === "perspective");

  const sections: string[] = [];

  sections.push("Analyze the following brainstorming board:");

  if (goals.length > 0) {
    sections.push(
      "OBJECTIVES:\n" +
        goals
          .map((g) => {
            let line = `- ${g.content}`;
            if (g.metadata?.priority) line += ` [priority: ${g.metadata.priority}]`;
            if (g.metadata?.timeframe) line += ` [timeframe: ${g.metadata.timeframe}]`;
            return line;
          })
          .join("\n")
    );
  }

  if (ideas.length > 0) {
    sections.push(
      "IDEAS AND CONCEPTS:\n" +
        ideas
          .map((i) => {
            let line = `- ${i.content}`;
            if (i.metadata?.tags) line += ` (tags: ${i.metadata.tags})`;
            return line;
          })
          .join("\n")
    );
  }

  if (questions.length > 0) {
    sections.push(
      "OPEN QUESTIONS:\n" +
        questions
          .map((q) => {
            let line = `- ${q.content}`;
            if (q.metadata?.isBlocking === "true") line += " ⚠ BLOCKING";
            if (q.metadata?.context) line += ` (context: ${q.metadata.context})`;
            return line;
          })
          .join("\n")
    );
  }

  if (previousOutputs.length > 0) {
    sections.push(
      "PREVIOUS ELABORATIONS (output from previous Run Flows):\n" +
        "These are outputs from previous brainstorming sessions. " +
        "Use them as consolidated context, not as simple input to summarize again.\n" +
        previousOutputs.map((p) => `- ${p.content}`).join("\n\n")
    );
  }

  if (context.length > 0 || evidence.length > 0) {
    const items = [...context, ...evidence];
    sections.push(
      "CONTEXT AND EVIDENCE:\n" + items.map((c) => `- ${c.content}`).join("\n")
    );
  }

  if (perspectives.length > 0) {
    sections.push(
      "DIGITAL TWINS PRESENT (listed for awareness, they will respond separately):\n" +
        perspectives.map((p) => `- ${p.content}`).join("\n")
    );
  }

  return sections.join("\n\n");
}

function parseStructuredOutput(text: string): { structured: StructuredOutput | null; title: string; raw: string } {
  let jsonStr = text.trim();
  const fenceMatch = jsonStr.match(/```(?:json)?\s*([\s\S]*?)```/);
  if (fenceMatch) {
    jsonStr = fenceMatch[1].trim();
  }

  try {
    const parsed = JSON.parse(jsonStr);
    const structured: StructuredOutput = {
      synthesis: parsed.synthesis ?? "",
      conflicts: Array.isArray(parsed.conflicts) ? parsed.conflicts : [],
      openQuestions: Array.isArray(parsed.openQuestions) ? parsed.openQuestions : [],
      nextSteps: Array.isArray(parsed.nextSteps) ? parsed.nextSteps : [],
      goalAlignment: parsed.goalAlignment || undefined,
    };
    return { structured, title: parsed.title ?? "", raw: structured.synthesis };
  } catch {
    return { structured: null, title: "", raw: text };
  }
}

export async function POST(request: Request) {
  try {
    const { inputs } = (await request.json()) as { inputs: NodeInput[] };

    if (!inputs || !Array.isArray(inputs) || inputs.length === 0) {
      return Response.json({ error: "No input provided" }, { status: 400 });
    }

    // Filter out twins — synthesis only uses non-twin content
    const synthesisInputs = inputs.filter((i) => i.nodeType !== "digitalTwin");
    const twinInputs = inputs.filter((i) => i.nodeType === "digitalTwin");

    const prompt = buildSemanticPrompt([...synthesisInputs, ...twinInputs]);

    const message = await anthropic.messages.create({
      model: "claude-sonnet-4-20250514",
      max_tokens: 3000,
      system: SYSTEM_PROMPT,
      messages: [{ role: "user", content: prompt }],
    });

    const textBlock = message.content.find((b) => b.type === "text");
    const rawText = textBlock ? textBlock.text : "No result generated";
    const { structured, title, raw } = parseStructuredOutput(rawText);

    return Response.json({
      result: raw,
      title,
      structuredOutput: structured,
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    console.error("Run API error:", errorMessage);
    return Response.json({ error: errorMessage }, { status: 500 });
  }
}
