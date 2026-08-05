import type { Metadata } from "next";
import CheckoutClient from "./_CheckoutClient";

export const metadata: Metadata = {
  title: "Checkout",
  description: "Secure checkout on RocksMart.",
  alternates: { canonical: "/checkout" },
  robots: { index: false, follow: false, nocache: true },
};

export default function Page() {
  return <CheckoutClient />;
}
