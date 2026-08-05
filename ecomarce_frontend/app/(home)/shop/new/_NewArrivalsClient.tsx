"use client";

import { useState } from "react";
import { Sparkles } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useGetAllProductsQuery } from "@/redux/fetchers/products/productsApi";
import { Product } from "@/lib/Types";
import ProductCard from "@/components/ProductCard";
import ProductCardSkeleton from "../_ProductCardSkeleton";
import ErrorState from "../_ErrorState";
import { Pagination } from "@/components/Pagination";

export default function NewArrivalsPage() {
  const [page, setPage] = useState(1);
  const [limit] = useState(8);

  const queryParams = [
    { name: "badge", value: "NEW" },
    { name: "sort", value: "createdAt" },
    { name: "order", value: "desc" },
    { name: "limit", value: limit.toString() },
    { name: "page", value: page.toString() },
  ];

  const { data, isLoading, isError } = useGetAllProductsQuery(queryParams);

  const products: Product[] = data?.data || [];
  const meta = data?.meta || { page: 1, limit, total: 0 };
  const totalPages = Math.ceil(meta.total / meta.limit);

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (isError) {
    return <ErrorState />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50/30">
      <div className="container mx-auto px-3 sm:px-4 py-6 sm:py-10">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 sm:mb-10 gap-4">
          <div>
            <div className="inline-flex items-center gap-2 mb-2 px-3 py-1 rounded-full bg-cyan-100 text-cyan-700 text-xs font-semibold">
              <Sparkles className="h-3.5 w-3.5" />
              Fresh Drops
            </div>
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900">
              New Arrivals
            </h1>
            <p className="text-gray-600 text-sm sm:text-base mt-1">
              Discover the latest additions to our store
            </p>
          </div>
          <Link href="/shop">
            <Button variant="outline" className="text-sm sm:text-base">
              Browse All Products
            </Button>
          </Link>
        </div>

        {/* Grid */}
        {isLoading ? (
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-5 gap-3 sm:gap-4 md:gap-6">
            {[...Array(limit)].map((_, i) => (
              <ProductCardSkeleton key={i} />
            ))}
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-16">
            <div className="max-w-md mx-auto">
              <div className="w-24 h-24 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                <Sparkles className="w-10 h-10 text-gray-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                No new arrivals yet
              </h3>
              <p className="text-gray-600 mb-4">
                Check back soon for fresh drops.
              </p>
              <Link href="/shop">
                <Button>Browse All Products</Button>
              </Link>
            </div>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-5 gap-3 sm:gap-4 md:gap-6">
              {products.map((product: Product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>

            {totalPages > 1 && (
              <Pagination
                currentPage={page}
                totalPages={totalPages}
                onPageChange={handlePageChange}
                limit={limit}
                total={meta.total}
              />
            )}
          </>
        )}
      </div>
    </div>
  );
}
