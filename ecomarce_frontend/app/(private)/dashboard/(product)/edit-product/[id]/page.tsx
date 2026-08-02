"use client";
import { ReachKeyboard } from "@/components/share/ReachKeyboard";
import { BrandType, CategoryType, ProductType } from "@/components/productType";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useGetAllBrandQuery } from "@/redux/fetchers/brand/brandApi";
import { useGetAllCategoryQuery } from "@/redux/fetchers/categoryApi/categoryApi";
import {
  useGetSingleProductQuery,
  useUpdateProductMutation,
} from "@/redux/fetchers/products/productsApi";
import { useGetAllProductColorQuery } from "@/redux/fetchers/productColorApi/productColorApi";
import { DollarSign, Loader2, Palette, Tag, X } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { toast } from "sonner";

export default function ProductFormPage() {
  const params = useParams();
  const router = useRouter();
  const { data: brandData } = useGetAllBrandQuery();
  const {
    data: productResponse,
    isLoading,
    isError,
  } = useGetSingleProductQuery(params?.id);
  const { data: categoryData } = useGetAllCategoryQuery({});
  const { data: colorData, isLoading: isColorLoading } =
    useGetAllProductColorQuery(undefined);
  const [updateProduct, { isLoading: isUpdating }] = useUpdateProductMutation();

  const productData: ProductType = productResponse?.data;

  // Colors available in the DB (selected/sent by id, same as add-product)
  const colors: { id: string; name: string }[] =
    colorData?.data?.map((item: { id: string; name: string }) => ({
      id: item.id,
      name: item.name,
    })) || [];

  // Form state values
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>("");
  const [selectedSubcategory, setSelectedSubcategory] = useState<string>("");
  const [selectedColors, setSelectedColors] = useState<string[]>([]);
  const [selectedBadge, setSelectedBadge] = useState<string>("");
  const [description, setDescription] = useState<string>("");

  // Initialize form with product data
  useEffect(() => {
    if (productData) {
      // Set current form values
      setSelectedCategoryId(productData.categoryId || "");
      setSelectedSubcategory(productData.subcategory || "");
      setSelectedBadge(productData.badge?.toLowerCase() || "");
      setDescription(productData.description || "");

      // Extract color IDs from colors array (many-to-many relationship)
      if (productData?.colors && Array.isArray(productData.colors)) {
        const colorIds = productData.colors.map((color: any) =>
          typeof color === "object" ? color.id : color
        );
        setSelectedColors(colorIds);
      }
    }
  }, [productData]);

  const handleCategoryChange = (categoryId: string) => {
    setSelectedCategoryId(categoryId);
    setSelectedSubcategory("");
  };

  const handleColorSelect = (colorId: string) => {
    if (!selectedColors.includes(colorId)) {
      setSelectedColors([...selectedColors, colorId]);
    }
  };

  const removeColor = (colorId: string) => {
    setSelectedColors(selectedColors.filter((c) => c !== colorId));
  };

  const handleDescriptionChange = (value: string) => {
    setDescription(value);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);

    // Collect current form values - preserving all previous data
    const currentValues = {
      name: (formData.get("name") as string) || productData?.name,
      sku: (formData.get("sku") as string) || productData?.sku,
      brandId: (formData.get("brand") as string) || productData?.brandId,
      categoryId: selectedCategoryId || productData?.categoryId,
      subcategory: selectedSubcategory || productData?.subcategory,
      description: description || productData?.description,
      price: parseFloat(formData.get("price") as string) || productData?.price,
      originalPrice:
        parseFloat(formData.get("originalPrice") as string) ||
        productData?.originalPrice,
      stock: parseInt(formData.get("stock") as string) || productData?.stock,
      badge: selectedBadge || productData?.badge?.toLowerCase(),
      // For many-to-many relationships, you might need to send color IDs
      colors: selectedColors,
      // Keep existing images if not changed
      images: productData?.images || [],
      // Keep other fields unchanged
      rating: productData?.rating,
      reviewsCount: productData?.reviewsCount,
      inStock: productData?.inStock !== undefined ? productData.inStock : true,
      isDeleted: productData?.isDeleted || false,
    };


    // Prepare data for backend according to Prisma model
    const updateData = {
      name: currentValues.name,
      description: currentValues.description,
      subcategory: currentValues.subcategory,
      price: currentValues.price,
      originalPrice: currentValues.originalPrice,
      stock: currentValues.stock,
      sku: currentValues.sku,
      brandId: currentValues.brandId,
      categoryId: currentValues.categoryId,
      badge: currentValues.badge?.toUpperCase(), // Convert to uppercase for enum
      // Many-to-many colors: array of Color ids, connected by the backend
      colors: selectedColors,
    };

    try {
      const res = await updateProduct({
        id: params?.id,
        data: updateData,
      }).unwrap();

      if (res?.success) {
        toast.success(res.message || "Product updated successfully");
        // List + single-product caches are tagged, so they refetch
        // automatically; navigate back to the updated listing.
        router.push("/dashboard/all-product");
      } else {
        toast.error(res?.message || "Failed to update product");
      }
    } catch (err: any) {
      toast.error(err?.data?.message || "Failed to update product");
    }
  };

  // Helper function to check if a value has changed
  const hasValueChanged = (fieldName: string, currentValue: any): boolean => {
    if (!productData) return false;

    switch (fieldName) {
      case "name":
        return currentValue !== productData.name;
      case "sku":
        return currentValue !== productData.sku;
      case "brandId":
        return currentValue !== productData.brandId;
      case "categoryId":
        return currentValue !== productData.categoryId;
      case "subcategory":
        return currentValue !== productData.subcategory;
      case "description":
        return currentValue !== productData.description;
      case "price":
        return currentValue !== productData.price;
      case "originalPrice":
        return currentValue !== productData.originalPrice;
      case "stock":
        return currentValue !== productData.stock;
      case "badge":
        return currentValue !== productData.badge?.toLowerCase();
      case "colors":
        // Compare current colors with original
        const originalColors =
          productData.colors?.map((color: any) =>
            typeof color === "object" ? color.name || color.id : color
          ) || [];
        return JSON.stringify(currentValue) !== JSON.stringify(originalColors);
      default:
        return false;
    }
  };

  if (isLoading) {
    return <div>Loading product data...</div>;
  }

  if (isError) {
    return <div>Error loading product data</div>;
  }

  if (!productData) {
    return <div>Product not found</div>;
  }

  // Find current category from categoryData
  const currentCategory = categoryData?.data?.find(
    (item: CategoryType) =>
      item.id === (selectedCategoryId || productData?.categoryId)
  );

  // Get current brand name
  const currentBrand = brandData?.data?.find(
    (item: BrandType) => item.id === productData?.brandId
  );

  // Get original colors for comparison
  const originalColors =
    productData.colors?.map((color: any) =>
      typeof color === "object" ? color.name || color.id : color
    ) || [];

  return (
    <div className="max-w-4xl mx-auto w-full">
      <div className="pb-4 mb-6 border-b border-slate-200">
        <h1 className="text-2xl sm:text-[28px] font-semibold tracking-tight text-slate-900">
          Update Product
        </h1>
        <p className="text-sm text-slate-500 mt-1">Edit product details</p>
      </div>
      <form className="space-y-8" onSubmit={handleSubmit}>
        {/* Basic Info */}
        <Card>
          <CardHeader>
            <CardTitle>Basic Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Product Name *</Label>
                <Input
                  id="name"
                  name="name"
                  defaultValue={productData?.name}
                  placeholder="Enter product name"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="sku">SKU *</Label>
                <Input
                  id="sku"
                  name="sku"
                  placeholder="Product SKU"
                  defaultValue={productData?.sku}
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Brand */}
              <div className="space-y-2">
                <Label>Brand *</Label>
                <Select
                  name="brand"
                  defaultValue={productData?.brandId}
                  required
                >
                  <SelectTrigger>
                    <SelectValue
                      placeholder={currentBrand?.name || "Select Brand"}
                    />
                  </SelectTrigger>
                  <SelectContent>
                    {brandData?.data?.map((item: BrandType) => (
                      <SelectItem key={item.id} value={item.id}>
                        {item.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Category */}
              <div className="space-y-2">
                <Label>Category *</Label>
                <Select
                  required
                  value={selectedCategoryId}
                  onValueChange={handleCategoryChange}
                >
                  <SelectTrigger>
                    <SelectValue>
                      {currentCategory?.name ||
                        productData?.category?.name ||
                        "Select Category"}
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    {categoryData?.data?.map((item: CategoryType) => (
                      <SelectItem key={item.id} value={item.id}>
                        {item.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Subcategory */}
              <div className="space-y-2">
                <Label>Subcategory *</Label>
                <Select
                  required
                  value={selectedSubcategory}
                  onValueChange={setSelectedSubcategory}
                >
                  <SelectTrigger>
                    <SelectValue
                      placeholder={
                        productData?.subcategory || "Select Subcategory"
                      }
                    />
                  </SelectTrigger>
                  <SelectContent>
                    {currentCategory?.subcategories?.map(
                      (item: string, index: number) => (
                        <SelectItem key={index} value={item}>
                          {item}
                        </SelectItem>
                      )
                    )}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Description</Label>
              <ReachKeyboard
                placeholder="Start writing your product description..."
                initialValue={productData?.description}
                onChange={handleDescriptionChange}
              />
            </div>
          </CardContent>
        </Card>

        {/* Pricing & Inventory */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <DollarSign className="h-5 w-5" /> Pricing & Inventory
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="price">Price *</Label>
                <Input
                  id="price"
                  name="price"
                  type="number"
                  defaultValue={productData?.price}
                  step="0.01"
                  min="0"
                  placeholder="0.00"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="originalPrice">Original Price</Label>
                <Input
                  id="originalPrice"
                  name="originalPrice"
                  type="number"
                  defaultValue={productData?.originalPrice}
                  step="0.01"
                  min="0"
                  placeholder="Same as price if empty"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="stock">Stock Quantity *</Label>
                <Input
                  id="stock"
                  name="stock"
                  type="number"
                  defaultValue={productData?.stock}
                  min="0"
                  placeholder="0"
                  required
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Product Attributes */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Tag className="h-5 w-5" />
              Product Attributes
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Product Badge */}
            <div className="space-y-2">
              <Label>Select Badge</Label>
              <Select value={selectedBadge} onValueChange={setSelectedBadge}>
                <SelectTrigger>
                  <SelectValue
                    placeholder={productData?.badge || "Select Badge"}
                  />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="LIMITED">LIMITED</SelectItem>
                  <SelectItem value="TRENDING">TRENDING</SelectItem>
                  <SelectItem value="EXCLUSIVE">EXCLUSIVE</SelectItem>
                  <SelectItem value="NEW">NEW</SelectItem>
                  <SelectItem value="UPCOMING">UPCOMING</SelectItem>
                  <SelectItem value="SALE">SALE</SelectItem>
                  <SelectItem value="FEATURED">FEATURED</SelectItem>
                  <SelectItem value="HOT">HOT</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Color */}
            <div className="flex flex-col md:flex-row gap-6">
              <div className="flex-1 space-y-3">
                <Label className="flex items-center gap-2">
                  <Palette className="h-4 w-4" />
                  Available Colors (optional)
                </Label>
                {selectedColors.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-3">
                    {selectedColors.map((colorId) => {
                      const colorName =
                        colors.find((c) => c.id === colorId)?.name || colorId;
                      return (
                        <Badge
                          key={colorId}
                          variant="secondary"
                          className="flex items-center gap-1"
                        >
                          <div
                            className="w-3 h-3 rounded-full border"
                            style={{ backgroundColor: colorName.toLowerCase() }}
                          />
                          {colorName}
                          <X
                            className="h-3 w-3 cursor-pointer"
                            onClick={() => removeColor(colorId)}
                          />
                        </Badge>
                      );
                    })}
                  </div>
                )}
                <Select
                  value=""
                  onValueChange={handleColorSelect}
                  disabled={isColorLoading}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue
                      placeholder={
                        isColorLoading
                          ? "Loading colors..."
                          : selectedColors.length > 0
                          ? `Add more colors (${selectedColors.length} selected)`
                          : "Select colors"
                      }
                    />
                  </SelectTrigger>
                  <SelectContent>
                    {colors.map((colorItem) => (
                      <SelectItem
                        key={colorItem.id}
                        value={colorItem.id}
                        disabled={selectedColors.includes(colorItem.id)}
                      >
                        <div className="flex items-center gap-2">
                          <div
                            className="w-4 h-4 rounded-full border"
                            style={{
                              backgroundColor: colorItem.name.toLowerCase(),
                            }}
                          />
                          {colorItem.name}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end gap-4">
          <Button
            type="submit"
            disabled={isUpdating}
            className="min-w-32 bg-[#1C398E] hover:bg-[#152B6E]"
          >
            {isUpdating ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Updating...
              </>
            ) : (
              "Update Product"
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}
