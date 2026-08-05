import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  RefreshCcw,
  CheckCircle2,
  XCircle,
  Clock,
  Package,
  CreditCard,
  Mail,
  FileText,
  ShieldCheck,
  ArrowRight,
} from "lucide-react";
import Link from "next/link";

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Returns & Refunds",
  description:
    "RocksMart 14-day return policy, refund process, eligible items, and how to request a return online.",
  keywords: [
    "returns",
    "refunds",
    "return policy",
    "money back",
    "RocksMart returns",
  ],
  alternates: { canonical: "/returns" },
  openGraph: {
    title: "Returns & Refunds | RocksMart",
    description: "14-day return policy and refund process.",
    url: "/returns",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "Returns & Refunds | RocksMart",
    description: "14-day return policy and refund process.",
  },
};

const HIGHLIGHTS = [
  {
    icon: Clock,
    title: "14 Days",
    desc: "Return window from delivery date",
  },
  {
    icon: RefreshCcw,
    title: "Free Returns",
    desc: "On eligible items nationwide",
  },
  {
    icon: CreditCard,
    title: "7–10 Days",
    desc: "Refund to original payment method",
  },
  {
    icon: ShieldCheck,
    title: "Buyer Protected",
    desc: "Full refund if item damaged or wrong",
  },
];

const STEPS = [
  {
    icon: Mail,
    title: "Request Return",
    desc: "Sign in and go to Order History → Return Item. Or contact support.",
  },
  {
    icon: FileText,
    title: "Get Return Label",
    desc: "We'll email a prepaid shipping label within 24 hours.",
  },
  {
    icon: Package,
    title: "Ship Item Back",
    desc: "Pack in original packaging and drop at any courier point.",
  },
  {
    icon: CreditCard,
    title: "Receive Refund",
    desc: "Refund processed within 7–10 business days after we receive item.",
  },
];

const ELIGIBLE = [
  "Unused items in original packaging",
  "Items with tags and labels intact",
  "Wrong item delivered",
  "Damaged or defective on arrival",
  "Items returned within 14 days",
];

const NOT_ELIGIBLE = [
  "Used, worn, or washed items",
  "Personalized or custom-made products",
  "Perishable goods (food, plants)",
  "Intimate items and cosmetics (opened)",
  "Digital downloads and gift cards",
];

