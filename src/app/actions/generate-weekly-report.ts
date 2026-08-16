"use server";

import { GoogleGenAI } from "@google/genai";

export async function generateWeeklyReportAction(stats: {
  totalHours: number;
  streak: number;
  completedMilestones: number;
  totalMilestones: number;
  topSubject: string;
}): Promise<{ success: boolean; report?: string; error?: string }> {
  const apiKey = process.env.GEMINI_API_KEY;

  const SYSTEM_PROMPT = `You are NOVA, an elite academic AI coach. 
Generate a concise, highly encouraging, and actionable weekly progress report for a university student.
Focus on celebrating their study streak, highlight their mastery in their top subject, and offer 1 key Socratic tip for next week.
Format the output in clean markdown with bullet points.`;

  const userStatsContext = `
Student Activity Summary This Week:
- Total Focused Study Hours: ${stats.totalHours} hrs
- Current Study Streak: ${stats.streak} consecutive days
- Syllabus Milestones Completed: ${stats.completedMilestones} / ${stats.totalMilestones} (${Math.round((stats.completedMilestones / stats.totalMilestones) * 100)}%)
- Top Active Subject: ${stats.topSubject}
`;

  if (apiKey && apiKey.trim() !== "") {
    try {
      const ai = new GoogleGenAI({ apiKey });
      const response = await ai.models.generateContent({
        model: "gemini-1.5-pro",
        contents: `${SYSTEM_PROMPT}\n\n${userStatsContext}`,
      });

      if (response && response.text) {
        return { success: true, report: response.text };
      }
    } catch (err) {
      console.warn("Gemini API weekly report generation failed, using fallback synthesizer:", err);
    }
  }

  // Smart fallback weekly report synthesizer
  const fallbackReport = `### 🌟 Weekly Academic Digest

Great work this week, Alex! Here is your performance overview:

- **Focus Mastery**: You logged **${stats.totalHours} hours of deep work**, with your heaviest concentration in **${stats.topSubject}**.
- **Consistency**: Maintained a **${stats.streak}-day active study streak**!
- **Milestone Momentum**: You have conquered **${stats.completedMilestones} of ${stats.totalMilestones} syllabus milestones** (${Math.round((stats.completedMilestones / stats.totalMilestones) * 100)}%).

#### 💡 Socratic Advice for Next Week:
> *"Before starting your next Red-Black Tree rotation problem set, spend 5 minutes drawing out the black-height invariant on paper. It will double your derivation speed!"*`;

  return { success: true, report: fallbackReport };
}
