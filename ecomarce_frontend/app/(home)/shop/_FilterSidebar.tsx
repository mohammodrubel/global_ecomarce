import { Search, X, Star, Tag } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Category, Brand } from "@/lib/Types";
import { Badge } from "@/components/ui/badge";

interface FilterSidebarProps {
  categories: Category[];
  brands: Brand[];
  selectedCategories: string[];
  selectedBrands: string[];
  selectedBadges: string[];
  badgeOptions: string[];
  onCategoryChange: (categoryId: string) => void;
  onBrandChange: (brandId: string) => void;
  onBadgeChange: (badge: string) => void;
  onClearFilters: () => void;
  setSearchTerm: (value: string) => void;
  searchTerm: string;
}

export default function FilterSidebar({
  categories,
  brands,
  selectedCategories,
  selectedBrands,
  selectedBadges,
  badgeOptions,
  onCategoryChange,
  onBrandChange,
  onBadgeChange,
  onClearFilters,
  setSearchTerm,
  searchTerm,
}: FilterSidebarProps) {
  const hasActiveFilters =
    selectedCategories.length > 0 ||
    selectedBrands.length > 0 ||
    selectedBadges.length > 0 ||
    searchTerm.length > 0;

  return (
    <div className="space-y-6">
      {/* Clear Filters Button */}
      {hasActiveFilters && (
        <div className="flex justify-end">
          <Button
            variant="outline"
            size="sm"
            onClick={onClearFilters}
            className="flex items-center gap-2"
          >
            <X className="h-4 w-4" />
            Clear All
          </Button>
        </div>
      )}

      {/* Search Input */}
      <div className="space-y-3">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* Categories Section */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-gray-900">Categories</h3>
          {selectedCategories.length > 0 && (
            <Badge variant="secondary" className="text-xs">
              {selectedCategories.length}
            </Badge>
          )}
        </div>

        {categories.length === 0 ? (
          <div className="text-sm text-gray-500 py-2">
            No categories available
          </div>
        ) : (
          <div className="space-y-2 max-h-60 overflow-y-auto">
            {categories.map((category: Category) => (
              <div key={category.id} className="flex items-center">
                <Checkbox
                  id={`category-${category.id}`}
                  checked={selectedCategories.includes(category.id)}
                  onCheckedChange={() => onCategoryChange(category.id)}
                  className="h-4 w-4"
                />
                <label
                  htmlFor={`category-${category.id}`}
                  className="ml-3 text-sm text-gray-700 cursor-pointer hover:text-gray-900"
                >
                  {category.name}
                </label>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Brands Section */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-gray-900">Brands</h3>
          {selectedBrands.length > 0 && (
            <Badge variant="secondary" className="text-xs">
              {selectedBrands.length}
            </Badge>
          )}
        </div>

        {brands.length === 0 ? (
          <div className="text-sm text-gray-500 py-2">No brands available</div>
        ) : (
          <div className="space-y-2 max-h-60 overflow-y-auto">
            {brands.map((brand: Brand) => (
              <div key={brand.id} className="flex items-center">
                <Checkbox
                  id={`brand-${brand.id}`}
                  checked={selectedBrands.includes(brand.id)}
                  onCheckedChange={() => onBrandChange(brand.id)}
                  className="h-4 w-4"
                />
                <label
                  htmlFor={`brand-${brand.id}`}
                  className="ml-3 text-sm text-gray-700 cursor-pointer hover:text-gray-900"
                >
                  {brand.name}
                </label>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Badges Section */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-gray-900 flex items-center gap-2">
            <Star className="h-4 w-4 text-yellow-500" />
            Product Badges
          </h3>
          {selectedBadges.length > 0 && (
            <Badge variant="secondary" className="text-xs">
              {selectedBadges.length}
            </Badge>
          )}
        </div>

        <div className="space-y-2 max-h-60 overflow-y-auto">
          {badgeOptions.map((badge) => (
            <div key={badge} className="flex items-center">
              <Checkbox
                id={`badge-${badge}`}
                checked={selectedBadges.includes(badge)}
                onCheckedChange={() => onBadgeChange(badge)}
                className="h-4 w-4"
              />
              <label
                htmlFor={`badge-${badge}`}
                className="ml-3 text-sm text-gray-700 cursor-pointer hover:text-gray-900 capitalize"
              >
                {badge.toLowerCase()}
              </label>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
