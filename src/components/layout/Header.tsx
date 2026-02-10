"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/Button";

const appName = process.env.NEXT_PUBLIC_APP_NAME || "Firestorm App";

const navLinks = [
  { href: "/pricing", label: "Pricing" },
  { href: "/#features", label: "Features" },
];

export function Header() {
  const pathname = usePathname();
  const isDashboard = pathname?.startsWith("/dashboard");

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
          {!isDashboard && (
            <nav className="hidden items-center gap-6 sm:flex">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-sm transition-colors hover:opacity-70"
                  style={{ color: "var(--color-text-secondary)" }}
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          )}
        </div>
        <div className="flex items-center gap-3">
          {isDashboard ? (
            <Link href="/auth/login">
              <Button variant="ghost" size="sm">
                Log Out
              </Button>
            </Link>
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
