"use client";

import React from "react";
import { GlassCard } from "@/components/ui/GlassCard";
import { Course } from "@/types";
import { GraduationCap, ArrowUpRight, CheckCircle2 } from "lucide-react";
import Link from "next/link";

interface CourseProgressCardProps {
  courses?: Course[];
}

const DEFAULT_COURSES: (Course & { progress: number; nextMilestone: string })[] = [
  {
    id: "c1",
    code: "CS 301",
    name: "Data Structures & Algorithms",
    color: "#7C3AED",
    progress: 75,
    nextMilestone: "Self-Balancing Red-Black Trees",
  },
  {
    id: "c2",
    code: "PHYS 202",
    name: "Quantum Mechanics",
    color: "#3B82F6",
    progress: 60,
    nextMilestone: "Harmonic Oscillator & Ladder Operators",
  },
  {
    id: "c3",
    code: "MATH 240",
    name: "Linear Algebra",
    color: "#10B981",
    progress: 90,
    nextMilestone: "Eigenvalue Matrix Diagonalization",
  },
];

export function CourseProgressCard({ courses = DEFAULT_COURSES }: CourseProgressCardProps) {
  return (
    <GlassCard className="p-6 col-span-1 flex flex-col justify-between" glowColor="purple">
      <div>
        <div className="flex items-center justify-between border-b border-gray-100 pb-3 mb-4">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-purple-50 border border-purple-200 text-purple-800">
              <GraduationCap className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-serif text-base font-bold text-gray-900 tracking-tight">Active Course Mastery</h2>
              <p className="text-xs text-gray-500">Syllabus Milestones Completed</p>
            </div>
          </div>

          <Link
            href="/brain"
            className="text-xs font-bold text-purple-800 hover:underline flex items-center gap-0.5"
          >
            <span>Roadmap</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="space-y-3">
          {DEFAULT_COURSES.map((course) => (
            <div key={course.id} className="p-4 rounded-xl bg-gray-50 border border-gray-200 space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-white text-gray-900 border border-gray-200">
                    {course.code}
                  </span>
                  <span className="text-xs font-bold text-gray-900 truncate max-w-[140px] sm:max-w-[180px]">
                    {course.name}
                  </span>
                </div>
                <span className="text-xs font-mono font-bold text-gray-700">{course.progress}%</span>
              </div>

              <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-700"
                  style={{ width: `${course.progress}%`, backgroundColor: course.color }}
                />
              </div>

              <div className="flex items-center justify-between text-[11px] text-gray-500 pt-0.5">
                <span className="truncate">Next: {course.nextMilestone}</span>
                <CheckCircle2 className="w-3.5 h-3.5 text-gray-400 shrink-0" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </GlassCard>
  );
}
