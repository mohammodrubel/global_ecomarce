"use client";

import Link from "next/link";
import { MessageSquareText } from "lucide-react";

import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { EmptyState } from "@/components/dashboard/EmptyState";

export default function UserReviewsPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="My Reviews"
        description="Reviews you've left on purchased products"
      />

      <EmptyState
        Icon={MessageSquareText}
        title="No reviews yet"
        description="Once your orders are delivered, you can rate and review them here."
        action={
          <Button asChild size="sm" className="bg-[#2563EB] hover:bg-[#1D4ED8]">
            <Link href="/shop">Browse Products</Link>
          </Button>
        }
      />
    </div>
  );
}
