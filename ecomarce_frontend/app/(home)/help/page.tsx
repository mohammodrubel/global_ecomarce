import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Search,
  Package,
  Truck,
  RefreshCcw,
  CreditCard,
  User,
  ShieldCheck,
  HelpCircle,
  MessageSquare,
  Mail,
  Phone,
  ArrowRight,
} from "lucide-react";
import Link from "next/link";

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Help Center",
  description:
    "Find answers, guides, and support for everything RocksMart — orders, shipping, returns, account, payments, and more.",
  keywords: [
    "help center",
    "customer support",
    "RocksMart help",
    "order help",
    "shipping help",
    "return help",
  ],
  alternates: { canonical: "/help" },
  openGraph: {
    title: "Help Center | RocksMart",
    description: "Answers, guides, and support for RocksMart shoppers.",
    url: "/help",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "Help Center | RocksMart",
    description: "Answers, guides, and support for RocksMart shoppers.",
  },
};

const CATEGORIES = [
  {
    icon: Package,
    title: "Orders",
    desc: "Placing, editing, and canceling orders",
    href: "/faq#orders",
    color: "from-blue-500 to-indigo-500",
  },
  {
    icon: Truck,
    title: "Shipping",
    desc: "Delivery times, zones, and tracking",
    href: "/shipping",
    color: "from-emerald-500 to-teal-500",
  },
  {
    icon: RefreshCcw,
    title: "Returns & Refunds",
    desc: "Return policy and refund process",
    href: "/returns",
    color: "from-orange-500 to-amber-500",
  },
  {
    icon: CreditCard,
    title: "Payments",
    desc: "Accepted methods and payment issues",
    href: "/faq#payments",
    color: "from-purple-500 to-pink-500",
  },
  {
    icon: User,
    title: "My Account",
    desc: "Registration, login, and profile",
    href: "/faq#account",
    color: "from-cyan-500 to-sky-500",
  },
  {
    icon: ShieldCheck,
    title: "Security & Privacy",
    desc: "Data protection and account safety",
    href: "/privacy-policy",
    color: "from-rose-500 to-red-500",
  },
];

const POPULAR = [
  { q: "How do I track my order?", href: "/track-order" },
  { q: "What is your return policy?", href: "/returns" },
  { q: "How long does shipping take?", href: "/shipping" },
  { q: "How do I change my password?", href: "/faq#account" },
  { q: "Do you offer cash on delivery?", href: "/faq#payments" },
  { q: "Can I cancel my order?", href: "/faq#orders" },
];

