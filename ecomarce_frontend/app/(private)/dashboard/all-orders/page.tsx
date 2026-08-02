"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import {
  CheckCircle2,
  Clock,
  Eye,
  MoreHorizontal,
  Package,
  PackageOpen,
  Search,
  Truck,
  XCircle,
} from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { EmptyState } from "@/components/dashboard/EmptyState";
import { ErrorState } from "@/components/dashboard/ErrorState";
import { StatusBadge } from "@/components/dashboard/StatusBadge";
import { TableSkeleton } from "@/components/dashboard/LoadingSkeleton";
import {
  useGetAllOrdersQuery,
  useUpdateOrderStatusMutation,
} from "@/redux/fetchers/order/orderApi";

const STATUSES = ["PENDING", "PROCESSING", "SHIPPED", "DELIVERED", "CANCELLED"];

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

export default function AdminAllOrdersPage() {
  const { data, isLoading, isError, refetch } = useGetAllOrdersQuery(undefined);
  const [updateStatus, { isLoading: updating }] = useUpdateOrderStatusMutation();
  const [filter, setFilter] = useState<string>("ALL");
  const [search, setSearch] = useState("");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [viewOrder, setViewOrder] = useState<any | null>(null);

  const orders = data?.data || [];

  const filtered = useMemo(() => {
    return orders.filter((o: any) => {
      if (filter !== "ALL" && o.status !== filter) return false;
      if (search) {
        const q = search.toLowerCase();
        const hit =
          o.id.toLowerCase().includes(q) ||
          o.fullName?.toLowerCase().includes(q) ||
          o.email?.toLowerCase().includes(q) ||
          o.phone?.toLowerCase().includes(q);
        if (!hit) return false;
      }
      if (dateFrom && new Date(o.createdAt) < new Date(dateFrom)) return false;
      if (dateTo) {
        const end = new Date(dateTo);
        end.setHours(23, 59, 59, 999);
        if (new Date(o.createdAt) > end) return false;
      }
      return true;
    });
  }, [orders, filter, search, dateFrom, dateTo]);

  const handleUpdate = async (id: string, status: string) => {
    try {
      await updateStatus({ id, status }).unwrap();
      toast.success("Status updated");
    } catch (e: any) {
      toast.error(e?.data?.message || "Update failed");
    }
  };

  const counts = {
    ALL: orders.length,
    PENDING: orders.filter((o: any) => o.status === "PENDING").length,
    PROCESSING: orders.filter((o: any) => o.status === "PROCESSING").length,
    SHIPPED: orders.filter((o: any) => o.status === "SHIPPED").length,
    DELIVERED: orders.filter((o: any) => o.status === "DELIVERED").length,
    CANCELLED: orders.filter((o: any) => o.status === "CANCELLED").length,
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="All Orders"
        description="Manage customer orders and update their status"
      />

      {/* Filter chips */}
      <div className="flex flex-wrap gap-2">
        {["ALL", ...STATUSES].map((s) => {
          const active = filter === s;
          return (
            <button
              key={s}
              onClick={() => setFilter(s)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors whitespace-nowrap ${
                active
                  ? "bg-slate-900 text-white"
                  : "bg-white border border-slate-200 text-slate-700 hover:bg-slate-50"
              }`}
            >
              {s}
              <span
                className={`ml-1.5 ${active ? "text-slate-300" : "text-slate-400"}`}
              >
                {counts[s as keyof typeof counts]}
              </span>
            </button>
          );
        })}
      </div>

      {/* Search + date filters */}
      <div className="grid gap-3 sm:grid-cols-[1fr_auto_auto]">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by order ID, customer, email, phone..."
            className="pl-9 h-10 border-slate-200"
          />
        </div>
        <Input
          type="date"
          value={dateFrom}
          onChange={(e) => setDateFrom(e.target.value)}
          className="h-10 border-slate-200 sm:w-[160px]"
          aria-label="From date"
        />
        <Input
          type="date"
          value={dateTo}
          onChange={(e) => setDateTo(e.target.value)}
          className="h-10 border-slate-200 sm:w-[160px]"
          aria-label="To date"
        />
      </div>

      {isLoading && <TableSkeleton rows={6} />}
      {isError && <ErrorState onRetry={refetch} />}

      {!isLoading && !isError && filtered.length === 0 && (
        <EmptyState
          Icon={PackageOpen}
          title="No orders"
          description="No orders match the current filters."
        />
      )}

      {!isLoading && !isError && filtered.length > 0 && (
        <div className="rounded-xl border border-slate-200 bg-white overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-slate-50/60">
                <TableHead className="text-[11px] uppercase tracking-wider font-semibold text-slate-500">
                  Order
                </TableHead>
                <TableHead className="text-[11px] uppercase tracking-wider font-semibold text-slate-500">
                  Customer
                </TableHead>
                <TableHead className="text-[11px] uppercase tracking-wider font-semibold text-slate-500">
                  Date
                </TableHead>
                <TableHead className="text-[11px] uppercase tracking-wider font-semibold text-slate-500">
                  Items
                </TableHead>
                <TableHead className="text-[11px] uppercase tracking-wider font-semibold text-slate-500">
                  Payment
                </TableHead>
                <TableHead className="text-[11px] uppercase tracking-wider font-semibold text-slate-500">
                  Status
                </TableHead>
                <TableHead className="text-[11px] uppercase tracking-wider font-semibold text-slate-500 text-right">
                  Total
                </TableHead>
                <TableHead className="text-right w-[60px]" />
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((o: any) => {
                const { tone, Icon } = statusMap(o.status);
                return (
                  <TableRow key={o.id} className="hover:bg-slate-50/60">
                    <TableCell>
                      <p className="font-mono text-xs font-semibold text-slate-900">
                        #{o.id.slice(0, 8).toUpperCase()}
                      </p>
                    </TableCell>
                    <TableCell>
                      <p className="text-sm text-slate-900 font-medium">
                        {o.fullName}
                      </p>
                      <p className="text-xs text-slate-500 truncate max-w-[180px]">
                        {o.email}
                      </p>
                    </TableCell>
                    <TableCell>
                      <p className="text-sm text-slate-700">
                        {new Date(o.createdAt).toLocaleDateString()}
                      </p>
                      <p className="text-[11px] text-slate-500">
                        {new Date(o.createdAt).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </p>
                    </TableCell>
                    <TableCell className="text-sm text-slate-700">
                      {o.items.length}
                    </TableCell>
                    <TableCell>
                      <span className="text-[11px] font-medium text-slate-600 uppercase tracking-wider">
                        {o.paymentMethod}
                      </span>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <StatusBadge tone={tone} Icon={Icon}>
                          {o.status}
                        </StatusBadge>
                        <select
                          value={o.status}
                          onChange={(e) => handleUpdate(o.id, e.target.value)}
                          disabled={updating}
                          className="h-7 rounded-md border border-slate-200 bg-white px-1.5 text-[11px] font-medium outline-none focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/20"
                        >
                          {STATUSES.map((s) => (
                            <option key={s} value={s}>
                              {s}
                            </option>
                          ))}
                        </select>
                      </div>
                    </TableCell>
                    <TableCell className="text-right font-semibold text-slate-900">
                      ৳{o.totalPrice.toFixed(2)}
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => setViewOrder(o)}>
                            <Eye className="h-4 w-4 mr-2" />
                            View details
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          {STATUSES.filter((s) => s !== o.status).map((s) => (
                            <DropdownMenuItem
                              key={s}
                              onClick={() => handleUpdate(o.id, s)}
                            >
                              Mark {s}
                            </DropdownMenuItem>
                          ))}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      )}

      {/* View dialog */}
      <Dialog open={!!viewOrder} onOpenChange={(o) => !o && setViewOrder(null)}>
        <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              Order #{viewOrder?.id?.slice(0, 8).toUpperCase()}
            </DialogTitle>
            <DialogDescription>
              Placed on{" "}
              {viewOrder && new Date(viewOrder.createdAt).toLocaleString()}
            </DialogDescription>
          </DialogHeader>

          {viewOrder && (
            <div className="space-y-4">
              <div>
                <h3 className="text-[10px] uppercase tracking-wider font-semibold text-slate-500 mb-2">
                  Items ({viewOrder.items.length})
                </h3>
                <div className="space-y-2">
                  {viewOrder.items.map((it: any) => (
                    <div
                      key={it.id}
                      className="flex items-center gap-3 bg-slate-50/60 rounded-lg p-2.5 border border-slate-100"
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
                      <p className="text-sm font-semibold text-slate-900 whitespace-nowrap">
                        ৳{(it.price * it.quantity).toFixed(2)}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-3">
                <div className="bg-slate-50/60 rounded-lg p-4 border border-slate-100">
                  <p className="text-[10px] uppercase tracking-wider font-semibold text-slate-500 mb-2">
                    Shipping
                  </p>
                  <p className="text-sm font-medium text-slate-900">
                    {viewOrder.fullName}
                  </p>
                  <p className="text-xs text-slate-600 mt-1">
                    {viewOrder.address}, {viewOrder.city} {viewOrder.postalCode},{" "}
                    {viewOrder.country}
                  </p>
                  <p className="text-xs text-slate-600 mt-1">{viewOrder.phone}</p>
                  {viewOrder.notes && (
                    <p className="text-xs text-slate-500 mt-2 italic">
                      Note: {viewOrder.notes}
                    </p>
                  )}
                </div>
                <div className="bg-slate-50/60 rounded-lg p-4 border border-slate-100 space-y-1.5 text-sm">
                  <div className="flex justify-between text-slate-600">
                    <span>Subtotal</span>
                    <span>৳{viewOrder.subtotal.toFixed(2)}</span>
                  </div>
                  {viewOrder.discount > 0 && (
                    <div className="flex justify-between text-emerald-700">
                      <span>
                        Discount{" "}
                        {viewOrder.couponCode ? `(${viewOrder.couponCode})` : ""}
                      </span>
                      <span>-৳{viewOrder.discount.toFixed(2)}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-slate-600">
                    <span>Shipping</span>
                    <span>৳{viewOrder.shipping.toFixed(2)}</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between font-semibold text-slate-900">
                    <span>Total</span>
                    <span>৳{viewOrder.totalPrice.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
