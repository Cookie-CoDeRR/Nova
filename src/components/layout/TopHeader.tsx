"use client";

import React, { useState, useEffect } from "react";
import { Flame, Bell, Sparkles, GraduationCap, Settings, User } from "lucide-react";
import { getStudentProfile, StudentProfile, DEFAULT_PROFILE } from "@/lib/userProfile";
import { EditProfileModal } from "@/components/dashboard/EditProfileModal";

interface TopHeaderProps {
  urgentCount?: number;
  gpa?: number;
  streakDays?: number;
}

export function TopHeader({
  urgentCount = 2,
  gpa = 3.85,
  streakDays = 7,
}: TopHeaderProps) {
  const [greeting, setGreeting] = useState("Good evening");
  const [profile, setProfile] = useState<StudentProfile>(DEFAULT_PROFILE);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setGreeting("Good morning");
    else if (hour < 17) setGreeting("Good afternoon");
    else setGreeting("Good evening");

    // Load dynamic profile
    getStudentProfile().then((p) => {
      setProfile(p);
    });
  }, []);

  return (
    <>
      <header className="w-full py-4 px-4 sm:px-8 flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-gray-200 bg-white/90 backdrop-blur-md sticky top-0 z-40 shadow-xs">
        {/* Left Greeting & University Details */}
        <div>
          <div className="flex items-center gap-2 text-[10px] font-bold font-mono uppercase tracking-wider text-purple-700 mb-0.5">
            <Sparkles className="w-3.5 h-3.5 text-purple-600" />
            <span>NOVA Digital Workspace • {profile.university}</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-gray-900 flex items-center gap-2 font-serif">
            <span>{greeting}, {profile.displayName.split(" ")[0]}.</span>
          </h1>
          <p className="text-xs text-gray-600 mt-0.5">
            <span className="font-semibold text-gray-800">{profile.currentYear}</span> • ID: <span className="font-mono text-gray-800">{profile.rollNumber}</span>
          </p>
        </div>

        {/* Right Student Quick Stats, Badges & Profile Modal Trigger */}
        <div className="flex items-center gap-3">
          {/* Streak Counter */}
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-amber-50 border border-amber-200 text-amber-900 text-xs font-bold shadow-xs">
            <Flame className="w-4 h-4 text-amber-600 fill-amber-500/20" />
            <span>{streakDays} Day Streak</span>
          </div>

          {/* GPA Badge */}
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-purple-50 border border-purple-200 text-purple-900 text-xs font-bold shadow-xs">
            <GraduationCap className="w-4 h-4 text-purple-600" />
            <span>GPA: {gpa.toFixed(2)}</span>
          </div>

          {/* Edit Profile Settings Button */}
          <button
            onClick={() => setIsEditModalOpen(true)}
            className="p-2 rounded-full bg-gray-100 border border-gray-200 text-gray-700 hover:text-gray-900 hover:bg-gray-200 transition-colors flex items-center gap-1 text-xs font-bold px-3"
            title="Edit Profile & Specialization"
          >
            <Settings className="w-3.5 h-3.5 text-gray-600" />
            <span className="hidden sm:inline">Profile</span>
          </button>

          {/* Notification Bell */}
          <button 
            className="relative p-2 rounded-full bg-gray-100 border border-gray-200 text-gray-700 hover:text-gray-900 hover:bg-gray-200 transition-colors"
            title="Notifications"
          >
            <Bell className="w-4 h-4" />
            <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-purple-600 animate-ping" />
            <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-purple-600" />
          </button>

          {/* Student Avatar */}
          <div 
            onClick={() => setIsEditModalOpen(true)}
            className="flex items-center gap-2 pl-2 border-l border-gray-200 cursor-pointer"
            title="Click to edit profile"
          >
            <div className="w-9 h-9 rounded-full bg-gray-900 flex items-center justify-center font-bold text-xs text-white shadow-xs hover:scale-105 transition-transform">
              {profile.displayName.charAt(0)}
            </div>
          </div>
        </div>
      </header>

      {/* Edit Profile Modal */}
      <EditProfileModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        currentProfile={profile}
        onProfileUpdated={(updated) => setProfile(updated)}
      />
    </>
  );
}
