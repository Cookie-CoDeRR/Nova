"use client";

import React, { useState, useEffect } from "react";
import { GlassCard } from "@/components/ui/GlassCard";
import { Play, Pause, RotateCcw, Flame } from "lucide-react";

export function PomodoroTimer() {
  const [seconds, setSeconds] = useState(25 * 60);
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (isActive && seconds > 0) {
      interval = setInterval(() => {
        setSeconds((prev) => prev - 1);
      }, 1000);
    } else if (seconds === 0) {
      setIsActive(false);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isActive, seconds]);

  const toggleTimer = () => setIsActive(!isActive);
  const resetTimer = () => {
    setIsActive(false);
    setSeconds(25 * 60);
  };

  const minutes = Math.floor(seconds / 60);
  const remSeconds = seconds % 60;
  const timeString = `${minutes.toString().padStart(2, "0")}:${remSeconds.toString().padStart(2, "0")}`;

  return (
    <GlassCard className="p-6 col-span-1 flex flex-col justify-between" glowColor="emerald">
      <div className="flex items-center justify-between border-b border-neutral-800/80 pb-3 mb-4">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
            <Flame className="w-5 h-5 fill-emerald-500/20" />
          </div>
          <div>
            <h2 className="font-sans text-base font-bold text-white tracking-tight">Focus Pomodoro</h2>
            <p className="text-xs text-neutral-400">Deep Work Timer</p>
          </div>
        </div>

        <span className="text-[10px] font-mono font-bold text-emerald-300 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
          25 MIN SPRINT
        </span>
      </div>

      <div className="flex flex-col items-center justify-center my-4">
        <div className="text-4xl font-black font-mono text-white tracking-tight mb-2">
          {timeString}
        </div>
        <p className="text-xs text-neutral-400 font-mono">
          {isActive ? "Focus Session Active" : "Ready for Focus Sprint"}
        </p>
      </div>

      <div className="flex items-center justify-center gap-3 pt-2">
        <button
          onClick={resetTimer}
          className="p-2.5 rounded-xl bg-neutral-900 border border-neutral-800 text-neutral-400 hover:text-white transition-colors"
          title="Reset Timer"
        >
          <RotateCcw className="w-4 h-4" />
        </button>

        <button
          onClick={toggleTimer}
          className="flex-1 py-2.5 rounded-xl font-bold text-xs bg-purple-600 text-white hover:bg-purple-500 flex items-center justify-center gap-2 transition-all shadow-[0_0_15px_rgba(124,58,237,0.4)]"
        >
          {isActive ? (
            <>
              <Pause className="w-4 h-4 fill-white" />
              <span>Pause Sprint</span>
            </>
          ) : (
            <>
              <Play className="w-4 h-4 fill-white" />
              <span>Start Focus</span>
            </>
          )}
        </button>
      </div>
    </GlassCard>
  );
}
