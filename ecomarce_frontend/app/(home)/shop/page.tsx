import type { Metadata } from "next";
import ShopClient from "./_ShopClient";

export const metadata: Metadata = {
  title: "Shop All Products",
  description:
    "Browse thousands of products across fashion, electronics, home, beauty, and more on RocksMart. Filter by brand, category, price, and rating.",
  keywords: [
    "shop",
    "all products",
    "buy online",
    "categories",
    "brands",
    "product catalog",
    "RocksMart shop",
  ],
  alternates: { canonical: "/shop" },
  openGraph: {
    title: "Shop All Products | RocksMart",
    description: "Browse thousands of products across every category.",
    url: "/shop",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Shop All Products | RocksMart",
    description: "Browse thousands of products across every category.",
  },
};

export default function Page() {
  return <ShopClient />;
}
