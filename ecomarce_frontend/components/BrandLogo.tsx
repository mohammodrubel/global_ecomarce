"use client";

import { useGetAllBrandQuery } from "@/redux/fetchers/brand/brandApi";
import Image from "next/image";
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import Link from "next/link";

function BrandLogo() {
  const { data, isLoading, isError } = useGetAllBrandQuery(undefined);
  const brands = data?.data || [];

  // 🧱 Loading State
  if (isLoading) {
    return (
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <Skeleton className="h-8 w-48 mx-auto mb-4" />
            <Skeleton className="h-4 w-64 mx-auto" />
          </div>

          <Carousel className="max-w-5xl mx-auto">
            <CarouselContent>
              {Array.from({ length: 6 }).map((_, index) => (
                <CarouselItem
                  key={index}
                  className="basis-1/2 sm:basis-1/3 md:basis-1/4 lg:basis-1/6"
                >
                  <Card className="flex flex-col items-center p-4 border rounded-lg shadow-sm">
                    <CardContent className="flex flex-col items-center">
                      <Skeleton className="w-24 h-24 rounded-full mb-3" />
                      <Skeleton className="h-5 w-24" />
                    </CardContent>
                  </Card>
                </CarouselItem>
              ))}
            </CarouselContent>
          </Carousel>
        </div>
      </section>
    );
  }

  // ❌ Error State
  if (isError) {
    return (
      <section className="py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-2xl font-bold mb-4">Trusted Brands</h2>
          <p className="text-gray-600 mb-8">
            We partner with the world's leading brands
          </p>
          <p className="text-red-500">
            Failed to load brands. Please try again later.
          </p>
        </div>
      </section>
    );
  }

  // ✅ Success State
  return (
    <section className="py-10 sm:py-16">
      <div className="container mx-auto px-4">
        <div className="text-center mb-8 sm:mb-12">
          <h2 className="text-2xl sm:text-3xl font-bold mb-2 sm:mb-4">Trusted Brands</h2>
          <p className="text-sm sm:text-base text-gray-600">
            We partner with the world's leading brands
          </p>
        </div>

        <Carousel className="container mx-auto">
          <CarouselContent>
            {brands.map((brand: any, index: number) => (
              <CarouselItem
                key={index}
                className="basis-1/2 sm:basis-1/3 md:basis-1/4 lg:basis-1/6"
              >
                <Card className="flex flex-col items-center p-4 shadow-sm border rounded-lg hover:shadow-lg transition-shadow">
                  <Link href={`/shop?brandId=${brand?.id}`}>
                    <CardContent className="flex flex-col items-center">
                      <div className="w-24 h-24 relative overflow-hidden rounded-full">
                        <Image
                          src={brand.logo || "/placeholder.svg"}
                          alt={brand.name || `Brand ${index + 1}`}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <h3 className="mt-3 text-center font-medium">
                        {brand.name}
                      </h3>
                    </CardContent>
                  </Link>
                </Card>
              </CarouselItem>
            ))}
          </CarouselContent>

          {/* Navigation buttons */}
          <CarouselPrevious className="hidden sm:flex" />
          <CarouselNext className="hidden sm:flex" />
        </Carousel>
      </div>
    </section>
  );
}

export default BrandLogo;
