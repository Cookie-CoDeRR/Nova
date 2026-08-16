"use client";

import React, { useState } from "react";
import { Sparkles, Video, ArrowRight, CheckCircle2, BookmarkPlus, Tv } from "lucide-react";

export function NptelSyncCard() {
  const [videoUrl, setVideoUrl] = useState("");
  const [synced, setSynced] = useState(false);

  const handleMockSync = (e: React.FormEvent) => {
    e.preventDefault();
    if (!videoUrl.trim()) return;
    setSynced(true);
  };

  return (
    <div className="bg-white border border-gray-200 rounded-3xl p-6 sm:p-8 shadow-sm space-y-4 relative overflow-hidden font-sans">
      
      {/* Top Banner & Jury Badge */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-gray-100 pb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-red-50 border border-red-200 flex items-center justify-center text-red-600 shadow-2xs">
            <Tv className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-serif text-lg font-bold text-gray-900 tracking-tight">
                NPTEL Lecture Sync & Transcript Synthesizer
              </h3>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-amber-50 text-amber-900 border border-amber-200">
                Beta / Future Scope v2.0
              </span>
            </div>
            <p className="text-xs text-gray-500">
              Direct integration for Indian Engineering Curricula (IIT/IISc NPTEL & Swayam Courses)
            </p>
          </div>
        </div>

        <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-purple-50 border border-purple-200 text-purple-900 text-[11px] font-semibold shrink-0">
          <Sparkles className="w-3.5 h-3.5 text-purple-600" />
          <span>Indian Engineering Curriculum Standard</span>
        </div>
      </div>

      {/* Description & Feature Callout */}
      <div className="space-y-3">
        <p className="text-xs text-gray-600 leading-relaxed">
          Paste any NPTEL YouTube lecture link or course code below. NOVA's AI engine will automatically fetch the video transcripts, extract mathematical derivations, and generate weekly milestone flashcards aligned with your university syllabus.
        </p>

        {/* Input Form */}
        <form onSubmit={handleMockSync} className="flex flex-col sm:flex-row items-center gap-2">
          <div className="relative flex-1 w-full">
            <Video className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={videoUrl}
              onChange={(e) => {
                setVideoUrl(e.target.value);
                setSynced(false);
              }}
              placeholder="e.g. https://www.youtube.com/watch?v=nptel_cs301 or NPTEL-NOC24-CS54"
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-gray-50 border border-gray-200 text-xs text-gray-900 placeholder-gray-400 focus:outline-none focus:border-gray-400 font-medium"
            />
          </div>

          <button
            type="submit"
            className="w-full sm:w-auto px-5 py-2.5 rounded-xl text-xs font-bold bg-gray-900 text-white shadow-xs hover:bg-gray-800 flex items-center justify-center gap-1.5 shrink-0 cursor-pointer"
          >
            <span>Sync NPTEL Lecture</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </form>

        {/* Mock Synced Feedback */}
        {synced && (
          <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-900 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>NPTEL Lecture URL queued! Transcribing formulas & Socratic checkpoints...</span>
          </div>
        )}

        {/* Prominent Version 2.0 Roadmap Badge */}
        <div className="p-4 rounded-2xl bg-purple-50/80 border border-purple-200 flex items-center justify-between gap-4 mt-2">
          <div className="flex items-center gap-2.5">
            <BookmarkPlus className="w-5 h-5 text-purple-700 shrink-0" />
            <div>
              <span className="text-xs font-bold text-purple-950 block">Upcoming Feature Roadmap:</span>
              <p className="text-[11px] text-purple-900 font-medium">
                AI video transcript transcription & automatic flashcard generation coming in v2.0.
              </p>
            </div>
          </div>

          <span className="text-[10px] font-mono font-bold px-2.5 py-1 rounded-full bg-white text-purple-900 border border-purple-200 shrink-0 hidden sm:inline-block shadow-2xs">
            v2.0 ROADMAP
          </span>
        </div>

      </div>

    </div>
  );
}
