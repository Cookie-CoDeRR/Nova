"use client";

import React, { useState } from "react";
import { GlassCard } from "@/components/ui/GlassCard";
import { Assignment } from "@/types";
import { Clock, AlertCircle, CheckCircle2 } from "lucide-react";
import { cn, formatDate, getHoursRemaining } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

const INITIAL_ASSIGNMENTS: Assignment[] = [
  {
    id: "1",
    title: "Algorithm Complexity Analysis & Red-Black Trees",
    description: "Derive asymptotic time bounds and implement rebalancing algorithms.",
    dueDate: new Date(Date.now() + 14 * 3600 * 1000).toISOString(),
    urgency: "HIGH",
    completed: false,
    courseId: "c1",
    course: {
      id: "c1",
      code: "CS 301",
      name: "Data Structures & Algorithms",
      color: "#7C3AED",
    },
  },
  {
    id: "2",
    title: "Quantum Wave Mechanics Problem Set 4",
    description: "Schrödinger equation derivations for 1D potential wells.",
    dueDate: new Date(Date.now() + 42 * 3600 * 1000).toISOString(),
    urgency: "HIGH",
    completed: false,
    courseId: "c2",
    course: {
      id: "c2",
      code: "PHYS 202",
      name: "Quantum Physics",
      color: "#3B82F6",
    },
  },
  {
    id: "3",
    title: "Linear Algebra Eigenvalues Lab",
    description: "Eigenvector decomposition and PageRank algorithm simulation.",
    dueDate: new Date(Date.now() + 96 * 3600 * 1000).toISOString(),
    urgency: "MEDIUM",
    completed: false,
    courseId: "c3",
    course: {
      id: "c3",
      code: "MATH 240",
      name: "Linear Algebra",
      color: "#10B981",
    },
  },
  {
    id: "4",
    title: "Neural Network Backpropagation Essay",
    description: "Write a 3-page summary on gradient descent and vanishing gradients.",
    dueDate: new Date(Date.now() + 168 * 3600 * 1000).toISOString(),
    urgency: "LOW",
    completed: false,
    courseId: "c4",
    course: {
      id: "c4",
      code: "AI 410",
      name: "Machine Learning Foundations",
      color: "#F59E0B",
    },
  },
];

export function UpcomingAssignments() {
  const [assignments, setAssignments] = useState<Assignment[]>(INITIAL_ASSIGNMENTS);
  const [filter, setFilter] = useState<"ALL" | "URGENT">("ALL");

  const toggleComplete = (id: string) => {
    setAssignments((prev) =>
      prev.map((item) => (item.id === id ? { ...item, completed: !item.completed } : item))
    );
  };

  const filteredAssignments = assignments.filter((a) => {
    if (filter === "URGENT") return a.urgency === "HIGH" && !a.completed;
    return true;
  });

  return (
    <GlassCard className="p-6 col-span-1 lg:col-span-2 flex flex-col justify-between" glowColor="purple">
      {/* Header & Filter */}
      <div className="flex items-center justify-between mb-4 border-b border-neutral-100 pb-3">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-xl bg-purple-100 border border-purple-200 text-purple-800">
            <Clock className="w-5 h-5" />
          </div>
          <div>
            <h2 className="font-serif text-base font-bold text-neutral-950 tracking-tight">Approaching Deadlines</h2>
            <p className="text-xs text-neutral-500">Color-coded by urgency level</p>
          </div>
        </div>

        {/* Filter Toggle */}
        <div className="flex items-center gap-1 p-1 rounded-xl bg-neutral-100 border border-neutral-200 text-xs">
          <button
            onClick={() => setFilter("ALL")}
            className={cn(
              "px-2.5 py-1 rounded-lg transition-all font-semibold",
              filter === "ALL" ? "bg-black text-white shadow-xs" : "text-neutral-600 hover:text-black"
            )}
          >
            All ({assignments.length})
          </button>
          <button
            onClick={() => setFilter("URGENT")}
            className={cn(
              "px-2.5 py-1 rounded-lg transition-all font-semibold flex items-center gap-1",
              filter === "URGENT" ? "bg-amber-100 text-amber-900 border border-amber-300 shadow-xs" : "text-amber-700 hover:text-amber-900"
            )}
          >
            <AlertCircle className="w-3 h-3" />
            Urgent
          </button>
        </div>
      </div>

      {/* Timeline List */}
      <div className="space-y-3 mt-1 overflow-x-auto pb-1">
        <AnimatePresence>
          {filteredAssignments.map((assignment) => {
            const hoursLeft = getHoursRemaining(assignment.dueDate);
            const isHighUrgency = assignment.urgency === "HIGH";

            return (
              <motion.div
                key={assignment.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, height: 0 }}
                className={cn(
                  "p-4 rounded-xl border transition-all duration-200 flex items-center justify-between gap-4 group bg-white shadow-2xs",
                  assignment.completed
                    ? "border-neutral-200 opacity-50 line-through"
                    : isHighUrgency
                    ? "border-red-200 bg-red-50/40 hover:border-red-300"
                    : "border-neutral-200 hover:border-neutral-300"
                )}
              >
                <div className="flex items-start gap-3 min-w-0 flex-1">
                  <button
                    onClick={() => toggleComplete(assignment.id)}
                    className="mt-0.5 text-neutral-400 hover:text-purple-600 transition-colors"
                  >
                    {assignment.completed ? (
                      <CheckCircle2 className="w-5 h-5 text-emerald-600 fill-emerald-100" />
                    ) : (
                      <div className="w-5 h-5 rounded-full border-2 border-neutral-300 group-hover:border-purple-600 transition-colors" />
                    )}
                  </button>

                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-neutral-100 text-neutral-800 border border-neutral-200">
                        {assignment.course?.code}
                      </span>
                      {isHighUrgency && !assignment.completed && (
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold font-mono bg-red-100 text-red-900 border border-red-200 flex items-center gap-1 animate-pulse">
                          <AlertCircle className="w-3 h-3 text-red-600" />
                          Due in {hoursLeft}h
                        </span>
                      )}
                    </div>

                    <h3 className="text-sm font-bold text-neutral-950 tracking-tight truncate group-hover:text-purple-700 transition-colors">
                      {assignment.title}
                    </h3>
                    <p className="text-xs text-neutral-600 truncate mt-0.5">
                      {assignment.description}
                    </p>
                  </div>
                </div>

                <div className="text-right shrink-0 font-mono">
                  <div className="text-xs font-bold text-neutral-900">
                    {formatDate(assignment.dueDate)}
                  </div>
                  <div className="text-[10px] text-neutral-500 mt-0.5">
                    {hoursLeft > 24 ? `${Math.round(hoursLeft / 24)} days left` : `${hoursLeft} hours left`}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </GlassCard>
  );
}
