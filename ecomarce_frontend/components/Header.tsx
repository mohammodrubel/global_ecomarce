"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Heart,
  KeyRound,
  LayoutDashboard,
  LogIn,
  LogOut,
  Search,
  ShoppingCart,
  User,
  UserCircle2,
  UserPlus,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, FormEvent } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { logout } from "@/redux/fetchers/auth/authSlice";
import { useMeQuery } from "@/redux/fetchers/auth/authApi";
import { toast } from "sonner";

export function Header() {
  const [search, setSearch] = useState<string>("");

  const dispatch = useDispatch();
  const totalQuantity = useSelector(
    (state: RootState) => state.cart?.totalQuantity
  );
  const totalWishlist = useSelector(
    (state: RootState) => state.wishlist?.totalwishlistProduct
  );
  const user = useSelector((state: RootState) => state.auth?.user);
  const token = useSelector((state: RootState) => state.auth?.token);
  const isAuthed = Boolean(user);
  const { data: meRes } = useMeQuery(undefined, { skip: !token });
  const profilePhoto: string | null = meRes?.data?.profile_photo || null;
  const displayName = meRes?.data?.full_name || user?.name || "User";
  const avatarInitials = (displayName || "U")
    .split(" ")
    .map((s: string) => s[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  const router = useRouter();

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    router.push(`/shop?searchTerm=${search}`);
  };

  const handleLogout = () => {
    dispatch(logout());
    toast.success("Logged out");
    router.push("/");
  };

  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-50 shadow-sm">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:bg-white focus:px-4 focus:py-2 focus:z-50 focus:ring-2 focus:ring-[#1C398E]"
      >
        Skip to content
      </a>

      <div className="container mx-auto px-4 max-w-[1400px]">
        {/* Desktop: single row. Mobile: two rows */}
        <div className="flex items-center gap-3 sm:gap-6 lg:gap-10 py-4">
          {/* Logo */}
          <div className="flex items-center shrink-0">
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
            className="hidden md:flex flex-1 max-w-4xl mx-auto"
          >
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search products, brands, categories..."
              className="rounded-r-none border-r-0 border-slate-300 focus-visible:ring-2 focus-visible:ring-[#1C398E] h-12 text-base px-4"
              aria-label="Search products"
            />
            <Button
              type="submit"
              className="rounded-l-none bg-[#1C398E] hover:bg-[#152B6E] px-7 h-12"
              aria-label="Submit search"
            >
              <Search className="h-5 w-5" />
            </Button>
          </form>

          {/* Right: icons */}
          <div className="flex items-center gap-2 sm:gap-3 ml-auto shrink-0">
            <Button
              variant="ghost"
              className="relative hidden sm:inline-flex text-slate-700 h-12 w-12 rounded-lg "
              aria-label="Wishlist"
              asChild
            >
              <Link href="/wishlist">
                <Heart className="!h-6 !w-6" />
                <Badge className="absolute -top-1 -right-1 h-5 min-w-[20px] px-1 rounded-full flex items-center justify-center text-[11px] font-semibold">
                  {totalWishlist || 0}
                </Badge>
              </Link>
            </Button>

            <Button
              variant="ghost"
              className="relative text-slate-700 h-12 w-12 rounded-lg "
              aria-label="Shopping cart"
              asChild
            >
              <Link href="/cart">
                <ShoppingCart className="!h-6 !w-6" />
                <Badge className="absolute -top-1 -right-1 h-5 min-w-[20px] px-1 rounded-full flex items-center justify-center text-[11px] font-semibold">
                  {totalQuantity || 0}
                </Badge>
              </Link>
            </Button>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="relative text-slate-700 h-12 w-12 rounded-lg p-0"
                  aria-label="Account menu"
                >
                  {isAuthed && profilePhoto ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={profilePhoto}
                      alt={displayName}
                      className="h-9 w-9 rounded-full object-cover border border-slate-200"
                    />
                  ) : isAuthed ? (
                    <span className="h-9 w-9 rounded-full bg-[#1C398E] text-white flex items-center justify-center text-xs font-semibold">
                      {avatarInitials}
                    </span>
                  ) : (
                    <User className="!h-6 !w-6" />
                  )}
                  {isAuthed && (
                    <span className="absolute top-1.5 right-1.5 h-2.5 w-2.5 rounded-full bg-green-500 ring-2 ring-white" />
                  )}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-72 p-2">
                {isAuthed ? (
                  <>
                    <DropdownMenuLabel className="flex flex-col gap-0.5 px-3 py-2">
                      <span className="text-sm font-semibold truncate">
                        {user?.name || "Account"}
                      </span>
                      {user?.email && (
                        <span className="text-xs text-slate-500 font-normal truncate">
                          {user.email}
                        </span>
                      )}
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild className="py-2.5 px-3 text-sm">
                      <Link href="/dashboard">
                        <LayoutDashboard className="h-4 w-4 mr-2.5" />
                        Dashboard
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild className="py-2.5 px-3 text-sm">
                      <Link href="/account">
                        <UserCircle2 className="h-4 w-4 mr-2.5" />
                        My Account
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      onClick={handleLogout}
                      className="py-2.5 px-3 text-sm text-red-600 focus:text-red-700 focus:bg-red-50"
                    >
                      <LogOut className="h-4 w-4 mr-2.5" />
                      Logout
                    </DropdownMenuItem>
                  </>
                ) : (
                  <>
                    <DropdownMenuLabel className="px-3 py-2">Welcome</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild className="py-2.5 px-3 text-sm">
                      <Link href="/login">
                        <LogIn className="h-4 w-4 mr-2.5" />
                        Login
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild className="py-2.5 px-3 text-sm">
                      <Link href="/register">
                        <UserPlus className="h-4 w-4 mr-2.5" />
                        Register
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild className="py-2.5 px-3 text-sm">
                      <Link href="/forgot-password">
                        <KeyRound className="h-4 w-4 mr-2.5" />
                        Forgot Password
                      </Link>
                    </DropdownMenuItem>
                  </>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
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
