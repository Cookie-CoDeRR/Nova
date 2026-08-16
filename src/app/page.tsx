"use client";

import React, { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { FloatingPages } from "@/components/landing/FloatingPages";
import { Sparkles, Bot, MapPin, Brain, Clock, ArrowRight, CheckCircle2, Play, Pause, RotateCcw, Search, ChevronRight, Zap } from "lucide-react";
import { cn } from "@/lib/utils";

export default function NarrativeLandingPage() {
  const [activeSection, setActiveSection] = useState(0);

  return (
    <div className="min-h-screen w-full bg-[#FAFAFA] text-[#171717] relative font-sans selection:bg-purple-200 selection:text-purple-900 scroll-smooth">
      
      {/* Scroll-Reactive 3D Floating Notebook Pages Background */}
      <FloatingPages />

      {/* Subtle Dot Grid Pattern */}
      <div 
        className="fixed inset-0 pointer-events-none opacity-40 z-0 bg-[radial-gradient(#d4d4d8_1px,transparent_1px)] [background-size:20px_20px]"
        aria-hidden="true"
      />

      {/* Main Content Viewport */}
      <div className="relative z-10 w-full max-w-6xl mx-auto px-4 sm:px-8 pt-6 pb-32 space-y-20">
        
        {/* Top Navbar */}
        <header className="flex items-center justify-between py-3.5 px-6 bg-white/90 backdrop-blur-md border border-neutral-200/90 rounded-full shadow-[0_2px_12px_rgba(0,0,0,0.04)] sticky top-4 z-40">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-black flex items-center justify-center font-bold text-xs text-white">
              N
            </div>
            <span className="font-extrabold text-sm tracking-tight text-neutral-900">NOVA</span>
            <span className="text-[10px] font-mono font-medium px-2.5 py-0.5 rounded-full bg-neutral-100 text-neutral-600 border border-neutral-200">
              Academic Sanctuary
            </span>
          </div>

          <nav className="hidden md:flex items-center gap-8 text-xs font-semibold text-neutral-600">
            <a href="#socratic" className="hover:text-black transition-colors">01. Socratic Tutor</a>
            <a href="#syllabus" className="hover:text-black transition-colors">02. Syllabus Roadmap</a>
            <a href="#knowledge" className="hover:text-black transition-colors">03. Knowledge Base</a>
            <a href="#focus" className="hover:text-black transition-colors">04. Focus Sanctuary</a>
          </nav>

          <div className="flex items-center gap-3">
            <Link
              href="/auth"
              className="text-xs font-semibold text-neutral-700 hover:text-black px-3 py-1.5 transition-colors"
            >
              Sign In
            </Link>
            <Link
              href="/auth"
              className="px-4.5 py-2 rounded-full text-xs font-bold bg-black text-white hover:bg-neutral-800 transition-all shadow-sm flex items-center gap-1.5"
            >
              <span>Get Started</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </header>

        {/* Hero Narrative Intro */}
        <section className="text-center pt-10 pb-8 max-w-3xl mx-auto space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white border border-neutral-200 text-neutral-700 text-xs font-semibold shadow-[2px_2px_0px_rgba(0,0,0,0.05)]"
          >
            <Sparkles className="w-3.5 h-3.5 text-purple-600" />
            <span>Narrative Scroll • Socratic Academic Workspace</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="font-serif text-4xl sm:text-6xl font-bold tracking-tight text-neutral-950 leading-[1.12]"
          >
            Your Personal Academic <br />
            <span className="italic font-normal text-neutral-700">Sanctuary.</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-base sm:text-lg text-neutral-600 max-w-xl mx-auto leading-relaxed font-normal"
          >
            Scroll down to explore how NOVA transforms raw syllabi and lecture notes into a proactive, deep-learning digital companion.
          </motion.p>
        </section>

        {/* NARRATIVE SCROLL SECTION 1: THE SOCRATIC TUTOR */}
        <section id="socratic" className="pt-12 scroll-mt-24">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            {/* Sticky Narrative Text (Left Column) */}
            <div className="lg:col-span-5 space-y-4">
              <span className="text-xs font-mono font-bold text-purple-700 uppercase tracking-widest bg-purple-100/80 border border-purple-200 px-3 py-1 rounded-full">
                01 • Socratic Guidance
              </span>
              
              <h2 className="font-serif text-3xl sm:text-4xl font-bold text-neutral-950 leading-tight">
                Never just get the answer. <br />
                <span className="italic text-neutral-700">Learn the principle.</span>
              </h2>

              <p className="text-sm text-neutral-600 leading-relaxed">
                Most AI tools act like a homework-dumping search engine. NOVA operates as a strict Socratic tutor: breaking complex derivations down into bite-sized questions so you discover the answer yourself.
              </p>

              <div className="space-y-2 pt-2 text-xs font-semibold text-neutral-700">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-purple-600" />
                  <span>Real-time streaming via Gemini 2.5 Flash</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-purple-600" />
                  <span>Quick action prompt chips for instant practice</span>
                </div>
              </div>

              <div className="pt-2">
                <Link
                  href="/tutor"
                  className="inline-flex items-center gap-2 text-xs font-bold bg-black text-white px-5 py-2.5 rounded-full hover:bg-neutral-800 transition-all shadow-sm"
                >
                  <span>Try Socratic Tutor Live</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>

            {/* Visual Mock Window (Right Column) */}
            <div className="lg:col-span-7">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
                className="bg-white border border-neutral-200/90 rounded-2xl p-5 shadow-[4px_4px_0px_rgba(238,242,255,1),0_12px_30px_rgba(0,0,0,0.05)] space-y-4"
              >
                {/* Mock Chat Header */}
                <div className="flex items-center justify-between pb-3 border-b border-neutral-100">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-md bg-purple-100 text-purple-700 flex items-center justify-center font-bold text-xs">
                      <Bot className="w-3.5 h-3.5" />
                    </div>
                    <span className="text-xs font-bold text-neutral-900">NOVA Socratic AI Tutor</span>
                  </div>
                  <span className="text-[10px] font-mono text-purple-700 bg-purple-50 px-2 py-0.5 rounded border border-purple-200">
                    Socratic Mode Active
                  </span>
                </div>

                {/* Mock Message Flow */}
                <div className="space-y-3 font-sans text-xs">
                  <div className="bg-neutral-100/80 border border-neutral-200 p-3.5 rounded-xl ml-auto max-w-[85%] text-neutral-800 font-medium">
                    Can you explain how a Red-Black Tree maintains logarithmic search bounds?
                  </div>

                  <div className="bg-purple-50/70 border border-purple-200/80 p-3.5 rounded-xl mr-auto max-w-[90%] text-neutral-900 space-y-2">
                    <p className="font-bold text-purple-950">💡 Socratic Challenge:</p>
                    <p className="leading-relaxed">
                      Think of it like keeping a balance scale even. Before we look at rotations:
                    </p>
                    <p className="italic text-purple-900 bg-white/80 p-2 rounded border border-purple-200">
                      "What is the maximum allowed ratio between the longest path (red-black nodes) and the shortest path in any valid Red-Black tree?"
                    </p>
                  </div>
                </div>

                {/* Quick Chips */}
                <div className="flex items-center gap-2 pt-1 overflow-x-auto text-[11px]">
                  <span className="px-3 py-1 rounded-full bg-neutral-100 border border-neutral-200 text-neutral-700 font-medium">
                    ✨ Explain this simply
                  </span>
                  <span className="px-3 py-1 rounded-full bg-neutral-100 border border-neutral-200 text-neutral-700 font-medium">
                    🧠 Quiz me on Chapter 4
                  </span>
                </div>
              </motion.div>
            </div>

          </div>
        </section>

        {/* NARRATIVE SCROLL SECTION 2: SYLLABUS ROADMAP PARSER */}
        <section id="syllabus" className="pt-16 scroll-mt-24">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            {/* Visual Mock Window (Left Column) */}
            <div className="lg:col-span-7 order-2 lg:order-1">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
                className="bg-white border border-neutral-200/90 rounded-2xl p-5 shadow-[4px_4px_0px_rgba(220,252,231,1),0_12px_30px_rgba(0,0,0,0.05)] space-y-3"
              >
                <div className="flex items-center justify-between pb-3 border-b border-neutral-100">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-emerald-600" />
                    <span className="text-xs font-bold text-neutral-900">CS 301 Data Structures Roadmap</span>
                  </div>
                  <span className="text-[10px] font-mono font-bold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded border border-emerald-200">
                    4 Milestones Parsed
                  </span>
                </div>

                {/* Mock Milestones */}
                <div className="space-y-2.5 text-xs">
                  <div className="p-3 rounded-xl bg-emerald-50/50 border border-emerald-200 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] font-mono font-bold text-emerald-800">WEEK 1</span>
                      <h4 className="font-bold text-neutral-900">Asymptotic Bounds & Recurrence</h4>
                    </div>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-200/80 text-emerald-900 border border-emerald-300">
                      Easy
                    </span>
                  </div>

                  <div className="p-3 rounded-xl bg-cyan-50/50 border border-cyan-200 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] font-mono font-bold text-cyan-800">WEEK 2</span>
                      <h4 className="font-bold text-neutral-900">Self-Balancing Trees (AVL / Red-Black)</h4>
                    </div>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-cyan-200/80 text-cyan-900 border border-cyan-300">
                      Medium
                    </span>
                  </div>

                  <div className="p-3 rounded-xl bg-pink-50/50 border border-pink-200 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] font-mono font-bold text-pink-800">WEEK 3</span>
                      <h4 className="font-bold text-neutral-900">Dynamic Programming & Memoization</h4>
                    </div>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-pink-200/80 text-pink-900 border border-pink-300">
                      Hard
                    </span>
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Sticky Narrative Text (Right Column) */}
            <div className="lg:col-span-5 space-y-4 order-1 lg:order-2">
              <span className="text-xs font-mono font-bold text-emerald-700 uppercase tracking-widest bg-emerald-100/80 border border-emerald-200 px-3 py-1 rounded-full">
                02 • Curriculum Parser
              </span>
              
              <h2 className="font-serif text-3xl sm:text-4xl font-bold text-neutral-950 leading-tight">
                Turn messy syllabi <br />
                <span className="italic text-neutral-700">into clear weekly milestones.</span>
              </h2>

              <p className="text-sm text-neutral-600 leading-relaxed">
                Paste your course outline, lecture notes, or PDF text. Gemini 1.5 Pro synthesizes a structured chronological roadmap with difficulty tags and topic concept breakdowns.
              </p>

              <div className="pt-2">
                <Link
                  href="/brain"
                  className="inline-flex items-center gap-2 text-xs font-bold bg-black text-white px-5 py-2.5 rounded-full hover:bg-neutral-800 transition-all shadow-sm"
                >
                  <span>Synthesize Your Syllabus</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>

          </div>
        </section>

        {/* NARRATIVE SCROLL SECTION 3: THE KNOWLEDGE BASE */}
        <section id="knowledge" className="pt-16 scroll-mt-24">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            {/* Sticky Narrative Text (Left Column) */}
            <div className="lg:col-span-5 space-y-4">
              <span className="text-xs font-mono font-bold text-blue-700 uppercase tracking-widest bg-blue-100/80 border border-blue-200 px-3 py-1 rounded-full">
                03 • Knowledge Index
              </span>
              
              <h2 className="font-serif text-3xl sm:text-4xl font-bold text-neutral-950 leading-tight">
                Synthesize fragmented notes <br />
                <span className="italic text-neutral-700">into a unified memory bank.</span>
              </h2>

              <p className="text-sm text-neutral-600 leading-relaxed">
                Stop losing lecture outlines across multiple documents. Index all your course notes into NOVA's AI memory bank so the Socratic tutor can reference your exact class formulas.
              </p>

              <div className="pt-2">
                <Link
                  href="/brain"
                  className="inline-flex items-center gap-2 text-xs font-bold bg-black text-white px-5 py-2.5 rounded-full hover:bg-neutral-800 transition-all shadow-sm"
                >
                  <span>Explore Knowledge Bank</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>

            {/* Visual Mock Window (Right Column) */}
            <div className="lg:col-span-7">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
                className="bg-white border border-neutral-200/90 rounded-2xl p-5 shadow-[4px_4px_0px_rgba(219,234,254,1),0_12px_30px_rgba(0,0,0,0.05)] space-y-3"
              >
                <div className="flex items-center justify-between pb-3 border-b border-neutral-100">
                  <div className="flex items-center gap-2">
                    <Brain className="w-4 h-4 text-blue-600" />
                    <span className="text-xs font-bold text-neutral-900">Quantum Physics Cheat Sheet</span>
                  </div>
                  <span className="text-[10px] font-mono bg-blue-100 text-blue-800 px-2 py-0.5 rounded border border-blue-200">
                    AI Index Active
                  </span>
                </div>

                <div className="p-4 rounded-xl bg-neutral-50 border border-neutral-200 text-xs font-mono text-neutral-800 space-y-2 leading-relaxed">
                  <p className="font-bold text-blue-900"># Time-Dependent Schrödinger Equation:</p>
                  <p className="p-2 rounded bg-white border border-neutral-200 text-purple-900 font-semibold">
                    i ℏ (∂Ψ/∂t) = Ĥ Ψ
                  </p>
                  <p className="text-neutral-600 text-[11px]">
                    Key condition: Integral of |Ψ|² over space equals 1.
                  </p>
                </div>
              </motion.div>
            </div>

          </div>
        </section>

        {/* NARRATIVE SCROLL SECTION 4: POMODORO FOCUS SANCTUARY */}
        <section id="focus" className="pt-16 scroll-mt-24">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            {/* Visual Mock Window (Left Column) */}
            <div className="lg:col-span-7 order-2 lg:order-1">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
                className="bg-white border border-neutral-200/90 rounded-2xl p-6 shadow-[4px_4px_0px_rgba(243,232,255,1),0_12px_30px_rgba(0,0,0,0.05)] text-center space-y-4"
              >
                <span className="text-xs font-mono font-bold text-purple-800 bg-purple-100 px-3 py-1 rounded-full border border-purple-200">
                  DEEP FOCUS SANCTUARY
                </span>

                <div className="text-4xl font-black font-mono text-neutral-950 tracking-tighter my-2">
                  25:00
                </div>

                <div className="flex items-center justify-center gap-3">
                  <div className="px-4 py-1.5 rounded-full bg-purple-600 text-white font-bold text-xs shadow-sm flex items-center gap-1.5">
                    <Play className="w-3 h-3 fill-current" />
                    Deep Work Active
                  </div>
                </div>

                <div className="pt-3 border-t border-neutral-100 text-left text-xs space-y-1.5">
                  <span className="text-[10px] font-bold uppercase text-neutral-400 block font-mono">Target Concepts:</span>
                  <div className="flex items-center gap-2 text-neutral-700">
                    <CheckCircle2 className="w-3.5 h-3.5 text-purple-600" />
                    <span>Tree Rotations & Rebalancing Axioms</span>
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Sticky Narrative Text (Right Column) */}
            <div className="lg:col-span-5 space-y-4 order-1 lg:order-2">
              <span className="text-xs font-mono font-bold text-purple-700 uppercase tracking-widest bg-purple-100/80 border border-purple-200 px-3 py-1 rounded-full">
                04 • Deep Work Engine
              </span>
              
              <h2 className="font-serif text-3xl sm:text-4xl font-bold text-neutral-950 leading-tight">
                Enter deep focus <br />
                <span className="italic text-neutral-700">with concept checklists.</span>
              </h2>

              <p className="text-sm text-neutral-600 leading-relaxed">
                Expand any milestone card into a zero-distraction Pomodoro sanctuary. Minimalist circular timers keep you locked into 25-minute study sprints with instant concept checklists.
              </p>

              <div className="pt-2">
                <Link
                  href="/auth"
                  className="inline-flex items-center gap-2 text-xs font-bold bg-black text-white px-5 py-2.5 rounded-full hover:bg-neutral-800 transition-all shadow-sm"
                >
                  <span>Start Focus Session</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>

          </div>
        </section>

        {/* Footer */}
        <footer className="pt-16 border-t border-neutral-200 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-neutral-500">
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded bg-black flex items-center justify-center text-[10px] font-bold text-white">N</div>
            <span className="font-bold text-neutral-900">NOVA Narrative Workspace</span>
            <span>© 2026. Academic Productivity Platform.</span>
          </div>

          <div className="flex items-center gap-6 font-medium">
            <Link href="/tutor" className="hover:text-black transition-colors">Socratic Tutor</Link>
            <Link href="/brain" className="hover:text-black transition-colors">Knowledge Base</Link>
            <Link href="/auth" className="hover:text-black transition-colors">Login</Link>
          </div>
        </footer>

      </div>

      {/* Persistent Glassmorphic Floating "Get Started" Button at Bottom Right */}
      <div className="fixed bottom-6 right-6 z-50">
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.8, type: "spring", stiffness: 260, damping: 20 }}
        >
          <Link
            href="/auth"
            className="flex items-center gap-2 px-5 py-3 rounded-full bg-black/90 backdrop-blur-xl border border-white/20 text-white text-xs font-bold shadow-[0_10px_30px_rgba(0,0,0,0.25)] hover:scale-105 transition-all group"
          >
            <Zap className="w-3.5 h-3.5 text-purple-400 fill-purple-400" />
            <span>Enter Sanctuary</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </motion.div>
      </div>

    </div>
  );
}
