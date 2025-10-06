import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

type Message = {
  sender: "ai" | "user";
  text: string;
};

type RequestBody = {
  messages: Message[];
  character: string;
};

export async function POST(req: Request) {
  try {
    const { messages, character } = (await req.json()) as RequestBody;

    // system prompt ثابت لتحديد شخصية PirateBot
    const recentMessages = messages.slice(-10);
    const contents = [
      {
        text: `You are a ${character} chatbot. Speak like a ${character}. 
                Do NOT start any reply with greetings like "Hi", "Hello", "Ahoy", etc., 
                and do NOT repeat sentences from previous messages.`,
        author: "system",
      },
      ...recentMessages.map((msg) => ({
        text: msg.text,
        author: msg.sender === "ai" ? "assistant" : "user",
      })),
    ];

    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash",
      contents,
    });

    const aiReply = response.text || "⚠️ No reply";

    return Response.json({ reply: aiReply });
  } catch (error: unknown) {
    console.error("Google AI Error:", error);
    return Response.json(
      {
        reply: `⚠️ Something went wrong: ${
          error instanceof Error ? error.message : String(error)
        }`,
      },
      { status: 500 }
    );
  }
}
