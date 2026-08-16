"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { LayoutDashboard, Sparkles, Brain, Target, BarChart2 } from "lucide-react";
import { NovaLogo } from "@/components/ui/NovaLogo";
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
        className="glass-pill px-4 py-2 rounded-full flex items-center gap-2 border border-gray-200 shadow-md bg-white/95 backdrop-blur-md"
      >
        {/* Official Brand Logo */}
        <div className="pr-3 border-r border-gray-200">
          <NovaLogo size="sm" showText={true} href="/" />
        </div>

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
                <Icon className={cn("w-4 h-4 z-10", isActive ? "text-purple-700" : "text-gray-500")} />
                <span className="z-10">{item.name}</span>
                {item.badge && (
                  <span className="z-10 px-1.5 py-0.5 text-[9px] font-bold rounded-full bg-purple-100 text-purple-800 border border-purple-200 hidden md:inline-block">
                    {item.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </div>

        {/* Focus Mode Quick Action Button */}
        {onToggleFocusMode && (
          <div className="pl-2 border-l border-gray-200 flex items-center gap-2">
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
