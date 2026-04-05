"use client";

import { usePlanner } from "@/context/PlannerContext";
import Link from "next/link";

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

function formatMonth(dateStr: string) {
  return new Date(dateStr + "T12:00:00").toLocaleDateString("en-US", { month: "long", year: "numeric" }).toUpperCase();
}

export default function WeekPage() {
  const { tasks, timeBlocks } = usePlanner();
  const weekDates = getWeekDates();
  const today = new Date().toISOString().split("T")[0];

  return (
    <div className="flex flex-col">
      {/* HEADER */}
      <div className="px-4 py-3" style={{ borderBottom: "2px solid var(--border-heavy)" }}>
        <p className="text-[9px] font-semibold uppercase tracking-[2px]" style={{ color: "var(--blue)" }}>This Week</p>
        <h1 className="text-xl font-bold tracking-[1px] mt-0.5" style={{ color: "var(--text)" }}>{formatMonth(weekDates[0])}</h1>
      </div>

      {/* WEEK GRID */}
      <div className="flex flex-col">
        {weekDates.map((date) => {
          const dayTasks = tasks.filter((t) => t.date === date);
          const doneTasks = dayTasks.filter((t) => t.done).length;
          const dayBlocks = timeBlocks
            .filter((b) => b.date === date)
            .sort((a, b) => a.time.localeCompare(b.time));
          const isToday = date === today;

          return (
            <Link
              key={date}
              href={`/day/${date}`}
              className="flex items-start gap-4 px-4 py-3 transition-all hover:pl-6"
              style={{
                borderBottom: "2px solid var(--border-heavy)",
                background: isToday ? "var(--subtle)" : "transparent",
                borderLeft: isToday ? "3px solid var(--blue)" : "3px solid transparent",
              }}
            >
              {/* Day number */}
              <div
                className="text-3xl font-bold min-w-[48px] text-center leading-none"
                style={{ color: isToday ? "var(--blue)" : "#ddd" }}
              >
                {formatDayNum(date)}
              </div>

              {/* Day info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-[13px] font-semibold" style={{ color: "var(--text)" }}>
                    {formatDayShort(date)}
                  </span>
                  {isToday && (
                    <span
                      className="text-[8px] font-bold uppercase tracking-[1px] px-1.5 py-0.5"
                      style={{ background: "var(--blue)", color: "#fff" }}
                    >
                      Today
                    </span>
                  )}
                </div>
                <p className="text-[11px] mt-0.5" style={{ color: "var(--muted)" }}>
                  {dayTasks.length === 0
                    ? "No tasks"
                    : `${dayTasks.length} task${dayTasks.length !== 1 ? "s" : ""} · ${doneTasks} done`}
                </p>

                {/* Schedule preview */}
                {dayBlocks.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mt-1.5">
                    {dayBlocks.slice(0, 3).map((block) => (
                      <span
                        key={block.id}
                        className="text-[10px] px-1.5 py-0.5"
                        style={{ background: "var(--subtle)", color: "var(--muted)" }}
                      >
                        <span style={{ color: "var(--red)", fontWeight: 600 }}>{block.time}</span>{" "}
                        {block.title}
                      </span>
                    ))}
                    {dayBlocks.length > 3 && (
                      <span className="text-[10px] px-1.5 py-0.5" style={{ color: "var(--muted)" }}>
                        +{dayBlocks.length - 3} more
                      </span>
                    )}
                  </div>
                )}
              </div>

              {/* Progress mini bar */}
              {dayTasks.length > 0 && (
                <div className="flex items-center gap-1.5 flex-shrink-0 mt-1">
                  <div className="w-[50px] h-[3px]" style={{ background: "var(--border)" }}>
                    <div
                      className="h-full"
                      style={{ background: "var(--blue)", width: `${(doneTasks / dayTasks.length) * 100}%` }}
                    />
                  </div>
                  <span className="text-[9px] font-semibold" style={{ color: "var(--faint)" }}>
                    {doneTasks}/{dayTasks.length}
                  </span>
                </div>
              )}
            </Link>
          );
        })}
      </div>
    </div>
  );
}
