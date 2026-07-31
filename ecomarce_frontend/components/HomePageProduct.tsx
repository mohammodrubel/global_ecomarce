import { useGetAllProductsQuery } from "@/redux/fetchers/products/productsApi";
import React from "react";
import ProductCard from "./ProductCard";
import { Product } from "@/lib/Types";

function HomePageProduct() {
  const { data, isLoading } = useGetAllProductsQuery(undefined);

  // Skeleton loading component
  const ProductSkeleton = () => (
    <div className="bg-white rounded-lg shadow-md overflow-hidden animate-pulse">
      <div className="bg-gray-200 h-48 w-full"></div>
      <div className="p-4 space-y-3">
        <div className="bg-gray-200 h-4 rounded w-3/4"></div>
        <div className="bg-gray-200 h-3 rounded w-1/2"></div>
        <div className="bg-gray-200 h-6 rounded w-1/3"></div>
      </div>
    </div>
  );

  return (
    <div className="container mx-auto px-4 py-8 sm:py-12">
      {/* Section Header */}
      <div className="text-center mb-8 sm:mb-12">
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-3 sm:mb-4">
          Featured Products
        </h2>
        <p className="text-sm sm:text-base text-gray-600 max-w-2xl mx-auto px-2">
          Discover our amazing collection of products curated just for you.
          Quality and satisfaction guaranteed.
        </p>
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 mx-auto gap-3 sm:gap-4 md:gap-6">
        {isLoading
          ? // Show skeletons when loading
            Array.from({ length: 10 }).map((_, index) => (
              <ProductSkeleton key={index} />
            ))
          : // Show actual products when data is loaded
            data?.data?.map((item: Product) => (
              <ProductCard product={item} key={item.id} />
            ))}
      </div>
    </div>
  );
}

export default HomePageProduct;
