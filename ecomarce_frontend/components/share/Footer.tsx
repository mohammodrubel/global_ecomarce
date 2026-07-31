"use client";

import React, { useState, FormEvent } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import Link from "next/link";
import {
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
  Youtube,
  Mail,
  Phone,
  MapPin,
  Send,
  ShieldCheck,
  Truck,
  RefreshCcw,
  CreditCard,
} from "lucide-react";
import { toast } from "sonner";
import { useGetAllCategoryQuery } from "@/redux/fetchers/categoryApi/categoryApi";
import { useGetAllBrandQuery } from "@/redux/fetchers/brand/brandApi";

const COMPANY_LINKS = [
  { label: "About Us", href: "/about" },
  { label: "Contact", href: "/contact" },
];

const SHOP_LINKS = [
  { label: "All Products", href: "/shop" },
  { label: "New Arrivals", href: "/shop/new" },
  { label: "Best Sellers", href: "/shop/bestsellers" },
  { label: "Special Offers", href: "/shop?filter=offers" },
  { label: "Gift Cards", href: "/gift-cards" },
];

const SUPPORT_LINKS = [
  { label: "Help Center", href: "/help" },
  { label: "Track Order", href: "/track-order" },
  { label: "Shipping Info", href: "/shipping" },
  { label: "Returns & Refunds", href: "/returns" },
  { label: "FAQ", href: "/faq" },
];

const LEGAL_LINKS = [
  { label: "Privacy Policy", href: "/privacy-policy" },
  { label: "Terms of Service", href: "/terms" },
  { label: "Cookie Policy", href: "/cookies" },
];

const SOCIALS = [
  { icon: Facebook, href: "#", label: "Facebook" },
  { icon: Twitter, href: "#", label: "Twitter" },
  { icon: Instagram, href: "#", label: "Instagram" },
  { icon: Linkedin, href: "#", label: "LinkedIn" },
  { icon: Youtube, href: "#", label: "YouTube" },
];

const TRUST_BADGES = [
  { icon: Truck, title: "Free Shipping", desc: "On orders over ৳2000" },
  { icon: RefreshCcw, title: "14-Day Returns", desc: "Hassle-free refunds" },
  { icon: ShieldCheck, title: "Secure Payment", desc: "SSL encrypted" },
  { icon: CreditCard, title: "Flexible Payment", desc: "Cards, COD, bKash" },
];

