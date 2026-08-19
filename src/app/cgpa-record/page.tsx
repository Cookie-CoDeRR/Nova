"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, GraduationCap, TrendingUp, TrendingDown, Minus, Award } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, ReferenceLine,
} from "recharts";
import { FloatingNav } from "@/components/layout/FloatingNav";

// ─── Types ────────────────────────────────────────────────────────
type CourseType = "B.Tech" | "M.Tech" | "PhD";

interface SemesterRecord {
  sem: string;
  sgpa: number;
  credits: number;
  subjects: { name: string; grade: string; points: number }[];
}

// ─── Mock Data ────────────────────────────────────────────────────
const COURSE_DATA: Record<CourseType, {
  duration: string;
  totalCredits: number;
  semesters: SemesterRecord[];
}> = {
  "B.Tech": {
    duration: "4 Years · 8 Semesters",
    totalCredits: 160,
    semesters: [
      {
        sem: "Sem 1", sgpa: 8.2, credits: 20,
        subjects: [
          { name: "Engineering Mathematics I", grade: "A", points: 9 },
          { name: "Physics", grade: "B+", points: 8 },
          { name: "Programming Fundamentals", grade: "A+", points: 10 },
          { name: "Engineering Drawing", grade: "B", points: 7 },
        ],
      },
      {
        sem: "Sem 2", sgpa: 8.6, credits: 20,
        subjects: [
          { name: "Engineering Mathematics II", grade: "A+", points: 10 },
          { name: "Data Structures", grade: "A", points: 9 },
          { name: "Digital Electronics", grade: "B+", points: 8 },
          { name: "English Communication", grade: "A", points: 9 },
        ],
      },
      {
        sem: "Sem 3", sgpa: 7.9, credits: 22,
        subjects: [
          { name: "Algorithms", grade: "B+", points: 8 },
          { name: "Discrete Mathematics", grade: "B", points: 7 },
          { name: "Computer Organisation", grade: "A", points: 9 },
          { name: "Operating Systems", grade: "B+", points: 8 },
        ],
      },
      {
        sem: "Sem 4", sgpa: 8.8, credits: 22,
        subjects: [
          { name: "Database Systems", grade: "A+", points: 10 },
          { name: "Computer Networks", grade: "A", points: 9 },
          { name: "Theory of Computation", grade: "A", points: 9 },
          { name: "Software Engineering", grade: "B+", points: 8 },
        ],
      },
      {
        sem: "Sem 5", sgpa: 8.5, credits: 20,
        subjects: [
          { name: "Machine Learning", grade: "A", points: 9 },
          { name: "Compiler Design", grade: "B+", points: 8 },
          { name: "Web Technologies", grade: "A+", points: 10 },
          { name: "Elective I", grade: "A", points: 9 },
        ],
      },
      {
        sem: "Sem 6", sgpa: 9.1, credits: 20,
        subjects: [
          { name: "Deep Learning", grade: "A+", points: 10 },
          { name: "Cloud Computing", grade: "A+", points: 10 },
          { name: "Cyber Security", grade: "A", points: 9 },
          { name: "Elective II", grade: "A+", points: 10 },
        ],
      },
    ],
  },
  "M.Tech": {
    duration: "2 Years · 4 Semesters",
    totalCredits: 80,
    semesters: [
      {
        sem: "Sem 1", sgpa: 8.9, credits: 20,
        subjects: [
          { name: "Advanced Algorithms", grade: "A+", points: 10 },
          { name: "Research Methodology", grade: "A", points: 9 },
          { name: "Distributed Systems", grade: "A", points: 9 },
        ],
      },
      {
        sem: "Sem 2", sgpa: 9.2, credits: 20,
        subjects: [
          { name: "Machine Learning Advanced", grade: "A+", points: 10 },
          { name: "Big Data Analytics", grade: "A+", points: 10 },
          { name: "Thesis Preliminary", grade: "A", points: 9 },
        ],
      },
    ],
  },
  "PhD": {
    duration: "3–5 Years · Course Work",
    totalCredits: 48,
    semesters: [
      {
        sem: "Year 1", sgpa: 9.5, credits: 16,
        subjects: [
          { name: "Advanced Topics in AI", grade: "A+", points: 10 },
          { name: "Research Writing", grade: "A+", points: 10 },
        ],
      },
    ],
  },
};

