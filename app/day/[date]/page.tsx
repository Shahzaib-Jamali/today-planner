"use client";

import { usePlanner } from "@/context/PlannerContext";
import Link from "next/link";
import { use } from "react";
import { todayStr, toDateStr } from "@/lib/dates";

function formatDate(dateStr: string) {
  const d = new Date(dateStr + "T12:00:00");
  return d.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" }).toUpperCase();
}

function shiftDate(dateStr: string, days: number) {
  const d = new Date(dateStr + "T12:00:00");
  d.setDate(d.getDate() + days);
  return toDateStr(d);
}

export default function DayPage({ params }: { params: Promise<{ date: string }> }) {
  const { date } = use(params);
  const { tasks, notes, timeBlocks, readings, toggleTask, toggleReadingStatus } = usePlanner();

  const dayTasks = tasks.filter((t) => t.date === date);
  const dayNotes = notes.filter((n) => n.date === date);
  const dayReadings = readings.filter((r) => r.date === date);
  const dayBlocks = timeBlocks
    .filter((b) => b.date === date)
    .sort((a, b) => a.time.localeCompare(b.time));

  const prev = shiftDate(date, -1);
  const next = shiftDate(date, 1);
  const isToday = date === todayStr();
  const doneTasks = dayTasks.filter((t) => t.done).length;

  return (
    <div className="flex flex-col">
      {/* DATE HEADER + NAV */}
      <div
        className="flex items-center justify-between px-4 py-3"
        style={{ borderBottom: "2px solid var(--border-heavy)" }}
      >
        <Link
          href={`/day/${prev}`}
          className="w-8 h-8 flex items-center justify-center text-sm transition-all"
          style={{ border: "1.5px solid var(--border)", color: "var(--muted)" }}
        >
          ←
        </Link>
        <div className="text-center">
          {isToday && (
            <p className="text-[9px] font-semibold uppercase tracking-[2px]" style={{ color: "var(--red)" }}>Today</p>
          )}
          <h1 className="text-sm font-bold tracking-[2px]" style={{ color: "var(--blue)" }}>
            {formatDate(date)}
          </h1>
        </div>
        <Link
          href={`/day/${next}`}
          className="w-8 h-8 flex items-center justify-center text-sm transition-all"
          style={{ border: "1.5px solid var(--border)", color: "var(--muted)" }}
        >
          →
        </Link>
      </div>

      {/* PROGRESS */}
      {dayTasks.length > 0 && (
        <div className="flex items-center gap-2 px-4 py-2" style={{ borderBottom: "2px solid var(--border-heavy)" }}>
          <div className="flex-1 h-[3px]" style={{ background: "var(--border)" }}>
            <div className="h-full transition-all" style={{ background: "var(--blue)", width: `${(doneTasks / dayTasks.length) * 100}%` }} />
          </div>
          <span className="text-[10px] font-semibold" style={{ color: "var(--blue)" }}>{doneTasks}/{dayTasks.length}</span>
        </div>
      )}

      {/* 2-COL GRID: TASKS + SCHEDULE */}
      <div className="grid grid-cols-1 md:grid-cols-2">
        <div className="p-3" style={{ borderBottom: "2px solid var(--border-heavy)", borderRight: "2px solid var(--border-heavy)" }}>
          <div className="pb-1 mb-1.5" style={{ borderBottom: "1.5px solid var(--blue)" }}>
            <span className="text-[10px] font-semibold uppercase tracking-[2px]" style={{ color: "var(--blue)" }}>Tasks</span>
          </div>
          {dayTasks.length === 0 ? (
            <p className="text-sm italic py-2" style={{ color: "var(--muted)" }}>No tasks for this day.</p>
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
                    style={{ color: task.done ? "#ccc" : "var(--text)", textDecoration: task.done ? "line-through" : "none" }}
                  >
                    {task.title}
                  </span>
                  {task.course && <span className="text-[10px]" style={{ color: "var(--faint)" }}>{task.course}</span>}
                </div>
                {task.dueDate && (
                  <span
                    className="text-[9px] font-semibold px-1.5 py-0.5 flex-shrink-0"
                    style={
                      task.dueDate === "TODAY"
                        ? { background: "var(--red)", color: "#fff" }
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

        <div className="p-3" style={{ borderBottom: "2px solid var(--border-heavy)" }}>
          <div className="pb-1 mb-1.5" style={{ borderBottom: "1.5px solid var(--red)" }}>
            <span className="text-[10px] font-semibold uppercase tracking-[2px]" style={{ color: "var(--red)" }}>Schedule</span>
          </div>
          {dayBlocks.length === 0 ? (
            <p className="text-sm italic py-2" style={{ color: "var(--muted)" }}>Nothing scheduled.</p>
          ) : (
            dayBlocks.map((block) => (
              <div key={block.id} className="flex gap-2.5 py-1.5" style={{ borderBottom: "1px solid var(--subtle)" }}>
                <span className="text-[11px] font-bold min-w-[42px]" style={{ color: "var(--red)" }}>{block.time}</span>
                <div>
                  <span className="text-[13px] font-medium block" style={{ color: "var(--text)" }}>{block.title}</span>
                  {block.location && <span className="text-[10px]" style={{ color: "var(--faint)" }}>{block.location}</span>}
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* 2-COL GRID: READING + NOTES */}
      <div className="grid grid-cols-1 md:grid-cols-2">
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
    </div>
  );
}
