"use client";

import { useState } from "react";
import Link from "next/link";
import { toast } from "sonner";
import {
  Mail,
  Loader2,
  ArrowRight,
  ArrowLeft,
  MailCheck,
  KeyRound,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await new Promise((r) => setTimeout(r, 900));
      setSent(true);
      toast.success("Reset link sent — check your inbox");
    } catch {
      toast.error("Something went wrong. Try again.");
    } finally {
      setLoading(false);
    }
  };

  if (sent) {
    return (
      <div className="space-y-6 text-center">
        <div className="relative mx-auto w-20 h-20">
          <div className="absolute inset-0 bg-gradient-to-br from-emerald-400 to-cyan-500 rounded-2xl blur-xl opacity-40" />
          <div className="relative w-full h-full rounded-2xl bg-gradient-to-br from-emerald-500 to-cyan-500 flex items-center justify-center text-white shadow-lg">
            <MailCheck className="h-9 w-9" />
          </div>
        </div>
        <div>
          <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            Check your email
          </h2>
          <p className="text-slate-500 mt-2 text-sm">
            We sent a reset link to
            <br />
            <span className="font-semibold text-slate-800">{email}</span>
          </p>
        </div>
        <div className="space-y-2 pt-2">
          <Button
            onClick={() => setSent(false)}
            variant="outline"
            className="w-full h-11 rounded-xl border-slate-200 hover:bg-slate-50"
          >
            Use a different email
          </Button>
          <Link href="/login" className="block">
            <Button
              variant="ghost"
              className="w-full h-11 rounded-xl text-slate-600 hover:text-slate-900"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to sign in
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <div className="relative mx-auto w-16 h-16 mb-4">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-2xl blur-lg opacity-40" />
          <div className="relative w-full h-full rounded-2xl bg-gradient-to-br from-blue-600 to-cyan-500 flex items-center justify-center text-white shadow-lg">
            <KeyRound className="h-7 w-7" />
          </div>
        </div>
        <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">
          Forgot password?
        </h2>
        <p className="text-slate-500 mt-2 text-sm">
          No worries — enter your email and we'll send a reset link
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="relative">
          <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 z-10" />
          <Input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder=" "
            required
            autoComplete="email"
            className="peer pl-10 h-12 rounded-xl border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 bg-slate-50/50"
          />
          <Label
            htmlFor="email"
            className="absolute left-10 top-1/2 -translate-y-1/2 text-slate-400 text-sm pointer-events-none transition-all peer-focus:-top-0 peer-focus:left-3 peer-focus:text-xs peer-focus:bg-white peer-focus:px-1.5 peer-focus:text-blue-600 peer-[:not(:placeholder-shown)]:-top-0 peer-[:not(:placeholder-shown)]:left-3 peer-[:not(:placeholder-shown)]:text-xs peer-[:not(:placeholder-shown)]:bg-white peer-[:not(:placeholder-shown)]:px-1.5"
          >
            Email address
          </Label>
        </div>

        <Button
          type="submit"
          disabled={loading}
          className="group w-full h-12 rounded-xl bg-gradient-to-r from-blue-600 via-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white font-semibold shadow-lg shadow-blue-600/30 hover:shadow-xl hover:shadow-blue-600/40 transition-all"
        >
          {loading ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Sending link...
            </>
          ) : (
            <>
              Send reset link
              <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-0.5 transition" />
            </>
          )}
        </Button>
      </form>

      <div className="text-center">
        <Link
          href="/login"
          className="inline-flex items-center gap-1.5 text-sm text-slate-600 hover:text-slate-900 font-medium transition"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to sign in
        </Link>
      </div>
    </div>
  );
}
