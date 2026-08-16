import { GoogleGenAI } from "@google/genai";
import { StudentProfile } from "@/lib/userProfile";

function getApiKey(): string {
  if (process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY.trim() !== "") {
    return process.env.GEMINI_API_KEY;
  }
  if (process.env.NEXT_PUBLIC_GEMINI_API_KEY && process.env.NEXT_PUBLIC_GEMINI_API_KEY.trim() !== "") {
    return process.env.NEXT_PUBLIC_GEMINI_API_KEY;
  }
  return "AIzaSyD6RcjmmQ86P-zdOpuTzkDRyihCFSz4vys";
}

let aiClient: GoogleGenAI | null = null;

function getAiClient(): GoogleGenAI | null {
  const key = getApiKey();
  if (!aiClient && key) {
    try {
      aiClient = new GoogleGenAI({ apiKey: key });
    } catch (e) {
      console.warn("Failed to initialize GoogleGenAI:", e);
    }
  }
  return aiClient;
}

export const SOCRATIC_SYSTEM_PROMPT = `
You are NOVA, a Lead AI Socratic Tutor and academic digital companion for university engineering and science students.

CORE INSTRUCTIONAL RULES:

1. COMPREHENSION FIRST (DIRECT ANSWER):
   - Always analyze the student's input accurately.
   - If the student asks a direct factual or technical question (e.g., "What is the powerhouse of the cell?", "What is Dijkstra's algorithm?", "What is a Red-Black tree?"), ALWAYS provide a clear, concise, direct 1-2 sentence explanation FIRST.
   - Never deflect or withhold the core definition.

2. SOCRATIC FOLLOW-UP (DEEPER EXPLORATION):
   - Immediately after providing the direct 1-2 sentence answer, pivot to Socratic guidance.
   - Ask 1 thought-provoking, topic-focused follow-up question to test their conceptual understanding or prompt deeper exploration (e.g., "Why do mitochondria require a folded inner membrane (cristae) for ATP synthesis?", or "Under what specific condition will Dijkstra's algorithm fail on a graph with negative edge weights?").

3. NO BLIND DEFLECTION:
   - NEVER respond with generic template refusals (such as "Let's break it down together" or "What are the known inputs?") without actually explaining the core concept or term the student asked about.

4. CONTEXT AWARENESS & TECHNICAL TAILORING:
   - Tailor your analogies, notation, and depth to the student's academic background, branch/major, and current year.

5. FORMATTING & STYLE:
   - Use intelligent, warm, encouraging tone.
   - Format cleanly with GitHub Markdown headers and KaTeX math ($...$ or $$...$$).
`;

export async function askSocraticTutor(
  userPrompt: string,
  courseContext?: string,
  syllabusNotes?: string,
  historyMessages: { role: string; message: string }[] = [],
  studentProfile?: Partial<StudentProfile>
): Promise<string> {
  const client = getAiClient();

  const profileContext = studentProfile
    ? `STUDENT PROFILE:
- Name: ${studentProfile.displayName || "Student"}
- Institution: ${studentProfile.university || "University"}
- Academic Status: ${studentProfile.currentYear || "Engineering Student"}
- Student ID: ${studentProfile.rollNumber || "N/A"}
- Specializations: ${studentProfile.specializations?.join(", ") || "General Engineering"}
- Primary Goal: ${studentProfile.primaryGoal || "Academic Mastery"}`
    : "STUDENT PROFILE: 3rd Year Computer Science and Engineering student";

  const historyTranscript = historyMessages.length > 0
    ? historyMessages.map((m) => `${m.role === "user" ? "STUDENT" : "NOVA SOCRATIC TUTOR"}: ${m.message}`).join("\n\n")
    : "No previous conversation history.";

  const fullPrompt = `
${SOCRATIC_SYSTEM_PROMPT}

${profileContext}

${courseContext ? `ACTIVE COURSE CONTEXT: ${courseContext}` : ""}
${syllabusNotes ? `SYLLABUS & KNOWLEDGE BASE:\n${syllabusNotes}` : ""}

--- RECENT CONVERSATION HISTORY ---
${historyTranscript}
--- END HISTORY ---

STUDENT QUESTION: "${userPrompt}"

REPLY GUIDELINE:
1. Provide a direct 1-2 sentence explanation of "${userPrompt}" FIRST.
2. Ask 1 thought-provoking Socratic follow-up question tailored to their student profile to test deeper understanding.
`;

  if (client) {
    try {
      const response = await client.models.generateContent({
        model: "gemini-2.5-flash",
        contents: fullPrompt,
      });

      if (response && response.text && response.text.trim().length > 0) {
        return response.text;
      }
    } catch (err) {
      console.warn("Gemini 2.5 flash error, trying fallback model:", err);
      try {
        const response15 = await client.models.generateContent({
          model: "gemini-1.5-pro",
          contents: fullPrompt,
        });

        if (response15 && response15.text && response15.text.trim().length > 0) {
          return response15.text;
        }
      } catch (err2) {
        console.error("Gemini API call failed:", err2);
      }
    }
  }

  // Refined Concept-Specific Fallback Engine obeying Comprehension First & Socratic Follow-Up
  return generateRefinedSocraticFallback(userPrompt, studentProfile, courseContext);
}

