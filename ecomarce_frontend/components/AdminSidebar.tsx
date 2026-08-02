"use client";

import type * as React from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import { toast } from "sonner";
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Users,
  ChevronDown,
  Building,
  Ticket,
  LogOut,
  Store,
  Image as ImageIcon,
  Sparkles,
  FolderTree,
  Megaphone,
} from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
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
import { logout } from "@/redux/fetchers/auth/authSlice";

type SubItem = { title: string; url: string };
type MenuItem = {
  title: string;
  url?: string;
  icon: React.ElementType;
  items?: SubItem[];
};

const overview: MenuItem[] = [
  { title: "Overview", url: "/dashboard", icon: LayoutDashboard },
];

const commerce: MenuItem[] = [
  {
    title: "Orders",
    icon: ShoppingCart,
    items: [{ title: "All Orders", url: "/dashboard/all-orders" }],
  },
  {
    title: "Products",
    icon: Package,
    items: [
      { title: "All Products", url: "/dashboard/all-product" },
      { title: "Add Product", url: "/dashboard/add-product" },
      { title: "Product Colors", url: "/dashboard/add-product-color" },
    ],
  },
  {
    title: "Categories",
    icon: FolderTree,
    items: [
      { title: "All Categories", url: "/dashboard/all-categories" },
      { title: "Add Category", url: "/dashboard/add-categories" },
    ],
  },
  {
    title: "Brands",
    icon: Building,
    items: [
      { title: "All Brands", url: "/dashboard/brand" },
      { title: "Add Brand", url: "/dashboard/add-brand" },
    ],
  },
  { title: "Customers", url: "/dashboard/customars", icon: Users },
];

const marketing: MenuItem[] = [
  {
    title: "Coupons",
    icon: Ticket,
    items: [
      { title: "All Coupons", url: "/dashboard/coupons" },
      { title: "Add Coupon", url: "/dashboard/add-coupon" },
    ],
  },
  {
    title: "Banners",
    icon: ImageIcon,
    items: [
      { title: "All Banners", url: "/dashboard/all-banners" },
      { title: "Add Banner", url: "/dashboard/add-banner" },
    ],
  },
  {
    title: "Special Offers",
    icon: Sparkles,
    items: [
      { title: "All Offers", url: "/dashboard/specialOffer" },
      { title: "Add Offer", url: "/dashboard/add-special" },
    ],
  },
  {
    title: "Advertisements",
    icon: Megaphone,
    items: [
      { title: "All Ads", url: "/dashboard/all-advertisements" },
      { title: "Add Ad", url: "/dashboard/add-advertisement" },
    ],
  },
];

function isMenuActive(pathname: string, item: MenuItem) {
  if (item.url && pathname === item.url) return true;
  if (item.items?.some((s) => pathname === s.url)) return true;
  return false;
}

function MenuBlock({
  label,
  items,
  pathname,
}: {
  label: string;
  items: MenuItem[];
  pathname: string;
}) {
  return (
    <SidebarGroup>
      <SidebarGroupLabel className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 px-3">
        {label}
      </SidebarGroupLabel>
      <SidebarGroupContent>
        <SidebarMenu>
          {items.map((item) => {
            const Icon = item.icon;
            const active = isMenuActive(pathname, item);
            if (item.items?.length) {
              return (
                <Collapsible
                  key={item.title}
                  defaultOpen={active}
                  className="group/collapsible"
                >
                  <SidebarMenuItem>
                    <CollapsibleTrigger asChild>
                      <SidebarMenuButton
                        tooltip={item.title}
                        className="text-slate-700 hover:bg-slate-100 hover:text-slate-900 data-[state=open]:bg-slate-50 h-9"
                      >
                        <Icon className="h-4 w-4" />
                        <span className="text-sm font-medium">{item.title}</span>
                        <ChevronDown className="ml-auto h-3.5 w-3.5 text-slate-400 transition-transform group-data-[state=open]/collapsible:rotate-180" />
                      </SidebarMenuButton>
                    </CollapsibleTrigger>
                    <CollapsibleContent>
                      <SidebarMenuSub className="border-l border-slate-200 ml-3.5 mt-1 pl-3">
                        {item.items.map((sub) => {
                          const subActive = pathname === sub.url;
                          return (
                            <SidebarMenuSubItem key={sub.url}>
                              <SidebarMenuSubButton
                                asChild
                                isActive={subActive}
                                className={
                                  subActive
                                    ? "bg-blue-50 text-blue-700 font-medium hover:bg-blue-50 hover:text-blue-700"
                                    : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                                }
                              >
                                <Link href={sub.url}>{sub.title}</Link>
                              </SidebarMenuSubButton>
                            </SidebarMenuSubItem>
                          );
                        })}
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
                  isActive={active}
                  tooltip={item.title}
                  className={
                    active
                      ? "bg-blue-50 text-blue-700 hover:bg-blue-50 hover:text-blue-700 font-medium h-9"
                      : "text-slate-700 hover:bg-slate-100 hover:text-slate-900 h-9"
                  }
                >
                  <Link href={item.url || "#"}>
                    <Icon className="h-4 w-4" />
                    <span className="text-sm font-medium">{item.title}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            );
          })}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
}

export function AdminSidebar({
  ...props
}: React.ComponentProps<typeof Sidebar>) {
  const pathname = usePathname() || "";
  const router = useRouter();
  const dispatch = useDispatch();

  const handleLogout = () => {
    dispatch(logout());
    toast.success("Logged out");
    router.push("/");
  };

  return (
    <Sidebar collapsible="icon" className="border-r border-slate-200" {...props}>
      <SidebarHeader className="border-b border-slate-200 px-4 py-3.5">
        <Link href="/dashboard" className="flex items-center gap-2.5">
          <div className="h-9 w-9 rounded-lg bg-[#2563EB] text-white flex items-center justify-center font-bold shrink-0">
            R
          </div>
          <div className="group-data-[collapsible=icon]:hidden">
            <p className="font-semibold text-slate-900 leading-tight text-[15px]">
              Rocks<span className="text-[#2563EB]">Mart</span>
            </p>
            <p className="text-[10px] text-slate-500 uppercase tracking-wider">
              Admin Panel
            </p>
          </div>
        </Link>
      </SidebarHeader>

      <SidebarContent className="py-2">
        <MenuBlock label="Overview" items={overview} pathname={pathname} />
        <MenuBlock label="Commerce" items={commerce} pathname={pathname} />
        <MenuBlock label="Marketing" items={marketing} pathname={pathname} />
      </SidebarContent>

      <SidebarFooter className="border-t border-slate-200 p-2">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              tooltip="Back to store"
              className="text-slate-700 hover:bg-slate-100 hover:text-slate-900 h-9"
            >
              <Link href="/">
                <Store className="h-4 w-4" />
                <span className="text-sm font-medium">Back to store</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton
              onClick={handleLogout}
              tooltip="Logout"
              className="text-red-600 hover:bg-red-50 hover:text-red-700 h-9"
            >
              <LogOut className="h-4 w-4" />
              <span className="text-sm font-medium">Logout</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  );
}
