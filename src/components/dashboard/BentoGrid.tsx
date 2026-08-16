"use client";

import React from "react";
import { UpcomingAssignments } from "./UpcomingAssignments";
import { PomodoroTimer } from "./PomodoroTimer";
import { CourseProgressCard } from "./CourseProgressCard";
import { QuickStats } from "./QuickStats";

export function BentoGrid() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
      {/* Row 1: Approaching Deadlines (2 cols) & Focus Pomodoro Timer (1 col) */}
      <UpcomingAssignments />
      <PomodoroTimer />

      {/* Row 2: Course Progress Mastery (2 cols) & Quick Metrics / Tutor Launcher (1 col) */}
      <CourseProgressCard />
      <QuickStats />
    </div>
  );
}
