"use client";

import Link from "next/link";
import {
  BadgeCheck,
  Clock,
  Loader2,
  Percent,
  Plus,
  Power,
  Ticket,
  Trash2,
} from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { EmptyState } from "@/components/dashboard/EmptyState";
import { ErrorState } from "@/components/dashboard/ErrorState";
import { StatusBadge } from "@/components/dashboard/StatusBadge";
import { CardGridSkeleton } from "@/components/dashboard/LoadingSkeleton";
import {
  useDeleteCouponMutation,
  useGetAllCouponsQuery,
  useToggleCouponMutation,
} from "@/redux/fetchers/coupon/couponApi";

export default function CouponsPage() {
  const { data, isLoading, isError, refetch } = useGetAllCouponsQuery(undefined);
  const [toggleCoupon] = useToggleCouponMutation();
  const [deleteCoupon] = useDeleteCouponMutation();

  const coupons = data?.data || [];

  const handleToggle = async (id: string) => {
    try {
      await toggleCoupon(id).unwrap();
      toast.success("Coupon updated");
    } catch (e: any) {
      toast.error(e?.data?.message || "Update failed");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this coupon?")) return;
    try {
      await deleteCoupon(id).unwrap();
      toast.success("Coupon deleted");
    } catch (e: any) {
      toast.error(e?.data?.message || "Delete failed");
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Coupons"
        description="Manage discount codes for your store"
        actions={
          <Button asChild size="sm" className="bg-[#2563EB] hover:bg-[#1D4ED8]">
            <Link href="/dashboard/add-coupon">
              <Plus className="h-4 w-4 mr-2" />
              Add Coupon
            </Link>
          </Button>
        }
      />

      {isLoading && <CardGridSkeleton count={6} />}
      {isError && <ErrorState onRetry={refetch} />}

      {!isLoading && !isError && coupons.length === 0 && (
        <EmptyState
          Icon={Ticket}
          title="No coupons yet"
          description="Create your first coupon so customers can get discounts."
          action={
            <Button asChild size="sm" className="bg-[#2563EB] hover:bg-[#1D4ED8]">
              <Link href="/dashboard/add-coupon">
                <Plus className="h-4 w-4 mr-2" />
                Add Coupon
              </Link>
            </Button>
          }
        />
      )}

      {coupons.length > 0 && (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {coupons.map((c: any) => {
            const expired = c.expiresAt && new Date(c.expiresAt) < new Date();
            const tone = expired ? "error" : c.isActive ? "success" : "neutral";
            const label = expired ? "Expired" : c.isActive ? "Active" : "Inactive";
            return (
              <Card
                key={c.id}
                className={`border-slate-200 shadow-none rounded-xl hover:border-slate-300 transition-colors ${
                  expired || !c.isActive ? "opacity-75" : ""
                }`}
              >
                <CardContent className="p-5 space-y-4">
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <p className="text-[10px] text-slate-500 uppercase font-semibold tracking-wider mb-1">
                        Code
                      </p>
                      <p className="font-mono font-semibold text-slate-900 text-base tracking-wider truncate">
                        {c.code}
                      </p>
                    </div>
                    <StatusBadge tone={tone as any}>{label}</StatusBadge>
                  </div>

                  <div className="rounded-lg bg-slate-50 border border-slate-100 p-3">
                    <p className="text-xl font-semibold text-[#2563EB]">
                      {c.discountType === "PERCENTAGE"
                        ? `${c.value}% off`
                        : `৳${c.value} off`}
                    </p>
                    {c.description && (
                      <p className="text-xs text-slate-600 mt-1 line-clamp-2">
                        {c.description}
                      </p>
                    )}
                  </div>

                  <div className="space-y-1.5 text-xs text-slate-600">
                    <div className="flex items-center gap-1.5">
                      <BadgeCheck className="h-3.5 w-3.5 text-slate-400" />
                      Min purchase: ৳{c.minPurchase?.toFixed?.(0) || 0}
                    </div>
                    {c.maxDiscount && (
                      <div className="flex items-center gap-1.5">
                        <BadgeCheck className="h-3.5 w-3.5 text-slate-400" />
                        Max discount: ৳{c.maxDiscount.toFixed(0)}
                      </div>
                    )}
                    {c.expiresAt && (
                      <div className="flex items-center gap-1.5">
                        <Clock className="h-3.5 w-3.5 text-slate-400" />
                        Expires: {new Date(c.expiresAt).toLocaleDateString()}
                      </div>
                    )}
                    {c.usageLimit && (
                      <div className="flex items-center gap-1.5">
                        <Percent className="h-3.5 w-3.5 text-slate-400" />
                        Used: {c.usedCount || 0} / {c.usageLimit}
                      </div>
                    )}
                  </div>

                  <div className="flex gap-2 pt-1">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleToggle(c.id)}
                      className="flex-1 border-slate-200"
                    >
                      <Power className="h-3.5 w-3.5 mr-1.5" />
                      {c.isActive ? "Disable" : "Enable"}
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleDelete(c.id)}
                      className="text-red-600 border-red-200 hover:bg-red-50 hover:text-red-700"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
