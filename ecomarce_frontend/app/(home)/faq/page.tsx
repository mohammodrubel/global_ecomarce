"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  HelpCircle,
  Search,
  ChevronDown,
  Package,
  Truck,
  RefreshCcw,
  CreditCard,
  User,
  ShieldCheck,
  MessageSquare,
} from "lucide-react";
import Link from "next/link";

type Faq = { q: string; a: string };

const SECTIONS: { id: string; icon: any; title: string; items: Faq[] }[] = [
  {
    id: "orders",
    icon: Package,
    title: "Orders",
    items: [
      {
        q: "How do I place an order?",
        a: "Browse products, add items to cart, and proceed to checkout. Sign in or continue as guest, enter shipping details, choose payment, and confirm.",
      },
      {
        q: "Can I modify my order after placing it?",
        a: "Orders can be modified within 1 hour of placement. Contact support immediately at support@rocksmart.com or via live chat.",
      },
      {
        q: "How do I cancel an order?",
        a: "Go to Account → Order History → Cancel. Orders that haven't shipped can be cancelled free of charge. Shipped orders follow our return policy.",
      },
      {
        q: "Do you send order confirmation?",
        a: "Yes. A confirmation email is sent immediately after checkout with your order ID and receipt.",
      },
    ],
  },
  {
    id: "shipping",
    icon: Truck,
    title: "Shipping & Delivery",
    items: [
      {
        q: "How long does delivery take?",
        a: "Standard delivery: 3–5 business days. Express: 1–2 days. Same-day available in Dhaka Metro for orders before 12 PM.",
      },
      {
        q: "Do you offer international shipping?",
        a: "Yes, we ship to 25+ countries. Rates and delivery times are shown at checkout based on your destination.",
      },
      {
        q: "How do I track my order?",
        a: "Use our Track Order page with your order ID, or sign in and go to Order History. You'll also get SMS and email updates.",
      },
      {
        q: "Is free shipping available?",
        a: "Yes. Free standard shipping on orders over ৳2000 within Bangladesh.",
      },
    ],
  },
  {
    id: "returns",
    icon: RefreshCcw,
    title: "Returns & Refunds",
    items: [
      {
        q: "What is your return policy?",
        a: "14-day free returns on unused items in original packaging. Personalized, perishable, and intimate goods are non-returnable.",
      },
      {
        q: "How do I request a return?",
        a: "Sign in, go to Order History, select the item, and click Request Return. We'll email a prepaid label within 24 hours.",
      },
      {
        q: "When will I get my refund?",
        a: "Refunds are processed within 7–10 business days of us receiving the returned item, to your original payment method.",
      },
      {
        q: "Can I exchange an item?",
        a: "Yes. Request an exchange during the return process. Subject to stock availability.",
      },
    ],
  },
  {
    id: "payments",
    icon: CreditCard,
    title: "Payments",
    items: [
      {
        q: "What payment methods do you accept?",
        a: "Visa, Mastercard, Amex, bKash, Nagad, Rocket, and Cash on Delivery (COD) within Bangladesh.",
      },
      {
        q: "Is my payment information secure?",
        a: "Yes. All transactions use TLS encryption and PCI-DSS compliant payment gateways. We never store your full card details.",
      },
      {
        q: "Do you offer EMI?",
        a: "Yes. EMI available on select credit cards for orders over ৳10,000. Options shown at checkout.",
      },
      {
        q: "Can I get an invoice?",
        a: "A tax invoice is included with your order and available in Account → Order History → Download Invoice.",
      },
    ],
  },
  {
    id: "account",
    icon: User,
    title: "My Account",
    items: [
      {
        q: "How do I create an account?",
        a: "Click Register in the header, provide your name, email, and password. Verify your email and you're set.",
      },
      {
        q: "I forgot my password. What now?",
        a: "Click 'Forgot Password' on the login page. Enter your email and follow the reset link we send.",
      },
      {
        q: "How do I update my address?",
        a: "Sign in and go to Account → Addresses. Add, edit, or delete addresses as needed.",
      },
      {
        q: "How do I delete my account?",
        a: "Email privacy@rocksmart.com from your registered email. We'll process deletion within 30 days per our Privacy Policy.",
      },
    ],
  },
  {
    id: "security",
    icon: ShieldCheck,
    title: "Security & Privacy",
    items: [
      {
        q: "How is my data protected?",
        a: "We use TLS encryption in transit, encryption at rest, hashed passwords, and regular security audits. See our Privacy Policy.",
      },
      {
        q: "Do you sell my data?",
        a: "Never. We only share data with essential service partners (payment, shipping) under strict confidentiality agreements.",
      },
      {
        q: "How do I report a security issue?",
        a: "Email security@rocksmart.com. We take reports seriously and respond within 48 hours.",
      },
    ],
  },
];

