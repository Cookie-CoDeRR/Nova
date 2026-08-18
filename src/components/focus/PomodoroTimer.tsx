"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Play, Pause, RotateCcw, Coffee, Brain } from "lucide-react";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

type Mode = "focus" | "shortBreak" | "longBreak";

const MODES = {
  focus: { label: "Deep Work", duration: 25 * 60, color: "text-purple-600", bg: "bg-purple-600", icon: Brain },
  shortBreak: { label: "Short Break", duration: 5 * 60, color: "text-emerald-600", bg: "bg-emerald-600", icon: Coffee },
  longBreak: { label: "Long Break", duration: 15 * 60, color: "text-blue-600", bg: "bg-blue-600", icon: Coffee },
};

export function PomodoroTimer() {
  const [mode, setMode] = useState<Mode>("focus");
  const [timeLeft, setTimeLeft] = useState(MODES.focus.duration);
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;

    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0 && isActive) {
      setIsActive(false);
      if (interval) clearInterval(interval);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isActive, timeLeft]);

  const toggleTimer = () => setIsActive(!isActive);

  const resetTimer = () => {
    setIsActive(false);
    setTimeLeft(MODES[mode].duration);
  };

  const switchMode = (newMode: Mode) => {
    setMode(newMode);
    setIsActive(false);
    setTimeLeft(MODES[newMode].duration);
  };

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  
  const progress = ((MODES[mode].duration - timeLeft) / MODES[mode].duration) * 100;
  const currentMode = MODES[mode];
  const ModeIcon = currentMode.icon;

  return (
    <div className="flex flex-col items-center justify-center p-8 bg-white border border-gray-200 rounded-3xl shadow-sm w-full max-w-md mx-auto">
      
      {/* Mode Switcher */}
      <div className="flex p-1.5 bg-gray-100 rounded-full mb-12 w-full max-w-xs">
        {(Object.keys(MODES) as Mode[]).map((m) => (
          <button
            key={m}
            onClick={() => switchMode(m as Mode)}
            className={twMerge(
              clsx(
                "flex-1 py-2 px-3 rounded-full text-xs font-bold transition-all",
                mode === m 
                  ? "bg-white text-gray-900 shadow-sm" 
                  : "text-gray-500 hover:text-gray-700 hover:bg-gray-200/50"
              )
            )}
          >
            {MODES[m as Mode].label}
          </button>
        ))}
      </div>

      {/* Timer Display */}
      <div className="relative w-64 h-64 flex items-center justify-center mb-12">
        {/* SVG Progress Ring */}
        <svg className="absolute inset-0 w-full h-full -rotate-90">
          <circle
            cx="128"
            cy="128"
            r="120"
            className="stroke-gray-100"
            strokeWidth="6"
            fill="none"
          />
          <motion.circle
            cx="128"
            cy="128"
            r="120"
            className={currentMode.color}
            strokeWidth="6"
            fill="none"
            strokeLinecap="round"
            initial={{ strokeDasharray: "0 1000" }}
            animate={{ 
              strokeDasharray: `${(progress / 100) * (2 * Math.PI * 120)} 1000` 
            }}
            transition={{ duration: 1, ease: "linear" }}
          />
        </svg>

        <div className="relative z-10 flex flex-col items-center">
          <div className={twMerge(clsx("flex items-center gap-2 mb-2 px-3 py-1 rounded-full bg-opacity-10", currentMode.color.replace("text-", "bg-").replace("-600", "-50"), currentMode.color))}>
            <ModeIcon className="w-3.5 h-3.5" />
            <span className="text-[10px] font-bold uppercase tracking-widest">{currentMode.label}</span>
          </div>
          <div className="text-6xl font-black font-mono text-gray-900 tracking-tighter">
            {String(minutes).padStart(2, "0")}:{String(seconds).padStart(2, "0")}
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center gap-4">
        <button
          onClick={resetTimer}
          className="w-12 h-12 flex items-center justify-center rounded-full bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors"
          aria-label="Reset Timer"
        >
          <RotateCcw className="w-5 h-5" />
        </button>
        
        <button
          onClick={toggleTimer}
          className={twMerge(
            clsx(
              "w-20 h-20 flex items-center justify-center rounded-full text-white shadow-md transition-all hover:scale-105 active:scale-95",
              isActive ? "bg-gray-900 hover:bg-gray-800" : currentMode.bg
            )
          )}
          aria-label={isActive ? "Pause Timer" : "Start Timer"}
        >
          {isActive ? (
            <Pause className="w-8 h-8 fill-current" />
          ) : (
            <Play className="w-8 h-8 fill-current ml-1" />
          )}
        </button>

        <div className="w-12 h-12" /> {/* Spacer to balance the layout */}
      </div>
    </div>
  );
}
