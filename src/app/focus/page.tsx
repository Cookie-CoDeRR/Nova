"use client";

import React from "react";
import { motion } from "framer-motion";
import { PomodoroTimer } from "@/components/focus/PomodoroTimer";
import { TaskSelector } from "@/components/focus/TaskSelector";
import { NovaLogo } from "@/components/ui/NovaLogo";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function FocusSanctuaryPage() {
  return (
    <div className="min-h-screen w-full bg-[#FAFAFA] text-gray-700 relative font-sans selection:bg-purple-100 selection:text-purple-900">
      
      {/* Faint Dot Grid Pattern */}
      <div 
        className="fixed inset-0 pointer-events-none opacity-40 z-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px]"
        aria-hidden="true"
      />

      <div className="relative z-10 w-full max-w-4xl mx-auto px-4 sm:px-8 pt-8 pb-32">
        
        {/* Header */}
        <header className="flex items-center justify-between mb-16">
          <Link 
            href="/dashboard"
            className="flex items-center gap-2 text-xs font-bold text-gray-500 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Dashboard
          </Link>
          
          <div className="flex items-center gap-2.5">
            <NovaLogo size="sm" showText={true} href="/" />
            <span className="text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-full bg-purple-50 text-purple-900 border border-purple-200 uppercase tracking-widest">
              Sanctuary
            </span>
          </div>
        </header>

        {/* Main Content */}
        <main className="space-y-10">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center space-y-4"
          >
            <h1 className="font-serif text-4xl sm:text-5xl font-bold tracking-tight text-gray-900">
              Deep Focus <span className="italic font-normal text-gray-700">Sanctuary.</span>
            </h1>
            <p className="text-sm text-gray-500 max-w-md mx-auto">
              Eliminate distractions. Lock into your flow state. Master the concepts one interval at a time.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <PomodoroTimer />
            <TaskSelector />
          </motion.div>
        </main>

      </div>
    </div>
  );
}
