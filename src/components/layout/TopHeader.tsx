"use client";

import React, { useState, useEffect } from "react";
import { Flame, Bell, Sparkles, GraduationCap } from "lucide-react";
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
    <header className="w-full py-4 px-4 sm:px-8 flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-neutral-200 bg-white/90 backdrop-blur-md sticky top-0 z-40 shadow-xs">
      {/* Left: Personalized Greeting */}
      <div>
        <div className="flex items-center gap-2 text-[10px] font-bold font-mono uppercase tracking-wider text-purple-700 mb-0.5">
          <Sparkles className="w-3.5 h-3.5 text-purple-600" />
          <span>NOVA Digital Workspace</span>
        </div>
        <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-neutral-950 flex items-center gap-2 font-sans">
          <span>{greeting}, {studentName}.</span>
        </h1>
        <p className="text-xs text-neutral-600 mt-0.5">
          You have <span className="text-amber-800 font-bold bg-amber-100 px-1.5 py-0.5 rounded border border-amber-200">{urgentCount} deadlines</span> approaching this week.
        </p>
      </div>

      {/* Right: Student Quick Stats & Badges */}
      <div className="flex items-center gap-3">
        {/* Streak Counter */}
        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-amber-50 border border-amber-200 text-amber-900 text-xs font-bold shadow-xs">
          <Flame className="w-4 h-4 text-amber-600 fill-amber-500/20" />
          <span>{streakDays} Day Streak</span>
        </div>

        {/* GPA Badge */}
        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-purple-50 border border-purple-200 text-purple-900 text-xs font-bold shadow-xs">
          <GraduationCap className="w-4 h-4 text-purple-600" />
          <span>GPA: {gpa.toFixed(2)}</span>
        </div>

        {/* Notification Bell */}
        <button 
          className="relative p-2 rounded-full bg-neutral-100 border border-neutral-200 text-neutral-700 hover:text-black hover:bg-neutral-200 transition-colors"
          title="Notifications"
        >
          <Bell className="w-4 h-4" />
          <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-purple-600 animate-ping" />
          <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-purple-600" />
        </button>

        {/* Student Avatar */}
        <div className="flex items-center gap-2 pl-2 border-l border-neutral-200">
          <div className="w-9 h-9 rounded-full bg-black flex items-center justify-center font-bold text-xs text-white shadow-xs">
            {studentName.charAt(0)}
          </div>
        </div>
      </div>
    </header>
  );
}
