"use client";

import React from "react";
import { GlassCard } from "@/components/ui/GlassCard";
import { Course } from "@/types";
import { BookOpen, ArrowUpRight, CheckCircle, Sparkles } from "lucide-react";
import Link from "next/link";

interface CourseWithProgress extends Course {
  progress: number;
  activeTasks: number;
}

const COURSES: CourseWithProgress[] = [
  {
    id: "c1",
    code: "CS 301",
    name: "Data Structures & Algorithms",
    color: "#7C3AED",
    progress: 78,
    activeTasks: 3,
  },
  {
    id: "c2",
    code: "PHYS 202",
    name: "Quantum Wave Mechanics",
    color: "#3B82F6",
    progress: 65,
    activeTasks: 2,
  },
  {
    id: "c3",
    code: "MATH 240",
    name: "Linear Algebra & Vector Spaces",
    color: "#10B981",
    progress: 88,
    activeTasks: 1,
  },
  {
    id: "c4",
    code: "AI 410",
    name: "Machine Learning Foundations",
    color: "#F59E0B",
    progress: 92,
    activeTasks: 1,
  },
];

export function CourseProgressCard() {
  return (
    <GlassCard className="p-6 col-span-1 lg:col-span-2 flex flex-col justify-between" glowColor="blue">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-400">
            <BookOpen className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-white tracking-tight">Active Enrolled Courses</h2>
            <p className="text-xs text-zinc-400">Syllabus mastery & progress tracking</p>
          </div>
        </div>

        <Link
          href="/brain"
          className="text-xs font-semibold text-purple-400 hover:text-purple-300 flex items-center gap-1 transition-colors"
        >
          View Knowledge Base
          <ArrowUpRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-2">
        {COURSES.map((course) => (
          <div
            key={course.id}
            className="p-3.5 rounded-xl bg-white/[0.02] border border-white/10 hover:border-white/20 transition-all duration-200"
          >
            <div className="flex items-center justify-between mb-2">
              <span
                className="px-2 py-0.5 rounded text-[10px] font-bold"
                style={{
                  backgroundColor: `${course.color}20`,
                  color: course.color,
                  border: `1px solid ${course.color}40`,
                }}
              >
                {course.code}
              </span>
              <span className="text-xs font-mono font-bold text-zinc-300">
                {course.progress}%
              </span>
            </div>

            <h3 className="text-xs font-semibold text-white truncate mb-2">
              {course.name}
            </h3>

            {/* Progress Bar */}
            <div className="w-full bg-white/10 h-1.5 rounded-full overflow-hidden mb-2">
              <div
                className="h-full rounded-full transition-all duration-500"
                style={{
                  width: `${course.progress}%`,
                  backgroundColor: course.color,
                  boxShadow: `0 0 10px ${course.color}`,
                }}
              />
            </div>

            <div className="flex items-center justify-between text-[10px] text-zinc-400">
              <span>{course.activeTasks} pending tasks</span>
              <Link
                href={`/tutor?course=${course.id}`}
                className="text-purple-400 hover:underline flex items-center gap-0.5"
              >
                <Sparkles className="w-2.5 h-2.5" />
                Ask AI Tutor
              </Link>
            </div>
          </div>
        ))}
      </div>
    </GlassCard>
  );
}
