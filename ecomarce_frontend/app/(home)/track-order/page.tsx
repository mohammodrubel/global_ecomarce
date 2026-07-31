"use client";

import { useState, FormEvent } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Search,
  Package,
  CheckCircle2,
  Clock,
  Truck,
  Home,
  MapPin,
  Loader2,
  XCircle,
} from "lucide-react";
import Link from "next/link";

type Stage = {
  key: string;
  label: string;
  icon: any;
  date?: string;
  done: boolean;
  active?: boolean;
};

const DEMO_STAGES: Stage[] = [
  {
    key: "placed",
    label: "Order Placed",
    icon: CheckCircle2,
    date: "Jul 28, 2026 · 10:24 AM",
    done: true,
  },
  {
    key: "confirmed",
    label: "Order Confirmed",
    icon: Package,
    date: "Jul 28, 2026 · 2:15 PM",
    done: true,
  },
  {
    key: "shipped",
    label: "Shipped",
    icon: Truck,
    date: "Jul 29, 2026 · 9:00 AM",
    done: true,
    active: true,
  },
  {
    key: "out",
    label: "Out for Delivery",
    icon: MapPin,
    done: false,
  },
  {
    key: "delivered",
    label: "Delivered",
    icon: Home,
    done: false,
  },
];

export default function TrackOrderPage() {
  const [orderId, setOrderId] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<"none" | "found" | "not-found">("none");

  const handleTrack = async (e: FormEvent) => {
    e.preventDefault();
    if (!orderId.trim()) return;
    setLoading(true);
    await new Promise((r) => setTimeout(r, 1000));
    setLoading(false);
    // Demo: any order id starting with "RM" → found
    setResult(orderId.toUpperCase().startsWith("RM") ? "found" : "not-found");
  };

  return (
    <main className="bg-white">
      {/* Hero */}
      <section className="border-b border-slate-100 bg-gradient-to-br from-[#1C398E] to-[#152B6E] text-white">
        <div className="container mx-auto px-4 py-16 md:py-20">
          <div className="mx-auto max-w-3xl text-center">
            <div className="mx-auto mb-6 inline-flex h-14 w-14 items-center justify-center rounded-xl bg-white/10 backdrop-blur-sm">
              <Package className="h-7 w-7" />
            </div>
            <h1 className="text-4xl font-extrabold md:text-5xl">
              Track Your Order
            </h1>
            <p className="mt-4 text-white/80">
              Enter your order ID to see real-time delivery status.
            </p>
          </div>
        </div>
      </section>

      {/* Form */}
      <section className="container mx-auto px-4 py-12">
        <Card className="mx-auto max-w-2xl border-slate-200 shadow-lg">
          <CardContent className="p-6 md:p-8">
            <form onSubmit={handleTrack} className="space-y-4">
              <div className="space-y-2">
                <label
                  htmlFor="orderId"
                  className="text-sm font-medium text-slate-700"
                >
                  Order ID <span className="text-red-500">*</span>
                </label>
                <Input
                  id="orderId"
                  value={orderId}
                  onChange={(e) => setOrderId(e.target.value)}
                  placeholder="e.g. RM-2026-000123"
                  className="h-12 focus-visible:ring-[#1C398E]"
                  required
                />
              </div>
              <div className="space-y-2">
                <label
                  htmlFor="email"
                  className="text-sm font-medium text-slate-700"
                >
                  Email Address
                </label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Email used at checkout"
                  className="h-12 focus-visible:ring-[#1C398E]"
                />
              </div>
              <Button
                type="submit"
                size="lg"
                disabled={loading}
                className="w-full bg-[#1C398E] hover:bg-[#152B6E]"
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Tracking...
                  </>
                ) : (
                  <>
                    <Search className="mr-2 h-4 w-4" />
                    Track Order
                  </>
                )}
              </Button>
            </form>

            <p className="mt-4 text-center text-xs text-slate-500">
              Can&apos;t find your order ID? Check your confirmation email or{" "}
              <Link
                href="/contact"
                className="font-medium text-[#1C398E] hover:underline"
              >
                contact support
              </Link>
              .
            </p>
          </CardContent>
        </Card>

        {/* Not found */}
        {result === "not-found" && (
          <Card className="mx-auto mt-8 max-w-2xl border-red-200 bg-red-50">
            <CardContent className="flex items-start gap-4 p-6">
              <XCircle className="h-6 w-6 shrink-0 text-red-500" />
              <div>
                <h3 className="font-bold text-red-900">Order not found</h3>
                <p className="mt-1 text-sm text-red-700">
                  We couldn&apos;t find an order matching that ID. Double-check
                  your ID or contact our support team.
                </p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Result */}
        {result === "found" && (
          <Card className="mx-auto mt-8 max-w-3xl border-slate-200 shadow-lg">
            <CardContent className="p-6 md:p-8">
              {/* Summary */}
              <div className="mb-6 flex flex-wrap items-start justify-between gap-4 border-b border-slate-100 pb-6">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                    Order ID
                  </p>
                  <p className="mt-1 text-xl font-bold text-slate-900">
                    {orderId.toUpperCase()}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                    Estimated Delivery
                  </p>
                  <p className="mt-1 text-xl font-bold text-[#1C398E]">
                    Aug 2, 2026
                  </p>
                </div>
              </div>

              {/* Timeline */}
              <h3 className="mb-6 text-lg font-bold text-slate-900">
                Delivery Progress
              </h3>
              <ol className="relative space-y-8">
                {DEMO_STAGES.map((s, i) => (
                  <li key={s.key} className="relative flex gap-4">
                    {/* Connector line */}
                    {i < DEMO_STAGES.length - 1 && (
                      <span
                        className={`absolute left-5 top-11 h-full w-0.5 ${
                          s.done ? "bg-[#1C398E]" : "bg-slate-200"
                        }`}
                      />
                    )}
                    {/* Icon */}
                    <div
                      className={`relative z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${
                        s.done
                          ? "bg-[#1C398E] text-white shadow-lg"
                          : "bg-slate-100 text-slate-400"
                      } ${s.active ? "ring-4 ring-[#1C398E]/20" : ""}`}
                    >
                      <s.icon className="h-5 w-5" />
                    </div>
                    {/* Text */}
                    <div className="flex-1 pt-1">
                      <p
                        className={`font-semibold ${
                          s.done ? "text-slate-900" : "text-slate-400"
                        }`}
                      >
                        {s.label}
                        {s.active && (
                          <span className="ml-2 rounded-full bg-[#1C398E]/10 px-2 py-0.5 text-xs font-medium text-[#1C398E]">
                            In progress
                          </span>
                        )}
                      </p>
                      {s.date && (
                        <p className="mt-1 flex items-center gap-1 text-sm text-slate-500">
                          <Clock className="h-3.5 w-3.5" />
                          {s.date}
                        </p>
                      )}
                    </div>
                  </li>
                ))}
              </ol>

              {/* Actions */}
              <div className="mt-8 flex flex-wrap gap-3 border-t border-slate-100 pt-6">
                <Link href="/contact" className="flex-1">
                  <Button variant="outline" className="w-full">
                    Contact Courier
                  </Button>
                </Link>
                <Link href="/shop" className="flex-1">
                  <Button className="w-full bg-[#1C398E] hover:bg-[#152B6E]">
                    Continue Shopping
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        )}
      </section>
    </main>
  );
}
