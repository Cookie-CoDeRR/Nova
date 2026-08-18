"use client";

import React, { useState, useEffect, useRef } from "react";
import { Flame, Bell, Sparkles, GraduationCap, BookOpen, CheckCircle2, AlertCircle, Info, X, Settings, LogOut } from "lucide-react";
import { getStudentProfile, StudentProfile, NEW_USER_PROFILE } from "@/lib/userProfile";
import { EditProfileModal } from "@/components/dashboard/EditProfileModal";
import { NovaLogo } from "@/components/ui/NovaLogo";
import { auth } from "@/lib/firebase";
import { signOut } from "firebase/auth";

interface TopHeaderProps {
  urgentCount?: number;
}

const MOCK_NOTIFICATIONS = [
  {
    id: "1",
    type: "reminder",
    icon: AlertCircle,
    color: "text-amber-600",
    bg: "bg-amber-50",
    border: "border-amber-200",
    title: "Assignment Due Soon",
    body: "Dynamic Programming problem set is due in 2 days.",
    time: "2h ago",
    unread: true,
  },
  {
    id: "2",
    type: "milestone",
    icon: CheckCircle2,
    color: "text-emerald-600",
    bg: "bg-emerald-50",
    border: "border-emerald-200",
    title: "Milestone Completed!",
    body: "You finished Week 1: Asymptotic Bounds & Recurrence.",
    time: "Yesterday",
    unread: true,
  },
  {
    id: "3",
    type: "streak",
    icon: Flame,
    color: "text-purple-600",
    bg: "bg-purple-50",
    border: "border-purple-200",
    title: "Keep your streak alive 🔥",
    body: "You have a 7-day study streak. Study today to keep it!",
    time: "3h ago",
    unread: false,
  },
  {
    id: "4",
    type: "info",
    icon: BookOpen,
    color: "text-blue-600",
    bg: "bg-blue-50",
    border: "border-blue-200",
    title: "New Syllabus Parsed",
    body: "CS 301 Data Structures roadmap has been updated with 4 new milestones.",
    time: "1d ago",
    unread: false,
  },
  {
    id: "5",
    type: "info",
    icon: Info,
    color: "text-gray-500",
    bg: "bg-gray-50",
    border: "border-gray-200",
    title: "NOVA Tip",
    body: "Try the Socratic Tutor with a tough concept — it will guide you step by step.",
    time: "2d ago",
    unread: false,
  },
];

