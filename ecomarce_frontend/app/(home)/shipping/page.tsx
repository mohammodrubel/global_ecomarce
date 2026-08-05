import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Truck,
  Clock,
  MapPin,
  Package,
  Zap,
  Globe2,
  ShieldCheck,
  AlertCircle,
  ArrowRight,
} from "lucide-react";
import Link from "next/link";

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Shipping Info",
  description:
    "Delivery times, shipping rates, coverage zones, express options, and everything about how RocksMart ships orders.",
  keywords: [
    "shipping info",
    "delivery times",
    "shipping rates",
    "free shipping",
    "express delivery",
    "RocksMart shipping",
  ],
  alternates: { canonical: "/shipping" },
  openGraph: {
    title: "Shipping Info | RocksMart",
    description: "Delivery times, rates, and coverage zones.",
    url: "/shipping",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "Shipping Info | RocksMart",
    description: "Delivery times, rates, and coverage zones.",
  },
};

const OPTIONS = [
  {
    icon: Truck,
    name: "Standard Delivery",
    time: "3–5 business days",
    price: "৳80",
    desc: "Nationwide coverage. Free on orders over ৳2000.",
    color: "from-blue-500 to-indigo-500",
  },
  {
    icon: Zap,
    name: "Express Delivery",
    time: "1–2 business days",
    price: "৳150",
    desc: "Priority handling and expedited shipping.",
    color: "from-orange-500 to-red-500",
  },
  {
    icon: MapPin,
    name: "Same-Day Delivery",
    time: "Within 6 hours",
    price: "৳250",
    desc: "Available in Dhaka Metro. Order before 12 PM.",
    color: "from-emerald-500 to-teal-500",
  },
];

const ZONES = [
  { zone: "Dhaka Metro", time: "1–2 days", cost: "৳60" },
  { zone: "Major Cities", time: "2–3 days", cost: "৳80" },
  { zone: "Divisional Towns", time: "3–4 days", cost: "৳100" },
  { zone: "Remote Areas", time: "5–7 days", cost: "৳130" },
];

const STEPS = [
  {
    icon: Package,
    title: "Order Placed",
    desc: "Confirmation email sent instantly.",
  },
  {
    icon: ShieldCheck,
    title: "Processed & Packed",
    desc: "Quality-checked and packaged within 24 hours.",
  },
  {
    icon: Truck,
    title: "Shipped",
    desc: "Tracking number emailed once dispatched.",
  },
  {
    icon: MapPin,
    title: "Delivered",
    desc: "Signed delivery to your address.",
  },
];

