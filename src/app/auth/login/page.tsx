import type { Metadata } from "next";
import { LoginForm } from "./LoginForm";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Log In",
};

export default function LoginPage() {
  return (
    <div className="flex min-h-[calc(100vh-var(--header-height)-200px)] items-center justify-center px-4">
      <div
        className="w-full max-w-md rounded-xl p-8 shadow-lg border"
        style={{
          background: "var(--color-bg)",
          borderColor: "var(--color-border)",
        }}
      >
        <h1 className="text-2xl font-bold text-center mb-2">Welcome back</h1>
        <p
          className="text-center mb-8 text-sm"
          style={{ color: "var(--color-text-secondary)" }}
        >
          Log in to your account to continue
        </p>
        <LoginForm />
        <p
          className="text-center text-sm mt-6"
          style={{ color: "var(--color-text-secondary)" }}
        >
          Don&apos;t have an account?{" "}
          <a
            href="/auth/signup"
            className="font-medium hover:underline"
            style={{ color: "var(--color-brand)" }}
          >
            Sign up
          </a>
        </p>
      </div>
    </div>
  );
}
