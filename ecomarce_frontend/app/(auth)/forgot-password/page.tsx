import type { Metadata } from "next";
import ForgotPasswordClient from "./_ForgotPasswordClient";

export const metadata: Metadata = {
  title: "Forgot Password",
  description: "Reset your RocksMart account password.",
  alternates: { canonical: "/forgot-password" },
  robots: { index: false, follow: false },
  openGraph: {
    title: "Forgot Password | RocksMart",
    description: "Reset your RocksMart account password.",
    url: "/forgot-password",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "Forgot Password | RocksMart",
    description: "Reset your RocksMart account password.",
  },
};

export default function Page() {
  return <ForgotPasswordClient />;
}
