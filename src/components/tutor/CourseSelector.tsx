"use client";

import React from "react";
import { BookOpen } from "lucide-react";

export interface CourseOption {
  id: string;
  code: string;
  name: string;
  color: string;
}

export const SAMPLE_COURSES: CourseOption[] = [
  { id: "all", code: "ALL", name: "All Courses", color: "#6B7280" },
  { id: "c1", code: "CS 301", name: "Data Structures & Algorithms", color: "#7C3AED" },
  { id: "c2", code: "PHYS 202", name: "Quantum Mechanics", color: "#3B82F6" },
  { id: "c3", code: "MATH 240", name: "Linear Algebra", color: "#10B981" },
];

interface CourseSelectorProps {
  selectedCourseId: string;
  onSelectCourse: (courseId: string) => void;
}

export function CourseSelector({ selectedCourseId, onSelectCourse }: CourseSelectorProps) {
  return (
    <div className="flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-xl px-3 py-1.5 text-xs">
      <BookOpen className="w-3.5 h-3.5 text-purple-700" />
      <select
        value={selectedCourseId}
        onChange={(e) => onSelectCourse(e.target.value)}
        className="bg-transparent text-gray-900 font-bold focus:outline-none cursor-pointer"
      >
        {SAMPLE_COURSES.map((course) => (
          <option key={course.id} value={course.id} className="bg-white text-gray-900 font-medium">
            {course.code} - {course.name}
          </option>
        ))}
      </select>
    </div>
  );
}
