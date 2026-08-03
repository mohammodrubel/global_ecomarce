"use client";

import Link from "next/link";
import Image from "next/image";
import { useMemo, useState } from "react";
import {
  Ban,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Clock,
  MapPin,
  Package,
  PackageOpen,
  Star,
  Truck,
  XCircle,
} from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { EmptyState } from "@/components/dashboard/EmptyState";
import { ErrorState } from "@/components/dashboard/ErrorState";
import { StatusBadge } from "@/components/dashboard/StatusBadge";
import { TableSkeleton } from "@/components/dashboard/LoadingSkeleton";
import {
  useCancelOrderMutation,
  useGetMyOrdersQuery,
} from "@/redux/fetchers/order/orderApi";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  useCreateReviewMutation,
  useGetMyReviewsQuery,
} from "@/redux/fetchers/review/reviewApi";

const statusMap = (s: string) => {
  switch (s) {
    case "PENDING": return { tone: "warning" as const, Icon: Clock };
    case "PROCESSING": return { tone: "primary" as const, Icon: Package };
    case "SHIPPED": return { tone: "indigo" as const, Icon: Truck };
    case "DELIVERED": return { tone: "success" as const, Icon: CheckCircle2 };
    case "CANCELLED": return { tone: "error" as const, Icon: XCircle };
    default: return { tone: "neutral" as const, Icon: Clock };
  }
};

