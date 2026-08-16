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
  const colorGlows = {
    none: "border-neutral-800 hover:border-neutral-700",
    purple: "border-purple-500/30 hover:border-purple-500/60 shadow-[0_0_25px_rgba(124,58,237,0.12)]",
    blue: "border-blue-500/30 hover:border-blue-500/60 shadow-[0_0_25px_rgba(59,130,246,0.12)]",
    amber: "border-amber-500/30 hover:border-amber-500/60 shadow-[0_0_25px_rgba(245,158,11,0.12)]",
    emerald: "border-emerald-500/30 hover:border-emerald-500/60 shadow-[0_0_25px_rgba(16,185,129,0.12)]",
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
      className={cn(
        "rounded-2xl relative overflow-hidden bg-[#0A0A0C] border transition-all duration-200 text-neutral-300",
        interactive && "cursor-pointer hover:-translate-y-1",
        colorGlows[glowColor],
        className
      )}
      {...props}
    >
      {children}
    </motion.div>
  );
}
