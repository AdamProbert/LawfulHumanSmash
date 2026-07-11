"use client";

import { useState, useEffect, useCallback } from "react";
import BookChapter from "@/components/BookChapter";
import BookPage from "@/components/BookPage";

interface Question {
  id: string;
  name: string;
  question: string;
  answer: string | null;
  category: string;
  isAnswered: boolean;
  createdAt: string;
}

const CATEGORIES = [
  { id: "all", label: "All", emoji: "✨" },
  { id: "accommodation", label: "Accommodation", emoji: "🏡" },
  { id: "whimsy", label: "Whimsy", emoji: "🦋" },
  { id: "pets", label: "Pets", emoji: "🐾" },
];

export default function QAPage() {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [activeCategory, setActiveCategory] = useState("all");
  const [loading, setLoading] = useState(true);

  // Form state
  const [formName, setFormName] = useState("");
  const [formEmail, setFormEmail] = useState("");
  const [formQuestion, setFormQuestion] = useState("");
  const [formCategory, setFormCategory] = useState("whimsy");
  const [submitting, setSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const fetchQuestions = useCallback(async () => {
    try {
      const res = await fetch("/api/questions");
      const data = await res.json();
      setQuestions(data.questions || []);
    } catch (err) {
      console.error("Failed to fetch questions:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchQuestions();
  }, [fetchQuestions]);

  const filteredQuestions = questions.filter(
    (q) =>
      q.isAnswered && (activeCategory === "all" || q.category === activeCategory)
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const res = await fetch("/api/questions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formName,
          email: formEmail || null,
          question: formQuestion,
          category: formCategory,
        }),
      });

      if (res.ok) {
        setSubmitSuccess(true);
        setFormName("");
        setFormEmail("");
        setFormQuestion("");
        setFormCategory("whimsy");
        setTimeout(() => setSubmitSuccess(false), 4000);
      }
    } catch (err) {
      console.error("Failed to submit question:", err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <BookChapter title="Q&A">
      {/* Page 1 — browse questions */}
      <BookPage>
        <div className="filter-strip mb-5">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`filter-chip ${
                activeCategory === cat.id ? "active" : ""
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        <div className="max-w-xs mx-auto text-left">
          {loading ? (
            <div className="text-center py-8">
              <div className="text-3xl">🌿</div>
              <p className="font-body text-sm text-bark-light mt-3">
                Loading questions…
              </p>
            </div>
          ) : filteredQuestions.length === 0 ? (
            <div className="text-center py-8">
              <p className="font-heading text-base text-bark-light">
                No answered questions here yet!
              </p>
              <p className="font-body text-sm text-bark-light/60 mt-1">
                Be the first to ask →
              </p>
            </div>
          ) : (
            filteredQuestions.map((q, i) => (
              <div key={q.id}>
                {i > 0 && <div className="qa-divider" />}
                <p className="font-heading text-xs tracking-[0.15em] uppercase text-gold-dark mb-1">
                  {q.name}
                </p>
                <p className="font-heading text-base text-ivy-dark mb-1">
                  {q.question}
                </p>
                {q.answer && (
                  <>
                    <p className="font-body text-sm text-bark-light italic">
                      {q.answer}
                    </p>
                    <p className="font-body text-xs text-gold-dark mt-1">
                      — Adam &amp; Mady
                    </p>
                  </>
                )}
              </div>
            ))
          )}
        </div>
      </BookPage>

      {/* Page 2 — ask a question */}
      <BookPage>
        {submitSuccess ? (
          <div className="py-8">
            <p className="text-4xl mb-4">💌</p>
            <h3 className="font-heading text-xl text-ivy-dark mb-2">
              Question received!
            </h3>
            <p className="font-body text-bark-light">
              We&apos;ll get back to you soon.
            </p>
          </div>
        ) : (
          <form
            onSubmit={handleSubmit}
            className="space-y-3 max-w-xs mx-auto text-left"
          >
            <h3 className="font-heading text-xl text-ivy-dark text-center mb-2">
              Ask Us Anything
            </h3>

            <div>
              <label className="font-heading text-xs tracking-wider uppercase text-gold-dark block mb-1">
                Your Name *
              </label>
              <input
                type="text"
                required
                className="input-nouveau"
                value={formName}
                onChange={(e) => setFormName(e.target.value)}
              />
            </div>

            <div>
              <label className="font-heading text-xs tracking-wider uppercase text-gold-dark block mb-1">
                Email (optional)
              </label>
              <input
                type="email"
                className="input-nouveau"
                value={formEmail}
                onChange={(e) => setFormEmail(e.target.value)}
              />
            </div>

            <div>
              <label className="font-heading text-xs tracking-wider uppercase text-gold-dark block mb-1">
                Category
              </label>
              <select
                className="select-nouveau"
                value={formCategory}
                onChange={(e) => setFormCategory(e.target.value)}
              >
                {CATEGORIES.filter((c) => c.id !== "all").map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.emoji} {c.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="font-heading text-xs tracking-wider uppercase text-gold-dark block mb-1">
                Your Question *
              </label>
              <textarea
                required
                className="input-nouveau min-h-[80px] resize-y"
                placeholder="What would you like to know?"
                value={formQuestion}
                onChange={(e) => setFormQuestion(e.target.value)}
              />
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="btn-nouveau w-full disabled:opacity-50"
            >
              {submitting ? "Sending…" : "Send Question"}
            </button>
          </form>
        )}
      </BookPage>
    </BookChapter>
  );
}
