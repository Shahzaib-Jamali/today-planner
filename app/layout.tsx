import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { PlannerProvider } from "@/context/PlannerContext";
import { SettingsProvider } from "@/context/SettingsContext";
import Nav from "./Nav";

const inter = Inter({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Today. — Student Day Planner",
  description: "A day planner for university students",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col font-[family-name:var(--font-geist-sans)]" style={{ background: "var(--bg)", color: "var(--text)" }}>
        <SettingsProvider>
          <PlannerProvider>
            <Nav />
            <main className="flex-1">
              {children}
            </main>
          </PlannerProvider>
        </SettingsProvider>
      </body>
    </html>
  );
}
