import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";
import GlobalProvider from "@/components/provider/GlobalProvider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
const siteName = "RocksMart";
const siteDescription =
  "RocksMart — your one-stop online shopping destination for fashion, electronics, home essentials, and more. Fast delivery, secure payment, verified brands.";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: `${siteName} — Online Shopping for Fashion, Electronics & More`,
    template: `%s | ${siteName}`,
  },
  description: siteDescription,
  applicationName: siteName,
  generator: "Next.js",
  keywords: [
    "online shopping",
    "ecommerce",
    "fashion",
    "electronics",
    "home decor",
    "best deals",
    "RocksMart",
    "buy online",
    "free shipping",
    "verified brands",
  ],
  authors: [{ name: siteName }],
  creator: siteName,
  publisher: siteName,
  referrer: "origin-when-cross-origin",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: siteUrl,
    siteName,
    title: `${siteName} — Online Shopping for Fashion, Electronics & More`,
    description: siteDescription,
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: `${siteName} — Online Shopping`,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: `${siteName} — Online Shopping`,
    description: siteDescription,
    images: ["/og-image.png"],
    creator: "@rocksmart",
  },
  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
  manifest: "/manifest.webmanifest",
  category: "shopping",
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#0a0a0a" },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const orgJsonLd = {
    "@context": "https://schema.org",
    "@type": "OnlineStore",
    name: siteName,
    url: siteUrl,
    logo: `${siteUrl}/logo.png`,
    description: siteDescription,
    sameAs: [
      "https://facebook.com/rocksmart",
      "https://twitter.com/rocksmart",
      "https://instagram.com/rocksmart",
    ],
    potentialAction: {
      "@type": "SearchAction",
      target: `${siteUrl}/shop?search={search_term_string}`,
      "query-input": "required name=search_term_string",
    },
  };

  return (
    <html lang="en">
      <body className={`${geistSans.variable} antialiased`}>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(orgJsonLd) }}
        />
        <GlobalProvider>{children}</GlobalProvider>
      </body>
    </html>
  );
}
