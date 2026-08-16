"use client";

import React, { useState } from "react";
import { X, Upload, Plus } from "lucide-react";
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
    <div className="fixed inset-0 z-50 bg-gray-900/40 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="w-full max-w-xl bg-white border border-gray-200 rounded-2xl p-6 shadow-xl font-sans text-gray-800">
        <div className="flex items-center justify-between border-b border-gray-100 pb-4 mb-4">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-purple-50 border border-purple-200 text-purple-800">
              <Upload className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-gray-900 tracking-tight">Add Syllabus or Lecture Note</h2>
              <p className="text-xs text-gray-500">Index content into NOVA AI knowledge base</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-gray-100 border border-gray-200 text-gray-500 hover:text-gray-900"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-xs font-bold text-gray-700 block mb-1.5 uppercase font-mono">Document Type</label>
            <div className="grid grid-cols-3 gap-2">
              {(["SYLLABUS", "NOTE", "SUMMARY"] as const).map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setType(t)}
                  className={`py-2 px-3 rounded-xl text-xs font-bold border transition-all ${
                    type === t
                      ? "bg-purple-100 border-purple-300 text-purple-900 shadow-2xs"
                      : "bg-gray-50 border-gray-200 text-gray-600 hover:text-gray-900"
                  }`}
                >
                  {t === "SYLLABUS" ? "📋 Syllabus" : t === "NOTE" ? "📝 Lecture Note" : "📑 Summary Sheet"}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-gray-700 block mb-1.5 uppercase font-mono">Course</label>
            <select
              value={courseId}
              onChange={(e) => setCourseId(e.target.value)}
              className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-xs font-medium text-gray-900 focus:outline-none focus:border-gray-400"
            >
              {SAMPLE_COURSES.filter((c) => c.id !== "all").map((c) => (
                <option key={c.id} value={c.id} className="bg-white text-gray-900">
                  {c.code} - {c.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-xs font-bold text-gray-700 block mb-1.5 uppercase font-mono">Title</label>
            <input
              type="text"
              required
              placeholder="e.g. Chapter 4: Red-Black Trees & Heap Sorting Syllabus"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-xs font-medium text-gray-900 placeholder-gray-400 focus:outline-none focus:border-gray-400"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-gray-700 block mb-1.5 uppercase font-mono">Tags (Comma-separated)</label>
            <input
              type="text"
              placeholder="e.g. algorithms, tree-rebalancing, midterms"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-xs font-medium text-gray-900 placeholder-gray-400 focus:outline-none focus:border-gray-400"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-gray-700 block mb-1.5 uppercase font-mono">Syllabus / Note Content</label>
            <textarea
              required
              rows={5}
              placeholder="Paste lecture notes, course outline, key formulas, exam guidelines..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-xs font-mono text-gray-900 placeholder-gray-400 focus:outline-none focus:border-gray-400 resize-none"
            />
          </div>

          <div className="flex items-center justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-bold text-gray-600 hover:text-gray-900"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl text-xs font-bold bg-gray-900 text-white shadow-xs hover:bg-gray-800 flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" />
              Index Note
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
