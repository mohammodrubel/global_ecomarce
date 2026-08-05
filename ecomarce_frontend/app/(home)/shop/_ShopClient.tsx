"use client";
import { useEffect, useState } from "react";
import { Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useGetAllProductsQuery } from "@/redux/fetchers/products/productsApi";
import { useGetAllCategoryForRelationsQuery } from "@/redux/fetchers/categoryApi/categoryApi";
import { useGetAllBrandQuery } from "@/redux/fetchers/brand/brandApi";
import ErrorState from "./_ErrorState";
import LoadingSkeleton from "./_LoadingSkeleton";
import FilterSidebar from "./_FilterSidebar";
import Toolbar from "./_Toolbar";
import ProductGrid from "./_ProductGrid";
import { useSearchParams } from "next/navigation";
import { Pagination } from "@/components/Pagination";

// Badge options
const BADGE_OPTIONS = [
  "HOT",
  "NEW",
  "UPCOMING",
  "SALE",
  "FEATURED",
  "LIMITED",
  "TRENDING",
  "EXCLUSIVE",
];

export default function ShopPage() {
  const [limit, setLimit] = useState(8);
  const [page, setPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedSubcategories, setSelectedSubcategories] = useState<string[]>(
    []
  );
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [selectedBadges, setSelectedBadges] = useState<string[]>([]);
  const [sortOrder, setSortOrder] = useState("");
  const searchParams = useSearchParams();

  // Sync URL params (searchTerm, categoryId, brandId) into local filter state
  useEffect(() => {
    const search = searchParams.get("searchTerm");
    if (search) {
      setSearchTerm(decodeURIComponent(search));
    }

    const categoryIds = searchParams.getAll("categoryId");
    if (categoryIds.length) {
      setSelectedCategories(categoryIds.map(decodeURIComponent));
    }

    const brandIds = searchParams.getAll("brandId");
    if (brandIds.length) {
      setSelectedBrands(brandIds.map(decodeURIComponent));
    }

    const subcategories = searchParams.getAll("subcategory");
    if (subcategories.length) {
      setSelectedSubcategories(subcategories.map(decodeURIComponent));
    }
  }, [searchParams]);

  // Reset to page 1 when filters change
  useEffect(() => {
    setPage(1);
  }, [
    searchTerm,
    selectedCategories,
    selectedSubcategories,
    selectedBrands,
    selectedBadges,
    sortOrder,
  ]);

  const { data: BrandData, isLoading: brandLoading } =
    useGetAllBrandQuery(undefined);
  const { data: CategoryData, isLoading: categoryLoading } =
    useGetAllCategoryForRelationsQuery(undefined);

  const buildQueryParams = () => {
    const params = [
      { name: "searchTerm", value: searchTerm },
      { name: "sort", value: "price" },
      { name: "order", value: sortOrder },
      { name: "limit", value: limit.toString() },
      { name: "page", value: page.toString() },
    ];

    // Add each category as separate parameter
    selectedCategories.forEach((categoryId) => {
      params.push({ name: "categoryId", value: categoryId });
    });

    // Add each subcategory as separate parameter
    selectedSubcategories.forEach((subcategory) => {
      params.push({ name: "subcategory", value: subcategory });
    });

    // Add each brand as separate parameter
    selectedBrands.forEach((brandId) => {
      params.push({ name: "brandId", value: brandId });
    });

    // Add each badge as separate parameter
    selectedBadges.forEach((badge) => {
      params.push({ name: "badge", value: badge });
    });

    return params;
  };

  const { data, isLoading, isError } = useGetAllProductsQuery(
    buildQueryParams()
  );

  const mainData = data?.data || [];
  const categories = CategoryData?.data || [];
  const brands = BrandData?.data || [];
  const meta = data?.meta || { page: 1, limit: 10, total: 0 };
  const totalPages = Math.ceil(meta.total / meta.limit);

  // Handle category selection
  const handleCategoryChange = (categoryId: string) => {
    setSelectedCategories((prev) =>
      prev.includes(categoryId)
        ? prev.filter((id) => id !== categoryId)
        : [...prev, categoryId]
    );
  };

  // Handle brand selection
  const handleBrandChange = (brandId: string) => {
    setSelectedBrands((prev) =>
      prev.includes(brandId)
        ? prev.filter((id) => id !== brandId)
        : [...prev, brandId]
    );
  };

  // Handle badge selection
  const handleBadgeChange = (badge: string) => {
    setSelectedBadges((prev) =>
      prev.includes(badge) ? prev.filter((b) => b !== badge) : [...prev, badge]
    );
  };

  // Handle sort change
  const handleSort = (value: string) => {
    setSortOrder(value);
  };

  // Handle page change
  const handlePageChange = (newPage: number) => {
    setPage(newPage);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Clear all filters
  const handleClearFilters = () => {
    setSelectedCategories([]);
    setSelectedSubcategories([]);
    setSelectedBrands([]);
    setSelectedBadges([]);
    setSearchTerm("");
    setSortOrder("");
    setPage(1);
  };

  // Handle error state
  if (isError) {
    return <ErrorState />;
  }

  // Show skeleton loading while data is being fetched
  if (isLoading || categoryLoading || brandLoading) {
    return <LoadingSkeleton />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50/30">
      <div className="container mx-auto px-3 sm:px-4 py-4 sm:py-8">
        <div className="flex flex-col lg:flex-row gap-4 sm:gap-6 lg:gap-8">
          {/* Desktop Filters */}
          <div className="hidden lg:block w-64 xl:w-72 flex-shrink-0">
            <div className="sticky top-24 bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-sm border border-gray-100">
              <div className="flex items-center gap-2 mb-6">
                <Filter className="h-5 w-5 text-blue-500" />
                <h2 className="text-xl font-bold">Filters</h2>
              </div>
              <FilterSidebar
                categories={categories}
                brands={brands}
                selectedCategories={selectedCategories}
                selectedBrands={selectedBrands}
                selectedBadges={selectedBadges}
                badgeOptions={BADGE_OPTIONS}
                onCategoryChange={handleCategoryChange}
                onBrandChange={handleBrandChange}
                onBadgeChange={handleBadgeChange}
                onClearFilters={handleClearFilters}
                setSearchTerm={setSearchTerm}
                searchTerm={searchTerm}
              />
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1 min-w-0 px-0 sm:px-2 md:px-4">
            {/* Mobile Filter Sheet */}
            <Sheet>
              <SheetTrigger asChild>
                <Button
                  variant="outline"
                  className="lg:hidden bg-white border-gray-200 hover:bg-gray-50 mb-4"
                >
                  <Filter className="h-4 w-4 mr-2" />
                  Filters
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-[85vw] sm:w-80 overflow-y-auto">
                <div className="mt-8">
                  <FilterSidebar
                    categories={categories}
                    brands={brands}
                    selectedCategories={selectedCategories}
                    selectedBrands={selectedBrands}
                    selectedBadges={selectedBadges}
                    badgeOptions={BADGE_OPTIONS}
                    onCategoryChange={handleCategoryChange}
                    onBrandChange={handleBrandChange}
                    onBadgeChange={handleBadgeChange}
                    onClearFilters={handleClearFilters}
                    setSearchTerm={setSearchTerm}
                    searchTerm={searchTerm}
                  />
                </div>
              </SheetContent>
            </Sheet>

            {/* Toolbar */}
            <Toolbar
              handleSort={handleSort}
              selectedCategories={selectedCategories}
              selectedBrands={selectedBrands}
              selectedBadges={selectedBadges}
              onClearFilters={handleClearFilters}
              product={data}
            />

            {/* Products Grid */}
            <ProductGrid
              products={mainData}
              selectedCategories={selectedCategories}
              selectedBrands={selectedBrands}
              selectedBadges={selectedBadges}
              onClearFilters={handleClearFilters}
            />

            {/* Pagination */}
            {totalPages > 1 && (
              <Pagination
                currentPage={page}
                totalPages={totalPages}
                onPageChange={handlePageChange}
                limit={limit}
                total={meta.total}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
