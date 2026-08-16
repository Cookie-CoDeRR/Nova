import { NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";

const apiKey = process.env.GEMINI_API_KEY;

const SOCRATIC_SYSTEM_PROMPT = `You are NOVA, an elite academic AI tutor. Your strict rule is NEVER to give the student the direct answer to a homework question or math problem. Instead, use the Socratic method. Ask leading questions, break the concept down into smaller fundamental principles, and guide the student to discover the answer themselves. Keep responses concise. Use markdown.`;

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { messages, prompt, courseContext } = body;

    // Determine the latest user input
    const userQuery = prompt || (messages && messages.length > 0 ? messages[messages.length - 1].content : "");

    if (!userQuery) {
      return NextResponse.json({ error: "Message content or prompt is required" }, { status: 400 });
    }

    // Build full conversation history for context
    let formattedHistory = "";
    if (messages && messages.length > 1) {
      formattedHistory = messages
        .slice(0, -1)
        .map((m: any) => `${m.role.toUpperCase()}: ${m.content}`)
        .join("\n");
    }

    const fullPrompt = `${SOCRATIC_SYSTEM_PROMPT}

${courseContext ? `Course Context: ${courseContext}` : ""}
${formattedHistory ? `Previous Messages:\n${formattedHistory}\n` : ""}
Student Question: ${userQuery}`;

    // If Gemini API Key is present, stream from GoogleGenAI
    if (apiKey && apiKey.trim() !== "") {
      try {
        const ai = new GoogleGenAI({ apiKey });
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
        console.warn("Gemini API stream failed, using Socratic fallback stream:", geminiError);
      }
    }

    // Fallback: Real-time Socratic Stream generator for seamless instant testing
    const fallbackText = getSocraticFallbackResponse(userQuery, courseContext);
    
    const encoder = new TextEncoder();
    const fallbackStream = new ReadableStream({
      async start(controller) {
        const words = fallbackText.split(" ");
        for (let i = 0; i < words.length; i++) {
          const chunk = (i === 0 ? "" : " ") + words[i];
          controller.enqueue(encoder.encode(chunk));
          // Micro-delay between tokens for fluid streaming visual effect
          await new Promise((res) => setTimeout(res, 25));
        }
        controller.close();
      },
    });

    return new Response(fallbackStream, {
      headers: {
        "Content-Type": "text/event-stream; charset=utf-8",
        "Cache-Control": "no-cache",
        "Connection": "keep-alive",
      },
    });
  } catch (error) {
    console.error("Error in /api/chat route:", error);
    return NextResponse.json({ error: "Failed to process tutor chat stream" }, { status: 500 });
  }
}

function getSocraticFallbackResponse(query: string, courseContext?: string): string {
  const lower = query.toLowerCase();

  if (lower.includes("explain") || lower.includes("simply")) {
    return `### 💡 Intuitive Breakdown

Let's start by imagining a real-world analogy:

Think of this concept like an **indexed library catalog** rather than reading every book cover-to-cover. 

Before we look at the mathematical equation:
- What is the main goal when searching through a sorted set of data?
- If you divide a set of 1,000 items in half repeatedly, about how many steps would it take to reach 1 item?

*What do you think is the fundamental trade-off here between search speed and memory setup?*`;
  }

  if (lower.includes("quiz")) {
    return `### 🧠 Socratic Quiz Challenge

Let's test your conceptual understanding! Here is your first question:

**Question:** Imagine you are implementing a balanced Binary Search Tree (like an AVL tree) vs. a Hash Table. 

- Under what specific scenario would a **Hash Table** fail to meet $O(1)$ lookup time and degrade to $O(N)$?

*Formulate your answer based on collision resolution or hash function quality, and explain why!*`;
  }

  if (lower.includes("summarize") || lower.includes("notes")) {
    return `### 📚 Socratic Summary Guide

Here are the key foundational principles from your course material:

1. **Primary Directive**: Never evaluate dynamic runtime before determining static space constraints.
2. **Core Relation**:
   $$\\text{Time Complexity} = O(f(n)) \\quad \\text{where } f(n) \\text{ represents the tight upper bound.}$$

*Which of these core concepts feels least clear right now? Tell me where you'd like to begin breaking it down!*`;
  }

  return `### 🎓 NOVA Socratic Guidance

That is a great question to explore! Rather than just giving you the final result, let's break it down together step-by-step:

1. What are the **known inputs** or fundamental laws that apply to this problem?
2. What is the first step you would take if you simplified the problem to its smallest possible case?

*Share your thoughts on step 1, and we will build up to the complete solution together!*`;
}
