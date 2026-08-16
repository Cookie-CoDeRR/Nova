"use client";

import React, { useState } from "react";
import { GlassCard } from "@/components/ui/GlassCard";
import { Note } from "@/types";
import { NoteUploadModal } from "./NoteUploadModal";
import { Brain, Search, Plus, FileText, BookOpen, Trash2, Tag, Sparkles, ExternalLink } from "lucide-react";
import { cn, formatDate } from "@/lib/utils";
import Link from "next/link";

const SAMPLE_NOTES: Note[] = [
  {
    id: "n1",
    title: "CS 301 Official Syllabus & Grading Criteria",
    content: `CS 301 Data Structures & Algorithms Syllabus:
- Grading: 30% Midterm, 40% Final Exam, 30% Programming Assignments.
- Topics: Asymptotic analysis, Recurrence relations, Red-Black Trees, Graph Traversal (DFS/BFS), Dijkstra's Algorithm, Dynamic Programming.
- Office Hours: Tuesdays & Thursdays 3-5 PM in Engineering Hall 402.`,
    type: "SYLLABUS",
    tags: "syllabus, cs301, algorithms",
    courseId: "c1",
    course: { id: "c1", code: "CS 301", name: "Data Structures & Algorithms", color: "#7C3AED" },
    createdAt: new Date(Date.now() - 3 * 86400000).toISOString(),
    updatedAt: new Date(Date.now() - 3 * 86400000).toISOString(),
  },
  {
    id: "n2",
    title: "Quantum Mechanics Wave Equation Cheat Sheet",
    content: `PHYS 202 Quantum Mechanics Formula Notes:
- Time-Dependent Schrödinger Equation: i * hbar * d(psi)/dt = H * psi
- Infinite Square Well Energy Levels: E_n = (n^2 * pi^2 * hbar^2) / (2 * m * L^2)
- Normalization Condition: integral(|psi|^2 dx) = 1 over all space.`,
    type: "SUMMARY",
    tags: "schrodinger, formulas, quantum",
    courseId: "c2",
    course: { id: "c2", code: "PHYS 202", name: "Quantum Physics", color: "#3B82F6" },
    createdAt: new Date(Date.now() - 5 * 86400000).toISOString(),
    updatedAt: new Date(Date.now() - 5 * 86400000).toISOString(),
  },
  {
    id: "n3",
    title: "Linear Algebra Chapter 3: Eigenvalues & Diagonalization",
    content: `Lecture notes on Matrix Diagonalization:
- A matrix A is diagonalizable iff it has n linearly independent eigenvectors.
- Characteristic Polynomial: det(A - lambda * I) = 0
- Trace equals sum of eigenvalues; Determinant equals product of eigenvalues.`,
    type: "NOTE",
    tags: "math, linear-algebra, eigenvalues",
    courseId: "c3",
    course: { id: "c3", code: "MATH 240", name: "Linear Algebra", color: "#10B981" },
    createdAt: new Date(Date.now() - 7 * 86400000).toISOString(),
    updatedAt: new Date(Date.now() - 7 * 86400000).toISOString(),
  },
];

