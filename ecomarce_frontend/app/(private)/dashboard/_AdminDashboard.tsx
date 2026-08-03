"use client";

import { useMemo } from "react";
import Link from "next/link";
import { useSelector } from "react-redux";
import {
  DollarSign,
  Users,
  Package,
  ShoppingCart,
  Plus,
  Layers,
  Image as ImageIcon,
  Megaphone,
  Ticket,
  Boxes,
  Sparkles,
  TrendingUp,
  BarChart3,
} from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
} from "recharts";

import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { StatCard } from "@/components/dashboard/StatCard";
import { SectionCard } from "@/components/dashboard/SectionCard";
import { StatusBadge } from "@/components/dashboard/StatusBadge";
import { RootState } from "@/redux/store";
import { useGetAllOrdersQuery } from "@/redux/fetchers/order/orderApi";
import { useGetAllProductsQuery } from "@/redux/fetchers/products/productsApi";
import { useGetAllUsersQuery } from "@/redux/fetchers/user/userApi";

const statusTone = (s: string) => {
  switch (s) {
    case "DELIVERED": return "success" as const;
    case "PROCESSING": return "warning" as const;
    case "SHIPPED": return "info" as const;
    case "PENDING": return "neutral" as const;
    case "CANCELLED": return "error" as const;
    default: return "neutral" as const;
  }
};

const quickActions = [
  { title: "Add Product", href: "/dashboard/add-product", Icon: Package },
  { title: "Add Category", href: "/dashboard/add-categories", Icon: Layers },
  { title: "Add Banner", href: "/dashboard/add-banner", Icon: ImageIcon },
  { title: "Add Coupon", href: "/dashboard/add-coupon", Icon: Ticket },
  { title: "Add Brand", href: "/dashboard/add-brand", Icon: Boxes },
  { title: "Add Ad", href: "/dashboard/add-advertisement", Icon: Megaphone },
];

const monthShort = (d: Date) =>
  d.toLocaleString("en-US", { month: "short" });

