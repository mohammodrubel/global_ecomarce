"use client";

import Link from "next/link";
import Image from "next/image";
import { MessageSquareText, Star } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { EmptyState } from "@/components/dashboard/EmptyState";
import { ErrorState } from "@/components/dashboard/ErrorState";
import { TableSkeleton } from "@/components/dashboard/LoadingSkeleton";
import { useGetMyReviewsQuery } from "@/redux/fetchers/review/reviewApi";

function renderStars(rating: number) {
  return [...Array(5)].map((_, i) => (
    <Star
      key={i}
      className={`h-4 w-4 ${
        i < Math.round(rating)
          ? "fill-amber-400 text-amber-400"
          : "text-slate-300"
      }`}
    />
  ));
}

export default function UserReviewsPage() {
  const { data, isLoading, isError, refetch } = useGetMyReviewsQuery(undefined);
  const reviews = data?.data || [];

  return (
    <div className="space-y-6">
      <PageHeader
        title="My Reviews"
        description={
          isLoading
            ? "Loading your reviews..."
            : `${reviews.length} ${reviews.length === 1 ? "review" : "reviews"} submitted`
        }
      />

      {isLoading && <TableSkeleton rows={4} />}
      {isError && <ErrorState onRetry={refetch} />}

      {!isLoading && !isError && reviews.length === 0 && (
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
      )}

      <div className="space-y-3">
        {reviews.map((r: any) => (
          <Link
            key={r.id}
            href={`/shop/${r.productId}`}
            className="block group"
          >
            <Card className="border-slate-200 shadow-none rounded-xl overflow-hidden transition-all group-hover:border-[#2563EB] group-hover:shadow-md">
              <CardContent className="p-4 flex gap-4">
                <div className="relative w-20 h-20 rounded-lg overflow-hidden bg-slate-100 border border-slate-200 flex-shrink-0">
                  <Image
                    src={r.product?.images?.[0] || "/placeholder.svg"}
                    alt={r.product?.name || "Product"}
                    fill
                    sizes="80px"
                    className="object-cover"
                  />
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex items-start justify-between gap-3 mb-1">
                    <div className="min-w-0">
                      <p className="font-semibold text-slate-900 line-clamp-1 group-hover:text-[#2563EB]">
                        {r.product?.name || "Product"}
                      </p>
                      {r.product?.brand?.name && (
                        <p className="text-[11px] text-slate-500 mt-0.5">
                          {r.product.brand.name}
                        </p>
                      )}
                    </div>
                    <span className="text-xs text-slate-500 whitespace-nowrap">
                      {new Date(r.createdAt).toLocaleDateString()}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 mb-2">
                    <div className="flex">{renderStars(r.rating)}</div>
                    <span className="text-xs font-medium text-slate-700">
                      {r.rating}/5
                    </span>
                  </div>

                  {r.comment ? (
                    <p className="text-sm text-slate-700 line-clamp-2">
                      {r.comment}
                    </p>
                  ) : (
                    <p className="text-xs text-slate-400 italic">
                      No comment added
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
