// components/HeroSection.tsx
"use client";

import Image from "next/image";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import DOMPurify from "dompurify";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "./ui/carousel";
import { useGetAllSlidersQuery } from "@/redux/fetchers/slider/sliderApi";
import { Skeleton } from "./ui/skeleton";

function HeroSection() {
  const { data, isLoading, error } = useGetAllSlidersQuery(undefined);

  if (isLoading) {
    return (
      <section className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-6">
          <div className="w-full lg:w-3/4">
            <Skeleton className="h-[400px] w-full rounded-lg" />
          </div>
          <div className="w-full lg:w-1/4">
            <Skeleton className="h-[400px] w-full rounded-lg" />
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="container mx-auto px-4 py-8">
        <div className="w-full p-8 text-center">
          <p className="text-red-500">Failed to load sliders</p>
          <Button onClick={() => window.location.reload()} className="mt-4">
            Retry
          </Button>
        </div>
      </section>
    );
  }

  if (!data?.data?.length) {
    return (
      <section className="container mx-auto px-4 py-8">
        <div className="w-full p-8 text-center">
          <p>No sliders available</p>
        </div>
      </section>
    );
  }

  return (
    <section className="w-full h-full">
      <div className="w-full h-full">
        {/* Banner Slider */}
        <div className="w-full h-full">
          <Carousel className="w-full h-full relative" opts={{ loop: true }}>
            <CarouselContent className="-ml-4 h-full">
              {data.data.map((slider: any) => (
                <CarouselItem
                  key={slider.id}
                  className="pl-4 md:basis-full lg:basis-full h-full"
                >
                  <div className="h-full bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300">
                    <div className="p-4 sm:p-6 md:p-8 lg:p-10 h-full">
                      <div className="grid md:grid-cols-2 gap-6 md:gap-8 lg:gap-12 items-center h-full">
                        {/* Left Side: Text */}
                        <div className="space-y-4 sm:space-y-5">
                          <Badge className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white border-0 px-3 sm:px-4 py-1 sm:py-1.5 text-xs sm:text-sm font-semibold">
                            FROM ${slider.product?.price ?? "N/A"}
                          </Badge>

                          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 leading-tight">
                            {slider.title}
                          </h1>

                          <div
                            className="text-sm sm:text-base md:text-lg text-gray-600 leading-relaxed line-clamp-3 sm:line-clamp-none"
                            dangerouslySetInnerHTML={{
                              __html: DOMPurify.sanitize(slider.description, {
                                FORBID_ATTR: ["style"],
                              }),
                            }}
                          />

                          <Button className="bg-gray-900 hover:bg-[#1C398E] bg-[#1C398E] text-white px-5 sm:px-8 py-4 sm:py-6 text-sm sm:text-base rounded-full transition-all duration-300 hover:scale-105">
                            {slider.buttonText ?? "Shop Now"}
                            <svg 
                              className="ml-2 w-5 h-5" 
                              fill="none" 
                              stroke="currentColor" 
                              viewBox="0 0 24 24"
                            >
                              <path 
                                strokeLinecap="round" 
                                strokeLinejoin="round" 
                                strokeWidth={2} 
                                d="M14 5l7 7m0 0l-7 7m7-7H3" 
                              />
                            </svg>
                          </Button>
                        </div>

                        {/* Right Side: Image with subtle shadow */}
                        <div className="relative flex justify-center items-center">
                          <Image
                              src={slider.product?.images?.[0] || "/placeholder.png"}
                              alt={slider.product?.name || "Slider Image"}
                              width={500}
                              height={400}
                              className="rounded-lg object-cover max-h-[220px] sm:max-h-[280px] md:max-h-[380px] w-auto shadow-lg"
                              sizes="(max-width: 640px) 90vw, (max-width: 1024px) 45vw, 500px"
                              priority
                            />
                        </div>
                      </div>
                    </div>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            
            {/* Custom Navigation Buttons */}
            <CarouselPrevious className="left-4 top-1/2 -translate-y-1/2 w-9 h-9 sm:w-10 sm:h-10 hidden sm:flex" />
            <CarouselNext className="right-4 top-1/2 -translate-y-1/2 w-9 h-9 sm:w-10 sm:h-10 hidden sm:flex" />
          </Carousel>
        </div>
      </div>
    </section>
  );
}

export default HeroSection;