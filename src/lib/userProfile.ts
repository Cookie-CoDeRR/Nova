import { db, auth } from "@/lib/firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";

export interface StudentProfile {
  uid?: string;
  displayName: string;
  email: string;
  university: string;
  currentYear: string;
  rollNumber: string;
  specializations: string[];
  primaryGoal: string;
  onboarded: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export const DEFAULT_PROFILE: StudentProfile = {
  displayName: "Alex Sharma",
  email: "alex@university.edu",
  university: "IIT Bombay",
  currentYear: "3rd Year Computer Science and Engineering",
  rollNumber: "2023CSB1042",
  specializations: ["Full-Stack Web Development", "AI / Machine Learning", "Data Structures & Algorithms"],
  primaryGoal: "Master Advanced Socratic Concepts & Complete Course Milestones",
  onboarded: true,
};

const LOCAL_STORAGE_KEY = "nova_student_profile";

export async function saveStudentProfile(profile: Partial<StudentProfile>): Promise<StudentProfile> {
  const user = auth.currentUser;
  const uid = user?.uid || profile.uid || "demo_student";

  const updatedProfile: StudentProfile = {
    ...DEFAULT_PROFILE,
    ...profile,
    uid,
    displayName: user?.displayName || profile.displayName || DEFAULT_PROFILE.displayName,
    email: user?.email || profile.email || DEFAULT_PROFILE.email,
    onboarded: true,
    updatedAt: new Date().toISOString(),
  };

  // 1. Synchronously save to LocalStorage for instant zero-latency client UI & routing
  if (typeof window !== "undefined") {
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updatedProfile));
    } catch (e) {
      console.warn("LocalStorage save warning:", e);
    }
  }

  // 2. Non-blocking async firestore save with 1.2s timeout race
  if (user && db) {
    const firestoreSave = async () => {
      try {
        const userRef = doc(db, "users", uid);
        await setDoc(userRef, updatedProfile, { merge: true });
      } catch (err) {
        console.warn("Firestore profile sync warning:", err);
      }
    };

    // Race firestore save with 1.2s timeout so the UI never blocks or gets stuck
    await Promise.race([
      firestoreSave(),
      new Promise((resolve) => setTimeout(resolve, 1200)),
    ]);
  }

  return updatedProfile;
}

export async function getStudentProfile(): Promise<StudentProfile> {
  // 1. Check local storage first for instant zero-latency load
  if (typeof window !== "undefined") {
    const cached = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (cached) {
      try {
        return JSON.parse(cached) as StudentProfile;
      } catch (e) {
        console.error("Error parsing cached profile:", e);
      }
    }
  }

  // 2. Check Firestore if authenticated
  const user = auth.currentUser;
  if (user && db) {
    try {
      const userRef = doc(db, "users", user.uid);
      const snap = await getDoc(userRef);
      if (snap.exists()) {
        const profile = snap.data() as StudentProfile;
        if (typeof window !== "undefined") {
          localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(profile));
        }
        return profile;
      }
    } catch (err) {
      console.warn("Firestore fetch profile warning:", err);
    }
  }

  return DEFAULT_PROFILE;
}
