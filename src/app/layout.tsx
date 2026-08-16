"use client";

import React, { useState } from "react";
import "./globals.css";
import { GlowBackground } from "@/components/ui/GlowBackground";
import { FloatingNav } from "@/components/layout/FloatingNav";
import { TopHeader } from "@/components/layout/TopHeader";
import { PomodoroTimer } from "@/components/dashboard/PomodoroTimer";
import { AnimatePresence } from "framer-motion";
import { usePathname } from "next/navigation";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isFocusModeActive, setIsFocusModeActive] = useState(false);
  const pathname = usePathname();

  const isAuthPage = pathname === "/auth";
  const isLandingPage = pathname === "/";

  return (
    <html lang="en" className="dark">
      <head>
        <title>NOVA | AI Student Personalised Assistant</title>
        <meta name="description" content="Proactive digital companion for university students with Socratic AI tutoring, syllabus knowledge base, and focus management." />
      </head>
      <body className="bg-black text-zinc-100 min-h-screen relative antialiased selection:bg-purple-500 selection:text-white">
        {/* Ambient Glowing Mesh Background */}
        <GlowBackground />

        {/* Global Header (Hidden on /auth page for clean public sanctuary feel) */}
        {!isAuthPage && !isLandingPage && (
          <TopHeader urgentCount={2} studentName="Alex" gpa={3.85} streakDays={7} />
        )}

        {/* Main Content Viewport */}
        <main className={isAuthPage || isLandingPage ? "relative z-10" : "relative z-10 pb-28 pt-4 px-4 sm:px-8 max-w-7xl mx-auto min-h-[calc(100vh-160px)]"}>
          {children}
        </main>

        {/* Floating Pill Navigation (Hidden on /auth page) */}
        {!isAuthPage && (
          <FloatingNav
            isFocusModeActive={isFocusModeActive}
            onToggleFocusMode={() => setIsFocusModeActive((prev) => !prev)}
          />
        )}

        {/* Fullscreen Focus Mode Pomodoro Overlay */}
        <AnimatePresence>
          {isFocusModeActive && (
            <PomodoroTimer
              isFullScreenOverlay
              onCloseOverlay={() => setIsFocusModeActive(false)}
            />
          )}
        </AnimatePresence>
      </body>
    </html>
  );
}
