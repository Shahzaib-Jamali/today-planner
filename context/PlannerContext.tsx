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

export type Mastery = "new" | "learning" | "mastered";

export type VocabWord = {
  id: string;
  word: string;
  definition: string;
  example?: string;
  course?: string;
  mastery: Mastery;
  dateAdded: string;
};

type PlannerState = {
  tasks: Task[];
  notes: Note[];
  timeBlocks: TimeBlock[];
  readings: Reading[];
  vocab: VocabWord[];
  addTask: (date: string, title: string, course?: string) => void;
  toggleTask: (id: string) => void;
  addNote: (date: string, text: string) => void;
  addTimeBlock: (date: string, time: string, title: string, location?: string) => void;
  addReading: (date: string, title: string, url: string, source: string, course?: string) => void;
  toggleReadingStatus: (id: string) => void;
  addVocab: (word: string, definition: string, example?: string, course?: string) => void;
  updateVocabMastery: (id: string, mastery: Mastery) => void;
  deleteTask: (id: string) => void;
  deleteNote: (id: string) => void;
  deleteTimeBlock: (id: string) => void;
  deleteReading: (id: string) => void;
  deleteVocab: (id: string) => void;
};

const PlannerContext = createContext<PlannerState | null>(null);

function generateId() {
  return Math.random().toString(36).slice(2, 9);
}

import { todayStr } from "@/lib/dates";

// Compute once at module load to prevent HMR re-evaluation triggering re-renders
const TODAY = todayStr();

const sampleTasks: Task[] = [
  { id: "t1", date: TODAY, title: "Review lecture notes", done: false, course: "DBS", dueDate: "TODAY" },
  { id: "t2", date: TODAY, title: "Push assignment to GitHub", done: true, course: "DBS" },
  { id: "t3", date: TODAY, title: "Grab coffee with Alex", done: false },
  { id: "t4", date: TODAY, title: "Read DDIA Ch. 5", done: false, course: "Cloud", dueDate: "TUE" },
  { id: "t5", date: TODAY, title: "Submit reflections", done: false, course: "DBS", dueDate: "WED" },
];

const sampleNotes: Note[] = [
  { id: "n1", date: TODAY, text: "Exam covers ch 3-7. Study group Sunday 4pm at Reg." },
];

const sampleTimeBlocks: TimeBlock[] = [
  { id: "b1", date: TODAY, time: "09:00", title: "Algorithms Lecture", location: "JCL 298" },
  { id: "b2", date: TODAY, time: "11:00", title: "Deep work — PS4" },
  { id: "b3", date: TODAY, time: "14:00", title: "Office Hours", location: "JCL 379" },
  { id: "b4", date: TODAY, time: "16:00", title: "Gym", location: "Ratner" },
];

const sampleReadings: Reading[] = [
  { id: "r1", date: TODAY, title: "DDIA Ch. 5 — Replication", url: "#", source: "Textbook", course: "Cloud", status: "TODO" },
  { id: "r2", date: TODAY, title: "Tailwind Responsive Design", url: "#", source: "Docs", course: "DBS", status: "DONE" },
  { id: "r3", date: TODAY, title: "React Server Components RFC", url: "#", source: "RFC", course: "Web Dev", status: "TODO" },
];

const sampleVocab: VocabWord[] = [
  { id: "v1", word: "Idempotent", definition: "An operation that produces the same result whether executed once or multiple times.", example: "PUT requests are idempotent — sending the same update twice has the same effect as sending it once.", course: "Cloud", mastery: "learning", dateAdded: TODAY },
  { id: "v2", word: "Denormalization", definition: "The process of adding redundant data to a database to improve read performance.", example: "We denormalized the user table by storing the city name directly instead of joining with the cities table.", course: "Cloud", mastery: "new", dateAdded: TODAY },
  { id: "v3", word: "Middleware", definition: "Software that acts as a bridge between an operating system or database and applications.", example: "The auth middleware checks the JWT token before the request reaches the route handler.", course: "Web Dev", mastery: "mastered", dateAdded: TODAY },
  { id: "v4", word: "Tailwind", definition: "A utility-first CSS framework that provides low-level utility classes to build custom designs.", example: "Instead of writing custom CSS, we used Tailwind classes like px-4 and text-sm directly in the markup.", course: "DBS", mastery: "learning", dateAdded: TODAY },
  { id: "v5", word: "Quorum", definition: "The minimum number of nodes that must agree for a distributed operation to be considered successful.", example: "With a replication factor of 3 and a write quorum of 2, at least 2 replicas must confirm the write.", course: "Cloud", mastery: "new", dateAdded: TODAY },
  { id: "v6", word: "Hydration", definition: "The process of attaching JavaScript event handlers to server-rendered HTML on the client side.", example: "After the server sends the initial HTML, React hydrates the page to make it interactive.", course: "Web Dev", mastery: "new", dateAdded: TODAY },
];

export function PlannerProvider({ children }: { children: ReactNode }) {
  const [tasks, setTasks] = useState<Task[]>(sampleTasks);
  const [notes, setNotes] = useState<Note[]>(sampleNotes);
  const [timeBlocks, setTimeBlocks] = useState<TimeBlock[]>(sampleTimeBlocks);
  const [readings, setReadings] = useState<Reading[]>(sampleReadings);
  const [vocab, setVocab] = useState<VocabWord[]>(sampleVocab);

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

  const deleteTask = (id: string) => setTasks((prev) => prev.filter((t) => t.id !== id));
  const deleteNote = (id: string) => setNotes((prev) => prev.filter((n) => n.id !== id));
  const deleteTimeBlock = (id: string) => setTimeBlocks((prev) => prev.filter((b) => b.id !== id));
  const deleteReading = (id: string) => setReadings((prev) => prev.filter((r) => r.id !== id));
  const deleteVocab = (id: string) => setVocab((prev) => prev.filter((v) => v.id !== id));

  const addVocab = (word: string, definition: string, example?: string, course?: string) => {
    setVocab((prev) => [...prev, { id: generateId(), word, definition, example, course, mastery: "new", dateAdded: todayStr() }]);
  };

  const updateVocabMastery = (id: string, mastery: Mastery) => {
    setVocab((prev) =>
      prev.map((v) => (v.id === id ? { ...v, mastery } : v))
    );
  };

  return (
    <PlannerContext.Provider
      value={{ tasks, notes, timeBlocks, readings, vocab, addTask, toggleTask, addNote, addTimeBlock, addReading, toggleReadingStatus, addVocab, updateVocabMastery, deleteTask, deleteNote, deleteTimeBlock, deleteReading, deleteVocab }}
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
