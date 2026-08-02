"use client";

import { useMemo, useState } from "react";
import { ChevronRight, LayoutGrid, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
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
import { useGetAllCategoryQuery } from "@/redux/fetchers/categoryApi/categoryApi";
import Image from "next/image";
import { Skeleton } from "@/components/ui/skeleton";
import { Category } from "@/lib/Types";
import Link from "next/link";

function pickRandom<T>(arr: T[], n: number): T[] {
  if (!arr?.length) return [];
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy.slice(0, n);
}

function DesktopSidebar() {
  const { isLoading, isError, data } = useGetAllCategoryQuery(undefined);
  const [hoveredCategory, setHoveredCategory] = useState<string | null>(null);
  const mainData = useMemo(
    () => pickRandom<Category>(data?.data ?? [], 8),
    [data]
  );

  if (isLoading) {
    return (
      <aside className="relative w-64 bg-white shadow-lg h-full hidden lg:block rounded-lg">
        <div className="p-4">
          {Array.from({ length: 8 }).map((_, index) => (
            <div key={index} className="relative mb-2">
              <div className="w-full p-3 h-auto rounded-lg flex items-center justify-between">
                <div className="flex items-center">
                  <Skeleton className="h-7 w-7 rounded-full mx-2" />
                  <Skeleton className="h-4 w-24" />
                </div>
                <Skeleton className="h-4 w-4" />
              </div>
            </div>
          ))}
        </div>
      </aside>
    );
  }

  if (isError) {
    return (
      <aside className="relative w-64 bg-white shadow-lg h-full hidden lg:block rounded-lg">
        <div className="p-4">
          <div className="text-center p-4 text-red-500">
            Failed to load categories
          </div>
        </div>
      </aside>
    );
  }

  return (
    <aside className="relative w-64 bg-white shadow-lg h-full hidden lg:block rounded-2xl">
      <div className="p-3 space-y-1.5">
        {/* <h2 className="text-lg font-semibold mb-4 px-2">Categories</h2> */}
        {mainData?.map((category: Category) => (
          <div
            key={category.name}
            className="relative"
            onMouseEnter={() => setHoveredCategory(category.name)}
            onMouseLeave={() => setHoveredCategory(null)}
          >
            <Button
              variant="ghost"
              className={`w-full justify-between text-left px-3 py-2.5 h-auto transition-all duration-300 rounded-full group ${
                hoveredCategory === category.name
                  ? "bg-[#1C398E] text-white shadow-md scale-[1.02]"
                  : "text-gray-700 hover:bg-[#1C398E]/10"
              }`}
            >
              <div className="flex items-center gap-3">
                <span
                  className={`flex items-center justify-center h-9 w-9 rounded-full transition-all duration-300 ${
                    hoveredCategory === category.name
                      ? "bg-white/25 backdrop-blur-sm"
                      : "bg-[#1C398E]/10 group-hover:bg-[#1C398E]/20"
                  }`}
                >
                  <Image
                    src={category.icon}
                    width={22}
                    height={22}
                    className="object-contain"
                    alt={category.name}
                  />
                </span>
                <span className="font-medium text-sm">{category.name}</span>
              </div>
              <ChevronRight
                className={`h-4 w-4 transition-all duration-300 ${
                  hoveredCategory === category.name
                    ? "text-white translate-x-0.5"
                    : "text-gray-400"
                }`}
              />
            </Button>

            {hoveredCategory === category.name && (
              <Card className="absolute left-full top-0 ml-2 w-64 shadow-2xl border-0 z-50 animate-in slide-in-from-left-2 duration-200 min-h-[300px] rounded-2xl overflow-hidden">
                <CardContent className="p-4">
                  <h3 className="font-semibold text-gray-900 mb-3 border-b pb-2">
                    {category.name}
                  </h3>
                  <div className="space-y-1">
                    {category.subcategories.map((subcategory) => (
                      <Link href={`/shop?subcategory=${encodeURIComponent(subcategory)}`} key={subcategory}>
                        <Button
                          key={subcategory}
                          variant="ghost"
                          className="w-full justify-start text-left px-3 py-2 h-auto text-sm hover:bg-[#1C398E]/10 hover:text-[#1C398E] transition-colors rounded-full"
                        >
                          {subcategory}
                        </Button>
                      </Link>
                    ))}
                  </div>

                </CardContent>
              </Card>
            )}
          </div>
        ))}
      </div>
    </aside>
  );
}

function MobileSidebar() {
  const [openCategory, setOpenCategory] = useState<string | null>(null);
  const { isLoading, isError, data } = useGetAllCategoryQuery(undefined);
  const mainData = useMemo(
    () => pickRandom<Category>(data?.data ?? [], 8),
    [data]
  );

  if (isLoading) {
    return (
      <div className="lg:hidden">
        <Button
          variant="outline"
          size="sm"
          className="m-2 bg-[#1C398E] text-white"
          disabled
        >
          <LayoutGrid className="h-4 w-4" />
          Categories
        </Button>

        <Sheet open={false}>
          <SheetContent side="left" className="w-[300px] sm:w-[350px] p-0">
            <SheetHeader className="p-4 border-b">
              <SheetTitle className="text-left">Categories</SheetTitle>
            </SheetHeader>
            <div className="overflow-y-auto h-[calc(100%-60px)] pb-4">
              {Array.from({ length: 6 }).map((_, index) => (
                <div key={index} className="border-b">
                  <div className="w-full p-4 h-auto flex items-center justify-between">
                    <div className="flex items-center">
                      <Skeleton className="h-7 w-7 rounded-full mx-2" />
                      <Skeleton className="h-4 w-28" />
                    </div>
                    <Skeleton className="h-4 w-4" />
                  </div>
                </div>
              ))}
            </div>
          </SheetContent>
        </Sheet>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="lg:hidden">
        <Sheet>
          <SheetTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              className="m-2 bg-[#1C398E] text-white"
            >
              <Menu className="h-4 w-4 mr-2" />
              Categories
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-[300px] sm:w-[350px] p-0">
            <SheetHeader className="p-4 border-b">
              <SheetTitle className="text-left">Categories</SheetTitle>
            </SheetHeader>
            <div className="overflow-y-auto h-[calc(100%-60px)] pb-4 flex items-center justify-center">
              <div className="text-center p-4 text-red-500">
                Failed to load categories
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    );
  }

  return (
    <div className="lg:hidden">
      <Sheet>
        <SheetTrigger asChild>
          <Button
            variant="ghost"
            className="justify-start bg-white/10 text-white hover:bg-white/20 hover:text-white border border-white/20 rounded-lg gap-2 h-10 px-3 font-medium text-sm"
          >
            <Menu className="h-4 w-4 mr-2" />
            Categories
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-[300px] sm:w-[350px] p-0">
          <SheetHeader className="p-4 border-b">
            <SheetTitle className="text-left">Categories</SheetTitle>
          </SheetHeader>
          <div className="overflow-y-auto h-[calc(100%-60px)] pb-4">
            {mainData?.map((category: Category) => (
              <Collapsible
                key={category.name}
                open={openCategory === category.name}
                onOpenChange={(isOpen) =>
                  setOpenCategory(isOpen ? category.name : null)
                }
              >
                <CollapsibleTrigger asChild>
                  <Button
                    variant="ghost"
                    className="w-full justify-between text-left p-4 h-auto  border-b rounded-none"
                  >
                    <div className="flex items-center">
                      <Image
                        src={category.icon}
                        width={30}
                        height={30}
                        className="mx-2"
                        alt={category.name}
                      />
                      <span className="font-medium">{category.name}</span>
                    </div>
                    <ChevronRight
                      className={`h-4 w-4 transition-transform ${
                        openCategory === category.name ? "rotate-90" : ""
                      }`}
                    />
                  </Button>
                </CollapsibleTrigger>
                <CollapsibleContent className="bg-gray-50 animate-in slide-in-from-top-2">
                  <div className="p-3 space-y-1">
                    {category?.subcategories?.map((subcategory) => (
                      <Link href={`/shop?subcategory=${encodeURIComponent(subcategory)}`} key={subcategory}>
                        <Button
                          variant="ghost"
                          className="w-full justify-start text-left p-3 h-auto text-sm  hover:text-blue-transition-colors rounded-md"
                        >
                          {subcategory}
                        </Button>
                      </Link>
                    ))}
                  </div>
                </CollapsibleContent>
              </Collapsible>
            ))}
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}

export function Sidebar() {
  return (
    <>
      <DesktopSidebar />
      <MobileSidebar />
    </>
  );
}
