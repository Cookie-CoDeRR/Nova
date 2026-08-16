"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { motion, AnimatePresence } from "framer-motion";
import { parseSyllabusAction, Milestone } from "@/app/actions/parse-syllabus";
import { Sparkles, Brain, Play, Pause, RotateCcw, X, Target, CheckCircle2, BookOpen, Zap } from "lucide-react";
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

  const { register, handleSubmit, setValue } = useForm<FormInputs>({
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

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.15 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, x: 20 },
    show: { opacity: 1, x: 0, transition: { duration: 0.35, ease: "easeOut" } },
  };

  return (
    <div className="w-full max-w-7xl mx-auto space-y-8 font-sans text-neutral-800 pb-16">
      
      {/* Editorial Serif Title Header Banner */}
      <div className="bg-white border border-neutral-200/80 rounded-2xl p-6 sm:p-8 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-50 text-purple-900 border border-purple-200 text-xs font-bold font-mono">
            <Brain className="w-3.5 h-3.5 text-purple-700" />
            KNOWLEDGE BASE & ROADMAP SYNTHESIZER
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-neutral-950 tracking-tight">
            Syllabus Study Roadmap
          </h1>
          <p className="text-xs sm:text-sm text-neutral-600">
            Paste your syllabus to generate interactive, floating flashcard milestones parsed by Gemini 1.5 Pro.
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          {SAMPLE_SYLLABI.map((s, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => setValue("syllabusText", s.text)}
              className="px-3.5 py-2 rounded-full text-xs font-bold bg-neutral-100 border border-neutral-200/80 text-neutral-700 hover:text-black hover:bg-neutral-200 transition-colors shadow-2xs"
            >
              Load {s.name}
            </button>
          ))}
        </div>
      </div>

      {/* Main Grid: Left Input Zone & Right Roadmap Timeline */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Left Half: Input Zone */}
        <div className="flex flex-col h-full space-y-4">
          <div className="bg-white border border-neutral-200/80 rounded-2xl p-6 sm:p-8 flex-1 flex flex-col justify-between shadow-sm">
            <form onSubmit={handleSubmit(onSubmit)} className="flex-1 flex flex-col justify-between space-y-6">
              <div>
                <label className="text-xs font-bold uppercase font-mono text-purple-900 block mb-2 flex items-center gap-1.5">
                  <BookOpen className="w-4 h-4 text-purple-700" />
                  Paste Course Syllabus or Lecture Notes
                </label>

                <textarea
                  {...register("syllabusText", { required: true })}
                  rows={14}
                  placeholder="Paste your course outline, syllabus breakdown, or exam topics here..."
                  className="w-full bg-neutral-50 border border-neutral-200/80 rounded-2xl p-4 text-xs font-mono text-neutral-900 placeholder-neutral-400 focus:outline-none focus:border-neutral-400 transition-all resize-none font-medium"
                />
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className={cn(
                  "w-full py-4 rounded-2xl font-bold text-sm flex items-center justify-center gap-2 transition-all duration-200 shadow-sm border",
                  isLoading
                    ? "bg-neutral-100 text-neutral-400 border-neutral-200 cursor-wait"
                    : "bg-neutral-950 text-white border-black hover:bg-neutral-800 active:scale-[0.99]"
                )}
              >
                {isLoading ? (
                  <>
                    <Sparkles className="w-4 h-4 animate-spin text-purple-400" />
                    Synthesizing AI Study Roadmap...
                  </>
                ) : (
                  <>
                    <Zap className="w-4 h-4 text-purple-400 fill-purple-400" />
                    Synthesize Roadmap with Gemini 1.5 Pro
                  </>
                )}
              </button>
            </form>
          </div>
        </div>

        {/* Right Half: Vertical Timeline Interactive Floating Flashcards */}
        <div className="flex flex-col space-y-4">
          <div className="flex items-center justify-between px-2">
            <h2 className="text-xs font-bold font-mono uppercase text-neutral-500 flex items-center gap-2 tracking-wider">
              <Target className="w-4 h-4 text-purple-700" />
              Syllabus Study Milestones ({milestones.length})
            </h2>
            <span className="text-[10px] text-neutral-400 font-mono">Interactive Flashcards</span>
          </div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="show"
            className="relative space-y-4 before:absolute before:inset-0 before:left-6 before:w-0.5 before:bg-neutral-200"
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
                  {/* Timeline node dot */}
                  <div className="absolute left-4 top-6 -translate-x-1/2 w-4 h-4 rounded-full bg-white border-2 border-black shadow-xs z-10" />

                  {/* Physical Flashcard styling with lift-on-hover & pastel accents */}
                  <div
                    className={cn(
                      "p-6 rounded-2xl bg-white border border-neutral-200/80 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md cursor-pointer",
                      isHard
                        ? "border-amber-200/80"
                        : isMedium
                        ? "border-emerald-200/80"
                        : "border-purple-200/80"
                    )}
                  >
                    <div className="flex items-start justify-between gap-4 mb-4">
                      <div>
                        <div className="flex items-center gap-2 mb-1.5">
                          <span className="text-[10px] font-mono font-bold px-2.5 py-0.5 rounded bg-neutral-100 text-neutral-800 border border-neutral-200">
                            WEEK {milestone.weekNumber}
                          </span>

                          <span
                            className={cn(
                              "text-[10px] font-bold px-2.5 py-0.5 rounded-full border font-mono",
                              isHard
                                ? "bg-amber-50 text-amber-900 border-amber-200"
                                : isMedium
                                ? "bg-emerald-50 text-emerald-900 border-emerald-200"
                                : "bg-purple-50 text-purple-900 border-purple-200"
                            )}
                          >
                            {milestone.difficulty} Difficulty
                          </span>
                        </div>

                        <h3 className="font-serif text-lg font-bold text-neutral-950 tracking-tight">
                          {milestone.topic}
                        </h3>
                      </div>

                      <button
                        onClick={() => startFocusSession(milestone)}
                        className="px-4 py-2 rounded-full text-xs font-bold bg-neutral-950 text-white hover:bg-neutral-800 transition-all duration-200 flex items-center gap-1.5 shrink-0 shadow-sm"
                      >
                        <Play className="w-3.5 h-3.5 fill-current text-white" />
                        Start Focus
                      </button>
                    </div>

                    {/* Key Concepts */}
                    <div className="pt-3 border-t border-neutral-100 flex items-center gap-1.5 flex-wrap">
                      <span className="text-[10px] font-mono font-bold text-neutral-400 uppercase tracking-wider mr-1">
                        Concepts:
                      </span>
                      {milestone.keyConcepts.map((concept, idx) => (
                        <span
                          key={idx}
                          className="px-3 py-1 rounded-lg text-xs font-medium bg-neutral-50 text-neutral-800 border border-neutral-200/80"
                        >
                          {concept}
                        </span>
                      ))}
                    </div>
                  </div>
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
            className="fixed inset-0 z-50 bg-black/50 backdrop-blur-md flex items-center justify-center p-4"
          >
            <motion.div
              layoutId={`milestone-${activeFocusMilestone.weekNumber}`}
              className="w-full max-w-lg"
            >
              <div className="p-8 bg-white border border-neutral-200/80 rounded-2xl shadow-xl relative font-sans text-neutral-900">
                <button
                  onClick={closeFocusSession}
                  className="absolute top-4 right-4 p-2 rounded-full bg-neutral-100 border border-neutral-200 text-neutral-500 hover:text-black"
                >
                  <X className="w-5 h-5" />
                </button>

                <div className="text-center mb-6">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-50 border border-purple-200 text-purple-900 text-xs font-bold mb-2 font-mono">
                    WEEK {activeFocusMilestone.weekNumber} • {activeFocusMilestone.difficulty} MODE
                  </div>
                  <h2 className="font-serif text-2xl font-bold text-neutral-950 tracking-tight">
                    {activeFocusMilestone.topic}
                  </h2>
                </div>

                <div className="relative flex items-center justify-center my-6">
                  <svg className="w-56 h-56 transform -rotate-90">
                    <circle cx="112" cy="112" r="96" stroke="currentColor" strokeWidth="8" className="text-neutral-100" fill="transparent" />
                    <circle
                      cx="112"
                      cy="112"
                      r="96"
                      stroke="currentColor"
                      strokeWidth="8"
                      strokeDasharray={603.18}
                      strokeDashoffset={603.18 - (603.18 * ((25 * 60 - timerSeconds) / (25 * 60)))}
                      strokeLinecap="round"
                      className="text-purple-600 transition-all duration-1000 ease-linear"
                      fill="transparent"
                    />
                  </svg>

                  <div className="absolute flex flex-col items-center">
                    <span className="text-5xl font-black font-mono tracking-tighter text-neutral-950">
                      {formatTime(timerSeconds)}
                    </span>
                    <span className="text-xs font-bold text-purple-800 uppercase tracking-widest mt-1 font-mono">
                      {isTimerRunning ? "Deep Study Active" : "Session Paused"}
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-center gap-3 my-6">
                  <button
                    onClick={() => {
                      setIsTimerRunning(false);
                      setTimerSeconds(25 * 60);
                    }}
                    className="p-3 rounded-full bg-neutral-100 border border-neutral-200 text-neutral-600 hover:text-black"
                  >
                    <RotateCcw className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => setIsTimerRunning(!isTimerRunning)}
                    className="px-8 py-3.5 rounded-full font-bold text-sm bg-neutral-950 text-white shadow-sm flex items-center gap-2 hover:bg-neutral-800"
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

                <div className="pt-4 border-t border-neutral-100">
                  <span className="text-xs font-bold uppercase font-mono text-neutral-500 block mb-2 text-center">
                    Concepts to Master:
                  </span>
                  <div className="flex flex-wrap items-center justify-center gap-2">
                    {activeFocusMilestone.keyConcepts.map((concept, idx) => (
                      <div
                        key={idx}
                        className="px-3 py-1.5 rounded-xl bg-neutral-50 border border-neutral-200/80 text-xs font-medium text-neutral-800 flex items-center gap-1.5"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                        {concept}
                      </div>
                    ))}
                  </div>
                </div>

              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
