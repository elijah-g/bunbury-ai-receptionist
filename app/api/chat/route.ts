import Anthropic from "@anthropic-ai/sdk";
import { z } from "zod";
import {
  buildSystemPrompt,
  extractLeadData,
  getBusinessConfig,
} from "@/lib/receptionist";

const client = new Anthropic();

const messageSchema = z.object({
  role: z.enum(["user", "assistant"]),
  content: z.string().min(1).max(4000),
});

// Max user turns per demo session — keeps API costs predictable
const SESSION_MESSAGE_LIMIT = 10;

const requestSchema = z.object({
  messages: z.array(messageSchema).min(1).max(100),
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const parsed = requestSchema.safeParse(body);

    if (!parsed.success) {
      return Response.json({ error: "Invalid request" }, { status: 400 });
    }

    // Count user turns — enforce session cap
    const userTurns = parsed.data.messages.filter((m) => m.role === "user").length;
    if (userTurns > SESSION_MESSAGE_LIMIT) {
      return Response.json(
        { error: "Demo session limit reached. Please refresh to start a new conversation." },
        { status: 429 }
      );
    }

    const config = getBusinessConfig();
    const systemPrompt = buildSystemPrompt(config);

    // Primary: get the AI receptionist reply
    const response = await client.messages.create({
      model: "claude-haiku-4-5-20251001",
      max_tokens: 512,
      system: systemPrompt,
      messages: parsed.data.messages,
    });

    const text =
      response.content[0].type === "text" ? response.content[0].text : "";

    // Build the full conversation transcript for lead extraction
    const transcript = parsed.data.messages
      .map((m) => `${m.role === "user" ? "Customer" : "Receptionist"}: ${m.content}`)
      .join("\n");

    // Secondary: extract lead data from the conversation so far
    let leadCaptured = false;
    let leadData = null;

    try {
      const extractionResponse = await client.messages.create({
        model: "claude-haiku-4-5-20251001",
        max_tokens: 256,
        messages: [
          {
            role: "user",
            content: `From this conversation, extract any lead information that has been clearly stated by the customer:
{ "name": "<customer name or null>", "contact": "<email or phone or null>", "enquiryType": "<type or null>" }
Conversation:
${transcript}
Respond ONLY with a JSON object, no explanation.`,
          },
        ],
      });

      const extractionText =
        extractionResponse.content[0].type === "text"
          ? extractionResponse.content[0].text.trim()
          : "";

      // Strip markdown code fences if present
      const jsonText = extractionText
        .replace(/^```(?:json)?\s*/i, "")
        .replace(/\s*```$/, "")
        .trim();

      const parsed2 = JSON.parse(jsonText);
      const extracted = extractLeadData(parsed2);
      leadCaptured = extracted.hasEnoughInfo;
      if (extracted.hasEnoughInfo) {
        leadData = {
          name: extracted.name,
          contact: extracted.contact,
          enquiryType: extracted.enquiryType,
        };
      }
    } catch {
      // Lead extraction is best-effort — don't fail the whole request
    }

    return Response.json({ content: text, leadCaptured, leadData });
  } catch (error) {
    console.error("Chat API error:", error);
    return Response.json(
      { error: "Failed to get a response. Please try again." },
      { status: 500 }
    );
  }
}
