"use client";

import { useState, useEffect, useCallback } from "react";
import BookChapter from "@/components/BookChapter";
import BookPage from "@/components/BookPage";
import { readCookie, RSVP_CODE_COOKIE } from "@/lib/cookies";

interface Question {
  id: string;
  question: string;
  answer: string | null;
  createdAt: string;
}

export default function QAPage() {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);

  // Identity, pulled from a cached RSVP code when available.
  const [rsvpName, setRsvpName] = useState<string | null>(null);

  // Form state
  const [formName, setFormName] = useState("");
  const [formEmail, setFormEmail] = useState("");
  const [formQuestion, setFormQuestion] = useState("");
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

  // If they've already RSVP'd, use that party's name/email instead of asking again.
  useEffect(() => {
    const code = readCookie(RSVP_CODE_COOKIE);
    if (!code) return;

    (async () => {
      try {
        const res = await fetch(`/api/rsvp/verify?code=${code}`);
        if (!res.ok) return;
        const data = await res.json();
        const firstGuest = data.party?.guests?.[0];
        if (firstGuest) setRsvpName(firstGuest.name);
        if (data.party?.email) setFormEmail(data.party.email);
      } catch {
        // Silently fall back to the manual name field.
      }
    })();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const res = await fetch("/api/questions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: rsvpName || formName,
          email: formEmail || null,
          question: formQuestion,
        }),
      });

      if (res.ok) {
        setSubmitSuccess(true);
        setFormName("");
        setFormQuestion("");
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
      {/* Page 1: browse questions */}
      <BookPage>
        <div className="text-left">
          {loading ? (
            <div className="text-center py-8">
              <p className="font-body text-sm text-bark-light">
                Loading questions…
              </p>
            </div>
          ) : questions.length === 0 ? (
            <div className="text-center py-8">
              <p className="font-heading text-base text-bark-light">
                No answered questions yet!
              </p>
              <p className="font-body text-sm text-bark-light/60 mt-1">
                Be the first to ask →
              </p>
            </div>
          ) : (
            questions.map((q, i) => (
              <div key={q.id}>
                {i > 0 && <div className="qa-divider" />}
                <p className="font-heading text-base text-ivy-dark mb-1">
                  {q.question}
                </p>
                {q.answer && (
                  <>
                    <p className="font-body text-sm text-bark-light italic">
                      {q.answer}
                    </p>
                    <p className="font-body text-xs text-gold-dark mt-1">
                      - Adam &amp; Mady
                    </p>
                  </>
                )}
              </div>
            ))
          )}
        </div>
      </BookPage>

      {/* Page 2: ask a question */}
      <BookPage>
        {submitSuccess ? (
          <div className="py-8">
            <h3 className="font-heading text-xl text-ivy-dark mb-2">
              Question received!
            </h3>
            <p className="font-body text-bark-light">
              We&apos;ll get back to you soon.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-3 text-left">
            <h3 className="font-heading text-xl text-ivy-dark text-center mb-2">
              Ask Us Anything
            </h3>

            {rsvpName ? (
              <p className="font-body text-sm text-bark-light text-center">
                Asking as <span className="text-gold-dark">{rsvpName}</span>{" "}
              </p>
            ) : (
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
            )}

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

