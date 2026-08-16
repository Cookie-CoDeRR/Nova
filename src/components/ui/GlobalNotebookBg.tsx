"use client";

import React, { useEffect } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";

interface NotebookPageConfig {
  id: number;
  initialX: string;
  initialY: string;
  width: number;
  height: number;
  initialRotate: number;
  breatheDuration: number;
  floatY: [number, number, number];
  rotateDegrees: [number, number, number, number];
  title: string;
  lines: number;
}

const NOTEBOOK_PAGES: NotebookPageConfig[] = [
  {
    id: 1,
    initialX: "6%",
    initialY: "10%",
    width: 210,
    height: 270,
    initialRotate: -10,
    breatheDuration: 10,
    floatY: [0, -12, 0],
    rotateDegrees: [-10, -8, -12, -10],
    title: "CS 301 Data Structures",
    lines: 6,
  },
  {
    id: 2,
    initialX: "80%",
    initialY: "14%",
    width: 230,
    height: 290,
    initialRotate: 12,
    breatheDuration: 12,
    floatY: [0, -15, 0],
    rotateDegrees: [12, 14, 10, 12],
    title: "PHYS 202 Quantum Notes",
    lines: 7,
  },
  {
    id: 3,
    initialX: "12%",
    initialY: "58%",
    width: 200,
    height: 260,
    initialRotate: 8,
    breatheDuration: 9,
    floatY: [0, -10, 0],
    rotateDegrees: [8, 10, 6, 8],
    title: "Linear Algebra Proofs",
    lines: 5,
  },
  {
    id: 4,
    initialX: "84%",
    initialY: "62%",
    width: 220,
    height: 280,
    initialRotate: -14,
    breatheDuration: 11,
    floatY: [0, -14, 0],
    rotateDegrees: [-14, -12, -16, -14],
    title: "Socratic Method Axioms",
    lines: 6,
  },
  {
    id: 5,
    initialX: "48%",
    initialY: "82%",
    width: 195,
    height: 250,
    initialRotate: -6,
    breatheDuration: 13,
    floatY: [0, -11, 0],
    rotateDegrees: [-6, -4, -8, -6],
    title: "Focus Milestone Sprint",
    lines: 5,
  },
  {
    id: 6,
    initialX: "52%",
    initialY: "20%",
    width: 205,
    height: 265,
    initialRotate: 6,
    breatheDuration: 10.5,
    floatY: [0, -13, 0],
    rotateDegrees: [6, 8, 4, 6],
    title: "Study Pulse Analytics",
    lines: 6,
  },
  {
    id: 7,
    initialX: "28%",
    initialY: "38%",
    width: 185,
    height: 240,
    initialRotate: -4,
    breatheDuration: 11.5,
    floatY: [0, -9, 0],
    rotateDegrees: [-4, -2, -6, -4],
    title: "Algorithm Derivations",
    lines: 4,
  },
];

export function GlobalNotebookBg() {
  // Mouse Parallax Sway
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springX = useSpring(mouseX, { stiffness: 35, damping: 18 });
  const springY = useSpring(mouseY, { stiffness: 35, damping: 18 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const { innerWidth, innerHeight } = window;
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
      className="fixed inset-0 z-[-1] pointer-events-none overflow-hidden bg-[#FAFAFA]"
      aria-hidden="true"
    >
      {/* Faint Dot Grid Pattern Canvas */}
      <div className="absolute inset-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px] opacity-75" />

      {/* 7 Distinct Soft-White Floating Notebook Page Silhouettes */}
      {NOTEBOOK_PAGES.map((page) => {
        const factorX = (page.id % 2 === 0 ? 1 : -1) * (12 + page.id * 4);
        const factorY = (page.id % 3 === 0 ? 1 : -1) * (12 + page.id * 4);

        const parallaxX = useTransform(springX, [-1, 1], [-factorX, factorX]);
        const parallaxY = useTransform(springY, [-1, 1], [-factorY, factorY]);

        return (
          <motion.div
            key={page.id}
            style={{
              left: page.initialX,
              top: page.initialY,
              x: parallaxX,
              y: parallaxY,
              width: page.width,
              height: page.height,
            }}
            animate={{
              y: page.floatY,
              rotate: page.rotateDegrees,
            }}
            transition={{
              duration: page.breatheDuration,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="absolute -translate-x-1/2 -translate-y-1/2 rounded-2xl bg-white/40 border border-gray-200/60 p-4 shadow-[0_8px_30px_rgba(0,0,0,0.03)] backdrop-blur-xs relative overflow-hidden"
          >
            {/* Red notebook margin rule */}
            <div className="absolute top-0 bottom-0 left-5 w-px bg-red-200/60" />

            {/* Notebook header line */}
            <div className="pl-5 pb-2 border-b border-gray-200/50 flex items-center justify-between mb-3">
              <span className="text-[9px] font-mono font-bold text-gray-400 uppercase tracking-wider">
                {page.title}
              </span>
              <div className="w-1.5 h-1.5 rounded-full bg-purple-400/70" />
            </div>

            {/* Notebook ruling lines */}
            <div className="pl-5 space-y-2.5">
              {Array.from({ length: page.lines }).map((_, idx) => (
                <div
                  key={idx}
                  className="h-1.5 rounded bg-gray-200/50 border-b border-blue-100/30"
                  style={{ width: `${55 + ((idx * 21) % 38)}%` }}
                />
              ))}
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}
