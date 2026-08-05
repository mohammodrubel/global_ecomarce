import {
  ShieldCheck,
  Calendar,
  Mail,
  Database,
  Share2,
  Lock,
  UserCheck,
  Cookie,
  Bell,
} from "lucide-react";
import Link from "next/link";

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "How RocksMart collects, uses, stores, and protects your personal information. Cookies, data sharing, and your rights.",
  keywords: [
    "privacy policy",
    "data protection",
    "cookies",
    "GDPR",
    "RocksMart privacy",
  ],
  alternates: { canonical: "/privacy" },
  openGraph: {
    title: "Privacy Policy | RocksMart",
    description: "How we collect, use, and protect your data.",
    url: "/privacy",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "Privacy Policy | RocksMart",
    description: "How we collect, use, and protect your data.",
  },
};

const HIGHLIGHTS = [
  {
    icon: Database,
    title: "Data We Collect",
    text: "Only what we need to serve you — nothing more.",
  },
  {
    icon: Lock,
    title: "How We Protect It",
    text: "Industry-standard encryption and strict access controls.",
  },
  {
    icon: UserCheck,
    title: "Your Rights",
    text: "Access, correct, or delete your data anytime.",
  },
  {
    icon: Share2,
    title: "Who We Share With",
    text: "Only trusted partners essential to delivering our service.",
  },
];

const SECTIONS = [
  {
    id: "intro",
    icon: ShieldCheck,
    title: "1. Introduction",
    body: (
      <>
        RocksMart (&quot;we&quot;, &quot;us&quot;, &quot;our&quot;) respects
        your privacy and is committed to protecting your personal data. This
        Privacy Policy explains how we collect, use, share, and safeguard
        information when you use our website, mobile applications, and
        services.
      </>
    ),
  },
  {
    id: "collection",
    icon: Database,
    title: "2. Information We Collect",
    body: (
      <>
        <p className="mb-3">We collect the following categories of data:</p>
        <ul className="ml-5 list-disc space-y-2">
          <li>
            <strong className="text-slate-900">Account data:</strong> name,
            email, phone, password, shipping and billing addresses.
          </li>
          <li>
            <strong className="text-slate-900">Order data:</strong> products
            purchased, order history, payment method (tokenized).
          </li>
          <li>
            <strong className="text-slate-900">Device data:</strong> IP
            address, browser type, device identifiers, operating system.
          </li>
          <li>
            <strong className="text-slate-900">Usage data:</strong> pages
            viewed, clicks, search queries, session duration.
          </li>
        </ul>
      </>
    ),
  },
  {
    id: "use",
    icon: UserCheck,
    title: "3. How We Use Your Data",
    body: (
      <>
        <p className="mb-3">We use your information to:</p>
        <ul className="ml-5 list-disc space-y-2">
          <li>Process and deliver your orders.</li>
          <li>Provide customer support and respond to inquiries.</li>
          <li>Personalize product recommendations and improve UX.</li>
          <li>Send transactional emails and, with consent, marketing.</li>
          <li>Prevent fraud, abuse, and unauthorized activity.</li>
          <li>Comply with legal and regulatory obligations.</li>
        </ul>
      </>
    ),
  },
  {
    id: "sharing",
    icon: Share2,
    title: "4. Sharing Your Data",
    body: (
      <>
        We do not sell your personal data. We share information only with:
        payment processors, shipping and logistics providers, cloud
        infrastructure vendors, analytics services, and law enforcement when
        legally required. All partners are contractually bound to protect
        your data.
      </>
    ),
  },
  {
    id: "cookies",
    icon: Cookie,
    title: "5. Cookies & Tracking",
    body: (
      <>
        We use cookies and similar technologies for authentication, cart
        persistence, analytics, and personalization. You can control cookies
        through your browser settings, though disabling some may limit
        functionality.
      </>
    ),
  },
  {
    id: "security",
    icon: Lock,
    title: "6. Data Security",
    body: (
      <>
        We employ TLS encryption in transit, encryption at rest, hashed
        passwords, restricted internal access, and regular security audits. No
        method is 100% secure, but we continuously invest in strong safeguards.
      </>
    ),
  },
  {
    id: "rights",
    icon: UserCheck,
    title: "7. Your Rights",
    body: (
      <>
        Depending on your jurisdiction, you have the right to access, correct,
        delete, or export your data; withdraw consent; object to processing;
        and lodge a complaint with a supervisory authority. Contact us at{" "}
        <a
          href="mailto:privacy@rocksmart.com"
          className="font-medium text-[#1C398E] underline"
        >
          privacy@rocksmart.com
        </a>{" "}
        to exercise these rights.
      </>
    ),
  },
  {
    id: "retention",
    icon: Database,
    title: "8. Data Retention",
    body: (
      <>
        We retain personal data only as long as necessary for the purposes
        outlined here or as required by law. Order records are typically kept
        for 7 years for tax and compliance purposes.
      </>
    ),
  },
  {
    id: "children",
    icon: ShieldCheck,
    title: "9. Children's Privacy",
    body: (
      <>
        RocksMart is not directed to children under 16. We do not knowingly
        collect data from children. If you believe a child has provided us
        with data, contact us and we will delete it.
      </>
    ),
  },
  {
    id: "changes",
    icon: Bell,
    title: "10. Changes to This Policy",
    body: (
      <>
        We may update this Policy periodically. Material changes will be
        communicated via email or a prominent notice on our site. The
        &quot;Effective&quot; date at the top indicates the latest revision.
      </>
    ),
  },
  {
    id: "contact",
    icon: Mail,
    title: "11. Contact Us",
    body: (
      <>
        Questions? Reach our Data Protection Officer at{" "}
        <a
          href="mailto:privacy@rocksmart.com"
          className="font-medium text-[#1C398E] underline"
        >
          privacy@rocksmart.com
        </a>
        .
      </>
    ),
  },
];

