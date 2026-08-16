"use client";

import React, { useEffect } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";

interface FloatingShapeConfig {
  id: number;
  type: "paper" | "orb";
  initialX: string;
  initialY: string;
  size: number;
  rotate: number;
  color: string;
  borderColor?: string;
  floatDuration: number;
  floatY: [number, number];
  floatRotate: [number, number];
  lines?: number;
  title?: string;
}

const SHAPES_CONFIG: FloatingShapeConfig[] = [
  {
    id: 1,
    type: "paper",
    initialX: "8%",
    initialY: "12%",
    size: 180,
    rotate: -8,
    color: "bg-purple-100/40",
    borderColor: "border-purple-200/50",
    floatDuration: 18,
    floatY: [-15, 20],
    floatRotate: [-8, 6],
    lines: 4,
    title: "CS 301 Memo",
  },
  {
    id: 2,
    type: "orb",
    initialX: "78%",
    initialY: "15%",
    size: 240,
    rotate: 0,
    color: "bg-purple-200/30",
    floatDuration: 22,
    floatY: [-25, 25],
    floatRotate: [0, 0],
  },
  {
    id: 3,
    type: "paper",
    initialX: "82%",
    initialY: "55%",
    size: 200,
    rotate: 12,
    color: "bg-emerald-100/40",
    borderColor: "border-emerald-200/50",
    floatDuration: 20,
    floatY: [15, -20],
    floatRotate: [12, -4],
    lines: 5,
    title: "PHYS Formula",
  },
  {
    id: 4,
    type: "orb",
    initialX: "15%",
    initialY: "65%",
    size: 260,
    rotate: 0,
    color: "bg-amber-100/30",
    floatDuration: 25,
    floatY: [-30, 20],
    floatRotate: [0, 0],
  },
  {
    id: 5,
    type: "paper",
    initialX: "48%",
    initialY: "78%",
    size: 170,
    rotate: -15,
    color: "bg-[#FAFAFA]/80",
    borderColor: "border-gray-200/70",
    floatDuration: 16,
    floatY: [-10, 18],
    floatRotate: [-15, 5],
    lines: 3,
    title: "Socratic Notes",
  },
  {
    id: 6,
    type: "orb",
    initialX: "52%",
    initialY: "25%",
    size: 220,
    rotate: 0,
    color: "bg-blue-100/30",
    floatDuration: 24,
    floatY: [20, -25],
    floatRotate: [0, 0],
  },
];

export function SubtleFloatingBackground() {
  // Mouse Parallax Motion Values
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Smooth springs for mouse sway
  const springX = useSpring(mouseX, { stiffness: 40, damping: 20 });
  const springY = useSpring(mouseY, { stiffness: 40, damping: 20 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const { innerWidth, innerHeight } = window;
      // Calculate normalized mouse displacement from center (-1 to 1)
      const normX = (e.clientX - innerWidth / 2) / (innerWidth / 2);
      const normY = (e.clientY - innerHeight / 2) / (innerHeight / 2);
      mouseX.set(normX);
      mouseY.set(normY);
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [mouseX, mouseY]);

  return (
    <div 
      className="fixed inset-0 pointer-events-none z-0 overflow-hidden bg-[#FAFAFA]"
      aria-hidden="true"
    >
      {/* Faint Dot Grid Pattern */}
      <div className="absolute inset-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px] opacity-70" />

      {/* Floating Abstract Shapes & Orbs */}
      {SHAPES_CONFIG.map((shape) => {
        // Multipliers for parallax sway strength
        const factorX = (shape.id % 2 === 0 ? 1 : -1) * (15 + (shape.id * 5));
        const factorY = (shape.id % 3 === 0 ? 1 : -1) * (15 + (shape.id * 5));

        const parallaxX = useTransform(springX, [-1, 1], [-factorX, factorX]);
        const parallaxY = useTransform(springY, [-1, 1], [-factorY, factorY]);

        return (
          <motion.div
            key={shape.id}
            style={{
              left: shape.initialX,
              top: shape.initialY,
              x: parallaxX,
              y: parallaxY,
            }}
            animate={{
              translateY: shape.floatY,
              rotate: shape.floatRotate,
            }}
            transition={{
              duration: shape.floatDuration,
              repeat: Infinity,
              repeatType: "reverse",
              ease: "easeInOut",
            }}
            className="absolute -translate-x-1/2 -translate-y-1/2 pointer-events-none"
          >
            {shape.type === "orb" ? (
              // Soft Pastel Glowing Orb
              <div
                style={{ width: shape.size, height: shape.size }}
                className={`rounded-full blur-3xl ${shape.color} transition-all duration-1000`}
              />
            ) : (
              // Floating Abstract Paper Card
              <div
                style={{ width: shape.size, height: shape.size * 1.25 }}
                className={`rounded-2xl border ${shape.color} ${shape.borderColor} p-3 shadow-[0_8px_24px_rgba(0,0,0,0.03)] backdrop-blur-xs relative overflow-hidden`}
              >
                {/* Red margin rule */}
                <div className="absolute top-0 bottom-0 left-4 w-px bg-red-200/50" />

                {/* Paper header line */}
                <div className="pl-4 pb-1.5 border-b border-gray-200/40 flex items-center justify-between mb-2">
                  <span className="text-[9px] font-mono font-bold text-gray-400 uppercase tracking-wider">
                    {shape.title}
                  </span>
                  <div className="w-1 h-1 rounded-full bg-purple-400/60" />
                </div>

                {/* Paper ruling lines */}
                <div className="pl-4 space-y-2">
                  {Array.from({ length: shape.lines || 4 }).map((_, idx) => (
                    <div
                      key={idx}
                      className="h-1.5 rounded bg-gray-200/40"
                      style={{ width: `${55 + ((idx * 23) % 35)}%` }}
                    />
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        );
      })}
    </div>
  );
}
