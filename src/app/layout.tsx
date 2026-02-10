import type { Metadata } from "next";
import { PlausibleProvider } from "@/components/analytics/PlausibleProvider";
import { PostHogProvider } from "@/components/analytics/PostHogProvider";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import "./globals.css";

const appName = process.env.NEXT_PUBLIC_APP_NAME || "Firestorm App";
const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

export const metadata: Metadata = {
  title: {
    default: appName,
    template: `%s | ${appName}`,
  },
  description: `${appName} — Your modern SaaS platform.`,
  metadataBase: new URL(appUrl),
  openGraph: {
    title: appName,
    description: `${appName} — Your modern SaaS platform.`,
    url: appUrl,
    siteName: appName,
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: appName,
    description: `${appName} — Your modern SaaS platform.`,
    images: ["/og-image.png"],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <PlausibleProvider />
      </head>
      <body className="min-h-screen flex flex-col antialiased">
        <PostHogProvider>
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
        </PostHogProvider>
      </body>
    </html>
  );
}
