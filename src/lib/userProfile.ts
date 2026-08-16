import { db, auth } from "@/lib/firebase";
import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore";

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
  specializations: ["Full-Stack Development", "AI / Machine Learning", "Data Structures & Algorithms"],
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

  // 1. Save to LocalStorage for instant reactive client UI
  if (typeof window !== "undefined") {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updatedProfile));
  }

  // 2. Persist to Firestore document (users/{uid})
  try {
    if (user) {
      const userRef = doc(db, "users", uid);
      await setDoc(userRef, updatedProfile, { merge: true });
    }
  } catch (err) {
    console.warn("Firestore profile save fallback to local storage:", err);
  }

  return updatedProfile;
}

export async function getStudentProfile(): Promise<StudentProfile> {
  // 1. Check local storage first
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

  // 2. Check Firestore
  const user = auth.currentUser;
  if (user) {
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
