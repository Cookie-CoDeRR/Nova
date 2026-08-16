"use client";

import React, { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { auth, googleProvider } from "@/lib/firebase";
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, signInWithPopup } from "firebase/auth";
import { Sparkles, ArrowRight, Lock, Mail, Check, LogIn, UserPlus } from "lucide-react";
import { GlobalNotebookBg } from "@/components/ui/GlobalNotebookBg";
import { cn } from "@/lib/utils";

export default function AuthPage() {
  const [tab, setTab] = useState<"LOGIN" | "REGISTER">("LOGIN");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(true);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;

    setLoading(true);
    setMessage(null);

    try {
      if (tab === "LOGIN") {
        await signInWithEmailAndPassword(auth, email, password);
        setMessage({ type: "success", text: "Successfully authenticated with Firebase! Redirecting..." });
        setTimeout(() => {
          window.location.href = "/dashboard";
        }, 1000);
      } else {
        await createUserWithEmailAndPassword(auth, email, password);
        setMessage({ type: "success", text: "Firebase Account created! Welcome to NOVA Sanctuary." });
        setTimeout(() => {
          window.location.href = "/dashboard";
        }, 1000);
      }
    } catch (err: any) {
      console.error("Firebase auth error:", err);
      let errorText = err.message || "Firebase Authentication failed.";
      if (err.code === "auth/invalid-credential" || err.code === "auth/user-not-found") {
        errorText = "Invalid email or password. Please check your credentials.";
      } else if (err.code === "auth/email-already-in-use") {
        errorText = "An account with this email already exists. Try logging in instead.";
      }
      setMessage({ type: "error", text: errorText });
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleAuth = async () => {
    setLoading(true);
    setMessage(null);
    try {
      await signInWithPopup(auth, googleProvider);
      setMessage({ type: "success", text: "Google Authentication successful! Redirecting..." });
      setTimeout(() => {
        window.location.href = "/dashboard";
      }, 1000);
    } catch (err: any) {
      console.error("Firebase Google Auth error:", err);
      setMessage({ type: "error", text: err.message || "Google sign in was cancelled or failed." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-[#FAFAFA] text-gray-800 flex flex-col justify-center items-center p-4 relative overflow-hidden font-sans">
      
      {/* Global Scroll-Aware & Idle-Breathing Floating Notebook Background */}
      <GlobalNotebookBg />

      {/* Brand Link */}
      <Link href="/" className="absolute top-8 left-8 flex items-center gap-2 z-20 hover:opacity-80 transition-opacity">
        <div className="w-8 h-8 rounded-lg bg-gray-900 flex items-center justify-center font-bold text-xs text-white shadow-xs">
          N
        </div>
        <span className="font-extrabold text-sm tracking-wider text-gray-900 font-sans">NOVA SANCTUARY</span>
      </Link>

      {/* Auth Card Container */}
      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
        className="w-full max-w-md z-10"
      >
        <div className="bg-white/90 backdrop-blur-md border border-gray-200 shadow-xl rounded-3xl p-8 relative overflow-hidden">
          
          <div className="text-center mb-6">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-100 border border-purple-200 text-purple-800 text-xs font-bold mb-3 font-mono">
              <Sparkles className="w-3.5 h-3.5 text-purple-600" />
              Firebase Auth Portal
            </div>
            <h1 className="text-2xl font-black text-gray-900 tracking-tight font-serif">
              {tab === "LOGIN" ? "Welcome Back to NOVA" : "Join Your Academic Sanctuary"}
            </h1>
            <p className="text-xs text-gray-500 mt-1">
              Enter your student credentials to access your personalized AI companion
            </p>
          </div>

          <div className="flex items-center p-1 rounded-xl bg-gray-100 border border-gray-200 text-xs mb-6">
            <button
              onClick={() => { setTab("LOGIN"); setMessage(null); }}
              className={cn("flex-1 py-2 rounded-lg font-bold transition-all flex items-center justify-center gap-1.5", tab === "LOGIN" ? "bg-gray-900 text-white shadow-xs" : "text-gray-600 hover:text-gray-900")}
            >
              <LogIn className="w-3.5 h-3.5" /> Student Login
            </button>
            <button
              onClick={() => { setTab("REGISTER"); setMessage(null); }}
              className={cn("flex-1 py-2 rounded-lg font-bold transition-all flex items-center justify-center gap-1.5", tab === "REGISTER" ? "bg-gray-900 text-white shadow-xs" : "text-gray-600 hover:text-gray-900")}
            >
              <UserPlus className="w-3.5 h-3.5" /> Create Account
            </button>
          </div>

          {/* Google Auth Button */}
          <button
            onClick={handleGoogleAuth}
            disabled={loading}
            className="w-full py-3 rounded-xl bg-white border border-gray-200 hover:bg-gray-50 text-xs font-bold text-gray-900 transition-all duration-200 flex items-center justify-center gap-3 shadow-xs mb-5 cursor-pointer"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24">
              <path fill="#EA4335" d="M12 5c1.6 0 3 .6 4.1 1.6l3.1-3.1C17.3 1.7 14.8 1 12 1 7.5 1 3.7 3.6 1.9 7.3l3.7 2.9C6.5 7.3 9 5 12 5z" />
              <path fill="#4285F4" d="M23.5 12.3c0-.8-.1-1.6-.2-2.3H12v4.5h6.5c-.3 1.5-1.1 2.8-2.4 3.7l3.7 2.9c2.2-2 3.7-5 3.7-8.8z" />
              <path fill="#FBBC05" d="M5.6 14.8c-.2-.7-.4-1.5-.4-2.3s.2-1.6.4-2.3L1.9 7.3C.7 9.7 0 10.8 0 12s.7 2.3 1.9 4.7l3.7-2.9z" />
              <path fill="#34A853" d="M12 23c3.2 0 6-1.1 8-3l-3.7-2.9c-1.1.7-2.5 1.2-4.3 1.2-3 0-5.5-2.3-6.4-5.2L1.9 16C3.7 19.7 7.5 23 12 23z" />
            </svg>
            <span>Continue with Google</span>
          </button>

          {message && (
            <div className={cn("p-3 rounded-xl text-xs font-medium mb-4 flex items-center gap-2", message.type === "success" ? "bg-emerald-100 border border-emerald-300 text-emerald-900" : "bg-red-100 border border-red-300 text-red-900")}>
              <Check className="w-4 h-4 shrink-0" />
              <span>{message.text}</span>
            </div>
          )}

          <form onSubmit={handleAuth} className="space-y-4">
            <div>
              <label className="text-xs font-bold text-gray-700 block mb-1.5 flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-purple-700" /> Student Email Address
              </label>
              <input
                type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="alex@university.edu"
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3.5 py-2.5 text-xs text-gray-900 placeholder-gray-400 focus:outline-none focus:border-gray-400 transition-all font-medium"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-gray-700 block mb-1.5 flex items-center gap-1.5">
                <Lock className="w-3.5 h-3.5 text-purple-700" /> Password
              </label>
              <input
                type="password" required value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••••••"
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3.5 py-2.5 text-xs text-gray-900 placeholder-gray-400 focus:outline-none focus:border-gray-400 transition-all font-medium"
              />
            </div>

            <div className="flex items-center justify-between text-xs pt-1">
              <label className="flex items-center gap-2 cursor-pointer text-gray-600 hover:text-gray-900">
                <input type="checkbox" checked={rememberMe} onChange={(e) => setRememberMe(e.target.checked)} className="rounded bg-gray-100 border-gray-300 text-purple-600 focus:ring-0 cursor-pointer" />
                <span>Remember Me</span>
              </label>
              <a href="#" className="text-purple-700 hover:underline font-semibold">Forgot password?</a>
            </div>

            <button
              type="submit" disabled={loading}
              className="w-full py-3 rounded-xl font-bold text-xs bg-gray-900 text-white hover:bg-gray-800 transition-all flex items-center justify-center gap-2 mt-2 shadow-xs cursor-pointer"
            >
              {loading ? "Connecting to Firebase..." : tab === "LOGIN" ? "Sign In with Firebase" : "Create Firebase Account"}
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

        </div>
      </motion.div>
    </div>
  );
}
