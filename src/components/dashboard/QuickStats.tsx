"use client";

import React from "react";
import { GlassCard } from "@/components/ui/GlassCard";
import { Sparkles, MessageSquare, Target, Trophy, ArrowRight } from "lucide-react";
import Link from "next/link";

export function QuickStats() {
  return (
    <GlassCard className="p-6 col-span-1 flex flex-col justify-between" glowColor="amber">
      <div className="flex items-center justify-between border-b border-gray-100 pb-3 mb-4">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-xl bg-amber-50 border border-amber-200 text-amber-800">
            <Trophy className="w-5 h-5" />
          </div>
          <div>
            <h2 className="font-serif text-base font-bold text-gray-900 tracking-tight">Academic Companion</h2>
            <p className="text-xs text-gray-500">Socratic practice metrics</p>
          </div>
        </div>
      </div>

      <div className="space-y-3 my-2">
        <div className="p-3.5 rounded-xl bg-purple-50 border border-purple-200 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <MessageSquare className="w-4 h-4 text-purple-700" />
            <span className="text-xs font-medium text-gray-800">Socratic Questions Asked</span>
          </div>
          <span className="text-sm font-black font-mono text-purple-900">48</span>
        </div>

        <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <Target className="w-4 h-4 text-emerald-700" />
            <span className="text-xs font-medium text-gray-800">Syllabus Milestones Met</span>
          </div>
          <span className="text-sm font-black font-mono text-emerald-900">12/16</span>
        </div>
      </div>

      <div className="pt-3">
        <Link
          href="/tutor"
          className="w-full py-3 rounded-xl font-bold text-xs bg-gray-900 text-white hover:bg-gray-800 flex items-center justify-center gap-2 transition-all shadow-xs"
        >
          <Sparkles className="w-4 h-4 text-amber-300" />
          <span>Launch AI Socratic Tutor</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </GlassCard>
  );
}
