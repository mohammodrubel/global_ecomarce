"use client";

import { useMemo, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Search,
  Filter,
  Mail,
  Phone,
  MoreHorizontal,
  Users as UsersIcon,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";
import { useGetAllUsersQuery, useDeleteUserMutation } from "@/redux/fetchers/user/userApi";
import { TableSkeleton } from "@/components/dashboard/LoadingSkeleton";
import { ErrorState } from "@/components/dashboard/ErrorState";
import { EmptyState } from "@/components/dashboard/EmptyState";

type CustomerStatus = "VIP" | "Active" | "New" | "Inactive";

const VIP_THRESHOLD = 5;
const ACTIVE_DAYS = 60;
const NEW_DAYS = 30;

const deriveStatus = (
  ordersCount: number,
  lastOrder: string | null,
  joinDate: string,
): CustomerStatus => {
  const now = Date.now();
  const joinAgeDays = (now - new Date(joinDate).getTime()) / (1000 * 60 * 60 * 24);
  if (ordersCount >= VIP_THRESHOLD) return "VIP";
  if (lastOrder) {
    const days = (now - new Date(lastOrder).getTime()) / (1000 * 60 * 60 * 24);
    if (days <= ACTIVE_DAYS) return "Active";
    return "Inactive";
  }
  if (joinAgeDays <= NEW_DAYS) return "New";
  return "Inactive";
};

const statusColor = (s: CustomerStatus) => {
  switch (s) {
    case "VIP": return "bg-purple-100 text-purple-800";
    case "Active": return "bg-green-100 text-green-800";
    case "New": return "bg-blue-100 text-blue-800";
    case "Inactive": return "bg-gray-100 text-gray-800";
  }
};

export default function CustomersManagement() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const { data, isLoading, isError, refetch } = useGetAllUsersQuery(undefined);
  const [deleteUser] = useDeleteUserMutation();

  const customers = useMemo(() => {
    const list = (data?.data || []) as any[];
    return list.map((u) => ({
      id: u.id,
      name: u.full_name,
      email: u.email,
      phone: u.phone || "—",
      orders: u.ordersCount || 0,
      totalSpent: Number(u.totalSpent || 0),
      joinDate: u.createdAt,
      lastOrder: u.lastOrder,
      status: deriveStatus(u.ordersCount || 0, u.lastOrder, u.createdAt),
    }));
  }, [data]);

  const stats = useMemo(() => {
    const total = customers.length;
    const active = customers.filter((c) => c.status === "Active" || c.status === "VIP").length;
    const vip = customers.filter((c) => c.status === "VIP").length;
    const newThisMonth = customers.filter(
      (c) => (Date.now() - new Date(c.joinDate).getTime()) / (1000 * 60 * 60 * 24) <= 30,
    ).length;
    return { total, active, vip, newThisMonth };
  }, [customers]);

  const filteredCustomers = useMemo(() => {
    return customers.filter((c) => {
      const q = searchTerm.toLowerCase();
      const matchesSearch =
        !q ||
        c.name?.toLowerCase().includes(q) ||
        c.email?.toLowerCase().includes(q) ||
        c.phone?.toLowerCase().includes(q);
      const matchesStatus =
        statusFilter === "all" ||
        c.status.toLowerCase() === statusFilter.toLowerCase();
      return matchesSearch && matchesStatus;
    });
  }, [customers, searchTerm, statusFilter]);

  const handleDelete = async (id: string) => {
    if (!confirm("Deactivate this customer?")) return;
    try {
      await deleteUser(id).unwrap();
      toast.success("Customer deactivated");
    } catch (e: any) {
      toast.error(e?.data?.message || "Failed");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between pb-4 sm:pb-5 border-b border-slate-200">
        <div>
          <h1 className="text-2xl sm:text-[28px] font-semibold tracking-tight text-slate-900">
            Customers
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            {isLoading ? "Loading..." : `${customers.length} registered customers`}
          </p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { title: "Total Customers", value: stats.total, hint: "All time" },
          { title: "Active Customers", value: stats.active, hint: `${stats.total ? Math.round((stats.active / stats.total) * 100) : 0}% of total` },
          { title: "VIP Customers", value: stats.vip, hint: `${VIP_THRESHOLD}+ orders` },
          { title: "New This Month", value: stats.newThisMonth, hint: "Last 30 days" },
        ].map((s) => (
          <Card key={s.title} className="border-slate-200 shadow-none rounded-xl">
            <CardContent className="p-5">
              <p className="text-sm text-slate-500 font-medium">{s.title}</p>
              <p className="text-[26px] leading-tight font-semibold text-slate-900 mt-1 tracking-tight">
                {s.value}
              </p>
              <p className="text-xs text-slate-400 mt-1.5">{s.hint}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Filters */}
      <Card className="border-slate-200 shadow-none rounded-xl">
        <CardHeader>
          <CardTitle className="text-[15px] font-semibold">Filters</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by name, email, phone..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8"
                />
              </div>
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="vip">VIP</SelectItem>
                <SelectItem value="new">New</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline">
              <Filter className="h-4 w-4 mr-2" />
              More Filters
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Table */}
      <Card className="border-slate-200 shadow-none rounded-xl">
        <CardHeader>
          <CardTitle className="text-[15px] font-semibold">
            Customers ({filteredCustomers.length})
          </CardTitle>
        </CardHeader>
        <CardContent className="overflow-x-auto">
          {isLoading && <TableSkeleton rows={5} />}
          {isError && <ErrorState onRetry={refetch} />}
          {!isLoading && !isError && filteredCustomers.length === 0 && (
            <EmptyState
              Icon={UsersIcon}
              title="No customers found"
              description="Try adjusting search or filter."
            />
          )}

          {!isLoading && !isError && filteredCustomers.length > 0 && (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Customer</TableHead>
                  <TableHead>Contact</TableHead>
                  <TableHead>Orders</TableHead>
                  <TableHead>Total Spent</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Join Date</TableHead>
                  <TableHead>Last Order</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredCustomers.map((customer) => (
                  <TableRow key={customer.id}>
                    <TableCell>
                      <div className="flex items-center space-x-3">
                        <Avatar>
                          <AvatarFallback>
                            {customer.name
                              ?.split(" ")
                              .map((n: string) => n[0])
                              .slice(0, 2)
                              .join("")
                              .toUpperCase() || "?"}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-medium">{customer.name}</div>
                          <div className="text-xs text-muted-foreground font-mono">
                            #{customer.id.slice(0, 8)}
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="flex items-center text-sm">
                          <Mail className="h-3 w-3 mr-1" />
                          {customer.email}
                        </div>
                        <div className="flex items-center text-sm text-muted-foreground">
                          <Phone className="h-3 w-3 mr-1" />
                          {customer.phone}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="font-medium">
                      {customer.orders}
                    </TableCell>
                    <TableCell className="font-medium">
                      ৳{customer.totalSpent.toFixed(2)}
                    </TableCell>
                    <TableCell>
                      <Badge className={statusColor(customer.status)}>
                        {customer.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-xs">
                      {new Date(customer.joinDate).toLocaleDateString()}
                    </TableCell>
                    <TableCell className="text-xs">
                      {customer.lastOrder
                        ? new Date(customer.lastOrder).toLocaleDateString()
                        : "—"}
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>View Profile</DropdownMenuItem>
                          <DropdownMenuItem>View Orders</DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => handleDelete(customer.id)}
                            className="text-red-600"
                          >
                            Deactivate
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
