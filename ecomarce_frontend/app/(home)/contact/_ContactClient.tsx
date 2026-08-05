"use client";

import { useState, FormEvent } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Mail,
  Phone,
  MapPin,
  MessageSquare,
  Clock,
  Send,
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
  Youtube,
  CheckCircle2,
  Loader2,
  HelpCircle,
} from "lucide-react";
import { toast } from "sonner";
import Link from "next/link";

const CONTACT_METHODS = [
  {
    icon: Mail,
    title: "Email Us",
    value: "support@rocksmart.com",
    href: "mailto:support@rocksmart.com",
    desc: "We reply within 24 hours",
  },
  {
    icon: Phone,
    title: "Call Us",
    value: "+880 1700-000000",
    href: "tel:+8801700000000",
    desc: "Mon–Sat, 9am – 8pm",
  },
  {
    icon: MessageSquare,
    title: "Live Chat",
    value: "Start conversation",
    href: "#",
    desc: "Instant answers, 24/7",
  },
  {
    icon: MapPin,
    title: "Visit Us",
    value: "Dhaka, Bangladesh",
    href: "#map",
    desc: "House 42, Road 11, Banani",
  },
];

const HOURS = [
  { day: "Monday – Friday", time: "9:00 AM – 8:00 PM" },
  { day: "Saturday", time: "10:00 AM – 6:00 PM" },
  { day: "Sunday", time: "Closed" },
];

const SOCIALS = [
  { icon: Facebook, href: "#", label: "Facebook" },
  { icon: Twitter, href: "#", label: "Twitter" },
  { icon: Instagram, href: "#", label: "Instagram" },
  { icon: Linkedin, href: "#", label: "LinkedIn" },
  { icon: Youtube, href: "#", label: "YouTube" },
];

const FAQS = [
  {
    q: "How long does delivery take?",
    a: "Standard delivery is 3–5 business days within Bangladesh. Express options available at checkout.",
  },
  {
    q: "What is your return policy?",
    a: "14-day free returns on unused items in original packaging. Refunds processed within 7–10 business days.",
  },
  {
    q: "How can I track my order?",
    a: "Sign in and visit Account → Order History. You'll also receive tracking updates via email and SMS.",
  },
];