export default function ShippingPage() {
  return (
    <main className="bg-white">
      {/* Hero */}
      <section className="border-b border-slate-100 bg-gradient-to-br from-[#1C398E] to-[#152B6E] text-white">
        <div className="container mx-auto px-4 py-16 md:py-20">
          <div className="mx-auto max-w-3xl text-center">
            <div className="mx-auto mb-6 inline-flex h-14 w-14 items-center justify-center rounded-xl bg-white/10 backdrop-blur-sm">
              <Truck className="h-7 w-7" />
            </div>
            <h1 className="text-4xl font-extrabold md:text-5xl">
              Shipping Information
            </h1>
            <p className="mt-4 text-white/80">
              Fast, reliable delivery across Bangladesh and beyond.
            </p>
          </div>
        </div>
      </section>

      {/* Options */}
      <section className="container mx-auto px-4 py-16">
        <div className="mx-auto mb-10 max-w-2xl text-center">
          <span className="text-sm font-semibold uppercase tracking-wider text-[#1C398E]">
            Delivery Options
          </span>
          <h2 className="mt-2 text-3xl font-bold text-slate-900 md:text-4xl">
            Pick a speed that suits you
          </h2>
        </div>
        <div className="grid gap-6 md:grid-cols-3">
          {OPTIONS.map((o) => (
            <Card
              key={o.name}
              className="border-slate-200 shadow-sm transition hover:-translate-y-1 hover:border-[#1C398E]/30 hover:shadow-lg"
            >
              <CardContent className="p-6">
                <div
                  className={`mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br ${o.color} text-white shadow-md`}
                >
                  <o.icon className="h-6 w-6" />
                </div>
                <h3 className="text-lg font-bold text-slate-900">{o.name}</h3>
                <div className="mt-3 flex items-baseline gap-2">
                  <span className="text-2xl font-extrabold text-[#1C398E]">
                    {o.price}
                  </span>
                  <span className="text-sm text-slate-500">
                    {o.time}
                  </span>
                </div>
                <p className="mt-3 text-sm text-slate-600">{o.desc}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Zones table */}
      <section className="bg-slate-50/50">
        <div className="container mx-auto px-4 py-16">
          <div className="mx-auto mb-10 max-w-2xl text-center">
            <span className="text-sm font-semibold uppercase tracking-wider text-[#1C398E]">
              Coverage Zones
            </span>
            <h2 className="mt-2 text-3xl font-bold text-slate-900 md:text-4xl">
              Standard rates by zone
            </h2>
          </div>
          <Card className="mx-auto max-w-3xl overflow-hidden border-slate-200 shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-[#1C398E] text-white">
                  <tr>
                    <th className="px-6 py-4 text-left font-bold">Zone</th>
                    <th className="px-6 py-4 text-left font-bold">
                      Delivery Time
                    </th>
                    <th className="px-6 py-4 text-right font-bold">Cost</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {ZONES.map((z) => (
                    <tr
                      key={z.zone}
                      className="transition hover:bg-slate-50"
                    >
                      <td className="px-6 py-4 font-medium text-slate-900">
                        <div className="flex items-center gap-2">
                          <MapPin className="h-4 w-4 text-[#1C398E]" />
                          {z.zone}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-slate-600">
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4 text-slate-400" />
                          {z.time}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-right font-bold text-[#1C398E]">
                        {z.cost}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </div>
      </section>

      {/* Process */}
      <section className="container mx-auto px-4 py-16">
        <div className="mx-auto mb-10 max-w-2xl text-center">
          <span className="text-sm font-semibold uppercase tracking-wider text-[#1C398E]">
            How It Works
          </span>
          <h2 className="mt-2 text-3xl font-bold text-slate-900 md:text-4xl">
            From click to doorstep
          </h2>
        </div>
        <div className="relative grid gap-6 md:grid-cols-4">
          {STEPS.map((s, i) => (
            <div key={s.title} className="relative">
              <Card className="h-full border-slate-200 shadow-sm">
                <CardContent className="p-6 text-center">
                  <div className="relative mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#1C398E]/10 text-[#1C398E]">
                    <s.icon className="h-7 w-7" />
                    <span className="absolute -right-2 -top-2 flex h-6 w-6 items-center justify-center rounded-full bg-[#1C398E] text-xs font-bold text-white">
                      {i + 1}
                    </span>
                  </div>
                  <h3 className="font-bold text-slate-900">{s.title}</h3>
                  <p className="mt-2 text-sm text-slate-600">{s.desc}</p>
                </CardContent>
              </Card>
            </div>
          ))}
        </div>
      </section>

      {/* Info notes */}
      <section className="container mx-auto px-4 pb-16">
        <div className="grid gap-4 md:grid-cols-2">
          <Card className="border-blue-200 bg-blue-50">
            <CardContent className="flex gap-4 p-6">
              <Globe2 className="h-6 w-6 shrink-0 text-blue-600" />
              <div>
                <h3 className="font-bold text-blue-900">
                  International Shipping
                </h3>
                <p className="mt-1 text-sm text-blue-800">
                  We ship to 25+ countries. Rates and delivery times shown at
                  checkout based on destination.
                </p>
              </div>
            </CardContent>
          </Card>
          <Card className="border-amber-200 bg-amber-50">
            <CardContent className="flex gap-4 p-6">
              <AlertCircle className="h-6 w-6 shrink-0 text-amber-600" />
              <div>
                <h3 className="font-bold text-amber-900">Delivery Delays</h3>
                <p className="mt-1 text-sm text-amber-800">
                  Weather, holidays, or remote locations may extend delivery
                  time. Track your order for live updates.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* CTA */}
      <section className="container mx-auto px-4 pb-20">
        <div className="rounded-3xl bg-gradient-to-br from-[#1C398E] to-[#152B6E] p-10 text-center text-white shadow-xl">
          <h2 className="text-3xl font-bold md:text-4xl">
            Already ordered?
          </h2>
          <p className="mt-3 text-white/80">
            Track your delivery in real time.
          </p>
          <Link href="/track-order">
            <Button
              size="lg"
              className="mt-6 bg-white text-[#1C398E] hover:bg-white/90"
            >
              Track Your Order
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>
      </section>
    </main>
  );
}