export default function ReturnsPage() {
  return (
    <main className="bg-white">
      {/* Hero */}
      <section className="border-b border-slate-100 bg-gradient-to-br from-[#1C398E] to-[#152B6E] text-white">
        <div className="container mx-auto px-4 py-16 md:py-20">
          <div className="mx-auto max-w-3xl text-center">
            <div className="mx-auto mb-6 inline-flex h-14 w-14 items-center justify-center rounded-xl bg-white/10 backdrop-blur-sm">
              <RefreshCcw className="h-7 w-7" />
            </div>
            <h1 className="text-4xl font-extrabold md:text-5xl">
              Returns & Refunds
            </h1>
            <p className="mt-4 text-white/80">
              Not what you expected? No worries. We&apos;ve got you covered.
            </p>
          </div>
        </div>
      </section>

      {/* Highlights */}
      <section className="container mx-auto px-4 py-12">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {HIGHLIGHTS.map((h) => (
            <div
              key={h.title}
              className="rounded-2xl border border-slate-200 bg-white p-6 text-center shadow-sm transition hover:border-[#1C398E]/30 hover:shadow-md"
            >
              <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-[#1C398E]/10 text-[#1C398E]">
                <h.icon className="h-6 w-6" />
              </div>
              <p className="text-2xl font-extrabold text-[#1C398E]">
                {h.title}
              </p>
              <p className="mt-1 text-xs text-slate-600">{h.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Process */}
      <section className="container mx-auto px-4 py-12">
        <div className="mx-auto mb-10 max-w-2xl text-center">
          <span className="text-sm font-semibold uppercase tracking-wider text-[#1C398E]">
            Return Process
          </span>
          <h2 className="mt-2 text-3xl font-bold text-slate-900 md:text-4xl">
            Return in 4 easy steps
          </h2>
        </div>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {STEPS.map((s, i) => (
            <Card
              key={s.title}
              className="relative border-slate-200 shadow-sm transition hover:-translate-y-1 hover:border-[#1C398E]/30 hover:shadow-lg"
            >
              <CardContent className="p-6">
                <div className="mb-4 flex items-center justify-between">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#1C398E]/10 text-[#1C398E]">
                    <s.icon className="h-6 w-6" />
                  </div>
                  <span className="text-4xl font-extrabold text-slate-100">
                    {i + 1}
                  </span>
                </div>
                <h3 className="font-bold text-slate-900">{s.title}</h3>
                <p className="mt-2 text-sm text-slate-600">{s.desc}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Eligibility */}
      <section className="bg-slate-50/50">
        <div className="container mx-auto px-4 py-16">
          <div className="mx-auto mb-10 max-w-2xl text-center">
            <span className="text-sm font-semibold uppercase tracking-wider text-[#1C398E]">
              Return Eligibility
            </span>
            <h2 className="mt-2 text-3xl font-bold text-slate-900 md:text-4xl">
              What can be returned?
            </h2>
          </div>
          <div className="mx-auto grid max-w-4xl gap-6 md:grid-cols-2">
            <Card className="border-emerald-200 bg-emerald-50/50 shadow-sm">
              <CardContent className="p-6">
                <div className="mb-4 flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500 text-white">
                    <CheckCircle2 className="h-5 w-5" />
                  </div>
                  <h3 className="text-lg font-bold text-emerald-900">
                    Eligible for Return
                  </h3>
                </div>
                <ul className="space-y-3">
                  {ELIGIBLE.map((item) => (
                    <li
                      key={item}
                      className="flex items-start gap-2 text-sm text-emerald-900"
                    >
                      <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" />
                      {item}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            <Card className="border-red-200 bg-red-50/50 shadow-sm">
              <CardContent className="p-6">
                <div className="mb-4 flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-500 text-white">
                    <XCircle className="h-5 w-5" />
                  </div>
                  <h3 className="text-lg font-bold text-red-900">
                    Not Returnable
                  </h3>
                </div>
                <ul className="space-y-3">
                  {NOT_ELIGIBLE.map((item) => (
                    <li
                      key={item}
                      className="flex items-start gap-2 text-sm text-red-900"
                    >
                      <XCircle className="mt-0.5 h-4 w-4 shrink-0 text-red-600" />
                      {item}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Refund details */}
      <section className="container mx-auto px-4 py-16">
        <div className="mx-auto max-w-4xl">
          <div className="mb-10 text-center">
            <span className="text-sm font-semibold uppercase tracking-wider text-[#1C398E]">
              Refund Details
            </span>
            <h2 className="mt-2 text-3xl font-bold text-slate-900 md:text-4xl">
              How refunds work
            </h2>
          </div>
          <div className="space-y-4">
            <Card className="border-slate-200 shadow-sm">
              <CardContent className="p-6">
                <h3 className="mb-2 font-bold text-slate-900">
                  Original Payment Method
                </h3>
                <p className="text-sm leading-relaxed text-slate-600">
                  Refunds are issued to the payment method used at checkout.
                  Credit/debit cards: 7–10 business days. Mobile banking
                  (bKash, Nagad): 3–5 business days. Cash on delivery: refund
                  via bank transfer.
                </p>
              </CardContent>
            </Card>
            <Card className="border-slate-200 shadow-sm">
              <CardContent className="p-6">
                <h3 className="mb-2 font-bold text-slate-900">
                  Shipping Fees
                </h3>
                <p className="text-sm leading-relaxed text-slate-600">
                  Original shipping fees are non-refundable unless the return
                  is due to our error (wrong or damaged item). Return shipping
                  is free for eligible returns.
                </p>
              </CardContent>
            </Card>
            <Card className="border-slate-200 shadow-sm">
              <CardContent className="p-6">
                <h3 className="mb-2 font-bold text-slate-900">Exchanges</h3>
                <p className="text-sm leading-relaxed text-slate-600">
                  Prefer an exchange? Request one at the same time as your
                  return. Subject to availability. If not available, we&apos;ll
                  issue a full refund.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="container mx-auto px-4 pb-20">
        <div className="rounded-3xl bg-gradient-to-br from-[#1C398E] to-[#152B6E] p-10 text-center text-white shadow-xl">
          <h2 className="text-3xl font-bold md:text-4xl">
            Ready to start a return?
          </h2>
          <p className="mt-3 text-white/80">
            Head to your order history or reach out to our team.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link href="/account/orders">
              <Button
                size="lg"
                className="bg-white text-[#1C398E] hover:bg-white/90"
              >
                My Orders
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
            <Link href="/contact">
              <Button
                size="lg"
                variant="outline"
                className="border-white/40 bg-transparent text-white hover:bg-white/10 hover:text-white"
              >
                Contact Support
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
