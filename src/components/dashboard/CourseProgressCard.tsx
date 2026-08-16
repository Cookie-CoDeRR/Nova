"use client";

import React from "react";
import { GlassCard } from "@/components/ui/GlassCard";
import { Course } from "@/types";
import { BookOpen, Sparkles, ChevronRight } from "lucide-react";
import Link from "next/link";

const COURSES: Course[] = [
  {
    id: "c1",
    code: "CS 301",
    name: "Data Structures & Algorithms",
    color: "#7C3AED",
    progress: 75,
  },
  {
    id: "c2",
    code: "PHYS 202",
    name: "Quantum Physics & Mechanics",
    color: "#3B82F6",
    progress: 60,
  },
  {
    id: "c3",
    code: "MATH 240",
    name: "Linear Algebra & Matrix Methods",
    color: "#10B981",
    progress: 90,
  },
];

export function CourseProgressCard() {
  return (
    <GlassCard className="p-6 col-span-1 lg:col-span-2 flex flex-col justify-between" glowColor="blue">
      <div className="flex items-center justify-between mb-4 border-b border-neutral-100 pb-3">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-xl bg-blue-100 border border-blue-200 text-blue-800">
            <BookOpen className="w-5 h-5" />
          </div>
          <div>
            <h2 className="font-serif text-base font-bold text-neutral-950 tracking-tight">Active Course Mastery</h2>
            <p className="text-xs text-neutral-500">Syllabus progression & AI tutor memory status</p>
          </div>
        </div>

        <Link
          href="/brain"
          className="text-xs font-bold text-blue-700 hover:underline flex items-center gap-1"
        >
          <span>Syllabus Roadmaps</span>
          <ChevronRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      <div className="space-y-4 my-2">
        {COURSES.map((course) => (
          <div key={course.id} className="p-4 rounded-xl bg-neutral-50 border border-neutral-200 space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-white text-neutral-900 border border-neutral-200">
                  {course.code}
                </span>
                <span className="text-xs font-bold text-neutral-950">{course.name}</span>
              </div>
              <span className="text-xs font-mono font-bold text-neutral-700">{course.progress}% Mastered</span>
            </div>

            <div className="w-full h-2 bg-neutral-200 rounded-full overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-1000"
                style={{ width: `${course.progress}%`, backgroundColor: course.color }}
              />
            </div>
          </div>
        ))}
      </div>
    </GlassCard>
  );
}
