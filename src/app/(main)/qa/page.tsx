"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import ArtNouveauFrame from "@/components/ArtNouveauFrame";

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
  const [showForm, setShowForm] = useState(false);
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
        setTimeout(() => {
          setSubmitSuccess(false);
          setShowForm(false);
        }, 3000);
      }
    } catch (err) {
      console.error("Failed to submit question:", err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="section-nouveau">
      <div className="section-inner">
        {/* Header */}
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="font-display text-4xl sm:text-5xl text-gold-gradient mb-4">
            Questions &amp; Answers
          </h1>
          <p className="font-heading text-lg text-bark-light max-w-xl mx-auto">
            Got a burning question? Check if it&apos;s been answered below, or ask
            your own!
          </p>
        </motion.div>

        {/* Category Filters */}
        <motion.div
          className="flex flex-wrap justify-center gap-3 mb-10"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          {CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`pill-nouveau ${
                activeCategory === cat.id ? "active" : ""
              }`}
            >
              <span className="mr-2">{cat.emoji}</span>
              {cat.label}
            </button>
          ))}
        </motion.div>

        {/* Questions List */}
        <div className="space-y-6 mb-12">
          {loading ? (
            <div className="text-center py-12">
              <motion.div
                className="text-4xl"
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
              >
                🌿
              </motion.div>
              <p className="font-body text-bark-light mt-4">
                Loading questions...
              </p>
            </div>
          ) : filteredQuestions.length === 0 ? (
            <div className="text-center py-12">
              <p className="font-heading text-xl text-bark-light">
                No answered questions in this category yet!
              </p>
              <p className="font-body text-bark-light/60 mt-2">
                Be the first to ask 👇
              </p>
            </div>
          ) : (
            <AnimatePresence>
              {filteredQuestions.map((q, i) => (
                <motion.div
                  key={q.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ delay: i * 0.1 }}
                >
                  <div className="card-nouveau p-6">
                    <div className="flex items-start gap-4">
                      <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gold/10 flex items-center justify-center text-lg">
                        {
                          CATEGORIES.find((c) => c.id === q.category)?.emoji ||
                          "❓"
                        }
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-heading text-sm font-semibold text-ivy-dark">
                            {q.name}
                          </span>
                          <span className="pill-nouveau !py-0.5 !px-2 !text-xs">
                            {q.category}
                          </span>
                        </div>
                        <p className="font-heading text-lg text-bark mb-3">
                          {q.question}
                        </p>
                        {q.answer && (
                          <div className="pl-4 border-l-2 border-gold/40">
                            <p className="font-body text-bark-light italic">
                              {q.answer}
                            </p>
                            <p className="font-body text-xs text-gold-dark mt-1">
                              — Adam &amp; Mady
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          )}
        </div>

        {/* Ask a Question */}
        <motion.div
          className="text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          {!showForm ? (
            <button
              onClick={() => setShowForm(true)}
              className="btn-nouveau"
            >
              Ask Your Own Question ✨
            </button>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="max-w-lg mx-auto"
            >
              <ArtNouveauFrame variant="simple">
                {submitSuccess ? (
                  <motion.div
                    className="text-center py-8"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                  >
                    <p className="text-4xl mb-4">💌</p>
                    <h3 className="font-heading text-xl text-ivy-dark mb-2">
                      Question received!
                    </h3>
                    <p className="font-body text-bark-light">
                      We&apos;ll get back to you soon.
                    </p>
                  </motion.div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <h3 className="font-heading text-xl text-ivy-dark text-center mb-4">
                      Ask Us Anything
                    </h3>

                    <div>
                      <label className="font-heading text-sm tracking-wider uppercase text-gold-dark block mb-1">
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
                      <label className="font-heading text-sm tracking-wider uppercase text-gold-dark block mb-1">
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
                      <label className="font-heading text-sm tracking-wider uppercase text-gold-dark block mb-1">
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
                      <label className="font-heading text-sm tracking-wider uppercase text-gold-dark block mb-1">
                        Your Question *
                      </label>
                      <textarea
                        required
                        className="input-nouveau min-h-[100px] resize-y"
                        placeholder="What would you like to know?"
                        value={formQuestion}
                        onChange={(e) => setFormQuestion(e.target.value)}
                      />
                    </div>

                    <div className="flex gap-3 pt-2">
                      <button
                        type="submit"
                        disabled={submitting}
                        className="btn-nouveau flex-1 disabled:opacity-50"
                      >
                        {submitting ? "Sending..." : "Send Question"}
                      </button>
                      <button
                        type="button"
                        onClick={() => setShowForm(false)}
                        className="btn-nouveau-outline"
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                )}
              </ArtNouveauFrame>
            </motion.div>
          )}
        </motion.div>
      </div>
    </section>
  );
}
