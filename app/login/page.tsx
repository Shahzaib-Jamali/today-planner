"use client";

import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function LoginPage() {
  const { login } = useAuth();
  const router = useRouter();
  const [name, setName] = useState("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) return;
    login(name.trim());
    router.push("/");
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4" style={{ background: "var(--bg)" }}>
      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="text-center mb-10">
          <div className="flex items-center justify-center gap-2 mb-3">
            <span className="text-3xl font-bold tracking-[4px]" style={{ color: "var(--text)" }}>
              TODAY.
            </span>
            <span className="flex gap-[2px]">
              <span className="w-[4px] h-[18px] block" style={{ background: "var(--blue)" }} />
              <span className="w-[4px] h-[18px] block" style={{ background: "var(--red)" }} />
              <span className="w-[4px] h-[18px] block" style={{ background: "var(--yellow)" }} />
            </span>
          </div>
          <p className="text-[11px] uppercase tracking-[3px]" style={{ color: "var(--muted)" }}>
            Student Day Planner
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              className="text-[10px] font-semibold uppercase tracking-[2px] block mb-2"
              style={{ color: "var(--muted)" }}
            >
              Your Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Shahzaib"
              autoFocus
              className="w-full px-4 py-3 text-sm outline-none"
              style={{
                background: "var(--surface)",
                border: "2px solid var(--border)",
                color: "var(--text)",
              }}
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 text-sm font-bold tracking-[2px] uppercase cursor-pointer"
            style={{ background: "var(--blue)", color: "#fff", border: "none" }}
          >
            Enter
          </button>
        </form>

        <p className="text-center mt-6 text-[10px]" style={{ color: "var(--faint)" }}>
          Data lives in memory — it disappears on refresh.
        </p>
      </div>
    </div>
  );
}