export default function AdminDashboardHome() {
  const user = useSelector((state: RootState) => state.auth?.user);

  const { data: ordersRes } = useGetAllOrdersQuery(undefined);
  const { data: productsRes } = useGetAllProductsQuery([]);
  const { data: usersRes } = useGetAllUsersQuery(undefined);

  const orders = ordersRes?.data || [];
  const productsMeta = productsRes?.meta || { total: 0 };
  const customers = usersRes?.data || [];

  const {
    totalRevenue,
    totalOrders,
    revenueChange,
    ordersChange,
    salesChart,
    recentOrders,
  } = useMemo(() => {
    const nonCancelled = orders.filter((o: any) => o.status !== "CANCELLED");
    const totalRevenue = nonCancelled.reduce(
      (s: number, o: any) => s + (o.totalPrice || 0),
      0,
    );
    const totalOrders = nonCancelled.length;

    // last 6 months buckets
    const now = new Date();
    const buckets: { key: string; name: string; sales: number; orders: number }[] = [];
    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const key = `${d.getFullYear()}-${d.getMonth()}`;
      buckets.push({ key, name: monthShort(d), sales: 0, orders: 0 });
    }
    const byKey: Record<string, (typeof buckets)[number]> = {};
    buckets.forEach((b) => (byKey[b.key] = b));

    nonCancelled.forEach((o: any) => {
      const d = new Date(o.createdAt);
      const key = `${d.getFullYear()}-${d.getMonth()}`;
      if (byKey[key]) {
        byKey[key].sales += o.totalPrice || 0;
        byKey[key].orders += 1;
      }
    });

    // current vs previous month change
    const cur = buckets[5];
    const prev = buckets[4];
    const revenueChange =
      prev && prev.sales > 0
        ? ((cur.sales - prev.sales) / prev.sales) * 100
        : 0;
    const ordersChange =
      prev && prev.orders > 0
        ? ((cur.orders - prev.orders) / prev.orders) * 100
        : 0;

    const recentOrders = [...orders]
      .sort(
        (a: any, b: any) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
      )
      .slice(0, 5);

    return {
      totalRevenue,
      totalOrders,
      revenueChange,
      ordersChange,
      salesChart: buckets,
      recentOrders,
    };
  }, [orders]);

  const stats = [
    {
      title: "Total Revenue",
      value: `৳${totalRevenue.toLocaleString(undefined, { maximumFractionDigits: 0 })}`,
      change: `${Math.abs(revenueChange).toFixed(1)}%`,
      direction: (revenueChange >= 0 ? "up" : "down") as "up" | "down",
      Icon: DollarSign,
      hint: "vs last month",
    },
    {
      title: "Total Orders",
      value: totalOrders.toLocaleString(),
      change: `${Math.abs(ordersChange).toFixed(1)}%`,
      direction: (ordersChange >= 0 ? "up" : "down") as "up" | "down",
      Icon: ShoppingCart,
      hint: "vs last month",
    },
    {
      title: "Customers",
      value: customers.length.toLocaleString(),
      change: "",
      direction: "up" as const,
      Icon: Users,
      hint: "Registered users",
    },
    {
      title: "Products",
      value: (productsMeta.total || 0).toLocaleString(),
      change: "",
      direction: "up" as const,
      Icon: Package,
      hint: "In catalog",
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title={`Welcome back, ${user?.name?.split(" ")[0] || "Admin"}`}
        description="Here's what's happening with your store today"
        actions={
          <>
            <Button asChild variant="outline" size="sm" className="border-slate-200">
              <Link href="/dashboard/all-orders">
                <ShoppingCart className="h-4 w-4 mr-2" />
                View Orders
              </Link>
            </Button>
            <Button asChild size="sm" className="bg-[#2563EB] hover:bg-[#1D4ED8]">
              <Link href="/dashboard/add-product">
                <Plus className="h-4 w-4 mr-2" />
                New Product
              </Link>
            </Button>
          </>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((s) => (
          <StatCard
            key={s.title}
            title={s.title}
            value={s.value}
            Icon={s.Icon}
            change={s.change}
            changeDirection={s.direction}
            hint={s.hint}
          />
        ))}
      </div>

      <div className="grid gap-5 lg:grid-cols-3">
        <SectionCard
          title="Revenue Overview"
          description="Last 6 months"
          Icon={TrendingUp}
          className="lg:col-span-2"
          actions={
            <div className="hidden sm:flex items-center gap-3 text-xs">
              <div className="flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-[#2563EB]" />
                <span className="text-slate-600">Sales</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-emerald-500" />
                <span className="text-slate-600">Orders</span>
              </div>
            </div>
          }
        >
          <ResponsiveContainer width="100%" height={260}>
            <AreaChart data={salesChart} margin={{ left: -20, right: 5, top: 5 }}>
              <defs>
                <linearGradient id="salesFill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#2563EB" stopOpacity={0.2} />
                  <stop offset="100%" stopColor="#2563EB" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="ordersFill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#10b981" stopOpacity={0.15} />
                  <stop offset="100%" stopColor="#10b981" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
              <XAxis dataKey="name" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
              <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
              <Tooltip
                contentStyle={{
                  borderRadius: 10,
                  border: "1px solid #e2e8f0",
                  boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
                  fontSize: 12,
                }}
              />
              <Area type="monotone" dataKey="sales" stroke="#2563EB" strokeWidth={2} fill="url(#salesFill)" />
              <Area type="monotone" dataKey="orders" stroke="#10b981" strokeWidth={2} fill="url(#ordersFill)" />
            </AreaChart>
          </ResponsiveContainer>
        </SectionCard>

        <SectionCard
          title="Monthly Orders"
          description="Last 6 months"
          Icon={BarChart3}
        >
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={salesChart} margin={{ left: -20, right: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
              <XAxis dataKey="name" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
              <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
              <Tooltip
                contentStyle={{
                  borderRadius: 10,
                  border: "1px solid #e2e8f0",
                  boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
                  fontSize: 12,
                }}
                cursor={{ fill: "#f8fafc" }}
              />
              <Bar dataKey="orders" fill="#2563EB" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </SectionCard>
      </div>

      <div className="grid gap-5 lg:grid-cols-3">
        <SectionCard
          title="Recent Orders"
          description="Latest customer purchases"
          className="lg:col-span-2"
          padded={false}
          actions={
            <Button asChild variant="ghost" size="sm" className="text-[#2563EB] hover:bg-blue-50">
              <Link href="/dashboard/all-orders">View all</Link>
            </Button>
          }
        >
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-slate-50/60 text-slate-500 text-[11px] uppercase tracking-wider">
                <tr>
                  <th className="text-left font-semibold px-5 py-3">Order ID</th>
                  <th className="text-left font-semibold px-5 py-3 hidden sm:table-cell">Customer</th>
                  <th className="text-left font-semibold px-5 py-3">Status</th>
                  <th className="text-right font-semibold px-5 py-3">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {recentOrders.length === 0 && (
                  <tr>
                    <td colSpan={4} className="text-center py-10 text-sm text-slate-500">
                      No orders yet.
                    </td>
                  </tr>
                )}
                {recentOrders.map((o: any) => (
                  <tr key={o.id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="px-5 py-3.5">
                      <p className="font-mono font-semibold text-slate-900 text-xs">
                        #{o.id.slice(0, 8).toUpperCase()}
                      </p>
                      <p className="text-[11px] text-slate-500 sm:hidden">{o.fullName}</p>
                      <p className="text-[11px] text-slate-400">
                        {new Date(o.createdAt).toLocaleDateString()}
                      </p>
                    </td>
                    <td className="px-5 py-3.5 hidden sm:table-cell text-slate-700 font-medium">
                      {o.fullName}
                    </td>
                    <td className="px-5 py-3.5">
                      <StatusBadge tone={statusTone(o.status)}>{o.status}</StatusBadge>
                    </td>
                    <td className="px-5 py-3.5 text-right font-semibold text-slate-900">
                      ৳{(o.totalPrice || 0).toFixed(2)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </SectionCard>

        <SectionCard title="Quick Actions" Icon={Sparkles}>
          <div className="grid grid-cols-2 gap-2.5">
            {quickActions.map(({ title, href, Icon }) => (
              <Link
                key={title}
                href={href}
                className="group flex flex-col items-start gap-2.5 rounded-lg border border-slate-200 p-3 hover:border-[#2563EB] hover:bg-blue-50/30 transition-all"
              >
                <div className="h-8 w-8 rounded-lg bg-slate-50 border border-slate-100 text-slate-700 flex items-center justify-center group-hover:bg-[#2563EB] group-hover:text-white group-hover:border-[#2563EB] transition-colors">
                  <Icon className="h-4 w-4" />
                </div>
                <span className="text-xs font-medium text-slate-800 group-hover:text-[#2563EB]">
                  {title}
                </span>
              </Link>
            ))}
          </div>
        </SectionCard>
      </div>
    </div>
  );
}
