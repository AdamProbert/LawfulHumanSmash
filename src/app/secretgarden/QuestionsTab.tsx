"use client";

import { useMemo, useState } from "react";
import type { AdminQuestion } from "./types";
import { Empty, Pill, Stat, formatDateTime } from "./ui";

type Filter = "pending" | "answered" | "hidden" | "ours" | "all";

const FILTERS: { id: Filter; label: string }[] = [
  { id: "pending", label: "Needs an answer" },
  { id: "answered", label: "Answered" },
  { id: "hidden", label: "Hidden" },
  { id: "ours", label: "Ours" },
  { id: "all", label: "All" },
];

interface Draft {
  question: string;
  answer: string;
}

function draftOf(q: AdminQuestion): Draft {
  return { question: q.question, answer: q.answer || "" };
}

/**
 * Answering guests' questions and writing our own. Answering a guest's
 * question emails them if they left an address, so the row says so before the
 * save rather than after.
 */
export default function QuestionsTab({
  questions,
  setQuestions,
}: {
  questions: AdminQuestion[];
  setQuestions: React.Dispatch<React.SetStateAction<AdminQuestion[]>>;
}) {
  const [filter, setFilter] = useState<Filter>("pending");
  const [drafts, setDrafts] = useState<Record<string, Draft>>({});
  const [busyId, setBusyId] = useState<string | null>(null);
  const [error, setError] = useState("");

  // Composer for our own Q&A entries.
  const [newQuestion, setNewQuestion] = useState("");
  const [newAnswer, setNewAnswer] = useState("");
  const [adding, setAdding] = useState(false);

  const stats = useMemo(
    () => ({
      total: questions.length,
      pending: questions.filter((q) => !q.isAnswered).length,
      live: questions.filter((q) => q.isAnswered && !q.isHidden).length,
      hidden: questions.filter((q) => q.isHidden).length,
    }),
    [questions]
  );

  const visible = useMemo(
    () =>
      questions.filter((q) => {
        switch (filter) {
          case "pending":
            return !q.isAnswered;
          case "answered":
            return q.isAnswered;
          case "hidden":
            return q.isHidden;
          case "ours":
            return q.source === "admin";
          default:
            return true;
        }
      }),
    [questions, filter]
  );

  const patch = async (id: string, body: Record<string, unknown>) => {
    setBusyId(id);
    setError("");
    try {
      const res = await fetch(`/api/admin/questions/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Failed to save");
        return;
      }
      setQuestions((prev) => prev.map((q) => (q.id === id ? data.question : q)));
      // Drop the local draft so the row re-reads from the saved record.
      setDrafts((prev) => {
        const next = { ...prev };
        delete next[id];
        return next;
      });
    } catch {
      setError("Failed to save");
    } finally {
      setBusyId(null);
    }
  };

  const remove = async (q: AdminQuestion) => {
    const ok = window.confirm(
      `Delete this question permanently?\n\n"${q.question}"\n\nHide it instead if you might want it back.`
    );
    if (!ok) return;

    setBusyId(q.id);
    try {
      const res = await fetch(`/api/admin/questions/${q.id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        setQuestions((prev) => prev.filter((x) => x.id !== q.id));
      } else {
        setError("Failed to delete");
      }
    } finally {
      setBusyId(null);
    }
  };

  const addOwn = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newQuestion.trim()) return;
    setAdding(true);
    setError("");
    try {
      const res = await fetch("/api/admin/questions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question: newQuestion, answer: newAnswer }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Failed to add");
        return;
      }
      setQuestions((prev) => [data.question, ...prev]);
      setNewQuestion("");
      setNewAnswer("");
      // Show it straight away, whichever filter happens to be on.
      setFilter(data.question.isAnswered ? "answered" : "pending");
    } catch {
      setError("Failed to add");
    } finally {
      setAdding(false);
    }
  };

  return (
    <div>
      <div className="admin-stats">
        <Stat value={stats.total} label="Questions" />
        <Stat value={stats.pending} label="Need answers" />
        <Stat value={stats.live} label="Live on site" />
        <Stat value={stats.hidden} label="Hidden" />
      </div>

      {/* Write our own Q&A entry */}
      <form onSubmit={addOwn} className="admin-card space-y-2">
        <p className="font-heading text-sm text-ivy-dark">
          Add your own question
        </p>
        <input
          className="admin-input"
          placeholder="What time does the bar close?"
          value={newQuestion}
          onChange={(e) => setNewQuestion(e.target.value)}
        />
        <textarea
          className="admin-input min-h-[60px] resize-y"
          placeholder="The answer. Leave it blank to park this as unanswered."
          value={newAnswer}
          onChange={(e) => setNewAnswer(e.target.value)}
        />
        <button
          type="submit"
          className="admin-btn"
          disabled={adding || !newQuestion.trim()}
        >
          {adding ? "Adding…" : "Add"}
        </button>
      </form>

      <div className="admin-tabs mt-4">
        {FILTERS.map((f) => (
          <button
            key={f.id}
            className="admin-tab"
            aria-pressed={filter === f.id}
            onClick={() => setFilter(f.id)}
          >
            {f.label}
          </button>
        ))}
      </div>

      {error && <p className="font-body text-sm text-accent-red mb-3">{error}</p>}

      {visible.length === 0 ? (
        <Empty>Nothing here.</Empty>
      ) : (
        visible.map((q) => {
          const draft = drafts[q.id] || draftOf(q);
          const update = (changes: Partial<Draft>) =>
            setDrafts((prev) => ({
              ...prev,
              [q.id]: { ...draft, ...changes },
            }));
          const dirty =
            draft.question !== q.question || draft.answer !== (q.answer || "");
          // A first answer to a guest who left an address triggers an email.
          const willEmail =
            q.source !== "admin" &&
            !!q.email &&
            !q.isAnswered &&
            draft.answer.trim().length > 0;

          return (
            <div key={q.id} className="admin-card" data-muted={q.isHidden}>
              <div className="flex flex-wrap items-center gap-2 mb-2">
                <span className="font-heading text-xs tracking-wider uppercase text-gold-dark">
                  {q.source === "admin" ? "Ours" : q.name}
                </span>
                {q.email && (
                  <span className="font-body text-xs text-bark-light">
                    {q.email}
                  </span>
                )}
                <span className="font-body text-xs text-bark-light/70">
                  {formatDateTime(q.createdAt)}
                </span>
                <span className="ml-auto flex gap-1.5">
                  {q.isHidden && <Pill status="neutral">Hidden</Pill>}
                  {q.isAnswered ? (
                    <Pill status="yes">Answered</Pill>
                  ) : (
                    <Pill status="pending">Pending</Pill>
                  )}
                </span>
              </div>

              <label className="admin-label">Question</label>
              <input
                className="admin-input mb-2"
                value={draft.question}
                onChange={(e) => update({ question: e.target.value })}
              />

              <label className="admin-label">Answer</label>
              <textarea
                className="admin-input min-h-[70px] resize-y mb-2"
                value={draft.answer}
                onChange={(e) => update({ answer: e.target.value })}
              />

              <div className="flex flex-wrap gap-2 items-center">
                <button
                  className="admin-btn"
                  disabled={busyId === q.id || !dirty}
                  onClick={() =>
                    patch(q.id, {
                      question: draft.question,
                      answer: draft.answer,
                    })
                  }
                >
                  {busyId === q.id ? "Saving…" : "Save"}
                </button>

                <button
                  className="admin-btn"
                  data-variant="ghost"
                  disabled={busyId === q.id}
                  onClick={() => patch(q.id, { isHidden: !q.isHidden })}
                >
                  {q.isHidden ? "Show on site" : "Hide"}
                </button>

                <button
                  className="admin-btn"
                  data-variant="danger"
                  disabled={busyId === q.id}
                  onClick={() => remove(q)}
                >
                  Delete
                </button>

                {willEmail && (
                  <span className="font-body text-xs text-gold-dark">
                    Saving emails {q.email}
                  </span>
                )}
              </div>
            </div>
          );
        })
      )}
    </div>
  );
}
