export interface HeatmapDay {
  date: string;
  level: 0 | 1 | 2 | 3 | 4;
  hoursFocused: number;
  subject: string;
  summary: string;
}

export interface SubjectBreakdown {
  name: string;
  value: number;
  color: string;
  hours: number;
}

export interface MilestoneProgressData {
  completed: number;
  total: number;
  percentage: number;
  activeCourse: string;
}

// Generate realistic 12-week (84 days) heatmap data
export function generateMockHeatmapData(): HeatmapDay[] {
  const days: HeatmapDay[] = [];
  const subjects = ["Data Structures", "Quantum Physics", "Linear Algebra", "Machine Learning"];
  const now = new Date();

  for (let i = 83; i >= 0; i--) {
    const d = new Date(now);
    d.setDate(d.getDate() - i);
    const dateStr = d.toISOString().split("T")[0];

    // Seeded pseudo-random activity level
    const dayOfWeek = d.getDay();
    let level: 0 | 1 | 2 | 3 | 4 = (i % 5) as any;
    if (dayOfWeek === 0 || dayOfWeek === 6) level = Math.min(level, 2) as any; // weekend lighter

    const subject = subjects[i % subjects.length];
    const hoursFocused = level === 0 ? 0 : Number((level * 0.8 + 0.5).toFixed(1));

    days.push({
      date: dateStr,
      level,
      hoursFocused,
      subject,
      summary: hoursFocused > 0 ? `${hoursFocused} hours focused on ${subject}` : "No study sessions logged",
    });
  }

  return days;
}

export const MOCK_SUBJECT_BREAKDOWN: SubjectBreakdown[] = [
  { name: "Data Structures", value: 35, color: "#8B5CF6", hours: 14.5 },
  { name: "Quantum Physics", value: 30, color: "#3B82F6", hours: 12.0 },
  { name: "Linear Algebra", value: 20, color: "#10B981", hours: 8.5 },
  { name: "Machine Learning", value: 15, color: "#F59E0B", hours: 6.0 },
];

export const MOCK_MILESTONE_PROGRESS: MilestoneProgressData = {
  completed: 12,
  total: 16,
  percentage: 75,
  activeCourse: "CS 301 Data Structures & Algorithms",
};

export const MOCK_ANALYTICS_SUMMARY = {
  totalFocusHours: 41.0,
  weeklyStreak: 12,
  socraticQuestionsAsked: 48,
  avgAccuracy: 92,
};
