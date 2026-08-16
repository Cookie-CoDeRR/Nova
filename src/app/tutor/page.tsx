"use client";

import React, { useState, useRef, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import { Send, Sparkles, Bot, User, Trash2 } from "lucide-react";
import { motion } from "framer-motion";
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
    <div className="min-h-[calc(100vh-140px)] bg-[#FAFAFA] text-neutral-900 flex flex-col justify-between items-center py-4 px-4 font-sans">
      
      {/* Centered Document-Style Container (max-w-3xl) */}
      <div className="w-full max-w-3xl flex-1 flex flex-col justify-between">
        
        {/* Top Header Bar */}
        <div className="flex items-center justify-between py-3 px-4 border border-neutral-200 mb-4 bg-white/90 backdrop-blur-md rounded-2xl shadow-[0_2px_10px_rgba(0,0,0,0.03)]">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-black flex items-center justify-center text-white font-bold text-xs shadow-xs">
              <Bot className="w-4 h-4" />
            </div>
            <div>
              <span className="text-sm font-bold text-neutral-950 tracking-tight">NOVA Socratic AI</span>
              <span className="text-[10px] text-neutral-500 block font-mono">Real-time Stream • Gemini 2.5 Flash</span>
            </div>
          </div>

          <button
            onClick={clearChat}
            className="p-1.5 rounded-lg bg-neutral-100 border border-neutral-200 text-neutral-600 hover:text-red-600 hover:bg-red-50 transition-colors text-xs flex items-center gap-1.5 font-medium"
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
                <div className="flex items-center gap-1.5 text-[11px] font-bold text-neutral-400 px-1 font-mono">
                  {isUser ? (
                    <>
                      <span>You</span>
                      <User className="w-3 h-3 text-neutral-700" />
                    </>
                  ) : (
                    <>
                      <Bot className="w-3 h-3 text-purple-700" />
                      <span>NOVA Tutor</span>
                    </>
                  )}
                </div>

                {/* Bubble Container: User (solid dark charcoal bg-neutral-900 text-white) vs AI (clean white bg-white border border-neutral-200 text-neutral-800) */}
                <div
                  className={cn(
                    "text-sm leading-relaxed max-w-[88%] sm:max-w-[82%]",
                    isUser
                      ? "p-4 rounded-2xl rounded-tr-none bg-neutral-900 text-white shadow-sm border border-neutral-800"
                      : "p-4 rounded-2xl rounded-tl-none bg-white border border-neutral-200 text-neutral-800 shadow-[2px_2px_0px_rgba(0,0,0,0.04)]"
                  )}
                >
                  {isUser ? (
                    <p className="whitespace-pre-wrap font-medium">{msg.content}</p>
                  ) : (
                    <div className="prose prose-neutral max-w-none text-neutral-800 text-sm leading-relaxed space-y-3">
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
              <Sparkles className="w-3.5 h-3.5 animate-spin text-purple-600" />
              <span>NOVA is streaming Socratic guidance...</span>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Quick Action Chips & Floating Command Bar Input */}
        <div className="sticky bottom-4 pt-4 bg-gradient-to-t from-[#FAFAFA] via-[#FAFAFA]/90 to-transparent space-y-3">
          
          {/* Quick Action Chips Row */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
            {QUICK_CHIPS.map((chip) => (
              <button
                key={chip.id}
                disabled={isLoading}
                onClick={() => handleSubmit(chip.prompt)}
                className="shrink-0 bg-white border border-neutral-200 hover:border-neutral-400 hover:bg-neutral-50 rounded-full text-xs font-semibold px-3.5 py-1.5 text-neutral-700 hover:text-neutral-950 transition-all duration-200 shadow-2xs"
              >
                {chip.label}
              </button>
            ))}
          </div>

          {/* Floating Command Bar Input Area */}
          <div className="relative flex items-center p-2 rounded-2xl bg-white border border-neutral-200/90 shadow-[0_8px_30px_rgba(0,0,0,0.06),2px_2px_0px_rgba(0,0,0,0.03)] focus-within:border-neutral-400 transition-all">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask NOVA a question... (Press Enter to send)"
              rows={1}
              disabled={isLoading}
              className="w-full bg-transparent text-sm text-neutral-900 placeholder-neutral-400 px-3 py-2 focus:outline-none resize-none max-h-32 min-h-[40px] font-medium"
            />

            <button
              onClick={() => handleSubmit()}
              disabled={!input.trim() || isLoading}
              className={cn(
                "p-2.5 rounded-xl transition-all shrink-0 flex items-center justify-center ml-1",
                input.trim() && !isLoading
                  ? "bg-black text-white shadow-sm hover:bg-neutral-800 scale-105"
                  : "bg-neutral-100 text-neutral-400 cursor-not-allowed"
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
