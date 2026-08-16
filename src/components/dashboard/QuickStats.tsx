"use client";

import React from "react";
import { GlassCard } from "@/components/ui/GlassCard";
import { GraduationCap, Flame, Sparkles, TrendingUp, Zap } from "lucide-react";
import Link from "next/link";

export function QuickStats() {
  return (
    <div className="col-span-1 grid grid-cols-2 gap-4">
      {/* Target GPA */}
      <GlassCard className="p-4 flex flex-col justify-between" glowColor="purple">
        <div className="flex items-center justify-between text-purple-400">
          <GraduationCap className="w-5 h-5" />
          <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-purple-500/20 text-purple-300 border border-purple-500/30">
            Top 5%
          </span>
        </div>
        <div className="mt-3">
          <div className="text-2xl font-black text-white font-mono tracking-tight">3.85</div>
          <div className="text-xs text-zinc-400 font-medium">Cumulative GPA</div>
        </div>
      </GlassCard>

      {/* Study Hours */}
      <GlassCard className="p-4 flex flex-col justify-between" glowColor="blue">
        <div className="flex items-center justify-between text-blue-400">
          <TrendingUp className="w-5 h-5" />
          <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-blue-500/20 text-blue-300 border border-blue-500/30">
            +18% wk
          </span>
        </div>
        <div className="mt-3">
          <div className="text-2xl font-black text-white font-mono tracking-tight">34.5h</div>
          <div className="text-xs text-zinc-400 font-medium">Weekly Focus Hours</div>
        </div>
      </GlassCard>

      {/* Quick Launch Socratic Tutor Banner */}
      <GlassCard 
        className="col-span-2 p-5 bg-gradient-to-r from-purple-900/30 via-indigo-900/20 to-blue-900/30 border-purple-500/30" 
        glowColor="purple"
        interactive
      >
        <Link href="/tutor" className="flex items-center justify-between group">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-600/30 border border-purple-500/40 flex items-center justify-center text-purple-300 shadow-[0_0_20px_rgba(124,58,237,0.4)] group-hover:scale-105 transition-transform">
              <Sparkles className="w-5 h-5 animate-spin-slow" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white group-hover:text-purple-300 transition-colors">
                Launch Socratic AI Tutor
              </h3>
              <p className="text-xs text-zinc-400">
                Ask questions, get step-by-step guidance & quiz practice
              </p>
            </div>
          </div>
          <div className="px-3 py-1.5 rounded-full bg-purple-600 text-white text-xs font-bold shadow-[0_0_15px_rgba(124,58,237,0.5)] group-hover:bg-purple-500 transition-colors flex items-center gap-1">
            <Zap className="w-3.5 h-3.5 fill-white" />
            Chat Now
          </div>
        </Link>
      </GlassCard>
    </div>
  );
}
