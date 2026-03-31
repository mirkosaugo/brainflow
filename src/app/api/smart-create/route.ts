import Anthropic from "@anthropic-ai/sdk";

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

const SYSTEM_PROMPT = `You are a brainstorming assistant. The user describes what they want to create on their canvas board.
You must determine which card type to create and generate the appropriate content.

Available types:
- "text": free-form note (has field "text")
- "conceptCard": structured idea (has "title", "description", "tags" string array)
- "goalCard": objective (has "title", "successCriteria", "timeframe", "priority" which is "high"|"medium"|"low")
- "perplexityCard": open question (has "question", "context", "isBlocking" boolean)
- "digitalTwin": AI persona (has "name", "mode" which is "contraddici"|"collabora"|"analizza"|"provoca", "personality")

Respond ONLY with valid JSON, no markdown fences:
{
  "nodeType": "conceptCard",
  "data": {
    "title": "...",
    "description": "...",
    "tags": ["...", "..."]
  }
}

Rules:
- Choose the most appropriate type based on the request
- Generate rich, well-written content, expanding on the user's idea
- For conceptCard: concise title, detailed description (2-3 sentences), 2-4 relevant tags
- For goalCard: clear objective, measurable success criteria
- For perplexityCard: reformulate as a precise question
- For digitalTwin: create a persona with a coherent name, mode, and personality
- For text: write well-structured text
- Always respond in English`;

export async function POST(request: Request) {
  try {
    const { prompt } = (await request.json()) as { prompt: string };

    if (!prompt || !prompt.trim()) {
      return Response.json({ error: "No prompt provided" }, { status: 400 });
    }

    const message = await anthropic.messages.create({
      model: "claude-sonnet-4-20250514",
      max_tokens: 1000,
      system: SYSTEM_PROMPT,
      messages: [{ role: "user", content: prompt }],
    });

    const textBlock = message.content.find((b) => b.type === "text");
    const rawText = textBlock?.text ?? "";

    // Parse JSON
    let jsonStr = rawText.trim();
    const fenceMatch = jsonStr.match(/```(?:json)?\s*([\s\S]*?)```/);
    if (fenceMatch) jsonStr = fenceMatch[1].trim();

    const parsed = JSON.parse(jsonStr);

    if (!parsed.nodeType || !parsed.data) {
      return Response.json({ error: "Invalid AI response" }, { status: 500 });
    }

    return Response.json(parsed);
  } catch (error) {
    const msg = error instanceof Error ? error.message : "Unknown error";
    console.error("Smart-create API error:", msg);
    return Response.json({ error: msg }, { status: 500 });
  }
}
