"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { createBrowserClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/Button";
import type { User } from "@supabase/supabase-js";

const appName = process.env.NEXT_PUBLIC_APP_NAME || "Firestorm App";

const navLinks = [
  { href: "/pricing", label: "Pricing" },
  { href: "/#features", label: "Features" },
];

export function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const isDashboard = pathname?.startsWith("/dashboard");
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const supabase = createBrowserClient();

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user: u } }) => {
      setUser(u);
      setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  async function handleLogout() {
    await supabase.auth.signOut();
    setUser(null);
    router.push("/");
    router.refresh();
  }

  const isLoggedIn = !!user;

  return (
    <header
      className="sticky top-0 z-50 border-b backdrop-blur-md"
      style={{
        height: "var(--header-height)",
        borderColor: "var(--color-border)",
        background: "color-mix(in srgb, var(--color-bg) 80%, transparent)",
      }}
    >
      <div className="mx-auto flex h-full max-w-[var(--max-width)] items-center justify-between px-6 lg:px-8">
        <div className="flex items-center gap-8">
          <Link href="/" className="text-lg font-bold">
            {appName}
          </Link>
          <nav className="hidden items-center gap-6 sm:flex">
            {!isDashboard &&
              navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-sm transition-colors hover:opacity-70"
                  style={{ color: "var(--color-text-secondary)" }}
                >
                  {link.label}
                </Link>
              ))}
            {isLoggedIn && (
              <Link
                href="/dashboard"
                className="text-sm transition-colors hover:opacity-70"
                style={{ color: isDashboard ? "var(--color-text)" : "var(--color-text-secondary)" }}
              >
                Dashboard
              </Link>
            )}
          </nav>
        </div>
        <div className="flex items-center gap-3">
          {loading ? (
            <div className="h-8 w-20" /> 
          ) : isLoggedIn ? (
            <div className="flex items-center gap-3">
              <span
                className="hidden text-sm sm:inline-block truncate max-w-[160px]"
                style={{ color: "var(--color-text-secondary)" }}
                title={user.email ?? ""}
              >
                {user.email}
              </span>
              <Button variant="ghost" size="sm" onClick={handleLogout}>
                Log Out
              </Button>
            </div>
          ) : (
            <>
              <Link href="/auth/login">
                <Button variant="ghost" size="sm">
                  Log In
                </Button>
              </Link>
              <Link href="/auth/signup">
                <Button variant="primary" size="sm">
                  Get Started
                </Button>
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