export default function ContactPage() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [sent, setSent] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) {
      toast.error("Please fill in all required fields");
      return;
    }
    setSubmitting(true);
    // Simulate API call — wire to real endpoint later
    await new Promise((r) => setTimeout(r, 900));
    setSubmitting(false);
    setSent(true);
    toast.success("Message sent! We'll get back to you soon.");
    setForm({ name: "", email: "", subject: "", message: "" });
    setTimeout(() => setSent(false), 4000);
  };

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
            <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider backdrop-blur-sm">
              <MessageSquare className="h-3.5 w-3.5" />
              Get in Touch
            </span>
            <h1 className="mt-6 text-4xl font-extrabold leading-tight md:text-6xl">
              We&apos;d love to hear from you
            </h1>
            <p className="mt-6 text-lg text-white/80 md:text-xl">
              Questions, feedback, partnership ideas — reach out and our team
              will respond within one business day.
            </p>
          </div>
        </div>
      </section>

      {/* Contact methods */}
      <section className="container mx-auto -mt-10 px-4">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {CONTACT_METHODS.map((m) => (
            <Link
              key={m.title}
              href={m.href}
              className="group rounded-2xl border border-slate-200 bg-white p-6 shadow-lg transition hover:-translate-y-1 hover:border-[#1C398E]/30 hover:shadow-xl"
            >
              <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-[#1C398E]/10 text-[#1C398E] transition group-hover:bg-[#1C398E] group-hover:text-white">
                <m.icon className="h-6 w-6" />
              </div>
              <h3 className="font-bold text-slate-900">{m.title}</h3>
              <p className="mt-1 text-sm font-medium text-[#1C398E]">
                {m.value}
              </p>
              <p className="mt-1 text-xs text-slate-500">{m.desc}</p>
            </Link>
          ))}
        </div>
      </section>

      {/* Form + Info */}
      <section className="container mx-auto px-4 py-16 md:py-20">
        <div className="grid gap-8 lg:grid-cols-5">
          {/* Form */}
          <Card className="lg:col-span-3 border-slate-200 shadow-sm">
            <CardContent className="p-6 md:p-10">
              <div className="mb-8">
                <span className="text-sm font-semibold uppercase tracking-wider text-[#1C398E]">
                  Send a Message
                </span>
                <h2 className="mt-2 text-2xl font-bold text-slate-900 md:text-3xl">
                  Drop us a line
                </h2>
                <p className="mt-2 text-slate-600">
                  Fill in the form and our team will get back to you shortly.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid gap-5 sm:grid-cols-2">
                  <div className="space-y-2">
                    <label
                      htmlFor="name"
                      className="text-sm font-medium text-slate-700"
                    >
                      Your Name <span className="text-red-500">*</span>
                    </label>
                    <Input
                      id="name"
                      name="name"
                      value={form.name}
                      onChange={handleChange}
                      placeholder="John Doe"
                      className="h-11 focus-visible:ring-[#1C398E]"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <label
                      htmlFor="email"
                      className="text-sm font-medium text-slate-700"
                    >
                      Email Address <span className="text-red-500">*</span>
                    </label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={form.email}
                      onChange={handleChange}
                      placeholder="john@example.com"
                      className="h-11 focus-visible:ring-[#1C398E]"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label
                    htmlFor="subject"
                    className="text-sm font-medium text-slate-700"
                  >
                    Subject
                  </label>
                  <Input
                    id="subject"
                    name="subject"
                    value={form.subject}
                    onChange={handleChange}
                    placeholder="How can we help?"
                    className="h-11 focus-visible:ring-[#1C398E]"
                  />
                </div>

                <div className="space-y-2">
                  <label
                    htmlFor="message"
                    className="text-sm font-medium text-slate-700"
                  >
                    Message <span className="text-red-500">*</span>
                  </label>
                  <Textarea
                    id="message"
                    name="message"
                    value={form.message}
                    onChange={handleChange}
                    placeholder="Tell us more about your inquiry..."
                    rows={6}
                    className="resize-none focus-visible:ring-[#1C398E]"
                    required
                  />
                </div>

                <Button
                  type="submit"
                  disabled={submitting || sent}
                  size="lg"
                  className="w-full bg-[#1C398E] hover:bg-[#152B6E] sm:w-auto"
                >
                  {submitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Sending...
                    </>
                  ) : sent ? (
                    <>
                      <CheckCircle2 className="mr-2 h-4 w-4" />
                      Message Sent
                    </>
                  ) : (
                    <>
                      <Send className="mr-2 h-4 w-4" />
                      Send Message
                    </>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Info sidebar */}
          <div className="lg:col-span-2 space-y-6">
            {/* Hours */}
            <Card className="border-slate-200 shadow-sm">
              <CardContent className="p-6">
                <div className="mb-4 flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#1C398E]/10 text-[#1C398E]">
                    <Clock className="h-5 w-5" />
                  </div>
                  <h3 className="text-lg font-bold text-slate-900">
                    Business Hours
                  </h3>
                </div>
                <ul className="space-y-3">
                  {HOURS.map((h) => (
                    <li
                      key={h.day}
                      className="flex items-center justify-between border-b border-slate-100 pb-2 last:border-0 last:pb-0"
                    >
                      <span className="text-sm text-slate-600">{h.day}</span>
                      <span className="text-sm font-semibold text-slate-900">
                        {h.time}
                      </span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            {/* Office */}
            <Card className="border-slate-200 shadow-sm">
              <CardContent className="p-6">
                <div className="mb-4 flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#1C398E]/10 text-[#1C398E]">
                    <MapPin className="h-5 w-5" />
                  </div>
                  <h3 className="text-lg font-bold text-slate-900">
                    Head Office
                  </h3>
                </div>
                <address className="not-italic text-sm leading-relaxed text-slate-600">
                  RocksMart HQ
                  <br />
                  House 42, Road 11
                  <br />
                  Banani, Dhaka 1213
                  <br />
                  Bangladesh
                </address>
              </CardContent>
            </Card>

            {/* Social */}
            <Card className="border-0 bg-gradient-to-br from-[#1C398E] to-[#152B6E] text-white shadow-sm">
              <CardContent className="p-6">
                <h3 className="text-lg font-bold">Follow Us</h3>
                <p className="mt-1 text-sm text-white/80">
                  Stay updated on new products and offers.
                </p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {SOCIALS.map((s) => (
                    <a
                      key={s.label}
                      href={s.href}
                      aria-label={s.label}
                      className="flex h-10 w-10 items-center justify-center rounded-lg bg-white/10 backdrop-blur-sm transition hover:bg-white/20"
                    >
                      <s.icon className="h-4 w-4" />
                    </a>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Map */}
      <section id="map" className="container mx-auto px-4 pb-16">
        <div className="mb-8 text-center">
          <span className="text-sm font-semibold uppercase tracking-wider text-[#1C398E]">
            Location
          </span>
          <h2 className="mt-2 text-3xl font-bold text-slate-900 md:text-4xl">
            Find us on the map
          </h2>
        </div>
        <div className="overflow-hidden rounded-3xl border border-slate-200 shadow-lg">
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3651.987!2d90.4066!3d23.7936!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMjPCsDQ3JzM3LjAiTiA5MMKwMjQnMjMuOCJF!5e0!3m2!1sen!2sbd!4v1000000000000"
            width="100%"
            height="420"
            style={{ border: 0 }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title="RocksMart office location"
          />
        </div>
      </section>

      {/* FAQ */}
      <section className="bg-slate-50/50">
        <div className="container mx-auto px-4 py-16 md:py-20">
          <div className="mx-auto mb-10 max-w-2xl text-center">
            <span className="inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-[#1C398E]">
              <HelpCircle className="h-4 w-4" />
              Common Questions
            </span>
            <h2 className="mt-2 text-3xl font-bold text-slate-900 md:text-4xl">
              Quick answers
            </h2>
          </div>
          <div className="mx-auto grid max-w-4xl gap-4 md:grid-cols-3">
            {FAQS.map((f) => (
              <Card
                key={f.q}
                className="border-slate-200 shadow-sm transition hover:border-[#1C398E]/30 hover:shadow-md"
              >
                <CardContent className="p-6">
                  <h3 className="mb-2 font-bold text-slate-900">{f.q}</h3>
                  <p className="text-sm leading-relaxed text-slate-600">
                    {f.a}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
