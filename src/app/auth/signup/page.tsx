import type { Metadata } from "next";
import { SignUpForm } from "./SignUpForm";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Sign Up",
};

export default function SignUpPage() {
  return (
    <div className="flex min-h-[calc(100vh-var(--header-height)-200px)] items-center justify-center px-4">
      <div
        className="w-full max-w-md rounded-xl p-8 shadow-lg border"
        style={{
          background: "var(--color-bg)",
          borderColor: "var(--color-border)",
        }}
      >
        <h1 className="text-2xl font-bold text-center mb-2">
          Create your account
        </h1>
        <p
          className="text-center mb-8 text-sm"
          style={{ color: "var(--color-text-secondary)" }}
        >
          Get started with your free trial
        </p>
        <SignUpForm />
        <p
          className="text-center text-sm mt-6"
          style={{ color: "var(--color-text-secondary)" }}
        >
          Already have an account?{" "}
          <a
            href="/auth/login"
            className="font-medium hover:underline"
            style={{ color: "var(--color-brand)" }}
          >
            Log in
          </a>
        </p>
      </div>
    </div>
  );
}
