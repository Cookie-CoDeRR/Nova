"use client";

import React, { useState, useEffect } from "react";
import { Flame, Bell, Search, Sparkles, GraduationCap } from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";

interface TopHeaderProps {
  urgentCount?: number;
  studentName?: string;
  gpa?: number;
  streakDays?: number;
}

export function TopHeader({
  urgentCount = 2,
  studentName = "Alex",
  gpa = 3.85,
  streakDays = 7,
}: TopHeaderProps) {
  const [greeting, setGreeting] = useState("Good evening");

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setGreeting("Good morning");
    else if (hour < 17) setGreeting("Good afternoon");
    else setGreeting("Good evening");
  }, []);

  return (
    <header className="w-full py-6 px-4 sm:px-8 flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/5 bg-black/40 backdrop-blur-md sticky top-0 z-40">
      {/* Left: Personalized Greeting */}
      <div>
        <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-purple-400 mb-1">
          <Sparkles className="w-3.5 h-3.5" />
          <span>NOVA Digital Companion</span>
        </div>
        <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white flex items-center gap-2">
          <span>{greeting}, {studentName}.</span>
        </h1>
        <p className="text-xs sm:text-sm text-zinc-400 mt-0.5">
          You have <span className="text-amber-400 font-semibold">{urgentCount} deadlines</span> approaching this week.
        </p>
      </div>

      {/* Right: Student Quick Stats & Badges */}
      <div className="flex items-center gap-3">
        {/* Streak Counter */}
        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-300 text-xs font-medium">
          <Flame className="w-4 h-4 text-amber-400 fill-amber-400/20 animate-pulse" />
          <span>{streakDays} Day Streak</span>
        </div>

        {/* GPA Badge */}
        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-300 text-xs font-medium">
          <GraduationCap className="w-4 h-4 text-purple-400" />
          <span>GPA: {gpa.toFixed(2)}</span>
        </div>

        {/* Notification Bell */}
        <button 
          className="relative p-2 rounded-full bg-white/5 border border-white/10 text-zinc-300 hover:text-white hover:bg-white/10 transition-colors"
          title="Notifications"
        >
          <Bell className="w-4 h-4" />
          <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-purple-500 animate-ping" />
          <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-purple-500" />
        </button>

        {/* Student Avatar */}
        <div className="flex items-center gap-2 pl-2 border-l border-white/10">
          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 p-0.5 shadow-[0_0_15px_rgba(124,58,237,0.4)]">
            <div className="w-full h-full rounded-full bg-zinc-950 flex items-center justify-center font-bold text-xs text-white">
              {studentName.charAt(0)}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
