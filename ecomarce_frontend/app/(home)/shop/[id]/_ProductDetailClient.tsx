"use client";

import { useState } from "react";
import Link from "next/link";

import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ProductImages from "./_ProductImages";
import ProductHeader from "./_ProductHeader";
import ProductFeatures from "./_ProductFeatures";
import QuantitySelector from "./_QuantitySelector";
import ActionButtons from "./_ActionButtons";
import TrustFeatures from "./_TrustFeatures";
import ProductDescription from "./_ProductDescription";
import ProductDetails from "./_ProductDetails";
import ProductReviews from "./_ProductReviews";

interface Brand {
  id: string;
  name: string;
  logo: string;
}

interface Category {
  id: string;
  name: string;
}

interface Product {
  id: string;
  name: string;
  description: string;
  subcategory: string;
  price: number;
  originalPrice: number;
  discountType: string;
  discountValue: number;
  discountStart: string;
  discountEnd: string;
  stock: number;
  sku: string;
  brandId: string;
  categoryId: string;
  images: string[];
  rating: number;
  reviewsCount: number;
  badge: string;
  inStock: boolean;
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
  brand: Brand;
  category: Category;
}

export default function ProductDetailClient({ product }: { product: Product }) {
  const [quantity, setQuantity] = useState(1);
  const [isWishlisted, setIsWishlisted] = useState(false);
console.log(product)
  // Transform the API data to match the expected format
  const productData = {
    id: product.id || "",
    name: product.name || "Product Name",
    description: product.description || "No description available",
    price: product.price || 0,
    originalPrice: product.originalPrice || 0,
    rating: product.rating || 0,
    reviewsCount: product.reviewsCount || 0,
    inStock: product.inStock !== undefined ? product.inStock : true,
    stock: product.stock || 0,
    features: [], // You might want to extract features from description or add them to your API
    images: product.images || ["/placeholder.svg"],
    category: product.category?.name || "Uncategorized",
    brand: product.brand?.name || "Unknown Brand",
    sku: product.sku || "N/A",
    material: "Polyester / Cotton blend", // From description
    season: "All season", // From description
    style: "Formal / Luxury Event Dress", // From description
    decoration: "Exquisite Embroidery & Appliqué", // From description
    technics: "Appliqued", // From description
  };

  return (
    <div className="min-h-screen">
      <div className="container mx-auto px-3 sm:px-4 py-4 sm:py-8">
        {/* Breadcrumb */}
        <nav className="flex items-center space-x-2 text-xs sm:text-sm text-muted-foreground mb-4 sm:mb-8 flex-wrap gap-1 sm:gap-2">
          <Link href="/" className="hover:text-primary transition-colors">
            Home
          </Link>
          <span>/</span>
          <Link
            href={`/shop?brandId=${product?.brand?.id}`}
            className="hover:text-primary transition-colors"
          >
            {product?.brand.name}
          </Link>
          <span>/</span>
          <Link
            href={`/shop?categoryId=${product?.category?.id}`}
            className="hover:text-primary transition-colors"
          >
            {product?.category.name}
          </Link>
          <span>/</span>
          <span className="text-foreground font-medium truncate">
            {productData.name}
          </span>
        </nav>

        <div className="grid md:grid-cols-2 gap-6 md:gap-8 lg:gap-12 mb-10 sm:mb-16">
          {/* Product Images */}
          <ProductImages
            images={productData.images}
            name={productData.name}
            inStock={productData.inStock}
          />

          {/* Product Info */}
          <div className="space-y-6">
            <ProductHeader
              brand={productData.brand}
              sku={productData.sku}
              name={productData.name}
              rating={productData.rating}
              reviewsCount={productData.reviewsCount}
              price={productData.price}
              originalPrice={productData.originalPrice}
            />

            <ProductFeatures
              description={productData.description}
              features={productData.features}
            />

            <QuantitySelector
              quantity={quantity}
              onQuantityChange={setQuantity}
              stock={productData.stock}
            />

            <ActionButtons
              inStock={productData.inStock}
              isWishlisted={isWishlisted}
              onWishlistToggle={() => setIsWishlisted(!isWishlisted)}
            />

            <TrustFeatures />
          </div>
        </div>

        {/* Product Details Tabs */}
        <Tabs defaultValue="description" className="mb-10 sm:mb-16">
          <TabsList className="grid w-full grid-cols-3 p-1 rounded-lg h-auto">
            <TabsTrigger value="description" className="rounded-md text-xs sm:text-sm px-1 sm:px-3 py-2">
              Description
            </TabsTrigger>
            <TabsTrigger value="details" className="rounded-md text-xs sm:text-sm px-1 sm:px-3 py-2">
              Product Details
            </TabsTrigger>
            <TabsTrigger value="reviews" className="rounded-md text-xs sm:text-sm px-1 sm:px-3 py-2">
              Reviews ({productData.reviewsCount})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="description" className="mt-6">
            <ProductDescription description={productData.description} />
          </TabsContent>

          <TabsContent value="details" className="mt-6">
            <ProductDetails product={productData} />
          </TabsContent>

          <TabsContent value="reviews" className="mt-6">
            <ProductReviews reviewsCount={productData.reviewsCount} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
