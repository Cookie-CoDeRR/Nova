"use client";

import React, { useState, useEffect } from "react";
import { X, Clock, Flame, Target, TrendingUp } from "lucide-react";
import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis,
  CartesianGrid, Tooltip, ResponsiveContainer,
} from "recharts";

type StatKey = "focus" | "streak" | "milestones" | "accuracy";

interface StatProgressModalProps {
  statKey: StatKey;
  currentValue: number | string;
  onClose: () => void;
}

// ── Mock weekly data ──────────────────────────────────────────────
const WEEKLY_FOCUS = [
  { day: "Mon", hours: 2.5 }, { day: "Tue", hours: 3.0 },
  { day: "Wed", hours: 1.5 }, { day: "Thu", hours: 4.0 },
  { day: "Fri", hours: 3.5 }, { day: "Sat", hours: 5.0 },
  { day: "Sun", hours: 2.0 },
];
const MONTHLY_FOCUS = [
  { week: "Wk 1", hours: 14 }, { week: "Wk 2", hours: 18 },
  { week: "Wk 3", hours: 12 }, { week: "Wk 4", hours: 21 },
];
const WEEKLY_STREAK = [
  { day: "Mon", streak: 1 }, { day: "Tue", streak: 2 },
  { day: "Wed", streak: 3 }, { day: "Thu", streak: 4 },
  { day: "Fri", streak: 5 }, { day: "Sat", streak: 6 },
  { day: "Sun", streak: 7 },
];
const MONTHLY_STREAK = [
  { week: "Wk 1", streak: 5 }, { week: "Wk 2", streak: 3 },
  { week: "Wk 3", streak: 7 }, { week: "Wk 4", streak: 7 },
];
const WEEKLY_MILESTONES = [
  { day: "Mon", completed: 0 }, { day: "Tue", completed: 1 },
  { day: "Wed", completed: 1 }, { day: "Thu", completed: 2 },
  { day: "Fri", completed: 3 }, { day: "Sat", completed: 4 },
  { day: "Sun", completed: 4 },
];
const MONTHLY_MILESTONES = [
  { week: "Wk 1", completed: 3 }, { week: "Wk 2", completed: 5 },
  { week: "Wk 3", completed: 2 }, { week: "Wk 4", completed: 4 },
];
const WEEKLY_ACCURACY = [
  { day: "Mon", pct: 78 }, { day: "Tue", pct: 85 },
  { day: "Wed", pct: 80 }, { day: "Thu", pct: 90 },
  { day: "Fri", pct: 88 }, { day: "Sat", pct: 95 },
  { day: "Sun", pct: 92 },
];
const MONTHLY_ACCURACY = [
  { week: "Wk 1", pct: 82 }, { week: "Wk 2", pct: 87 },
  { week: "Wk 3", pct: 84 }, { week: "Wk 4", pct: 92 },
];

// ── Config per stat ───────────────────────────────────────────────
const STAT_CONFIG = {
  focus: {
    label: "Focus Time",
    icon: Clock,
    color: "#7C3AED",
    gradient: "from-purple-50 to-white",
    border: "border-purple-200",
    badge: "bg-purple-50 text-purple-800 border-purple-200",
    unit: "h",
    dataKey: "hours",
    weeklyData: WEEKLY_FOCUS,
    monthlyData: MONTHLY_FOCUS,
    weeklyXKey: "day",
    monthlyXKey: "week",
    summary: "Total hours of focused Pomodoro study sessions.",
  },
  streak: {
    label: "Consecutive Streak",
    icon: Flame,
    color: "#D97706",
    gradient: "from-amber-50 to-white",
    border: "border-amber-200",
    badge: "bg-amber-50 text-amber-800 border-amber-200",
    unit: "d",
    dataKey: "streak",
    weeklyData: WEEKLY_STREAK,
    monthlyData: MONTHLY_STREAK,
    weeklyXKey: "day",
    monthlyXKey: "week",
    summary: "Daily study streak — keep it alive every day!",
  },
  milestones: {
    label: "Milestones Conquered",
    icon: Target,
    color: "#059669",
    gradient: "from-emerald-50 to-white",
    border: "border-emerald-200",
    badge: "bg-emerald-50 text-emerald-800 border-emerald-200",
    unit: "",
    dataKey: "completed",
    weeklyData: WEEKLY_MILESTONES,
    monthlyData: MONTHLY_MILESTONES,
    weeklyXKey: "day",
    monthlyXKey: "week",
    summary: "Course milestones completed over time.",
  },
  accuracy: {
    label: "Quiz Mastery Score",
    icon: TrendingUp,
    color: "#2563EB",
    gradient: "from-blue-50 to-white",
    border: "border-blue-200",
    badge: "bg-blue-50 text-blue-800 border-blue-200",
    unit: "%",
    dataKey: "pct",
    weeklyData: WEEKLY_ACCURACY,
    monthlyData: MONTHLY_ACCURACY,
    weeklyXKey: "day",
    monthlyXKey: "week",
    summary: "Your Socratic quiz answer accuracy over time.",
  },
};

