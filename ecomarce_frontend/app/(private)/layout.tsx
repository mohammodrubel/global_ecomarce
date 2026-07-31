import type React from "react";
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

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider>
      <AdminSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4 bg-gradient-to-r from-blue-50 via-white to-purple-50 shadow-sm">
          <SidebarTrigger className="-ml-1 p-2 rounded-lg hover:bg-blue-100 transition-colors duration-200 text-blue-600 hover:text-blue-800" />
          <Separator
            orientation="vertical"
            className="mr-2 h-6 bg-gradient-to-b from-blue-200 to-purple-200"
          />
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem className="hidden md:block">
                <BreadcrumbLink
                  href="/admin"
                  className="text-blue-600 hover:text-blue-800 font-medium transition-colors duration-200"
                >
                  Admin Dashboard
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator className="hidden md:block text-gray-300" />
              <BreadcrumbItem>
                <BreadcrumbPage className="text-purple-600 font-semibold bg-gradient-to-r from-purple-100 to-pink-100 px-3 py-1 rounded-full text-sm">
                  Overview
                </BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>

          {/* Additional colorful elements */}
          <div className="ml-auto flex items-center gap-3">
            <div className="flex items-center gap-2 bg-gradient-to-r from-green-50 to-emerald-50 px-3 py-1 rounded-full border border-green-200">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <span className="text-sm font-medium text-green-700">Online</span>
            </div>
            <div className="w-8 h-8 bg-gradient-to-r from-orange-400 to-pink-400 rounded-full flex items-center justify-center text-white font-bold text-sm shadow-lg">
              A
            </div>
          </div>
        </header>

        <div className="flex flex-1 flex-col gap-4 p-4 bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 min-h-screen">
          
          {children}
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
