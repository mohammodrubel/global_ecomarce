import type { Metadata } from "next";
import HomeClient from "./_HomeClient";

export const metadata: Metadata = {
  title: "RocksMart — Online Shopping for Fashion, Electronics & More",
  description:
    "Shop fashion, electronics, home decor, and everyday essentials on RocksMart. Verified brands, best deals, free shipping, and fast delivery.",
  keywords: [
    "online shopping",
    "ecommerce",
    "shop online",
    "fashion",
    "electronics",
    "home decor",
    "best deals",
    "free shipping",
    "RocksMart",
  ],
  alternates: { canonical: "/" },
  openGraph: {
    title: "RocksMart — Online Shopping for Fashion, Electronics & More",
    description:
      "Verified brands, best deals, free shipping, and fast delivery.",
    url: "/",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "RocksMart — Online Shopping",
    description: "Verified brands, best deals, and fast delivery.",
  },
};

export default function Page() {
  return <HomeClient />;
}
