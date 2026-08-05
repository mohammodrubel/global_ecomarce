"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Heart, Eye, ShoppingCart, Zap, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Product } from "@/lib/Types";
import { useDispatch, useSelector } from "react-redux";
import { ProductType } from "./productType";
import { addToCart } from "@/redux/fetchers/cart/cartSlice";
import {
  addToWishlist,
  removeFromWishlist,
} from "@/redux/fetchers/wishlist/wishlistSlice";
import { RootState } from "@/redux/store";
import { toast } from "sonner";


interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const dispatch = useDispatch()
  const images = product?.images || [];
  const mainImage = images[0] || "/placeholder.svg";
  const hoverImage = images[1] || images[0] || "/placeholder.svg";

  // Calculate discount percentage safely - only show if there's a real discount
  const hasDiscount = product?.originalPrice > product?.price;
  const discountPercentage = hasDiscount
    ? Math.round(
        ((product.originalPrice - product.price) / product.originalPrice) * 100
      )
    : 0;

  // Stock status calculation with safe defaults
  const getStockStatus = () => {
    const stock = product?.stock || 0;
    const inStock = product?.inStock ?? true;

    if (stock === 0 || !inStock) {
      return {
        status: "out-of-stock",
        text: "Out of Stock",
        color: "text-red-600",
        bgColor: "bg-red-100",
        progress: 100,
        progressColor: "from-red-500 to-red-600",
      };
    } else if (stock <= 10) {
      const progress = Math.min(95, ((50 - stock) / 50) * 100);
      return {
        status: "low-stock",
        text: `Only ${stock} left`,
        color: "text-orange-600",
        bgColor: "bg-orange-100",
        progress,
        progressColor: "from-orange-400 to-orange-500",
      };
    } else {
      return {
        status: "in-stock",
        text: `In Stock`,
        color: "text-green-600",
        bgColor: "bg-green-100",
        progress: 72,
        progressColor: "from-green-400 to-blue-500",
      };
    }
  };

  const stockStatus = getStockStatus();

  const handleAddToCart = (product:any)=>{
    dispatch(addToCart(product))
  }

  const isWishlisted = useSelector((state: RootState) =>
    Boolean(
      state.wishlist?.product?.find(
        (p: any) => p.id === product?.id && p.wishlist
      )
    )
  );

  const handleWishlistToggle = (
    e: React.MouseEvent<HTMLButtonElement>
  ) => {
    e.preventDefault();
    e.stopPropagation();
    if (isWishlisted) {
      dispatch(removeFromWishlist(product.id));
      toast.info("Removed from wishlist");
    } else {
      dispatch(addToWishlist(product as any));
      toast.success("Added to wishlist");
    }
  };

  // Safe product data with fallbacks
  const productName = product?.name || "Unnamed Product";
  const productPrice = product?.price || 0;
  const originalPrice = product?.originalPrice || productPrice;
  const productRating = product?.rating || 0;
  const reviewsCount = product?.reviewsCount || 0;
  const productBadge = product?.badge || "";
  const productId = product?.id || "";

  return (
    <Card
      className="group relative overflow-hidden bg-gradient-to-br from-white to-gray-50/80 py-0 hover:from-gray-50 hover:to-white border border-gray-200 shadow-sm hover:shadow-xl transition-all duration-500 ease-out hover:-translate-y-1"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Background Glow Effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

      <CardContent className="p-0 relative">
        {/* Image Container */}
        <div className="relative overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200">
          <Link href={`/shop/${productId}`}>
            <div className="relative h-56 sm:h-64 md:h-72 w-full cursor-pointer">
              {/* Main Image */}
              <Image
                src={mainImage}
                alt={productName}
                width={400}
                height={400}
                className={`absolute inset-0 w-full h-full object-cover transition-all duration-700 ease-out ${
                  isHovered && images.length > 1
                    ? "opacity-0 scale-110"
                    : "opacity-100 scale-100"
                }`}
                onError={(e) => {
                  e.currentTarget.src = "/placeholder.svg";
                }}
              />

              {/* Hover Image (if available) */}
              {images.length > 1 && (
                <Image
                  src={hoverImage}
                  alt={productName}
                  width={400}
                  height={400}
                  className={`absolute inset-0 w-full h-full object-cover transition-all duration-700 ease-out ${
                    isHovered ? "opacity-100 scale-100" : "opacity-0 scale-90"
                  }`}
                  onError={(e) => {
                    e.currentTarget.src = "/placeholder.svg";
                  }}
                />
              )}
            </div>
          </Link>

          {/* Top Right Badges */}
          <div className="absolute top-3 right-3 flex flex-col gap-2">
            {/* Discount Badge - Only show if there's an actual discount */}
            {hasDiscount && discountPercentage > 0 && (
              <Badge className="bg-green-500 border-0 text-white shadow-lg">
                {discountPercentage}% OFF
              </Badge>
            )}

            {/* Product Badge (NEW, etc.) - Only show if badge exists */}
            {productBadge && (
              <Badge className="bg-[#1C398E] border-0 text-white shadow-lg">
                {productBadge}
              </Badge>
            )}
          </div>

          {/* Quick Actions */}
          <div
            className={`absolute top-12 right-3 flex flex-col gap-2 transition-all duration-500 ${
              isHovered
                ? "opacity-100 translate-x-0"
                : "opacity-0 translate-x-4"
            }`}
          >
            <Button
              size="icon"
              variant="secondary"
              onClick={handleWishlistToggle}
              aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
              className="h-9 w-9 rounded-full bg-white/90 backdrop-blur-sm hover:bg-white hover:scale-110 shadow-lg border-0 transition-all duration-300"
            >
              <Heart
                className={`h-4 w-4 ${
                  isWishlisted ? "fill-red-500 text-red-500" : ""
                }`}
              />
            </Button>
            <Button
              size="icon"
              variant="secondary"
              asChild
              className="h-9 w-9 rounded-full bg-white/90 backdrop-blur-sm hover:bg-white hover:scale-110 shadow-lg border-0 transition-all duration-300"
            >
              <Link href={`/shop/${productId}`} aria-label="View product">
                <Eye className="h-4 w-4" />
              </Link>
            </Button>
          </div>

          {/* Add to Cart Button */}
          <div
            className={`absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/60 to-transparent transition-all duration-500 ${
              isHovered
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-4"
            }`}
          >
            <Button
            onClick={()=>handleAddToCart(product)}
              className={`w-full ${
                stockStatus.status === "out-of-stock"
                  ? "bg-gray-400 hover:bg-gray-400 text-white cursor-not-allowed"
                  : "bg-white text-black hover:bg-white/90 hover:scale-105"
              } transition-all duration-300 shadow-lg border-0`}
              disabled={stockStatus.status === "out-of-stock"}
            >
              <ShoppingCart className="w-4 h-4 mr-2" />
              {stockStatus.status === "out-of-stock"
                ? "Out of Stock"
                : "Add to Cart"}
            </Button>
          </div>
        </div>

        {/* Product Info */}
        <div className="p-4">
          {/* Product Name */}
          <Link href={`/shop/${productId}`}>
            <h3 className="font-semibold text-base mb-2 hover:text-primary transition-colors duration-300 line-clamp-2 leading-tight">
              {productName}
            </h3>
          </Link>

          {/* Brand */}
          {product?.brand?.name && (
            <p className="text-sm text-gray-600 mb-2">{product.brand.name}</p>
          )}

          <div className="flex item-center justify-between">
            {/* Price */}
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-baseline gap-2">
                <span className="text-xl font-bold text-gray-900">
                  <b className="font-bold text-[30px] px-2">৳</b>
                  {productPrice}
                </span>
                {hasDiscount && (
                  <span className="text-sm text-gray-500 line-through">
                    <b className="font-bold text-[30px] px-2">৳</b>
                    {originalPrice}
                  </span>
                )}
              </div>
            </div>

            {/* Stock Status */}
            <div className="mt-2">
              <div className="flex justify-between text-xs mb-1">
                <span className={`font-medium ${stockStatus.color}`}>
                  {stockStatus.text}
                </span>
              </div>
              {/* Progress Bar - Only show for low stock */}
              {stockStatus.status === "low-stock" && (
                <div className="w-full bg-gray-200 rounded-full h-1.5">
                  <div
                    className={`h-1.5 rounded-full bg-gradient-to-r ${stockStatus.progressColor}`}
                    style={{ width: `${stockStatus.progress}%` }}
                  />
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Hover Border Effect */}
        <div className="absolute inset-0  border-transparent group-hover:border-blue-200 rounded-lg transition-all duration-500 pointer-events-none" />
      </CardContent>
    </Card>
  );
}
