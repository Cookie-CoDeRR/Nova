"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import ReactMarkdown from "react-markdown";
import { Send, Sparkles, Bot, User, Trash2, BarChart2, Brain } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { NovaLogo } from "@/components/ui/NovaLogo";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
}

const QUICK_CHIPS = [
  { id: "explain", label: "✨ Explain this simply", prompt: "Can you explain this concept simply using a real-world analogy and test my understanding?" },
  { id: "quiz", label: "🧠 Quiz me on this", prompt: "Quiz me on this topic! Ask me one Socratic question at a time and wait for my response." },
  { id: "notes", label: "📚 Summarize my notes", prompt: "Summarize the core takeaways and formulas from this topic into concise bullet points." },
  { id: "solver", label: "📐 Step-by-step solver", prompt: "Guide me step-by-step through solving this problem without revealing the final answer right away." },
];

export default function TutorPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      role: "assistant",
      content: `Welcome to **NOVA Socratic Tutor**. 🎓\n\nI am configured to guide you through complex academic concepts, homework, and derivations. Instead of giving away direct answers, I will ask leading questions and break down principles step-by-step.\n\nHow can I help you master your coursework today?`,
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showChips, setShowChips] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const target = e.currentTarget;
    const isAtBottom = target.scrollHeight - target.scrollTop - target.clientHeight < 30;
    setShowChips(isAtBottom);
  };

  useEffect(() => {
    const handleWindowScroll = () => {
      const scrollTop = window.scrollY || document.documentElement.scrollTop;
      const windowHeight = window.innerHeight;
      const docHeight = document.documentElement.scrollHeight;
      
      // If we are within 100px of the bottom, show the chips. Otherwise hide.
      const isNearBottom = docHeight - (scrollTop + windowHeight) < 100;
      setShowChips(isNearBottom);
    };

    window.addEventListener("scroll", handleWindowScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleWindowScroll);
  }, []);

  const handleSubmit = async (textToSend?: string) => {
    const messageContent = textToSend || input;
    if (!messageContent.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: messageContent.trim(),
    };

    setMessages((prev) => [...prev, userMessage]);
    if (!textToSend) setInput("");
    setIsLoading(true);

    const assistantId = (Date.now() + 1).toString();
    const initialAssistantMessage: Message = {
      id: assistantId,
      role: "assistant",
      content: "",
    };

    setMessages((prev) => [...prev, initialAssistantMessage]);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [...messages, userMessage],
          prompt: messageContent.trim(),
        }),
      });

      if (!response.ok || !response.body) {
        const errorData = await response.json().catch(() => ({}));
        const errorMsg = errorData.details || errorData.error || "Failed to start response stream";
        setMessages((prev) =>
          prev.map((msg) =>
            msg.id === assistantId
              ? { ...msg, content: `Error: ${errorMsg}. Please check your API key configuration.` }
              : msg
          )
        );
        setIsLoading(false);
        return;
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        const chunk = decoder.decode(value, { stream: true });

        setMessages((prev) =>
          prev.map((msg) =>
            msg.id === assistantId ? { ...msg, content: msg.content + chunk } : msg
          )
        );
      }
    } catch (err) {
      console.error("Streaming error:", err);
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === assistantId
            ? { ...msg, content: "I encountered a streaming interruption. Let's try re-framing your question!" }
            : msg
        )
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const clearChat = () => {
    setMessages([
      {
        id: "welcome-" + Date.now(),
        role: "assistant",
        content: `Welcome to **NOVA Socratic Tutor**. 🎓\n\nAsk any academic question or pick a quick prompt chip to start!`,
      },
    ]);
  };

  return (
    <div className="min-h-[calc(100vh-140px)] bg-[#FAFAFA] text-gray-700 flex flex-col justify-between items-center py-6 px-4 font-sans">

      {/* Centered Document-Style Container (max-w-3xl) */}
      <div className="w-full max-w-3xl flex-1 flex flex-col justify-between space-y-6">

        {/* Top Header Card */}
        <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-100 border border-purple-200 flex items-center justify-center text-purple-800 shadow-xs">
              <Bot className="w-5 h-5" />
            </div>
            <div>
              <div className="inline-flex items-center gap-1.5 text-[10px] font-bold font-mono uppercase tracking-wider text-purple-800 bg-purple-50 px-2 py-0.5 rounded border border-purple-200 mb-0.5">
                <Sparkles className="w-3 h-3 text-purple-600" />
                Socratic AI Engine
              </div>
              <h1 className="font-serif text-xl sm:text-2xl font-bold text-gray-900 tracking-tight">
                Academic Socratic Tutor
              </h1>
            </div>
          </div>

          <button
            onClick={clearChat}
            className="p-2 rounded-xl bg-gray-100 border border-gray-200 text-gray-600 hover:text-red-600 hover:bg-red-50 transition-colors text-xs flex items-center gap-1.5 font-bold"
            title="Reset Chat"
          >
            <Trash2 className="w-4 h-4" />
            <span className="hidden sm:inline">Clear Chat</span>
          </button>
        </div>

        {/* Chat Messages List */}
        <div onScroll={handleScroll} className="flex-1 space-y-6 overflow-y-auto pr-1 py-2">
          {messages.map((msg) => {
            const isUser = msg.role === "user";

            return (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.25 }}
                className={cn("flex flex-col gap-1.5 max-w-full", isUser ? "items-end" : "items-start")}
              >
                {/* Role badge */}
                <div className="flex items-center gap-1.5 text-[10px] font-mono font-bold uppercase tracking-wider text-gray-400 px-1">
                  {isUser ? (
                    <>
                      <span>Student Note</span>
                      <User className="w-3 h-3 text-gray-700" />
                    </>
                  ) : (
                    <>
                      <Bot className="w-3 h-3 text-purple-700" />
                      <span>NOVA Socratic Guidance</span>
                    </>
                  )}
                </div>

                {/* Bubble Container: User (solid dark charcoal block) vs AI (crisp white card with left purple accent) */}
                <div
                  className={cn(
                    "text-sm leading-relaxed max-w-[90%] sm:max-w-[85%]",
                    isUser
                      ? "p-5 rounded-2xl rounded-tr-none bg-gray-900 text-white shadow-xs font-medium"
                      : "p-6 rounded-2xl rounded-tl-none bg-white border border-gray-200 border-l-4 border-l-purple-600 text-gray-800 shadow-sm"
                  )}
                >
                  {isUser ? (
                    <p className="whitespace-pre-wrap font-medium">{msg.content}</p>
                  ) : (
                    <div className="prose prose-neutral max-w-none text-gray-800 text-sm leading-relaxed space-y-3">
                      <ReactMarkdown>{msg.content}</ReactMarkdown>
                    </div>
                  )}
                </div>
              </motion.div>
            );
          })}

          {/* Streaming Indicator */}
          {isLoading && (
            <div className="flex items-center gap-2 text-xs text-purple-700 font-mono font-bold py-2 px-1">
              <Sparkles className="w-4 h-4 animate-spin text-purple-600" />
              <span>NOVA is streaming Socratic guidance...</span>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Quick Action Chips & Floating Command Bar Input */}
        <div className="sticky bottom-4 pt-4 bg-gradient-to-t from-[#FAFAFA] via-[#FAFAFA]/90 to-transparent space-y-3">

          {/* Quick Action Chips Row */}
          <AnimatePresence initial={false}>
            {showChips && (
              <motion.div
                initial={{ opacity: 0, height: 0, y: 8 }}
                animate={{ opacity: 1, height: "auto", y: 0 }}
                exit={{ opacity: 0, height: 0, y: 8 }}
                transition={{ duration: 0.2, ease: "easeInOut" }}
                className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar overflow-hidden shrink-0"
              >
                {QUICK_CHIPS.map((chip) => (
                  <button
                    key={chip.id}
                    disabled={isLoading}
                    onClick={() => handleSubmit(chip.prompt)}
                    className="shrink-0 bg-white border border-gray-200 hover:border-gray-400 hover:bg-gray-50 rounded-full text-xs font-semibold px-4 py-2 text-gray-700 transition-all duration-200 shadow-2xs cursor-pointer"
                  >
                    {chip.label}
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Floating Command Bar Input Area with Merged Navigation */}
          <div className="relative flex items-center p-1.5 sm:p-2 rounded-2xl bg-white border border-gray-200 shadow-md focus-within:border-purple-300 focus-within:ring-2 focus-within:ring-purple-100 transition-all">
            
            {/* Merged Navigation Shortcuts */}
            <div className="flex items-center gap-1 sm:gap-1.5 px-2 border-r border-gray-100 shrink-0">
              {/* Logo icon leading to dashboard */}
              <Link href="/dashboard" className="p-1 rounded-lg hover:bg-gray-50 transition-colors shrink-0" title="Home Dashboard">
                <NovaLogo size="sm" iconOnly={true} href="" />
              </Link>
              
              {/* Study Pulse Icon */}
              <Link
                href="/dashboard"
                className="p-1.5 rounded-lg text-gray-400 hover:text-purple-600 hover:bg-purple-50 transition-colors shrink-0"
                title="Study Pulse Dashboard"
              >
                <BarChart2 className="w-4 h-4" />
              </Link>

              {/* Knowledge Base Icon */}
              <Link
                href="/brain"
                className="p-1.5 rounded-lg text-gray-400 hover:text-purple-600 hover:bg-purple-50 transition-colors shrink-0"
                title="Knowledge Base"
              >
                <Brain className="w-4 h-4" />
              </Link>
            </div>

            {/* Input field */}
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask NOVA a question... (Press Enter to send)"
              rows={1}
              disabled={isLoading}
              className="w-full bg-transparent text-sm text-gray-900 placeholder-gray-400 px-3 py-2 focus:outline-none resize-none max-h-32 min-h-[40px] font-medium"
            />

            {/* Send button */}
            <button
              onClick={() => handleSubmit()}
              disabled={!input.trim() || isLoading}
              className={cn(
                "p-3 rounded-xl transition-all shrink-0 flex items-center justify-center ml-1 cursor-pointer",
                input.trim() && !isLoading
                  ? "bg-gray-900 text-white shadow-xs hover:bg-gray-800 scale-105"
                  : "bg-gray-100 text-gray-400 cursor-not-allowed"
              )}
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
