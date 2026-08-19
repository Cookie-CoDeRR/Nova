"use client";

import React, { Suspense, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { ArrowLeft, BookOpen, CheckCircle2, Circle, ChevronDown, ChevronUp, Lightbulb } from "lucide-react";
import { FloatingNav } from "@/components/layout/FloatingNav";

// ─── Mock Questions per Topic ──────────────────────────────────────────────────
const TOPIC_QUESTIONS: Record<string, { q: string; answer: string; difficulty: "Easy" | "Medium" | "Hard" }[]> = {
  "Eigenvalues": [
    { q: "What is an eigenvalue of a matrix A?", answer: "A scalar λ such that Av = λv for a non-zero vector v.", difficulty: "Easy" },
    { q: "How do you find eigenvalues of a 2×2 matrix?", answer: "Solve det(A − λI) = 0. For A = [[a,b],[c,d]], this gives λ² − (a+d)λ + (ad−bc) = 0.", difficulty: "Easy" },
    { q: "What is the characteristic polynomial of a matrix?", answer: "det(A − λI) = 0. Its roots are the eigenvalues.", difficulty: "Medium" },
    { q: "Can a matrix have complex eigenvalues?", answer: "Yes. Real matrices can have complex conjugate pairs of eigenvalues.", difficulty: "Medium" },
    { q: "What is the trace and determinant in terms of eigenvalues?", answer: "trace(A) = Σλᵢ, det(A) = Πλᵢ.", difficulty: "Hard" },
    { q: "If A is symmetric, what can you say about its eigenvalues?", answer: "All eigenvalues are real and eigenvectors for distinct eigenvalues are orthogonal.", difficulty: "Hard" },
  ],
  "Matrix Decomp.": [
    { q: "What is LU decomposition?", answer: "Factoring A = LU where L is lower triangular and U is upper triangular.", difficulty: "Easy" },
    { q: "When does LU decomposition fail?", answer: "When a pivot is zero during Gaussian elimination (unless pivoting is used).", difficulty: "Medium" },
    { q: "What is QR decomposition?", answer: "A = QR where Q is orthogonal and R is upper triangular. Used in eigenvalue algorithms.", difficulty: "Medium" },
    { q: "What is SVD?", answer: "Singular Value Decomposition: A = UΣVᵀ, where U and V are orthogonal and Σ is diagonal with singular values.", difficulty: "Hard" },
    { q: "What are the applications of SVD?", answer: "Dimensionality reduction (PCA), pseudoinverse computation, image compression, and recommendation systems.", difficulty: "Hard" },
  ],
  "Vector Spaces": [
    { q: "What is a vector space?", answer: "A set V with addition and scalar multiplication satisfying 8 axioms (closure, associativity, identity, inverse, distributivity, etc.).", difficulty: "Easy" },
    { q: "What is a subspace?", answer: "A non-empty subset of a vector space that is closed under addition and scalar multiplication.", difficulty: "Easy" },
    { q: "What is a basis of a vector space?", answer: "A linearly independent set that spans the vector space.", difficulty: "Medium" },
    { q: "What is the dimension of a vector space?", answer: "The number of vectors in any basis.", difficulty: "Medium" },
    { q: "What is the rank-nullity theorem?", answer: "rank(A) + nullity(A) = number of columns of A.", difficulty: "Hard" },
  ],
  "Orthogonality": [
    { q: "When are two vectors orthogonal?", answer: "When their dot product is zero: u·v = 0.", difficulty: "Easy" },
    { q: "What is an orthonormal set?", answer: "A set of mutually orthogonal unit vectors.", difficulty: "Easy" },
    { q: "What is the Gram-Schmidt process?", answer: "An algorithm to convert a set of linearly independent vectors into an orthonormal set.", difficulty: "Medium" },
    { q: "What is an orthogonal projection?", answer: "proj_u(v) = (v·u/u·u)u. The projection of v onto the subspace spanned by u.", difficulty: "Medium" },
  ],
  "Big-O Analysis": [
    { q: "What does O(n log n) mean?", answer: "The algorithm's time scales proportionally to n·log(n) as input size n grows.", difficulty: "Easy" },
    { q: "What is the difference between O and Θ?", answer: "O is an upper bound. Θ is a tight bound (both upper and lower).", difficulty: "Medium" },
    { q: "What is the time complexity of binary search?", answer: "O(log n), since the search space halves each iteration.", difficulty: "Easy" },
    { q: "Prove that 3n² + 5n + 1 is O(n²).", answer: "Choose c=4, n₀=6. For n≥6: 3n²+5n+1 ≤ 4n². Valid since 5n+1 ≤ n² for n≥6.", difficulty: "Hard" },
  ],
  "Binary Trees": [
    { q: "What is the height of a balanced binary tree with n nodes?", answer: "O(log n).", difficulty: "Easy" },
    { q: "What are the three DFS traversal orders?", answer: "In-order (L, Root, R), Pre-order (Root, L, R), Post-order (L, R, Root).", difficulty: "Easy" },
    { q: "How does a BST insertion work?", answer: "Compare with root, go left if smaller, right if larger, recursively until an empty spot is found.", difficulty: "Medium" },
    { q: "What is a self-balancing BST?", answer: "A BST that automatically keeps its height O(log n), e.g., AVL tree or Red-Black tree.", difficulty: "Hard" },
  ],
  "Dynamic Programming": [
    { q: "What are the two key properties for DP?", answer: "Optimal substructure (optimal solution contains optimal sub-solutions) and overlapping subproblems.", difficulty: "Easy" },
    { q: "What is memoization vs tabulation?", answer: "Memoization = top-down (cache recursion). Tabulation = bottom-up (fill table iteratively).", difficulty: "Medium" },
    { q: "What is the time complexity of the 0/1 Knapsack DP?", answer: "O(n·W) where n is number of items and W is the knapsack capacity.", difficulty: "Hard" },
    { q: "Solve: Fibonacci using DP.", answer: "F(0)=0, F(1)=1, F(n)=F(n-1)+F(n-2). DP stores previously computed values → O(n) time, O(1) space.", difficulty: "Medium" },
  ],
  "Wave Functions": [
    { q: "What does a wave function ψ(x) represent?", answer: "The quantum state of a particle. |ψ(x)|² gives the probability density of finding the particle at x.", difficulty: "Easy" },
    { q: "What is normalization of a wave function?", answer: "∫|ψ(x)|²dx = 1 — the total probability of finding the particle anywhere is 1.", difficulty: "Medium" },
    { q: "What is the superposition principle?", answer: "Any linear combination of valid wave functions is also a valid wave function.", difficulty: "Medium" },
  ],
  "Gradient Descent": [
    { q: "What is the update rule in gradient descent?", answer: "θ := θ − α·∇J(θ), where α is the learning rate and J is the loss function.", difficulty: "Easy" },
    { q: "What is the difference between batch, mini-batch, and stochastic GD?", answer: "Batch uses all data per step. Stochastic uses one sample. Mini-batch uses a subset.", difficulty: "Medium" },
    { q: "What happens if the learning rate is too large?", answer: "The loss may diverge or oscillate instead of converging.", difficulty: "Medium" },
    { q: "What is the vanishing gradient problem?", answer: "Gradients become extremely small in early layers of deep networks, making learning very slow.", difficulty: "Hard" },
  ],
};

const DIFFICULTY_STYLE: Record<string, string> = {
  Easy: "text-emerald-700 bg-emerald-50 border-emerald-200",
  Medium: "text-amber-700 bg-amber-50 border-amber-200",
  Hard: "text-red-700 bg-red-50 border-red-200",
};

function TopicQuestionsContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const topic = searchParams.get("topic") ?? "";
  const subject = searchParams.get("subject") ?? "";

  const questions = TOPIC_QUESTIONS[topic] ?? [
    { q: `What is ${topic}?`, answer: `${topic} is a key concept in ${subject}. Connect your tutor sessions to get detailed, personalised answers here.`, difficulty: "Medium" as const },
    { q: `Why is ${topic} important in ${subject}?`, answer: "This topic forms a foundation for advanced concepts. Complete a study session to unlock more.", difficulty: "Easy" as const },
  ];

  const [openIdx, setOpenIdx] = useState<number | null>(null);

  const easy = questions.filter(q => q.difficulty === "Easy").length;
  const medium = questions.filter(q => q.difficulty === "Medium").length;
  const hard = questions.filter(q => q.difficulty === "Hard").length;

  return (
    <div className="min-h-screen bg-[#FAFAFA] font-sans pb-32">
      {/* dot grid */}
      <div
        className="fixed inset-0 pointer-events-none opacity-40 z-0"
        style={{ backgroundImage: "radial-gradient(#e5e7eb 1px, transparent 1px)", backgroundSize: "16px 16px" }}
      />

      <div className="relative z-10 w-full max-w-3xl mx-auto px-4 sm:px-8 pt-8 space-y-6">

        {/* Back */}
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-xs font-bold text-gray-400 hover:text-gray-900 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </button>

        {/* Title */}
        <div>
          <div className="text-[10px] font-bold font-mono uppercase tracking-widest text-gray-400 mb-1">{subject}</div>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-gray-900 tracking-tight">
            {topic}
          </h1>
          <p className="text-xs text-gray-400 mt-1">Questions and answers from your study sessions on this topic.</p>
        </div>

        {/* Stats row */}
        <div className="flex gap-3">
          {[
            { label: "Total", value: questions.length, cls: "text-gray-900 bg-white border-gray-200" },
            { label: "Easy", value: easy, cls: "text-emerald-700 bg-emerald-50 border-emerald-200" },
            { label: "Medium", value: medium, cls: "text-amber-700 bg-amber-50 border-amber-200" },
            { label: "Hard", value: hard, cls: "text-red-700 bg-red-50 border-red-200" },
          ].map(s => (
            <div key={s.label} className={`flex-1 text-center py-2 rounded-2xl border text-sm font-black font-mono ${s.cls} shadow-sm`}>
              <div>{s.value}</div>
              <div className="text-[9px] font-medium uppercase tracking-wider opacity-70">{s.label}</div>
            </div>
          ))}
        </div>

        {/* Question List */}
        <div className="space-y-3">
          {questions.map((item, i) => {
            const isOpen = openIdx === i;
            return (
              <div
                key={i}
                className={`bg-white border rounded-2xl shadow-sm overflow-hidden transition-all ${isOpen ? "border-purple-300" : "border-gray-200"}`}
              >
                <button
                  onClick={() => setOpenIdx(isOpen ? null : i)}
                  className="w-full flex items-start justify-between px-5 py-4 text-left hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-start gap-3 min-w-0">
                    <div className="mt-0.5 shrink-0">
                      {isOpen
                        ? <CheckCircle2 className="w-4 h-4 text-purple-500" />
                        : <Circle className="w-4 h-4 text-gray-300" />}
                    </div>
                    <span className="text-sm font-semibold text-gray-800 leading-snug">{item.q}</span>
                  </div>
                  <div className="flex items-center gap-2 shrink-0 ml-3">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${DIFFICULTY_STYLE[item.difficulty]}`}>
                      {item.difficulty}
                    </span>
                    {isOpen ? <ChevronUp className="w-4 h-4 text-gray-400" /> : <ChevronDown className="w-4 h-4 text-gray-400" />}
                  </div>
                </button>

                {isOpen && (
                  <div className="px-5 pb-5 pt-1 border-t border-gray-100">
                    <div className="flex items-start gap-2 bg-purple-50 border border-purple-100 rounded-xl p-4">
                      <Lightbulb className="w-4 h-4 text-purple-500 shrink-0 mt-0.5" />
                      <p className="text-sm text-gray-700 leading-relaxed">{item.answer}</p>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Hint */}
        <div className="flex items-center gap-2 text-[11px] text-gray-400 font-mono pb-4">
          <BookOpen className="w-3.5 h-3.5" />
          Click any question to reveal the answer.
        </div>

      </div>
      <FloatingNav />
    </div>
  );
}

export default function TopicQuestionsPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#FAFAFA] flex items-center justify-center text-xs text-gray-400">Loading...</div>}>
      <TopicQuestionsContent />
    </Suspense>
  );
}
