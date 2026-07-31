import { ShoppingBag } from "lucide-react";
import Link from "next/link";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative min-h-screen w-full overflow-hidden flex items-center justify-center p-4 sm:p-6 bg-[#eef2ff]">
      {/* Base gradient */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-indigo-100 via-blue-100 to-cyan-100" />

      {/* Small dot pattern (visible) */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage:
            "radial-gradient(circle at 1px 1px, rgba(28,57,142,0.28) 1.5px, transparent 0)",
          backgroundSize: "22px 22px",
        }}
      />

      {/* Plus-sign micro pattern overlay */}
      <div
        className="pointer-events-none absolute inset-0 opacity-40"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='44' height='44' viewBox='0 0 44 44'><g fill='none' stroke='%231C398E' stroke-opacity='0.15' stroke-width='1'><path d='M22 18v8M18 22h8'/></g></svg>\")",
          backgroundSize: "44px 44px",
        }}
      />

      {/* Vibrant color blobs */}
      <div className="pointer-events-none absolute -top-32 -left-32 w-[500px] h-[500px] bg-blue-400/50 rounded-full blur-3xl" />
      <div className="pointer-events-none absolute -bottom-32 -right-32 w-[600px] h-[600px] bg-fuchsia-400/40 rounded-full blur-3xl" />
      <div className="pointer-events-none absolute top-1/4 right-1/4 w-[300px] h-[300px] bg-cyan-400/40 rounded-full blur-3xl" />
      <div className="pointer-events-none absolute bottom-1/4 left-1/4 w-[280px] h-[280px] bg-violet-400/40 rounded-full blur-3xl" />

      {/* Diagonal shine */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-tr from-transparent via-white/20 to-transparent" />

      {/* Card */}
      <div className="relative w-full max-w-md">
        <div className="relative bg-white rounded-3xl shadow-[0_25px_70px_-20px_rgba(28,57,142,0.35)] border border-white/80 p-7 sm:p-9 ring-1 ring-slate-100">
          {/* Top accent bar */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 h-1.5 w-28 bg-gradient-to-r from-blue-600 via-cyan-500 to-fuchsia-500 rounded-b-full shadow-md" />

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
  );
}
