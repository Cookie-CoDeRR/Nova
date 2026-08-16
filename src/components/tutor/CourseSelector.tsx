"use client";

import React from "react";
import { BookOpen, Sparkles, Check } from "lucide-react";
import { cn } from "@/lib/utils";

export interface CourseOption {
  id: string;
  code: string;
  name: string;
  color: string;
}

export const SAMPLE_COURSES: CourseOption[] = [
  { id: "all", code: "ALL", name: "All Enrolled Courses Context", color: "#A855F7" },
  { id: "c1", code: "CS 301", name: "Data Structures & Algorithms", color: "#7C3AED" },
  { id: "c2", code: "PHYS 202", name: "Quantum Physics", color: "#3B82F6" },
  { id: "c3", code: "MATH 240", name: "Linear Algebra", color: "#10B981" },
  { id: "c4", code: "AI 410", name: "Machine Learning", color: "#F59E0B" },
];

interface CourseSelectorProps {
  selectedCourseId: string;
  onSelectCourse: (id: string) => void;
}

export function CourseSelector({ selectedCourseId, onSelectCourse }: CourseSelectorProps) {
  const current = SAMPLE_COURSES.find((c) => c.id === selectedCourseId) || SAMPLE_COURSES[0];

  return (
    <div className="flex items-center gap-2">
      <span className="text-xs font-semibold text-zinc-400 hidden sm:inline">Active Context:</span>
      <div className="relative group">
        <select
          value={selectedCourseId}
          onChange={(e) => onSelectCourse(e.target.value)}
          className="appearance-none bg-white/5 border border-white/10 hover:border-purple-500/40 text-xs font-semibold text-white px-3.5 py-1.5 pr-8 rounded-full cursor-pointer focus:outline-none focus:ring-2 focus:ring-purple-500/40 transition-all"
        >
          {SAMPLE_COURSES.map((course) => (
            <option key={course.id} value={course.id} className="bg-zinc-950 text-white">
              {course.code === "ALL" ? "🌐 All Courses" : `📚 ${course.code} - ${course.name}`}
            </option>
          ))}
        </select>
        <div className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-zinc-400">
          <BookOpen className="w-3.5 h-3.5" />
        </div>
      </div>
    </div>
  );
}
