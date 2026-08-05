import type { Metadata } from "next";
import WishlistClient from "./_WishlistClient";

export const metadata: Metadata = {
  title: "My Wishlist",
  description: "Your saved wishlist items on RocksMart.",
  alternates: { canonical: "/wishlist" },
  robots: { index: false, follow: false },
};

export default function Page() {
  return <WishlistClient />;
}
