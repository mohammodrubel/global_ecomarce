"use client";

import type * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Users,
  BarChart3,
  Settings,
  Globe,
  TrendingUp,
  ChevronDown,
  Tags,
  Award,
  Zap,
  FolderTree,
  Building,
  Percent,
  Star,
  FileText,
  Truck,
  CreditCard,
  Shield,
  Image,
  Megaphone,
} from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarRail,
} from "@/components/ui/sidebar";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

const menuItems = [
  {
    title: "Dashboard",
    url: "/admin",
    icon: LayoutDashboard,
    color: "text-blue-500",
    bgColor: "bg-blue-50",
  },
  {
    title: "Orders",
    icon: ShoppingCart,
    color: "text-green-500",
    bgColor: "bg-green-50",
    items: [
      { title: "All Orders", url: "/admin/orders" },
      { title: "Pending Orders", url: "/admin/orders/pending" },
      { title: "Shipped Orders", url: "/admin/orders/shipped" },
    ],
  },
  {
    title: "Products",
    icon: Package,
    color: "text-purple-500",
    bgColor: "bg-purple-50",
    items: [
      { title: "All Products", url: "/dashboard/all-product" },
      { title: "Add Products", url: "/dashboard/add-product" },
      { title: "Add Products Color", url: "/dashboard/add-product-color" },
    ],
  },
  {
    title: "Category",
    icon: FolderTree,
    color: "text-orange-500",
    bgColor: "bg-orange-50",
    items: [
      { title: "All Categories", url: "/dashboard/all-categories" },
      { title: "Add Category", url: "/dashboard/add-categories" },
    ],
  },
  {
    title: "Brand",
    icon: Building,
    color: "text-red-500",
    bgColor: "bg-red-50",
    items: [
      { title: "All Brands", url: "/dashboard/brand" },
      { title: "Add Brand", url: "/dashboard/add-brand" },
    ],
  },
  {
    title: "Banner",
    icon: Image,
    color: "text-indigo-500",
    bgColor: "bg-indigo-50",
    items: [
      { title: "All Banners", url: "/dashboard/all-banners" },
      { title: "Add Banner", url: "/dashboard/add-banner" },
    ],
  },
  {
    title: "Special Offers",
    icon: Zap,
    color: "text-yellow-500",
    bgColor: "bg-yellow-50",
    items: [
      { title: "All Special Offers", url: "/dashboard/specialOffer" },
      { title: "Add Special Offer", url: "/dashboard/add-special" },
    ],
  },
  {
    title: "Advertisement",
    icon: Megaphone,
    color: "text-rose-500",
    bgColor: "bg-rose-50",
    items: [
      { title: "All Advertisements", url: "/dashboard/all-advertisements" },
      { title: "Add Advertisement", url: "/dashboard/add-advertisement" },
    ],
  },
  {
    title: "Customers",
    url: "/dashboard/customars",
    icon: Users,
    color: "text-cyan-500",
    bgColor: "bg-cyan-50",
  },
  {
    title: "Marketing",
    icon: TrendingUp,
    color: "text-pink-500",
    bgColor: "bg-pink-50",
    items: [
      { title: "Coupons", url: "/admin/coupons", icon: Percent },
      { title: "Reviews", url: "/admin/reviews", icon: Star },
      { title: "Content Management", url: "/admin/content", icon: FileText },
    ],
  },
  {
    title: "Reports",
    icon: BarChart3,
    color: "text-indigo-500",
    bgColor: "bg-indigo-50",
    items: [
      { title: "Sales Report", url: "/admin/reports/sales" },
      { title: "Traffic Report", url: "/admin/reports/traffic" },
      { title: "Product Report", url: "/admin/reports/products" },
    ],
  },
  {
    title: "Settings",
    icon: Settings,
    color: "text-gray-500",
    bgColor: "bg-gray-50",
    items: [
      { title: "General", url: "/admin/settings" },
      { title: "Shipping", url: "/admin/settings/shipping", icon: Truck },
      { title: "Tax Settings", url: "/admin/settings/tax" },
      {
        title: "Payment Gateway",
        url: "/admin/settings/payment",
        icon: CreditCard,
      },
      { title: "User Roles", url: "/admin/settings/roles", icon: Shield },
    ],
  },
];

export function AdminSidebar({
  ...props
}: React.ComponentProps<typeof Sidebar>) {
  const pathname = usePathname();

  return (
    <Sidebar
      {...props}
      className="bg-gradient-to-b from-slate-50 to-blue-50 border-r border-blue-100"
    >
      <SidebarHeader>
        <div className="flex items-center gap-3 px-4 py-4  rounded-lg mx-3 my-3 shadow-lg">
          <div className="grid flex-1 text-left ">
            <span className=" font-bold text-lg">ShopHub Admin</span>
            <span className=" text-sm ">Admin Panel</span>
          </div>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => {
                if (item.items) {
                  return (
                    <Collapsible
                      key={item.title}
                      defaultOpen
                      className="group/collapsible"
                    >
                      <SidebarMenuItem>
                        <CollapsibleTrigger asChild>
                          <SidebarMenuButton className="hover:bg-white/50 transition-all duration-200 rounded-lg mx-2 group-hover/collapsible:bg-white/30">
                            <div className={`p-2 rounded-lg ${item.bgColor}`}>
                              <item.icon className={`size-4 ${item.color}`} />
                            </div>
                            <span className="font-medium text-slate-700">
                              {item.title}
                            </span>
                            <ChevronDown className="ml-auto transition-transform group-data-[state=open]/collapsible:rotate-180 text-slate-400" />
                          </SidebarMenuButton>
                        </CollapsibleTrigger>
                        <CollapsibleContent>
                          <SidebarMenuSub>
                            {item.items.map((subItem) => (
                              <SidebarMenuSubItem key={subItem.title}>
                                <SidebarMenuSubButton
                                  asChild
                                  isActive={pathname === subItem.url}
                                  className="hover:bg-white/50 transition-colors duration-200 rounded-lg mx-2"
                                >
                                  <Link href={subItem.url} className="py-2">
                                    {subItem.icon && (
                                      <subItem.icon className="size-3.5 text-slate-500 mr-2" />
                                    )}
                                    <span className="text-sm text-slate-600">
                                      {subItem.title}
                                    </span>
                                  </Link>
                                </SidebarMenuSubButton>
                              </SidebarMenuSubItem>
                            ))}
                          </SidebarMenuSub>
                        </CollapsibleContent>
                      </SidebarMenuItem>
                    </Collapsible>
                  );
                }

                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      asChild
                      isActive={pathname === item.url}
                      className="hover:bg-white/50 transition-all duration-200 rounded-lg mx-2"
                    >
                      <Link href={item.url}>
                        <div className={`p-2 rounded-lg ${item.bgColor}`}>
                          <item.icon className={`size-4 ${item.color}`} />
                        </div>
                        <span className="font-medium text-slate-700">
                          {item.title}
                        </span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  );
}
