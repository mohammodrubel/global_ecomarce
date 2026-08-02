"use client";

import { ArrowRight, ShoppingCart } from "lucide-react";
import { Button } from "./ui/button";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { useGetAllNewProductsQuery } from "@/redux/fetchers/products/productsApi";
import { useGetAllAdvertisementQuery } from "@/redux/fetchers/advertisement/advertisementAPi";
import { Product } from "@/lib/Types";
import ProductCard from "./ProductCard";
import Link from "next/link";

function NewProductsSection() {
  const { data: products, isLoading } = useGetAllNewProductsQuery(undefined);
  const { data: advertisements, isLoading: advertisementLoading } =
    useGetAllAdvertisementQuery(undefined);

  const mainData = products?.data || [];

  // Get only active NewProduct-type advertisement
  const advertisementItem = advertisements?.data?.find(
    (ad: any) => ad.active && ad.action === "NewProduct"
  );
  const product = advertisementItem?.product;

  // Advertisement loading skeleton
  if (advertisementLoading) {
    return (
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="h-96 w-full bg-gray-200 animate-pulse rounded-2xl" />
        </div>
      </section>
    );
  }

  // Product list loading skeleton
  if (isLoading) {
    return (
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="h-8 w-48 bg-gray-300 rounded animate-pulse mb-6"></div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <div
                key={i}
                className="h-80 bg-gray-200 rounded-2xl animate-pulse"
              />
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-12 sm:py-16 bg-white">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-10 sm:mb-12 gap-4">
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold mb-2">
              {advertisementItem?.title || "New Arrivals"}
            </h2>
            <p className="text-gray-600 text-sm sm:text-base">
              {advertisementItem
                ? "Check out our newest advertisement products ✨"
                : "Discover the latest additions to our store ✨"}
            </p>
          </div>
          <Link href={`/shop`}>
            <Button variant="outline" className="text-sm sm:text-base">
              View All <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>

        {/* Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 sm:gap-8">
          {/* Advertisement Section */}
          <div className="col-span-1 order-1 lg:order-none">
            {product ? (
              <div className="relative bg-[#1C398E] border border-gray-200 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500 ease-out hover:-translate-y-1 group">
                {/* Image container */}
                <div className="relative overflow-hidden">
                  <div className="relative h-56 sm:h-72 md:h-80 w-full">
                    {/* Main Image */}
                    <img
                      src={product.images?.[0]}
                      alt={product.name}
                      className="absolute inset-0 w-full h-full object-cover transition-all duration-700 ease-out group-hover:opacity-0 group-hover:scale-110"
                    />

                    {/* Hover Image */}
                    {product.images?.[1] && (
                      <img
                        src={product.images[1]}
                        alt={product.name}
                        className="absolute inset-0 w-full h-full object-cover transition-all duration-700 ease-out opacity-0 group-hover:opacity-100 group-hover:scale-100"
                      />
                    )}
                  </div>

                  {/* Gradient Overlay */}
                  <div className="absolute inset-x-0 bottom-0 h-36 sm:h-40 bg-gradient-to-t from-black/60 to-transparent" />

                  {/* Discount Badge */}
                  {product.originalPrice > product.price && (
                    <div className="absolute top-3 right-3 bg-green-500 text-white text-xs sm:text-sm font-bold px-3 py-1 rounded-full shadow-md">
                      {Math.round(
                        ((product.originalPrice - product.price) /
                          product.originalPrice) *
                          100
                      )}
                      % OFF
                    </div>
                  )}

                  {/* Product Badge */}
                  {product.badge && (
                    <div className="absolute top-3 left-3 bg-[#1C398E] text-white text-xs sm:text-sm font-bold px-3 py-1 rounded-full shadow-md">
                      {product.badge}
                    </div>
                  )}

                  {/* Add to Cart Button on Hover */}
                  <div className="absolute bottom-0 left-0 right-0 p-4 transition-all duration-500 translate-y-6 opacity-0 group-hover:translate-y-0 group-hover:opacity-100">
                    <Button className="w-full bg-white text-black hover:bg-white/90 hover:scale-105 shadow-lg border-0 transition-all duration-300">
                      <ShoppingCart className="w-4 h-4 mr-2" />
                      Add to Cart
                    </Button>
                  </div>
                </div>

                {/* Product Info */}
                <div className="p-4">
                  <h3 className="font-semibold text-base sm:text-lg mb-2 line-clamp-2 text-white">
                    {product.name}
                  </h3>

                  {/* Price & Stock */}
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <span className="text-lg sm:text-2xl font-bold text-white">
                        ৳{product.price}
                      </span>
                      {product.originalPrice > product.price && (
                        <span className="text-gray-300 line-through text-xs sm:text-sm">
                          ৳{product.originalPrice}
                        </span>
                      )}
                    </div>

                    {/* Stock Info */}
                    {product.stock === 0 ? (
                      <span className="text-red-300 text-xs sm:text-sm font-medium">
                        Out of Stock
                      </span>
                    ) : product.stock <= 10 ? (
                      <span className="text-yellow-200 text-xs sm:text-sm font-medium">
                        Only {product.stock} left
                      </span>
                    ) : (
                      <span className="text-green-300 text-xs sm:text-sm font-medium">
                        In Stock
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ) : (
              <div className="w-full h-80 bg-gray-200 rounded-2xl flex items-center justify-center text-gray-500">
                No Advertisement Available
              </div>
            )}
          </div>

          {/* Product Carousel */}
          <div className="col-span-1 lg:col-span-3">
            <Carousel className="w-full">
              <CarouselContent className="-ml-2 md:-ml-4">
                {mainData?.map((product: Product) => (
                  <CarouselItem
                    key={product.id}
                    className="pl-2 md:pl-4 basis-full sm:basis-1/2 md:basis-1/3 lg:basis-1/4"
                  >
                    <div className="p-1">
                      <ProductCard product={product} />
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious className="hidden sm:flex left-2" />
              <CarouselNext className="hidden sm:flex right-2" />
            </Carousel>
          </div>
        </div>
      </div>
    </section>
  );
}

export default NewProductsSection;
