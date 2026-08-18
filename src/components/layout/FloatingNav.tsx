"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { Sparkles, Brain, Target, BarChart2 } from "lucide-react";
import { NovaLogo } from "@/components/ui/NovaLogo";
import { cn } from "@/lib/utils";

interface FloatingNavProps {
  onToggleFocusMode?: () => void;
  isFocusModeActive?: boolean;
}

export function FloatingNav({ onToggleFocusMode, isFocusModeActive }: FloatingNavProps) {
  const pathname = usePathname();

  // Floating Navigation Items for Main App Only
  const navItems = [
    {
      name: "Study Pulse",
      href: "/dashboard",
      icon: BarChart2,
      badge: null,
    },
    {
      name: "Socratic AI Tutor",
      href: "/tutor",
      icon: Sparkles,
      badge: "AI",
    },
    {
      name: "Knowledge Base",
      href: "/brain",
      icon: Brain,
      badge: null,
    },
  ];

  return (
    <div className="floating-nav fixed bottom-4 sm:bottom-6 left-1/2 -translate-x-1/2 z-50 w-auto max-w-[98vw] transition-opacity duration-200">
      <motion.nav
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className="glass-pill px-3 sm:px-4 py-1.5 sm:py-2 rounded-full flex items-center gap-1.5 sm:gap-2 border border-gray-200 shadow-lg bg-white/95 backdrop-blur-md"
      >
        {/* Official Brand Logo (Points to /dashboard inside app) */}
        <div className="pr-1.5 sm:pr-3 border-r border-gray-200 shrink-0">
          <NovaLogo size="sm" iconOnly={true} href="/dashboard" />
        </div>

        {/* Navigation Items */}
        <div className="flex items-center gap-1 sm:gap-1.5">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "relative flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs font-medium transition-all duration-200 shrink-0",
                  isActive
                    ? "text-gray-900 font-bold"
                    : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                )}
              >
                {isActive && (
                  <motion.div
                    layoutId="activeNavTab"
                    className="absolute inset-0 bg-gray-100 rounded-full border border-gray-300 shadow-xs"
                    transition={{ type: "spring", stiffness: 400, damping: 30 }}
                  />
                )}
                <Icon className={cn("w-3.5 h-3.5 sm:w-4 sm:h-4 z-10 shrink-0", isActive ? "text-purple-700" : "text-gray-500")} />
                <span className="z-10">{item.name}</span>
                {item.badge && (
                  <span className="z-10 px-1.5 py-0.2 text-[8px] sm:text-[9px] font-bold rounded-full bg-purple-100 text-purple-800 border border-purple-200 hidden md:inline-block">
                    {item.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </div>

        {/* Focus Mode Quick Action Button */}
        {onToggleFocusMode && (
          <div className="pl-1.5 sm:pl-2 border-l border-gray-200 flex items-center gap-1 shrink-0">
            <button
              onClick={onToggleFocusMode}
              className={cn(
                "flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold transition-all duration-300 border cursor-pointer",
                isFocusModeActive
                  ? "bg-amber-100 text-amber-900 border-amber-300 shadow-sm animate-pulse"
                  : "bg-gray-100 text-gray-700 border-gray-200 hover:bg-gray-200"
              )}
              title="Toggle Focus Mode Pomodoro"
            >
              <Target className={cn("w-3.5 h-3.5", isFocusModeActive ? "text-amber-600" : "text-gray-500")} />
              <span className="hidden sm:inline">Focus</span>
            </button>
          </div>
        )}
      </motion.nav>
    </div>
  );
}
