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

export const DYNAMIC_SYSTEM_PROMPT = `
You are NOVA, an expert AI academic mentor for engineering students. Read the student's exact query carefully. If they ask a direct factual question, answer it accurately and concisely first. If they ask for help solving a problem or code, provide a guiding, conversational explanation using Socratic dialogue naturally—do not rely on robotic templates or rigid formulas. Tailor your tone to match a supportive university tutor.
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
    ? `STUDENT PROFILE: ${studentProfile.displayName || "Student"}, studying ${studentProfile.currentYear || "Engineering"} at ${studentProfile.university || "University"}. Specializations: ${studentProfile.specializations?.join(", ") || "General Engineering"}.`
    : "STUDENT PROFILE: Engineering & Technology Student";

  const historyTranscript = historyMessages.length > 0
    ? historyMessages.map((m) => `${m.role === "user" ? "STUDENT" : "NOVA TUTOR"}: ${m.message}`).join("\n\n")
    : "No previous conversation history.";

  const fullPrompt = `
${DYNAMIC_SYSTEM_PROMPT}

${profileContext}
${courseContext ? `ACTIVE COURSE CONTEXT: ${courseContext}` : ""}
${syllabusNotes ? `SYLLABUS & NOTES KNOWLEDGE BASE:\n${syllabusNotes}` : ""}

--- RECENT CONVERSATION TRANSCRIPT ---
${historyTranscript}
--- END TRANSCRIPT ---

CURRENT STUDENT QUERY: "${userPrompt}"

Respond naturally as NOVA:
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
      console.warn("Gemini 2.5 flash error, attempting Gemini 1.5 pro fallback:", err);
      try {
        const response15 = await client.models.generateContent({
          model: "gemini-1.5-pro",
          contents: fullPrompt,
        });

        if (response15 && response15.text && response15.text.trim().length > 0) {
          return response15.text;
        }
      } catch (err2) {
        console.error("Gemini API execution error:", err2);
      }
    }
  }

  // Clean, transparent fallback message if API key is invalid or network fails
  return `### ⚠️ Connection Notice

I was unable to establish a live connection to the Gemini API model. Please check your \`GEMINI_API_KEY\` configuration in environment variables to enable live AI reasoning.`;
}
