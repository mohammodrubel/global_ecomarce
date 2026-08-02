"use client";

import type React from "react";
import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import { Separator } from "@/components/ui/separator";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { AdminSidebar } from "@/components/AdminSidebar";
import { UserSidebar } from "@/components/UserSidebar";
import { RootState } from "@/redux/store";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const token = useSelector((state: RootState) => state.auth?.token);
  const user = useSelector((state: RootState) => state.auth?.user);
  const role = user?.role || "USER";
  const isAdmin = role === "ADMIN";

  // Non-admin trying to hit an admin-only subroute → send to dashboard root
  const adminOnlyRoutes = [
    "/dashboard/add-",
    "/dashboard/all-",
    "/dashboard/brand",
    "/dashboard/customars",
    "/dashboard/specialOffer",
    "/dashboard/edit-",
    "/dashboard/coupons",
  ];
  const isAdminRoute = adminOnlyRoutes.some((r) => pathname?.includes(r));

  useEffect(() => {
    if (!token) router.replace("/login");
  }, [token, router]);

  useEffect(() => {
    if (token && !isAdmin && isAdminRoute) router.replace("/dashboard");
  }, [token, isAdmin, isAdminRoute, router]);

  if (!token || !user) return null;

  return (
    <SidebarProvider>
      {isAdmin ? <AdminSidebar /> : <UserSidebar />}
      <SidebarInset>
        <header className="flex h-14 shrink-0 items-center gap-3 border-b border-slate-200 px-4 sm:px-6 bg-white sticky top-0 z-30">
          <SidebarTrigger className="-ml-1 h-8 w-8 rounded-md hover:bg-slate-100 text-slate-700" />
          <Separator orientation="vertical" className="h-5 bg-slate-200" />
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem className="hidden md:block">
                <BreadcrumbLink
                  href="/dashboard"
                  className="text-slate-500 hover:text-slate-900 font-medium text-sm"
                >
                  {isAdmin ? "Admin" : "My"} Dashboard
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator className="hidden md:block text-slate-300" />
              <BreadcrumbItem>
                <BreadcrumbPage className="text-slate-900 font-medium text-sm">
                  Overview
                </BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>

          <div className="ml-auto flex items-center gap-2">
            <div className="hidden md:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 ring-1 ring-emerald-200">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
              <span className="text-[11px] font-medium text-emerald-700">
                {isAdmin ? "Admin" : "Customer"}
              </span>
            </div>
            <div className="hidden sm:flex flex-col items-end mr-1">
              <span className="text-xs font-medium text-slate-900 leading-tight max-w-[140px] truncate">
                {user.name || user.email}
              </span>
              <span className="text-[10px] text-slate-500 leading-tight">
                {user.email}
              </span>
            </div>
            <div className="w-8 h-8 rounded-full bg-slate-900 text-white flex items-center justify-center font-semibold text-xs">
              {(user.name || user.email || "U").charAt(0).toUpperCase()}
            </div>
          </div>
        </header>

        <div className="flex flex-1 flex-col gap-6 p-4 sm:p-6 lg:p-8 bg-[#F8FAFC] min-h-screen">
          {children}
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