const GRADE_COLOR: Record<string, string> = {
  "A+": "text-emerald-700 bg-emerald-50 border-emerald-200",
  "A": "text-blue-700 bg-blue-50 border-blue-200",
  "B+": "text-purple-700 bg-purple-50 border-purple-200",
  "B": "text-amber-700 bg-amber-50 border-amber-200",
  "C": "text-red-700 bg-red-50 border-red-200",
};

function computeCGPA(semesters: SemesterRecord[]): number {
  const totalWeighted = semesters.reduce((acc, s) => acc + s.sgpa * s.credits, 0);
  const totalCredits = semesters.reduce((acc, s) => acc + s.credits, 0);
  return totalCredits > 0 ? parseFloat((totalWeighted / totalCredits).toFixed(2)) : 0;
}

export default function CgpaRecordPage() {
  const router = useRouter();
  const [activeCourse, setActiveCourse] = useState<CourseType>("B.Tech");
  const [activeSem, setActiveSem] = useState<string | null>(null);

  const courseData = COURSE_DATA[activeCourse];
  const cgpa = computeCGPA(courseData.semesters);
  const chartData = courseData.semesters.map((s) => ({ sem: s.sem, sgpa: s.sgpa }));
  const selectedSem = courseData.semesters.find((s) => s.sem === activeSem);

  const trend = courseData.semesters.length >= 2
    ? courseData.semesters[courseData.semesters.length - 1].sgpa -
      courseData.semesters[courseData.semesters.length - 2].sgpa
    : 0;

  return (
    <div className="min-h-screen bg-[#FAFAFA] font-sans pb-32">
      {/* Dot grid */}
      <div
        className="fixed inset-0 pointer-events-none opacity-40 z-0"
        style={{ backgroundImage: "radial-gradient(#e5e7eb 1px, transparent 1px)", backgroundSize: "16px 16px" }}
      />

      <div className="relative z-10 w-full max-w-4xl mx-auto px-4 sm:px-8 pt-8 space-y-6">

        {/* Back */}
        <button
          onClick={() => router.push("/dashboard")}
          className="flex items-center gap-2 text-xs font-bold text-gray-400 hover:text-gray-900 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Dashboard
        </button>

        {/* Title */}
        <div>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-gray-900 tracking-tight">
            CGPA <span className="italic font-normal text-gray-500">Record.</span>
          </h1>
          <p className="text-xs text-gray-400 mt-1">Semester-wise academic performance across your course.</p>
        </div>

        {/* Course Switcher */}
        <div className="flex flex-wrap gap-2">
          {(Object.keys(COURSE_DATA) as CourseType[]).map((course) => (
            <button
              key={course}
              onClick={() => { setActiveCourse(course); setActiveSem(null); }}
              className={[
                "px-4 py-2 rounded-full text-xs font-bold transition-all border",
                activeCourse === course
                  ? "bg-purple-600 text-white border-purple-600 shadow-sm"
                  : "bg-gray-50 text-gray-500 border-gray-200 hover:border-gray-300 hover:bg-gray-100"
              ].join(" ")}
            >
              {course}
            </button>
          ))}
        </div>

        {/* Overview Strip */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { label: "CGPA", value: cgpa.toFixed(2), accent: "#7C3AED" },
            { label: "Semesters Completed", value: courseData.semesters.length.toString() },
            { label: "Credits Earned", value: courseData.semesters.reduce((a, s) => a + s.credits, 0).toString() },
            {
              label: "Latest SGPA",
              value: courseData.semesters.length > 0
                ? courseData.semesters[courseData.semesters.length - 1].sgpa.toFixed(1)
                : "—",
              trend,
            },
          ].map((item, i) => (
            <div key={i} className="bg-white border border-gray-200 rounded-2xl p-4 shadow-sm text-center">
              <div
                className="text-2xl font-black font-mono"
                style={{ color: item.accent ?? (item.trend !== undefined && item.trend >= 0 ? "#059669" : "#DC2626") }}
              >
                {item.value}
                {item.trend !== undefined && (
                  <span className="text-sm ml-1">
                    {item.trend > 0 ? <TrendingUp className="w-4 h-4 inline text-emerald-500" /> :
                     item.trend < 0 ? <TrendingDown className="w-4 h-4 inline text-red-400" /> :
                     <Minus className="w-4 h-4 inline text-gray-400" />}
                  </span>
                )}
              </div>
              <div className="text-[10px] text-gray-400 font-mono uppercase tracking-wider mt-0.5">{item.label}</div>
            </div>
          ))}
        </div>

        {/* SGPA Chart */}
        <div className="bg-white border border-gray-200 rounded-3xl p-6 shadow-sm">
          <div className="flex items-center gap-2 mb-4 text-gray-500">
            <GraduationCap className="w-4 h-4 text-purple-600" />
            <span className="text-xs font-bold uppercase tracking-wider text-gray-700">SGPA Trend — {activeCourse}</span>
          </div>
          <ResponsiveContainer width="100%" height={180}>
            <LineChart data={chartData} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" vertical={false} />
              <XAxis dataKey="sem" tick={{ fontSize: 10, fill: "#9CA3AF" }} axisLine={false} tickLine={false} />
              <YAxis domain={[6, 10]} tick={{ fontSize: 10, fill: "#9CA3AF" }} axisLine={false} tickLine={false} />
              <Tooltip
                contentStyle={{ borderRadius: "12px", border: "1px solid #e5e7eb", fontSize: "11px" }}
                formatter={(v: number) => [v.toFixed(1), "SGPA"]}
              />
              <ReferenceLine y={cgpa} stroke="#7C3AED" strokeDasharray="4 4" strokeWidth={1.5} label={{ value: "CGPA", position: "right", fontSize: 10, fill: "#7C3AED" }} />
              <Line
                type="monotone"
                dataKey="sgpa"
                stroke="#7C3AED"
                strokeWidth={3}
                dot={{ r: 5, fill: "#7C3AED", strokeWidth: 2, stroke: "#fff" }}
                activeDot={{ r: 7 }}
              />
            </LineChart>
          </ResponsiveContainer>
          <p className="text-[10px] text-gray-400 text-center mt-2">Dashed line = Current CGPA ({cgpa.toFixed(2)})</p>
        </div>

        {/* Semester Cards */}
        <div>
          <p className="text-[10px] font-bold font-mono uppercase tracking-widest text-gray-400 mb-3">
            Click a semester to view subject-wise breakdown
          </p>
          <div className="space-y-3">
            {courseData.semesters.map((sem) => {
              const isOpen = activeSem === sem.sem;
              return (
                <div key={sem.sem} className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
                  <button
                    onClick={() => setActiveSem(isOpen ? null : sem.sem)}
                    className="w-full flex items-center justify-between px-5 py-4 hover:bg-gray-50 transition-colors text-left"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-8 h-8 rounded-full bg-purple-50 border border-purple-200 flex items-center justify-center">
                        <Award className="w-4 h-4 text-purple-600" />
                      </div>
                      <div>
                        <div className="text-sm font-bold text-gray-900">{sem.sem}</div>
                        <div className="text-[10px] text-gray-400 font-mono">{sem.credits} Credits</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="text-right">
                        <div className="text-lg font-black font-mono text-purple-700">{sem.sgpa.toFixed(1)}</div>
                        <div className="text-[10px] text-gray-400 font-mono uppercase">SGPA</div>
                      </div>
                      <span className="text-gray-300 text-sm">{isOpen ? "▲" : "▼"}</span>
                    </div>
                  </button>

                  <AnimatePresence>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.25, ease: "easeInOut" }}
                        className="overflow-hidden"
                      >
                        <div className="px-5 pb-4 pt-2 border-t border-gray-100 space-y-2">
                          <p className="text-[10px] font-bold uppercase font-mono text-gray-400 mb-3 tracking-wider">
                            Subject-wise Grades
                          </p>
                          {sem.subjects.map((subj, i) => (
                            <div
                              key={i}
                              className="flex items-center justify-between p-3 rounded-xl bg-gray-50 border border-gray-100"
                            >
                              <span className="text-sm text-gray-700 font-medium">{subj.name}</span>
                              <div className="flex items-center gap-2">
                                <span className="text-xs font-mono text-gray-400">{subj.points} pts</span>
                                <span
                                  className={[
                                    "text-xs font-bold px-2 py-0.5 rounded-full border",
                                    GRADE_COLOR[subj.grade] ?? "text-gray-700 bg-gray-50 border-gray-200"
                                  ].join(" ")}
                                >
                                  {subj.grade}
                                </span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <FloatingNav />
    </div>
  );
}
