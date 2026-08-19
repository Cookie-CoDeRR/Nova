"use client";

import React, { Suspense, useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { ArrowLeft, BookOpen, CheckCircle2, Circle, Target, Clock } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from "recharts";
import { FloatingNav } from "@/components/layout/FloatingNav";

// --- Mock Detailed Data ---
const SUBJECTS = ["Data Structures", "Quantum Physics", "Linear Algebra", "Machine Learning"];

const MOCK_REPORT_DATA: Record<string, any> = {
  "Data Structures": {
    color: "#8B5CF6",
    progress: 75,
    completed: ["Asymptotic Bounds", "Self-Balancing Trees", "Dynamic Programming", "Graph Traversal Basics"],
    remaining: ["Advanced Graph Algorithms", "Network Flow", "NP-Completeness"],
    next: "Advanced Graph Algorithms",
    graphData: [
      { day: "Mon", hours: 2 }, { day: "Tue", hours: 1.5 }, { day: "Wed", hours: 3 },
      { day: "Thu", hours: 2.5 }, { day: "Fri", hours: 4 }, { day: "Sat", hours: 1 }, { day: "Sun", hours: 0.5 }
    ]
  },
  "Quantum Physics": {
    color: "#3B82F6",
    progress: 40,
    completed: ["State Vectors", "Hilbert Space", "1D Infinite Square Wells"],
    remaining: ["Harmonic Oscillator", "Hydrogen Atom", "Perturbation Theory", "Scattering"],
    next: "Harmonic Oscillator",
    graphData: [
      { day: "Mon", hours: 1 }, { day: "Tue", hours: 3 }, { day: "Wed", hours: 0 },
      { day: "Thu", hours: 4 }, { day: "Fri", hours: 2 }, { day: "Sat", hours: 2 }, { day: "Sun", hours: 0 }
    ]
  },
  "Linear Algebra": {
    color: "#10B981",
    progress: 90,
    completed: ["Systems of Equations", "Vector Spaces", "Eigenvalues & Eigenvectors", "Orthogonality", "SVD"],
    remaining: ["Advanced Applications"],
    next: "Advanced Applications",
    graphData: [
      { day: "Mon", hours: 0 }, { day: "Tue", hours: 1 }, { day: "Wed", hours: 2 },
      { day: "Thu", hours: 1 }, { day: "Fri", hours: 0.5 }, { day: "Sat", hours: 3 }, { day: "Sun", hours: 1 }
    ]
  },
  "Machine Learning": {
    color: "#F59E0B",
    progress: 25,
    completed: ["Linear Regression", "Logistic Regression"],
    remaining: ["Neural Networks", "CNNs", "RNNs", "Transformers", "Reinforcement Learning"],
    next: "Neural Networks",
    graphData: [
      { day: "Mon", hours: 0.5 }, { day: "Tue", hours: 0.5 }, { day: "Wed", hours: 1 },
      { day: "Thu", hours: 0 }, { day: "Fri", hours: 2 }, { day: "Sat", hours: 1 }, { day: "Sun", hours: 1 }
    ]
  }
};

function SubjectReportContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  
  const initialSubject = searchParams.get("subject");
  const [activeSubject, setActiveSubject] = useState<string>(
    SUBJECTS.includes(initialSubject || "") ? initialSubject! : SUBJECTS[0]
  );

  useEffect(() => {
    if (initialSubject && SUBJECTS.includes(initialSubject)) {
      setActiveSubject(initialSubject);
    }
  }, [initialSubject]);

  const report = MOCK_REPORT_DATA[activeSubject];

  return (
    <div className="min-h-screen bg-[#FAFAFA] font-sans pb-32">
      <div className="fixed inset-0 pointer-events-none opacity-40 z-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px]" />

      <div className="relative z-10 w-full max-w-4xl mx-auto px-4 sm:px-8 pt-8 space-y-6">
        
        {/* Header */}
        <button
          onClick={() => router.push("/dashboard")}
          className="flex items-center gap-2 text-xs font-bold text-gray-400 hover:text-gray-900 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Dashboard
        </button>

        <div>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-gray-900 tracking-tight">
            Subject <span className="italic font-normal text-gray-500">Report.</span>
          </h1>
          <p className="text-xs text-gray-400 mt-1">Deep dive into your progress, completed topics, and what's next.</p>
        </div>

        {/* Subject Switcher Tabs */}
        <div className="flex flex-wrap gap-2 mb-6">
          {SUBJECTS.map(subject => {
            const isActive = activeSubject === subject;
            const sColor = MOCK_REPORT_DATA[subject]?.color || "#000";
            return (
              <button
                key={subject}
                onClick={() => setActiveSubject(subject)}
                className={`px-4 py-2 rounded-full text-xs font-bold transition-all border ${
                  isActive 
                    ? "bg-white text-gray-900 shadow-sm border-gray-200" 
                    : "bg-gray-50 text-gray-500 border-transparent hover:bg-gray-100 hover:border-gray-200"
                }`}
              >
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: sColor }} />
                  {subject}
                </div>
              </button>
            )
          })}
        </div>

        {/* Main Content Area */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeSubject}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.25 }}
            className="space-y-6"
          >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              
              {/* Progress Overview Card */}
              <div className="bg-white border border-gray-200 rounded-3xl p-6 shadow-sm flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-2 text-gray-500 mb-2">
                    <Target className="w-4 h-4" />
                    <span className="text-xs font-bold uppercase tracking-wider">Overall Progress</span>
                  </div>
                  <div className="text-4xl font-black font-mono text-gray-900 mb-4" style={{ color: report.color }}>
                    {report.progress}%
                  </div>
                  
                  {/* Progress Bar */}
                  <div className="w-full bg-gray-100 rounded-full h-2 mb-2">
                    <div 
                      className="h-2 rounded-full transition-all duration-1000" 
                      style={{ width: \`\${report.progress}%\`, backgroundColor: report.color }} 
                    />
                  </div>
                  <p className="text-xs text-gray-400 font-medium text-right">{report.completed.length} / {report.completed.length + report.remaining.length} Topics</p>
                </div>
              </div>

              {/* Focus Graph Card */}
              <div className="md:col-span-2 bg-white border border-gray-200 rounded-3xl p-6 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2 text-gray-500">
                    <Clock className="w-4 h-4" />
                    <span className="text-xs font-bold uppercase tracking-wider">Study Hours This Week</span>
                  </div>
                </div>
                <div className="h-40 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={report.graphData} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" vertical={false} />
                      <XAxis dataKey="day" tick={{ fontSize: 10, fill: "#9CA3AF" }} axisLine={false} tickLine={false} />
                      <YAxis tick={{ fontSize: 10, fill: "#9CA3AF" }} axisLine={false} tickLine={false} />
                      <Tooltip 
                        contentStyle={{ borderRadius: '12px', border: '1px solid #e5e7eb', fontSize: '11px', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                        itemStyle={{ fontWeight: 'bold' }}
                      />
                      <Line 
                        type="monotone" 
                        dataKey="hours" 
                        stroke={report.color} 
                        strokeWidth={3} 
                        dot={{ r: 4, fill: report.color, strokeWidth: 2, stroke: '#fff' }} 
                        activeDot={{ r: 6 }} 
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>

            {/* Topics Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* Completed Topics */}
              <div className="bg-white border border-gray-200 rounded-3xl p-6 shadow-sm">
                <div className="flex items-center gap-2 text-gray-900 mb-6 border-b border-gray-100 pb-3">
                  <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                  <h3 className="font-serif text-lg font-bold">Topics Completed</h3>
                </div>
                <div className="space-y-3">
                  {report.completed.map((topic: string, i: number) => (
                    <div key={i} className="flex items-start gap-3 p-3 bg-gray-50 rounded-xl border border-gray-100">
                      <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                      <span className="text-sm text-gray-700 font-medium">{topic}</span>
                    </div>
                  ))}
                  {report.completed.length === 0 && (
                    <p className="text-xs text-gray-400 italic">No topics completed yet.</p>
                  )}
                </div>
              </div>

              {/* Remaining / Next Up */}
              <div className="space-y-6">
                
                {/* Next Up */}
                <div className="bg-white border border-gray-200 rounded-3xl p-6 shadow-sm relative overflow-hidden">
                  <div className="absolute top-0 left-0 w-1 h-full" style={{ backgroundColor: report.color }} />
                  <div className="flex items-center gap-2 text-gray-900 mb-3">
                    <BookOpen className="w-5 h-5" style={{ color: report.color }} />
                    <h3 className="font-serif text-lg font-bold">What to Study Next</h3>
                  </div>
                  <div className="p-4 rounded-xl bg-gray-50 border border-gray-100 flex items-center justify-between">
                    <span className="text-sm font-bold text-gray-900">{report.next}</span>
                    <button 
                      className="text-xs font-bold px-3 py-1.5 rounded-full text-white transition-opacity hover:opacity-90 shadow-sm"
                      style={{ backgroundColor: report.color }}
                    >
                      Start Session
                    </button>
                  </div>
                </div>

                {/* Remaining Topics */}
                <div className="bg-white border border-gray-200 rounded-3xl p-6 shadow-sm">
                  <div className="flex items-center gap-2 text-gray-900 mb-6 border-b border-gray-100 pb-3">
                    <Circle className="w-5 h-5 text-gray-400" />
                    <h3 className="font-serif text-lg font-bold">Remaining Topics</h3>
                  </div>
                  <div className="space-y-3">
                    {report.remaining.map((topic: string, i: number) => (
                      <div key={i} className="flex items-start gap-3 p-3 bg-white rounded-xl border border-gray-100 hover:border-gray-300 transition-colors">
                        <Circle className="w-4 h-4 text-gray-300 shrink-0 mt-0.5" />
                        <span className="text-sm text-gray-600 font-medium">{topic}</span>
                      </div>
                    ))}
                    {report.remaining.length === 0 && (
                      <p className="text-xs text-gray-400 italic">All topics completed! 🎉</p>
                    )}
                  </div>
                </div>

              </div>
            </div>

          </motion.div>
        </AnimatePresence>
      </div>

      <FloatingNav />
    </div>
  );
}

export default function SubjectReportPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#FAFAFA] flex items-center justify-center text-xs text-gray-400">Loading...</div>}>
      <SubjectReportContent />
    </Suspense>
  );
}
