import type { Metadata } from "next";
import CartClient from "./_CartClient";

export const metadata: Metadata = {
  title: "Shopping Cart",
  description: "Review items in your RocksMart shopping cart before checkout.",
  alternates: { canonical: "/cart" },
  robots: { index: false, follow: false },
};

export default function Page() {
  return <CartClient />;
}
