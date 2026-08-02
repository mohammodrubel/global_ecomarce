import { Header } from "@/components/Header";
import { Navigation } from "@/components/Navigation";
import Footer from "@/components/share/Footer";
import { ShoppingBag } from "lucide-react";
import Link from "next/link";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Header />
      <Navigation />
      <div className="relative w-full flex items-center justify-center p-4 sm:p-6 bg-white py-10">
        {/* Card */}
        <div className="relative w-full max-w-md">
          <div className="relative bg-white rounded-3xl shadow-[0_25px_70px_-20px_rgba(28,57,142,0.35)] border border-white/80 p-7 sm:p-9 ring-1 ring-slate-100">
            {/* Logo */}
            <Link
              href="/"
              className="flex items-center justify-center gap-2.5 mb-8"
            >
              <div className="p-2.5 rounded-2xl bg-[#1C398E] text-white">
                <ShoppingBag className="h-5 w-5" />
              </div>
              <span className="text-2xl font-extrabold tracking-tight text-slate-900">
                Rocks<span className="text-[#1C398E]">Mart</span>
              </span>
            </Link>

            {children}
          </div>

          <p className="mt-5 text-center text-xs text-slate-600">
            © {new Date().getFullYear()} RocksMart. All rights reserved.
          </p>
        </div>
      </div>
      <Footer />
    </>
  );
}
