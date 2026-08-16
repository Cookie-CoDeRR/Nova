"use client";

import React from "react";
import { Lightbulb, HelpCircle, FileText, Calculator } from "lucide-react";
import { cn } from "@/lib/utils";

interface QuickActionChipsProps {
  onSelectChip: (promptText: string, chipLabel: string) => void;
  disabled?: boolean;
}

export const CHIPS = [
  {
    id: "explain",
    label: "Explain this concept",
    icon: Lightbulb,
    prompt: "Can you explain the intuition behind this concept using a real-world analogy and test my understanding?",
    color: "from-purple-500/20 to-indigo-500/20 border-purple-500/30 text-purple-300",
  },
  {
    id: "quiz",
    label: "Quiz me on Chapter 4",
    icon: HelpCircle,
    prompt: "Quiz me on Chapter 4 concepts! Ask me one Socratic question at a time and wait for my answer.",
    color: "from-blue-500/20 to-cyan-500/20 border-blue-500/30 text-blue-300",
  },
  {
    id: "summarize",
    label: "Summarize my notes",
    icon: FileText,
    prompt: "Summarize my course notes into key bullet points and highlight the top 3 formulas/definitions.",
    color: "from-emerald-500/20 to-teal-500/20 border-emerald-500/30 text-emerald-300",
  },
  {
    id: "solve",
    label: "Step-by-step solver",
    icon: Calculator,
    prompt: "Guide me step-by-step through solving a problem without giving away the final answer right away.",
    color: "from-amber-500/20 to-orange-500/20 border-amber-500/30 text-amber-300",
  },
];

export function QuickActionChips({ onSelectChip, disabled }: QuickActionChipsProps) {
  return (
    <div className="flex items-center gap-2 overflow-x-auto py-2 scrollbar-none">
      <span className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider shrink-0 mr-1">
        Quick Prompts:
      </span>
      {CHIPS.map((chip) => {
        const Icon = chip.icon;
        return (
          <button
            key={chip.id}
            disabled={disabled}
            onClick={() => onSelectChip(chip.prompt, chip.label)}
            className={cn(
              "shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border bg-gradient-to-r transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]",
              chip.color,
              disabled && "opacity-50 cursor-not-allowed"
            )}
          >
            <Icon className="w-3.5 h-3.5" />
            <span>{chip.label}</span>
          </button>
        );
      })}
    </div>
  );
}
