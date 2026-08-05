import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Target,
  Eye,
  Heart,
  ShieldCheck,
  Truck,
  Sparkles,
  Users,
  Package,
  Globe2,
  Award,
  ArrowRight,
} from "lucide-react";
import Link from "next/link";

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About Us",
  description:
    "Learn about RocksMart — our mission, values, team, and commitment to delivering quality products worldwide with fast shipping and top customer service.",
  keywords: [
    "about RocksMart",
    "our mission",
    "company values",
    "ecommerce team",
    "trusted online store",
  ],
  alternates: { canonical: "/about" },
  openGraph: {
    title: "About RocksMart",
    description:
      "Our mission, values, and commitment to delivering quality products worldwide.",
    url: "/about",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "About RocksMart",
    description: "Our mission, values, and commitment to quality.",
  },
};

const STATS = [
  { icon: Users, value: "500K+", label: "Happy Customers" },
  { icon: Package, value: "50K+", label: "Products Delivered" },
  { icon: Globe2, value: "25+", label: "Countries Served" },
  { icon: Award, value: "12+", label: "Industry Awards" },
];

const VALUES = [
  {
    icon: ShieldCheck,
    title: "Trust & Security",
    text: "Every transaction is protected with end-to-end encryption and buyer guarantees.",
  },
  {
    icon: Truck,
    title: "Fast Delivery",
    text: "Optimized logistics network delivering to your door in record time.",
  },
  {
    icon: Sparkles,
    title: "Quality First",
    text: "Curated catalog with verified suppliers and rigorous quality checks.",
  },
  {
    icon: Heart,
    title: "Customer Care",
    text: "Dedicated 24/7 support team committed to resolving every concern.",
  },
];

export default function AboutPage() {
  return (
    <main className="bg-white">
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-[#1C398E] via-[#1C398E] to-[#152B6E] text-white">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-1/4 h-72 w-72 rounded-full bg-white blur-3xl" />
          <div className="absolute bottom-0 right-1/4 h-72 w-72 rounded-full bg-cyan-300 blur-3xl" />
        </div>
        <div className="container relative mx-auto px-4 py-20 md:py-28">
          <div className="mx-auto max-w-3xl text-center">
            <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider backdrop-blur-sm">
              <Sparkles className="h-3.5 w-3.5" />
              About RocksMart
            </span>
            <h1 className="mt-6 text-4xl font-extrabold leading-tight md:text-6xl">
              Redefining how the world shops online
            </h1>
            <p className="mt-6 text-lg text-white/80 md:text-xl">
              We&apos;re on a mission to make quality products accessible to
              everyone, everywhere — powered by technology, driven by trust.
            </p>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="border-b border-slate-100 bg-slate-50/50">
        <div className="container mx-auto px-4 py-12">
          <div className="grid grid-cols-2 gap-6 md:grid-cols-4">
            {STATS.map((s) => (
              <div key={s.label} className="text-center">
                <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-xl bg-[#1C398E]/10">
                  <s.icon className="h-7 w-7 text-[#1C398E]" />
                </div>
                <div className="text-3xl font-extrabold text-slate-900 md:text-4xl">
                  {s.value}
                </div>
                <div className="mt-1 text-sm text-slate-600">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Mission / Vision */}
      <section className="container mx-auto px-4 py-16 md:py-20">
        <div className="grid gap-6 md:grid-cols-2">
          <Card className="border-slate-200 shadow-sm transition hover:shadow-md">
            <CardContent className="p-8">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-[#1C398E] text-white">
                <Target className="h-6 w-6" />
              </div>
              <h2 className="mb-3 text-2xl font-bold text-slate-900">
                Our Mission
              </h2>
              <p className="leading-relaxed text-slate-600">
                To empower millions of shoppers with a seamless, secure, and
                delightful marketplace where discovering products they love
                takes seconds — not hours.
              </p>
            </CardContent>
          </Card>

          <Card className="border-slate-200 shadow-sm transition hover:shadow-md">
            <CardContent className="p-8">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-[#1C398E] text-white">
                <Eye className="h-6 w-6" />
              </div>
              <h2 className="mb-3 text-2xl font-bold text-slate-900">
                Our Vision
              </h2>
              <p className="leading-relaxed text-slate-600">
                To become the most trusted global marketplace by 2030 —
                connecting quality brands with conscious customers across every
                corner of the world.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Story */}
      <section className="bg-slate-50/50">
        <div className="container mx-auto px-4 py-16 md:py-20">
          <div className="mx-auto max-w-3xl text-center">
            <span className="text-sm font-semibold uppercase tracking-wider text-[#1C398E]">
              Our Story
            </span>
            <h2 className="mt-3 text-3xl font-bold text-slate-900 md:text-4xl">
              Built by shoppers, for shoppers
            </h2>
            <p className="mt-6 text-lg leading-relaxed text-slate-600">
              RocksMart started with a simple question: why is online shopping
              still so complicated? We set out to build a platform that puts
              the customer first — with transparent pricing, verified reviews,
              and a checkout experience that just works. Today, we serve
              hundreds of thousands of customers across dozens of countries,
              and we&apos;re just getting started.
            </p>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="container mx-auto px-4 py-16 md:py-20">
        <div className="mx-auto mb-12 max-w-2xl text-center">
          <span className="text-sm font-semibold uppercase tracking-wider text-[#1C398E]">
            What We Stand For
          </span>
          <h2 className="mt-3 text-3xl font-bold text-slate-900 md:text-4xl">
            Our core values
          </h2>
        </div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {VALUES.map((v) => (
            <Card
              key={v.title}
              className="group border-slate-200 shadow-sm transition hover:-translate-y-1 hover:border-[#1C398E]/30 hover:shadow-lg"
            >
              <CardContent className="p-6">
                <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-[#1C398E]/10 text-[#1C398E] transition group-hover:bg-[#1C398E] group-hover:text-white">
                  <v.icon className="h-6 w-6" />
                </div>
                <h3 className="mb-2 text-lg font-bold text-slate-900">
                  {v.title}
                </h3>
                <p className="text-sm leading-relaxed text-slate-600">
                  {v.text}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="container mx-auto px-4 pb-20">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#1C398E] to-[#152B6E] p-10 text-white shadow-xl md:p-16">
          <div className="absolute -right-16 -top-16 h-64 w-64 rounded-full bg-white/5" />
          <div className="absolute -bottom-16 -left-16 h-64 w-64 rounded-full bg-white/5" />
          <div className="relative mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold md:text-4xl">
              Ready to start shopping?
            </h2>
            <p className="mt-4 text-white/80">
              Explore thousands of products, unbeatable prices, and delivery to
              your doorstep.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <Link href="/shop">
                <Button
                  size="lg"
                  className="bg-white text-[#1C398E] hover:bg-white/90"
                >
                  Browse Products
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <Link href="/contact">
                <Button
                  size="lg"
                  variant="outline"
                  className="border-white/40 bg-transparent text-white hover:bg-white/10 hover:text-white"
                >
                  Contact Us
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
