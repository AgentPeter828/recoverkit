"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import type { User } from "@supabase/supabase-js";

interface UserMenuProps {
  user: User;
  onLogout: () => void;
}

function getInitials(user: User): string {
  // Try user metadata first
  const name =
    user.user_metadata?.full_name ||
    user.user_metadata?.name ||
    user.email ||
    "";
  if (!name) return "?";

  // If it's an email, use first letter
  if (name.includes("@")) return name[0].toUpperCase();

  // Otherwise get initials from name parts
  const parts = name.trim().split(/\s+/);
  if (parts.length >= 2) {
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  }
  return parts[0][0].toUpperCase();
}

function getDisplayName(user: User): string {
  return (
    user.user_metadata?.full_name ||
    user.user_metadata?.name ||
    user.email ||
    "Account"
  );
}

function getAvatarUrl(user: User): string | null {
  return (
    user.user_metadata?.avatar_url ||
    user.user_metadata?.picture ||
    null
  );
}

export function UserMenu({ user, onLogout }: UserMenuProps) {
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    if (open) {
      document.addEventListener("mousedown", handleClick);
      return () => document.removeEventListener("mousedown", handleClick);
    }
  }, [open]);

  // Close on Escape
  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    if (open) {
      document.addEventListener("keydown", handleKey);
      return () => document.removeEventListener("keydown", handleKey);
    }
  }, [open]);

  const initials = getInitials(user);
  const displayName = getDisplayName(user);
  const avatarUrl = getAvatarUrl(user);

  return (
    <div ref={menuRef} className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2.5 rounded-full py-1 pl-1 pr-3 transition-colors hover:bg-black/5 dark:hover:bg-white/10"
        aria-expanded={open}
        aria-haspopup="true"
      >
        {/* Avatar */}
        {avatarUrl ? (
          <img
            src={avatarUrl}
            alt=""
            className="h-8 w-8 rounded-full object-cover"
          />
        ) : (
          <div
            className="flex h-8 w-8 items-center justify-center rounded-full text-xs font-semibold text-white"
            style={{ background: "var(--color-brand)" }}
          >
            {initials}
          </div>
        )}
        {/* Name (hidden on mobile) */}
        <span
          className="hidden text-sm font-medium sm:inline-block truncate max-w-[140px]"
        >
          {displayName.includes("@")
            ? displayName.split("@")[0]
            : displayName}
        </span>
        {/* Chevron */}
        <svg
          className={`h-4 w-4 transition-transform ${open ? "rotate-180" : ""}`}
          style={{ color: "var(--color-text-secondary)" }}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>

      {/* Dropdown */}
      {open && (
        <div
          className="absolute right-0 top-full mt-2 w-64 rounded-xl border shadow-lg overflow-hidden"
          style={{
            background: "var(--color-bg)",
            borderColor: "var(--color-border)",
          }}
        >
          {/* User info header */}
          <div
            className="px-4 py-3 border-b"
            style={{ borderColor: "var(--color-border)" }}
          >
            <p className="text-sm font-semibold truncate">{displayName}</p>
            {!displayName.includes("@") && user.email && (
              <p
                className="text-xs truncate mt-0.5"
                style={{ color: "var(--color-text-secondary)" }}
              >
                {user.email}
              </p>
            )}
          </div>

          {/* Menu items */}
          <div className="py-1">
            <MenuLink
              href="/dashboard/settings"
              icon={
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.066 2.573c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.573 1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.066-2.573c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                />
              }
              label="Settings"
              onClick={() => setOpen(false)}
            />
          </div>

          {/* Logout */}
          <div
            className="border-t py-1"
            style={{ borderColor: "var(--color-border)" }}
          >
            <button
              onClick={() => {
                setOpen(false);
                onLogout();
              }}
              className="flex w-full items-center gap-3 px-4 py-2.5 text-sm transition-colors hover:bg-black/5 dark:hover:bg-white/10"
              style={{ color: "var(--color-text-secondary)" }}
            >
              <svg
                className="h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                />
              </svg>
              Log out
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function MenuLink({
  href,
  icon,
  label,
  onClick,
}: {
  href: string;
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
}) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className="flex items-center gap-3 px-4 py-2.5 text-sm transition-colors hover:bg-black/5 dark:hover:bg-white/10"
    >
      <svg
        className="h-4 w-4"
        style={{ color: "var(--color-text-secondary)" }}
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={2}
      >
        {icon}
      </svg>
      {label}
    </Link>
  );
}
