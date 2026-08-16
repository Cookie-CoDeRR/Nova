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
  const colorBorders = {
    none: "border-gray-200 hover:border-gray-300",
    purple: "border-purple-200 hover:border-purple-300",
    blue: "border-blue-200 hover:border-blue-300",
    amber: "border-amber-200 hover:border-amber-300",
    emerald: "border-emerald-200 hover:border-emerald-300",
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
      className={cn(
        "rounded-2xl relative overflow-hidden bg-white/90 backdrop-blur-md border shadow-sm transition-all duration-200 text-gray-800",
        interactive && "cursor-pointer hover:-translate-y-1 hover:shadow-md",
        colorBorders[glowColor],
        className
      )}
      {...props}
    >
      {children}
    </motion.div>
  );
}
