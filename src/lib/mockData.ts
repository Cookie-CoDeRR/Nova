import { StudentProfile } from "@/lib/userProfile";

export interface HeatmapDay {
  date: string;
  level: 0 | 1 | 2 | 3 | 4;
  hoursFocused: number;
  subject: string;
  summary: string;
  topicsCovered: string[];
  questionsSolved: number;
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

// Topics per subject for richer day detail
const SUBJECT_TOPICS: Record<string, string[]> = {
  "Data Structures": ["Big-O Analysis", "Binary Trees", "Dynamic Programming", "Graph BFS/DFS", "Hash Maps", "Heaps", "Tries"],
  "Quantum Physics": ["Wave Functions", "Schrödinger Eq.", "Hilbert Space", "Quantum Gates", "Entanglement", "Tunneling"],
  "Linear Algebra": ["Eigenvalues", "Matrix Decomp.", "Vector Spaces", "Orthogonality", "SVD", "Projections"],
  "Machine Learning": ["Gradient Descent", "Backpropagation", "CNNs", "Attention", "Regularization", "Loss Functions"],
};

// Generate 12-week (84 days) heatmap data for New User (empty) or Demo User
export function generateMockHeatmapData(isEmpty: boolean = false): HeatmapDay[] {
  const days: HeatmapDay[] = [];
  const subjects = ["Data Structures", "Quantum Physics", "Linear Algebra", "Machine Learning"];
  const now = new Date();

  for (let i = 83; i >= 0; i--) {
    const d = new Date(now);
    d.setDate(d.getDate() - i);
    const dateStr = d.toISOString().split("T")[0];

    if (isEmpty) {
      days.push({
        date: dateStr,
        level: 0,
        hoursFocused: 0,
        subject: "No Session",
        summary: "No study sessions logged for this day",
        topicsCovered: [],
        questionsSolved: 0,
      });
    } else {
      const dayOfWeek = d.getDay();
      let level: 0 | 1 | 2 | 3 | 4 = (i % 5) as any;
      if (dayOfWeek === 0 || dayOfWeek === 6) level = Math.min(level, 2) as any;

      const subject = subjects[i % subjects.length];
      const hoursFocused = level === 0 ? 0 : Number((level * 0.8 + 0.5).toFixed(1));
      const allTopics = SUBJECT_TOPICS[subject] ?? [];
      const topicCount = level === 0 ? 0 : Math.min(level + 1, allTopics.length);
      const topicsCovered = allTopics.slice(i % Math.max(allTopics.length - topicCount, 1), (i % Math.max(allTopics.length - topicCount, 1)) + topicCount);
      const questionsSolved = level === 0 ? 0 : level * 3 + (i % 4);

      days.push({
        date: dateStr,
        level,
        hoursFocused,
        subject,
        summary: hoursFocused > 0 ? `${hoursFocused} hours focused on ${subject}` : "No study sessions logged",
        topicsCovered,
        questionsSolved,
      });
    }
  }

  return days;
}

export const MOCK_SUBJECT_BREAKDOWN_FULL: SubjectBreakdown[] = [
  { name: "Data Structures", value: 35, color: "#8B5CF6", hours: 14.5 },
  { name: "Quantum Physics", value: 30, color: "#3B82F6", hours: 12.0 },
  { name: "Linear Algebra", value: 20, color: "#10B981", hours: 8.5 },
  { name: "Machine Learning", value: 15, color: "#F59E0B", hours: 6.0 },
];

export const MOCK_SUBJECT_BREAKDOWN_EMPTY: SubjectBreakdown[] = [
  { name: "Data Structures", value: 0, color: "#8B5CF6", hours: 0 },
  { name: "Quantum Physics", value: 0, color: "#3B82F6", hours: 0 },
  { name: "Linear Algebra", value: 0, color: "#10B981", hours: 0 },
  { name: "Machine Learning", value: 0, color: "#F59E0B", hours: 0 },
];
