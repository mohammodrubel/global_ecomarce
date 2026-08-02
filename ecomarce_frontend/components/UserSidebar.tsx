"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import { toast } from "sonner";
import {
  LayoutDashboard,
  Package,
  Star,
  User,
  Heart,
  ShoppingBag,
  LogOut,
  Store,
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
  SidebarRail,
} from "@/components/ui/sidebar";
import { logout } from "@/redux/fetchers/auth/authSlice";

const primary = [
  { title: "Overview", url: "/dashboard", icon: LayoutDashboard },
  { title: "My Orders", url: "/dashboard/orders", icon: Package },
  { title: "My Reviews", url: "/dashboard/reviews", icon: Star },
  { title: "Profile", url: "/account", icon: User },
];

const shortcuts = [
  { title: "Wishlist", url: "/wishlist", icon: Heart },
  { title: "Continue Shopping", url: "/shop", icon: ShoppingBag },
];

export function UserSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const dispatch = useDispatch();

  const handleLogout = () => {
    dispatch(logout());
    toast.success("Logged out");
    router.push("/");
  };

  const isActive = (url: string) => pathname === url;

  return (
    <Sidebar collapsible="icon" className="border-r border-slate-200">
      <SidebarHeader className="border-b border-slate-200 px-4 py-3.5">
        <Link href="/" className="flex items-center gap-2.5">
          <div className="h-9 w-9 rounded-lg bg-[#2563EB] text-white flex items-center justify-center font-bold shrink-0">
            R
          </div>
          <div className="group-data-[collapsible=icon]:hidden">
            <p className="font-semibold text-slate-900 leading-tight text-[15px]">
              Rocks<span className="text-[#2563EB]">Mart</span>
            </p>
            <p className="text-[10px] text-slate-500 uppercase tracking-wider">
              My Account
            </p>
          </div>
        </Link>
      </SidebarHeader>

      <SidebarContent className="py-2">
        <SidebarGroup>
          <SidebarGroupLabel className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 px-3">
            Account
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {primary.map((item) => {
                const active = isActive(item.url);
                return (
                  <SidebarMenuItem key={item.url}>
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
                      <Link href={item.url}>
                        <item.icon className="h-4 w-4" />
                        <span className="text-sm font-medium">{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 px-3">
            Shortcuts
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {shortcuts.map((item) => (
                <SidebarMenuItem key={item.url}>
                  <SidebarMenuButton
                    asChild
                    tooltip={item.title}
                    className="text-slate-700 hover:bg-slate-100 hover:text-slate-900 h-9"
                  >
                    <Link href={item.url}>
                      <item.icon className="h-4 w-4" />
                      <span className="text-sm font-medium">{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
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
