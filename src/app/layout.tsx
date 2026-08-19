"use client";

import React, { useState } from "react";
import "./globals.css";
import { GlowBackground } from "@/components/ui/GlowBackground";
import { FloatingNav } from "@/components/layout/FloatingNav";
import { TopHeader } from "@/components/layout/TopHeader";
import { usePathname } from "next/navigation";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isFocusModeActive, setIsFocusModeActive] = useState(false);
  const pathname = usePathname();

  // FloatingNav and TopHeader should render inside the main authenticated app routes
  const isMainAppRoute = pathname === "/dashboard" || pathname === "/tutor" || pathname === "/brain";
  const showFloatingNav = pathname === "/dashboard" || pathname === "/brain";

  return (
    <html lang="en">
      <head>
        <title>NOVA | AI Student Personalised Assistant</title>
        <meta name="description" content="Proactive digital companion for university students with Socratic AI tutoring, syllabus knowledge base, and focus management." />
      </head>
      <body className="bg-[#FAFAFA] text-gray-700 min-h-screen relative antialiased selection:bg-purple-100 selection:text-purple-900">
        {/* Faint Dot Grid Background */}
        <GlowBackground />

        {/* Global Light Top Header (Main App Only) */}
        {isMainAppRoute && (
          <TopHeader urgentCount={2} />
        )}

        {/* Main Content Viewport */}
        <main className={isMainAppRoute ? (showFloatingNav ? "relative z-10 pb-28 pt-4 px-4 sm:px-8 max-w-7xl mx-auto min-h-[calc(100vh-160px)]" : "relative z-10 pb-8 pt-4 px-4 sm:px-8 max-w-7xl mx-auto min-h-[calc(100vh-160px)]") : "relative z-10"}>
          {children}
        </main>

        {/* Floating Glass Pill Navigation (Main App Only, excluding tutor) */}
        {showFloatingNav && (
          <FloatingNav
            isFocusModeActive={isFocusModeActive}
            onToggleFocusMode={() => setIsFocusModeActive((prev) => !prev)}
          />
        )}
      </body>
    </html>
  );
}
