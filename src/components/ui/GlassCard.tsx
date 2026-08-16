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
  const glowStyles = {
    none: "",
    purple: "hover:border-purple-500/40 hover:shadow-[0_0_30px_rgba(124,58,237,0.2)]",
    blue: "hover:border-blue-500/40 hover:shadow-[0_0_30px_rgba(59,130,246,0.2)]",
    amber: "hover:border-amber-500/40 hover:shadow-[0_0_30px_rgba(245,158,11,0.2)]",
    emerald: "hover:border-emerald-500/40 hover:shadow-[0_0_30px_rgba(16,185,129,0.2)]",
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      className={cn(
        "rounded-2xl relative overflow-hidden transition-all duration-300",
        interactive ? "glass-panel-interactive cursor-pointer" : "glass-panel",
        glowStyles[glowColor],
        className
      )}
      {...props}
    >
      {children}
    </motion.div>
  );
}
