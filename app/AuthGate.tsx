"use client";

import { useAuth } from "@/context/AuthContext";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";

export default function AuthGate({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    if (!user && pathname !== "/login") {
      router.replace("/login");
    }
  }, [user, pathname, router]);

  // On login page, always render children (the login form)
  if (pathname === "/login") return <>{children}</>;

  // Not logged in — show nothing while redirecting
  if (!user) return null;

  return <>{children}</>;
}
