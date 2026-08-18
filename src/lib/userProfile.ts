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
  streakDays: number;
  gpa: number;
  totalFocusHours: number;
  completedMilestones: number;
  totalMilestones: number;
  quizAccuracy: number;
  isDemoUser?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export const NEW_USER_PROFILE: StudentProfile = {
  displayName: "New Student",
  email: "student@university.edu",
  university: "Indian Institute of Technology (IIT) Bombay",
  currentYear: "1st Year Computer Science & Engineering",
  rollNumber: "2024CSB1001",
  specializations: ["Full-Stack Web Development", "Data Structures & Algorithms"],
  primaryGoal: "Master Socratic Concepts & Complete Course Roadmap",
  onboarded: false,
  streakDays: 0,
  gpa: 0.0,
  totalFocusHours: 0,
  completedMilestones: 0,
  totalMilestones: 16,
  quizAccuracy: 0,
  isDemoUser: false,
};

export const DEMO_SAMPLE_PROFILE: StudentProfile = {
  displayName: "Alex Sharma",
  email: "alex@university.edu",
  university: "IIT Bombay",
  currentYear: "3rd Year Computer Science and Engineering",
  rollNumber: "2023CSB1042",
  specializations: ["Full-Stack Web Development", "AI / Machine Learning", "Data Structures & Algorithms"],
  primaryGoal: "Master Advanced Socratic Concepts & Complete Course Milestones",
  onboarded: true,
  streakDays: 7,
  gpa: 3.85,
  totalFocusHours: 41.0,
  completedMilestones: 12,
  totalMilestones: 16,
  quizAccuracy: 92,
  isDemoUser: true,
};

const LOCAL_STORAGE_KEY = "nova_student_profile";

// ─── Helpers ─────────────────────────────────────────────────────────────────

/** Race a promise against a ms timeout. Returns null if timeout wins. */
function withTimeout<T>(promise: Promise<T>, ms: number): Promise<T | null> {
  return Promise.race([
    promise,
    new Promise<null>((resolve) => setTimeout(() => resolve(null), ms)),
  ]);
}

function readLocalProfile(): StudentProfile | null {
  if (typeof window === "undefined") return null;
  try {
    const cached = localStorage.getItem(LOCAL_STORAGE_KEY);
    return cached ? (JSON.parse(cached) as StudentProfile) : null;
  } catch {
    return null;
  }
}

function writeLocalProfile(profile: StudentProfile): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(profile));
  } catch (e) {
    console.warn("LocalStorage write warning:", e);
  }
}

// ─── Public API ───────────────────────────────────────────────────────────────

/**
 * Save a (partial) student profile.
 * - Writes to localStorage immediately (zero latency for redirects / UI).
 * - Best-effort sync to Firestore (1.5 s timeout, non-blocking).
 */
export async function saveStudentProfile(
  profile: Partial<StudentProfile>
): Promise<StudentProfile> {
  const user = auth.currentUser;
  const uid = user?.uid || profile.uid || "new_student";

  const baseProfile = readLocalProfile() ?? NEW_USER_PROFILE;

  const updatedProfile: StudentProfile = {
    ...baseProfile,
    ...profile,
    uid,
    displayName: profile.displayName || user?.displayName || baseProfile.displayName,
    email: profile.email || user?.email || baseProfile.email,
    onboarded: true,
    updatedAt: new Date().toISOString(),
    createdAt: baseProfile.createdAt ?? new Date().toISOString(),
  };

  // 1. Write to localStorage immediately — UI never waits on Firestore
  writeLocalProfile(updatedProfile);

  // 2. Best-effort Firestore sync — fire and forget, never blocks user flow
  if (user && db) {
    Promise.race([
      (async () => {
        try {
          await setDoc(doc(db, "users", uid), updatedProfile, { merge: true });
        } catch (err) {
          console.warn("Firestore profile sync warning (non-fatal):", err);
        }
      })(),
      new Promise((resolve) => setTimeout(resolve, 1500)),
    ]).catch(() => {});
  }

  return updatedProfile;
}

/**
 * Get the current student profile.
 * 1. Returns localStorage immediately if available (instant).
 * 2. Falls back to Firestore (3 s timeout) — auto-creates doc for new users.
 * 3. Returns blank NEW_USER_PROFILE if all else fails (never crashes).
 */
export async function getStudentProfile(): Promise<StudentProfile> {
  // 1. Return from localStorage immediately if available
  const cached = readLocalProfile();
  if (cached) return cached;

  // 2. If authenticated, try Firestore with a 3s timeout
  const user = auth.currentUser;
  if (user && db) {
    const firestoreLoad = async (): Promise<StudentProfile | null> => {
      try {
        const userRef = doc(db, "users", user.uid);
        const snap = await getDoc(userRef);

        if (snap.exists()) {
          const profile = snap.data() as StudentProfile;
          writeLocalProfile(profile);
          return profile;
        }

        // New user — no Firestore doc yet. Create a default one.
        const defaultProfile: StudentProfile = {
          ...NEW_USER_PROFILE,
          uid: user.uid,
          displayName: user.displayName || NEW_USER_PROFILE.displayName,
          email: user.email || NEW_USER_PROFILE.email,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };

        await setDoc(userRef, defaultProfile);
        writeLocalProfile(defaultProfile);
        return defaultProfile;
      } catch (err) {
        console.warn("Firestore getStudentProfile warning (non-fatal):", err);
        return null;
      }
    };

    const result = await withTimeout(firestoreLoad(), 3000);
    if (result) return result;
  }

  // 3. Final fallback — never crash
  return NEW_USER_PROFILE;
}
