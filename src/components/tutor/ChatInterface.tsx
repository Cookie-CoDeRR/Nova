"use client";

import React, { useState, useRef, useEffect } from "react";
import { GlassCard } from "@/components/ui/GlassCard";
import { QuickActionChips } from "./QuickActionChips";
import { CourseSelector, SAMPLE_COURSES } from "./CourseSelector";
import { ChatMessage } from "@/types";
import { Send, Sparkles, Bot, User, Trash2 } from "lucide-react";
import { motion } from "framer-motion";
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
    <GlassCard className="w-full h-[calc(100vh-140px)] flex flex-col justify-between overflow-hidden bg-white border border-gray-200 shadow-sm" glowColor="purple">
      {/* Header bar */}
      <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between bg-white">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-purple-100 border border-purple-200 flex items-center justify-center text-purple-800 shadow-xs">
            <Bot className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-bold text-gray-900 tracking-tight">Socratic AI Tutor</h2>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-purple-50 text-purple-900 border border-purple-200">
                Gemini 1.5 Pro
              </span>
            </div>
            <p className="text-xs text-gray-600">Guided step-by-step interactive learning</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <CourseSelector selectedCourseId={selectedCourseId} onSelectCourse={setSelectedCourseId} />
          <button
            onClick={clearChat}
            className="p-2 rounded-xl bg-gray-100 border border-gray-200 text-gray-600 hover:text-red-600 hover:bg-red-50 transition-colors"
            title="Clear Chat History"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Messages Scroll View */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-[#FAFAFA]">
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
                  "w-8 h-8 rounded-full flex items-center justify-center shrink-0 text-xs font-bold shadow-xs",
                  isUser
                    ? "bg-gray-900 text-white"
                    : "bg-purple-100 border border-purple-200 text-purple-900"
                )}
              >
                {isUser ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
              </div>

              {/* Message Bubble */}
              <div className="flex flex-col gap-1 max-w-[85%]">
                {msg.chips && (
                  <span className="self-end px-2 py-0.5 rounded-full text-[10px] font-semibold bg-purple-50 text-purple-900 border border-purple-200">
                    Used prompt: {msg.chips}
                  </span>
                )}
                <div
                  className={cn(
                    "p-4 rounded-2xl text-sm leading-relaxed whitespace-pre-wrap transition-all shadow-xs",
                    isUser
                      ? "bg-gray-900 text-white rounded-tr-none"
                      : "bg-white text-gray-800 rounded-tl-none border border-gray-200 border-l-4 border-l-purple-600"
                  )}
                >
                  {msg.message}
                </div>
                <span className={cn("text-[10px] text-gray-400 px-1", isUser ? "text-right" : "text-left")}>
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
            <div className="w-8 h-8 rounded-full bg-purple-100 border border-purple-200 flex items-center justify-center text-purple-900">
              <Bot className="w-4 h-4 animate-spin" />
            </div>
            <div className="p-4 rounded-2xl rounded-tl-none bg-white border border-gray-200 border-l-4 border-l-purple-600 flex items-center gap-2 text-xs text-purple-900 font-medium shadow-xs">
              <Sparkles className="w-4 h-4 animate-pulse text-purple-600" />
              <span>NOVA is formulating a Socratic response...</span>
            </div>
          </motion.div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Footer / Input Area */}
      <div className="p-4 border-t border-gray-200 bg-white space-y-2">
        <QuickActionChips
          disabled={isLoading}
          onSelectChip={(prompt, label) => handleSendMessage(prompt, label)}
        />

        <div className="relative flex items-end gap-2 p-2 rounded-2xl bg-gray-50 border border-gray-200 focus-within:border-gray-400 transition-all">
          <textarea
            value={inputPrompt}
            onChange={(e) => setInputPrompt(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask NOVA anything... (Press Enter to send, Shift+Enter for new line)"
            rows={1}
            disabled={isLoading}
            className="w-full bg-transparent text-sm text-gray-900 placeholder-gray-400 px-3 py-2 focus:outline-none resize-none max-h-32 min-h-[40px] font-medium"
          />

          <button
            onClick={() => handleSendMessage()}
            disabled={!inputPrompt.trim() || isLoading}
            className={cn(
              "p-2.5 rounded-xl font-bold transition-all shrink-0 flex items-center justify-center",
              inputPrompt.trim() && !isLoading
                ? "bg-gray-900 text-white shadow-xs hover:bg-gray-800"
                : "bg-gray-100 text-gray-400 cursor-not-allowed"
            )}
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </GlassCard>
  );
}
