"use client";

import { useEffect, useState } from "react";
import { QUESTION_CATEGORIES } from "@/lib/categories";

interface AdminQuestion {
  id: string;
  name: string;
  email: string | null;
  question: string;
  answer: string | null;
  category: string;
  isAnswered: boolean;
  createdAt: string;
}

export default function SecretGardenPage() {
  const [authed, setAuthed] = useState<boolean | null>(null);
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const [questions, setQuestions] = useState<AdminQuestion[]>([]);
  const [drafts, setDrafts] = useState<Record<string, { category: string; answer: string }>>({});
  const [savingId, setSavingId] = useState<string | null>(null);

  const loadQuestions = async () => {
    const res = await fetch("/api/admin/questions");
    if (res.status === 401) {
      setAuthed(false);
      return;
    }
    const data = await res.json();
    setQuestions(data.questions || []);
    setDrafts(
      Object.fromEntries(
        (data.questions || []).map((q: AdminQuestion) => [
          q.id,
          { category: q.category, answer: q.answer || "" },
        ])
      )
    );
    setAuthed(true);
  };

  useEffect(() => {
    loadQuestions();
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError("");

    const res = await fetch("/api/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    });

    if (!res.ok) {
      setLoginError("Incorrect password");
      return;
    }

    setPassword("");
    loadQuestions();
  };

  const saveQuestion = async (id: string) => {
    setSavingId(id);
    try {
      const res = await fetch(`/api/admin/questions/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(drafts[id]),
      });
      if (res.ok) {
        const data = await res.json();
        setQuestions((prev) =>
          prev.map((q) => (q.id === id ? data.question : q))
        );
      }
    } finally {
      setSavingId(null);
    }
  };

  if (authed === null) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-vine-pattern">
        <p className="font-body text-bark-light">Loading…</p>
      </div>
    );
  }

  if (!authed) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-vine-pattern px-4">
        <form
          onSubmit={handleLogin}
          className="frame-nouveau bg-ivory max-w-xs w-full space-y-4"
        >
          <h1 className="font-heading text-xl text-ivy-dark text-center">
            The Secret Garden
          </h1>
          <input
            type="password"
            className="input-nouveau"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          {loginError && (
            <p className="text-accent-red text-sm font-body text-center">
              {loginError}
            </p>
          )}
          <button type="submit" className="btn-nouveau w-full">
            Enter
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-vine-pattern px-4 py-10">
      <div className="max-w-2xl mx-auto space-y-6">
        <h1 className="font-heading text-2xl text-ivy-dark text-center">
          Q&amp;A Admin
        </h1>

        {questions.length === 0 && (
          <p className="font-body text-bark-light text-center">
            No questions yet.
          </p>
        )}

        {questions.map((q) => {
          const draft = drafts[q.id] || { category: q.category, answer: "" };
          return (
            <div
              key={q.id}
              className="frame-nouveau bg-ivory space-y-3 text-left"
            >
              <div className="flex items-center justify-between gap-2">
                <p className="font-heading text-xs tracking-wider uppercase text-gold-dark">
                  {q.name}
                  {q.email && (
                    <span className="text-bark-light normal-case tracking-normal">
                      {" "}
                      · {q.email}
                    </span>
                  )}
                </p>
                <span
                  className={`font-heading text-xs px-2 py-0.5 rounded-full ${
                    q.isAnswered
                      ? "bg-leaf/10 text-ivy-dark"
                      : "bg-accent-burgundy/10 text-accent-burgundy"
                  }`}
                >
                  {q.isAnswered ? "Answered" : "Pending"}
                </span>
              </div>

              <p className="font-heading text-base text-ivy-dark">
                {q.question}
              </p>

              <div>
                <label className="font-heading text-xs tracking-wider uppercase text-gold-dark block mb-1">
                  Category
                </label>
                <select
                  className="select-nouveau"
                  value={draft.category}
                  onChange={(e) =>
                    setDrafts((prev) => ({
                      ...prev,
                      [q.id]: { ...draft, category: e.target.value },
                    }))
                  }
                >
                  {QUESTION_CATEGORIES.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.emoji} {c.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="font-heading text-xs tracking-wider uppercase text-gold-dark block mb-1">
                  Answer
                </label>
                <textarea
                  className="input-nouveau min-h-[80px] resize-y"
                  value={draft.answer}
                  onChange={(e) =>
                    setDrafts((prev) => ({
                      ...prev,
                      [q.id]: { ...draft, answer: e.target.value },
                    }))
                  }
                />
              </div>

              <button
                onClick={() => saveQuestion(q.id)}
                disabled={savingId === q.id}
                className="btn-nouveau disabled:opacity-50"
              >
                {savingId === q.id ? "Saving…" : "Save"}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
