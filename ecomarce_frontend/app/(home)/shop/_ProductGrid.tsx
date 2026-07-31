import ProductCard from "../../../components/ProductCard";
import { Button } from "@/components/ui/button";
import { Product } from "@/lib/Types";

interface ProductGridProps {
  products: Product[];
  selectedCategories: string[];
  selectedBrands: string[];
  selectedBadges: string[];
  onClearFilters: () => void;
}

export default function ProductGrid({
  products,
  selectedCategories,
  selectedBrands,
  selectedBadges,
  onClearFilters,
}: ProductGridProps) {
  const hasActiveFilters =
    selectedCategories.length > 0 ||
    selectedBrands.length > 0 ||
    selectedBadges.length > 0;

  if (products.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="max-w-md mx-auto">
          <div className="w-24 h-24 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
            <svg
              className="w-12 h-12 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
              />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            No products found
          </h3>
          <p className="text-gray-600 mb-4">
            {hasActiveFilters
              ? "Try adjusting your filters to see more products."
              : "There are no products available at the moment."}
          </p>
          {hasActiveFilters && (
            <Button onClick={onClearFilters} className="mt-2">
              Clear All Filters
            </Button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Results Summary */}
      {/* <div className="flex items-center justify-between">
        <p className="text-sm text-gray-600">
          Showing {products.length} product{products.length !== 1 ? "s" : ""}
          {hasActiveFilters && " (filtered)"}
        </p>
      </div> */}

      {/* Products Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
        {products.map((product: Product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>

      {/* Load More (if needed in future) */}
      {/* {hasMore && (
        <div className="text-center mt-8">
          <Button 
            variant="outline" 
            onClick={onLoadMore}
            disabled={loading}
          >
            {loading ? 'Loading...' : 'Load More Products'}
          </Button>
        </div>
      )} */}
    </div>
  );
}
