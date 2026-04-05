"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSettings } from "@/context/SettingsContext";

export default function Nav() {
  const pathname = usePathname();
  const { theme, setTheme } = useSettings();

  return (
    <nav
      className="sticky top-0 z-50 flex items-center justify-between px-4 py-2"
      style={{ background: "var(--bg)", borderBottom: "2px solid var(--border-heavy)" }}
    >
      <Link href="/" className="flex items-center gap-2">
        <span className="text-[22px] font-bold tracking-[3px]" style={{ color: "var(--text)" }}>
          TODAY.
        </span>
        <span className="flex gap-[2px]">
          <span className="w-[3px] h-[14px] block" style={{ background: "var(--blue)" }} />
          <span className="w-[3px] h-[14px] block" style={{ background: "var(--red)" }} />
          <span className="w-[3px] h-[14px] block" style={{ background: "var(--yellow)" }} />
        </span>
      </Link>

      <div className="flex items-center gap-1">
        <Link
          href="/"
          className="px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[1px] transition-all"
          style={{
            color: pathname === "/" ? "var(--text)" : "var(--muted)",
            border: `1.5px solid ${pathname === "/" ? "var(--text)" : "var(--border)"}`,
          }}
        >
          Today
        </Link>
        <Link
          href="/week"
          className="px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[1px] transition-all"
          style={{
            color: pathname === "/week" ? "var(--text)" : "var(--muted)",
            border: `1.5px solid ${pathname === "/week" ? "var(--text)" : "var(--border)"}`,
          }}
        >
          Week
        </Link>
        <Link
          href="/new"
          className="px-3 py-1.5 text-[11px] font-bold uppercase tracking-[1px] transition-all"
          style={{ background: "var(--red)", color: "#fff", border: "1.5px solid var(--red)" }}
        >
          +
        </Link>
        <button
          onClick={() => setTheme(theme === "light" ? "dark" : "light")}
          className="ml-1 px-2 py-1.5 text-sm transition-all cursor-pointer"
          style={{ color: "var(--muted)", border: "1.5px solid var(--border)" }}
          aria-label="Toggle theme"
        >
          {theme === "light" ? "◐" : "◑"}
        </button>
      </div>
    </nav>
  );
}
