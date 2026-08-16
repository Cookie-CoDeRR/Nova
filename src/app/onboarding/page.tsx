"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { GlobalNotebookBg } from "@/components/ui/GlobalNotebookBg";
import { saveStudentProfile } from "@/lib/userProfile";
import { auth } from "@/lib/firebase";
import { Sparkles, GraduationCap, BookOpen, CheckCircle2, ArrowRight, ArrowLeft, ShieldCheck, Zap, User } from "lucide-react";
import { NovaLogo } from "@/components/ui/NovaLogo";

const SPECIALIZATION_OPTIONS = [
  { id: "fullstack", title: "Full-Stack Web Development", desc: "Next.js, React, Node.js, Cloud APIs" },
  { id: "aiml", title: "AI & Machine Learning", desc: "Neural Networks, Gemini/GPT Prompts" },
  { id: "dsa", title: "Data Structures & Algorithms", desc: "Tree Rotations, Graph Theory, Big-O" },
  { id: "cloud", title: "Cloud & DevOps Architecture", desc: "Vercel, Docker, CI/CD, Kubernetes" },
  { id: "cyber", title: "Cyber Security & Cryptography", desc: "Network Security, Hashing, Web Auth" },
  { id: "quantum", title: "Quantum Physics & Computing", desc: "Schrödinger Equation, Wave Mechanics" },
];

const POPULAR_UNIVERSITIES = [
  "Indian Institute of Technology (IIT) Bombay",
  "Indian Institute of Technology (IIT) Delhi",
  "Anna University, Chennai",
  "BITS Pilani",
  "Delhi Technological University (DTU)",
  "Vellore Institute of Technology (VIT)",
  "National Institute of Technology (NIT) Trichy",
];

