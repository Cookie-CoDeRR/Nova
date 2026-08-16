"use client";

import React, { useState } from "react";
import { GlassCard } from "@/components/ui/GlassCard";
import { X, Upload, FileText, Check, Plus, BookOpen } from "lucide-react";
import { SAMPLE_COURSES } from "@/components/tutor/CourseSelector";
import { Note } from "@/types";

interface NoteUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddNote: (newNote: Note) => void;
}

export function NoteUploadModal({ isOpen, onClose, onAddNote }: NoteUploadModalProps) {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [type, setType] = useState<"SYLLABUS" | "NOTE" | "SUMMARY">("SYLLABUS");
  const [courseId, setCourseId] = useState("c1");
  const [tags, setTags] = useState("");

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) return;

    const course = SAMPLE_COURSES.find((c) => c.id === courseId) || SAMPLE_COURSES[1];

    const newNote: Note = {
      id: Date.now().toString(),
      title: title.trim(),
      content: content.trim(),
      type,
      tags: tags.trim(),
      courseId,
      course: {
        id: course.id,
        code: course.code,
        name: course.name,
        color: course.color,
      },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    onAddNote(newNote);
    onClose();
    setTitle("");
    setContent("");
    setTags("");
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
      <GlassCard className="w-full max-w-xl p-6 border-purple-500/30 shadow-[0_0_50px_rgba(124,58,237,0.25)]">
        <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-4">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-400">
              <Upload className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white tracking-tight">Add Syllabus or Lecture Note</h2>
              <p className="text-xs text-zinc-400">Index content into NOVA AI knowledge base</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-white/5 border border-white/10 text-zinc-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Note Type Switcher */}
          <div>
            <label className="text-xs font-semibold text-zinc-300 block mb-1.5">Document Type</label>
            <div className="grid grid-cols-3 gap-2">
              {(["SYLLABUS", "NOTE", "SUMMARY"] as const).map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setType(t)}
                  className={`py-2 px-3 rounded-xl text-xs font-semibold border transition-all ${
                    type === t
                      ? "bg-purple-600/30 border-purple-500/50 text-purple-200"
                      : "bg-white/5 border-white/10 text-zinc-400 hover:text-white"
                  }`}
                >
                  {t === "SYLLABUS" ? "📋 Syllabus" : t === "NOTE" ? "📝 Lecture Note" : "📑 Summary Sheet"}
                </button>
              ))}
            </div>
          </div>

          {/* Select Course */}
          <div>
            <label className="text-xs font-semibold text-zinc-300 block mb-1.5">Course</label>
            <select
              value={courseId}
              onChange={(e) => setCourseId(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-purple-500"
            >
              {SAMPLE_COURSES.filter((c) => c.id !== "all").map((c) => (
                <option key={c.id} value={c.id} className="bg-zinc-950 text-white">
                  {c.code} - {c.name}
                </option>
              ))}
            </select>
          </div>

          {/* Title */}
          <div>
            <label className="text-xs font-semibold text-zinc-300 block mb-1.5">Title</label>
            <input
              type="text"
              required
              placeholder="e.g. Chapter 4: Red-Black Trees & Heap Sorting Syllabus"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-purple-500"
            />
          </div>

          {/* Tags */}
          <div>
            <label className="text-xs font-semibold text-zinc-300 block mb-1.5">Tags (Comma-separated)</label>
            <input
              type="text"
              placeholder="e.g. algorithms, tree-rebalancing, midterms"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-purple-500"
            />
          </div>

          {/* Content Textarea */}
          <div>
            <label className="text-xs font-semibold text-zinc-300 block mb-1.5">Syllabus / Note Content</label>
            <textarea
              required
              rows={5}
              placeholder="Paste lecture notes, course outline, key formulas, exam guidelines..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-purple-500 resize-none font-mono"
            />
          </div>

          {/* Submit */}
          <div className="flex items-center justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-zinc-400 hover:text-white"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl text-xs font-bold bg-purple-600 text-white shadow-[0_0_20px_rgba(124,58,237,0.4)] hover:bg-purple-500 flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" />
              Index Note
            </button>
          </div>
        </form>
      </GlassCard>
    </div>
  );
}
