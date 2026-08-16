"use client";

import React, { useState } from "react";
import { GlassCard } from "@/components/ui/GlassCard";
import { Assignment } from "@/types";
import { Calendar, CheckCircle2, Clock, AlertTriangle, Filter } from "lucide-react";
import { cn, formatDate } from "@/lib/utils";

const SAMPLE_ASSIGNMENTS: Assignment[] = [
  {
    id: "a1",
    title: "Programming Assignment 3: Red-Black Tree Rotations",
    dueDate: new Date(Date.now() + 2 * 86400000).toISOString(),
    priority: "HIGH",
    completed: false,
    courseId: "c1",
    course: { id: "c1", code: "CS 301", name: "Data Structures & Algorithms", color: "#7C3AED" },
  },
  {
    id: "a2",
    title: "Quantum Physics Problem Set 5: Infinite Square Wells",
    dueDate: new Date(Date.now() + 4 * 86400000).toISOString(),
    priority: "MEDIUM",
    completed: false,
    courseId: "c2",
    course: { id: "c2", code: "PHYS 202", name: "Quantum Physics", color: "#3B82F6" },
  },
  {
    id: "a3",
    title: "Linear Algebra Exam 2 Study Guide Review",
    dueDate: new Date(Date.now() + 6 * 86400000).toISOString(),
    priority: "LOW",
    completed: false,
    courseId: "c3",
    course: { id: "c3", code: "MATH 240", name: "Linear Algebra", color: "#10B981" },
  },
];

export function UpcomingAssignments() {
  const [assignments, setAssignments] = useState<Assignment[]>(SAMPLE_ASSIGNMENTS);
  const [filterPriority, setFilterPriority] = useState<string>("ALL");

  const toggleComplete = (id: string) => {
    setAssignments((prev) =>
      prev.map((a) => (a.id === id ? { ...a, completed: !a.completed } : a))
    );
  };

  const filteredAssignments = assignments.filter((a) => {
    if (filterPriority === "ALL") return true;
    return a.priority === filterPriority;
  });

  return (
    <GlassCard className="p-6 col-span-1 md:col-span-2 flex flex-col justify-between" glowColor="amber">
      <div>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-gray-100 pb-3 mb-4">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-amber-50 border border-amber-200 text-amber-800">
              <Calendar className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-serif text-base font-bold text-gray-900 tracking-tight">Urgent Deadlines</h2>
              <p className="text-xs text-gray-500">Upcoming course assignments & problem sets</p>
            </div>
          </div>

          <div className="flex items-center gap-1 p-1 rounded-xl bg-gray-50 border border-gray-200 text-xs">
            {["ALL", "HIGH", "MEDIUM", "LOW"].map((p) => (
              <button
                key={p}
                onClick={() => setFilterPriority(p)}
                className={cn(
                  "px-2.5 py-1 rounded-lg font-bold transition-all text-[11px]",
                  filterPriority === p
                    ? "bg-gray-900 text-white shadow-xs"
                    : "text-gray-600 hover:text-gray-900"
                )}
              >
                {p}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-3">
          {filteredAssignments.map((item) => {
            const isHigh = item.priority === "HIGH";
            const isMed = item.priority === "MEDIUM";

            return (
              <div
                key={item.id}
                onClick={() => toggleComplete(item.id)}
                className={cn(
                  "p-4 rounded-xl border transition-all duration-200 flex items-center justify-between gap-4 group bg-gray-50 shadow-2xs cursor-pointer",
                  item.completed ? "opacity-50 border-gray-200 bg-gray-100" : "border-gray-200 hover:border-gray-300"
                )}
              >
                <div className="flex items-center gap-3">
                  <button
                    className={cn(
                      "w-5 h-5 rounded-md border flex items-center justify-center transition-colors shrink-0",
                      item.completed
                        ? "bg-emerald-500 border-emerald-600 text-white"
                        : "border-gray-300 bg-white hover:border-gray-400"
                    )}
                  >
                    {item.completed && <CheckCircle2 className="w-4 h-4" />}
                  </button>

                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-white text-gray-900 border border-gray-200">
                        {item.course?.code}
                      </span>
                      <span
                        className={cn(
                          "px-2 py-0.5 rounded text-[10px] font-bold font-mono border",
                          isHigh
                            ? "bg-amber-50 text-amber-900 border-amber-200"
                            : isMed
                            ? "bg-blue-50 text-blue-900 border-blue-200"
                            : "bg-gray-100 text-gray-700 border-gray-200"
                        )}
                      >
                        {item.priority} PRIORITY
                      </span>
                    </div>

                    <h3 className={cn("text-xs font-bold text-gray-900", item.completed && "line-through text-gray-400")}>
                      {item.title}
                    </h3>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 text-xs text-gray-500 font-mono shrink-0">
                  <Clock className="w-3.5 h-3.5 text-amber-600" />
                  <span>{formatDate(item.dueDate)}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </GlassCard>
  );
}
