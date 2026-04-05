"use client";

import { createContext, useContext, useState, ReactNode } from "react";

export type Task = {
  id: string;
  date: string;
  title: string;
  done: boolean;
  course?: string;
  dueDate?: string; // "TODAY", "TUE", "WED", etc.
};

export type Note = {
  id: string;
  date: string;
  text: string;
};

export type TimeBlock = {
  id: string;
  date: string;
  time: string;
  title: string;
  location?: string;
};

export type Reading = {
  id: string;
  date: string;
  title: string;
  url: string;
  source: string;
  course?: string;
  status?: "TODO" | "DONE";
};

type PlannerState = {
  tasks: Task[];
  notes: Note[];
  timeBlocks: TimeBlock[];
  readings: Reading[];
  addTask: (date: string, title: string, course?: string) => void;
  toggleTask: (id: string) => void;
  addNote: (date: string, text: string) => void;
  addTimeBlock: (date: string, time: string, title: string, location?: string) => void;
  addReading: (date: string, title: string, url: string, source: string, course?: string) => void;
  toggleReadingStatus: (id: string) => void;
};

const PlannerContext = createContext<PlannerState | null>(null);

function generateId() {
  return Math.random().toString(36).slice(2, 9);
}

function todayStr() {
  return new Date().toISOString().split("T")[0];
}

const sampleTasks: Task[] = [
  { id: "t1", date: todayStr(), title: "Review lecture notes", done: false, course: "DBS", dueDate: "TODAY" },
  { id: "t2", date: todayStr(), title: "Push assignment to GitHub", done: true, course: "DBS" },
  { id: "t3", date: todayStr(), title: "Grab coffee with Alex", done: false },
  { id: "t4", date: todayStr(), title: "Read DDIA Ch. 5", done: false, course: "Cloud", dueDate: "TUE" },
  { id: "t5", date: todayStr(), title: "Submit reflections", done: false, course: "DBS", dueDate: "WED" },
];

const sampleNotes: Note[] = [
  { id: "n1", date: todayStr(), text: "Exam covers ch 3-7. Study group Sunday 4pm at Reg." },
];

const sampleTimeBlocks: TimeBlock[] = [
  { id: "b1", date: todayStr(), time: "09:00", title: "Algorithms Lecture", location: "JCL 298" },
  { id: "b2", date: todayStr(), time: "11:00", title: "Deep work — PS4" },
  { id: "b3", date: todayStr(), time: "14:00", title: "Office Hours", location: "JCL 379" },
  { id: "b4", date: todayStr(), time: "16:00", title: "Gym", location: "Ratner" },
];

const sampleReadings: Reading[] = [
  { id: "r1", date: todayStr(), title: "DDIA Ch. 5 — Replication", url: "#", source: "Textbook", course: "Cloud", status: "TODO" },
  { id: "r2", date: todayStr(), title: "Tailwind Responsive Design", url: "#", source: "Docs", course: "DBS", status: "DONE" },
  { id: "r3", date: todayStr(), title: "React Server Components RFC", url: "#", source: "RFC", course: "Web Dev", status: "TODO" },
];

export function PlannerProvider({ children }: { children: ReactNode }) {
  const [tasks, setTasks] = useState<Task[]>(sampleTasks);
  const [notes, setNotes] = useState<Note[]>(sampleNotes);
  const [timeBlocks, setTimeBlocks] = useState<TimeBlock[]>(sampleTimeBlocks);
  const [readings, setReadings] = useState<Reading[]>(sampleReadings);

  const addTask = (date: string, title: string, course?: string) => {
    setTasks((prev) => [...prev, { id: generateId(), date, title, done: false, course }]);
  };

  const toggleTask = (id: string) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, done: !t.done } : t))
    );
  };

  const addNote = (date: string, text: string) => {
    setNotes((prev) => [...prev, { id: generateId(), date, text }]);
  };

  const addTimeBlock = (date: string, time: string, title: string, location?: string) => {
    setTimeBlocks((prev) => [...prev, { id: generateId(), date, time, title, location }]);
  };

  const addReading = (date: string, title: string, url: string, source: string, course?: string) => {
    setReadings((prev) => [...prev, { id: generateId(), date, title, url, source, course, status: "TODO" }]);
  };

  const toggleReadingStatus = (id: string) => {
    setReadings((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status: r.status === "TODO" ? "DONE" : "TODO" } : r))
    );
  };

  return (
    <PlannerContext.Provider
      value={{ tasks, notes, timeBlocks, readings, addTask, toggleTask, addNote, addTimeBlock, addReading, toggleReadingStatus }}
    >
      {children}
    </PlannerContext.Provider>
  );
}

export function usePlanner() {
  const ctx = useContext(PlannerContext);
  if (!ctx) throw new Error("usePlanner must be used within PlannerProvider");
  return ctx;
}