export default function PrivacyPolicyPage() {
  return (
    <main className="bg-white">
      {/* Hero */}
      <section className="border-b border-slate-100 bg-gradient-to-br from-[#1C398E] to-[#152B6E] text-white">
        <div className="container mx-auto px-4 py-16 md:py-20">
          <div className="mx-auto max-w-3xl text-center">
            <div className="mx-auto mb-6 inline-flex h-14 w-14 items-center justify-center rounded-xl bg-white/10 backdrop-blur-sm">
              <ShieldCheck className="h-7 w-7" />
            </div>
            <h1 className="text-4xl font-extrabold md:text-5xl">
              Privacy Policy
            </h1>
            <p className="mt-4 text-white/80">
              Your privacy is fundamental. Here&apos;s how we handle your data.
            </p>
            <div className="mt-6 inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-1.5 text-sm backdrop-blur-sm">
              <Calendar className="h-4 w-4" />
              Effective: January 1, 2026
            </div>
          </div>
        </div>
      </section>

      {/* Highlights */}
      <section className="container mx-auto px-4 py-12">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {HIGHLIGHTS.map((h) => (
            <div
              key={h.title}
              className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:border-[#1C398E]/30 hover:shadow-md"
            >
              <div className="mb-3 inline-flex h-10 w-10 items-center justify-center rounded-lg bg-[#1C398E]/10 text-[#1C398E]">
                <h.icon className="h-5 w-5" />
              </div>
              <h3 className="text-sm font-bold text-slate-900">{h.title}</h3>
              <p className="mt-1 text-xs leading-relaxed text-slate-600">
                {h.text}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Content */}
      <section className="container mx-auto px-4 pb-16">
        <div className="grid gap-10 lg:grid-cols-4">
          {/* TOC */}
          <aside className="lg:col-span-1">
            <div className="sticky top-24 rounded-2xl border border-slate-200 bg-slate-50/50 p-5">
              <h3 className="mb-4 text-sm font-bold uppercase tracking-wider text-slate-900">
                Contents
              </h3>
              <nav>
                <ul className="space-y-2">
                  {SECTIONS.map((s) => (
                    <li key={s.id}>
                      <a
                        href={`#${s.id}`}
                        className="block text-sm text-slate-600 transition hover:text-[#1C398E]"
                      >
                        {s.title}
                      </a>
                    </li>
                  ))}
                </ul>
              </nav>
            </div>
          </aside>

          {/* Body */}
          <article className="lg:col-span-3">
            <div className="space-y-10">
              {SECTIONS.map((s) => (
                <section key={s.id} id={s.id} className="scroll-mt-24">
                  <div className="mb-4 flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#1C398E]/10 text-[#1C398E]">
                      <s.icon className="h-5 w-5" />
                    </div>
                    <h2 className="text-xl font-bold text-slate-900 md:text-2xl">
                      {s.title}
                    </h2>
                  </div>
                  <div className="leading-relaxed text-slate-600">
                    {s.body}
                  </div>
                </section>
              ))}
            </div>

            {/* Contact card */}
            <div className="mt-12 rounded-2xl bg-gradient-to-br from-[#1C398E] to-[#152B6E] p-8 text-white">
              <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-white/10">
                  <Mail className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="text-lg font-bold">
                    Contact our Privacy Team
                  </h3>
                  <p className="mt-1 text-sm text-white/80">
                    We respond to all data requests within 30 days.
                  </p>
                  <Link
                    href="mailto:privacy@rocksmart.com"
                    className="mt-3 inline-flex text-sm font-semibold underline underline-offset-4"
                  >
                    privacy@rocksmart.com
                  </Link>
                </div>
              </div>
            </div>
          </article>
        </div>
      </section>
    </main>
  );
}
