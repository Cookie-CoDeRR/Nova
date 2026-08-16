export type Urgency = "HIGH" | "MEDIUM" | "LOW";

export interface Student {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  gpa: number;
  streak: number;
}

export interface Course {
  id: string;
  code: string;
  name: string;
  professor?: string;
  color: string;
}

export interface Assignment {
  id: string;
  title: string;
  description?: string;
  dueDate: string; // ISO string
  urgency: Urgency;
  completed: boolean;
  courseId: string;
  course?: Course;
}

export interface Note {
  id: string;
  title: string;
  content: string;
  type: "SYLLABUS" | "NOTE" | "SUMMARY";
  tags?: string;
  courseId: string;
  course?: Course;
  createdAt: string;
  updatedAt: string;
}

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  message: string;
  chips?: string;
  courseId?: string;
  timestamp: string;
}
