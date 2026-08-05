import type { Metadata } from "next";
import AccountClient from "./_AccountClient";

export const metadata: Metadata = {
  title: "My Account",
  description: "Manage your RocksMart account, orders, addresses, and profile.",
  alternates: { canonical: "/account" },
  robots: { index: false, follow: false },
};

export default function Page() {
  return <AccountClient />;
}
