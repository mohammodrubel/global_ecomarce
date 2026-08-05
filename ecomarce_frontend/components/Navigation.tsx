"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ChevronDown, Menu as MenuIcon, Ticket, Copy } from "lucide-react";
import { toast } from "sonner";
import { useGetLatestCouponQuery } from "@/redux/fetchers/coupon/couponApi";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Sidebar } from "./Sidebar";

type NavItem = {
  label: string;
  href?: string;
  badge?: string;
  subItems?: {
    label: string;
    href: string;
    description?: string;
  }[];
};

const NAV_ITEMS: NavItem[] = [
  {
    label: "Home",
    href: "/",
  },
  {
    label: "Shop",
    href: "/shop",
    subItems: [
      { label: "All Products", href: "/shop" },
      { label: "New Arrivals", href: "/shop/new" },
      { label: "Best Sellers", href: "/shop/bestsellers" },
    ],
  },
  {
    label: "About",
    href: "/about",
  },
  {
    label: "Contact",
    href: "/contact",
  },
];

export function Navigation() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openSub, setOpenSub] = useState<string | null>(null);
  const { data: latestCouponRes } = useGetLatestCouponQuery(undefined);
  const latestCoupon = latestCouponRes?.data;

  const isActive = (href: string) => pathname === href;

  const copyCoupon = () => {
    if (!latestCoupon?.code) return;
    navigator.clipboard.writeText(latestCoupon.code);
    toast.success(`Copied ${latestCoupon.code}`);
  };

  const couponLabel = latestCoupon
    ? latestCoupon.discountType === "PERCENTAGE"
      ? `${latestCoupon.value}% OFF`
      : `৳${latestCoupon.value} OFF`
    : null;

  const closeMobile = () => {
    setMobileOpen(false);
    setOpenSub(null);
  };

  return (
    <div className="bg-[#1C398E] border-b border-[#152B6E] shadow-sm">
      <div className="container mx-auto px-4">
        <nav className="text-white" aria-label="Main navigation">
          <div className="flex items-center justify-between py-2">
            {/* Mobile */}
            <div className="lg:hidden w-full">
              <div className="flex items-center justify-between gap-2">
                <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
                  <SheetTrigger asChild>
                    <Button
                      variant="ghost"
                      className="flex-1 justify-start text-white hover:bg-[#152B6E] focus:bg-[#152B6E] rounded-lg gap-2 h-10 px-3"
                    >
                      <MenuIcon className="h-4 w-4" />
                      <span className="font-medium text-sm">Menu</span>
                    </Button>
                  </SheetTrigger>
                  <SheetContent
                    side="left"
                    className="w-[85vw] max-w-sm p-0 bg-[#1C398E] text-white border-r border-[#152B6E]"
                  >
                    <SheetHeader className="p-4 border-b border-[#152B6E]">
                      <SheetTitle className="text-white text-left text-lg">
                        Menu
                      </SheetTitle>
                    </SheetHeader>
                    <nav className="p-3 overflow-y-auto h-[calc(100%-70px)]">
                      {NAV_ITEMS.map((item) =>
                        item.subItems ? (
                          <Collapsible
                            key={item.label}
                            open={openSub === item.label}
                            onOpenChange={(o) =>
                              setOpenSub(o ? item.label : null)
                            }
                          >
                            <CollapsibleTrigger asChild>
                              <button className="w-full flex items-center justify-between px-3 py-3 rounded-lg text-sm font-medium hover:bg-[#152B6E] transition-colors">
                                <span>{item.label}</span>
                                <ChevronDown
                                  className={`h-4 w-4 transition-transform duration-200 ${
                                    openSub === item.label ? "rotate-180" : ""
                                  }`}
                                />
                              </button>
                            </CollapsibleTrigger>
                            <CollapsibleContent className="mt-1 mb-1 ml-3 border-l border-white/15 pl-3 space-y-0.5">
                              {item.subItems.map((subItem) => (
                                <Link
                                  key={subItem.label}
                                  href={subItem.href}
                                  onClick={closeMobile}
                                  className="block px-3 py-2 rounded-md text-sm text-white/80 hover:text-white hover:bg-[#152B6E] transition-colors"
                                >
                                  {subItem.label}
                                </Link>
                              ))}
                            </CollapsibleContent>
                          </Collapsible>
                        ) : (
                          <Link
                            key={item.label}
                            href={item.href || "#"}
                            onClick={closeMobile}
                            className={`block px-3 py-3 rounded-lg text-sm font-medium transition-colors ${
                              isActive(item.href || "")
                                ? "bg-[#152B6E] text-cyan-400"
                                : "hover:bg-[#152B6E]"
                            }`}
                          >
                            {item.label}
                          </Link>
                        )
                      )}
                    </nav>
                  </SheetContent>
                </Sheet>

                <Sidebar />
              </div>
            </div>

            {/* Desktop */}
            <div className="hidden lg:flex items-center gap-1">
              {NAV_ITEMS.map((item) =>
                item.subItems ? (
                  <DropdownMenu key={item.label}>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        className={`group relative text-white px-4 py-2 h-auto text-sm xl:text-base font-medium rounded-md transition-colors hover:bg-[#152B6E] hover:text-white data-[state=open]:bg-[#152B6E] ${
                          isActive(item.href || "")
                            ? "bg-[#152B6E] text-cyan-400"
                            : ""
                        }`}
                        aria-haspopup="true"
                      >
                        <span className="relative">
                          {item.label}
                          <span
                            className={`absolute -bottom-1 left-0 h-0.5 bg-cyan-400 transition-all duration-200 ${
                              isActive(item.href || "")
                                ? "w-full"
                                : "w-0 group-hover:w-full"
                            }`}
                          />
                        </span>
                        <ChevronDown className="ml-1.5 h-4 w-4 transition-transform duration-200 group-data-[state=open]:rotate-180" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                      className="bg-[#1C398E] text-white border border-[#152B6E] min-w-[220px] mt-2 rounded-md shadow-xl p-1"
                      align="start"
                    >
                      {item.subItems.map((subItem) => (
                        <DropdownMenuItem
                          key={subItem.label}
                          className="group/item hover:bg-[#152B6E] focus:bg-[#152B6E] px-3 py-2.5 rounded-sm transition-colors cursor-pointer"
                          asChild
                        >
                          <Link
                            href={subItem.href}
                            className="flex items-center gap-2"
                          >
                            <span className="h-1.5 w-1.5 rounded-full bg-cyan-400/0 group-hover/item:bg-cyan-400 transition-colors" />
                            <span>{subItem.label}</span>
                          </Link>
                        </DropdownMenuItem>
                      ))}
                    </DropdownMenuContent>
                  </DropdownMenu>
                ) : (
                  <Link
                    key={item.label}
                    href={item.href || "#"}
                    className={`group relative text-white px-4 py-2 text-sm xl:text-base font-medium rounded-md transition-colors hover:bg-[#152B6E] ${
                      isActive(item.href || "")
                        ? "bg-[#152B6E] text-cyan-400"
                        : ""
                    }`}
                    aria-current={
                      isActive(item.href || "") ? "page" : undefined
                    }
                  >
                    <span className="relative inline-flex items-center gap-1">
                      {item.label}
                      <span
                        className={`absolute -bottom-1 left-0 h-0.5 bg-cyan-400 transition-all duration-200 ${
                          isActive(item.href || "")
                            ? "w-full"
                            : "w-0 group-hover:w-full"
                        }`}
                      />
                    </span>
                  </Link>
                )
              )}

              {/* Latest coupon */}
              {latestCoupon && (
                <button
                  type="button"
                  onClick={copyCoupon}
                  title="Click to copy code"
                  style={{ backgroundColor: "#FF6347" }}
                  className="ml-3 hidden xl:inline-flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-md text-white text-xs font-bold shadow-sm"
                >
                  <span className="inline-flex items-center gap-1 bg-white/20 rounded px-1.5 py-0.5">
                    <Ticket className="h-3.5 w-3.5" />
                    {couponLabel}
                  </span>
                  <span className="tracking-wider">{latestCoupon.code}</span>
                  <Copy className="h-3 w-3 opacity-80" />
                </button>
              )}
            </div>
          </div>
        </nav>
      </div>
    </div>
  );
}
