"use client";

import React from "react";
import { motion, useScroll, useTransform } from "framer-motion";

interface PageConfig {
  id: number;
  initialX: number;
  initialY: number;
  initialRotate: number;
  width: number;
  height: number;
  parallaxSpeedY: [number, number];
  parallaxRotate: [number, number];
  lines: number;
  title: string;
}

const PAGES_CONFIG: PageConfig[] = [
  {
    id: 1,
    initialX: -120,
    initialY: 100,
    initialRotate: -12,
    width: 220,
    height: 280,
    parallaxSpeedY: [0, -350],
    parallaxRotate: [-12, 15],
    lines: 7,
    title: "CS 301 Notes",
  },
  {
    id: 2,
    initialX: 350,
    initialY: 180,
    initialRotate: 14,
    width: 240,
    height: 300,
    parallaxSpeedY: [0, -450],
    parallaxRotate: [14, -8],
    lines: 8,
    title: "Quantum Physics",
  },
  {
    id: 3,
    initialX: -200,
    initialY: 700,
    initialRotate: 8,
    width: 210,
    height: 270,
    parallaxSpeedY: [0, -300],
    parallaxRotate: [8, -20],
    lines: 6,
    title: "Linear Algebra",
  },
  {
    id: 4,
    initialX: 420,
    initialY: 900,
    initialRotate: -16,
    width: 230,
    height: 290,
    parallaxSpeedY: [0, -500],
    parallaxRotate: [-16, 12],
    lines: 7,
    title: "Machine Learning",
  },
  {
    id: 5,
    initialX: -160,
    initialY: 1400,
    initialRotate: -6,
    width: 220,
    height: 280,
    parallaxSpeedY: [0, -380],
    parallaxRotate: [-6, 18],
    lines: 6,
    title: "Socratic Method",
  },
  {
    id: 6,
    initialX: 380,
    initialY: 1600,
    initialRotate: 10,
    width: 230,
    height: 290,
    parallaxSpeedY: [0, -420],
    parallaxRotate: [10, -15],
    lines: 7,
    title: "Focus Milestones",
  },
];

export function FloatingPages() {
  const { scrollY } = useScroll();

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden" aria-hidden="true">
      {PAGES_CONFIG.map((p) => {
        const yTransform = useTransform(scrollY, [0, 2000], p.parallaxSpeedY);
        const rotateTransform = useTransform(scrollY, [0, 2000], p.parallaxRotate);

        return (
          <motion.div
            key={p.id}
            style={{
              x: p.initialX,
              y: yTransform,
              rotate: rotateTransform,
              width: p.width,
              height: p.height,
              top: p.initialY,
            }}
            className="absolute left-1/2 -translate-x-1/2 bg-white/75 border border-neutral-200/80 rounded-2xl p-4 shadow-[0_12px_30px_rgba(0,0,0,0.04),2px_2px_0px_rgba(0,0,0,0.03)] backdrop-blur-sm transition-shadow hover:shadow-xl"
          >
            {/* Red notebook margin line */}
            <div className="absolute top-0 bottom-0 left-6 w-px bg-red-200/70" />

            {/* Notebook header line */}
            <div className="pl-6 pb-2 border-b border-neutral-200 flex items-center justify-between mb-3">
              <span className="text-[10px] font-mono font-bold text-neutral-400 uppercase tracking-wider">
                {p.title}
              </span>
              <div className="w-1.5 h-1.5 rounded-full bg-purple-400" />
            </div>

            {/* Notebook rule lines */}
            <div className="pl-6 space-y-3">
              {Array.from({ length: p.lines }).map((_, idx) => (
                <div
                  key={idx}
                  className="h-2 rounded bg-neutral-100/90 border-b border-blue-100/40"
                  style={{ width: `${60 + ((idx * 17) % 35)}%` }}
                />
              ))}
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}
