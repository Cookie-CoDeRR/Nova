import { NextResponse } from "next/server";
import { askSocraticTutor } from "@/lib/gemini";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { prompt, courseContext, history } = body;

    if (!prompt) {
      return NextResponse.json({ error: "Prompt is required" }, { status: 400 });
    }

    const reply = await askSocraticTutor(prompt, courseContext, undefined, history || []);

    return NextResponse.json({ reply });
  } catch (error) {
    console.error("Error in /api/tutor route:", error);
    return NextResponse.json(
      { error: "Failed to generate tutor response" },
      { status: 500 }
    );
  }
}
