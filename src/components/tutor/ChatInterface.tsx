"use client";

import React, { useState, useRef, useEffect } from "react";
import { GlassCard } from "@/components/ui/GlassCard";
import { QuickActionChips } from "./QuickActionChips";
import { CourseSelector, SAMPLE_COURSES } from "./CourseSelector";
import { ChatMessage } from "@/types";
import { Send, Sparkles, Bot, User, RefreshCw, Trash2, ArrowDown, BookOpen } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

const INITIAL_MESSAGES: ChatMessage[] = [
  {
    id: "m1",
    role: "assistant",
    message: `Greetings, Alex! I am **NOVA**, your Socratic AI Companion. 🎓

I am here to help you master your courses (like **CS 301 Data Structures** or **PHYS 202 Quantum Mechanics**) by guiding you through concepts step-by-step rather than just giving away final answers.

Click any quick prompt above or ask me any question to begin!`,
    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
  },
];

export function ChatInterface() {
  const [messages, setMessages] = useState<ChatMessage[]>(INITIAL_MESSAGES);
  const [inputPrompt, setInputPrompt] = useState("");
  const [selectedCourseId, setSelectedCourseId] = useState("all");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleSendMessage = async (textToSend?: string, chipLabel?: string) => {
    const query = textToSend || inputPrompt;
    if (!query.trim() || isLoading) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: "user",
      message: query.trim(),
      chips: chipLabel,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMessage]);
    if (!textToSend) setInputPrompt("");
    setIsLoading(true);

    try {
      const activeCourse = SAMPLE_COURSES.find((c) => c.id === selectedCourseId);
      const courseName = activeCourse && activeCourse.id !== "all" ? `${activeCourse.code} ${activeCourse.name}` : undefined;

      const response = await fetch("/api/tutor", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: query.trim(),
          courseContext: courseName,
          history: messages.slice(-6).map((m) => ({ role: m.role, message: m.message })),
        }),
      });

      const data = await response.json();

      const assistantMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        message: data.reply || "I am reflecting on your question. Let's break it down together!",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (err) {
      console.error("Failed to query tutor:", err);
      const errorMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        message: "I encountered a minor network blip. Let's try re-framing your question!",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const clearChat = () => setMessages([INITIAL_MESSAGES[0]]);

  return (
    <GlassCard className="w-full h-[calc(100vh-140px)] flex flex-col justify-between overflow-hidden" glowColor="purple">
      {/* Header bar */}
      <div className="px-6 py-4 border-b border-white/10 flex items-center justify-between bg-white/[0.02]">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-purple-600 to-blue-500 p-0.5 shadow-[0_0_20px_rgba(124,58,237,0.4)]">
            <div className="w-full h-full rounded-[14px] bg-zinc-950 flex items-center justify-center text-purple-300">
              <Bot className="w-5 h-5" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-bold text-white tracking-tight">Socratic AI Tutor</h2>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-purple-500/20 text-purple-300 border border-purple-500/30">
                Gemini 1.5 Pro
              </span>
            </div>
            <p className="text-xs text-zinc-400">Guided step-by-step interactive learning</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <CourseSelector selectedCourseId={selectedCourseId} onSelectCourse={setSelectedCourseId} />
          <button
            onClick={clearChat}
            className="p-2 rounded-xl bg-white/5 border border-white/10 text-zinc-400 hover:text-red-400 hover:bg-red-500/10 transition-colors"
            title="Clear Chat History"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Messages Scroll View */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4">
        {messages.map((msg) => {
          const isUser = msg.role === "user";
          return (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, y: 10, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.3 }}
              className={cn("flex gap-3 max-w-3xl", isUser ? "ml-auto flex-row-reverse" : "mr-auto")}
            >
              {/* Avatar */}
              <div
                className={cn(
                  "w-8 h-8 rounded-full flex items-center justify-center shrink-0 text-xs font-bold shadow-md",
                  isUser
                    ? "bg-gradient-to-tr from-indigo-500 to-purple-500 text-white"
                    : "bg-purple-900/40 border border-purple-500/40 text-purple-300"
                )}
              >
                {isUser ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
              </div>

              {/* Message Bubble */}
              <div className="flex flex-col gap-1 max-w-[85%]">
                {msg.chips && (
                  <span className="self-end px-2 py-0.5 rounded-full text-[10px] font-semibold bg-purple-500/20 text-purple-300 border border-purple-500/30">
                    Used prompt: {msg.chips}
                  </span>
                )}
                <div
                  className={cn(
                    "p-4 rounded-2xl text-sm leading-relaxed whitespace-pre-wrap transition-all shadow-lg",
                    isUser
                      ? "bg-purple-600/80 text-white rounded-tr-none border border-purple-400/30"
                      : "bg-white/[0.04] text-zinc-100 rounded-tl-none border border-white/10 backdrop-blur-md"
                  )}
                >
                  {msg.message}
                </div>
                <span className={cn("text-[10px] text-zinc-500 px-1", isUser ? "text-right" : "text-left")}>
                  {msg.timestamp}
                </span>
              </div>
            </motion.div>
          );
        })}

        {/* Loading Indicator */}
        {isLoading && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex gap-3 max-w-xl mr-auto"
          >
            <div className="w-8 h-8 rounded-full bg-purple-900/40 border border-purple-500/40 flex items-center justify-center text-purple-300">
              <Bot className="w-4 h-4 animate-spin" />
            </div>
            <div className="p-4 rounded-2xl rounded-tl-none bg-white/[0.04] border border-white/10 flex items-center gap-2 text-xs text-purple-300 font-medium">
              <Sparkles className="w-4 h-4 animate-pulse text-purple-400" />
              <span>NOVA is formulating a Socratic response...</span>
            </div>
          </motion.div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Footer / Input Area */}
      <div className="p-4 border-t border-white/10 bg-black/40 backdrop-blur-xl space-y-2">
        {/* Quick Action Chips */}
        <QuickActionChips
          disabled={isLoading}
          onSelectChip={(prompt, label) => handleSendMessage(prompt, label)}
        />

        {/* Input Bar */}
        <div className="relative flex items-end gap-2 p-2 rounded-2xl bg-white/[0.03] border border-white/10 focus-within:border-purple-500/50 focus-within:ring-2 focus-within:ring-purple-500/20 transition-all">
          <textarea
            value={inputPrompt}
            onChange={(e) => setInputPrompt(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask NOVA anything... (Press Enter to send, Shift+Enter for new line)"
            rows={1}
            disabled={isLoading}
            className="w-full bg-transparent text-sm text-white placeholder-zinc-500 px-3 py-2 focus:outline-none resize-none max-h-32 min-h-[40px]"
          />

          <button
            onClick={() => handleSendMessage()}
            disabled={!inputPrompt.trim() || isLoading}
            className={cn(
              "p-2.5 rounded-xl font-bold transition-all shrink-0 flex items-center justify-center",
              inputPrompt.trim() && !isLoading
                ? "bg-purple-600 text-white shadow-[0_0_15px_rgba(124,58,237,0.5)] hover:bg-purple-500"
                : "bg-white/5 text-zinc-600 cursor-not-allowed"
            )}
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </GlassCard>
  );
}
