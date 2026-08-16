"use client";

import React, { useState } from "react";
import { GlassCard } from "@/components/ui/GlassCard";
import { Note } from "@/types";
import { NoteUploadModal } from "./NoteUploadModal";
import { Brain, Search, Plus, FileText, BookOpen, Trash2, Tag, Sparkles } from "lucide-react";
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
    <div className="space-y-6 font-sans">
      {/* Header & Controls */}
      <div className="bg-white border border-neutral-200 rounded-2xl p-6 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-[4px_4px_0px_rgba(0,0,0,0.04)]">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-2xl bg-purple-100 border border-purple-200 text-purple-800">
            <Brain className="w-6 h-6" />
          </div>
          <div>
            <h2 className="font-serif text-xl font-bold text-neutral-950 tracking-tight">Syllabus & Knowledge Base</h2>
            <p className="text-xs text-neutral-600">
              Uploaded notes & syllabi are automatically fed into NOVA's AI Socratic Tutor memory.
            </p>
          </div>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="px-4 py-2.5 rounded-full font-bold text-xs bg-black text-white shadow-sm hover:bg-neutral-800 flex items-center justify-center gap-2 transition-all"
        >
          <Plus className="w-4 h-4" />
          Add Syllabus / Note
        </button>
      </div>

      {/* Search & Filter Bar */}
      <div className="flex flex-col sm:flex-row items-center gap-3">
        {/* Search */}
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400" />
          <input
            type="text"
            placeholder="Search notes, course codes, or tags..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-white border border-neutral-200 text-xs text-neutral-900 placeholder-neutral-400 focus:outline-none focus:border-neutral-400 shadow-2xs font-medium"
          />
        </div>

        {/* Filter Course Tabs */}
        <div className="flex items-center gap-1 p-1 rounded-2xl bg-white border border-neutral-200 text-xs overflow-x-auto w-full sm:w-auto shadow-2xs">
          {["ALL", "c1", "c2", "c3"].map((cid) => {
            const label = cid === "ALL" ? "All Courses" : cid === "c1" ? "CS 301" : cid === "c2" ? "PHYS 202" : "MATH 240";
            return (
              <button
                key={cid}
                onClick={() => setFilterCourse(cid)}
                className={cn(
                  "px-3 py-1.5 rounded-xl font-semibold transition-all whitespace-nowrap",
                  filterCourse === cid
                    ? "bg-black text-white shadow-xs"
                    : "text-neutral-600 hover:text-black hover:bg-neutral-100"
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
            <div className="p-8 text-center text-neutral-500 text-xs bg-white border border-neutral-200 rounded-2xl">
              No notes or syllabi match your current filter. Click "Add Syllabus / Note" to create one!
            </div>
          ) : (
            filteredNotes.map((note) => {
              const isSelected = selectedNote?.id === note.id;

              return (
                <div
                  key={note.id}
                  onClick={() => setSelectedNote(note)}
                  className={cn(
                    "p-5 rounded-2xl bg-white border transition-all duration-200 cursor-pointer shadow-xs",
                    isSelected ? "border-purple-400 bg-purple-50/40 shadow-[4px_4px_0px_rgba(233,213,255,0.7)]" : "border-neutral-200 hover:border-neutral-300 hover:shadow-sm"
                  )}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-3">
                      <div className="p-2.5 rounded-xl bg-neutral-100 border border-neutral-200 text-purple-700 mt-0.5">
                        <FileText className="w-5 h-5" />
                      </div>

                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-neutral-100 text-neutral-800 border border-neutral-200">
                            {note.course?.code}
                          </span>
                          <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-neutral-100 text-neutral-600 border border-neutral-200 uppercase font-mono">
                            {note.type}
                          </span>
                        </div>

                        <h3 className="text-sm font-bold text-neutral-950 tracking-tight mb-1">
                          {note.title}
                        </h3>

                        <p className="text-xs text-neutral-600 line-clamp-2 font-mono">
                          {note.content}
                        </p>

                        {note.tags && (
                          <div className="flex items-center gap-1.5 mt-3 flex-wrap">
                            <Tag className="w-3 h-3 text-neutral-400" />
                            {note.tags.split(",").map((t, idx) => (
                              <span key={idx} className="text-[10px] font-mono text-neutral-600 bg-neutral-100 px-2 py-0.5 rounded-full border border-neutral-200">
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
                        className="p-1.5 rounded-lg text-neutral-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                        title="Delete Note"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Selected Note Detail / Preview Panel */}
        <div className="lg:col-span-1">
          <div className="bg-white border border-neutral-200 rounded-2xl p-6 h-full flex flex-col justify-between shadow-[4px_4px_0px_rgba(219,234,254,0.7)]">
            {selectedNote ? (
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b border-neutral-100 pb-3">
                  <span className="px-2.5 py-1 rounded text-xs font-mono font-bold bg-neutral-100 text-neutral-800 border border-neutral-200">
                    {selectedNote.course?.code}
                  </span>
                  <span className="text-[10px] text-neutral-400 font-mono">
                    Updated {formatDate(selectedNote.updatedAt)}
                  </span>
                </div>

                <h3 className="text-base font-bold text-neutral-950 tracking-tight font-serif">
                  {selectedNote.title}
                </h3>

                <div className="p-4 rounded-xl bg-neutral-50 border border-neutral-200 text-xs font-mono text-neutral-800 leading-relaxed max-h-96 overflow-y-auto whitespace-pre-wrap">
                  {selectedNote.content}
                </div>

                <Link
                  href={`/tutor?course=${selectedNote.courseId}`}
                  className="w-full py-2.5 rounded-xl font-bold text-xs bg-purple-100 border border-purple-300 text-purple-900 hover:bg-purple-200 flex items-center justify-center gap-2 transition-all shadow-2xs"
                >
                  <Sparkles className="w-4 h-4" />
                  Ask AI Tutor About This Document
                </Link>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center text-center text-neutral-500 py-12">
                <BookOpen className="w-10 h-10 mb-2 stroke-[1.5] text-neutral-400" />
                <p className="text-xs font-medium">Select any note or syllabus from the list to view its full content & AI indexing status.</p>
              </div>
            )}
          </div>
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
