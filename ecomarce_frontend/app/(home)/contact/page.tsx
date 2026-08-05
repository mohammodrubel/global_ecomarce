import type { Metadata } from "next";
import ContactClient from "./_ContactClient";

export const metadata: Metadata = {
  title: "Contact Us",
  description:
    "Get in touch with RocksMart — email, phone, live chat, and support hours. We reply within 24 hours on business days.",
  keywords: [
    "contact RocksMart",
    "customer service",
    "email support",
    "live chat",
    "help",
    "get in touch",
  ],
  alternates: { canonical: "/contact" },
  openGraph: {
    title: "Contact RocksMart",
    description: "Reach our support team — email, phone, and live chat.",
    url: "/contact",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "Contact RocksMart",
    description: "Reach our support team.",
  },
};

export default function Page() {
  return <ContactClient />;
}
