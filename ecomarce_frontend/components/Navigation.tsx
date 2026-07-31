"use client";

import { Button } from "@/components/ui/button";
import { ChevronDown, Menu as MenuIcon, Sparkles } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
} from "@/components/ui/dropdown-menu";
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
    label: "Account",
    subItems: [
      { label: "My Profile", href: "/account/profile" },
      { label: "Order History", href: "/account/orders" },
      { label: "Addresses", href: "/account/addresses" },
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

  const isActive = (href: string) => pathname === href;

  return (
    <div className="bg-[#1C398E] border-b border-[#152B6E] shadow-sm">
      <div className="container mx-auto px-4">
        <nav className="text-white" aria-label="Main navigation">
          <div className="flex items-center justify-between py-2">
            {/* Mobile */}
            <div className="lg:hidden w-full">
              <div className="grid grid-cols-2 items-center justify-between">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-white hover:bg-[#152B6E] focus:bg-[#152B6E] rounded-md"
                    >
                      <MenuIcon className="h-5 w-5" />
                      <span className="sr-only">Open menu</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                    className="w-56 bg-[#1C398E] text-white border border-[#152B6E] mt-2 rounded-md shadow-xl"
                    align="start"
                    sideOffset={10}
                  >
                    {NAV_ITEMS.map((item) =>
                      item.subItems ? (
                        <DropdownMenuSub key={item.label}>
                          <DropdownMenuSubTrigger className="hover:bg-[#152B6E] focus:bg-[#152B6E] px-4 py-2.5 rounded-sm transition-colors">
                            {item.label}
                          </DropdownMenuSubTrigger>
                          <DropdownMenuSubContent className="bg-[#1C398E] text-white border border-[#152B6E] w-full rounded-md shadow-xl">
                            {item.subItems.map((subItem) => (
                              <DropdownMenuItem
                                key={subItem.label}
                                className="hover:bg-[#152B6E] focus:bg-[#152B6E] px-4 py-2.5 rounded-sm transition-colors"
                                asChild
                              >
                                <Link href={subItem.href} className="w-full">
                                  {subItem.label}
                                </Link>
                              </DropdownMenuItem>
                            ))}
                          </DropdownMenuSubContent>
                        </DropdownMenuSub>
                      ) : (
                        <DropdownMenuItem
                          key={item.label}
                          className="hover:bg-[#152B6E] focus:bg-[#152B6E] px-4 py-2.5 rounded-sm transition-colors"
                          asChild
                        >
                          <Link href={item.href || "#"} className="w-full">
                            {item.label}
                          </Link>
                        </DropdownMenuItem>
                      )
                    )}
                  </DropdownMenuContent>
                </DropdownMenu>

                <div className="ml-auto">
                  <Sidebar />
                </div>
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

              {/* Promo badge */}
              <Link
                href="/shop/new"
                className="ml-3 hidden xl:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-cyan-500 text-slate-900 text-xs font-semibold hover:bg-cyan-400 transition-colors"
              >
                <Sparkles className="h-3.5 w-3.5" />
                New Drops
              </Link>
            </div>
          </div>
        </nav>
      </div>
    </div>
  );
}
