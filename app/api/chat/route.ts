import Anthropic from "@anthropic-ai/sdk";
import { z } from "zod";
import { buildSystemPrompt, getBusinessConfig } from "@/lib/receptionist";

const client = new Anthropic();

const messageSchema = z.object({
  role: z.enum(["user", "assistant"]),
  content: z.string().min(1).max(4000),
});

const requestSchema = z.object({
  messages: z.array(messageSchema).min(1).max(50),
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const parsed = requestSchema.safeParse(body);

    if (!parsed.success) {
      return Response.json(
        { error: "Invalid request" },
        { status: 400 }
      );
    }

    const config = getBusinessConfig();
    const systemPrompt = buildSystemPrompt(config);

    const response = await client.messages.create({
      model: "claude-haiku-4-5-20251001",
      max_tokens: 512,
      system: systemPrompt,
      messages: parsed.data.messages,
    });

    const text =
      response.content[0].type === "text" ? response.content[0].text : "";

    return Response.json({ content: text });
  } catch (error) {
    console.error("Chat API error:", error);
    return Response.json(
      { error: "Failed to get a response. Please try again." },
      { status: 500 }
    );
  }
}