function DisclosureItem({ item }: { item: Faq }) {
  const [open, setOpen] = useState(false);
  return (
    <div
      className={`overflow-hidden rounded-xl border bg-white transition ${
        open
          ? "border-[#1C398E]/40 shadow-md"
          : "border-slate-200 shadow-sm hover:border-[#1C398E]/30"
      }`}
    >
      <button
        onClick={() => setOpen(!open)}
        className="flex w-full items-center justify-between gap-4 p-5 text-left"
        aria-expanded={open}
      >
        <span className="font-semibold text-slate-900">{item.q}</span>
        <ChevronDown
          className={`h-5 w-5 shrink-0 text-[#1C398E] transition-transform ${
            open ? "rotate-180" : ""
          }`}
        />
      </button>
      <div
        className={`grid transition-all duration-300 ${
          open ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
        }`}
      >
        <div className="overflow-hidden">
          <p className="px-5 pb-5 text-sm leading-relaxed text-slate-600">
            {item.a}
          </p>
        </div>
      </div>
    </div>
  );
}

export default function FAQPage() {
  const [query, setQuery] = useState("");

  const filtered = SECTIONS.map((s) => ({
    ...s,
    items: s.items.filter(
      (i) =>
        !query ||
        i.q.toLowerCase().includes(query.toLowerCase()) ||
        i.a.toLowerCase().includes(query.toLowerCase())
    ),
  })).filter((s) => s.items.length > 0);

  return (
    <main className="bg-white">
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-[#1C398E] via-[#1C398E] to-[#152B6E] text-white">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-1/4 h-72 w-72 rounded-full bg-white blur-3xl" />
          <div className="absolute bottom-0 right-1/4 h-72 w-72 rounded-full bg-cyan-300 blur-3xl" />
        </div>
        <div className="container relative mx-auto px-4 py-16 md:py-24">
          <div className="mx-auto max-w-3xl text-center">
            <div className="mx-auto mb-6 inline-flex h-14 w-14 items-center justify-center rounded-xl bg-white/10 backdrop-blur-sm">
              <HelpCircle className="h-7 w-7" />
            </div>
            <h1 className="text-4xl font-extrabold md:text-5xl">
              Frequently Asked Questions
            </h1>
            <p className="mt-4 text-white/80">
              Everything you need to know about RocksMart.
            </p>
            <div className="relative mx-auto mt-8 max-w-xl">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
              <Input
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search FAQs..."
                className="h-12 bg-white pl-11 text-slate-900 placeholder:text-slate-400 focus-visible:ring-white"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="container mx-auto px-4 py-16">
        <div className="grid gap-10 lg:grid-cols-4">
          {/* TOC */}
          <aside className="lg:col-span-1">
            <div className="sticky top-24 rounded-2xl border border-slate-200 bg-slate-50/50 p-5">
              <h3 className="mb-4 text-sm font-bold uppercase tracking-wider text-slate-900">
                Topics
              </h3>
              <nav>
                <ul className="space-y-1">
                  {SECTIONS.map((s) => (
                    <li key={s.id}>
                      <a
                        href={`#${s.id}`}
                        className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-slate-600 transition hover:bg-[#1C398E]/10 hover:text-[#1C398E]"
                      >
                        <s.icon className="h-4 w-4" />
                        {s.title}
                      </a>
                    </li>
                  ))}
                </ul>
              </nav>
            </div>
          </aside>

          {/* Sections */}
          <div className="space-y-12 lg:col-span-3">
            {filtered.length === 0 && (
              <Card className="border-slate-200 shadow-sm">
                <CardContent className="p-10 text-center">
                  <Search className="mx-auto mb-4 h-12 w-12 text-slate-300" />
                  <h3 className="text-lg font-bold text-slate-900">
                    No results found
                  </h3>
                  <p className="mt-2 text-sm text-slate-600">
                    Try different keywords or contact our support team.
                  </p>
                </CardContent>
              </Card>
            )}

            {filtered.map((s) => (
              <section key={s.id} id={s.id} className="scroll-mt-24">
                <div className="mb-6 flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#1C398E] text-white">
                    <s.icon className="h-5 w-5" />
                  </div>
                  <h2 className="text-2xl font-bold text-slate-900 md:text-3xl">
                    {s.title}
                  </h2>
                </div>
                <div className="space-y-3">
                  {s.items.map((item) => (
                    <DisclosureItem key={item.q} item={item} />
                  ))}
                </div>
              </section>
            ))}

            {/* Contact CTA */}
            <div className="rounded-2xl bg-gradient-to-br from-[#1C398E] to-[#152B6E] p-8 text-white">
              <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-white/10">
                    <MessageSquare className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold">
                      Didn&apos;t find your answer?
                    </h3>
                    <p className="mt-1 text-sm text-white/80">
                      Our support team is here to help 24/7.
                    </p>
                  </div>
                </div>
                <Link href="/contact">
                  <Button className="bg-white text-[#1C398E] hover:bg-white/90">
                    Contact Us
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
