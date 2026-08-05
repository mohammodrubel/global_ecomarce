import type { Metadata } from "next";
import LoginClient from "./_LoginClient";

export const metadata: Metadata = {
  title: "Sign In",
  description: "Sign in to your RocksMart account to manage orders, wishlist, and more.",
  alternates: { canonical: "/login" },
  robots: { index: false, follow: false },
  openGraph: {
    title: "Sign In | RocksMart",
    description: "Sign in to your RocksMart account.",
    url: "/login",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "Sign In | RocksMart",
    description: "Sign in to your RocksMart account.",
  },
};

export default function Page() {
  return <LoginClient />;
}
