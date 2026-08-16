"use client";

import React from "react";
import { cn } from "@/lib/utils";
import { motion, HTMLMotionProps } from "framer-motion";

interface GlassCardProps extends HTMLMotionProps<"div"> {
  children: React.ReactNode;
  className?: string;
  interactive?: boolean;
  glowColor?: "purple" | "blue" | "amber" | "emerald" | "none";
}

export function GlassCard({
  children,
  className,
  interactive = false,
  glowColor = "none",
  ...props
}: GlassCardProps) {
  const colorShadows = {
    none: "shadow-[2px_2px_0px_rgba(0,0,0,0.04)]",
    purple: "shadow-[4px_4px_0px_rgba(233,213,255,0.7)] hover:border-purple-300",
    blue: "shadow-[4px_4px_0px_rgba(219,234,254,0.7)] hover:border-blue-300",
    amber: "shadow-[4px_4px_0px_rgba(254,215,170,0.7)] hover:border-amber-300",
    emerald: "shadow-[4px_4px_0px_rgba(187,247,208,0.7)] hover:border-emerald-300",
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
      className={cn(
        "rounded-2xl relative overflow-hidden bg-white border border-neutral-200 transition-all duration-200 text-neutral-900",
        interactive && "cursor-pointer hover:-translate-y-1 hover:border-neutral-300",
        colorShadows[glowColor],
        className
      )}
      {...props}
    >
      {children}
    </motion.div>
  );
}
