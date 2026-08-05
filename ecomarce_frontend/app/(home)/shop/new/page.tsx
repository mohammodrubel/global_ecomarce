import type { Metadata } from "next";
import NewArrivalsClient from "./_NewArrivalsClient";

export const metadata: Metadata = {
  title: "New Arrivals",
  description:
    "Discover the newest products just landed at RocksMart. Fresh drops in fashion, electronics, home, and more — updated daily.",
  keywords: [
    "new arrivals",
    "latest products",
    "new drops",
    "just in",
    "trending",
    "RocksMart new",
  ],
  alternates: { canonical: "/shop/new" },
  openGraph: {
    title: "New Arrivals | RocksMart",
    description: "Fresh drops updated daily.",
    url: "/shop/new",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "New Arrivals | RocksMart",
    description: "Fresh drops updated daily.",
  },
};

export default function Page() {
  return <NewArrivalsClient />;
}
