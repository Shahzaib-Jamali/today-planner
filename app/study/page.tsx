"use client";

import { usePlanner, type Mastery } from "@/context/PlannerContext";
import { useState } from "react";
import Link from "next/link";

const masteryColors: Record<Mastery, string> = {
  new: "var(--red)",
  learning: "var(--blue)",
  mastered: "var(--yellow-dark)",
};

const masteryLabels: Record<Mastery, string> = {
  new: "NEW",
  learning: "LEARNING",
  mastered: "MASTERED",
};

export default function StudyPage() {
  const { vocab, updateVocabMastery } = usePlanner();
  const [filter, setFilter] = useState<string>("all");
  const [flipped, setFlipped] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [mode, setMode] = useState<"list" | "flashcard">("list");

  const courses = [...new Set(vocab.map((v) => v.course).filter(Boolean))] as string[];

  const filtered = vocab.filter((v) => {
    if (filter === "all") return true;
    if (filter === "new" || filter === "learning" || filter === "mastered") return v.mastery === filter;
    return v.course === filter;
  });

  // For flashcard mode — show weakest first (new > learning > mastered)
  const studyDeck = [...filtered].sort((a, b) => {
    const order: Record<Mastery, number> = { new: 0, learning: 1, mastered: 2 };
    return order[a.mastery] - order[b.mastery];
  });

  const currentCard = studyDeck[currentIndex];

  const stats = {
    total: vocab.length,
    new: vocab.filter((v) => v.mastery === "new").length,
    learning: vocab.filter((v) => v.mastery === "learning").length,
    mastered: vocab.filter((v) => v.mastery === "mastered").length,
  };

  function nextCard() {
    setFlipped(false);
    setCurrentIndex((prev) => (prev + 1) % studyDeck.length);
  }

  function markCard(mastery: Mastery) {
    if (currentCard) {
      updateVocabMastery(currentCard.id, mastery);
    }
    nextCard();
  }

  return (
    <div className="flex flex-col">
      {/* HEADER */}
      <div
        className="px-4 py-3 flex items-center justify-between"
        style={{ borderBottom: "2px solid var(--border-heavy)" }}
      >
        <div>
          <p className="text-[9px] font-semibold uppercase tracking-[2px]" style={{ color: "var(--blue)" }}>Vocabulary</p>
          <h1 className="text-xl font-bold tracking-tight mt-0.5" style={{ color: "var(--text)" }}>Study</h1>
        </div>
        <div className="flex items-center gap-3">
          <Link
            href="/new?type=vocab"
            className="text-[11px] font-bold uppercase tracking-[1px] px-3 py-1.5"
            style={{ background: "var(--red)", color: "#fff" }}
          >
            + Word
          </Link>
        </div>
      </div>

      {/* STATS BAR */}
      <div
        className="px-4 py-2 flex items-center gap-4"
        style={{ borderBottom: "2px solid var(--border-heavy)", background: "var(--subtle)" }}
      >
        <div className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full" style={{ background: "var(--red)" }} />
          <span className="text-[10px] font-semibold" style={{ color: "var(--muted)" }}>{stats.new} new</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full" style={{ background: "var(--blue)" }} />
          <span className="text-[10px] font-semibold" style={{ color: "var(--muted)" }}>{stats.learning} learning</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full" style={{ background: "var(--yellow-dark)" }} />
          <span className="text-[10px] font-semibold" style={{ color: "var(--muted)" }}>{stats.mastered} mastered</span>
        </div>
        <div className="flex-1" />
        <span className="text-[10px] font-bold" style={{ color: "var(--text)" }}>{stats.total} total</span>
      </div>

      {/* MODE TOGGLE + FILTER */}
      <div
        className="px-4 py-2 flex items-center justify-between"
        style={{ borderBottom: "2px solid var(--border-heavy)" }}
      >
        <div className="flex gap-1">
          <button
            onClick={() => setMode("list")}
            className="text-[11px] font-semibold uppercase tracking-[1px] px-3 py-1.5 cursor-pointer"
            style={{
              background: mode === "list" ? "var(--text)" : "transparent",
              color: mode === "list" ? "var(--bg)" : "var(--muted)",
              border: `1.5px solid ${mode === "list" ? "var(--text)" : "var(--border)"}`,
            }}
          >
            List
          </button>
          <button
            onClick={() => { setMode("flashcard"); setCurrentIndex(0); setFlipped(false); }}
            className="text-[11px] font-semibold uppercase tracking-[1px] px-3 py-1.5 cursor-pointer"
            style={{
              background: mode === "flashcard" ? "var(--text)" : "transparent",
              color: mode === "flashcard" ? "var(--bg)" : "var(--muted)",
              border: `1.5px solid ${mode === "flashcard" ? "var(--text)" : "var(--border)"}`,
            }}
          >
            Flashcards
          </button>
        </div>
        <div className="flex gap-1">
          {["all", ...courses, "new", "learning", "mastered"].map((f) => (
            <button
              key={f}
              onClick={() => { setFilter(f); setCurrentIndex(0); setFlipped(false); }}
              className="text-[9px] font-semibold uppercase tracking-[1px] px-2 py-1 cursor-pointer"
              style={{
                background: filter === f ? "var(--subtle)" : "transparent",
                color: filter === f ? "var(--text)" : "var(--faint)",
                border: `1px solid ${filter === f ? "var(--border-heavy)" : "var(--border)"}`,
              }}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* LIST MODE */}
      {mode === "list" && (
        <div className="flex flex-col">
          {filtered.length === 0 ? (
            <p className="text-sm italic py-8 text-center" style={{ color: "var(--muted)" }}>No words found. Add some!</p>
          ) : (
            filtered.map((v) => (
              <div
                key={v.id}
                className="px-4 py-3 flex gap-3"
                style={{ borderBottom: "1px solid var(--subtle)" }}
              >
                <div
                  className="w-1 flex-shrink-0 rounded-sm mt-1"
                  style={{ background: masteryColors[v.mastery], minHeight: "100%" }}
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-[14px] font-bold" style={{ color: "var(--text)" }}>{v.word}</span>
                    {v.course && (
                      <span className="text-[9px] font-semibold px-1.5 py-0.5" style={{ border: "1px solid var(--border)", color: "var(--faint)" }}>
                        {v.course}
                      </span>
                    )}
                    <span
                      className="text-[8px] font-bold uppercase tracking-[1px] px-1.5 py-0.5 ml-auto flex-shrink-0"
                      style={{ color: masteryColors[v.mastery], border: `1px solid ${masteryColors[v.mastery]}` }}
                    >
                      {masteryLabels[v.mastery]}
                    </span>
                  </div>
                  <p className="text-[12px] mt-1" style={{ color: "var(--muted)" }}>{v.definition}</p>
                  {v.example && (
                    <p className="text-[11px] mt-1 italic" style={{ color: "var(--faint)" }}>"{v.example}"</p>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* FLASHCARD MODE */}
      {mode === "flashcard" && (
        <div className="flex flex-col items-center justify-center px-4 py-8">
          {studyDeck.length === 0 ? (
            <p className="text-sm italic" style={{ color: "var(--muted)" }}>No words to study. Add some!</p>
          ) : (
            <>
              {/* Progress */}
              <div className="flex items-center gap-2 mb-6">
                <span className="text-[10px] font-semibold" style={{ color: "var(--muted)" }}>
                  {currentIndex + 1} / {studyDeck.length}
                </span>
                <div className="w-[120px] h-[3px]" style={{ background: "var(--border)" }}>
                  <div
                    className="h-full transition-all"
                    style={{ background: "var(--blue)", width: `${((currentIndex + 1) / studyDeck.length) * 100}%` }}
                  />
                </div>
              </div>

              {/* Card */}
              <button
                onClick={() => setFlipped(!flipped)}
                className="w-full max-w-md cursor-pointer text-left"
                style={{
                  border: `2px solid ${masteryColors[currentCard.mastery]}`,
                  background: "var(--surface)",
                  minHeight: "200px",
                  padding: "32px 24px",
                }}
              >
                {!flipped ? (
                  <div className="flex flex-col items-center justify-center h-full">
                    <span
                      className="text-[8px] font-bold uppercase tracking-[2px] mb-3"
                      style={{ color: masteryColors[currentCard.mastery] }}
                    >
                      {masteryLabels[currentCard.mastery]}
                    </span>
                    <span className="text-2xl font-bold text-center" style={{ color: "var(--text)" }}>
                      {currentCard.word}
                    </span>
                    {currentCard.course && (
                      <span className="text-[10px] mt-3" style={{ color: "var(--faint)" }}>{currentCard.course}</span>
                    )}
                    <span className="text-[10px] mt-4" style={{ color: "var(--faint)" }}>tap to reveal</span>
                  </div>
                ) : (
                  <div>
                    <div className="flex items-center gap-2 mb-3">
                      <span className="text-lg font-bold" style={{ color: "var(--text)" }}>{currentCard.word}</span>
                      {currentCard.course && (
                        <span className="text-[9px] px-1.5 py-0.5" style={{ border: "1px solid var(--border)", color: "var(--faint)" }}>
                          {currentCard.course}
                        </span>
                      )}
                    </div>
                    <p className="text-[13px] leading-relaxed" style={{ color: "var(--text)" }}>{currentCard.definition}</p>
                    {currentCard.example && (
                      <p className="text-[12px] mt-3 italic leading-relaxed" style={{ color: "var(--muted)" }}>
                        "{currentCard.example}"
                      </p>
                    )}
                  </div>
                )}
              </button>

              {/* Actions */}
              {flipped && (
                <div className="flex gap-2 mt-4 w-full max-w-md">
                  <button
                    onClick={() => markCard("new")}
                    className="flex-1 py-2.5 text-[11px] font-bold uppercase tracking-[1px] cursor-pointer"
                    style={{ border: "2px solid var(--red)", color: "var(--red)", background: "transparent" }}
                  >
                    Again
                  </button>
                  <button
                    onClick={() => markCard("learning")}
                    className="flex-1 py-2.5 text-[11px] font-bold uppercase tracking-[1px] cursor-pointer"
                    style={{ border: "2px solid var(--blue)", color: "var(--blue)", background: "transparent" }}
                  >
                    Learning
                  </button>
                  <button
                    onClick={() => markCard("mastered")}
                    className="flex-1 py-2.5 text-[11px] font-bold uppercase tracking-[1px] cursor-pointer"
                    style={{ background: "var(--yellow)", color: "var(--text)", border: "2px solid var(--yellow)" }}
                  >
                    Got it!
                  </button>
                </div>
              )}

              {/* Skip */}
              <button
                onClick={nextCard}
                className="mt-3 text-[10px] font-semibold cursor-pointer"
                style={{ color: "var(--faint)" }}
              >
                skip →
              </button>
            </>
          )}
        </div>
      )}
    </div>
  );
}
