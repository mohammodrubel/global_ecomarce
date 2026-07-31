import { Skeleton } from "@/components/ui/skeleton";
import FilterSidebarSkeleton from "./_FilterSidebarSkeleton";
import ProductCardSkeleton from "./_ProductCardSkeleton";


export default function LoadingSkeleton() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50/30">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
          {/* Desktop Filters Skeleton */}
          <div className="hidden lg:block w-64 xl:w-72 flex-shrink-0">
            <div className="sticky top-24 bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-sm border border-gray-100">
              <div className="flex items-center gap-2 mb-6">
                <Skeleton className="h-5 w-5 rounded" />
                <Skeleton className="h-6 w-16 rounded" />
              </div>
              <FilterSidebarSkeleton />
            </div>
          </div>

          {/* Main Content Skeleton */}
          <div className="flex-1">
            {/* Toolbar Skeleton */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6 p-4 sm:p-6 bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm border border-gray-100">
              <div className="flex items-center gap-4 w-full sm:w-auto">
                <Skeleton className="lg:hidden h-9 w-20 rounded-lg" />
                <Skeleton className="h-4 w-32 rounded" />
              </div>

              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 w-full sm:w-auto">
                <Skeleton className="h-9 w-48 rounded-lg" />
              </div>
            </div>

            {/* Products Grid Skeleton */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-4 gap-4 sm:gap-6">
              {[...Array(8)].map((_, index) => (
                <ProductCardSkeleton key={index} />
              ))}
            </div>

            {/* Pagination Skeleton */}
            <div className="flex justify-center mt-8 md:mt-12">
              <div className="flex flex-wrap gap-2 bg-white/80 backdrop-blur-sm rounded-2xl p-2 shadow-sm border border-gray-100">
                {[...Array(5)].map((_, index) => (
                  <Skeleton key={index} className="h-9 w-16 rounded-xl" />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
