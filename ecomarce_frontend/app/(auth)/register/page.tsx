import type { Metadata } from "next";
import RegisterClient from "./_RegisterClient";

export const metadata: Metadata = {
  title: "Create Account",
  description: "Create a free RocksMart account to enjoy fast checkout, order tracking, wishlists, and exclusive deals.",
  alternates: { canonical: "/register" },
  robots: { index: false, follow: false },
  openGraph: {
    title: "Create Account | RocksMart",
    description: "Sign up in seconds for a better shopping experience.",
    url: "/register",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "Create Account | RocksMart",
    description: "Sign up in seconds for a better shopping experience.",
  },
};

export default function Page() {
  return <RegisterClient />;
}
