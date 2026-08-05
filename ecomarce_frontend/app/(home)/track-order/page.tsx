import type { Metadata } from "next";
import TrackOrderClient from "./_TrackOrderClient";

export const metadata: Metadata = {
  title: "Track Your Order",
  description:
    "Track your RocksMart order in real time. Enter your order ID and email to see current status, shipping progress, and delivery updates.",
  keywords: [
    "track order",
    "order status",
    "shipment tracking",
    "delivery status",
    "RocksMart tracking",
  ],
  alternates: { canonical: "/track-order" },
  openGraph: {
    title: "Track Your Order | RocksMart",
    description: "Real-time order and shipment tracking.",
    url: "/track-order",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "Track Your Order | RocksMart",
    description: "Real-time order and shipment tracking.",
  },
};

export default function Page() {
  return <TrackOrderClient />;
}
