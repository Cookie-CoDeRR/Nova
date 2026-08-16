"use client";

import React, { useState, useEffect } from "react";
import { GlassCard } from "@/components/ui/GlassCard";
import { Play, Pause, RotateCcw, Target, Volume2, Sparkles, X, Coffee } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

interface PomodoroTimerProps {
  isFullScreenOverlay?: boolean;
  onCloseOverlay?: () => void;
}

export function PomodoroTimer({ isFullScreenOverlay = false, onCloseOverlay }: PomodoroTimerProps) {
  const [mode, setMode] = useState<"FOCUS" | "BREAK">("FOCUS");
  const [timeLeft, setTimeLeft] = useState(25 * 60); // 25 minutes in seconds
  const [isRunning, setIsRunning] = useState(false);
  const [completedSessions, setCompletedSessions] = useState(3);

  const FOCUS_TIME = 25 * 60;
  const BREAK_TIME = 5 * 60;

  const totalDuration = mode === "FOCUS" ? FOCUS_TIME : BREAK_TIME;
  const progressPercent = ((totalDuration - timeLeft) / totalDuration) * 100;

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;

    if (isRunning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      if (mode === "FOCUS") {
        setCompletedSessions((prev) => prev + 1);
        setMode("BREAK");
        setTimeLeft(BREAK_TIME);
      } else {
        setMode("FOCUS");
        setTimeLeft(FOCUS_TIME);
      }
      setIsRunning(false);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isRunning, timeLeft, mode]);

  const toggleTimer = () => setIsRunning(!isRunning);

  const resetTimer = () => {
    setIsRunning(false);
    setTimeLeft(mode === "FOCUS" ? FOCUS_TIME : BREAK_TIME);
  };

  const switchMode = (newMode: "FOCUS" | "BREAK") => {
    setMode(newMode);
    setIsRunning(false);
    setTimeLeft(newMode === "FOCUS" ? FOCUS_TIME : BREAK_TIME);
  };

  const formatTimer = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const content = (
    <div className={cn("flex flex-col items-center justify-between h-full p-6", isFullScreenOverlay && "max-w-md mx-auto py-12")}>
      {/* Top Header */}
      <div className="w-full flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400">
            <Target className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-white tracking-tight">Focus Pomodoro</h2>
            <p className="text-xs text-zinc-400">Deep Work Engine</p>
          </div>
        </div>

        {isFullScreenOverlay && onCloseOverlay && (
          <button
            onClick={onCloseOverlay}
            className="p-2 rounded-full bg-white/5 border border-white/10 text-zinc-400 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Mode Switcher Tabs */}
      <div className="flex items-center p-1 rounded-full bg-white/5 border border-white/10 text-xs mb-6 w-full max-w-[220px]">
        <button
          onClick={() => switchMode("FOCUS")}
          className={cn(
            "flex-1 py-1.5 rounded-full transition-all font-medium flex items-center justify-center gap-1.5",
            mode === "FOCUS"
              ? "bg-purple-600 text-white shadow-[0_0_15px_rgba(124,58,237,0.4)]"
              : "text-zinc-400 hover:text-white"
          )}
        >
          <Target className="w-3.5 h-3.5" />
          Focus (25m)
        </button>
        <button
          onClick={() => switchMode("BREAK")}
          className={cn(
            "flex-1 py-1.5 rounded-full transition-all font-medium flex items-center justify-center gap-1.5",
            mode === "BREAK"
              ? "bg-emerald-600 text-white shadow-[0_0_15px_rgba(16,185,129,0.4)]"
              : "text-zinc-400 hover:text-white"
          )}
        >
          <Coffee className="w-3.5 h-3.5" />
          Rest (5m)
        </button>
      </div>

      {/* Circular Progress & Clock Visualizer */}
      <div className="relative flex items-center justify-center my-4">
        {/* Glow Ring behind */}
        <div
          className={cn(
            "absolute w-44 h-44 rounded-full blur-2xl transition-opacity duration-500",
            isRunning
              ? mode === "FOCUS"
                ? "bg-purple-600/30 opacity-100"
                : "bg-emerald-600/30 opacity-100"
              : "opacity-20"
          )}
        />

        {/* SVG Progress Ring */}
        <svg className="w-48 h-48 transform -rotate-90">
          <circle
            cx="96"
            cy="96"
            r="80"
            stroke="currentColor"
            strokeWidth="8"
            className="text-white/5"
            fill="transparent"
          />
          <circle
            cx="96"
            cy="96"
            r="80"
            stroke="currentColor"
            strokeWidth="8"
            strokeDasharray={502.6}
            strokeDashoffset={502.6 - (502.6 * progressPercent) / 100}
            strokeLinecap="round"
            className={cn(
              "transition-all duration-1000 ease-linear",
              mode === "FOCUS" ? "text-purple-500" : "text-emerald-400"
            )}
            fill="transparent"
          />
        </svg>

        {/* Clock Text inside */}
        <div className="absolute flex flex-col items-center justify-center text-center">
          <span className="text-4xl font-extrabold font-mono tracking-tighter text-white drop-shadow-md">
            {formatTimer(timeLeft)}
          </span>
          <span className="text-[11px] font-semibold text-zinc-400 uppercase tracking-widest mt-1">
            {mode === "FOCUS" ? "Deep Focus" : "Rest & Recharge"}
          </span>
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center gap-3 mt-6">
        <button
          onClick={resetTimer}
          className="p-3 rounded-full bg-white/5 border border-white/10 text-zinc-400 hover:text-white hover:bg-white/10 transition-all"
          title="Reset Timer"
        >
          <RotateCcw className="w-4 h-4" />
        </button>

        <button
          onClick={toggleTimer}
          className={cn(
            "px-6 py-3 rounded-full font-bold text-sm flex items-center gap-2 transition-all duration-300 border shadow-lg",
            isRunning
              ? "bg-amber-500/20 text-amber-300 border-amber-500/40 hover:bg-amber-500/30"
              : mode === "FOCUS"
              ? "bg-gradient-to-r from-purple-600 to-indigo-600 text-white border-purple-500/30 shadow-[0_0_25px_rgba(124,58,237,0.4)] hover:opacity-95 scale-105"
              : "bg-gradient-to-r from-emerald-600 to-teal-600 text-white border-emerald-500/30 shadow-[0_0_25px_rgba(16,185,129,0.4)] hover:opacity-95 scale-105"
          )}
        >
          {isRunning ? (
            <>
              <Pause className="w-4 h-4 fill-amber-300" />
              Pause Session
            </>
          ) : (
            <>
              <Play className="w-4 h-4 fill-white" />
              Start Focus
            </>
          )}
        </button>
      </div>

      {/* Completed Session Indicator */}
      <div className="mt-6 flex items-center gap-1.5 text-xs text-zinc-400">
        <Sparkles className="w-3.5 h-3.5 text-purple-400" />
        <span>Today's Sessions: <strong className="text-white">{completedSessions} completed</strong></span>
      </div>
    </div>
  );

  if (isFullScreenOverlay) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 bg-black/90 backdrop-blur-2xl flex items-center justify-center p-4"
      >
        <GlassCard className="w-full max-w-lg border-purple-500/30 shadow-[0_0_80px_rgba(124,58,237,0.3)]">
          {content}
        </GlassCard>
      </motion.div>
    );
  }

  return (
    <GlassCard className="col-span-1" glowColor="amber">
      {content}
    </GlassCard>
  );
}
