"use client";

import React, { useState, useRef, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import { Send, Sparkles, Bot, User, RefreshCw, Trash2, ArrowDown, BookOpen } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

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
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

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
        throw new Error("Failed to start response stream");
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
    <div className="min-h-[calc(100vh-140px)] bg-black text-zinc-100 flex flex-col justify-between items-center py-4 px-4">
      {/* Centered Document-Style Container (max-w-3xl) */}
      <div className="w-full max-w-3xl flex-1 flex flex-col justify-between">
        
        {/* Top Header Bar */}
        <div className="flex items-center justify-between py-3 px-4 border-b border-white/10 mb-4 bg-zinc-950/60 backdrop-blur-xl rounded-2xl">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-full bg-purple-600/30 border border-purple-500/40 flex items-center justify-center text-purple-300 shadow-[0_0_12px_rgba(124,58,237,0.4)]">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <span className="text-sm font-bold text-white tracking-tight">NOVA Socratic AI</span>
              <span className="text-[10px] text-zinc-400 block font-mono">Real-time Stream • Gemini Flash</span>
            </div>
          </div>

          <button
            onClick={clearChat}
            className="p-1.5 rounded-lg bg-white/5 border border-white/10 text-zinc-400 hover:text-red-400 hover:bg-red-500/10 transition-colors text-xs flex items-center gap-1.5"
            title="Reset Chat"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Clear</span>
          </button>
        </div>

        {/* Chat Messages List */}
        <div className="flex-1 space-y-6 overflow-y-auto pr-1 py-2">
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
                <div className="flex items-center gap-1.5 text-[11px] font-semibold text-zinc-500 px-1">
                  {isUser ? (
                    <>
                      <span>You</span>
                      <User className="w-3 h-3 text-purple-400" />
                    </>
                  ) : (
                    <>
                      <Bot className="w-3 h-3 text-purple-400" />
                      <span>NOVA Tutor</span>
                    </>
                  )}
                </div>

                {/* Bubble Container */}
                <div
                  className={cn(
                    "text-sm leading-relaxed max-w-[88%] sm:max-w-[80%]",
                    isUser
                      ? "p-4 rounded-2xl rounded-tr-none border border-white/10 bg-white/[0.04] text-white shadow-md"
                      : "bg-transparent text-neutral-300 py-2 px-1"
                  )}
                >
                  {isUser ? (
                    <p className="whitespace-pre-wrap">{msg.content}</p>
                  ) : (
                    <div className="prose prose-invert prose-purple max-w-none text-neutral-300 text-sm leading-relaxed space-y-3">
                      <ReactMarkdown>{msg.content}</ReactMarkdown>
                    </div>
                  )}
                </div>
              </motion.div>
            );
          })}

          {/* Streaming Indicator */}
          {isLoading && (
            <div className="flex items-center gap-2 text-xs text-purple-400 font-mono py-2 px-1">
              <Sparkles className="w-3.5 h-3.5 animate-spin text-purple-400" />
              <span>NOVA is streaming Socratic guidance...</span>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Quick Action Chips & Floating Input Command Bar */}
        <div className="sticky bottom-4 pt-4 bg-gradient-to-t from-black via-black/90 to-transparent space-y-3">
          
          {/* Quick Action Chips Horizontal Row */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
            {QUICK_CHIPS.map((chip) => (
              <button
                key={chip.id}
                disabled={isLoading}
                onClick={() => handleSubmit(chip.prompt)}
                className="shrink-0 bg-white/5 backdrop-blur-md border border-white/10 hover:border-purple-500/40 hover:bg-white/10 rounded-full text-xs px-3.5 py-1.5 text-zinc-300 hover:text-white transition-all duration-200 shadow-sm"
              >
                {chip.label}
              </button>
            ))}
          </div>

          {/* Floating Command Bar Input Area */}
          <div className="relative flex items-center p-2 rounded-2xl bg-zinc-950/90 border border-white/10 shadow-[0_0_40px_rgba(124,58,237,0.15)] focus-within:border-purple-500/50 focus-within:shadow-[0_0_50px_rgba(124,58,237,0.25)] transition-all">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask NOVA a question... (Press Enter to send)"
              rows={1}
              disabled={isLoading}
              className="w-full bg-transparent text-sm text-white placeholder-zinc-500 px-3 py-2 focus:outline-none resize-none max-h-32 min-h-[40px]"
            />

            <button
              onClick={() => handleSubmit()}
              disabled={!input.trim() || isLoading}
              className={cn(
                "p-2.5 rounded-xl transition-all shrink-0 flex items-center justify-center ml-1",
                input.trim() && !isLoading
                  ? "bg-purple-600 text-white shadow-[0_0_15px_rgba(124,58,237,0.5)] hover:bg-purple-500 scale-105"
                  : "bg-white/5 text-zinc-600 cursor-not-allowed"
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
