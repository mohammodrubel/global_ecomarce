"use client";

import { useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import {
  Loader2,
  Package,
  DollarSign,
  Tag,
  Palette,
  X,
} from "lucide-react";
import { ImageUpload } from "@/components/ProductUploadForm";
import { ReachKeyboard } from "@/components/share/ReachKeyboard";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";
import { Brand, Category } from "@/lib/Types";
import { useGetAllCategoryQuery } from "@/redux/fetchers/categoryApi/categoryApi";
import { useGetAllBrandQuery } from "@/redux/fetchers/brand/brandApi";
import { useAddNewProductMutation } from "@/redux/fetchers/products/productsApi";
import { useGetAllProductColorQuery } from "@/redux/fetchers/productColorApi/productColorApi";
import { toast } from "sonner";

// ProductType enum from your schema
enum ProductType {
  HOT = "HOT",
  NEW = "NEW",
  UPCOMING = "UPCOMING",
  SALE = "SALE",
  FEATURED = "FEATURED",
  LIMITED = "LIMITED",
  TRENDING = "TRENDING",
  EXCLUSIVE = "EXCLUSIVE",
}

interface FormData {
  name: string;
  description: string;
  price: string;
  originalPrice: string;
  stock: string;
  sku: string;
  brandId: string;
  categoryId: string;
  subcategory: string;
  badge: ProductType | "";
  inStock: boolean;
  colors: string[];
}

interface CategoryOption {
  name: string;
  value: string;
  subcategories: string[];
}

interface BrandOption {
  name: string;
  value: string;
}

interface ColorOption {
  id: string;
  color: string;
  name: string;
}

export default function ProductUploadPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [images, setImages] = useState<File[]>([]);
  const { data: colorData, isLoading: isColorLoading } =
    useGetAllProductColorQuery(undefined);
  const { data: categoryData, isLoading: isCategoryLoading } =
    useGetAllCategoryQuery(undefined);
  const { data: brandData, isLoading: isBrandLoading } =
    useGetAllBrandQuery(undefined);
  const [addNewProduct] = useAddNewProductMutation();

  const colors: ColorOption[] =
    colorData?.data?.map((item: { name: string; id: string }) => ({
      color: item.name,
      name: item.name,
      id: item.id,
    })) || [];

  const categories: CategoryOption[] =
    categoryData?.data?.map((item: Category) => ({
      name: item.name,
      value: item.id,
      subcategories: item.subcategories || [],
    })) || [];

  const brands: BrandOption[] =
    brandData?.data?.map((item: Brand) => ({
      name: item.name,
      value: item.id,
    })) || [];

  const [formData, setFormData] = useState<FormData>({
    name: "",
    description: "",
    price: "",
    originalPrice: "",
    stock: "",
    sku: "",
    brandId: "",
    categoryId: "",
    subcategory: "",
    badge: "",
    inStock: true,
    colors: [],
  });

  const handleInputChange = useCallback(
    (
      field: keyof FormData,
      value: string | boolean | ProductType | string[]
    ) => {
      setFormData((prev) => ({ ...prev, [field]: value }));
    },
    []
  );

  const handleColorSelect = (colorId: string) => {
    setFormData((prev) => {
      if (prev.colors.includes(colorId)) {
        // Remove color if already selected
        return { ...prev, colors: prev.colors.filter((id) => id !== colorId) };
      } else {
        // Add color if not selected
        return { ...prev, colors: [...prev.colors, colorId] };
      }
    });
  };

  const removeColor = (colorId: string) => {
    setFormData((prev) => ({
      ...prev,
      colors: prev.colors.filter((id) => id !== colorId),
    }));
  };

  const selectedCategory = categories.find(
    (cat) => cat.value === formData.categoryId
  );

  const getSelectedColorNames = () => {
    return colors
      .filter((color) => formData.colors.includes(color.id))
      .map((color) => color.name);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (!formData.name.trim()) {
      toast.error("Product name is required");
      return;
    }

    if (!formData.price || parseFloat(formData.price) <= 0) {
      toast.error("Valid price is required");
      return;
    }

    if (!formData.sku.trim()) {
      toast.error("SKU is required");
      return;
    }

    if (!formData.brandId) {
      toast.error("Brand is required");
      return;
    }

    if (!formData.categoryId) {
      toast.error("Category is required");
      return;
    }

    if (!formData.subcategory.trim()) {
      toast.error("Subcategory is required");
      return;
    }

    if (images.length === 0) {
      toast.error("At least one product image is required");
      return;
    }

    if (images.length > 3) {
      toast.error("Maximum 3 images are allowed");
      return;
    }

    setIsLoading(true);

    try {
      const productData = {
        name: formData.name,
        description: formData.description,
        price: parseFloat(formData.price),
        originalPrice: formData.originalPrice
          ? parseFloat(formData.originalPrice)
          : parseFloat(formData.price),
        stock: parseInt(formData.stock) || 0,
        sku: formData.sku,
        brandId: formData.brandId,
        categoryId: formData.categoryId,
        subcategory: formData.subcategory,
        badge: formData.badge || ProductType.NEW,
        inStock: formData.inStock,
        colors: formData.colors,
      };

      const payload = new FormData();
      payload.append("data", JSON.stringify(productData));
      images.forEach((file) => payload.append("files", file));

      const response = await addNewProduct(payload).unwrap();

      if (response?.success) {
        toast.success(response.message || "Product uploaded successfully");
        // Reset form
        setFormData({
          name: "",
          description: "",
          price: "",
          originalPrice: "",
          stock: "",
          sku: "",
          brandId: "",
          categoryId: "",
          subcategory: "",
          badge: "",
          inStock: true,
          colors: [],
        });
        setImages([]);
      } else {
        toast.error(
          response?.error?.data?.message || "Failed to upload product"
        );
      }
    } catch (error: any) {
      console.error("Upload error:", error);
      toast.error(
        error?.data?.message || "Failed to upload product. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto w-full">
      <div className="pb-4 mb-6 border-b border-slate-200">
        <h1 className="text-2xl sm:text-[28px] font-semibold tracking-tight text-slate-900">
          Add New Product
        </h1>
        <p className="text-sm text-slate-500 mt-1">Create a new product listing</p>
      </div>
      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Product Images */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Package className="h-5 w-5" />
              Product Images *
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ImageUpload
              images={images}
              onImagesChange={setImages}
              maxImages={3}
            />
            <p className="text-sm text-muted-foreground mt-2">
              Upload at least one image (max 3). First image will be used as
              thumbnail.
            </p>
          </CardContent>
        </Card>

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
                  value={formData.name}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                  placeholder="Enter product name"
                  required
                  disabled={isLoading}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="sku">SKU *</Label>
                <Input
                  id="sku"
                  value={formData.sku}
                  onChange={(e) => handleInputChange("sku", e.target.value)}
                  placeholder="Product SKU"
                  required
                  disabled={isLoading}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Brand */}
              <div className="space-y-2">
                <Label>Brand *</Label>
                <Select
                  onValueChange={(val) => handleInputChange("brandId", val)}
                  value={formData.brandId}
                  disabled={isLoading || isBrandLoading}
                  required
                >
                  <SelectTrigger className="w-full">
                    <SelectValue
                      placeholder={
                        isBrandLoading ? "Loading brands..." : "Select brand"
                      }
                    />
                  </SelectTrigger>
                  <SelectContent>
                    {brands.map((item) => (
                      <SelectItem key={item.value} value={item.value}>
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
                  onValueChange={(val) => {
                    handleInputChange("categoryId", val);
                    handleInputChange("subcategory", "");
                  }}
                  value={formData.categoryId}
                  disabled={isLoading || isCategoryLoading}
                  required
                >
                  <SelectTrigger className="w-full">
                    <SelectValue
                      placeholder={
                        isCategoryLoading
                          ? "Loading categories..."
                          : "Select category"
                      }
                    />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((item) => (
                      <SelectItem key={item.value} value={item.value}>
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
                  onValueChange={(val) => handleInputChange("subcategory", val)}
                  value={formData.subcategory}
                  disabled={isLoading || !formData.categoryId}
                  required
                >
                  <SelectTrigger className="w-full">
                    <SelectValue
                      placeholder={
                        !formData.categoryId
                          ? "Select category first"
                          : "Select subcategory"
                      }
                    />
                  </SelectTrigger>
                  <SelectContent>
                    {selectedCategory?.subcategories.map((sub, idx) => (
                      <SelectItem key={idx} value={sub}>
                        {sub}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Description</Label>
              <ReachKeyboard
                onChange={(val) => handleInputChange("description", val)}
                placeholder="Start writing your product description..."
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
                <Label>Price *</Label>
                <Input
                  type="number"
                  step="0.01"
                  min="0"
                  value={formData.price}
                  onChange={(e) => handleInputChange("price", e.target.value)}
                  required
                  disabled={isLoading}
                />
              </div>
              <div className="space-y-2">
                <Label>Original Price</Label>
                <Input
                  type="number"
                  step="0.01"
                  min="0"
                  value={formData.originalPrice}
                  onChange={(e) =>
                    handleInputChange("originalPrice", e.target.value)
                  }
                  disabled={isLoading}
                  placeholder="Same as price if empty"
                />
              </div>
              <div className="space-y-2">
                <Label>Stock Quantity *</Label>
                <Input
                  type="number"
                  min="0"
                  value={formData.stock}
                  onChange={(e) => handleInputChange("stock", e.target.value)}
                  required
                  disabled={isLoading}
                />
              </div>
            </div>

            {/* Stock Status */}
            <div className="flex items-center space-x-2 pt-4">
              <Switch
                checked={formData.inStock}
                onCheckedChange={(checked) =>
                  handleInputChange("inStock", checked)
                }
                disabled={isLoading}
              />
              <Label htmlFor="inStock">In Stock</Label>
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
              <Select
                onValueChange={(value) => handleInputChange("badge", value)}
                value={formData.badge}
                disabled={isLoading}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Choose a product badge (optional)" />
                </SelectTrigger>
                <SelectContent>
                  {Object.values(ProductType).map((type) => (
                    <SelectItem key={type} value={type}>
                      <div className="flex items-center gap-2">
                        <Badge variant="secondary" className="capitalize">
                          {type.toLowerCase()}
                        </Badge>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Color Selection */}
            <div className="flex flex-col md:flex-row gap-6">
              {/* Multiple Color Select */}
              <div className="flex-1 space-y-3">
                <Label className="flex items-center gap-2">
                  <Palette className="h-4 w-4" />
                  Available Colors (optional)
                </Label>

                {/* Selected Colors Display */}
                {formData.colors.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-3">
                    {getSelectedColorNames().map((colorName, index) => {
                      const colorId = formData.colors[index];
                      return (
                        <Badge
                          key={colorId}
                          variant="secondary"
                          className="flex items-center gap-1"
                        >
                          <div
                            className="w-3 h-3 rounded-full"
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

                {/* Color Selection Dropdown */}
                <Select
                  onValueChange={handleColorSelect}
                  value=""
                  disabled={isLoading || isColorLoading}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue
                      placeholder={
                        isColorLoading
                          ? "Loading colors..."
                          : formData.colors.length > 0
                          ? `Add more colors (${formData.colors.length} selected)`
                          : "Select colors"
                      }
                    />
                  </SelectTrigger>
                  <SelectContent>
                    {colors.map((colorItem) => (
                      <SelectItem
                        key={colorItem.id}
                        value={colorItem.id}
                        disabled={formData.colors.includes(colorItem.id)}
                      >
                        <div className="flex items-center gap-2">
                          <div
                            className="w-4 h-4 rounded-full border"
                            style={{
                              backgroundColor: colorItem.color.toLowerCase(),
                            }}
                          />
                          {colorItem.name}
                          {formData.colors.includes(colorItem.id) && (
                            <Badge variant="outline" className="ml-2 text-xs">
                              Selected
                            </Badge>
                          )}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <p className="text-sm text-muted-foreground">
                  {formData.colors.length > 0
                    ? `${formData.colors.length} color(s) selected. Click on X to remove.`
                    : "Select colors from dropdown. You can select multiple colors."}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end gap-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => {
              setFormData({
                name: "",
                description: "",
                price: "",
                originalPrice: "",
                stock: "",
                sku: "",
                brandId: "",
                categoryId: "",
                subcategory: "",
                badge: "",
                inStock: true,
                colors: [],
              });
              setImages([]);
            }}
            disabled={isLoading}
          >
            Reset Form
          </Button>
          <Button type="submit" disabled={isLoading} className="min-w-32">
            {isLoading ? (
              <>
                <Loader2 className="animate-spin mr-2 h-4 w-4" />
                Uploading...
              </>
            ) : (
              "Upload Product"
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}