export default function HelpCenterPage() {
  return (
    <main className="bg-white">
      {/* Hero + search */}
      <section className="relative overflow-hidden bg-gradient-to-br from-[#1C398E] via-[#1C398E] to-[#152B6E] text-white">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-1/4 h-72 w-72 rounded-full bg-white blur-3xl" />
          <div className="absolute bottom-0 right-1/4 h-72 w-72 rounded-full bg-cyan-300 blur-3xl" />
        </div>
        <div className="container relative mx-auto px-4 py-16 md:py-24">
          <div className="mx-auto max-w-3xl text-center">
            <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider backdrop-blur-sm">
              <HelpCircle className="h-3.5 w-3.5" />
              Help Center
            </span>
            <h1 className="mt-6 text-4xl font-extrabold leading-tight md:text-6xl">
              How can we help you?
            </h1>
            <p className="mt-4 text-lg text-white/80">
              Search our knowledge base or browse topics below.
            </p>
            <form className="mt-8 flex mx-auto max-w-xl gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                <Input
                  type="search"
                  placeholder="Search for answers..."
                  className="h-12 bg-white pl-11 text-slate-900 placeholder:text-slate-400 focus-visible:ring-white"
                />
              </div>
              <Button
                type="submit"
                size="lg"
                className="h-12 bg-white text-[#1C398E] hover:bg-white/90"
              >
                Search
              </Button>
            </form>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="container mx-auto px-4 py-16">
        <div className="mx-auto mb-10 max-w-2xl text-center">
          <span className="text-sm font-semibold uppercase tracking-wider text-[#1C398E]">
            Browse Topics
          </span>
          <h2 className="mt-2 text-3xl font-bold text-slate-900 md:text-4xl">
            Pick a category
          </h2>
        </div>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {CATEGORIES.map((c) => (
            <Link key={c.title} href={c.href}>
              <Card className="group h-full border-slate-200 shadow-sm transition hover:-translate-y-1 hover:border-[#1C398E]/30 hover:shadow-lg">
                <CardContent className="p-6">
                  <div
                    className={`mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br ${c.color} text-white shadow-md`}
                  >
                    <c.icon className="h-6 w-6" />
                  </div>
                  <h3 className="text-lg font-bold text-slate-900">
                    {c.title}
                  </h3>
                  <p className="mt-1 text-sm text-slate-600">{c.desc}</p>
                  <div className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-[#1C398E] transition group-hover:gap-2">
                    Explore
                    <ArrowRight className="h-4 w-4" />
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </section>

      {/* Popular questions */}
      <section className="bg-slate-50/50">
        <div className="container mx-auto px-4 py-16">
          <div className="mx-auto mb-10 max-w-2xl text-center">
            <span className="text-sm font-semibold uppercase tracking-wider text-[#1C398E]">
              Most Searched
            </span>
            <h2 className="mt-2 text-3xl font-bold text-slate-900 md:text-4xl">
              Popular questions
            </h2>
          </div>
          <div className="mx-auto grid max-w-4xl gap-3 sm:grid-cols-2">
            {POPULAR.map((p) => (
              <Link
                key={p.q}
                href={p.href}
                className="group flex items-center justify-between rounded-xl border border-slate-200 bg-white p-4 shadow-sm transition hover:border-[#1C398E]/30 hover:shadow-md"
              >
                <span className="text-sm font-medium text-slate-800">
                  {p.q}
                </span>
                <ArrowRight className="h-4 w-4 text-slate-400 transition group-hover:translate-x-1 group-hover:text-[#1C398E]" />
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Contact CTA */}
      <section className="container mx-auto px-4 py-16">
        <div className="mx-auto max-w-4xl rounded-3xl bg-gradient-to-br from-[#1C398E] to-[#152B6E] p-10 text-white shadow-xl md:p-14">
          <div className="text-center">
            <h2 className="text-3xl font-bold md:text-4xl">
              Still need help?
            </h2>
            <p className="mt-3 text-white/80">
              Our support team is available 24/7 to assist you.
            </p>
            <div className="mt-8 grid gap-4 sm:grid-cols-3">
              <a
                href="mailto:support@rocksmart.com"
                className="rounded-2xl bg-white/10 p-5 backdrop-blur-sm transition hover:bg-white/20"
              >
                <Mail className="mx-auto mb-2 h-6 w-6" />
                <p className="text-sm font-semibold">Email</p>
                <p className="mt-1 text-xs text-white/70">
                  support@rocksmart.com
                </p>
              </a>
              <a
                href="tel:+8801700000000"
                className="rounded-2xl bg-white/10 p-5 backdrop-blur-sm transition hover:bg-white/20"
              >
                <Phone className="mx-auto mb-2 h-6 w-6" />
                <p className="text-sm font-semibold">Call</p>
                <p className="mt-1 text-xs text-white/70">
                  +880 1700-000000
                </p>
              </a>
              <Link
                href="/contact"
                className="rounded-2xl bg-white/10 p-5 backdrop-blur-sm transition hover:bg-white/20"
              >
                <MessageSquare className="mx-auto mb-2 h-6 w-6" />
                <p className="text-sm font-semibold">Live Chat</p>
                <p className="mt-1 text-xs text-white/70">24/7 available</p>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
