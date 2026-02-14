import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";

interface BlogPostProps {
  title: string;
  date: string;
  readTime: string;
  category: string;
  children: React.ReactNode;
}

export function BlogPost({ title, date, readTime, category, children }: BlogPostProps) {
  return (
    <div>
      <article className="py-20">
        <div className="mx-auto max-w-[var(--max-width)] px-6 lg:px-8">
          <div className="mx-auto max-w-3xl">
            <div className="mb-8">
              <Link
                href="/blog"
                className="text-sm hover:opacity-70 transition-opacity"
                style={{ color: "var(--color-brand)" }}
              >
                ← Back to Blog
              </Link>
            </div>
            <div className="flex items-center gap-3 mb-4">
              <span
                className="text-xs font-semibold px-2 py-0.5 rounded-full"
                style={{ background: "var(--color-brand)", color: "#fff" }}
              >
                {category}
              </span>
              <span
                className="text-xs"
                style={{ color: "var(--color-text-tertiary)" }}
              >
                {date} · {readTime}
              </span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold tracking-tight mb-8">
              {title}
            </h1>
            <div
              className="prose prose-lg max-w-none"
              style={{ color: "var(--color-text)" }}
            >
              {children}
            </div>
          </div>
        </div>
      </article>

      {/* CTA */}
      <section
        className="py-16"
        style={{ background: "var(--color-bg-secondary)" }}
      >
        <div className="mx-auto max-w-[var(--max-width)] px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-2xl font-bold">
              Stop losing revenue to failed payments
            </h2>
            <p
              className="mt-3 text-lg"
              style={{ color: "var(--color-text-secondary)" }}
            >
              RecoverKit uses AI-powered dunning emails and smart retry logic to
              recover 66% of failed payments. Start free.
            </p>
            <div className="mt-6 flex items-center justify-center gap-4">
              <Link href="/auth/signup">
                <Button variant="primary" size="lg">
                  Start Recovering Revenue →
                </Button>
              </Link>
              <Link href="/roi">
                <Button variant="outline" size="lg">
                  Calculate Your ROI
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
