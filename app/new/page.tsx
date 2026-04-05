"use client";

import { usePlanner } from "@/context/PlannerContext";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, Suspense } from "react";

function todayStr() {
  return new Date().toISOString().split("T")[0];
}

export default function NewPage() {
  return (
    <Suspense>
      <NewPageContent />
    </Suspense>
  );
}

function NewPageContent() {
  const { addTask, addNote, addTimeBlock, addReading, addVocab } = usePlanner();
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialType = searchParams.get("type");
  const validTypes = ["task", "note", "timeblock", "reading", "vocab"] as const;
  type EntryType = typeof validTypes[number];

  const [type, setType] = useState<EntryType>(
    validTypes.includes(initialType as EntryType) ? (initialType as EntryType) : "task"
  );
  const [title, setTitle] = useState("");
  const [date, setDate] = useState(todayStr());
  const [time, setTime] = useState("09:00");
  const [course, setCourse] = useState("");
  const [location, setLocation] = useState("");
  const [definition, setDefinition] = useState("");
  const [example, setExample] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    if (type === "task") {
      addTask(date, title.trim(), course || undefined);
    } else if (type === "note") {
      addNote(date, title.trim());
    } else if (type === "timeblock") {
      addTimeBlock(date, time, title.trim(), location || undefined);
    } else if (type === "reading") {
      addReading(date, title.trim(), "#", course || "Docs", course || undefined);
    } else if (type === "vocab") {
      addVocab(title.trim(), definition.trim(), example.trim() || undefined, course || undefined);
    }

    router.push(type === "vocab" ? "/study" : "/");
  };

  const types = ["task", "note", "timeblock", "reading", "vocab"] as const;
  const typeColors: Record<string, string> = {
    task: "var(--blue)",
    note: "var(--yellow-dark)",
    timeblock: "var(--red)",
    reading: "var(--text)",
    vocab: "var(--blue)",
  };

  return (
    <div className="max-w-lg mx-auto px-4 py-8">
      <div className="mb-6">
        <p className="text-[9px] font-semibold uppercase tracking-[2px]" style={{ color: "var(--red)" }}>New Entry</p>
        <h1 className="text-2xl font-bold tracking-tight mt-1" style={{ color: "var(--text)" }}>Add something</h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Type selector */}
        <div>
          <label className="text-[10px] font-semibold uppercase tracking-[2px] block mb-2" style={{ color: "var(--muted)" }}>Type</label>
          <div className="flex gap-2">
            {types.map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => setType(t)}
                className="px-4 py-2 text-[11px] font-semibold uppercase tracking-[1px] transition-all cursor-pointer"
                style={{
                  background: type === t ? typeColors[t] : "transparent",
                  color: type === t ? (t === "note" ? "var(--text)" : "#fff") : "var(--muted)",
                  border: type === t ? `2px solid ${typeColors[t]}` : "2px solid var(--border)",
                }}
              >
                {t === "timeblock" ? "Schedule" : t}
              </button>
            ))}
          </div>
        </div>

        {/* Date */}
        <div>
          <label className="text-[10px] font-semibold uppercase tracking-[2px] block mb-2" style={{ color: "var(--muted)" }}>Date</label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="w-full px-3 py-2.5 text-sm outline-none transition-colors"
            style={{ background: "var(--surface)", border: "1.5px solid var(--border)", color: "var(--text)" }}
          />
        </div>

        {/* Time (for schedule) */}
        {type === "timeblock" && (
          <div>
            <label className="text-[10px] font-semibold uppercase tracking-[2px] block mb-2" style={{ color: "var(--muted)" }}>Time</label>
            <input
              type="time"
              value={time}
              onChange={(e) => setTime(e.target.value)}
              className="w-full px-3 py-2.5 text-sm outline-none transition-colors"
              style={{ background: "var(--surface)", border: "1.5px solid var(--border)", color: "var(--text)" }}
            />
          </div>
        )}

        {/* Course (for task, reading, vocab) */}
        {(type === "task" || type === "reading" || type === "vocab") && (
          <div>
            <label className="text-[10px] font-semibold uppercase tracking-[2px] block mb-2" style={{ color: "var(--muted)" }}>Course (optional)</label>
            <input
              type="text"
              value={course}
              onChange={(e) => setCourse(e.target.value)}
              placeholder="e.g. DBS, Cloud, Web Dev"
              className="w-full px-3 py-2.5 text-sm outline-none transition-colors"
              style={{ background: "var(--surface)", border: "1.5px solid var(--border)", color: "var(--text)" }}
            />
          </div>
        )}

        {/* Location (for schedule) */}
        {type === "timeblock" && (
          <div>
            <label className="text-[10px] font-semibold uppercase tracking-[2px] block mb-2" style={{ color: "var(--muted)" }}>Location (optional)</label>
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="e.g. JCL 298"
              className="w-full px-3 py-2.5 text-sm outline-none transition-colors"
              style={{ background: "var(--surface)", border: "1.5px solid var(--border)", color: "var(--text)" }}
            />
          </div>
        )}

        {/* Title / Text */}
        <div>
          <label className="text-[10px] font-semibold uppercase tracking-[2px] block mb-2" style={{ color: "var(--muted)" }}>
            {type === "note" ? "Note" : type === "vocab" ? "Word" : "Title"}
          </label>
          {type === "note" ? (
            <textarea
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Write your note..."
              rows={4}
              className="w-full px-3 py-2.5 text-sm outline-none resize-none transition-colors"
              style={{ background: "var(--surface)", border: "1.5px solid var(--border)", color: "var(--text)" }}
            />
          ) : (
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder={
                type === "task" ? "What needs to be done?" : type === "reading" ? "Article or chapter title" : type === "vocab" ? "e.g. Idempotent" : "What's happening?"
              }
              className="w-full px-3 py-2.5 text-sm outline-none transition-colors"
              style={{ background: "var(--surface)", border: "1.5px solid var(--border)", color: "var(--text)" }}
            />
          )}
        </div>

        {/* Vocab: Definition + Example */}
        {type === "vocab" && (
          <>
            <div>
              <label className="text-[10px] font-semibold uppercase tracking-[2px] block mb-2" style={{ color: "var(--muted)" }}>Definition</label>
              <textarea
                value={definition}
                onChange={(e) => setDefinition(e.target.value)}
                placeholder="What does this word mean?"
                rows={3}
                className="w-full px-3 py-2.5 text-sm outline-none resize-none transition-colors"
                style={{ background: "var(--surface)", border: "1.5px solid var(--border)", color: "var(--text)" }}
              />
            </div>
            <div>
              <label className="text-[10px] font-semibold uppercase tracking-[2px] block mb-2" style={{ color: "var(--muted)" }}>Example (optional)</label>
              <input
                type="text"
                value={example}
                onChange={(e) => setExample(e.target.value)}
                placeholder="Use it in a sentence..."
                className="w-full px-3 py-2.5 text-sm outline-none transition-colors"
                style={{ background: "var(--surface)", border: "1.5px solid var(--border)", color: "var(--text)" }}
              />
            </div>
          </>
        )}

        {/* Submit */}
        <button
          type="submit"
          className="w-full py-3 text-sm font-bold tracking-[2px] uppercase cursor-pointer transition-colors"
          style={{ background: typeColors[type], color: type === "note" ? "var(--text)" : "#fff", border: "none" }}
        >
          Add {type === "timeblock" ? "Schedule" : type}
        </button>
      </form>
    </div>
  );
}
