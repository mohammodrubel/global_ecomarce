import { FileText, Calendar, Mail } from "lucide-react";
import Link from "next/link";

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Service",
  description:
    "Read the RocksMart Terms of Service — the rules and guidelines for using our marketplace, purchases, accounts, and content.",
  keywords: ["terms of service", "user agreement", "RocksMart terms", "legal"],
  alternates: { canonical: "/terms" },
  openGraph: {
    title: "Terms of Service | RocksMart",
    description: "Rules and guidelines for using RocksMart.",
    url: "/terms",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "Terms of Service | RocksMart",
    description: "Rules and guidelines for using RocksMart.",
  },
};

const SECTIONS = [
  {
    id: "acceptance",
    title: "1. Acceptance of Terms",
    body: (
      <>
        By accessing or using RocksMart, you agree to be bound by these Terms
        of Service and our Privacy Policy. If you do not agree, please do not
        use our services. These Terms apply to all visitors, users, and others
        who access the platform.
      </>
    ),
  },
  {
    id: "eligibility",
    title: "2. Eligibility",
    body: (
      <>
        You must be at least 18 years old, or the age of majority in your
        jurisdiction, to create an account and make purchases. By using the
        service, you represent and warrant that you meet these requirements.
      </>
    ),
  },
  {
    id: "account",
    title: "3. Account Registration",
    body: (
      <>
        You are responsible for maintaining the confidentiality of your account
        credentials and for all activities that occur under your account. You
        agree to notify us immediately of any unauthorized use. We reserve the
        right to suspend or terminate accounts that violate these Terms.
      </>
    ),
  },
  {
    id: "orders",
    title: "4. Orders & Payments",
    body: (
      <>
        All orders are subject to acceptance and availability. Prices are
        listed in the currency displayed at checkout and may change without
        notice. Payment must be received in full before order fulfillment. We
        accept major credit cards and other payment methods listed at
        checkout.
      </>
    ),
  },
  {
    id: "shipping",
    title: "5. Shipping & Delivery",
    body: (
      <>
        Delivery times are estimates and not guaranteed. Risk of loss passes to
        you upon delivery to the carrier. Shipping fees, taxes, and customs
        duties are the responsibility of the buyer unless stated otherwise.
      </>
    ),
  },
  {
    id: "returns",
    title: "6. Returns & Refunds",
    body: (
      <>
        Products may be returned within 14 days of delivery, provided they are
        unused and in original packaging. Refunds are processed within 7–10
        business days to the original payment method. Certain items — such as
        personalized or perishable goods — are non-returnable.
      </>
    ),
  },
  {
    id: "conduct",
    title: "7. User Conduct",
    body: (
      <>
        You agree not to use the service for any unlawful purpose, to harass
        other users, to post false or misleading content, or to interfere with
        the operation of the platform. Violation may result in suspension or
        legal action.
      </>
    ),
  },
  {
    id: "ip",
    title: "8. Intellectual Property",
    body: (
      <>
        All content on RocksMart — including logos, text, images, and
        software — is owned by RocksMart or its licensors and is protected by
        copyright and trademark laws. You may not reproduce, distribute, or
        create derivative works without express written permission.
      </>
    ),
  },
  {
    id: "liability",
    title: "9. Limitation of Liability",
    body: (
      <>
        RocksMart is not liable for indirect, incidental, or consequential
        damages arising from use of the service. Our total liability shall not
        exceed the amount paid by you in the 12 months preceding the claim.
      </>
    ),
  },
  {
    id: "changes",
    title: "10. Changes to Terms",
    body: (
      <>
        We may modify these Terms at any time. Changes are effective when
        posted on this page. Your continued use of the service after changes
        constitutes acceptance of the revised Terms.
      </>
    ),
  },
  {
    id: "law",
    title: "11. Governing Law",
    body: (
      <>
        These Terms are governed by the laws of the jurisdiction in which
        RocksMart is headquartered, without regard to conflict of law
        principles. Any disputes shall be resolved in the competent courts of
        that jurisdiction.
      </>
    ),
  },
  {
    id: "contact",
    title: "12. Contact Us",
    body: (
      <>
        For questions about these Terms, contact us at{" "}
        <a
          href="mailto:legal@rocksmart.com"
          className="font-medium text-[#1C398E] underline"
        >
          legal@rocksmart.com
        </a>
        .
      </>
    ),
  },
];

export default function TermsPage() {
  return (
    <main className="bg-white">
      {/* Hero */}
      <section className="border-b border-slate-100 bg-gradient-to-br from-[#1C398E] to-[#152B6E] text-white">
        <div className="container mx-auto px-4 py-16 md:py-20">
          <div className="mx-auto max-w-3xl text-center">
            <div className="mx-auto mb-6 inline-flex h-14 w-14 items-center justify-center rounded-xl bg-white/10 backdrop-blur-sm">
              <FileText className="h-7 w-7" />
            </div>
            <h1 className="text-4xl font-extrabold md:text-5xl">
              Terms of Service
            </h1>
            <p className="mt-4 text-white/80">
              Please read these terms carefully before using RocksMart.
            </p>
            <div className="mt-6 inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-1.5 text-sm backdrop-blur-sm">
              <Calendar className="h-4 w-4" />
              Effective: January 1, 2026
            </div>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="container mx-auto px-4 py-12 md:py-16">
        <div className="grid gap-10 lg:grid-cols-4">
          {/* TOC */}
          <aside className="lg:col-span-1">
            <div className="sticky top-24 rounded-2xl border border-slate-200 bg-slate-50/50 p-5">
              <h3 className="mb-4 text-sm font-bold uppercase tracking-wider text-slate-900">
                On this page
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
            <div className="mb-8 rounded-2xl border border-[#1C398E]/20 bg-[#1C398E]/5 p-5">
              <p className="text-sm leading-relaxed text-slate-700">
                Welcome to RocksMart. These Terms of Service (&quot;Terms&quot;)
                govern your access to and use of the RocksMart website, mobile
                applications, and services. By using our platform, you agree to
                these Terms.
              </p>
            </div>

            <div className="space-y-10">
              {SECTIONS.map((s) => (
                <section key={s.id} id={s.id} className="scroll-mt-24">
                  <h2 className="mb-3 text-xl font-bold text-slate-900 md:text-2xl">
                    {s.title}
                  </h2>
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
                  <h3 className="text-lg font-bold">Have questions?</h3>
                  <p className="mt-1 text-sm text-white/80">
                    Our legal team is here to help clarify anything.
                  </p>
                  <Link
                    href="mailto:legal@rocksmart.com"
                    className="mt-3 inline-flex text-sm font-semibold underline underline-offset-4"
                  >
                    legal@rocksmart.com
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
