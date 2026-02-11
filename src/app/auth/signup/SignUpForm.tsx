"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createBrowserClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";

export function SignUpForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [mode, setMode] = useState<"password" | "magic">("password");
  const router = useRouter();
  const supabase = createBrowserClient();

  async function handlePasswordSignUp(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setMessage(null);

    const { data, error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    });

    if (authError) {
      setError(authError.message);
    } else if (data.session) {
      // Auto-confirmed — full page nav so middleware picks up auth cookies
      window.location.href = "/dashboard";
    } else {
      setMessage("Check your email to confirm your account, then log in.");
    }
    setLoading(false);
  }

  async function handleMagicLink(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setMessage(null);

    const { error: authError } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    });

    if (authError) {
      setError(authError.message);
    } else {
      setMessage("Check your email for a confirmation link to complete sign up.");
    }
    setLoading(false);
  }

  async function handleGoogleSignUp() {
    const { error: authError } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });

    if (authError) {
      setError(authError.message);
    }
  }

  return (
    <div className="space-y-4">
      {/* Mode toggle */}
      <div className="flex rounded-lg border overflow-hidden" style={{ borderColor: "var(--color-border)" }}>
        <button
          type="button"
          onClick={() => setMode("password")}
          className="flex-1 px-3 py-2 text-xs font-medium transition-colors"
          style={{
            background: mode === "password" ? "var(--color-brand)" : "transparent",
            color: mode === "password" ? "#fff" : "var(--color-text-secondary)",
          }}
        >
          Password
        </button>
        <button
          type="button"
          onClick={() => setMode("magic")}
          className="flex-1 px-3 py-2 text-xs font-medium transition-colors"
          style={{
            background: mode === "magic" ? "var(--color-brand)" : "transparent",
            color: mode === "magic" ? "#fff" : "var(--color-text-secondary)",
          }}
        >
          Magic Link
        </button>
      </div>

      <form onSubmit={mode === "password" ? handlePasswordSignUp : handleMagicLink} className="space-y-4">
        <div>
          <label htmlFor="signup-email" className="block text-sm font-medium mb-1.5">
            Email address
          </label>
          <Input
            id="signup-email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            required
          />
        </div>
        {mode === "password" && (
          <div>
            <label htmlFor="signup-password" className="block text-sm font-medium mb-1.5">
              Password
            </label>
            <Input
              id="signup-password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Min 6 characters"
              required
              minLength={6}
            />
          </div>
        )}
        <Button type="submit" variant="primary" className="w-full" disabled={loading}>
          {loading
            ? mode === "password" ? "Creating account..." : "Sending link..."
            : mode === "password" ? "Sign Up" : "Send Magic Link"}
        </Button>
      </form>

      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t" style={{ borderColor: "var(--color-border)" }} />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span
            className="px-2 text-xs"
            style={{ background: "var(--color-bg)", color: "var(--color-text-tertiary)" }}
          >
            Or continue with
          </span>
        </div>
      </div>

      <Button type="button" variant="outline" className="w-full" onClick={handleGoogleSignUp}>
        <svg className="w-4 h-4 mr-2 inline-block" viewBox="0 0 24 24">
          <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" />
          <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
          <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
          <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
        </svg>
        Continue with Google
      </Button>

      {error && <p className="text-red-500 text-sm text-center">{error}</p>}
      {message && <p className="text-green-600 text-sm text-center">{message}</p>}
    </div>
  );
}
