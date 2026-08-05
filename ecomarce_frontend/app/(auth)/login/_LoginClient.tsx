"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import { toast } from "sonner";
import { Eye, EyeOff, Mail, Lock, Loader2, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useLoginMutation } from "@/redux/fetchers/auth/authApi";
import { setUser } from "@/redux/fetchers/auth/authSlice";
import { JwtDecode } from "@/lib/jwtDecoder";

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [login, { isLoading }] = useLoginMutation();
  const dispatch = useDispatch();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await login({ email, password }).unwrap();
      const token = res?.data?.access_token;
      if (!token) throw new Error("No token returned");
      const user = JwtDecode(token);
      dispatch(setUser({ user, token }));
      toast.success("Welcome back!");
      router.push(user.role === "ADMIN" ? "/dashboard" : "/");
    } catch (err: any) {
      toast.error(err?.data?.message || "Invalid email or password");
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">
          Welcome back
        </h2>
        <p className="text-slate-500 mt-2 text-sm">
          Sign in to your account to continue
        </p>
      </div>

      {/* Social */}
      <div className="grid grid-cols-2 gap-3">
        <SocialButton label="Google" icon={<GoogleIcon />} />
        <SocialButton label="GitHub" icon={<GitHubIcon />} />
      </div>

      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-slate-200" />
        </div>
        <div className="relative flex justify-center text-xs uppercase tracking-wider">
          <span className="bg-white px-3 text-slate-400 font-medium">
            or continue with email
          </span>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <FloatingInput
          id="email"
          type="email"
          label="Email address"
          icon={<Mail className="h-4 w-4" />}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          autoComplete="email"
          required
        />

        <div className="space-y-1.5">
          <div className="relative">
            <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 z-10" />
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder=" "
              required
              autoComplete="current-password"
              className="peer pl-10 pr-10 h-12 rounded-xl border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 bg-slate-50/50"
            />
            <Label
              htmlFor="password"
              className="absolute left-10 top-1/2 -translate-y-1/2 text-slate-400 text-sm pointer-events-none transition-all peer-focus:-top-0 peer-focus:left-3 peer-focus:text-xs peer-focus:bg-white peer-focus:px-1.5 peer-focus:text-blue-600 peer-[:not(:placeholder-shown)]:-top-0 peer-[:not(:placeholder-shown)]:left-3 peer-[:not(:placeholder-shown)]:text-xs peer-[:not(:placeholder-shown)]:bg-white peer-[:not(:placeholder-shown)]:px-1.5"
            >
              Password
            </Label>
            <button
              type="button"
              onClick={() => setShowPassword((v) => !v)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 transition"
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
        </div>

        <div className="flex items-center justify-between text-sm">
          <label className="flex items-center gap-2 cursor-pointer group">
            <input
              type="checkbox"
              checked={remember}
              onChange={(e) => setRemember(e.target.checked)}
              className="peer sr-only"
            />
            <span className="w-4 h-4 rounded border-2 border-slate-300 peer-checked:bg-blue-600 peer-checked:border-blue-600 flex items-center justify-center transition">
              <svg
                className="w-2.5 h-2.5 text-white opacity-0 peer-checked:opacity-100 transition"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
              </svg>
            </span>
            <span className="text-slate-600 group-hover:text-slate-900 transition">
              Remember me
            </span>
          </label>
          <Link
            href="/forgot-password"
            className="text-blue-600 hover:text-blue-700 font-medium"
          >
            Forgot password?
          </Link>
        </div>

        <Button
          type="submit"
          disabled={isLoading}
          className="group w-full h-12 rounded-xl bg-gradient-to-r from-blue-600 via-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white font-semibold shadow-lg shadow-blue-600/30 hover:shadow-xl hover:shadow-blue-600/40 transition-all"
        >
          {isLoading ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Signing in...
            </>
          ) : (
            <>
              Sign in
              <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-0.5 transition" />
            </>
          )}
        </Button>
      </form>

      <p className="text-center text-sm text-slate-600">
        Don't have an account?{" "}
        <Link
          href="/register"
          className="text-blue-600 hover:text-blue-700 font-semibold"
        >
          Sign up free
        </Link>
      </p>
    </div>
  );
}

function FloatingInput({
  id,
  type,
  label,
  icon,
  value,
  onChange,
  autoComplete,
  required,
  minLength,
}: {
  id: string;
  type: string;
  label: string;
  icon: React.ReactNode;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  autoComplete?: string;
  required?: boolean;
  minLength?: number;
}) {
  return (
    <div className="relative">
      <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 z-10">
        {icon}
      </div>
      <Input
        id={id}
        type={type}
        value={value}
        onChange={onChange}
        placeholder=" "
        required={required}
        minLength={minLength}
        autoComplete={autoComplete}
        className="peer pl-10 h-12 rounded-xl border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 bg-slate-50/50"
      />
      <Label
        htmlFor={id}
        className="absolute left-10 top-1/2 -translate-y-1/2 text-slate-400 text-sm pointer-events-none transition-all peer-focus:-top-0 peer-focus:left-3 peer-focus:text-xs peer-focus:bg-white peer-focus:px-1.5 peer-focus:text-blue-600 peer-[:not(:placeholder-shown)]:-top-0 peer-[:not(:placeholder-shown)]:left-3 peer-[:not(:placeholder-shown)]:text-xs peer-[:not(:placeholder-shown)]:bg-white peer-[:not(:placeholder-shown)]:px-1.5"
      >
        {label}
      </Label>
    </div>
  );
}

function SocialButton({ label, icon }: { label: string; icon: React.ReactNode }) {
  return (
    <button
      type="button"
      className="flex items-center justify-center gap-2 h-11 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 hover:border-slate-300 transition text-sm font-medium text-slate-700 shadow-sm hover:shadow"
    >
      {icon}
      {label}
    </button>
  );
}

function GoogleIcon() {
  return (
    <svg className="w-4 h-4" viewBox="0 0 24 24">
      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
    </svg>
  );
}

function GitHubIcon() {
  return (
    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 .5C5.65.5.5 5.65.5 12c0 5.08 3.29 9.39 7.86 10.91.58.1.79-.25.79-.56v-2c-3.2.69-3.88-1.36-3.88-1.36-.53-1.34-1.29-1.7-1.29-1.7-1.05-.72.08-.7.08-.7 1.16.08 1.77 1.19 1.77 1.19 1.03 1.77 2.7 1.26 3.36.96.1-.75.4-1.26.73-1.55-2.55-.29-5.24-1.28-5.24-5.7 0-1.26.45-2.29 1.19-3.1-.12-.29-.51-1.47.11-3.06 0 0 .97-.31 3.18 1.18a11 11 0 015.79 0c2.21-1.49 3.18-1.18 3.18-1.18.62 1.59.23 2.77.11 3.06.74.81 1.19 1.84 1.19 3.1 0 4.43-2.69 5.4-5.25 5.69.41.35.78 1.05.78 2.11v3.13c0 .31.21.67.79.56C20.21 21.39 23.5 17.08 23.5 12 23.5 5.65 18.35.5 12 .5z" />
    </svg>
  );
}
