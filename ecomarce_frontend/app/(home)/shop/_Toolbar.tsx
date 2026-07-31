import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface Product {
  id: string;
  name: string;
  price: number;
  category: string;
  brand: string;
  // ... other product fields
}

interface ProductResponse {
  data: Product[];
  message: string;
  meta: {
    page: number;
    limit: number;
    total: number;
  };
  statusCode: number;
  success: boolean;
}

interface ToolbarProps {
  handleSort: (value: string) => void;
  selectedCategories: string[];
  selectedBrands: string[];
  selectedBadges: string[];
  onClearFilters: () => void;
  categoryNames?: { [key: string]: string };
  brandNames?: { [key: string]: string };
  resultsCount?: number;
  isLoading?: boolean;
  product?: ProductResponse;
}

export default function Toolbar({
  handleSort,
  selectedCategories,
  selectedBrands,
  selectedBadges,
  onClearFilters,
  categoryNames = {},
  brandNames = {},
  resultsCount,
  isLoading = false,
  product,
}: ToolbarProps) {
  const hasActiveFilters =
    selectedCategories.length > 0 ||
    selectedBrands.length > 0 ||
    selectedBadges.length > 0;

  // Calculate display counts
  const currentPageCount = product?.data?.length || 0;
  const totalProducts = product?.meta?.total || 0;
  const showingText = hasActiveFilters ? " (filtered)" : "";

  return (
    <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 sm:gap-4 mb-4 sm:mb-6 p-3 sm:p-4 md:p-6 bg-white/80 backdrop-blur-sm rounded-xl sm:rounded-2xl shadow-sm border border-gray-100">
      {/* Left Section: Results, Filters & Badges */}
      <div className="flex flex-col gap-3 flex-1 w-full">
        {/* Top Row: Results Count & Clear Button */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 w-full">
          <div className="flex items-center gap-2">
            {/* Show results count from props if provided, otherwise calculate from product data */}
            {resultsCount !== undefined ? (
              <span className="text-sm font-medium text-gray-900">
                {resultsCount} {resultsCount === 1 ? "product" : "products"}
                {showingText}
              </span>
            ) : (
              product?.meta && (
                <span className="text-sm font-medium text-gray-900">
                  Showing {currentPageCount} of {totalProducts} products
                  {showingText}
                </span>
              )
            )}
            {isLoading && (
              <div className="flex items-center gap-2">
                <div className="h-3 w-3 animate-spin rounded-full border-2 border-gray-300 border-t-blue-600" />
                <span className="text-xs text-gray-500">
                  Applying filters...
                </span>
              </div>
            )}
          </div>
        </div>

       

        {/* Additional Product Info */}
        {product?.meta && !resultsCount && (
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-600">
              Page {product.meta.page} of{" "}
              {Math.ceil(product.meta.total / product.meta.limit)}
              {showingText}
            </p>
          </div>
        )}
      </div>

      {/* Sort Dropdown */}
      <div className="flex-shrink-0 w-full sm:w-auto">
        <Select onValueChange={handleSort} disabled={isLoading}>
          <SelectTrigger
            className="w-full sm:w-48 bg-white border-gray-200 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            aria-label="Sort products"
          >
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="featured">Featured</SelectItem>
            <SelectItem value="asc">Price: Low to High</SelectItem>
            <SelectItem value="desc">Price: High to Low</SelectItem>
            <SelectItem value="newest">Newest First</SelectItem>
            <SelectItem value="rating">Highest Rated</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
