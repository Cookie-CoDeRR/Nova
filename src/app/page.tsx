"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { FloatingPages } from "@/components/landing/FloatingPages";
import { Sparkles, Bot, MapPin, Brain, ArrowRight, CheckCircle2, Play, Zap } from "lucide-react";
import { NovaLogo } from "@/components/ui/NovaLogo";

export default function NarrativeLandingPage() {
  return (
    <div className="min-h-screen w-full bg-[#FAFAFA] text-gray-700 relative font-sans selection:bg-purple-100 selection:text-purple-900 scroll-smooth">
      
      {/* Scroll-Reactive 3D Floating Notebook Pages Background */}
      <FloatingPages />

      {/* Faint Dot Grid Pattern */}
      <div 
        className="fixed inset-0 pointer-events-none opacity-40 z-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px]"
        aria-hidden="true"
      />

      {/* Main Content Viewport */}
      <div className="relative z-10 w-full max-w-6xl mx-auto px-4 sm:px-8 pt-6 pb-32 space-y-20">
        
        {/* Top Navbar */}
        <header className="flex items-center justify-between py-3 px-6 bg-white/95 backdrop-blur-md border border-gray-200 rounded-full shadow-md sticky top-4 z-40">
          <div className="flex items-center gap-2.5">
            <NovaLogo size="sm" showText={true} href="/" />
            <span className="text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-full bg-purple-50 text-purple-900 border border-purple-200">
              Academic Sanctuary
            </span>
          </div>

          <nav className="hidden md:flex items-center gap-8 text-xs font-semibold text-gray-600">
            <a href="#socratic" className="hover:text-gray-900 transition-colors">01. Socratic Tutor</a>
            <a href="#syllabus" className="hover:text-gray-900 transition-colors">02. Syllabus Roadmap</a>
            <a href="#knowledge" className="hover:text-gray-900 transition-colors">03. Knowledge Base</a>
            <a href="#focus" className="hover:text-gray-900 transition-colors">04. Focus Sanctuary</a>
          </nav>

          <div className="flex items-center gap-3">
            <Link
              href="/auth"
              className="text-xs font-semibold text-gray-700 hover:text-gray-900 px-3 py-1.5 transition-colors"
            >
              Sign In
            </Link>
            <Link
              href="/auth"
              className="px-4.5 py-2 rounded-full text-xs font-bold bg-gray-900 text-white hover:bg-gray-800 transition-all shadow-xs flex items-center gap-1.5"
            >
              <span>Get Started</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </header>

        {/* Hero Section */}
        <section className="text-center pt-10 pb-8 max-w-3xl mx-auto space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white border border-gray-200 text-gray-700 text-xs font-semibold shadow-2xs"
          >
            <Sparkles className="w-3.5 h-3.5 text-purple-600" />
            <span>Narrative Scroll • Socratic Academic Workspace</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="font-serif text-4xl sm:text-6xl font-bold tracking-tight text-gray-900 leading-[1.12]"
          >
            Your Personal Academic <br />
            <span className="italic font-normal text-gray-700">Sanctuary.</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-base sm:text-lg text-gray-600 max-w-xl mx-auto leading-relaxed font-normal"
          >
            Scroll down to explore how NOVA transforms raw syllabi and lecture notes into a proactive, deep-learning digital companion.
          </motion.p>
        </section>

        {/* SECTION 1: THE SOCRATIC TUTOR */}
        <section id="socratic" className="pt-12 scroll-mt-24">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            <div className="lg:col-span-5 space-y-4">
              <span className="text-xs font-mono font-bold text-purple-800 uppercase tracking-widest bg-purple-50 border border-purple-200 px-3 py-1 rounded-full">
                01 • Socratic Guidance
              </span>
              
              <h2 className="font-serif text-3xl sm:text-4xl font-bold text-gray-900 leading-tight">
                Never just get the answer. <br />
                <span className="italic text-gray-700">Learn the principle.</span>
              </h2>

              <p className="text-sm text-gray-600 leading-relaxed">
                Most AI tools act like a homework-dumping search engine. NOVA operates as a strict Socratic tutor: breaking complex derivations down into bite-sized questions so you discover the answer yourself.
              </p>

              <div className="space-y-2 pt-2 text-xs font-semibold text-gray-700">
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
                  className="inline-flex items-center gap-2 text-xs font-bold bg-gray-900 text-white px-5 py-2.5 rounded-full hover:bg-gray-800 transition-all shadow-xs"
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
                className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm space-y-4"
              >
                <div className="flex items-center justify-between pb-3 border-b border-gray-100">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-md bg-purple-100 text-purple-700 flex items-center justify-center font-bold text-xs">
                      <Bot className="w-3.5 h-3.5" />
                    </div>
                    <span className="text-xs font-bold text-gray-900">NOVA Socratic AI Tutor</span>
                  </div>
                  <span className="text-[10px] font-mono text-purple-800 bg-purple-50 px-2 py-0.5 rounded border border-purple-200">
                    Socratic Mode Active
                  </span>
                </div>

                <div className="space-y-3 font-sans text-xs">
                  <div className="bg-gray-900 border border-gray-900 p-3.5 rounded-xl ml-auto max-w-[85%] text-white font-medium">
                    Can you explain how a Red-Black Tree maintains logarithmic search bounds?
                  </div>

                  <div className="bg-purple-50/70 border border-purple-200 p-3.5 rounded-xl mr-auto max-w-[90%] text-gray-900 space-y-2">
                    <p className="font-bold text-purple-950">💡 Socratic Challenge:</p>
                    <p className="leading-relaxed">
                      Think of it like keeping a balance scale even. Before we look at rotations:
                    </p>
                    <p className="italic text-purple-900 bg-white p-2 rounded border border-purple-200">
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
                className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm space-y-3"
              >
                <div className="flex items-center justify-between pb-3 border-b border-gray-100">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-emerald-600" />
                    <span className="text-xs font-bold text-gray-900">CS 301 Data Structures Roadmap</span>
                  </div>
                  <span className="text-[10px] font-mono font-bold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded border border-emerald-200">
                    4 Milestones Parsed
                  </span>
                </div>

                <div className="space-y-2.5 text-xs">
                  <div className="p-3 rounded-xl bg-emerald-50/50 border border-emerald-200 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] font-mono font-bold text-emerald-800">WEEK 1</span>
                      <h4 className="font-bold text-gray-900">Asymptotic Bounds & Recurrence</h4>
                    </div>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-900 border border-emerald-300">
                      Easy
                    </span>
                  </div>

                  <div className="p-3 rounded-xl bg-purple-50/50 border border-purple-200 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] font-mono font-bold text-purple-800">WEEK 2</span>
                      <h4 className="font-bold text-gray-900">Self-Balancing Trees (AVL / Red-Black)</h4>
                    </div>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-purple-100 text-purple-900 border border-purple-300">
                      Medium
                    </span>
                  </div>

                  <div className="p-3 rounded-xl bg-amber-50/50 border border-amber-200 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] font-mono font-bold text-amber-800">WEEK 3</span>
                      <h4 className="font-bold text-gray-900">Dynamic Programming & Memoization</h4>
                    </div>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-900 border border-amber-300">
                      Hard
                    </span>
                  </div>
                </div>
              </motion.div>
            </div>

            <div className="lg:col-span-5 space-y-4 order-1 lg:order-2">
              <span className="text-xs font-mono font-bold text-emerald-700 uppercase tracking-widest bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-full">
                02 • Curriculum Parser
              </span>
              
              <h2 className="font-serif text-3xl sm:text-4xl font-bold text-gray-900 leading-tight">
                Turn messy syllabi <br />
                <span className="italic text-gray-700">into clear weekly milestones.</span>
              </h2>

              <p className="text-sm text-gray-600 leading-relaxed">
                Paste your course outline, lecture notes, or PDF text. Gemini 1.5 Pro synthesizes a structured chronological roadmap with difficulty tags and topic concept breakdowns.
              </p>

              <div className="pt-2">
                <Link
                  href="/brain"
                  className="inline-flex items-center gap-2 text-xs font-bold bg-gray-900 text-white px-5 py-2.5 rounded-full hover:bg-gray-800 transition-all shadow-xs"
                >
                  <span>Synthesize Your Syllabus</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>

          </div>
        </section>

        {/* SECTION 3: THE KNOWLEDGE BASE */}
        <section id="knowledge" className="pt-16 scroll-mt-24">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            <div className="lg:col-span-5 space-y-4">
              <span className="text-xs font-mono font-bold text-blue-700 uppercase tracking-widest bg-blue-50 border border-blue-200 px-3 py-1 rounded-full">
                03 • Knowledge Index
              </span>
              
              <h2 className="font-serif text-3xl sm:text-4xl font-bold text-gray-900 leading-tight">
                Synthesize fragmented notes <br />
                <span className="italic text-gray-700">into a unified memory bank.</span>
              </h2>

              <p className="text-sm text-gray-600 leading-relaxed">
                Index all your course notes into NOVA's AI memory bank so the Socratic tutor can reference your exact class formulas.
              </p>

              <div className="pt-2">
                <Link
                  href="/brain"
                  className="inline-flex items-center gap-2 text-xs font-bold bg-gray-900 text-white px-5 py-2.5 rounded-full hover:bg-gray-800 transition-all shadow-xs"
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
                className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm space-y-3"
              >
                <div className="flex items-center justify-between pb-3 border-b border-gray-100">
                  <div className="flex items-center gap-2">
                    <Brain className="w-4 h-4 text-blue-600" />
                    <span className="text-xs font-bold text-gray-900">Quantum Physics Cheat Sheet</span>
                  </div>
                  <span className="text-[10px] font-mono bg-blue-50 text-blue-800 px-2 py-0.5 rounded border border-blue-200">
                    AI Index Active
                  </span>
                </div>

                <div className="p-4 rounded-xl bg-gray-50 border border-gray-200 text-xs font-mono text-gray-800 space-y-2 leading-relaxed">
                  <p className="font-bold text-blue-900"># Time-Dependent Schrödinger Equation:</p>
                  <p className="p-2 rounded bg-white border border-gray-200 text-purple-900 font-semibold">
                    i ℏ (∂Ψ/∂t) = Ĥ Ψ
                  </p>
                  <p className="text-gray-600 text-[11px]">
                    Key condition: Integral of |Ψ|² over space equals 1.
                  </p>
                </div>
              </motion.div>
            </div>

          </div>
        </section>

        {/* SECTION 4: POMODORO FOCUS SANCTUARY */}
        <section id="focus" className="pt-16 scroll-mt-24">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            <div className="lg:col-span-7 order-2 lg:order-1">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
                className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm text-center space-y-4"
              >
                <span className="text-xs font-mono font-bold text-purple-800 bg-purple-50 px-3 py-1 rounded-full border border-purple-200">
                  DEEP FOCUS SANCTUARY
                </span>

                <div className="text-4xl font-black font-mono text-gray-900 tracking-tighter my-2">
                  25:00
                </div>

                <div className="flex items-center justify-center gap-3">
                  <div className="px-4 py-1.5 rounded-full bg-gray-900 text-white font-bold text-xs shadow-xs flex items-center gap-1.5">
                    <Play className="w-3 h-3 fill-current" />
                    Deep Work Active
                  </div>
                </div>

                <div className="pt-3 border-t border-gray-100 text-left text-xs space-y-1.5">
                  <span className="text-[10px] font-bold uppercase text-gray-400 block font-mono">Target Concepts:</span>
                  <div className="flex items-center gap-2 text-gray-700">
                    <CheckCircle2 className="w-3.5 h-3.5 text-purple-600" />
                    <span>Tree Rotations & Rebalancing Axioms</span>
                  </div>
                </div>
              </motion.div>
            </div>

            <div className="lg:col-span-5 space-y-4 order-1 lg:order-2">
              <span className="text-xs font-mono font-bold text-purple-800 uppercase tracking-widest bg-purple-50 border border-purple-200 px-3 py-1 rounded-full">
                04 • Deep Work Engine
              </span>
              
              <h2 className="font-serif text-3xl sm:text-4xl font-bold text-gray-900 leading-tight">
                Enter deep focus <br />
                <span className="italic text-gray-700">with concept checklists.</span>
              </h2>

              <p className="text-sm text-gray-600 leading-relaxed">
                Expand any milestone card into a zero-distraction Pomodoro sanctuary. Minimalist circular timers keep you locked into 25-minute study sprints.
              </p>

              <div className="pt-2">
                <Link
                  href="/auth"
                  className="inline-flex items-center gap-2 text-xs font-bold bg-gray-900 text-white px-5 py-2.5 rounded-full hover:bg-gray-800 transition-all shadow-xs"
                >
                  <span>Start Focus Session</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>

          </div>
        </section>

        {/* Footer */}
        <footer className="pt-16 border-t border-gray-200 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-gray-500">
          <div className="flex items-center gap-2">
            <NovaLogo size="sm" showText={true} href="/" />
            <span>© 2026. Academic Productivity Platform.</span>
          </div>

          <div className="flex items-center gap-6 font-medium">
            <Link href="/tutor" className="hover:text-gray-900 transition-colors">Socratic Tutor</Link>
            <Link href="/brain" className="hover:text-gray-900 transition-colors">Knowledge Base</Link>
            <Link href="/auth" className="hover:text-gray-900 transition-colors">Login</Link>
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
            className="flex items-center gap-2 px-5 py-3 rounded-full bg-gray-900/90 backdrop-blur-md border border-gray-800 text-white text-xs font-bold shadow-md hover:scale-105 transition-all group"
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
