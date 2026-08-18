"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Clock, Flame, Target, TrendingUp, ArrowLeft } from "lucide-react";
import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis,
  CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line,
} from "recharts";
import { FloatingNav } from "@/components/layout/FloatingNav";
import { getStudentProfile, NEW_USER_PROFILE, StudentProfile } from "@/lib/userProfile";

type StatKey = "focus" | "streak" | "milestones" | "accuracy";

// ── Mock Data ─────────────────────────────────────────────────────
const DATA = {
  focus: {
    weekly: [
      { label: "Mon", value: 2.5 }, { label: "Tue", value: 3.0 },
      { label: "Wed", value: 1.5 }, { label: "Thu", value: 4.0 },
      { label: "Fri", value: 3.5 }, { label: "Sat", value: 5.0 },
      { label: "Sun", value: 2.0 },
    ],
    monthly: [
      { label: "Wk 1", value: 14 }, { label: "Wk 2", value: 18 },
      { label: "Wk 3", value: 12 }, { label: "Wk 4", value: 21 },
    ],
    insights: [
      "Your longest focus session was 5h on Saturday.",
      "You study most productively in the evening.",
      "Tip: Try to hit 3h daily to reach your 41h goal faster.",
    ],
  },
  streak: {
    weekly: [
      { label: "Mon", value: 1 }, { label: "Tue", value: 2 },
      { label: "Wed", value: 3 }, { label: "Thu", value: 4 },
      { label: "Fri", value: 5 }, { label: "Sat", value: 6 },
      { label: "Sun", value: 7 },
    ],
    monthly: [
      { label: "Wk 1", value: 5 }, { label: "Wk 2", value: 3 },
      { label: "Wk 3", value: 7 }, { label: "Wk 4", value: 7 },
    ],
    insights: [
      "You hit a 7-day streak this month — personal best!",
      "Your streak breaks usually happen on Wednesdays.",
      "Tip: Study for even 15 minutes on weak days to maintain your streak.",
    ],
  },
  milestones: {
    weekly: [
      { label: "Mon", value: 0 }, { label: "Tue", value: 1 },
      { label: "Wed", value: 1 }, { label: "Thu", value: 2 },
      { label: "Fri", value: 3 }, { label: "Sat", value: 4 },
      { label: "Sun", value: 4 },
    ],
    monthly: [
      { label: "Wk 1", value: 3 }, { label: "Wk 2", value: 5 },
      { label: "Wk 3", value: 2 }, { label: "Wk 4", value: 4 },
    ],
    insights: [
      "You completed 12 of 16 milestones — 75% done!",
      "Week 2 was your most productive milestone week.",
      "Tip: Complete the remaining 4 milestones to unlock your course badge.",
    ],
  },
  accuracy: {
    weekly: [
      { label: "Mon", value: 78 }, { label: "Tue", value: 85 },
      { label: "Wed", value: 80 }, { label: "Thu", value: 90 },
      { label: "Fri", value: 88 }, { label: "Sat", value: 95 },
      { label: "Sun", value: 92 },
    ],
    monthly: [
      { label: "Wk 1", value: 82 }, { label: "Wk 2", value: 87 },
      { label: "Wk 3", value: 84 }, { label: "Wk 4", value: 92 },
    ],
    insights: [
      "Your quiz accuracy improved by 14% this month.",
      "Saturday sessions show your highest accuracy at 95%.",
      "Tip: Review topics where accuracy drops below 80%.",
    ],
  },
};

const TABS: { key: StatKey; label: string; icon: React.ElementType; color: string; bg: string; border: string; unit: string }[] = [
  { key: "focus",      label: "Focus Time",   icon: Clock,       color: "#7C3AED", bg: "bg-purple-50",  border: "border-purple-200", unit: "h"  },
  { key: "streak",     label: "Streak",       icon: Flame,       color: "#D97706", bg: "bg-amber-50",   border: "border-amber-200",  unit: "d"  },
  { key: "milestones", label: "Milestones",   icon: Target,      color: "#059669", bg: "bg-emerald-50", border: "border-emerald-200", unit: ""  },
  { key: "accuracy",   label: "Accuracy",     icon: TrendingUp,  color: "#2563EB", bg: "bg-blue-50",    border: "border-blue-200",   unit: "%" },
];

function ProgressPageContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [activeStat, setActiveStat] = useState<StatKey>(
    (searchParams.get("stat") as StatKey) ?? "focus"
  );
  const [period, setPeriod] = useState<"weekly" | "monthly">("weekly");
  const [profile, setProfile] = useState<StudentProfile>(NEW_USER_PROFILE);

  useEffect(() => {
    getStudentProfile().then(setProfile);
  }, []);

  const tab = TABS.find((t) => t.key === activeStat)!;
  const Icon = tab.icon;
  const chartData = DATA[activeStat][period];

  const values = chartData.map((d) => d.value);
  const avg = (values.reduce((a, b) => a + b, 0) / values.length).toFixed(1);
  const best = Math.max(...values);
  const total = values.reduce((a, b) => a + b, 0);

  const currentValues: Record<StatKey, string | number> = {
    focus: `${profile.totalFocusHours}h`,
    streak: `${profile.streakDays} Days`,
    milestones: `${profile.completedMilestones}/${profile.totalMilestones || 16}`,
    accuracy: `${profile.quizAccuracy}%`,
  };

  return (
    <div className="min-h-screen bg-[#FAFAFA] font-sans pb-32">
      {/* Dot grid */}
      <div className="fixed inset-0 pointer-events-none opacity-40 z-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px]" />

      <div className="relative z-10 w-full max-w-3xl mx-auto px-4 sm:px-8 pt-8 space-y-6">

        {/* Back button */}
        <button
          onClick={() => router.push("/dashboard")}
          className="flex items-center gap-2 text-xs font-bold text-gray-400 hover:text-gray-900 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Dashboard
        </button>

        {/* Page title */}
        <div>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-gray-900 tracking-tight">
            Your <span className="italic font-normal text-gray-500">Progress.</span>
          </h1>
          <p className="text-xs text-gray-400 mt-1">Track your study metrics week by week and month by month.</p>
        </div>

        {/* Stat tab switcher */}
        <div className="grid grid-cols-4 gap-2">
          {TABS.map((t) => {
            const TIcon = t.icon;
            const isActive = activeStat === t.key;
            return (
              <button
                key={t.key}
                onClick={() => setActiveStat(t.key)}
                className={`flex flex-col items-center gap-1.5 py-3 px-2 rounded-2xl border transition-all text-center ${
                  isActive
                    ? `${t.bg} ${t.border} shadow-sm`
                    : "bg-white border-gray-200 hover:border-gray-300"
                }`}
              >
                <TIcon className="w-4 h-4" style={{ color: isActive ? t.color : "#9CA3AF" }} />
                <span className={`text-[10px] font-bold leading-tight ${isActive ? "text-gray-900" : "text-gray-400"}`}>
                  {t.label}
                </span>
              </button>
            );
          })}
        </div>

        {/* Main stat panel */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeStat}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.25 }}
            className={`bg-white border ${tab.border} rounded-3xl overflow-hidden shadow-sm`}
          >
            {/* Header */}
            <div className={`${tab.bg} px-6 pt-6 pb-5 border-b ${tab.border}`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`p-2.5 rounded-xl bg-white border ${tab.border}`}>
                    <Icon className="w-5 h-5" style={{ color: tab.color }} />
                  </div>
                  <div>
                    <h2 className="text-base font-bold text-gray-900">{tab.label}</h2>
                    <p className="text-4xl font-black font-mono text-gray-900 tracking-tight leading-none mt-1">
                      {currentValues[activeStat]}
                    </p>
                    <p className="text-[11px] text-gray-400 mt-0.5">Current Total</p>
                  </div>
                </div>

                {/* Period toggle */}
                <div className="flex p-1 bg-white/70 rounded-full border border-gray-200 self-start">
                  <button
                    onClick={() => setPeriod("weekly")}
                    className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all ${period === "weekly" ? "bg-white text-gray-900 shadow-sm" : "text-gray-400 hover:text-gray-700"}`}
                  >
                    Week
                  </button>
                  <button
                    onClick={() => setPeriod("monthly")}
                    className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all ${period === "monthly" ? "bg-white text-gray-900 shadow-sm" : "text-gray-400 hover:text-gray-700"}`}
                  >
                    Month
                  </button>
                </div>
              </div>
            </div>

            <div className="px-6 py-5 space-y-5">
              {/* Summary tiles */}
              <div className="grid grid-cols-3 gap-3">
                {[
                  { label: period === "weekly" ? "Daily Avg" : "Weekly Avg", value: `${avg}${tab.unit}` },
                  { label: "Best", value: `${best}${tab.unit}`, highlight: true },
                  { label: "Total", value: `${total}${tab.unit}` },
                ].map((s) => (
                  <div key={s.label} className="bg-gray-50 border border-gray-100 rounded-2xl p-3 text-center">
                    <div className="text-lg font-black font-mono" style={{ color: s.highlight ? tab.color : "#111827" }}>
                      {s.value}
                    </div>
                    <div className="text-[10px] text-gray-400 font-mono uppercase tracking-wider mt-0.5">{s.label}</div>
                  </div>
                ))}
              </div>

              {/* Chart */}
              <div className="bg-gray-50 border border-gray-100 rounded-2xl p-4">
                <p className="text-[10px] font-bold font-mono uppercase tracking-widest text-gray-400 mb-4">
                  {period === "weekly" ? "This Week" : "This Month"} — {tab.label}
                </p>
                <ResponsiveContainer width="100%" height={200}>
                  {activeStat === "focus" || activeStat === "accuracy" ? (
                    <AreaChart data={chartData} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
                      <defs>
                        <linearGradient id="grad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor={tab.color} stopOpacity={0.15} />
                          <stop offset="95%" stopColor={tab.color} stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" />
                      <XAxis dataKey="label" tick={{ fontSize: 11, fill: "#9CA3AF" }} axisLine={false} tickLine={false} />
                      <YAxis tick={{ fontSize: 11, fill: "#9CA3AF" }} axisLine={false} tickLine={false} />
                      <Tooltip contentStyle={{ background: "#fff", border: "1px solid #E5E7EB", borderRadius: "12px", fontSize: "11px" }} />
                      <Area type="monotone" dataKey="value" stroke={tab.color} strokeWidth={2.5} fill="url(#grad)" dot={{ r: 4, fill: tab.color, strokeWidth: 0 }} activeDot={{ r: 6 }} />
                    </AreaChart>
                  ) : (
                    <BarChart data={chartData} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" />
                      <XAxis dataKey="label" tick={{ fontSize: 11, fill: "#9CA3AF" }} axisLine={false} tickLine={false} />
                      <YAxis tick={{ fontSize: 11, fill: "#9CA3AF" }} axisLine={false} tickLine={false} />
                      <Tooltip contentStyle={{ background: "#fff", border: "1px solid #E5E7EB", borderRadius: "12px", fontSize: "11px" }} />
                      <Bar dataKey="value" fill={tab.color} radius={[6, 6, 0, 0]} />
                    </BarChart>
                  )}
                </ResponsiveContainer>
              </div>

              {/* Insights */}
              <div className="space-y-2">
                <p className="text-[10px] font-bold font-mono uppercase tracking-widest text-gray-400">AI Insights</p>
                {DATA[activeStat].insights.map((insight, i) => (
                  <div key={i} className={`flex items-start gap-2.5 p-3 rounded-xl ${tab.bg} border ${tab.border}`}>
                    <span className="text-xs font-black font-mono mt-0.5" style={{ color: tab.color }}>{String(i + 1).padStart(2, "0")}</span>
                    <p className="text-xs text-gray-700 leading-relaxed">{insight}</p>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      <FloatingNav />
    </div>
  );
}

export default function ProgressPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#FAFAFA] flex items-center justify-center text-xs text-gray-400">Loading...</div>}>
      <ProgressPageContent />
    </Suspense>
  );
}