function Footer() {
  const { data: categoryRes } = useGetAllCategoryQuery(undefined);
  const { data: brandRes } = useGetAllBrandQuery();
  const [email, setEmail] = useState("");

  const categories = (categoryRes?.data || []).slice(0, 5);
  const brands = (brandRes?.data || []).slice(0, 5);

  const handleSubscribe = (e: FormEvent) => {
    e.preventDefault();
    if (!email || !/\S+@\S+\.\S+/.test(email)) {
      toast.error("Please enter a valid email");
      return;
    }
    toast.success("Subscribed! Check your inbox.");
    setEmail("");
  };

  return (
    <footer className="bg-slate-950 text-slate-300">
      {/* Trust badges strip */}
      <div className="border-b border-slate-800 bg-slate-900">
        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-2 gap-6 sm:grid-cols-4">
            {TRUST_BADGES.map((b) => (
              <div key={b.title} className="flex items-center gap-3">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#1C398E]/20 text-[#7B96E8]">
                  <b.icon className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-white">{b.title}</p>
                  <p className="text-xs text-slate-400">{b.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Newsletter */}
      <div className="border-b border-slate-800">
        <div className="container mx-auto px-4 py-10">
          <div className="grid items-center gap-6 lg:grid-cols-2">
            <div>
              <h3 className="text-2xl font-bold text-white">
                Subscribe to our newsletter
              </h3>
              <p className="mt-2 text-sm text-slate-400">
                Get exclusive offers, new arrivals, and updates delivered to
                your inbox.
              </p>
            </div>
            <form
              onSubmit={handleSubscribe}
              className="flex w-full max-w-md gap-2 lg:justify-self-end"
            >
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="h-11 border-slate-700 bg-slate-900 text-white placeholder:text-slate-500 focus-visible:ring-[#1C398E]"
                aria-label="Email for newsletter"
              />
              <Button
                type="submit"
                className="h-11 bg-[#1C398E] px-5 hover:bg-[#152B6E]"
              >
                <Send className="h-4 w-4 sm:mr-2" />
                <span className="hidden sm:inline">Subscribe</span>
              </Button>
            </form>
          </div>
        </div>
      </div>

      {/* Main columns */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-3 lg:grid-cols-6">
          {/* Brand */}
          <div className="col-span-2 lg:col-span-2">
            <Link href="/" className="inline-block">
              <h3 className="text-2xl font-extrabold text-white">
                Rocks<span className="text-[#7B96E8]">Mart</span>
              </h3>
            </Link>
            <p className="mt-4 max-w-sm text-sm text-slate-400">
              Your trusted marketplace for quality products at unbeatable
              prices. Delivering happiness to your doorstep since 2020.
            </p>
            <div className="mt-5 space-y-2 text-sm">
              <a
                href="mailto:support@rocksmart.com"
                className="flex items-center gap-2 text-slate-400 transition hover:text-white"
              >
                <Mail className="h-4 w-4 text-[#7B96E8]" />
                support@rocksmart.com
              </a>
              <a
                href="tel:+8801700000000"
                className="flex items-center gap-2 text-slate-400 transition hover:text-white"
              >
                <Phone className="h-4 w-4 text-[#7B96E8]" />
                +880 1700-000000
              </a>
              <p className="flex items-start gap-2 text-slate-400">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-[#7B96E8]" />
                House 42, Road 11, Banani, Dhaka 1213, Bangladesh
              </p>
            </div>
            <div className="mt-5 flex gap-2">
              {SOCIALS.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  aria-label={s.label}
                  className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-800 text-slate-300 transition hover:bg-[#1C398E] hover:text-white"
                >
                  <s.icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Company */}
          <div>
            <h4 className="mb-4 text-sm font-bold uppercase tracking-wider text-white">
              Company
            </h4>
            <ul className="space-y-2.5 text-sm">
              {COMPANY_LINKS.map((l) => (
                <li key={l.href}>
                  <Link
                    href={l.href}
                    className="text-slate-400 transition hover:text-white"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Shop */}
          <div>
            <h4 className="mb-4 text-sm font-bold uppercase tracking-wider text-white">
              Shop
            </h4>
            <ul className="space-y-2.5 text-sm">
              {SHOP_LINKS.map((l) => (
                <li key={l.href}>
                  <Link
                    href={l.href}
                    className="text-slate-400 transition hover:text-white"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="mb-4 text-sm font-bold uppercase tracking-wider text-white">
              Support
            </h4>
            <ul className="space-y-2.5 text-sm">
              {SUPPORT_LINKS.map((l) => (
                <li key={l.href}>
                  <Link
                    href={l.href}
                    className="text-slate-400 transition hover:text-white"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="mb-4 text-sm font-bold uppercase tracking-wider text-white">
              Legal
            </h4>
            <ul className="space-y-2.5 text-sm">
              {LEGAL_LINKS.map((l) => (
                <li key={l.href}>
                  <Link
                    href={l.href}
                    className="text-slate-400 transition hover:text-white"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Categories + Brands (dynamic) */}
        {(categories.length > 0 || brands.length > 0) && (
          <div className="mt-10 grid gap-6 border-t border-slate-800 pt-8 md:grid-cols-2">
            {categories.length > 0 && (
              <div>
                <h4 className="mb-3 text-xs font-bold uppercase tracking-wider text-slate-500">
                  Popular Categories
                </h4>
                <div className="flex flex-wrap gap-2">
                  {categories.map((cat: any) => (
                    <Link
                      key={cat.id}
                      href={`/shop?categoryId=${cat.id}`}
                      className="rounded-full border border-slate-700 bg-slate-800/50 px-3 py-1 text-xs text-slate-300 transition hover:border-[#1C398E] hover:bg-[#1C398E]/20 hover:text-white"
                    >
                      {cat.name}
                    </Link>
                  ))}
                  <Link
                    href="/shop"
                    className="rounded-full px-3 py-1 text-xs font-medium text-[#7B96E8] hover:underline"
                  >
                    View all →
                  </Link>
                </div>
              </div>
            )}

            {brands.length > 0 && (
              <div>
                <h4 className="mb-3 text-xs font-bold uppercase tracking-wider text-slate-500">
                  Top Brands
                </h4>
                <div className="flex flex-wrap gap-2">
                  {brands.map((b: any) => (
                    <Link
                      key={b.id}
                      href={`/shop?brandId=${b.id}`}
                      className="rounded-full border border-slate-700 bg-slate-800/50 px-3 py-1 text-xs text-slate-300 transition hover:border-[#1C398E] hover:bg-[#1C398E]/20 hover:text-white"
                    >
                      {b.name}
                    </Link>
                  ))}
                  <Link
                    href="/shop"
                    className="rounded-full px-3 py-1 text-xs font-medium text-[#7B96E8] hover:underline"
                  >
                    View all →
                  </Link>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Bottom bar */}
      <div className="border-t border-slate-800 bg-slate-900">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col items-center justify-between gap-4 text-center md:flex-row md:text-left">
            <p className="text-sm text-slate-400">
              © {new Date().getFullYear()} RocksMart. All rights reserved.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs text-slate-400">
              <Link
                href="/privacy-policy"
                className="transition hover:text-white"
              >
                Privacy
              </Link>
              <Link href="/terms" className="transition hover:text-white">
                Terms
              </Link>
              <Link href="/cookies" className="transition hover:text-white">
                Cookies
              </Link>
              <Link href="/sitemap" className="transition hover:text-white">
                Sitemap
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