export function KnowledgeList() {
  const [notes, setNotes] = useState<Note[]>(SAMPLE_NOTES);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterCourse, setFilterCourse] = useState<string>("ALL");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedNote, setSelectedNote] = useState<Note | null>(null);

  const handleAddNote = (newNote: Note) => {
    setNotes((prev) => [newNote, ...prev]);
  };

  const handleDeleteNote = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setNotes((prev) => prev.filter((n) => n.id !== id));
    if (selectedNote?.id === id) setSelectedNote(null);
  };

  const filteredNotes = notes.filter((n) => {
    const matchesSearch =
      n.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      n.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (n.tags && n.tags.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesCourse = filterCourse === "ALL" || n.courseId === filterCourse;
    return matchesSearch && matchesCourse;
  });

  return (
    <div className="space-y-6">
      {/* Header & Controls */}
      <GlassCard className="p-6 flex flex-col md:flex-row md:items-center justify-between gap-4" glowColor="purple">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-2xl bg-purple-500/10 border border-purple-500/20 text-purple-400">
            <Brain className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white tracking-tight">Syllabus & Knowledge Base</h2>
            <p className="text-xs text-zinc-400">
              Uploaded notes & syllabi are automatically fed into NOVA's AI Socratic Tutor memory.
            </p>
          </div>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="px-4 py-2.5 rounded-full font-bold text-xs bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-[0_0_20px_rgba(124,58,237,0.4)] hover:opacity-95 flex items-center justify-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Add Syllabus / Note
        </button>
      </GlassCard>

      {/* Search & Filter Bar */}
      <div className="flex flex-col sm:flex-row items-center gap-3">
        {/* Search */}
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400" />
          <input
            type="text"
            placeholder="Search notes, course codes, or tags..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-white/[0.03] border border-white/10 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-purple-500/50 transition-all"
          />
        </div>

        {/* Filter Course Tabs */}
        <div className="flex items-center gap-1 p-1 rounded-2xl bg-white/[0.03] border border-white/10 text-xs overflow-x-auto w-full sm:w-auto">
          {["ALL", "c1", "c2", "c3"].map((cid) => {
            const label = cid === "ALL" ? "All Courses" : cid === "c1" ? "CS 301" : cid === "c2" ? "PHYS 202" : "MATH 240";
            return (
              <button
                key={cid}
                onClick={() => setFilterCourse(cid)}
                className={cn(
                  "px-3 py-1.5 rounded-xl font-medium transition-all whitespace-nowrap",
                  filterCourse === cid
                    ? "bg-purple-600 text-white shadow-sm"
                    : "text-zinc-400 hover:text-white"
                )}
              >
                {label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Grid: Notes Catalog & Detail Drawer */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Notes Catalog List */}
        <div className="lg:col-span-2 space-y-3">
          {filteredNotes.length === 0 ? (
            <GlassCard className="p-8 text-center text-zinc-500 text-xs">
              No notes or syllabi match your current filter. Click "Add Syllabus / Note" to create one!
            </GlassCard>
          ) : (
            filteredNotes.map((note) => {
              const isSelected = selectedNote?.id === note.id;

              return (
                <GlassCard
                  key={note.id}
                  interactive
                  onClick={() => setSelectedNote(note)}
                  className={cn(
                    "p-5 transition-all duration-200 border",
                    isSelected ? "border-purple-500/50 bg-purple-500/[0.05]" : "border-white/10"
                  )}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-3">
                      <div className="p-2.5 rounded-xl bg-white/5 border border-white/10 text-purple-400 mt-0.5">
                        <FileText className="w-5 h-5" />
                      </div>

                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span
                            className="px-2 py-0.5 rounded text-[10px] font-bold"
                            style={{
                              backgroundColor: `${note.course?.color}20`,
                              color: note.course?.color,
                              border: `1px solid ${note.course?.color}40`,
                            }}
                          >
                            {note.course?.code}
                          </span>
                          <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-white/5 text-zinc-400 border border-white/10 uppercase">
                            {note.type}
                          </span>
                        </div>

                        <h3 className="text-sm font-bold text-white tracking-tight mb-1">
                          {note.title}
                        </h3>

                        <p className="text-xs text-zinc-400 line-clamp-2 font-mono">
                          {note.content}
                        </p>

                        {note.tags && (
                          <div className="flex items-center gap-1.5 mt-3 flex-wrap">
                            <Tag className="w-3 h-3 text-zinc-500" />
                            {note.tags.split(",").map((t, idx) => (
                              <span key={idx} className="text-[10px] text-zinc-400 bg-white/5 px-2 py-0.5 rounded-full border border-white/5">
                                #{t.trim()}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        onClick={(e) => handleDeleteNote(note.id, e)}
                        className="p-1.5 rounded-lg text-zinc-500 hover:text-red-400 hover:bg-red-500/10 transition-colors"
                        title="Delete Note"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </GlassCard>
              );
            })
          )}
        </div>

        {/* Selected Note Detail / Preview Panel */}
        <div className="lg:col-span-1">
          <GlassCard className="p-6 h-full flex flex-col justify-between" glowColor="blue">
            {selectedNote ? (
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b border-white/10 pb-3">
                  <span
                    className="px-2.5 py-1 rounded text-xs font-bold"
                    style={{
                      backgroundColor: `${selectedNote.course?.color}20`,
                      color: selectedNote.course?.color,
                      border: `1px solid ${selectedNote.course?.color}40`,
                    }}
                  >
                    {selectedNote.course?.code}
                  </span>
                  <span className="text-[10px] text-zinc-400 font-mono">
                    Updated {formatDate(selectedNote.updatedAt)}
                  </span>
                </div>

                <h3 className="text-base font-bold text-white tracking-tight">
                  {selectedNote.title}
                </h3>

                <div className="p-4 rounded-xl bg-black/40 border border-white/10 text-xs font-mono text-zinc-300 leading-relaxed max-h-96 overflow-y-auto whitespace-pre-wrap">
                  {selectedNote.content}
                </div>

                <Link
                  href={`/tutor?course=${selectedNote.courseId}`}
                  className="w-full py-2.5 rounded-xl font-bold text-xs bg-purple-600/20 border border-purple-500/40 text-purple-300 hover:bg-purple-600/30 flex items-center justify-center gap-2 transition-all"
                >
                  <Sparkles className="w-4 h-4" />
                  Ask AI Tutor About This Document
                </Link>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center text-center text-zinc-500 py-12">
                <BookOpen className="w-10 h-10 mb-2 stroke-[1.5] text-zinc-600" />
                <p className="text-xs font-medium">Select any note or syllabus from the list to view its full content & AI indexing status.</p>
              </div>
            )}
          </GlassCard>
        </div>
      </div>

      <NoteUploadModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onAddNote={handleAddNote}
      />
    </div>
  );
}
