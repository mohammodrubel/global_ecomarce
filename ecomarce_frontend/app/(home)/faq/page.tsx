import type { Metadata } from "next";
import FaqClient from "./_FaqClient";

export const metadata: Metadata = {
  title: "Frequently Asked Questions",
  description:
    "Answers to common questions about RocksMart orders, shipping, returns, payments, account, and more.",
  keywords: [
    "FAQ",
    "frequently asked questions",
    "RocksMart FAQ",
    "order questions",
    "shipping questions",
    "return questions",
  ],
  alternates: { canonical: "/faq" },
  openGraph: {
    title: "FAQ | RocksMart",
    description: "Answers to common shopper questions.",
    url: "/faq",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "FAQ | RocksMart",
    description: "Answers to common shopper questions.",
  },
};

export default function Page() {
  return <FaqClient />;
}
