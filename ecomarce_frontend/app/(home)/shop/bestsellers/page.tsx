import type { Metadata } from "next";
import BestsellersClient from "./_BestsellersClient";

export const metadata: Metadata = {
  title: "Bestsellers",
  description:
    "Shop the most-loved and top-rated products on RocksMart. Our customers' favorites across every category.",
  keywords: [
    "bestsellers",
    "top rated",
    "most popular",
    "customer favorites",
    "trending products",
    "RocksMart bestsellers",
  ],
  alternates: { canonical: "/shop/bestsellers" },
  openGraph: {
    title: "Bestsellers | RocksMart",
    description: "Top-rated, most-loved products.",
    url: "/shop/bestsellers",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Bestsellers | RocksMart",
    description: "Top-rated, most-loved products.",
  },
};

export default function Page() {
  return <BestsellersClient />;
}
