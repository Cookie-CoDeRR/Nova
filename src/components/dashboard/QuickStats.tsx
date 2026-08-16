"use client";

import React from "react";
import { GlassCard } from "@/components/ui/GlassCard";
import { Sparkles, MessageSquare, Target, Trophy, ArrowRight } from "lucide-react";
import Link from "next/link";

export function QuickStats() {
  return (
    <GlassCard className="p-6 col-span-1 flex flex-col justify-between" glowColor="amber">
      <div className="flex items-center justify-between border-b border-neutral-800/80 pb-3 mb-4">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400">
            <Trophy className="w-5 h-5" />
          </div>
          <div>
            <h2 className="font-sans text-base font-bold text-white tracking-tight">Academic Companion</h2>
            <p className="text-xs text-neutral-400">Socratic practice metrics</p>
          </div>
        </div>
      </div>

      <div className="space-y-3 my-2">
        <div className="p-3.5 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <MessageSquare className="w-4 h-4 text-purple-400" />
            <span className="text-xs font-medium text-neutral-300">Socratic Questions Asked</span>
          </div>
          <span className="text-sm font-black font-mono text-purple-300">48</span>
        </div>

        <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <Target className="w-4 h-4 text-emerald-400" />
            <span className="text-xs font-medium text-neutral-300">Syllabus Milestones Met</span>
          </div>
          <span className="text-sm font-black font-mono text-emerald-300">12/16</span>
        </div>
      </div>

      <div className="pt-3">
        <Link
          href="/tutor"
          className="w-full py-3 rounded-xl font-bold text-xs bg-purple-600 text-white hover:bg-purple-500 flex items-center justify-center gap-2 transition-all shadow-[0_0_15px_rgba(124,58,237,0.4)]"
        >
          <Sparkles className="w-4 h-4 text-amber-300" />
          <span>Launch AI Socratic Tutor</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </GlassCard>
  );
}
