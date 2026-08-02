"use client";

import Link from "next/link";
import React from "react";
import { Card, CardContent } from "./ui/card";
import Image from "next/image";
import { useGetAllCategoryQuery } from "@/redux/fetchers/categoryApi/categoryApi";
import { Category } from "@/lib/Types";
import { Skeleton } from "./ui/skeleton";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

function TopCategories() {
  const { isLoading, isError, data } = useGetAllCategoryQuery(undefined);
  const mainData = data?.data;

  // 🧱 Loading State
  if (isLoading) {
    return (
      <section className="py-12 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-10">
            <Skeleton className="h-8 w-48 mx-auto mb-3" />
            <Skeleton className="h-4 w-64 mx-auto" />
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {Array.from({ length: 6 }).map((_, index) => (
              <Card key={index} className="border-none shadow-sm">
                <CardContent className="p-4 text-center">
                  <Skeleton className="w-20 h-20 rounded-full mx-auto mb-3" />
                  <Skeleton className="h-4 w-20 mx-auto" />
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    );
  }

  // ❌ Error State
  if (isError) {
    return (
      <section className="py-12 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-10">
            <h2 className="text-2xl font-bold mb-2">Shop by Category</h2>
            <p className="text-gray-600">Explore our wide range of product categories</p>
          </div>
          <div className="text-center p-6 bg-red-50 rounded-lg">
            <p className="text-red-500">Failed to load categories. Please try again later.</p>
          </div>
        </div>
      </section>
    );
  }

  // ✅ Success State
  return (
    <section className="py-12 ">
      <div className="container mx-auto px-4">
        <div className="text-center mb-10">
          <h2 className="text-2xl md:text-3xl font-bold mb-2">Shop by Category</h2>
          <p className="text-gray-600 text-sm md:text-base">
            Explore our wide range of product categories
          </p>
        </div>

        <Carousel className="w-full">
          <CarouselContent className="-ml-4">
            {mainData?.map((category: Category) => (
              <CarouselItem
                key={category.id}
                className="pl-4 basis-1/2 sm:basis-1/3 md:basis-1/4 lg:basis-1/6"
              >
                <Link href={`/shop?categoryId=${category.id}`}>
                  <Card className="group transition-all duration-300 border-0  bg-white cursor-pointer overflow-hidden">
                    <CardContent className="p-6 text-center">
                      {/* Fixed size image container */}
                      <div className="relative w-24 h-24 mx-auto mb-4">
                        <Image
                          src={category.icon || "/placeholder.svg"}
                          alt={category.name}
                          fill
                          className="object-contain rounded-full transition-transform duration-300 group-hover:scale-110"
                          sizes="(max-width: 768px) 96px, 96px"
                        />
                      </div>
                      
                      {/* Fixed height text container */}
                      <div className="h-12 flex items-center justify-center">
                        <h3 className="font-semibold text-sm md:text-base text-gray-800 group-hover:text-[#1C398E] transition-colors line-clamp-2">
                          {category.name}
                        </h3>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              </CarouselItem>
            ))}
          </CarouselContent>

          {/* Carousel Controls */}
          <CarouselPrevious className="hidden sm:flex -left-2 lg:-left-4" />
          <CarouselNext className="hidden sm:flex -right-2 lg:-right-4" />
        </Carousel>
      </div>
    </section>
  );
}

export default TopCategories;