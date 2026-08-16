import { GoogleGenAI } from "@google/genai";

const apiKey = process.env.GEMINI_API_KEY;

let aiClient: GoogleGenAI | null = null;
if (apiKey && apiKey.trim() !== "") {
  try {
    aiClient = new GoogleGenAI({ apiKey });
  } catch (e) {
    console.warn("Failed to initialize GoogleGenAI with provided key:", e);
  }
}

export const SOCRATIC_SYSTEM_PROMPT = `
You are NOVA, an elite AI Personal Socratic Tutor and academic digital companion for university students.
Your core teaching directive:
1. NEVER directly dump full solutions or answers immediately when a student asks for help on a problem or concept.
2. Guide the student step-by-step using targeted, encouraging Socratic questions.
3. Break down complex concepts into bite-sized intuitive steps. Ask them to verify or solve the next micro-step.
4. When student selects a quick-action chip (e.g. "Explain this concept", "Quiz me on Chapter 4", "Summarize my notes"), tailor your response accordingly:
   - For "Explain this concept": Use an intuitive real-world analogy first, then ask them a quick check-for-understanding question.
   - For "Quiz me": Ask 1 interactive multiple-choice or short-answer question at a time and wait for their response.
   - For "Summarize my notes": Provide high-level key takeaways with bullet points and highlight 3 core formulas/terms to remember.
5. Keep your tone encouraging, highly intelligent, ultra-clear, concise, and structured with clean markdown.
`;

export async function askSocraticTutor(
  userPrompt: string,
  courseContext?: string,
  syllabusNotes?: string,
  historyMessages: { role: string; message: string }[] = []
): Promise<string> {
  const fullContext = `
${SOCRATIC_SYSTEM_PROMPT}

${courseContext ? `ACTIVE COURSE CONTEXT: ${courseContext}` : ""}
${syllabusNotes ? `COURSE SYLLABUS & NOTES KNOWLEDGE BASE:\n${syllabusNotes}` : ""}

Previous Conversation:
${historyMessages.map((m) => `${m.role.toUpperCase()}: ${m.message}`).join("\n")}

Student Prompt: ${userPrompt}
`;

  if (aiClient) {
    try {
      const response = await aiClient.models.generateContent({
        model: "gemini-1.5-pro",
        contents: fullContext,
      });

      if (response && response.text) {
        return response.text;
      }
    } catch (err) {
      console.error("Gemini API Error, using intelligent Socratic fallback:", err);
    }
  }

  // Smart Socratic Tutor Fallback Engine if API key is not present or calls fail
  return generateSocraticFallbackResponse(userPrompt, courseContext);
}

function generateSocraticFallbackResponse(prompt: string, courseContext?: string): string {
  const lower = prompt.toLowerCase();
  
  if (lower.includes("quiz")) {
    return `### 🧠 Quick Socratic Check (${courseContext || "General Study"})

Let's test your understanding with a targeted concept check:

**Question:** Which of the following best describes the main trade-off between a balanced Binary Search Tree (AVL/Red-Black) and a standard Hash Table?

- **A)** Hash tables provide $O(\log N)$ search, while BSTs guarantee $O(1)$ operations.
- **B)** Hash tables provide average $O(1)$ lookup but lose key ordering; BSTs maintain sorted key order with $O(\log N)$ worst-case lookup.
- **C)** BSTs require $O(N^2)$ memory storage compared to hash tables.
- **D)** Hash tables automatically balance themselves during sequential insertion.

*Take a shot at answering A, B, C, or D — and briefly explain why you chose it!*`;
  }

  if (lower.includes("summarize")) {
    return `### 📑 Key Takeaways & Core Concepts (${courseContext || "Course Overview"})

Here is the high-level breakdown of your core study material:

1. **Foundational Pillar**: Focus on the core axioms and boundary conditions before tackling complex derivations.
2. **Key Time & Space Complexities**:
   - Access: $O(1)$ average
   - Search & Insertion: $O(\log N)$ tree structures vs $O(N)$ linear scans
3. **Core Formula to Remember**:
   $$\\text{Efficiency} = \\frac{\\text{Useful Work Output}}{\\text{Total Energy / Time Input}}$$

*Which of these 3 areas would you like to drill deeper into right now?*`;
  }

  if (lower.includes("explain")) {
    return `### 💡 Intuitive Breakdown

Think of this concept like a high-speed express library delivery system:

Instead of scanning every shelf from top to bottom (linear search $O(N)$), you have an indexed catalog system that immediately cuts the search space in half with every query ($O(\\log N)$).

To help reinforce this in your memory:
*If you had a list of 1,000,000 sorted elements, approximately how many comparisons do you think a binary search would take at maximum?* 

*(Hint: Think powers of 2!)*`;
  }

  return `### 🧙‍♂️ NOVA Socratic Guide

That's an excellent question to focus on in ${courseContext || "your studies"}. 

Before we jump directly into the mathematical derivation or final code execution, let's establish the key prerequisite:

1. What is the main objective or output we are aiming to achieve here?
2. What initial given values or constraints are we starting with?

*Share your thoughts on step 1, and we'll build the complete step-by-step solution together!*`;
}
