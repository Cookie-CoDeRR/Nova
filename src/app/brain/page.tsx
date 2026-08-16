"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { motion, AnimatePresence } from "framer-motion";
import { parseSyllabusAction, Milestone } from "@/app/actions/parse-syllabus";
import { GlassCard } from "@/components/ui/GlassCard";
import { Sparkles, Brain, Clock, Play, Pause, RotateCcw, X, Target, CheckCircle2, BookOpen, ChevronRight, Zap } from "lucide-react";
import { cn } from "@/lib/utils";

interface FormInputs {
  syllabusText: string;
}

const SAMPLE_SYLLABI = [
  {
    name: "CS 301 Data Structures",
    text: `CS 301 Data Structures & Algorithms Syllabus:
Week 1: Asymptotic Bounds, Big-O Notation, Recurrence Relations.
Week 2: Self-Balancing Trees, Red-Black & AVL Rotations, Augmented Data Structures.
Week 3: Dynamic Programming, Memoization, Longest Common Subsequence, Knapsack.
Week 4: Graph Traversal, Dijkstra's Algorithm, Bellman-Ford, A* Search.`,
  },
  {
    name: "PHYS 202 Quantum Mechanics",
    text: `PHYS 202 Quantum Mechanics Syllabus:
Week 1: State Vectors, Hilbert Space, Wavefunction Normalization, Operators.
Week 2: 1D Infinite Square Wells, Finite Wells, Quantum Tunneling.
Week 3: Harmonic Oscillator, Ladder Operators, Zero-Point Energy.
Week 4: Hydrogen Atom, Angular Momentum, Spherical Harmonics.`,
  },
];

