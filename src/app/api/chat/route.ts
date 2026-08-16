import { NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";

function getApiKey(): string {
  if (process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY.trim() !== "") {
    return process.env.GEMINI_API_KEY;
  }
  if (process.env.NEXT_PUBLIC_GEMINI_API_KEY && process.env.NEXT_PUBLIC_GEMINI_API_KEY.trim() !== "") {
    return process.env.NEXT_PUBLIC_GEMINI_API_KEY;
  }
  return "AIzaSyD6RcjmmQ86P-zdOpuTzkDRyihCFSz4vys";
}

const DYNAMIC_SYSTEM_PROMPT = `You are NOVA, an expert AI academic mentor for engineering students. Read the student's exact query carefully. If they ask a direct factual question, answer it accurately and concisely first. If they ask for help solving a problem or code, provide a guiding, conversational explanation using Socratic dialogue naturally—do not rely on robotic templates or rigid formulas. Tailor your tone to match a supportive university tutor.`;

export async function POST(req: Request) {
  try {
    const apiKey = getApiKey();
    const body = await req.json();
    const { messages, prompt, courseContext, studentProfile } = body;

    const userQuery = prompt || (messages && messages.length > 0 ? messages[messages.length - 1].content : "");

    if (!userQuery) {
      return NextResponse.json({ error: "Message content or prompt is required" }, { status: 400 });
    }

    const profileContext = studentProfile
      ? `STUDENT PROFILE: ${studentProfile.displayName || "Student"}, ${studentProfile.currentYear || "Engineering"} at ${studentProfile.university || "University"}.`
      : "";

    let formattedHistory = "";
    if (messages && messages.length > 1) {
      formattedHistory = messages
        .slice(-8, -1)
        .map((m: any) => `${m.role.toUpperCase()}: ${m.content || m.message}`)
        .join("\n");
    }

    const fullPrompt = `${DYNAMIC_SYSTEM_PROMPT}

${profileContext}
${courseContext ? `Course Context: ${courseContext}` : ""}
${formattedHistory ? `Previous Messages:\n${formattedHistory}\n` : ""}
Student Query: "${userQuery}"`;

    if (!apiKey) {
      return NextResponse.json({ error: "GEMINI_API_KEY is missing." }, { status: 500 });
    }

    const ai = new GoogleGenAI({ apiKey });

    try {
      const responseStream = await ai.models.generateContentStream({
        model: "gemini-2.5-flash",
        contents: fullPrompt,
      });

      const stream = new ReadableStream({
        async start(controller) {
          const encoder = new TextEncoder();
          try {
            for await (const chunk of responseStream) {
              if (chunk.text) {
                controller.enqueue(encoder.encode(chunk.text));
              }
            }
          } catch (streamErr) {
            console.error("Streaming chunk error:", streamErr);
          } finally {
            controller.close();
          }
        },
      });

      return new Response(stream, {
        headers: {
          "Content-Type": "text/event-stream; charset=utf-8",
          "Cache-Control": "no-cache, no-transform",
          "Connection": "keep-alive",
        },
      });
    } catch (geminiError) {
      console.warn("Gemini 2.5 stream failed, attempting Gemini 1.5 pro:", geminiError);
      
      const responseStream15 = await ai.models.generateContentStream({
        model: "gemini-1.5-pro",
        contents: fullPrompt,
      });

      const stream = new ReadableStream({
        async start(controller) {
          const encoder = new TextEncoder();
          try {
            for await (const chunk of responseStream15) {
              if (chunk.text) {
                controller.enqueue(encoder.encode(chunk.text));
              }
            }
          } catch (err) {
            console.error("1.5 Pro Stream error:", err);
          } finally {
            controller.close();
          }
        },
      });

      return new Response(stream, {
        headers: {
          "Content-Type": "text/event-stream; charset=utf-8",
          "Cache-Control": "no-cache",
        },
      });
    }
  } catch (error) {
    console.error("Error in /api/chat route:", error);
    return NextResponse.json({ error: "Failed to process tutor chat stream" }, { status: 500 });
  }
}
