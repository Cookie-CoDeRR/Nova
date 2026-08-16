"use client";

import React, { useState, useEffect } from "react";
import { Flame, Bell, Sparkles, GraduationCap, Settings, LogOut } from "lucide-react";
import { getStudentProfile, StudentProfile, NEW_USER_PROFILE } from "@/lib/userProfile";
import { EditProfileModal } from "@/components/dashboard/EditProfileModal";
import { NovaLogo } from "@/components/ui/NovaLogo";
import { auth } from "@/lib/firebase";
import { signOut } from "firebase/auth";

interface TopHeaderProps {
  urgentCount?: number;
}

export function TopHeader({ urgentCount = 2 }: TopHeaderProps) {
  const [greeting, setGreeting] = useState("Good evening");
  const [profile, setProfile] = useState<StudentProfile>(NEW_USER_PROFILE);
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

  const handleSignOut = async () => {
    try {
      if (typeof window !== "undefined") {
        localStorage.removeItem("nova_student_profile");
      }
      await signOut(auth);
    } catch (e) {
      console.warn("Signout warning:", e);
    } finally {
      window.location.href = "/";
    }
  };

  return (
    <>
      <header className="w-full py-2.5 sm:py-3.5 px-3 sm:px-8 flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-gray-200 bg-white/95 backdrop-blur-md sticky top-0 z-40 shadow-xs">
        {/* Left Greeting & Official Logo */}
        <div className="flex items-center gap-3">
          <NovaLogo size="md" iconOnly={false} href="/dashboard" />
          
          <div className="border-l border-gray-200 pl-3">
            <div className="flex items-center gap-1.5 text-[9px] sm:text-[10px] font-bold font-mono uppercase tracking-wider text-purple-700 mb-0.5">
              <Sparkles className="w-3.5 h-3.5 text-purple-600 shrink-0" />
              <span className="truncate max-w-[180px] sm:max-w-none">NOVA • {profile.university}</span>
            </div>
            <h1 className="text-base sm:text-2xl font-bold tracking-tight text-gray-900 flex items-center gap-2 font-serif leading-tight">
              <span>{greeting}, {profile.displayName.split(" ")[0]}.</span>
            </h1>
            <p className="text-[11px] sm:text-xs text-gray-600 mt-0.5 hidden sm:block">
              <span className="font-semibold text-gray-800">{profile.currentYear}</span> • ID: <span className="font-mono text-gray-800">{profile.rollNumber}</span>
            </p>
          </div>
        </div>

        {/* Right Student Quick Stats, Badges & Profile Modal Trigger */}
        <div className="flex items-center gap-2 sm:gap-3 self-end md:self-auto">
          {/* Streak Counter */}
          <div className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-50 border border-amber-200 text-amber-900 text-[11px] font-bold shadow-xs">
            <Flame className="w-3.5 h-3.5 text-amber-600 fill-amber-500/20" />
            <span>{profile.streakDays || 0}d Streak</span>
          </div>

          {/* GPA Badge */}
          <div className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-purple-50 border border-purple-200 text-purple-900 text-[11px] font-bold shadow-xs">
            <GraduationCap className="w-3.5 h-3.5 text-purple-600" />
            <span>GPA: {(profile.gpa || 0).toFixed(2)}</span>
          </div>

          {/* Edit Profile Settings Button */}
          <button
            onClick={() => setIsEditModalOpen(true)}
            className="p-1.5 sm:p-2 rounded-full bg-gray-100 border border-gray-200 text-gray-700 hover:text-gray-900 hover:bg-gray-200 transition-colors flex items-center gap-1 text-xs font-bold sm:px-3 cursor-pointer"
            title="Edit Profile & Specialization"
          >
            <Settings className="w-3.5 h-3.5 text-gray-600" />
            <span className="hidden sm:inline">Profile</span>
          </button>

          {/* Notification Bell */}
          <button 
            className="relative p-1.5 sm:p-2 rounded-full bg-gray-100 border border-gray-200 text-gray-700 hover:text-gray-900 hover:bg-gray-200 transition-colors"
            title="Notifications"
          >
            <Bell className="w-3.5 h-3.5" />
            <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-purple-600 animate-ping" />
            <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-purple-600" />
          </button>

          {/* Sign Out Button */}
          <button
            onClick={handleSignOut}
            className="p-1.5 sm:p-2 rounded-full bg-red-50 border border-red-200 text-red-700 hover:bg-red-100 transition-colors flex items-center gap-1 text-xs font-bold sm:px-2.5 cursor-pointer"
            title="Sign Out to Landing Page"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Sign Out</span>
          </button>

          {/* Student Avatar */}
          <div 
            onClick={() => setIsEditModalOpen(true)}
            className="flex items-center gap-2 pl-1.5 border-l border-gray-200 cursor-pointer"
            title="Click to edit profile"
          >
            <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-gray-900 flex items-center justify-center font-bold text-xs text-white shadow-xs hover:scale-105 transition-transform">
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