export function TopHeader({ urgentCount = 2 }: TopHeaderProps) {
  const [greeting, setGreeting] = useState("Good evening");
  const [profile, setProfile] = useState<StudentProfile>(NEW_USER_PROFILE);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [isAvatarMenuOpen, setIsAvatarMenuOpen] = useState(false);
  const avatarMenuRef = useRef<HTMLDivElement>(null);
  const [notifications, setNotifications] = useState(MOCK_NOTIFICATIONS);

  const unreadCount = notifications.filter((n) => n.unread).length;

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setGreeting("Good morning");
    else if (hour < 17) setGreeting("Good afternoon");
    else setGreeting("Good evening");

    getStudentProfile().then((p) => setProfile(p));
  }, []);

  // Close avatar menu when clicking outside
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (avatarMenuRef.current && !avatarMenuRef.current.contains(e.target as Node)) {
        setIsAvatarMenuOpen(false);
      }
    };
    if (isAvatarMenuOpen) document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [isAvatarMenuOpen]);

  const handleSignOut = async () => {
    setIsAvatarMenuOpen(false);
    try {
      if (typeof window !== "undefined") localStorage.removeItem("nova_student_profile");
      await signOut(auth);
    } catch (e) {
      console.warn("Signout warning:", e);
    } finally {
      window.location.href = "/";
    }
  };

  const handleOpenEditProfile = () => {
    setIsAvatarMenuOpen(false);
    setIsEditModalOpen(true);
  };

  const markAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, unread: false })));
  };

  const dismissNotif = (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  // Close notification panel when profile modal opens
  useEffect(() => {
    if (isEditModalOpen) setIsNotifOpen(false);
  }, [isEditModalOpen]);

  // Hide both bars when notification panel or profile modal is open via body class
  useEffect(() => {
    if (isNotifOpen) {
      document.body.classList.add("notif-panel-open");
    } else {
      document.body.classList.remove("notif-panel-open");
    }
    return () => document.body.classList.remove("notif-panel-open");
  }, [isNotifOpen]);

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

        {/* Right — Stats, Notification Bell & Avatar */}
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

          {/* Notification Bell */}
          <button
            onClick={() => setIsNotifOpen(true)}
            className="relative p-1.5 sm:p-2 rounded-full bg-gray-100 border border-gray-200 text-gray-700 hover:text-gray-900 hover:bg-gray-200 transition-colors cursor-pointer"
            title="Notifications"
          >
            <Bell className="w-3.5 h-3.5" />
            {unreadCount > 0 && (
              <>
                <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-purple-600 animate-ping" />
                <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-purple-600" />
              </>
            )}
          </button>

          {/* Student Avatar — opens dropdown menu */}
          <div className="relative pl-1.5 border-l border-gray-200" ref={avatarMenuRef}>
            <button
              onClick={() => setIsAvatarMenuOpen((v) => !v)}
              className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-gray-900 flex items-center justify-center font-bold text-xs text-white shadow-xs hover:scale-105 transition-transform cursor-pointer"
              title="Account menu"
            >
              {profile.displayName.charAt(0)}
            </button>

            {/* Light-theme dropdown popover — matches profile modal */}
            {isAvatarMenuOpen && (
              <div className="absolute right-0 top-full mt-2.5 w-56 bg-white border border-gray-200 rounded-2xl shadow-xl overflow-hidden z-50 py-1">
                {/* User info row */}
                <div className="px-4 py-3 border-b border-gray-100">
                  <p className="text-xs font-bold text-gray-900 truncate">{profile.displayName}</p>
                  <p className="text-[11px] text-gray-400 truncate font-mono">{profile.email}</p>
                </div>

                {/* Edit Profile */}
                <button
                  onClick={handleOpenEditProfile}
                  className="w-full flex items-center gap-3 px-4 py-3 text-xs font-semibold text-gray-700 hover:bg-gray-50 hover:text-gray-900 transition-colors text-left"
                >
                  <div className="p-1.5 rounded-lg bg-purple-50 border border-purple-200">
                    <Settings className="w-3.5 h-3.5 text-purple-600" />
                  </div>
                  Edit Profile Settings
                </button>

                {/* Divider */}
                <div className="border-t border-gray-100 mx-4" />

                {/* Log Out */}
                <button
                  onClick={handleSignOut}
                  className="w-full flex items-center gap-3 px-4 py-3 text-xs font-semibold text-red-600 hover:bg-red-50 transition-colors text-left"
                >
                  <div className="p-1.5 rounded-lg bg-red-50 border border-red-200">
                    <LogOut className="w-3.5 h-3.5 text-red-500" />
                  </div>
                  Log Out
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* ── Notifications Panel Modal ─────────────────────────────── */}
      {isNotifOpen && (
        <div className="fixed inset-0 z-[60] bg-gray-900/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-white border border-gray-200 rounded-3xl shadow-2xl font-sans text-gray-800 relative overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between px-6 pt-6 pb-4 border-b border-gray-100">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-purple-50 border border-purple-200 text-purple-800">
                  <Bell className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-base font-bold text-gray-900 tracking-tight">Notifications</h2>
                  <p className="text-xs text-gray-500">
                    {unreadCount > 0 ? `${unreadCount} unread` : "All caught up!"}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {unreadCount > 0 && (
                  <button
                    onClick={markAllRead}
                    className="text-[11px] font-bold text-purple-700 hover:text-purple-900 px-2 py-1 rounded-lg hover:bg-purple-50 transition-colors"
                  >
                    Mark all read
                  </button>
                )}
                <button
                  onClick={() => setIsNotifOpen(false)}
                  className="p-2 rounded-xl bg-gray-100 border border-gray-200 text-gray-500 hover:text-gray-900 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Notification List */}
            <div className="max-h-[60vh] overflow-y-auto px-4 py-3 space-y-2">
              {notifications.length === 0 ? (
                <div className="text-center py-12 text-gray-400">
                  <Bell className="w-8 h-8 mx-auto mb-2 opacity-30" />
                  <p className="text-sm font-medium">No notifications</p>
                </div>
              ) : (
                notifications.map((notif) => {
                  const Icon = notif.icon;
                  return (
                    <div
                      key={notif.id}
                      className={`relative flex items-start gap-3 p-3.5 rounded-2xl border transition-all ${
                        notif.unread
                          ? `${notif.bg} ${notif.border}`
                          : "bg-gray-50 border-gray-200"
                      }`}
                    >
                      <div className={`p-2 rounded-xl ${notif.unread ? notif.bg : "bg-gray-100"} border ${notif.unread ? notif.border : "border-gray-200"} shrink-0`}>
                        <Icon className={`w-4 h-4 ${notif.unread ? notif.color : "text-gray-400"}`} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-0.5">
                          <p className={`text-xs font-bold ${notif.unread ? "text-gray-900" : "text-gray-600"}`}>
                            {notif.title}
                          </p>
                          {notif.unread && (
                            <span className="w-1.5 h-1.5 rounded-full bg-purple-600 shrink-0" />
                          )}
                        </div>
                        <p className="text-[11px] text-gray-500 leading-relaxed">{notif.body}</p>
                        <p className="text-[10px] font-mono text-gray-400 mt-1">{notif.time}</p>
                      </div>
                      <button
                        onClick={() => dismissNotif(notif.id)}
                        className="p-1 rounded-lg hover:bg-gray-200 text-gray-400 hover:text-gray-600 transition-colors shrink-0"
                        title="Dismiss"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  );
                })
              )}
            </div>

            {/* Footer */}
            <div className="px-6 py-4 border-t border-gray-100 text-center">
              <button
                onClick={() => setIsNotifOpen(false)}
                className="text-xs font-bold text-gray-500 hover:text-gray-900 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

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
