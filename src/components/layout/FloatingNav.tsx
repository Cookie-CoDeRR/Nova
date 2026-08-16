"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { LayoutDashboard, Sparkles, Brain, Target, BarChart2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface FloatingNavProps {
  onToggleFocusMode?: () => void;
  isFocusModeActive?: boolean;
}

export function FloatingNav({ onToggleFocusMode, isFocusModeActive }: FloatingNavProps) {
  const pathname = usePathname();

  const navItems = [
    {
      name: "Home",
      href: "/",
      icon: LayoutDashboard,
      badge: null,
    },
    {
      name: "Study Pulse",
      href: "/dashboard",
      icon: BarChart2,
      badge: "Pulse",
    },
    {
      name: "AI Tutor",
      href: "/tutor",
      icon: Sparkles,
      badge: "Socratic",
    },
    {
      name: "Knowledge",
      href: "/brain",
      icon: Brain,
      badge: null,
    },
  ];

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 w-auto max-w-[95vw]">
      <motion.nav
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className="glass-pill px-4 py-2.5 rounded-full flex items-center gap-2 border border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.6)] bg-black/50 backdrop-blur-md"
      >
        {/* Brand indicator */}
        <Link 
          href="/" 
          className="flex items-center gap-2 pr-3 border-r border-white/10 hover:opacity-80 transition-opacity"
        >
          <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-purple-600 to-blue-500 flex items-center justify-center font-black text-xs text-white shadow-[0_0_12px_rgba(124,58,237,0.5)]">
            N
          </div>
          <span className="font-extrabold text-xs tracking-wider text-white hidden sm:inline">NOVA</span>
        </Link>

        {/* Navigation Items */}
        <div className="flex items-center gap-1">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "relative flex items-center gap-2 px-3.5 py-2 rounded-full text-xs font-medium transition-all duration-200",
                  isActive
                    ? "text-white font-semibold"
                    : "text-neutral-400 hover:text-white hover:bg-white/5"
                )}
              >
                {isActive && (
                  <motion.div
                    layoutId="activeNavTab"
                    className="absolute inset-0 bg-white/10 rounded-full border border-white/15 shadow-[0_0_15px_rgba(124,58,237,0.3)]"
                    transition={{ type: "spring", stiffness: 400, damping: 30 }}
                  />
                )}
                <Icon className={cn("w-4 h-4 z-10", isActive ? "text-purple-400" : "text-neutral-400")} />
                <span className="z-10">{item.name}</span>
                {item.badge && (
                  <span className="z-10 px-1.5 py-0.5 text-[9px] font-bold rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30 hidden md:inline-block">
                    {item.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </div>

        {/* Focus Mode Quick Action Button */}
        {onToggleFocusMode && (
          <div className="pl-2 border-l border-white/10 flex items-center gap-2">
            <button
              onClick={onToggleFocusMode}
              className={cn(
                "flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold transition-all duration-300 border",
                isFocusModeActive
                  ? "bg-amber-500/20 text-amber-300 border-amber-500/40 shadow-[0_0_15px_rgba(245,158,11,0.3)] animate-pulse"
                  : "bg-white/5 text-neutral-300 border-white/10 hover:bg-white/10"
              )}
              title="Toggle Focus Mode Pomodoro"
            >
              <Target className={cn("w-3.5 h-3.5", isFocusModeActive ? "text-amber-400" : "text-neutral-400")} />
              <span className="hidden sm:inline">Focus</span>
            </button>
          </div>
        )}
      </motion.nav>
    </div>
  );
}
