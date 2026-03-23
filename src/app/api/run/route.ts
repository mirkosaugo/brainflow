import Anthropic from "@anthropic-ai/sdk";

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

export async function POST(request: Request) {
  try {
    const { inputs } = await request.json();

    if (!inputs || !Array.isArray(inputs) || inputs.length === 0) {
      return Response.json(
        { error: "No input provided" },
        { status: 400 }
      );
    }

    const userMessage = inputs.join("\n\n");

    const message = await anthropic.messages.create({
      model: "claude-sonnet-4-20250514",
      max_tokens: 1024,
      messages: [
        {
          role: "user",
          content: `You are a creative assistant for an artist. Analyze the following content from their brainstorming board and synthesize a creative output that connects them coherently. Provide insights, connections between concepts, and suggestions to develop the artistic project.\n\nBoard content:\n\n${userMessage}`,
        },
      ],
    });

    const textBlock = message.content.find((b) => b.type === "text");
    const result = textBlock ? textBlock.text : "No result generated";

    return Response.json({ result });
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
    console.error("Run API error:", errorMessage);
    return Response.json({ error: errorMessage }, { status: 500 });
  }
}
