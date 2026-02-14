import type { Metadata } from "next";
import Link from "next/link";
import { Card } from "@/components/ui/Card";

export const metadata: Metadata = {
  title: "Blog — SaaS Payment Recovery Insights | RecoverKit",
  description:
    "Expert guides on failed payment recovery, dunning emails, Stripe dunning, and reducing involuntary churn for SaaS businesses.",
};

const posts = [
  {
    slug: "failed-payments-killing-saas-mrr",
    title: "How Failed Payments Are Silently Killing Your SaaS MRR",
    excerpt:
      "9% of SaaS MRR is lost to failed payments each month. Learn why it happens, how much it's costing you, and what to do about it.",
    date: "2026-02-14",
    readTime: "8 min read",
    category: "Involuntary Churn",
  },
  {
    slug: "stripe-dunning-not-enough",
    title: "Stripe Dunning: Why the Built-In Retry Isn't Enough",
    excerpt:
      "Stripe's automatic retry only recovers ~30% of failed payments. Here's why — and what you need to add for 66%+ recovery rates.",
    date: "2026-02-13",
    readTime: "7 min read",
    category: "Stripe",
  },
  {
    slug: "complete-guide-payment-recovery-2026",
    title: "The Complete Guide to SaaS Payment Recovery in 2026",
    excerpt:
      "Everything you need to know about recovering failed subscription payments: strategies, tools, timing, and email templates.",
    date: "2026-02-12",
    readTime: "12 min read",
    category: "Guide",
  },
  {
    slug: "dunning-emails-that-recover-revenue",
    title:
      "How to Write Dunning Emails That Actually Recover Revenue (With Templates)",
    excerpt:
      "Copy-paste dunning email templates that work. Learn the psychology behind effective payment recovery emails and the optimal send schedule.",
    date: "2026-02-11",
    readTime: "10 min read",
    category: "Email Templates",
  },
  {
    slug: "churnkey-vs-recoverkit",
    title:
      "Churnkey vs RecoverKit: Which Payment Recovery Tool Is Right for Your SaaS?",
    excerpt:
      "An honest comparison of Churnkey and RecoverKit — features, pricing, setup time, and who each tool is best for.",
    date: "2026-02-10",
    readTime: "9 min read",
    category: "Comparison",
  },
];

export default function BlogPage() {
  return (
    <div>
      <section className="py-20 sm:py-28">
        <div className="mx-auto max-w-[var(--max-width)] px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
              RecoverKit Blog
            </h1>
            <p
              className="mt-6 text-lg"
              style={{ color: "var(--color-text-secondary)" }}
            >
              Expert guides on payment recovery, dunning emails, and reducing
              involuntary churn for SaaS businesses.
            </p>
          </div>
        </div>
      </section>

      <section className="pb-20">
        <div className="mx-auto max-w-[var(--max-width)] px-6 lg:px-8">
          <div className="mx-auto max-w-3xl space-y-6">
            {posts.map((post) => (
              <Link
                key={post.slug}
                href={`/blog/${post.slug}`}
                className="block"
              >
                <Card className="p-6 hover:shadow-lg transition-shadow">
                  <div className="flex items-center gap-3 mb-3">
                    <span
                      className="text-xs font-semibold px-2 py-0.5 rounded-full"
                      style={{
                        background: "var(--color-brand)",
                        color: "#fff",
                      }}
                    >
                      {post.category}
                    </span>
                    <span
                      className="text-xs"
                      style={{ color: "var(--color-text-tertiary)" }}
                    >
                      {post.date} · {post.readTime}
                    </span>
                  </div>
                  <h2 className="text-xl font-semibold mb-2">{post.title}</h2>
                  <p
                    className="text-sm"
                    style={{ color: "var(--color-text-secondary)" }}
                  >
                    {post.excerpt}
                  </p>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
