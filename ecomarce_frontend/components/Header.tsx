"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Heart, Search, ShoppingCart, User, Menu } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, FormEvent } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/store";

export function Header() {
  const [search, setSearch] = useState<string>("");

  const totalQuantity = useSelector(
    (state: RootState) => state.cart?.totalQuantity
  );
  const totalWishlist = useSelector(
    (state: RootState) => state.wishlist?.totalwishlistProduct
  );

  const router = useRouter();

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    router.push(`/shop?searchTerm=${search}`);
  };

  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-50 shadow-sm">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:bg-white focus:px-4 focus:py-2 focus:z-50 focus:ring-2 focus:ring-[#1C398E]"
      >
        Skip to content
      </a>

      <div className="container mx-auto px-4">
        {/* Desktop: single row. Mobile: two rows */}
        <div className="flex items-center gap-2 sm:gap-4 lg:gap-8 py-3">
          {/* Left: mobile menu + logo */}
          <div className="flex items-center gap-2 shrink-0">
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden hover:bg-slate-100"
              aria-label="Open menu"
            >
              <Menu className="h-5 w-5" />
            </Button>

            <Link
              href="/"
              className="focus:outline-none focus:ring-2 focus:ring-[#1C398E] focus:ring-offset-2 rounded-sm"
            >
              <h1 className="text-xl md:text-2xl font-extrabold tracking-tight text-slate-900">
                Rocks<span className="text-[#1C398E]">Mart</span>
              </h1>
            </Link>
          </div>

          {/* Center: search (desktop) */}
          <form
            role="search"
            onSubmit={handleSubmit}
            aria-label="Search products"
            className="hidden md:flex flex-1 max-w-2xl mx-auto"
          >
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search products, brands, categories..."
              className="rounded-r-none border-r-0 border-slate-300 focus-visible:ring-2 focus-visible:ring-[#1C398E] h-10"
              aria-label="Search products"
            />
            <Button
              type="submit"
              className="rounded-l-none bg-[#1C398E] hover:bg-[#152B6E] px-5 h-10"
              aria-label="Submit search"
            >
              <Search className="h-4 w-4" />
            </Button>
          </form>

          {/* Right: icons */}
          <div className="flex items-center gap-1 sm:gap-2 ml-auto shrink-0">
            <Button
              variant="ghost"
              size="icon"
              className="relative hidden sm:inline-flex hover:bg-slate-100 text-slate-700"
              aria-label="Wishlist"
              asChild
            >
              <Link href="/wishlist">
                <Heart className="h-5 w-5" />
                <Badge className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 flex items-center justify-center bg-[#1C398E] text-xs">
                  {totalWishlist || 0}
                </Badge>
              </Link>
            </Button>

            <Button
              variant="ghost"
              size="icon"
              className="relative hover:bg-slate-100 text-slate-700"
              aria-label="Shopping cart"
              asChild
            >
              <Link href="/cart">
                <ShoppingCart className="h-5 w-5" />
                <Badge className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 flex items-center justify-center bg-[#1C398E] text-xs">
                  {totalQuantity || 0}
                </Badge>
              </Link>
            </Button>

            <Button
              variant="ghost"
              size="icon"
              className="relative hidden sm:inline-flex hover:bg-slate-100 text-slate-700"
              aria-label="User account"
              asChild
            >
              <Link href="/account">
                <User className="h-5 w-5" />
                <Badge className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 flex items-center justify-center bg-orange-500 text-xs">
                  0
                </Badge>
              </Link>
            </Button>
          </div>
        </div>

        {/* Mobile search row */}
        <div className="md:hidden pb-3">
          <form
            role="search"
            onSubmit={handleSubmit}
            aria-label="Search products"
            className="flex w-full"
          >
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search products..."
              className="rounded-r-none border-r-0 border-slate-300 focus-visible:ring-2 focus-visible:ring-[#1C398E] h-10"
              aria-label="Search products"
            />
            <Button
              type="submit"
              className="rounded-l-none bg-[#1C398E] hover:bg-[#152B6E] px-4 h-10"
              aria-label="Submit search"
            >
              <Search className="h-4 w-4" />
            </Button>
          </form>
        </div>
      </div>
    </header>
  );
}
