"use client";

import { useAuth } from "@/context/AuthContext";
import { usePathname } from "next/navigation";
import { PlannerProvider } from "@/context/PlannerContext";
import ThemeWrapper from "./ThemeWrapper";
import AuthGate from "./AuthGate";
import Nav from "./Nav";

export default function AppShell({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const pathname = usePathname();
  const isLoginPage = pathname === "/login";

  return (
    <ThemeWrapper>
      <PlannerProvider>
        <AuthGate>
          {!isLoginPage && user && <Nav />}
          <main className={isLoginPage ? "" : "flex-1"}>
            {children}
          </main>
        </AuthGate>
      </PlannerProvider>
    </ThemeWrapper>
  );
}
