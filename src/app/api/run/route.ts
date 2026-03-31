import Anthropic from "@anthropic-ai/sdk";
import type { NodeInput, StructuredOutput } from "@/types/canvas";

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

const MODE_INSTRUCTIONS: Record<string, string> = {
  contraddici:
    "Challenge every assumption, find weaknesses, play devil's advocate. Be direct and provocative in your critiques.",
  collabora:
    "Expand on ideas, find unexpected connections, propose concrete developments. Be constructive and generative.",
  analizza:
    "Structured critical analysis: find logical gaps, highlight contradictions, assess feasibility. Be precise and methodical.",
  provoca:
    "Radical reframe: extreme hypotheses, uncomfortable questions, counterintuitive perspectives. Push thinking beyond limits.",
};

const SYSTEM_PROMPT = `You are a strategic facilitator. Your task is to synthesize a brainstorming board and produce structured, actionable output.

ALWAYS respond in the following JSON format:

{
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
      "DIGITAL TWINS PERSPECTIVES:\n" +
        "For each Digital Twin present, generate a response IN CHARACTER strictly following their mode.\n" +
        perspectives
          .map((p) => {
            const mode = p.metadata?.mode || "collabora";
            const instruction = MODE_INSTRUCTIONS[mode] || MODE_INSTRUCTIONS.collabora;
            let line = `- ${p.content}: ${instruction}`;
            if (p.metadata?.personality) line += ` Personality: ${p.metadata.personality}.`;
            return line;
          })
          .join("\n")
    );

    sections.push(
      "IMPORTANT: After the main JSON, generate a separate section for each Digital Twin.\n" +
        "Format each twin response like this:\n" +
        perspectives
          .map(
            (p) =>
              `===TWIN:${p.nodeId}===\n[The in-character response from twin ${p.content}]\n===END_TWIN===`
          )
          .join("\n") +
        "\nEach twin must respond IN CHARACTER to the board content, following their own mode."
    );
  }

  return sections.join("\n\n");
}

function parseTwinResponses(
  text: string,
  twinNodeIds: string[]
): { mainResult: string; twinResponses: Record<string, string> } {
  const twinResponses: Record<string, string> = {};
  let mainResult = text;

  for (const nodeId of twinNodeIds) {
    const startTag = `===TWIN:${nodeId}===`;
    const endTag = `===END_TWIN===`;
    const startIdx = text.indexOf(startTag);
    if (startIdx === -1) continue;

    const contentStart = startIdx + startTag.length;
    const endIdx = text.indexOf(endTag, contentStart);
    if (endIdx === -1) continue;

    twinResponses[nodeId] = text.slice(contentStart, endIdx).trim();
    mainResult = mainResult.replace(
      text.slice(startIdx, endIdx + endTag.length),
      ""
    );
  }

  return { mainResult: mainResult.trim(), twinResponses };
}

function parseStructuredOutput(text: string): { structured: StructuredOutput | null; raw: string } {
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
    return { structured, raw: structured.synthesis };
  } catch {
    return { structured: null, raw: text };
  }
}

export async function POST(request: Request) {
  try {
    const { inputs } = (await request.json()) as { inputs: NodeInput[] };

    if (!inputs || !Array.isArray(inputs) || inputs.length === 0) {
      return Response.json(
        { error: "No input provided" },
        { status: 400 }
      );
    }

    const prompt = buildSemanticPrompt(inputs);
    const twinNodeIds = inputs
      .filter((i) => i.nodeType === "digitalTwin")
      .map((i) => i.nodeId);

    const message = await anthropic.messages.create({
      model: "claude-sonnet-4-20250514",
      max_tokens: 3000,
      system: SYSTEM_PROMPT,
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
    });

    const textBlock = message.content.find((b) => b.type === "text");
    const rawText = textBlock ? textBlock.text : "No result generated";

    let mainText = rawText;
    let twinResponses: Record<string, string> = {};

    if (twinNodeIds.length > 0) {
      const parsed = parseTwinResponses(rawText, twinNodeIds);
      mainText = parsed.mainResult;
      twinResponses = parsed.twinResponses;
    }

    const { structured, raw } = parseStructuredOutput(mainText);

    return Response.json({
      result: raw,
      structuredOutput: structured,
      ...(Object.keys(twinResponses).length > 0 ? { twinResponses } : {}),
    });
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
    console.error("Run API error:", errorMessage);
    return Response.json({ error: errorMessage }, { status: 500 });
  }
}
