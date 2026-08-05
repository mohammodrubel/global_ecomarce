"use client";

import Link from "next/link";
import { useSelector } from "react-redux";
import {
  Package,
  Heart,
  ShoppingBag,
  User,
  ArrowRight,
  PackageOpen,
  MessageSquareText,
  Truck,
  CheckCircle2,
  Clock,
  Ticket,
  XCircle,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { StatCard } from "@/components/dashboard/StatCard";
import { SectionCard } from "@/components/dashboard/SectionCard";
import { EmptyState } from "@/components/dashboard/EmptyState";
import { StatusBadge } from "@/components/dashboard/StatusBadge";
import { RootState } from "@/redux/store";
import { useMeQuery } from "@/redux/fetchers/auth/authApi";
import { useGetMyOrdersQuery } from "@/redux/fetchers/order/orderApi";
import { useGetLatestCouponQuery } from "@/redux/fetchers/coupon/couponApi";

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

export default function UserDashboardHome() {
  const authUser = useSelector((state: RootState) => state.auth?.user);
  const cartCount = useSelector((state: RootState) => state.cart?.totalQuantity || 0);
  const wishlistCount = useSelector(
    (state: RootState) => state.wishlist?.totalwishlistProduct || 0
  );

  const { data } = useMeQuery(undefined);
  const { data: ordersRes } = useGetMyOrdersQuery(undefined);
  const { data: latestCouponRes } = useGetLatestCouponQuery(undefined);

  const me = data?.data;
  const orders = ordersRes?.data || [];
  const latestCoupon = latestCouponRes?.data;

  const displayName =
    me?.full_name || authUser?.name || authUser?.email?.split("@")[0] || "there";
  const initials = (displayName || "U")
    .split(" ")
    .map((s: string) => s[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  const activeOrders = orders.filter(
    (o: any) => !["DELIVERED", "CANCELLED"].includes(o.status)
  ).length;
  const deliveredOrders = orders.filter((o: any) => o.status === "DELIVERED").length;

  const recentOrders = orders.slice(0, 4);

  return (
    <div className="space-y-6">
      <PageHeader
        title={`Welcome back, ${displayName.split(" ")[0]}`}
        description="Manage your orders, reviews and profile from one place"
        actions={
          <Button asChild size="sm" className="bg-[#2563EB] hover:bg-[#1D4ED8]">
            <Link href="/shop">
              <ShoppingBag className="h-4 w-4 mr-2" />
              Continue Shopping
            </Link>
          </Button>
        }
      />

      {latestCoupon && (
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 rounded-xl border border-amber-200 bg-amber-50/60 p-4">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-amber-100 border border-amber-200 text-amber-700 flex items-center justify-center flex-shrink-0">
              <Ticket className="h-4 w-4" />
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-900">
                {latestCoupon.discountType === "PERCENTAGE"
                  ? `Save ${latestCoupon.value}% on your next order`
                  : `Save ৳${latestCoupon.value} on your next order`}
              </p>
              <p className="text-xs text-slate-600">
                Use code{" "}
                <span className="font-mono font-semibold tracking-wider text-amber-800 bg-white/80 rounded px-1.5 py-0.5 ring-1 ring-amber-200">
                  {latestCoupon.code}
                </span>
              </p>
            </div>
          </div>
          <Button asChild size="sm" className="bg-slate-900 hover:bg-slate-800 self-start sm:self-auto">
            <Link href="/shop">Shop now</Link>
          </Button>
        </div>
      )}

      <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
        <Link href="/dashboard/orders">
          <StatCard title="Active Orders" value={activeOrders} Icon={Package} />
        </Link>
        <Link href="/dashboard/orders">
          <StatCard title="Delivered" value={deliveredOrders} Icon={CheckCircle2} />
        </Link>
        <Link href="/wishlist">
          <StatCard title="Wishlist" value={wishlistCount} Icon={Heart} />
        </Link>
        <Link href="/cart">
          <StatCard title="In Cart" value={cartCount} Icon={ShoppingBag} />
        </Link>
      </div>

      <div className="grid gap-5 lg:grid-cols-3">
        <SectionCard
          title="Recent Orders"
          description="Your latest purchases"
          className="lg:col-span-2"
          actions={
            <Button asChild variant="ghost" size="sm" className="text-[#2563EB] hover:bg-blue-50">
              <Link href="/dashboard/orders">
                View all
                <ArrowRight className="h-3.5 w-3.5 ml-1" />
              </Link>
            </Button>
          }
        >
          {recentOrders.length === 0 ? (
            <EmptyState
              Icon={PackageOpen}
              title="No orders yet"
              description="Place your first order to see it here."
              compact
              action={
                <Button asChild size="sm" className="bg-[#2563EB] hover:bg-[#1D4ED8]">
                  <Link href="/shop">Start Shopping</Link>
                </Button>
              }
            />
          ) : (
            <div className="divide-y divide-slate-100 -mx-5 -my-6 sm:-mx-6">
              {recentOrders.map((o: any) => {
                const { tone, Icon } = statusMap(o.status);
                return (
                  <div
                    key={o.id}
                    className="flex items-center justify-between px-5 sm:px-6 py-3.5 hover:bg-slate-50/60 transition-colors"
                  >
                    <div className="min-w-0">
                      <p className="font-mono font-semibold text-slate-900 text-xs">
                        #{o.id.slice(0, 8).toUpperCase()}
                      </p>
                      <p className="text-xs text-slate-500 mt-0.5">
                        {o.items?.length || 0} item(s) ·{" "}
                        {new Date(o.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      <StatusBadge tone={tone} Icon={Icon}>
                        {o.status}
                      </StatusBadge>
                      <span className="text-sm font-semibold text-slate-900 w-20 text-right">
                        ৳{o.totalPrice?.toFixed(0)}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </SectionCard>

        <SectionCard title="Profile">
          <div className="flex items-center gap-3 mb-4">
            {me?.profile_photo ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={me.profile_photo}
                alt="Profile"
                className="h-12 w-12 rounded-full object-cover border border-slate-200"
              />
            ) : (
              <div className="h-12 w-12 rounded-full bg-slate-900 text-white flex items-center justify-center font-semibold text-sm">
                {initials}
              </div>
            )}
            <div className="min-w-0">
              <p className="font-semibold text-slate-900 truncate">
                {me?.full_name || displayName}
              </p>
              <p className="text-xs text-slate-500 truncate">
                {me?.email || authUser?.email}
              </p>
            </div>
          </div>

          <Separator className="my-4" />

          <div className="space-y-3 text-sm">
            <div className="flex justify-between items-center">
              <span className="text-slate-500 text-xs">Role</span>
              <StatusBadge tone="neutral">{me?.role || "USER"}</StatusBadge>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-500 text-xs">Total orders</span>
              <span className="text-slate-900 font-semibold text-sm">
                {orders.length}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-500 text-xs">Member since</span>
              <span className="text-slate-700 text-sm">
                {me?.createdAt
                  ? new Date(me.createdAt).toLocaleDateString()
                  : "-"}
              </span>
            </div>
          </div>

          <Button
            asChild
            variant="outline"
            size="sm"
            className="w-full mt-5 border-slate-200"
          >
            <Link href="/account">
              <User className="h-4 w-4 mr-1.5" />
              Edit Profile
            </Link>
          </Button>
        </SectionCard>
      </div>

      <SectionCard
        title="Product Reviews"
        description="Share feedback on purchased products"
        actions={
          <Button asChild variant="ghost" size="sm" className="text-[#2563EB] hover:bg-blue-50">
            <Link href="/dashboard/reviews">
              Manage
              <ArrowRight className="h-3.5 w-3.5 ml-1" />
            </Link>
          </Button>
        }
      >
        <EmptyState
          Icon={MessageSquareText}
          title="No reviews yet"
          description="Reviews open after your orders are delivered."
          compact
          action={
            <Button asChild size="sm" variant="outline" className="border-slate-200">
              <Link href="/shop">Browse Products</Link>
            </Button>
          }
        />
      </SectionCard>
    </div>
  );
}
