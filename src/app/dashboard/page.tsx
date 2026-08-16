"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { generateMockHeatmapData, MOCK_SUBJECT_BREAKDOWN_FULL, MOCK_SUBJECT_BREAKDOWN_EMPTY, HeatmapDay } from "@/lib/mockData";
import { generateWeeklyReportAction } from "@/app/actions/generate-weekly-report";
import { getStudentProfile, saveStudentProfile, StudentProfile, NEW_USER_PROFILE, DEMO_SAMPLE_PROFILE } from "@/lib/userProfile";
import { EditProfileModal } from "@/components/dashboard/EditProfileModal";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";
import { Flame, Clock, Target, Sparkles, TrendingUp, CheckCircle2, ChevronRight, BarChart2, Settings, RefreshCcw, ToggleLeft, ToggleRight } from "lucide-react";
import { cn } from "@/lib/utils";
import ReactMarkdown from "react-markdown";

export default function StudyPulseDashboardPage() {
  const [profile, setProfile] = useState<StudentProfile>(NEW_USER_PROFILE);
  const [isDemoDataLoaded, setIsDemoDataLoaded] = useState(false);
  const [heatmapData, setHeatmapData] = useState<HeatmapDay[]>(generateMockHeatmapData(true));
  const [hoveredDay, setHoveredDay] = useState<HeatmapDay | null>(null);
  const [weeklyReport, setWeeklyReport] = useState<string | null>(null);
  const [isReportLoading, setIsReportLoading] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  useEffect(() => {
    getStudentProfile().then((p) => {
      setProfile(p);
      const isDemo = p.isDemoUser || p.totalFocusHours > 0;
      setIsDemoDataLoaded(isDemo);
      setHeatmapData(generateMockHeatmapData(!isDemo));
    });
  }, []);

  const toggleDemoData = async () => {
    const nextState = !isDemoDataLoaded;
    setIsDemoDataLoaded(nextState);
    setHeatmapData(generateMockHeatmapData(!nextState));

    if (nextState) {
      const updated = await saveStudentProfile({
        ...profile,
        streakDays: 7,
        gpa: 3.85,
        totalFocusHours: 41.0,
        completedMilestones: 12,
        totalMilestones: 16,
        quizAccuracy: 92,
        isDemoUser: true,
      });
      setProfile(updated);
    } else {
      const updated = await saveStudentProfile({
        ...profile,
        streakDays: 0,
        gpa: 0.0,
        totalFocusHours: 0,
        completedMilestones: 0,
        totalMilestones: 16,
        quizAccuracy: 0,
        isDemoUser: false,
      });
      setProfile(updated);
    }
  };

  const handleGenerateReport = async () => {
    setIsReportLoading(true);
    try {
      const res = await generateWeeklyReportAction({
        totalHours: profile.totalFocusHours || 0,
        streak: profile.streakDays || 0,
        completedMilestones: profile.completedMilestones || 0,
        totalMilestones: profile.totalMilestones || 16,
        topSubject: profile.specializations[0] || "Data Structures",
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
    0: "bg-gray-100 hover:bg-gray-200 border-gray-200",
    1: "bg-purple-200 hover:bg-purple-300 border-purple-300",
    2: "bg-purple-300 hover:bg-purple-400 border-purple-400",
    3: "bg-purple-500 hover:bg-purple-600 border-purple-600",
    4: "bg-purple-700 hover:bg-purple-800 border-purple-800",
  };

  const subjectBreakdownData = isDemoDataLoaded ? MOCK_SUBJECT_BREAKDOWN_FULL : MOCK_SUBJECT_BREAKDOWN_EMPTY;

  return (
    <div className="w-full max-w-7xl mx-auto space-y-8 font-sans text-gray-800 pb-16">
      
      {/* Header Banner */}
      <div className="bg-white border border-gray-200 rounded-3xl p-6 sm:p-8 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6 relative overflow-hidden">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2 flex-wrap">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-50 text-purple-900 border border-purple-200 text-xs font-bold font-mono">
              <BarChart2 className="w-3.5 h-3.5 text-purple-700" />
              ACADEMIC COMMAND CENTER • {profile.university}
            </div>

            {/* Toggle Demo / Clean Data Button */}
            <button
              onClick={toggleDemoData}
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-700 border border-gray-300 text-xs font-bold font-mono transition-all cursor-pointer"
              title="Switch between Clean New User Profile and Sample Demo Data"
            >
              {isDemoDataLoaded ? (
                <>
                  <ToggleRight className="w-4 h-4 text-purple-700" />
                  <span>Demo Mode: ON</span>
                </>
              ) : (
                <>
                  <ToggleLeft className="w-4 h-4 text-gray-400" />
                  <span>Demo Mode: OFF (Clean Profile)</span>
                </>
              )}
            </button>
          </div>
          
          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-gray-900 tracking-tight">
            {profile.displayName}'s Study Pulse
          </h1>

          <p className="text-xs sm:text-sm text-gray-600 flex items-center gap-2 flex-wrap">
            <span className="font-medium">{profile.currentYear}</span>
            <span>•</span>
            <span className="font-mono text-gray-700">ID: {profile.rollNumber}</span>
          </p>

          {/* Student Specialization Chips */}
          <div className="flex items-center gap-1.5 pt-2 flex-wrap">
            <span className="text-[10px] font-mono font-bold text-gray-400 uppercase">Specializations:</span>
            {profile.specializations.map((spec, idx) => (
              <span key={idx} className="text-[10px] font-semibold bg-gray-100 border border-gray-200 text-gray-800 px-2.5 py-0.5 rounded-full">
                {spec}
              </span>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={() => setIsEditModalOpen(true)}
            className="px-4 py-3 rounded-full font-bold text-xs bg-gray-100 border border-gray-200 text-gray-700 hover:bg-gray-200 transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <Settings className="w-4 h-4" />
            <span>Edit Profile</span>
          </button>

          <button
            onClick={handleGenerateReport}
            disabled={isReportLoading}
            className={cn(
              "px-6 py-3.5 rounded-full font-bold text-xs shadow-xs flex items-center justify-center gap-2 transition-all duration-200 border cursor-pointer",
              isReportLoading
                ? "bg-gray-100 text-gray-400 border-gray-200 cursor-wait"
                : "bg-gray-900 text-white hover:bg-gray-800 border-gray-900 active:scale-[0.98]"
            )}
          >
            {isReportLoading ? (
              <>
                <Sparkles className="w-4 h-4 animate-spin text-amber-400" />
                Generating Digest...
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 text-amber-400" />
                Generate Weekly AI Digest
              </>
            )}
          </button>
        </div>
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
            <div className="bg-purple-50/90 border border-purple-200 rounded-3xl p-6 sm:p-8 shadow-sm relative">
              <button
                onClick={() => setWeeklyReport(null)}
                className="absolute top-4 right-4 text-xs font-bold text-purple-800 hover:underline"
              >
                Close Report ✕
              </button>
              <div className="prose prose-purple max-w-none text-xs leading-relaxed text-gray-800 space-y-2">
                <ReactMarkdown>{weeklyReport}</ReactMarkdown>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Key Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Focus Hours */}
        <div className="bg-white border border-gray-200 rounded-3xl p-6 shadow-sm flex flex-col justify-between hover:shadow-md transition-all duration-300">
          <div className="flex items-center justify-between text-purple-800">
            <Clock className="w-5 h-5" />
            <span className="text-[10px] font-bold font-mono px-2 py-0.5 rounded bg-purple-50 border border-purple-200">
              FOCUS TIME
            </span>
          </div>
          <div className="mt-4">
            <div className="text-3xl font-black font-mono text-gray-900 tracking-tight">
              {profile.totalFocusHours}h
            </div>
            <div className="text-xs text-gray-600 font-medium mt-0.5">Total Focused Study</div>
          </div>
        </div>

        {/* Weekly Streak */}
        <div className="bg-white border border-gray-200 rounded-3xl p-6 shadow-sm flex flex-col justify-between hover:shadow-md transition-all duration-300">
          <div className="flex items-center justify-between text-amber-800">
            <Flame className="w-5 h-5 fill-amber-500/20" />
            <span className="text-[10px] font-bold font-mono px-2 py-0.5 rounded bg-amber-50 border border-amber-200">
              STREAK
            </span>
          </div>
          <div className="mt-4">
            <div className="text-3xl font-black font-mono text-gray-900 tracking-tight flex items-center gap-1">
              <span>{profile.streakDays}</span>
              <span className="text-sm font-normal text-gray-500">Days</span>
            </div>
            <div className="text-xs text-gray-600 font-medium mt-0.5">Consecutive Streak</div>
          </div>
        </div>

        {/* Milestone Completion */}
        <div className="bg-white border border-gray-200 rounded-3xl p-6 shadow-sm flex flex-col justify-between hover:shadow-md transition-all duration-300">
          <div className="flex items-center justify-between text-emerald-800">
            <Target className="w-5 h-5" />
            <span className="text-[10px] font-bold font-mono px-2 py-0.5 rounded bg-emerald-50 border border-emerald-200">
              {profile.totalMilestones > 0 ? Math.round((profile.completedMilestones / profile.totalMilestones) * 100) : 0}% DONE
            </span>
          </div>
          <div className="mt-4">
            <div className="text-3xl font-black font-mono text-gray-900 tracking-tight">
              {profile.completedMilestones}/{profile.totalMilestones || 16}
            </div>
            <div className="text-xs text-gray-600 font-medium mt-0.5">Milestones Conquered</div>
          </div>
        </div>

        {/* Quiz Mastery */}
        <div className="bg-white border border-gray-200 rounded-3xl p-6 shadow-sm flex flex-col justify-between hover:shadow-md transition-all duration-300">
          <div className="flex items-center justify-between text-blue-800">
            <TrendingUp className="w-5 h-5" />
            <span className="text-[10px] font-bold font-mono px-2 py-0.5 rounded bg-blue-50 border border-blue-200">
              ACCURACY
            </span>
          </div>
          <div className="mt-4">
            <div className="text-3xl font-black font-mono text-gray-900 tracking-tight">
              {profile.quizAccuracy}%
            </div>
            <div className="text-xs text-gray-600 font-medium mt-0.5">Quiz Mastery Score</div>
          </div>
        </div>
      </div>

      {/* 1. Productivity Heatmap Grid Card */}
      <div className="bg-white border border-gray-200 rounded-3xl p-6 sm:p-8 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-gray-100 pb-4">
          <div>
            <h2 className="font-serif text-xl font-bold text-gray-900 flex items-center gap-2">
              <Clock className="w-4 h-4 text-purple-700" />
              12-Week Study Productivity Heatmap
            </h2>
            <p className="text-xs text-gray-500">
              {isDemoDataLoaded
                ? "Each cell represents daily focus timer & Socratic tutor activity"
                : "No study sessions logged yet. Complete a Pomodoro session to light up your heatmap!"}
            </p>
          </div>

          {/* Tooltip display */}
          <div className="text-xs font-mono bg-gray-50 border border-gray-200 rounded-lg px-3 py-1.5 text-gray-700">
            {hoveredDay ? (
              <span className="font-semibold text-purple-900">
                {hoveredDay.date}: <strong>{hoveredDay.summary}</strong>
              </span>
            ) : (
              <span className="text-gray-400">Hover over any square to view daily focus log</span>
            )}
          </div>
        </div>

        {/* Grid */}
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

        <div className="flex items-center justify-end gap-2 text-[11px] font-mono text-gray-500 pt-1">
          <span>Less</span>
          <div className="w-3 h-3 rounded-sm bg-gray-100 border border-gray-200" />
          <div className="w-3 h-3 rounded-sm bg-purple-200 border border-purple-300" />
          <div className="w-3 h-3 rounded-sm bg-purple-300 border border-purple-400" />
          <div className="w-3 h-3 rounded-sm bg-purple-500 border border-purple-600" />
          <div className="w-3 h-3 rounded-sm bg-purple-700 border border-purple-800" />
          <span>More</span>
        </div>
      </div>

      {/* 2. Focus Time Breakdown & Syllabus Milestones */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Recharts Donut Card */}
        <div className="bg-white border border-gray-200 rounded-3xl p-6 sm:p-8 shadow-sm flex flex-col justify-between space-y-4">
          <div className="flex items-center justify-between border-b border-gray-100 pb-3">
            <div>
              <h2 className="font-serif text-xl font-bold text-gray-900 flex items-center gap-2">
                <BarChart2 className="w-4 h-4 text-purple-700" />
                Focus Time Subject Breakdown
              </h2>
              <p className="text-xs text-gray-500">Distribution of study hours this week</p>
            </div>
            <span className="text-xs font-mono font-bold text-purple-900 bg-purple-50 px-2.5 py-0.5 rounded border border-purple-200">
              {profile.totalFocusHours} Total Hours
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 items-center gap-4 py-2">
            <div className="h-48 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={subjectBreakdownData}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={75}
                    paddingAngle={4}
                    dataKey="value"
                  >
                    {subjectBreakdownData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} stroke="#f3f4f6" strokeWidth={2} />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(value: any, name: any, item: any) => [`${item.payload.hours} hrs (${value}%)`, name]}
                    contentStyle={{ backgroundColor: '#ffffff', borderRadius: '12px', border: '1px solid #e5e7eb', fontSize: '12px' }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>

            <div className="space-y-2.5 text-xs font-medium">
              {subjectBreakdownData.map((subject, idx) => (
                <div key={idx} className="flex items-center justify-between p-2.5 rounded-xl bg-gray-50 border border-gray-200">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: subject.color }} />
                    <span className="font-bold text-gray-900 truncate">{subject.name}</span>
                  </div>
                  <span className="font-mono text-gray-600 font-bold shrink-0">{subject.hours}h ({subject.value}%)</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Milestone Progress Card */}
        <div className="bg-white border border-gray-200 rounded-3xl p-6 sm:p-8 shadow-sm flex flex-col justify-between space-y-4">
          <div className="flex items-center justify-between border-b border-gray-100 pb-3">
            <div>
              <h2 className="font-serif text-xl font-bold text-gray-900 flex items-center gap-2">
                <Target className="w-4 h-4 text-emerald-700" />
                Syllabus Milestone Progress
              </h2>
              <p className="text-xs text-gray-500">CS 301 Data Structures & Algorithms</p>
            </div>
            <span className="text-xs font-mono font-bold text-emerald-900 bg-emerald-50 px-2.5 py-0.5 rounded border border-emerald-200">
              {profile.totalMilestones > 0 ? Math.round((profile.completedMilestones / profile.totalMilestones) * 100) : 0}% Complete
            </span>
          </div>

          <div className="space-y-4 my-2">
            <div>
              <div className="flex items-center justify-between text-xs font-bold text-gray-800 mb-1.5">
                <span>Completed: {profile.completedMilestones} Milestones</span>
                <span>Remaining: {(profile.totalMilestones || 16) - profile.completedMilestones} Milestones</span>
              </div>
              <div className="w-full h-4 bg-gray-100 border border-gray-200 rounded-full overflow-hidden p-0.5">
                <div
                  className="h-full rounded-full bg-emerald-500 transition-all duration-1000 shadow-2xs"
                  style={{ width: `${profile.totalMilestones > 0 ? Math.round((profile.completedMilestones / profile.totalMilestones) * 100) : 0}%` }}
                />
              </div>
            </div>

            <div className="space-y-2 text-xs">
              <span className="text-[10px] font-mono font-bold uppercase text-gray-400 block tracking-wider">
                Next Milestone Goal:
              </span>
              <div className="p-3.5 rounded-xl bg-emerald-50/70 border border-emerald-200 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <div>
                    <span className="font-bold text-gray-900 block">Asymptotic Bounds & Recurrence Relations</span>
                    <span className="text-[10px] text-gray-500">Target: Easy Difficulty • Ready to Start</span>
                  </div>
                </div>
                <a
                  href="/brain"
                  className="px-2 py-1 text-[10px] font-mono font-bold bg-emerald-600 text-white rounded border border-emerald-700 hover:bg-emerald-500 transition-colors shadow-2xs"
                >
                  START SPRINT
                </a>
              </div>
            </div>
          </div>

          <div className="pt-2">
            <a
              href="/brain"
              className="w-full py-3 rounded-xl font-bold text-xs bg-emerald-50 border border-emerald-200 text-emerald-950 hover:bg-emerald-100 transition-all flex items-center justify-center gap-1.5 shadow-2xs"
            >
              <span>View Full Syllabus Roadmap</span>
              <ChevronRight className="w-4 h-4" />
            </a>
          </div>
        </div>

      </div>

      {/* Edit Profile Modal */}
      <EditProfileModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        currentProfile={profile}
        onProfileUpdated={(updated) => {
          setProfile(updated);
          const isDemo = updated.isDemoUser || updated.totalFocusHours > 0;
          setIsDemoDataLoaded(isDemo);
          setHeatmapData(generateMockHeatmapData(!isDemo));
        }}
      />

    </div>
  );
}
