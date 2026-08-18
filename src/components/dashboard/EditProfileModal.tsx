"use client";

import React, { useState, useEffect } from "react";
import { X, User, GraduationCap, BookOpen, ShieldCheck, Zap, Save, Layers } from "lucide-react";
import { StudentProfile, saveStudentProfile } from "@/lib/userProfile";
import { ENGINEERING_BRANCHES, ACADEMIC_YEARS } from "@/lib/constants";

interface EditProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentProfile: StudentProfile;
  onProfileUpdated: (updated: StudentProfile) => void;
}

const SPECIALIZATION_OPTIONS = [
  "Full-Stack Web Development",
  "AI & Machine Learning",
  "Data Structures & Algorithms",
  "Cloud & DevOps Architecture",
  "Cyber Security & Cryptography",
  "Quantum Physics & Computing",
];

export function EditProfileModal({ isOpen, onClose, currentProfile, onProfileUpdated }: EditProfileModalProps) {
  const [displayName, setDisplayName] = useState(currentProfile.displayName);
  const [university, setUniversity] = useState(currentProfile.university);
  const [branch, setBranch] = useState(ENGINEERING_BRANCHES[0]);
  const [academicYear, setAcademicYear] = useState(ACADEMIC_YEARS[2]);
  const [rollNumber, setRollNumber] = useState(currentProfile.rollNumber);
  const [specializations, setSpecializations] = useState<string[]>(currentProfile.specializations);
  const [primaryGoal, setPrimaryGoal] = useState(currentProfile.primaryGoal);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setDisplayName(currentProfile.displayName);
    setUniversity(currentProfile.university);
    setRollNumber(currentProfile.rollNumber);
    setSpecializations(currentProfile.specializations);
    setPrimaryGoal(currentProfile.primaryGoal);
  }, [currentProfile, isOpen]);

  // Hide the top header and bottom floating nav when the profile modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.classList.add("profile-modal-open");
    } else {
      document.body.classList.remove("profile-modal-open");
    }
    return () => document.body.classList.remove("profile-modal-open");
  }, [isOpen]);

  if (!isOpen) return null;

  const toggleSpec = (spec: string) => {
    if (specializations.includes(spec)) {
      if (specializations.length > 1) {
        setSpecializations(specializations.filter((s) => s !== spec));
      }
    } else {
      setSpecializations([...specializations, spec]);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const yearMajorString = `${academicYear} • ${branch}`;

    try {
      const updated = await saveStudentProfile({
        displayName,
        university,
        currentYear: yearMajorString,
        rollNumber,
        specializations,
        primaryGoal,
      });

      onProfileUpdated(updated);
      onClose();
    } catch (err) {
      console.error("Failed to update profile:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[60] bg-gray-900/50 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="w-full max-w-2xl bg-white border border-gray-200 rounded-3xl p-6 sm:p-8 shadow-2xl font-sans text-gray-800 relative max-h-[88vh] overflow-y-auto">
        <div className="flex items-center justify-between border-b border-gray-100 pb-4 mb-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-purple-50 border border-purple-200 text-purple-800">
              <User className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-gray-900 tracking-tight">Edit Academic Student Profile</h2>
              <p className="text-xs text-gray-500">Update university, engineering branch, roll number & specializations</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-gray-100 border border-gray-200 text-gray-500 hover:text-gray-900"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSave} className="space-y-4">
          <div>
            <label className="text-xs font-bold text-gray-700 block mb-1 font-mono uppercase">Full Name</label>
            <input
              type="text"
              required
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3.5 py-2 text-xs font-medium text-gray-900 focus:outline-none focus:border-gray-400"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-gray-700 block mb-1 font-mono uppercase">University / College</label>
            <input
              type="text"
              required
              value={university}
              onChange={(e) => setUniversity(e.target.value)}
              className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3.5 py-2 text-xs font-medium text-gray-900 focus:outline-none focus:border-gray-400"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-gray-700 block mb-1 font-mono uppercase flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5 text-purple-700" /> Engineering Branch / Major
            </label>
            <select
              value={branch}
              onChange={(e) => setBranch(e.target.value)}
              className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3.5 py-2 text-xs font-medium text-gray-900 focus:outline-none focus:border-gray-400"
            >
              {ENGINEERING_BRANCHES.map((b, idx) => (
                <option key={idx} value={b}>
                  {b}
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-bold text-gray-700 block mb-1 font-mono uppercase">Academic Year</label>
              <select
                value={academicYear}
                onChange={(e) => setAcademicYear(e.target.value)}
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3.5 py-2 text-xs font-medium text-gray-900 focus:outline-none focus:border-gray-400"
              >
                {ACADEMIC_YEARS.map((y, idx) => (
                  <option key={idx} value={y}>
                    {y}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-xs font-bold text-gray-700 block mb-1 font-mono uppercase">Student Roll Number</label>
              <input
                type="text"
                required
                value={rollNumber}
                onChange={(e) => setRollNumber(e.target.value)}
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3.5 py-2 text-xs font-medium text-gray-900 focus:outline-none focus:border-gray-400"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-gray-700 block mb-1.5 font-mono uppercase">Engineering Specializations</label>
            <div className="grid grid-cols-2 gap-2">
              {SPECIALIZATION_OPTIONS.map((spec) => {
                const isChecked = specializations.includes(spec);
                return (
                  <button
                    key={spec}
                    type="button"
                    onClick={() => toggleSpec(spec)}
                    className={`py-2 px-3 rounded-xl text-[11px] font-bold border transition-all text-left truncate ${
                      isChecked
                        ? "bg-purple-100 border-purple-300 text-purple-900 shadow-2xs"
                        : "bg-gray-50 border-gray-200 text-gray-600 hover:text-gray-900"
                    }`}
                  >
                    {isChecked ? "✓ " : "+ "} {spec}
                  </button>
                );
              })}
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-gray-700 block mb-1 font-mono uppercase">Primary Academic Goal</label>
            <input
              type="text"
              required
              value={primaryGoal}
              onChange={(e) => setPrimaryGoal(e.target.value)}
              className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3.5 py-2 text-xs font-medium text-gray-900 focus:outline-none focus:border-gray-400"
            />
          </div>

          <div className="flex items-center justify-end gap-2 pt-3 border-t border-gray-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-bold text-gray-600 hover:text-gray-900"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={loading}
              className="px-5 py-2.5 rounded-xl text-xs font-bold bg-gray-900 text-white shadow-xs hover:bg-gray-800 flex items-center gap-1.5 cursor-pointer"
            >
              <Save className="w-4 h-4" />
              {loading ? "Saving Profile..." : "Save Profile Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