export function StatProgressModal({ statKey, currentValue, onClose }: StatProgressModalProps) {
  const [period, setPeriod] = useState<"week" | "month">("week");
  const cfg = STAT_CONFIG[statKey];
  const Icon = cfg.icon;

  // Hide the floating nav and top header while this modal is open
  useEffect(() => {
    document.body.classList.add("stat-modal-open");
    return () => document.body.classList.remove("stat-modal-open");
  }, []);

  const data = period === "week" ? cfg.weeklyData : cfg.monthlyData;
  const xKey = period === "week" ? cfg.weeklyXKey : cfg.monthlyXKey;

  // Summary stats
  const values = data.map((d: any) => d[cfg.dataKey] as number);
  const avg = (values.reduce((a, b) => a + b, 0) / values.length).toFixed(1);
  const best = Math.max(...values);

  return (
    <div className="fixed inset-0 z-[60] bg-gray-900/50 backdrop-blur-sm flex items-center justify-center p-4">
      <div className={`w-full max-w-lg bg-gradient-to-b ${cfg.gradient} border ${cfg.border} rounded-3xl shadow-2xl font-sans overflow-hidden`}>

        {/* Header */}
        <div className="flex items-center justify-between px-6 pt-6 pb-4 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <div className={`p-2.5 rounded-xl border ${cfg.badge}`}>
              <Icon className="w-5 h-5" style={{ color: cfg.color }} />
            </div>
            <div>
              <h2 className="text-base font-bold text-gray-900 tracking-tight">{cfg.label}</h2>
              <p className="text-xs text-gray-400">{cfg.summary}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-gray-100 border border-gray-200 text-gray-500 hover:text-gray-900 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="px-6 py-5 space-y-5">
          {/* Current + Period toggle */}
          <div className="flex items-center justify-between">
            <div>
              <div className="text-4xl font-black font-mono text-gray-900 tracking-tight">
                {currentValue}{cfg.unit}
              </div>
              <div className="text-xs text-gray-400 mt-0.5">Current Total</div>
            </div>

            <div className="flex p-1 bg-gray-100 rounded-full">
              <button
                onClick={() => setPeriod("week")}
                className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all ${
                  period === "week" ? "bg-white text-gray-900 shadow-sm" : "text-gray-500 hover:text-gray-700"
                }`}
              >
                Week
              </button>
              <button
                onClick={() => setPeriod("month")}
                className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all ${
                  period === "month" ? "bg-white text-gray-900 shadow-sm" : "text-gray-500 hover:text-gray-700"
                }`}
              >
                Month
              </button>
            </div>
          </div>

          {/* Mini summary row */}
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-white border border-gray-200 rounded-2xl p-3 text-center">
              <div className="text-lg font-black font-mono text-gray-900">{avg}{cfg.unit}</div>
              <div className="text-[10px] text-gray-400 font-mono uppercase tracking-wider mt-0.5">
                {period === "week" ? "Daily Avg" : "Weekly Avg"}
              </div>
            </div>
            <div className="bg-white border border-gray-200 rounded-2xl p-3 text-center">
              <div className="text-lg font-black font-mono text-gray-900" style={{ color: cfg.color }}>{best}{cfg.unit}</div>
              <div className="text-[10px] text-gray-400 font-mono uppercase tracking-wider mt-0.5">Best</div>
            </div>
          </div>

          {/* Chart */}
          <div className="bg-white border border-gray-100 rounded-2xl p-4">
            <div className="text-[10px] font-bold font-mono uppercase tracking-widest text-gray-400 mb-3">
              {period === "week" ? "This Week" : "This Month"} — {cfg.label}
            </div>
            <ResponsiveContainer width="100%" height={160}>
              {statKey === "focus" || statKey === "accuracy" ? (
                <AreaChart data={data} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="statGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor={cfg.color} stopOpacity={0.15} />
                      <stop offset="95%" stopColor={cfg.color} stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" />
                  <XAxis dataKey={xKey} tick={{ fontSize: 10, fill: "#9CA3AF" }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 10, fill: "#9CA3AF" }} axisLine={false} tickLine={false} />
                  <Tooltip
                    contentStyle={{ background: "#fff", border: "1px solid #E5E7EB", borderRadius: "12px", fontSize: "11px" }}
                    labelStyle={{ fontWeight: 700, color: "#111827" }}
                  />
                  <Area type="monotone" dataKey={cfg.dataKey} stroke={cfg.color} strokeWidth={2} fill="url(#statGrad)" dot={{ r: 4, fill: cfg.color, strokeWidth: 0 }} activeDot={{ r: 5 }} />
                </AreaChart>
              ) : (
                <BarChart data={data} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" />
                  <XAxis dataKey={xKey} tick={{ fontSize: 10, fill: "#9CA3AF" }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 10, fill: "#9CA3AF" }} axisLine={false} tickLine={false} />
                  <Tooltip
                    contentStyle={{ background: "#fff", border: "1px solid #E5E7EB", borderRadius: "12px", fontSize: "11px" }}
                    labelStyle={{ fontWeight: 700, color: "#111827" }}
                  />
                  <Bar dataKey={cfg.dataKey} fill={cfg.color} radius={[6, 6, 0, 0]} />
                </BarChart>
              )}
            </ResponsiveContainer>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 pb-5 text-center">
          <button onClick={onClose} className="text-xs font-bold text-gray-400 hover:text-gray-700 transition-colors">
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