export default function UserOrdersPage() {
  const { data, isLoading, isError, refetch } = useGetMyOrdersQuery(undefined);
  const [cancelOrder, { isLoading: cancelling }] = useCancelOrderMutation();
  const [openId, setOpenId] = useState<string | null>(null);

  const orders = data?.data || [];

  const { data: myReviewsRes } = useGetMyReviewsQuery(undefined);
  const reviewedProductIds = useMemo(
    () => new Set<string>((myReviewsRes?.data || []).map((r: any) => r.productId)),
    [myReviewsRes],
  );

  const [reviewTarget, setReviewTarget] = useState<{
    productId: string;
    productName: string;
  } | null>(null);
  const [reviewRating, setReviewRating] = useState(0);
  const [reviewHover, setReviewHover] = useState(0);
  const [reviewComment, setReviewComment] = useState("");
  const [createReview, { isLoading: submittingReview }] = useCreateReviewMutation();

  const openReview = (productId: string, productName: string) => {
    setReviewTarget({ productId, productName });
    setReviewRating(0);
    setReviewHover(0);
    setReviewComment("");
  };

  const submitReview = async () => {
    if (!reviewTarget) return;
    if (reviewRating < 1) {
      toast.error("Select a rating");
      return;
    }
    try {
      await createReview({
        productId: reviewTarget.productId,
        rating: reviewRating,
        comment: reviewComment.trim() || undefined,
      }).unwrap();
      toast.success("Review submitted");
      setReviewTarget(null);
    } catch (e: any) {
      toast.error(e?.data?.message || "Failed to submit review");
    }
  };

  const handleCancel = async (id: string) => {
    if (!confirm("Cancel this order?")) return;
    try {
      await cancelOrder(id).unwrap();
      toast.success("Order cancelled");
    } catch (e: any) {
      toast.error(e?.data?.message || "Cancel failed");
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="My Orders"
        description={
          isLoading
            ? "Loading your orders..."
            : `${orders.length} ${orders.length === 1 ? "order" : "orders"} placed`
        }
      />

      {isLoading && <TableSkeleton rows={4} />}
      {isError && <ErrorState onRetry={refetch} />}

      {!isLoading && !isError && orders.length === 0 && (
        <EmptyState
          Icon={PackageOpen}
          title="No orders yet"
          description="When you place an order, it will appear here with status updates."
          action={
            <Button asChild size="sm" className="bg-[#2563EB] hover:bg-[#1D4ED8]">
              <Link href="/shop">Start Shopping</Link>
            </Button>
          }
        />
      )}

      <Dialog
        open={reviewTarget !== null}
        onOpenChange={(open) => !open && setReviewTarget(null)}
      >
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Write a review</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <p className="text-sm text-slate-500">Product</p>
              <p className="font-medium text-slate-900 line-clamp-2">
                {reviewTarget?.productName}
              </p>
            </div>
            <div>
              <Label className="text-sm font-medium text-slate-700 mb-2 block">
                Rating
              </Label>
              <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5].map((n) => {
                  const filled = (reviewHover || reviewRating) >= n;
                  return (
                    <button
                      key={n}
                      type="button"
                      onMouseEnter={() => setReviewHover(n)}
                      onMouseLeave={() => setReviewHover(0)}
                      onClick={() => setReviewRating(n)}
                      className="p-1"
                      aria-label={`${n} star${n === 1 ? "" : "s"}`}
                    >
                      <Star
                        className={`h-7 w-7 transition-colors ${
                          filled
                            ? "fill-amber-400 text-amber-400"
                            : "text-slate-300"
                        }`}
                      />
                    </button>
                  );
                })}
                <span className="ml-2 text-sm text-slate-600">
                  {reviewRating > 0 ? `${reviewRating}/5` : "Select"}
                </span>
              </div>
            </div>
            <div>
              <Label
                htmlFor="review-comment"
                className="text-sm font-medium text-slate-700 mb-1.5 block"
              >
                Comment (optional)
              </Label>
              <textarea
                id="review-comment"
                rows={4}
                value={reviewComment}
                onChange={(e) => setReviewComment(e.target.value)}
                placeholder="Share your experience..."
                className="w-full rounded-md border border-slate-200 bg-slate-50 px-3 py-2 text-sm outline-none focus:bg-white focus:border-[#2563EB] focus-visible:ring-2 focus-visible:ring-[#2563EB]/20"
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setReviewTarget(null)}
              disabled={submittingReview}
            >
              Cancel
            </Button>
            <Button
              onClick={submitReview}
              disabled={submittingReview || reviewRating < 1}
              className="bg-[#2563EB] hover:bg-[#1D4ED8]"
            >
              {submittingReview ? "Submitting..." : "Submit review"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <div className="space-y-3">
        {orders.map((o: any) => {
          const { tone, Icon } = statusMap(o.status);
          const isOpen = openId === o.id;
          const canCancel = o.status === "PENDING" || o.status === "PROCESSING";
          return (
            <Card
              key={o.id}
              className="border-slate-200 shadow-none rounded-xl overflow-hidden"
            >
              <CardContent className="p-0">
                <div className="p-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <p className="font-mono text-sm font-semibold text-slate-900">
                        #{o.id.slice(0, 8).toUpperCase()}
                      </p>
                      <StatusBadge tone={tone} Icon={Icon}>
                        {o.status}
                      </StatusBadge>
                    </div>
                    <p className="text-xs text-slate-500">
                      {new Date(o.createdAt).toLocaleString()} · {o.items?.length || 0} item(s)
                    </p>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <p className="text-[11px] text-slate-500 uppercase tracking-wider">Total</p>
                      <p className="text-lg font-semibold text-slate-900">
                        ৳{o.totalPrice.toFixed(2)}
                      </p>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setOpenId(isOpen ? null : o.id)}
                      className="border-slate-200"
                    >
                      {isOpen ? (
                        <>
                          Hide
                          <ChevronUp className="h-3.5 w-3.5 ml-1.5" />
                        </>
                      ) : (
                        <>
                          Details
                          <ChevronDown className="h-3.5 w-3.5 ml-1.5" />
                        </>
                      )}
                    </Button>
                  </div>
                </div>

                {isOpen && (
                  <>
                    <Separator />
                    <div className="p-5 space-y-4 bg-slate-50/40">
                      <div>
                        <h3 className="text-[10px] uppercase tracking-wider font-semibold text-slate-500 mb-2">
                          Items ({o.items.length})
                        </h3>
                        <div className="space-y-2">
                          {o.items.map((it: any) => {
                            const canReview =
                              o.status === "DELIVERED" &&
                              !reviewedProductIds.has(it.productId);
                            const alreadyReviewed =
                              o.status === "DELIVERED" &&
                              reviewedProductIds.has(it.productId);
                            return (
                              <div
                                key={it.id}
                                className="flex items-center gap-3 bg-white rounded-lg p-2.5 border border-slate-100"
                              >
                                <div className="relative w-11 h-11 rounded-md overflow-hidden bg-slate-100 flex-shrink-0">
                                  <Image
                                    src={it.product?.images?.[0] || "/placeholder.svg"}
                                    alt={it.product?.name || "Product"}
                                    fill
                                    sizes="44px"
                                    className="object-cover"
                                  />
                                </div>
                                <div className="min-w-0 flex-1">
                                  <Link
                                    href={`/shop/${it.productId}`}
                                    className="text-sm font-medium text-slate-900 hover:text-[#2563EB] line-clamp-1"
                                  >
                                    {it.product?.name || "Product"}
                                  </Link>
                                  <p className="text-xs text-slate-500 mt-0.5">
                                    ৳{it.price.toFixed(2)} × {it.quantity}
                                  </p>
                                </div>
                                <div className="flex flex-col items-end gap-1">
                                  <p className="text-sm font-semibold text-slate-900 whitespace-nowrap">
                                    ৳{(it.price * it.quantity).toFixed(2)}
                                  </p>
                                  {canReview && (
                                    <Button
                                      size="sm"
                                      variant="outline"
                                      onClick={() =>
                                        openReview(
                                          it.productId,
                                          it.product?.name || "Product",
                                        )
                                      }
                                      className="h-7 text-[11px] border-amber-300 text-amber-700 hover:bg-amber-50"
                                    >
                                      <Star className="h-3 w-3 mr-1" />
                                      Write review
                                    </Button>
                                  )}
                                  {alreadyReviewed && (
                                    <span className="inline-flex items-center gap-1 text-[11px] text-emerald-700 font-medium">
                                      <CheckCircle2 className="h-3 w-3" />
                                      Reviewed
                                    </span>
                                  )}
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>

                      <div className="grid sm:grid-cols-2 gap-3">
                        <div className="bg-white rounded-lg p-4 border border-slate-100">
                          <div className="flex items-center gap-1.5 text-[10px] uppercase tracking-wider font-semibold text-slate-500 mb-2">
                            <MapPin className="h-3.5 w-3.5" />
                            Shipping
                          </div>
                          <p className="text-sm font-medium text-slate-900">
                            {o.fullName}
                          </p>
                          <p className="text-xs text-slate-600 mt-1">
                            {o.address}, {o.city} {o.postalCode}, {o.country}
                          </p>
                          <p className="text-xs text-slate-600 mt-1">{o.phone}</p>
                        </div>

                        <div className="bg-white rounded-lg p-4 border border-slate-100 space-y-1.5 text-sm">
                          <div className="flex justify-between text-slate-600">
                            <span>Subtotal</span>
                            <span>৳{o.subtotal.toFixed(2)}</span>
                          </div>
                          {o.discount > 0 && (
                            <div className="flex justify-between text-emerald-700">
                              <span>
                                Discount {o.couponCode ? `(${o.couponCode})` : ""}
                              </span>
                              <span>-৳{o.discount.toFixed(2)}</span>
                            </div>
                          )}
                          <div className="flex justify-between text-slate-600">
                            <span>Shipping</span>
                            <span>৳{o.shipping.toFixed(2)}</span>
                          </div>
                          <Separator />
                          <div className="flex justify-between font-semibold text-slate-900">
                            <span>Total</span>
                            <span>৳{o.totalPrice.toFixed(2)}</span>
                          </div>
                          <p className="text-[11px] text-slate-500 pt-1">
                            Payment method: {o.paymentMethod}
                          </p>
                        </div>
                      </div>

                      {canCancel && (
                        <div className="flex justify-end">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleCancel(o.id)}
                            disabled={cancelling}
                            className="text-red-600 border-red-200 hover:bg-red-50 hover:text-red-700"
                          >
                            <Ban className="h-3.5 w-3.5 mr-1.5" />
                            Cancel Order
                          </Button>
                        </div>
                      )}
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