export default function BrainPage() {
  const [milestones, setMilestones] = useState<Milestone[]>([
    {
      weekNumber: 1,
      topic: "Asymptotic Bounds & Recurrence Relations",
      difficulty: "Easy",
      keyConcepts: ["Big-O / Omega / Theta", "Master Theorem", "Recursion Tree Method"],
    },
    {
      weekNumber: 2,
      topic: "Self-Balancing Trees (Red-Black & AVL)",
      difficulty: "Medium",
      keyConcepts: ["Tree Rotations", "Black-Height Invariant", "Augmented Search Trees"],
    },
    {
      weekNumber: 3,
      topic: "Dynamic Programming & Memoization Patterns",
      difficulty: "Hard",
      keyConcepts: ["Optimal Substructure", "Overlapping Subproblems", "Knapsack & Edit Distance"],
    },
  ]);

  const [isLoading, setIsLoading] = useState(false);
  const [activeFocusMilestone, setActiveFocusMilestone] = useState<Milestone | null>(null);

  // Timer State for Pomodoro Focus Mode
  const [timerSeconds, setTimerSeconds] = useState(25 * 60);
  const [isTimerRunning, setIsTimerRunning] = useState(false);

  const { register, handleSubmit, setValue, watch } = useForm<FormInputs>({
    defaultValues: {
      syllabusText: SAMPLE_SYLLABI[0].text,
    },
  });

  const onSubmit = async (data: FormInputs) => {
    if (!data.syllabusText.trim() || isLoading) return;

    setIsLoading(true);
    try {
      const res = await parseSyllabusAction(data.syllabusText);
      if (res.success && res.data) {
        setMilestones(res.data);
      }
    } catch (err) {
      console.error("Syllabus parsing failed:", err);
    } finally {
      setIsLoading(false);
    }
  };

  // Timer effect
  React.useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (isTimerRunning && timerSeconds > 0) {
      interval = setInterval(() => {
        setTimerSeconds((prev) => prev - 1);
      }, 1000);
    } else if (timerSeconds === 0) {
      setIsTimerRunning(false);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isTimerRunning, timerSeconds]);

  const startFocusSession = (milestone: Milestone) => {
    setActiveFocusMilestone(milestone);
    setTimerSeconds(25 * 60);
    setIsTimerRunning(true);
  };

  const closeFocusSession = () => {
    setActiveFocusMilestone(null);
    setIsTimerRunning(false);
  };

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, x: 20 },
    show: { opacity: 1, x: 0, transition: { duration: 0.35, ease: "easeOut" } },
  };

  return (
    <div className="w-full max-w-7xl mx-auto space-y-6">
      
      {/* Top Title Banner */}
      <GlassCard className="p-6 flex flex-col md:flex-row md:items-center justify-between gap-4" glowColor="purple">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-2xl bg-purple-500/10 border border-purple-500/20 text-purple-400">
            <Brain className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-white tracking-tight">Syllabus Knowledge Base & Roadmap Synthesizer</h1>
            <p className="text-xs text-zinc-400">Paste your course syllabus to generate a structured, interactive study roadmap</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {SAMPLE_SYLLABI.map((s, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => setValue("syllabusText", s.text)}
              className="px-3 py-1.5 rounded-full text-xs font-semibold bg-white/5 border border-white/10 text-zinc-300 hover:text-white hover:bg-white/10 transition-colors"
            >
              Load {s.name}
            </button>
          ))}
        </div>
      </GlassCard>

      {/* Main Grid: Left Input Zone & Right Roadmap Timeline */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Left Half: Glassmorphic Input Zone */}
        <div className="flex flex-col h-full space-y-4">
          <GlassCard className="p-6 flex-1 flex flex-col justify-between" glowColor="blue">
            <form onSubmit={handleSubmit(onSubmit)} className="flex-1 flex flex-col justify-between space-y-4">
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-purple-400 block mb-2 flex items-center gap-1.5">
                  <BookOpen className="w-3.5 h-3.5" />
                  Paste Course Syllabus or Lecture Notes
                </label>

                <textarea
                  {...register("syllabusText", { required: true })}
                  rows={14}
                  placeholder="Paste your course outline, syllabus breakdown, or exam topics here..."
                  className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-xs font-mono text-white placeholder-zinc-500 focus:outline-none focus:border-purple-500/50 focus:ring-2 focus:ring-purple-500/20 transition-all resize-none"
                />
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className={cn(
                  "w-full py-3.5 rounded-2xl font-bold text-sm flex items-center justify-center gap-2 transition-all duration-300 shadow-lg border",
                  isLoading
                    ? "bg-purple-900/40 text-purple-300 border-purple-500/30 cursor-wait"
                    : "bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 text-white border-purple-400/40 shadow-[0_0_30px_rgba(124,58,237,0.4)] hover:scale-[1.01] active:scale-[0.99]"
                )}
              >
                {isLoading ? (
                  <>
                    <Sparkles className="w-4 h-4 animate-spin text-purple-300" />
                    Synthesizing AI Study Roadmap...
                  </>
                ) : (
                  <>
                    <Zap className="w-4 h-4 fill-white" />
                    Synthesize Roadmap with Gemini 1.5 Pro
                  </>
                )}
              </button>
            </form>
          </GlassCard>
        </div>

        {/* Right Half: Vertical Timeline Roadmap Visualization */}
        <div className="flex flex-col space-y-4">
          <div className="flex items-center justify-between px-2">
            <h2 className="text-sm font-bold uppercase tracking-wider text-zinc-400 flex items-center gap-2">
              <Target className="w-4 h-4 text-purple-400" />
              Generated Study Milestones ({milestones.length})
            </h2>
            <span className="text-[11px] text-zinc-500 font-mono">Interactive Focus Enabled</span>
          </div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="show"
            className="relative space-y-4 before:absolute before:inset-0 before:left-6 before:w-0.5 before:bg-gradient-to-b before:from-purple-500/50 before:via-blue-500/30 before:to-transparent"
          >
            {milestones.map((milestone) => {
              const isHard = milestone.difficulty === "Hard";
              const isMedium = milestone.difficulty === "Medium";

              return (
                <motion.div
                  key={milestone.weekNumber}
                  variants={itemVariants}
                  layoutId={`milestone-${milestone.weekNumber}`}
                  className="relative pl-12"
                >
                  {/* Timeline node circle */}
                  <div className="absolute left-4 top-5 -translate-x-1/2 w-4 h-4 rounded-full bg-zinc-950 border-2 border-purple-400 shadow-[0_0_12px_rgba(124,58,237,0.8)] z-10" />

                  <GlassCard
                    interactive
                    glowColor={isHard ? "amber" : isMedium ? "purple" : "emerald"}
                    className="p-5 border-white/10 transition-all duration-300"
                  >
                    <div className="flex items-start justify-between gap-4 mb-3">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-white/10 text-zinc-300 border border-white/10">
                            WEEK {milestone.weekNumber}
                          </span>

                          {/* Difficulty Color-Coded Glowing Badges */}
                          <span
                            className={cn(
                              "text-[10px] font-bold px-2.5 py-0.5 rounded-full border shadow-sm",
                              isHard
                                ? "bg-pink-500/20 text-pink-300 border-pink-500/40 shadow-[0_0_15px_rgba(236,72,153,0.3)]"
                                : isMedium
                                ? "bg-cyan-500/20 text-cyan-300 border-cyan-500/40 shadow-[0_0_15px_rgba(6,182,212,0.3)]"
                                : "bg-emerald-500/20 text-emerald-300 border-emerald-500/40 shadow-[0_0_15px_rgba(16,185,129,0.3)]"
                            )}
                          >
                            {milestone.difficulty} Difficulty
                          </span>
                        </div>

                        <h3 className="text-base font-bold text-white tracking-tight">
                          {milestone.topic}
                        </h3>
                      </div>

                      {/* Start Focus Session Button */}
                      <button
                        onClick={() => startFocusSession(milestone)}
                        className="px-3.5 py-1.5 rounded-full text-xs font-bold bg-purple-600/30 text-purple-200 border border-purple-500/40 hover:bg-purple-600 hover:text-white transition-all duration-200 flex items-center gap-1.5 shrink-0 shadow-md"
                      >
                        <Play className="w-3.5 h-3.5 fill-current" />
                        Start Focus Session
                      </button>
                    </div>

                    {/* Key Concepts Pills */}
                    <div className="pt-2 border-t border-white/5 flex items-center gap-1.5 flex-wrap">
                      <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider mr-1">
                        Key Concepts:
                      </span>
                      {milestone.keyConcepts.map((concept, idx) => (
                        <span
                          key={idx}
                          className="px-2.5 py-1 rounded-md text-xs font-medium bg-white/[0.04] text-zinc-300 border border-white/10"
                        >
                          {concept}
                        </span>
                      ))}
                    </div>
                  </GlassCard>
                </motion.div>
              );
            })}
          </motion.div>
        </div>

      </div>

      {/* Focus Mode Expansion Overlay (Pomodoro Timer) */}
      <AnimatePresence>
        {activeFocusMilestone && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/90 backdrop-blur-2xl flex items-center justify-center p-4"
          >
            <motion.div
              layoutId={`milestone-${activeFocusMilestone.weekNumber}`}
              className="w-full max-w-lg"
            >
              <GlassCard className="p-8 border-purple-500/40 shadow-[0_0_80px_rgba(124,58,237,0.35)] relative">
                {/* Close Button */}
                <button
                  onClick={closeFocusSession}
                  className="absolute top-4 right-4 p-2 rounded-full bg-white/5 border border-white/10 text-zinc-400 hover:text-white hover:bg-white/10 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>

                {/* Milestone Info */}
                <div className="text-center mb-6">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/20 border border-purple-500/30 text-purple-300 text-xs font-bold mb-2">
                    WEEK {activeFocusMilestone.weekNumber} • {activeFocusMilestone.difficulty} MODE
                  </div>
                  <h2 className="text-xl font-extrabold text-white tracking-tight">
                    {activeFocusMilestone.topic}
                  </h2>
                </div>

                {/* Minimalist Massive Circular Timer */}
                <div className="relative flex items-center justify-center my-6">
                  <div className="absolute w-52 h-52 rounded-full bg-purple-600/30 blur-3xl" />
                  
                  <svg className="w-56 h-56 transform -rotate-90">
                    <circle cx="112" cy="112" r="96" stroke="currentColor" strokeWidth="8" className="text-white/5" fill="transparent" />
                    <circle
                      cx="112"
                      cy="112"
                      r="96"
                      stroke="currentColor"
                      strokeWidth="8"
                      strokeDasharray={603.18}
                      strokeDashoffset={603.18 - (603.18 * ((25 * 60 - timerSeconds) / (25 * 60)))}
                      strokeLinecap="round"
                      className="text-purple-500 transition-all duration-1000 ease-linear"
                      fill="transparent"
                    />
                  </svg>

                  <div className="absolute flex flex-col items-center">
                    <span className="text-5xl font-black font-mono tracking-tighter text-white drop-shadow-md">
                      {formatTime(timerSeconds)}
                    </span>
                    <span className="text-xs font-bold text-purple-400 uppercase tracking-widest mt-1">
                      {isTimerRunning ? "Deep Study In Progress" : "Session Paused"}
                    </span>
                  </div>
                </div>

                {/* Timer Controls */}
                <div className="flex items-center justify-center gap-3 my-6">
                  <button
                    onClick={() => {
                      setIsTimerRunning(false);
                      setTimerSeconds(25 * 60);
                    }}
                    className="p-3 rounded-full bg-white/5 border border-white/10 text-zinc-400 hover:text-white"
                  >
                    <RotateCcw className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => setIsTimerRunning(!isTimerRunning)}
                    className="px-8 py-3.5 rounded-full font-bold text-sm bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-[0_0_25px_rgba(124,58,237,0.5)] flex items-center gap-2 hover:scale-105 transition-all"
                  >
                    {isTimerRunning ? (
                      <>
                        <Pause className="w-4 h-4 fill-white" />
                        Pause Focus
                      </>
                    ) : (
                      <>
                        <Play className="w-4 h-4 fill-white" />
                        Start Session
                      </>
                    )}
                  </button>
                </div>

                {/* Target Key Concepts List */}
                <div className="pt-4 border-t border-white/10">
                  <span className="text-xs font-bold uppercase tracking-wider text-zinc-400 block mb-2 text-center">
                    Session Focus Concepts to Master:
                  </span>
                  <div className="flex flex-wrap items-center justify-center gap-2">
                    {activeFocusMilestone.keyConcepts.map((concept, idx) => (
                      <div
                        key={idx}
                        className="px-3 py-1.5 rounded-xl bg-white/[0.04] border border-white/10 text-xs font-medium text-purple-200 flex items-center gap-1.5"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5 text-purple-400" />
                        {concept}
                      </div>
                    ))}
                  </div>
                </div>

              </GlassCard>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