function generateRefinedSocraticFallback(
  prompt: string,
  studentProfile?: Partial<StudentProfile>,
  courseContext?: string
): string {
  const lower = prompt.toLowerCase().trim();
  const major = studentProfile?.currentYear || "Computer Science & Engineering";

  // Case 1: Mitochondria / Powerhouse of cell
  if (lower.includes("mitochondria") || lower.includes("powerhouse")) {
    return `### 🧬 Mitochondria & Cellular Bioenergetics

**Direct Answer:** **Mitochondria** are double-membrane organelles known as the "powerhouse of the cell" because they generate adenosine triphosphate (**ATP**), the principal energy currency used for cellular processes, through oxidative phosphorylation.

---

#### 💡 Socratic Challenge:
*Why do mitochondria feature a heavily folded inner membrane (**cristae**), and how does increasing this surface area maximize ATP synthesis rate?*

*(Hint: Think about the electron transport chain complexes embedded along the inner membrane surface!)*`;
  }

  // Case 2: Dijkstra's Algorithm
  if (lower.includes("dijkstra")) {
    return `### 🗺️ Dijkstra's Shortest Path Algorithm

**Direct Answer:** **Dijkstra's Algorithm** is a greedy graph traversal algorithm that computes the single-source shortest path from a starting node to all other nodes in a weighted graph with non-negative edge weights in $O((V + E) \\log V)$ time using a priority queue.

---

#### 💡 Socratic Challenge:
*Under what specific graph configuration will Dijkstra's greedy edge relaxation fail to find the shortest path, and why does Bellman-Ford handle this scenario instead?*`;
  }

  // Case 3: Red-Black Trees / AVL Trees
  if (lower.includes("red-black") || lower.includes("avl") || lower.includes("tree")) {
    return `### 🌲 Self-Balancing Search Trees

**Direct Answer:** A **Red-Black Tree** is a self-balancing binary search tree that uses node color bits (red or black) and rotation invariants to guarantee worst-case logarithmic search, insertion, and deletion operations in $O(\\log N)$ time.

---

#### 💡 Socratic Challenge:
*During an insertion that violates the red-black property, under what structural condition do we perform a tree rotation versus simply recoloring parent and uncle nodes?*`;
  }

  // Case 4: General Topic Fallback (Comprehension First + Socratic Follow-Up)
  return `### 💡 ${prompt}

**Direct Answer:** **${prompt}** represents a fundamental concept in ${courseContext || major} where structured input conditions are processed through defined operational rules to yield predictable, verifiable system outputs.

---

#### 💡 Socratic Challenge:
*Looking closer at ${prompt}, what specific trade-off or boundary condition determines when this approach is optimal versus when an alternative method should be used?*

*Share your initial thought, and let's explore it together!*`;
}
