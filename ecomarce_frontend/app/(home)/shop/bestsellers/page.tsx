"use client";

import { TrendingUp } from "lucide-react";
import ProductCard from "@/components/ProductCard";
import { Product } from "@/lib/Types";
import { useGetBestsellerProductsQuery } from "@/redux/fetchers/products/productsApi";
import LoadingSkeleton from "../_LoadingSkeleton";
import ErrorState from "../_ErrorState";

export default function BestsellersPage() {
  const { data, isLoading, isError } = useGetBestsellerProductsQuery(20);

  if (isLoading) return <LoadingSkeleton />;
  if (isError) return <ErrorState />;

  const products: (Product & { salesCount?: number })[] = data?.data || [];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-amber-50/30">
      <div className="container mx-auto px-3 sm:px-4 py-6 sm:py-10">
        <div className="mb-6 sm:mb-8">
          <div className="flex items-center gap-2 mb-2">
            <div className="h-9 w-9 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center">
              <TrendingUp className="h-5 w-5" />
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900">
              Bestsellers
            </h1>
          </div>
          <p className="text-slate-600 text-sm">
            Top-selling products across all delivered orders
          </p>
        </div>

        {products.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-slate-500">No bestsellers yet. Check back soon.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
            {products.map((product) => (
              <div key={product.id} className="relative">
                {typeof product.salesCount === "number" && product.salesCount > 0 && (
                  <span className="absolute top-2 left-2 z-10 inline-flex items-center gap-1 rounded-full bg-amber-500 text-white text-[10px] font-bold px-2 py-0.5 shadow-md">
                    <TrendingUp className="h-3 w-3" />
                    {product.salesCount} sold
                  </span>
                )}
                <ProductCard product={product} />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
