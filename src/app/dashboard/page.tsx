"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { generateMockHeatmapData, MOCK_SUBJECT_BREAKDOWN, MOCK_MILESTONE_PROGRESS, MOCK_ANALYTICS_SUMMARY, HeatmapDay } from "@/lib/mockData";
import { generateWeeklyReportAction } from "@/app/actions/generate-weekly-report";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";
import { Flame, Clock, Target, Sparkles, TrendingUp, BookOpen, CheckCircle2, ChevronRight, BarChart2, RefreshCw } from "lucide-react";
import { cn } from "@/lib/utils";
import ReactMarkdown from "react-markdown";

export default function StudyPulseDashboardPage() {
  const [heatmapData] = useState<HeatmapDay[]>(generateMockHeatmapData());
  const [hoveredDay, setHoveredDay] = useState<HeatmapDay | null>(null);
  const [weeklyReport, setWeeklyReport] = useState<string | null>(null);
  const [isReportLoading, setIsReportLoading] = useState(false);

  const handleGenerateReport = async () => {
    setIsReportLoading(true);
    try {
      const res = await generateWeeklyReportAction({
        totalHours: MOCK_ANALYTICS_SUMMARY.totalFocusHours,
        streak: MOCK_ANALYTICS_SUMMARY.weeklyStreak,
        completedMilestones: MOCK_MILESTONE_PROGRESS.completed,
        totalMilestones: MOCK_MILESTONE_PROGRESS.total,
        topSubject: MOCK_SUBJECT_BREAKDOWN[0].name,
      });

      if (res.success && res.report) {
        setWeeklyReport(res.report);
      }
    } catch (err) {
      console.error("Failed to generate weekly report:", err);
    } finally {
      setIsReportLoading(false);
    }
  };

  const levelColorMap = {
    0: "bg-neutral-100 hover:bg-neutral-200 border-neutral-200",
    1: "bg-purple-200 hover:bg-purple-300 border-purple-300",
    2: "bg-purple-300 hover:bg-purple-400 border-purple-400",
    3: "bg-purple-500 hover:bg-purple-600 border-purple-600",
    4: "bg-purple-700 hover:bg-purple-800 border-purple-800",
  };

  return (
    <div className="w-full max-w-7xl mx-auto space-y-8 font-sans text-neutral-900 pb-16">
      
      {/* Header Banner */}
      <div className="bg-white border border-neutral-200 rounded-2xl p-6 sm:p-8 shadow-[4px_4px_0px_rgba(0,0,0,0.04)] flex flex-col md:flex-row md:items-center justify-between gap-6 relative overflow-hidden">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-100 text-purple-800 border border-purple-200 text-xs font-bold font-mono">
            <BarChart2 className="w-3.5 h-3.5" />
            ACADEMIC COMMAND CENTER
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-neutral-950 tracking-tight">
            Study Pulse Dashboard
          </h1>
          <p className="text-xs sm:text-sm text-neutral-600">
            Real-time visual tracking of your focus hours, subject mastery, and syllabus milestones.
          </p>
        </div>

        <button
          onClick={handleGenerateReport}
          disabled={isReportLoading}
          className={cn(
            "px-6 py-3.5 rounded-full font-bold text-xs shadow-[3px_3px_0px_rgba(0,0,0,0.15)] flex items-center justify-center gap-2 transition-all duration-200 shrink-0 border",
            isReportLoading
              ? "bg-neutral-100 text-neutral-500 border-neutral-300 cursor-wait"
              : "bg-black text-white hover:bg-neutral-800 border-black active:scale-[0.98]"
          )}
        >
          {isReportLoading ? (
            <>
              <Sparkles className="w-4 h-4 animate-spin text-amber-400" />
              Generating Weekly AI Digest...
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4 text-amber-400" />
              Generate Weekly AI Report
            </>
          )}
        </button>
      </div>

      {/* AI Weekly Report Drawer Display */}
      <AnimatePresence>
        {weeklyReport && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <div className="bg-purple-50/90 border border-purple-200 rounded-2xl p-6 shadow-[4px_4px_0px_rgba(233,213,255,1)] relative">
              <button
                onClick={() => setWeeklyReport(null)}
                className="absolute top-4 right-4 text-xs font-bold text-purple-700 hover:underline"
              >
                Close Report ✕
              </button>
              <div className="prose prose-purple max-w-none text-xs leading-relaxed text-neutral-800 space-y-2">
                <ReactMarkdown>{weeklyReport}</ReactMarkdown>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Key Quick Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Focus Hours */}
        <div className="bg-white border border-neutral-200 rounded-2xl p-5 shadow-[4px_4px_0px_rgba(233,213,255,0.7)] flex flex-col justify-between">
          <div className="flex items-center justify-between text-purple-700">
            <Clock className="w-5 h-5" />
            <span className="text-[10px] font-bold font-mono px-2 py-0.5 rounded bg-purple-100 border border-purple-200">
              THIS WEEK
            </span>
          </div>
          <div className="mt-4">
            <div className="text-3xl font-black font-mono text-neutral-950 tracking-tight">
              {MOCK_ANALYTICS_SUMMARY.totalFocusHours}h
            </div>
            <div className="text-xs text-neutral-600 font-medium mt-0.5">Total Focused Study</div>
          </div>
        </div>

        {/* Weekly Streak */}
        <div className="bg-white border border-neutral-200 rounded-2xl p-5 shadow-[4px_4px_0px_rgba(254,215,170,0.7)] flex flex-col justify-between">
          <div className="flex items-center justify-between text-amber-700">
            <Flame className="w-5 h-5 fill-amber-500/20" />
            <span className="text-[10px] font-bold font-mono px-2 py-0.5 rounded bg-amber-100 border border-amber-200">
              ACTIVE
            </span>
          </div>
          <div className="mt-4">
            <div className="text-3xl font-black font-mono text-neutral-950 tracking-tight flex items-center gap-1">
              <span>{MOCK_ANALYTICS_SUMMARY.weeklyStreak}</span>
              <span className="text-sm font-normal text-neutral-500">Days</span>
            </div>
            <div className="text-xs text-neutral-600 font-medium mt-0.5">Consecutive Streak</div>
          </div>
        </div>

        {/* Milestone Completion */}
        <div className="bg-white border border-neutral-200 rounded-2xl p-5 shadow-[4px_4px_0px_rgba(187,247,208,0.7)] flex flex-col justify-between">
          <div className="flex items-center justify-between text-emerald-700">
            <Target className="w-5 h-5" />
            <span className="text-[10px] font-bold font-mono px-2 py-0.5 rounded bg-emerald-100 border border-emerald-200">
              75% DONE
            </span>
          </div>
          <div className="mt-4">
            <div className="text-3xl font-black font-mono text-neutral-950 tracking-tight">
              {MOCK_MILESTONE_PROGRESS.completed}/{MOCK_MILESTONE_PROGRESS.total}
            </div>
            <div className="text-xs text-neutral-600 font-medium mt-0.5">Milestones Conquered</div>
          </div>
        </div>

        {/* Socratic Practice Accuracy */}
        <div className="bg-white border border-neutral-200 rounded-2xl p-5 shadow-[4px_4px_0px_rgba(219,234,254,0.7)] flex flex-col justify-between">
          <div className="flex items-center justify-between text-blue-700">
            <TrendingUp className="w-5 h-5" />
            <span className="text-[10px] font-bold font-mono px-2 py-0.5 rounded bg-blue-100 border border-blue-200">
              ACCURACY
            </span>
          </div>
          <div className="mt-4">
            <div className="text-3xl font-black font-mono text-neutral-950 tracking-tight">
              {MOCK_ANALYTICS_SUMMARY.avgAccuracy}%
            </div>
            <div className="text-xs text-neutral-600 font-medium mt-0.5">Quiz Mastery Score</div>
          </div>
        </div>
      </div>

      {/* Main Grid: Heatmap (Top/Full) & Donut Breakdown + Milestones (Bottom) */}
      
      {/* 1. Productivity Heatmap (GitHub Contribution Style) */}
      <div className="bg-white border border-neutral-200 rounded-2xl p-6 shadow-[4px_4px_0px_rgba(0,0,0,0.04)] space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-neutral-100 pb-3">
          <div>
            <h2 className="font-serif text-lg font-bold text-neutral-950 flex items-center gap-2">
              <Clock className="w-4 h-4 text-purple-600" />
              12-Week Study Productivity Heatmap
            </h2>
            <p className="text-xs text-neutral-500">Each cell represents daily focus timer & Socratic tutor activity</p>
          </div>

          {/* Interactive Tooltip Status Bar */}
          <div className="text-xs font-mono bg-neutral-50 border border-neutral-200 rounded-lg px-3 py-1.5 text-neutral-700">
            {hoveredDay ? (
              <span className="font-semibold text-purple-900">
                {hoveredDay.date}: <strong>{hoveredDay.summary}</strong>
              </span>
            ) : (
              <span className="text-neutral-400">Hover over any square to view daily focus log</span>
            )}
          </div>
        </div>

        {/* Heatmap Grid */}
        <div className="overflow-x-auto pb-2">
          <div className="inline-grid grid-rows-7 grid-flow-col gap-1.5 pt-2">
            {heatmapData.map((day, idx) => (
              <div
                key={idx}
                onMouseEnter={() => setHoveredDay(day)}
                onMouseLeave={() => setHoveredDay(null)}
                className={cn(
                  "w-4 h-4 rounded-sm border transition-transform hover:scale-125 cursor-pointer",
                  levelColorMap[day.level]
                )}
                title={`${day.date}: ${day.summary}`}
              />
            ))}
          </div>
        </div>

        {/* Legend */}
        <div className="flex items-center justify-end gap-2 text-[11px] font-mono text-neutral-500 pt-1">
          <span>Less</span>
          <div className="w-3 h-3 rounded-sm bg-neutral-100 border border-neutral-200" />
          <div className="w-3 h-3 rounded-sm bg-purple-200 border border-purple-300" />
          <div className="w-3 h-3 rounded-sm bg-purple-300 border border-purple-400" />
          <div className="w-3 h-3 rounded-sm bg-purple-500 border border-purple-600" />
          <div className="w-3 h-3 rounded-sm bg-purple-700 border border-purple-800" />
          <span>More</span>
        </div>
      </div>

      {/* 2. Focus Time Breakdown (Donut Chart) & Milestone Progress */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Focus Time Breakdown (Donut Chart) */}
        <div className="bg-white border border-neutral-200 rounded-2xl p-6 shadow-[4px_4px_0px_rgba(233,213,255,0.7)] flex flex-col justify-between space-y-4">
          <div className="flex items-center justify-between border-b border-neutral-100 pb-3">
            <div>
              <h2 className="font-serif text-lg font-bold text-neutral-950 flex items-center gap-2">
                <BarChart2 className="w-4 h-4 text-purple-600" />
                Focus Time Subject Breakdown
              </h2>
              <p className="text-xs text-neutral-500">Distribution of study hours this week</p>
            </div>
            <span className="text-xs font-mono font-bold text-purple-800 bg-purple-100 px-2.5 py-0.5 rounded border border-purple-200">
              41.0 Total Hours
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 items-center gap-4 py-2">
            {/* Recharts Donut */}
            <div className="h-48 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={MOCK_SUBJECT_BREAKDOWN}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={75}
                    paddingAngle={4}
                    dataKey="value"
                  >
                    {MOCK_SUBJECT_BREAKDOWN.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(value: any, name: any, item: any) => [`${item.payload.hours} hrs (${value}%)`, name]}
                    contentStyle={{ backgroundColor: '#ffffff', borderRadius: '12px', border: '1px solid #e5e7eb', fontSize: '12px' }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>

            {/* Legend List */}
            <div className="space-y-2.5 text-xs font-medium">
              {MOCK_SUBJECT_BREAKDOWN.map((subject, idx) => (
                <div key={idx} className="flex items-center justify-between p-2 rounded-xl bg-neutral-50 border border-neutral-200">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: subject.color }} />
                    <span className="font-bold text-neutral-900 truncate">{subject.name}</span>
                  </div>
                  <span className="font-mono text-neutral-600 font-bold shrink-0">{subject.hours}h ({subject.value}%)</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Milestone Progress (Mint Green Accent) */}
        <div className="bg-white border border-neutral-200 rounded-2xl p-6 shadow-[4px_4px_0px_rgba(187,247,208,0.7)] flex flex-col justify-between space-y-4">
          <div className="flex items-center justify-between border-b border-neutral-100 pb-3">
            <div>
              <h2 className="font-serif text-lg font-bold text-neutral-950 flex items-center gap-2">
                <Target className="w-4 h-4 text-emerald-600" />
                Syllabus Milestone Progress
              </h2>
              <p className="text-xs text-neutral-500">{MOCK_MILESTONE_PROGRESS.activeCourse}</p>
            </div>
            <span className="text-xs font-mono font-bold text-emerald-800 bg-emerald-100 px-2.5 py-0.5 rounded border border-emerald-200">
              {MOCK_MILESTONE_PROGRESS.percentage}% Complete
            </span>
          </div>

          <div className="space-y-4 my-2">
            {/* Horizontal Progress Bar */}
            <div>
              <div className="flex items-center justify-between text-xs font-bold text-neutral-800 mb-1.5">
                <span>Completed: {MOCK_MILESTONE_PROGRESS.completed} Milestones</span>
                <span>Remaining: {MOCK_MILESTONE_PROGRESS.total - MOCK_MILESTONE_PROGRESS.completed} Milestones</span>
              </div>
              <div className="w-full h-4 bg-neutral-100 border border-neutral-200 rounded-full overflow-hidden p-0.5">
                <div
                  className="h-full rounded-full bg-emerald-500 transition-all duration-1000 shadow-sm"
                  style={{ width: `${MOCK_MILESTONE_PROGRESS.percentage}%` }}
                />
              </div>
            </div>

            {/* Upcoming Active Milestones List */}
            <div className="space-y-2 text-xs">
              <span className="text-[10px] font-mono font-bold uppercase text-neutral-400 block">Current Target Sprint:</span>
              <div className="p-3 rounded-xl bg-emerald-50/60 border border-emerald-200 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <div>
                    <span className="font-bold text-neutral-900 block">Dynamic Programming & Memoization</span>
                    <span className="text-[10px] text-neutral-500">Target: Hard Difficulty • Due Thursday</span>
                  </div>
                </div>
                <span className="px-2 py-0.5 text-[10px] font-mono font-bold bg-emerald-200 text-emerald-900 rounded border border-emerald-300">
                  IN PROGRESS
                </span>
              </div>
            </div>
          </div>

          <div className="pt-2">
            <a
              href="/brain"
              className="w-full py-2.5 rounded-xl font-bold text-xs bg-emerald-100 border border-emerald-300 text-emerald-900 hover:bg-emerald-200 transition-all flex items-center justify-center gap-1.5 shadow-sm"
            >
              <span>View Full Syllabus Roadmap</span>
              <ChevronRight className="w-4 h-4" />
            </a>
          </div>
        </div>

      </div>

    </div>
  );
}
