"use client";

import React, { useState } from "react";
import { CheckCircle2, ChevronDown, Plus } from "lucide-react";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

const MOCK_TASKS = [
  { id: "1", title: "Review Red-Black Tree properties", course: "CS 301" },
  { id: "2", title: "Complete Dynamic Programming problem set", course: "CS 301" },
  { id: "3", title: "Read Chapter 4 on Quantum Mechanics", course: "PHYS 201" },
];

export function TaskSelector() {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedTaskId, setSelectedTaskId] = useState<string>(MOCK_TASKS[0].id);

  const selectedTask = MOCK_TASKS.find((t) => t.id === selectedTaskId);

  return (
    <div className="w-full max-w-md mx-auto mt-6">
      <div className="flex items-center justify-between mb-2 px-1">
        <span className="text-[10px] font-bold uppercase text-gray-400 font-mono tracking-widest">
          Current Focus Target
        </span>
        <button className="text-[10px] font-bold text-purple-600 hover:text-purple-700 flex items-center gap-1 uppercase tracking-widest">
          <Plus className="w-3 h-3" />
          New Task
        </button>
      </div>

      <div className=" relative">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className={twMerge(
            clsx(
              "w-full flex items-center justify-between p-4 bg-white border rounded-xl transition-all shadow-sm",
              isOpen ? "border-purple-300 ring-2 ring-purple-100" : "border-gray-200 hover:border-gray-300"
            )
          )}
        >
          <div className="flex items-center gap-3 text-left">
            <CheckCircle2 className="w-5 h-5 text-purple-600" />
            <div>
              <p className="text-sm font-bold text-gray-900 leading-none mb-1">
                {selectedTask?.title || "Select a task..."}
              </p>
              <p className="text-[11px] font-medium text-gray-500">
                {selectedTask?.course || "No course"}
              </p>
            </div>
          </div>
          <ChevronDown className={twMerge(clsx("w-4 h-4 text-gray-400 transition-transform", isOpen && "rotate-180"))} />
        </button>

        {isOpen && (
          <div className="absolute z-10 w-full mt-2 bg-white border border-gray-200 rounded-xl shadow-lg overflow-hidden">
            {MOCK_TASKS.map((task) => (
              <button
                key={task.id}
                onClick={() => {
                  setSelectedTaskId(task.id);
                  setIsOpen(false);
                }}
                className={twMerge(
                  clsx(
                    "w-full flex items-center gap-3 p-4 text-left transition-colors border-b border-gray-100 last:border-b-0",
                    selectedTaskId === task.id ? "bg-purple-50" : "hover:bg-gray-50"
                  )
                )}
              >
                <div className="flex-shrink-0">
                  <CheckCircle2 className={twMerge(clsx("w-4 h-4", selectedTaskId === task.id ? "text-purple-600" : "text-gray-300"))} />
                </div>
                <div>
                  <p className={twMerge(clsx("text-sm font-medium leading-none mb-1", selectedTaskId === task.id ? "text-purple-900" : "text-gray-700"))}>
                    {task.title}
                  </p>
                  <p className="text-[11px] font-medium text-gray-500">
                    {task.course}
                  </p>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