export default function OnboardingPage() {
  const [step, setStep] = useState<1 | 2>(1);
  const [displayName, setDisplayName] = useState("");
  const [university, setUniversity] = useState(POPULAR_UNIVERSITIES[0]);
  const [customUniversity, setCustomUniversity] = useState("");
  const [currentYear, setCurrentYear] = useState("3rd Year Computer Science & Engineering");
  const [rollNumber, setRollNumber] = useState("2023CSB1042");
  
  const [selectedSpecs, setSelectedSpecs] = useState<string[]>([
    "Full-Stack Web Development",
    "Data Structures & Algorithms",
  ]);
  const [primaryGoal, setPrimaryGoal] = useState("Master Coursework & Ace Midterm Socratic Exams");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const user = auth.currentUser;
    if (user?.displayName) {
      setDisplayName(user.displayName);
    } else {
      setDisplayName("Alex Sharma");
    }
  }, []);

  const toggleSpecialization = (title: string) => {
    if (selectedSpecs.includes(title)) {
      if (selectedSpecs.length > 1) {
        setSelectedSpecs(selectedSpecs.filter((s) => s !== title));
      }
    } else {
      setSelectedSpecs([...selectedSpecs, title]);
    }
  };

  const handleCompleteOnboarding = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loading) return;
    setLoading(true);

    const finalUniversity = university === "Other" ? customUniversity || "University" : university;

    try {
      await saveStudentProfile({
        displayName: displayName || "Alex Sharma",
        university: finalUniversity,
        currentYear,
        rollNumber,
        specializations: selectedSpecs,
        primaryGoal,
        onboarded: true,
      });
    } catch (err) {
      console.error("Save profile error:", err);
    } finally {
      // Guaranteed immediate redirect so user is never stuck
      window.location.href = "/dashboard";
    }
  };

  return (
    <div className="min-h-screen w-full bg-[#FAFAFA] text-gray-800 flex flex-col justify-center items-center px-4 py-8 relative font-sans selection:bg-purple-100 selection:text-purple-900">
      
      {/* Global Animated Floating Notebook Pages Background */}
      <GlobalNotebookBg />

      {/* Responsive Header Brand Bar */}
      <div className="w-full max-w-2xl flex items-center justify-between mb-6 z-20 px-2 sm:px-0">
        <NovaLogo size="sm" showText={true} href="/" />
        <span className="text-[10px] font-mono font-bold px-2.5 py-1 rounded-full bg-purple-100 text-purple-900 border border-purple-200 shadow-2xs">
          STUDENT ONBOARDING
        </span>
      </div>

      {/* Main Wizard Container (Responsive Mobile & Desktop) */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
        className="w-full max-w-2xl z-10"
      >
        <div className="bg-white/95 backdrop-blur-md border border-gray-200 shadow-xl rounded-3xl p-5 sm:p-8 relative overflow-hidden">
          
          {/* Top Progress Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6 pb-4 border-b border-gray-100">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-2xl bg-purple-100 border border-purple-200 flex items-center justify-center text-purple-800 shrink-0 shadow-2xs">
                <GraduationCap className="w-5 h-5 text-purple-700" />
              </div>
              <div>
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-purple-800 bg-purple-50 px-2 py-0.5 rounded border border-purple-200">
                  Step {step} of 2 • Setup Profile
                </span>
                <h1 className="text-lg sm:text-xl font-bold text-gray-900 tracking-tight font-serif mt-0.5">
                  {step === 1 ? "Academic Details & College Setup" : "Specialization & Socratic Goals"}
                </h1>
              </div>
            </div>

            <div className="flex items-center gap-1.5 self-end sm:self-auto">
              <div className={`w-8 h-2 rounded-full transition-all ${step >= 1 ? "bg-purple-600" : "bg-gray-200"}`} />
              <div className={`w-8 h-2 rounded-full transition-all ${step >= 2 ? "bg-purple-600" : "bg-gray-200"}`} />
            </div>
          </div>

          <form onSubmit={handleCompleteOnboarding}>
            <AnimatePresence mode="wait">
              {step === 1 ? (
                <motion.div
                  key="step1"
                  initial={{ opacity: 0, x: -15 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 15 }}
                  transition={{ duration: 0.2 }}
                  className="space-y-4"
                >
                  <div>
                    <label className="text-xs font-bold text-gray-700 block mb-1 flex items-center gap-1.5 font-mono">
                      <User className="w-3.5 h-3.5 text-purple-700" /> Full Name
                    </label>
                    <input
                      type="text"
                      required
                      value={displayName}
                      onChange={(e) => setDisplayName(e.target.value)}
                      placeholder="e.g. Alex Sharma"
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3.5 py-2.5 text-xs text-gray-900 font-medium focus:outline-none focus:border-gray-400"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-gray-700 block mb-1 flex items-center gap-1.5 font-mono">
                      <GraduationCap className="w-3.5 h-3.5 text-purple-700" /> Select University / College
                    </label>
                    <select
                      value={university}
                      onChange={(e) => setUniversity(e.target.value)}
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3.5 py-2.5 text-xs text-gray-900 font-medium focus:outline-none focus:border-gray-400"
                    >
                      {POPULAR_UNIVERSITIES.map((u, idx) => (
                        <option key={idx} value={u}>
                          {u}
                        </option>
                      ))}
                      <option value="Other">Other Institution</option>
                    </select>

                    {university === "Other" && (
                      <input
                        type="text"
                        required
                        value={customUniversity}
                        onChange={(e) => setCustomUniversity(e.target.value)}
                        placeholder="Enter your University or College Name..."
                        className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3.5 py-2.5 text-xs text-gray-900 font-medium focus:outline-none focus:border-gray-400 mt-2"
                      />
                    )}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs font-bold text-gray-700 block mb-1 flex items-center gap-1.5 font-mono">
                        <BookOpen className="w-3.5 h-3.5 text-purple-700" /> Academic Year & Major
                      </label>
                      <input
                        type="text"
                        required
                        value={currentYear}
                        onChange={(e) => setCurrentYear(e.target.value)}
                        placeholder="e.g. 3rd Year Computer Science"
                        className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3.5 py-2.5 text-xs text-gray-900 font-medium focus:outline-none focus:border-gray-400"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-bold text-gray-700 block mb-1 flex items-center gap-1.5 font-mono">
                        <ShieldCheck className="w-3.5 h-3.5 text-purple-700" /> Roll Number / Student ID
                      </label>
                      <input
                        type="text"
                        required
                        value={rollNumber}
                        onChange={(e) => setRollNumber(e.target.value)}
                        placeholder="e.g. 2023CSB1042"
                        className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3.5 py-2.5 text-xs text-gray-900 font-medium focus:outline-none focus:border-gray-400"
                      />
                    </div>
                  </div>

                  <div className="pt-3 flex justify-end">
                    <button
                      type="button"
                      onClick={() => setStep(2)}
                      className="w-full sm:w-auto px-6 py-3 rounded-xl font-bold text-xs bg-gray-900 text-white hover:bg-gray-800 transition-all flex items-center justify-center gap-2 shadow-xs cursor-pointer"
                    >
                      <span>Continue to Specialization</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key="step2"
                  initial={{ opacity: 0, x: 15 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -15 }}
                  transition={{ duration: 0.2 }}
                  className="space-y-4"
                >
                  <div>
                    <label className="text-xs font-bold text-gray-700 block mb-2 font-mono uppercase tracking-wider">
                      Select Engineering Specializations (Pick 1 or more):
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 max-h-64 sm:max-h-none overflow-y-auto pr-1">
                      {SPECIALIZATION_OPTIONS.map((spec) => {
                        const isSelected = selectedSpecs.includes(spec.title);

                        return (
                          <div
                            key={spec.id}
                            onClick={() => toggleSpecialization(spec.title)}
                            className={`p-3 rounded-xl border transition-all duration-200 cursor-pointer flex items-start justify-between gap-2.5 ${
                              isSelected
                                ? "bg-purple-50 border-purple-300 shadow-2xs"
                                : "bg-gray-50 border-gray-200 hover:border-gray-300"
                            }`}
                          >
                            <div>
                              <h4 className="text-xs font-bold text-gray-900 mb-0.5">{spec.title}</h4>
                              <p className="text-[10px] text-gray-500 line-clamp-1 font-mono">{spec.desc}</p>
                            </div>
                            <div className={`w-4 h-4 rounded-full border flex items-center justify-center shrink-0 mt-0.5 ${
                              isSelected ? "bg-purple-600 border-purple-700 text-white" : "border-gray-300 bg-white"
                            }`}>
                              {isSelected && <CheckCircle2 className="w-3.5 h-3.5" />}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-bold text-gray-700 block mb-1 flex items-center gap-1.5 font-mono">
                      <Zap className="w-3.5 h-3.5 text-purple-700" /> Primary Academic Goal
                    </label>
                    <input
                      type="text"
                      required
                      value={primaryGoal}
                      onChange={(e) => setPrimaryGoal(e.target.value)}
                      placeholder="e.g. Master Socratic Derivations & Complete All Course Milestones"
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3.5 py-2.5 text-xs text-gray-900 font-medium focus:outline-none focus:border-gray-400"
                    />
                  </div>

                  <div className="pt-3 flex flex-col-reverse sm:flex-row items-center justify-between gap-2.5">
                    <button
                      type="button"
                      onClick={() => setStep(1)}
                      className="w-full sm:w-auto px-4 py-2.5 rounded-xl font-bold text-xs bg-gray-100 border border-gray-200 text-gray-700 hover:bg-gray-200 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <ArrowLeft className="w-4 h-4" />
                      Back
                    </button>

                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full sm:w-auto px-7 py-3 rounded-xl font-bold text-xs bg-purple-600 text-white hover:bg-purple-500 transition-all flex items-center justify-center gap-2 shadow-sm cursor-pointer"
                    >
                      {loading ? "Opening Dashboard..." : "Complete Setup & Open Sanctuary"}
                      <Sparkles className="w-4 h-4 text-amber-300" />
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </form>

        </div>
      </motion.div>

    </div>
  );
}
