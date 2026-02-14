import Link from "next/link";

const appName = process.env.NEXT_PUBLIC_APP_NAME || "Firestorm App";

const footerLinks = [
  {
    title: "Product",
    links: [
      { href: "/pricing", label: "Pricing" },
      { href: "/#features", label: "Features" },
      { href: "/roi", label: "ROI Calculator" },
      { href: "/templates", label: "Email Templates" },
      { href: "/dashboard", label: "Dashboard" },
    ],
  },
  {
    title: "Compare",
    links: [
      { href: "/alternatives/churnkey", label: "vs Churnkey" },
      { href: "/alternatives/baremetrics", label: "vs Baremetrics" },
      { href: "/alternatives/stripe-dunning", label: "vs Stripe Dunning" },
      { href: "/alternatives/gravy", label: "vs Gravy" },
      { href: "/alternatives", label: "All Comparisons" },
    ],
  },
  {
    title: "Resources",
    links: [
      { href: "/blog", label: "Blog" },
      { href: "/docs", label: "Developer Docs" },
      { href: "/guides/switching", label: "Switching Guide" },
    ],
  },
  {
    title: "Legal",
    links: [
      { href: "/privacy", label: "Privacy Policy" },
      { href: "/terms", label: "Terms of Service" },
    ],
  },
];

export function Footer() {
  return (
    <footer
      className="border-t"
      style={{
        borderColor: "var(--color-border)",
        background: "var(--color-bg-secondary)",
      }}
    >
      <div className="mx-auto max-w-[var(--max-width)] px-6 py-12 lg:px-8">
        <div className="grid grid-cols-2 gap-8 sm:grid-cols-5">
          <div>
            <h3 className="text-sm font-semibold">{appName}</h3>
            <p
              className="mt-2 text-sm"
              style={{ color: "var(--color-text-secondary)" }}
            >
              The modern SaaS platform for building fast.
            </p>
          </div>
          {footerLinks.map((section) => (
            <div key={section.title}>
              <h3 className="text-sm font-semibold">{section.title}</h3>
              <ul className="mt-2 space-y-2">
                {section.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm transition-colors hover:opacity-70"
                      style={{ color: "var(--color-text-secondary)" }}
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div
          className="mt-12 border-t pt-8 text-center text-sm"
          style={{
            borderColor: "var(--color-border)",
            color: "var(--color-text-tertiary)",
          }}
        >
          © {new Date().getFullYear()} {appName}. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
