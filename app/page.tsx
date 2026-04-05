"use client";

import { usePlanner } from "@/context/PlannerContext";
import Link from "next/link";
import { useState } from "react";

function todayStr() {
  return new Date().toISOString().split("T")[0];
}

function getWeekDates(): string[] {
  const now = new Date();
  const day = now.getDay();
  const monday = new Date(now);
  monday.setDate(now.getDate() - ((day + 6) % 7));
  const dates: string[] = [];
  for (let i = 0; i < 7; i++) {
    const d = new Date(monday);
    d.setDate(monday.getDate() + i);
    dates.push(d.toISOString().split("T")[0]);
  }
  return dates;
}

function formatDayShort(dateStr: string) {
  return new Date(dateStr + "T12:00:00").toLocaleDateString("en-US", { weekday: "short" }).toUpperCase();
}

function formatDayNum(dateStr: string) {
  return new Date(dateStr + "T12:00:00").getDate();
}

function formatDateLong(dateStr: string) {
  const d = new Date(dateStr + "T12:00:00");
  return d.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" }).toUpperCase();
}

export default function HomePage() {
  const { tasks, notes, timeBlocks, readings, toggleTask, toggleReadingStatus } = usePlanner();
  const today = todayStr();
  const weekDates = getWeekDates();
  const [selectedDate, setSelectedDate] = useState(today);

  const dayTasks = tasks.filter((t) => t.date === selectedDate);
  const dayNotes = notes.filter((n) => n.date === selectedDate);
  const dayReadings = readings.filter((r) => r.date === selectedDate);
  const dayBlocks = timeBlocks
    .filter((b) => b.date === selectedDate)
    .sort((a, b) => a.time.localeCompare(b.time));

  const doneTasks = dayTasks.filter((t) => t.done).length;
  const nextBlock = dayBlocks[0];
  const isToday = selectedDate === today;

  return (
    <div className="flex flex-col">
      {/* DAY BAR */}
      <div className="flex" style={{ borderBottom: "2px solid var(--border-heavy)" }}>
        {weekDates.map((date) => {
          const isSelected = date === selectedDate;
          const isActualToday = date === today;
          const dayTasks2 = tasks.filter((t) => t.date === date);
          return (
            <button
              key={date}
              onClick={() => setSelectedDate(date)}
              className="flex-1 py-1.5 text-center transition-all cursor-pointer"
              style={{
                background: isSelected ? "var(--blue)" : "transparent",
                borderRight: "1px solid var(--border)",
                border: "none",
                borderBottom: isActualToday && !isSelected ? "2px solid var(--red)" : "none",
              }}
            >
              <div
                className="text-[9px] font-semibold uppercase tracking-[1px]"
                style={{ color: isSelected ? "rgba(255,255,255,0.5)" : isActualToday ? "var(--red)" : "var(--faint)" }}
              >
                {formatDayShort(date)}
              </div>
              <div
                className="text-lg font-bold leading-tight"
                style={{ color: isSelected ? "#fff" : isActualToday ? "var(--text)" : "#ccc" }}
              >
                {formatDayNum(date)}
              </div>
              {dayTasks2.length > 0 && !isSelected && (
                <div className="flex gap-[2px] justify-center mt-0.5">
                  {dayTasks2.slice(0, 3).map((_, i) => (
                    <span key={i} className="w-1 h-1 rounded-full" style={{ background: isActualToday ? "var(--red)" : "var(--blue)" }} />
                  ))}
                </div>
              )}
            </button>
          );
        })}
      </div>

      {/* NEXT UP */}
      {nextBlock && (
        <div
          className="flex items-center gap-3 px-4 py-2"
          style={{ background: "var(--subtle)", borderBottom: "2px solid var(--border-heavy)" }}
        >
          <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: "var(--red)" }} />
          <span className="text-[9px] font-semibold uppercase tracking-[2px]" style={{ color: "var(--muted)" }}>Next</span>
          <span className="text-[13px] font-semibold flex-1" style={{ color: "var(--text)" }}>{nextBlock.title}{nextBlock.location ? ` — ${nextBlock.location}` : ""}</span>
          <span className="text-xs font-bold" style={{ color: "var(--red)" }}>{nextBlock.time}</span>
        </div>
      )}

      {/* DUE SOON */}
      {dayTasks.filter(t => t.dueDate && !t.done).length > 0 && (
        <div className="px-4 py-1.5" style={{ borderBottom: "2px solid var(--border-heavy)" }}>
          <div className="text-[8px] font-bold uppercase tracking-[2px] mb-1" style={{ color: "var(--red)" }}>Due Soon</div>
          <div className="flex gap-2 overflow-x-auto pb-1" style={{ scrollbarWidth: "none" }}>
            {dayTasks.filter(t => t.dueDate && !t.done).map((t) => (
              <div
                key={t.id}
                className="flex-shrink-0 min-w-[170px] px-2.5 py-1.5"
                style={{ border: "2px solid var(--red)", background: "var(--surface)" }}
              >
                <div className="text-[11px] font-semibold" style={{ color: "var(--text)" }}>{t.title}</div>
                <div className="text-[9px] font-bold mt-0.5" style={{ color: "var(--red)" }}>{t.dueDate}</div>
                {t.course && <div className="text-[10px] mt-0.5" style={{ color: "var(--muted)" }}>{t.course}</div>}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* HEADER ROW */}
      <div
        className="flex items-center justify-between px-4 py-2"
        style={{ borderBottom: "2px solid var(--border-heavy)" }}
      >
        <h1 className="text-sm font-bold tracking-[2px]" style={{ color: "var(--blue)" }}>
          {formatDateLong(selectedDate)}
        </h1>
        <div className="flex items-center gap-2">
          <div className="w-[100px] h-[3px]" style={{ background: "var(--border)" }}>
            <div
              className="h-full transition-all"
              style={{ background: "var(--blue)", width: `${dayTasks.length ? (doneTasks / dayTasks.length) * 100 : 0}%` }}
            />
          </div>
          <span className="text-[10px] font-semibold" style={{ color: "var(--blue)" }}>{doneTasks}/{dayTasks.length}</span>
        </div>
      </div>

      {/* 2-COL GRID: TASKS + SCHEDULE */}
      <div className="grid grid-cols-1 md:grid-cols-2">
        {/* TASKS */}
        <div className="p-3" style={{ borderBottom: "2px solid var(--border-heavy)", borderRight: "2px solid var(--border-heavy)" }}>
          <div className="flex justify-between items-center pb-1 mb-1.5" style={{ borderBottom: "1.5px solid var(--blue)" }}>
            <span className="text-[10px] font-semibold uppercase tracking-[2px]" style={{ color: "var(--blue)" }}>Tasks</span>
            <span className="text-[10px] font-semibold" style={{ color: "var(--blue)" }}>{doneTasks}/{dayTasks.length}</span>
          </div>
          {dayTasks.length === 0 ? (
            <p className="text-sm italic py-2" style={{ color: "var(--muted)" }}>No tasks — add one!</p>
          ) : (
            dayTasks.map((task) => (
              <label
                key={task.id}
                className="flex items-center gap-2.5 py-1.5 cursor-pointer"
                style={{ borderBottom: "1px solid var(--subtle)" }}
              >
                <input
                  type="checkbox"
                  checked={task.done}
                  onChange={() => toggleTask(task.id)}
                  className="w-3.5 h-3.5 cursor-pointer"
                  style={{ accentColor: "var(--blue)" }}
                />
                <div className="flex-1 min-w-0">
                  <span
                    className="text-[13px] font-medium block"
                    style={{
                      color: task.done ? "#ccc" : "var(--text)",
                      textDecoration: task.done ? "line-through" : "none",
                    }}
                  >
                    {task.title}
                  </span>
                  {task.course && (
                    <span className="text-[10px]" style={{ color: "var(--faint)" }}>{task.course}</span>
                  )}
                </div>
                {task.dueDate && (
                  <span
                    className="text-[9px] font-semibold px-1.5 py-0.5 flex-shrink-0"
                    style={
                      task.dueDate === "TODAY"
                        ? { background: "var(--red)", color: "#fff" }
                        : task.dueDate === "—"
                        ? { color: "#ddd" }
                        : { border: "1px solid var(--text)", color: "var(--text)" }
                    }
                  >
                    {task.dueDate}
                  </span>
                )}
              </label>
            ))
          )}
        </div>

        {/* SCHEDULE */}
        <div className="p-3" style={{ borderBottom: "2px solid var(--border-heavy)" }}>
          <div className="pb-1 mb-1.5" style={{ borderBottom: "1.5px solid var(--red)" }}>
            <span className="text-[10px] font-semibold uppercase tracking-[2px]" style={{ color: "var(--red)" }}>Schedule</span>
          </div>
          {dayBlocks.length === 0 ? (
            <p className="text-sm italic py-2" style={{ color: "var(--muted)" }}>Nothing scheduled.</p>
          ) : (
            dayBlocks.map((block, i) => (
              <div
                key={block.id}
                className={`flex gap-2.5 py-1.5 ${i === 0 ? "px-3 -mx-3" : ""}`}
                style={{
                  borderBottom: "1px solid var(--subtle)",
                  ...(i === 0 ? { background: "var(--subtle)", borderLeft: "2px solid var(--red)" } : {}),
                }}
              >
                <span className="text-[11px] font-bold min-w-[42px]" style={{ color: "var(--red)" }}>{block.time}</span>
                <div>
                  <span className="text-[13px] font-medium block" style={{ color: "var(--text)" }}>{block.title}</span>
                  {block.location && (
                    <span className="text-[10px]" style={{ color: "var(--faint)" }}>{block.location}</span>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* 2-COL GRID: READING + NOTES */}
      <div className="grid grid-cols-1 md:grid-cols-2">
        {/* READING */}
        <div className="p-3" style={{ borderBottom: "2px solid var(--border-heavy)", borderRight: "2px solid var(--border-heavy)" }}>
          <div className="pb-1 mb-1.5" style={{ borderBottom: "1.5px solid var(--border)" }}>
            <span className="text-[10px] font-semibold uppercase tracking-[2px]" style={{ color: "var(--muted)" }}>Reading</span>
          </div>
          {dayReadings.length === 0 ? (
            <p className="text-sm italic py-2" style={{ color: "var(--muted)" }}>No readings.</p>
          ) : (
            dayReadings.map((r) => (
              <div
                key={r.id}
                className="flex items-center justify-between gap-2 py-1.5 cursor-pointer"
                style={{ borderBottom: "1px solid var(--subtle)" }}
                onClick={() => toggleReadingStatus(r.id)}
              >
                <div className="flex-1 min-w-0">
                  <span className="text-xs font-medium block" style={{ color: "var(--text)" }}>{r.title}</span>
                  {r.course && <span className="text-[10px]" style={{ color: "var(--faint)" }}>{r.course}</span>}
                </div>
                <span
                  className="text-[9px] font-semibold px-1.5 py-0.5 flex-shrink-0"
                  style={
                    r.status === "TODO"
                      ? { border: "1px solid var(--muted)", color: "var(--muted)" }
                      : { border: "1px solid var(--border)", color: "var(--border)" }
                  }
                >
                  {r.status || "TODO"}
                </span>
              </div>
            ))
          )}
        </div>

        {/* NOTES */}
        <div className="p-3" style={{ borderBottom: "2px solid var(--border-heavy)" }}>
          <div className="pb-1 mb-1.5" style={{ borderBottom: "1.5px solid var(--yellow)" }}>
            <span className="text-[10px] font-semibold uppercase tracking-[2px]" style={{ color: "var(--yellow-dark)" }}>Notes</span>
          </div>
          {dayNotes.length === 0 ? (
            <p className="text-sm italic py-2" style={{ color: "var(--muted)" }}>No notes.</p>
          ) : (
            dayNotes.map((note) => (
              <div
                key={note.id}
                className="text-xs leading-relaxed px-3 py-2"
                style={{ color: "var(--muted)", borderLeft: "2px solid var(--yellow)", background: "var(--yellow-bg)" }}
              >
                {note.text}
              </div>
            ))
          )}
        </div>
      </div>

      {/* QUICK ADD */}
      <QuickAdd selectedDate={selectedDate} />
    </div>
  );
}

function QuickAdd({ selectedDate }: { selectedDate: string }) {
  const { addTask } = usePlanner();
  const [value, setValue] = useState("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!value.trim()) return;
    addTask(selectedDate, value.trim());
    setValue("");
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="sticky bottom-0 flex gap-1.5 px-4 py-2"
      style={{ background: "var(--bg)", borderTop: "2px solid var(--border-heavy)" }}
    >
      <input
        type="text"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="Quick add task..."
        className="flex-1 px-3.5 py-2.5 text-[13px] outline-none transition-colors"
        style={{ background: "var(--surface)", border: "1.5px solid var(--border)", color: "var(--text)" }}
      />
      <button
        type="submit"
        className="px-4 py-2.5 text-[13px] font-bold tracking-[2px] cursor-pointer transition-colors"
        style={{ background: "var(--red)", color: "#fff", border: "none" }}
      >
        ADD
      </button>
    </form>
  );
}

