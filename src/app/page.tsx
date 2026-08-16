"use client";

import React, { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Sparkles, Bot, MapPin, Brain, ArrowRight, CheckCircle2, Play, Zap } from "lucide-react";

export default function NarrativeLandingPage() {
  return (
    <div className="min-h-screen w-full bg-black text-neutral-300 relative font-sans selection:bg-purple-600 selection:text-white scroll-smooth">
      
      {/* Subtle Dot Grid Pattern */}
      <div 
        className="fixed inset-0 pointer-events-none opacity-20 z-0 bg-[radial-gradient(#383838_1px,transparent_1px)] [background-size:20px_20px]"
        aria-hidden="true"
      />

      {/* Main Content Viewport */}
      <div className="relative z-10 w-full max-w-6xl mx-auto px-4 sm:px-8 pt-6 pb-32 space-y-20">
        
        {/* Top Navbar */}
        <header className="flex items-center justify-between py-3.5 px-6 bg-black/60 backdrop-blur-md border border-white/10 rounded-full shadow-lg sticky top-4 z-40">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-purple-600 to-blue-500 flex items-center justify-center font-black text-xs text-white shadow-[0_0_12px_rgba(124,58,237,0.5)]">
              N
            </div>
            <span className="font-extrabold text-sm tracking-tight text-white">NOVA</span>
            <span className="text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-full bg-purple-500/10 text-purple-300 border border-purple-500/20">
              Academic Sanctuary
            </span>
          </div>

          <nav className="hidden md:flex items-center gap-8 text-xs font-semibold text-neutral-400">
            <a href="#socratic" className="hover:text-white transition-colors">01. Socratic Tutor</a>
            <a href="#syllabus" className="hover:text-white transition-colors">02. Syllabus Roadmap</a>
            <a href="#knowledge" className="hover:text-white transition-colors">03. Knowledge Base</a>
            <a href="#focus" className="hover:text-white transition-colors">04. Focus Sanctuary</a>
          </nav>

          <div className="flex items-center gap-3">
            <Link
              href="/auth"
              className="text-xs font-semibold text-neutral-300 hover:text-white px-3 py-1.5 transition-colors"
            >
              Sign In
            </Link>
            <Link
              href="/auth"
              className="px-4.5 py-2 rounded-full text-xs font-bold bg-purple-600 text-white hover:bg-purple-500 transition-all shadow-[0_0_20px_rgba(124,58,237,0.4)] flex items-center gap-1.5"
            >
              <span>Get Started</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </header>

        {/* Hero Section */}
        <section className="text-center pt-12 pb-8 max-w-3xl mx-auto space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-300 text-xs font-semibold shadow-xs"
          >
            <Sparkles className="w-3.5 h-3.5 text-purple-400" />
            <span>Proactive AI Academic Companion</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="font-sans text-4xl sm:text-6xl font-bold tracking-tight text-white leading-[1.12]"
          >
            Your Personal Academic <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-indigo-300 to-blue-400">Sanctuary.</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-base sm:text-lg text-neutral-400 max-w-xl mx-auto leading-relaxed font-normal"
          >
            NOVA transforms raw syllabi and lecture notes into a proactive, Socratic digital companion for university students.
          </motion.p>
        </section>

        {/* SECTION 1: THE SOCRATIC TUTOR */}
        <section id="socratic" className="pt-12 scroll-mt-24">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            <div className="lg:col-span-5 space-y-4">
              <span className="text-xs font-mono font-bold text-purple-400 uppercase tracking-widest bg-purple-500/10 border border-purple-500/20 px-3 py-1 rounded-full">
                01 • Socratic Guidance
              </span>
              
              <h2 className="font-sans text-3xl sm:text-4xl font-bold text-white leading-tight">
                Never just get the answer. <br />
                <span className="text-purple-400">Learn the principle.</span>
              </h2>

              <p className="text-sm text-neutral-400 leading-relaxed">
                Most AI tools act like a homework search engine. NOVA operates as a strict Socratic tutor: breaking complex derivations down into leading questions.
              </p>

              <div className="space-y-2 pt-2 text-xs font-semibold text-neutral-300">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-purple-400" />
                  <span>Real-time streaming via Gemini 2.5 Flash</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-purple-400" />
                  <span>Quick action prompt chips for instant practice</span>
                </div>
              </div>

              <div className="pt-2">
                <Link
                  href="/tutor"
                  className="inline-flex items-center gap-2 text-xs font-bold bg-purple-600 text-white px-5 py-2.5 rounded-full hover:bg-purple-500 transition-all shadow-[0_0_15px_rgba(124,58,237,0.4)]"
                >
                  <span>Try Socratic Tutor Live</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>

            <div className="lg:col-span-7">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
                className="bg-[#0A0A0C] border border-neutral-800 rounded-2xl p-5 shadow-xl space-y-4"
              >
                <div className="flex items-center justify-between pb-3 border-b border-neutral-800">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-md bg-purple-500/20 text-purple-400 flex items-center justify-center font-bold text-xs">
                      <Bot className="w-3.5 h-3.5" />
                    </div>
                    <span className="text-xs font-bold text-white">NOVA Socratic AI Tutor</span>
                  </div>
                  <span className="text-[10px] font-mono text-purple-300 bg-purple-500/10 px-2 py-0.5 rounded border border-purple-500/20">
                    Socratic Stream Active
                  </span>
                </div>

                <div className="space-y-3 font-sans text-xs">
                  <div className="bg-neutral-900 border border-white/10 p-3.5 rounded-xl ml-auto max-w-[85%] text-white font-medium">
                    Can you explain how a Red-Black Tree maintains logarithmic search bounds?
                  </div>

                  <div className="bg-[#0A0A0C] border border-neutral-800 border-l-2 border-l-purple-500 p-3.5 rounded-xl mr-auto max-w-[90%] text-neutral-300 space-y-2">
                    <p className="font-bold text-purple-400">💡 Socratic Challenge:</p>
                    <p className="leading-relaxed">
                      Think of it like keeping a balance scale even. Before we look at rotations:
                    </p>
                    <p className="italic text-purple-300 bg-purple-500/10 p-2 rounded border border-purple-500/20">
                      "What is the maximum allowed ratio between the longest path and shortest path in any valid Red-Black tree?"
                    </p>
                  </div>
                </div>
              </motion.div>
            </div>

          </div>
        </section>

        {/* SECTION 2: SYLLABUS ROADMAP PARSER */}
        <section id="syllabus" className="pt-16 scroll-mt-24">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            <div className="lg:col-span-7 order-2 lg:order-1">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
                className="bg-[#0A0A0C] border border-neutral-800 rounded-2xl p-5 shadow-xl space-y-3"
              >
                <div className="flex items-center justify-between pb-3 border-b border-neutral-800">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-emerald-400" />
                    <span className="text-xs font-bold text-white">CS 301 Data Structures Roadmap</span>
                  </div>
                  <span className="text-[10px] font-mono font-bold bg-emerald-500/10 text-emerald-300 px-2 py-0.5 rounded border border-emerald-500/20">
                    4 Milestones Parsed
                  </span>
                </div>

                <div className="space-y-2.5 text-xs">
                  <div className="p-3 rounded-xl bg-neutral-900/60 border border-neutral-800 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] font-mono font-bold text-emerald-400">WEEK 1</span>
                      <h4 className="font-bold text-white">Asymptotic Bounds & Recurrence</h4>
                    </div>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-300 border border-emerald-500/20">
                      Easy
                    </span>
                  </div>

                  <div className="p-3 rounded-xl bg-neutral-900/60 border border-neutral-800 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] font-mono font-bold text-purple-400">WEEK 2</span>
                      <h4 className="font-bold text-white">Self-Balancing Trees (AVL / Red-Black)</h4>
                    </div>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-purple-500/10 text-purple-300 border border-purple-500/20">
                      Medium
                    </span>
                  </div>

                  <div className="p-3 rounded-xl bg-neutral-900/60 border border-neutral-800 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] font-mono font-bold text-amber-400">WEEK 3</span>
                      <h4 className="font-bold text-white">Dynamic Programming & Memoization</h4>
                    </div>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-300 border border-amber-500/20">
                      Hard
                    </span>
                  </div>
                </div>
              </motion.div>
            </div>

            <div className="lg:col-span-5 space-y-4 order-1 lg:order-2">
              <span className="text-xs font-mono font-bold text-emerald-400 uppercase tracking-widest bg-emerald-500/10 border border-emerald-500/20 px-3 py-1 rounded-full">
                02 • Curriculum Parser
              </span>
              
              <h2 className="font-sans text-3xl sm:text-4xl font-bold text-white leading-tight">
                Turn messy syllabi <br />
                <span className="text-emerald-400">into clear weekly milestones.</span>
              </h2>

              <p className="text-sm text-neutral-400 leading-relaxed">
                Paste your course outline or notes. Gemini 1.5 Pro synthesizes a structured chronological roadmap with difficulty tags and concept breakdowns.
              </p>

              <div className="pt-2">
                <Link
                  href="/brain"
                  className="inline-flex items-center gap-2 text-xs font-bold bg-white text-black px-5 py-2.5 rounded-full hover:bg-neutral-200 transition-all shadow-sm"
                >
                  <span>Synthesize Your Syllabus</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>

          </div>
        </section>

        {/* SECTION 3: KNOWLEDGE INDEX */}
        <section id="knowledge" className="pt-16 scroll-mt-24">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            <div className="lg:col-span-5 space-y-4">
              <span className="text-xs font-mono font-bold text-blue-400 uppercase tracking-widest bg-blue-500/10 border border-blue-500/20 px-3 py-1 rounded-full">
                03 • Knowledge Index
              </span>
              
              <h2 className="font-sans text-3xl sm:text-4xl font-bold text-white leading-tight">
                Synthesize fragmented notes <br />
                <span className="text-blue-400">into a unified memory bank.</span>
              </h2>

              <p className="text-sm text-neutral-400 leading-relaxed">
                Index all your course notes into NOVA's AI memory bank so the Socratic tutor can reference your exact class formulas.
              </p>

              <div className="pt-2">
                <Link
                  href="/brain"
                  className="inline-flex items-center gap-2 text-xs font-bold bg-purple-600 text-white px-5 py-2.5 rounded-full hover:bg-purple-500 transition-all shadow-[0_0_15px_rgba(124,58,237,0.4)]"
                >
                  <span>Explore Knowledge Bank</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>

            <div className="lg:col-span-7">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
                className="bg-[#0A0A0C] border border-neutral-800 rounded-2xl p-5 shadow-xl space-y-3"
              >
                <div className="flex items-center justify-between pb-3 border-b border-neutral-800">
                  <div className="flex items-center gap-2">
                    <Brain className="w-4 h-4 text-blue-400" />
                    <span className="text-xs font-bold text-white">Quantum Physics Cheat Sheet</span>
                  </div>
                  <span className="text-[10px] font-mono bg-blue-500/10 text-blue-300 px-2 py-0.5 rounded border border-blue-500/20">
                    AI Index Active
                  </span>
                </div>

                <div className="p-4 rounded-xl bg-neutral-900 border border-neutral-800 text-xs font-mono text-neutral-300 space-y-2 leading-relaxed">
                  <p className="font-bold text-blue-400"># Time-Dependent Schrödinger Equation:</p>
                  <p className="p-2 rounded bg-black border border-purple-500/30 text-purple-300 font-semibold">
                    i ℏ (∂Ψ/∂t) = Ĥ Ψ
                  </p>
                  <p className="text-neutral-400 text-[11px]">
                    Key condition: Integral of |Ψ|² over space equals 1.
                  </p>
                </div>
              </motion.div>
            </div>

          </div>
        </section>

        {/* SECTION 4: POMODORO FOCUS */}
        <section id="focus" className="pt-16 scroll-mt-24">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            <div className="lg:col-span-7 order-2 lg:order-1">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
                className="bg-[#0A0A0C] border border-neutral-800 rounded-2xl p-6 shadow-xl text-center space-y-4"
              >
                <span className="text-xs font-mono font-bold text-purple-300 bg-purple-500/10 px-3 py-1 rounded-full border border-purple-500/20">
                  DEEP FOCUS SANCTUARY
                </span>

                <div className="text-4xl font-black font-mono text-white tracking-tighter my-2">
                  25:00
                </div>

                <div className="flex items-center justify-center gap-3">
                  <div className="px-4 py-1.5 rounded-full bg-purple-600 text-white font-bold text-xs shadow-[0_0_15px_rgba(124,58,237,0.4)] flex items-center gap-1.5">
                    <Play className="w-3 h-3 fill-current" />
                    Deep Work Active
                  </div>
                </div>

                <div className="pt-3 border-t border-neutral-800 text-left text-xs space-y-1.5">
                  <span className="text-[10px] font-bold uppercase text-neutral-500 block font-mono">Target Concepts:</span>
                  <div className="flex items-center gap-2 text-neutral-300">
                    <CheckCircle2 className="w-3.5 h-3.5 text-purple-400" />
                    <span>Tree Rotations & Rebalancing Axioms</span>
                  </div>
                </div>
              </motion.div>
            </div>

            <div className="lg:col-span-5 space-y-4 order-1 lg:order-2">
              <span className="text-xs font-mono font-bold text-purple-400 uppercase tracking-widest bg-purple-500/10 border border-purple-500/20 px-3 py-1 rounded-full">
                04 • Deep Work Engine
              </span>
              
              <h2 className="font-sans text-3xl sm:text-4xl font-bold text-white leading-tight">
                Enter deep focus <br />
                <span className="text-purple-400">with concept checklists.</span>
              </h2>

              <p className="text-sm text-neutral-400 leading-relaxed">
                Expand any milestone card into a zero-distraction Pomodoro sanctuary. Minimalist circular timers keep you locked into 25-minute study sprints.
              </p>

              <div className="pt-2">
                <Link
                  href="/auth"
                  className="inline-flex items-center gap-2 text-xs font-bold bg-purple-600 text-white px-5 py-2.5 rounded-full hover:bg-purple-500 transition-all shadow-[0_0_20px_rgba(124,58,237,0.4)]"
                >
                  <span>Start Focus Session</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>

          </div>
        </section>

        {/* Footer */}
        <footer className="pt-16 border-t border-neutral-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-neutral-500">
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded bg-purple-600 flex items-center justify-center text-[10px] font-bold text-white">N</div>
            <span className="font-bold text-white">NOVA Narrative Workspace</span>
            <span>© 2026. Academic Productivity Platform.</span>
          </div>

          <div className="flex items-center gap-6 font-medium">
            <Link href="/tutor" className="hover:text-white transition-colors">Socratic Tutor</Link>
            <Link href="/brain" className="hover:text-white transition-colors">Knowledge Base</Link>
            <Link href="/auth" className="hover:text-white transition-colors">Login</Link>
          </div>
        </footer>

      </div>

      {/* Floating CTA Button */}
      <div className="fixed bottom-6 right-6 z-50">
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.8, type: "spring", stiffness: 260, damping: 20 }}
        >
          <Link
            href="/auth"
            className="flex items-center gap-2 px-5 py-3 rounded-full bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold shadow-[0_0_25px_rgba(124,58,237,0.5)] transition-all group"
          >
            <Zap className="w-3.5 h-3.5 text-amber-300 fill-amber-300" />
            <span>Enter Sanctuary</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </motion.div>
      </div>

    </div>
  );
}
