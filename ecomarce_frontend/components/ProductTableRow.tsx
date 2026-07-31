"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Heart, Eye, ShoppingCart, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";



export default function ProductTableRow({ product }) {
  const [hoveredProduct, setHoveredProduct] =
    (useState < number) | (null > null);

  return (
    <div
      className="grid grid-cols-1 lg:grid-cols-12 gap-4 p-6 bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-100 hover:shadow-lg transition-all duration-300 hover:border-blue-200 group"
      onMouseEnter={() => setHoveredProduct(product.id)}
      onMouseLeave={() => setHoveredProduct(null)}
    >
      {/* Product Image & Badge */}
      <div className="lg:col-span-2 relative">
        <Link href={`/product/${product.id}`}>
          <div className="relative h-32 w-32 rounded-xl overflow-hidden">
            <Image
              src={product.image || "/placeholder.svg"}
              alt={product.name}
              width={128}
              height={128}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
            />
            <Badge className="absolute top-2 left-2 bg-gradient-to-r from-red-500 to-pink-500 border-0 text-white text-xs">
              {product.badge}
            </Badge>
          </div>
        </Link>
      </div>

      {/* Product Info */}
      <div className="lg:col-span-3">
        <div className="mb-2">
          <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">
            {product.category}
          </span>
        </div>
        <Link href={`/product/${product.id}`}>
          <h3 className="font-bold text-lg mb-2 hover:text-primary transition-colors duration-300">
            {product.name}
          </h3>
        </Link>
        <div className="flex items-center gap-2 mb-2">
          <div className="flex">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`h-3 w-3 ${
                  i < Math.floor(product.rating)
                    ? "fill-yellow-400 text-yellow-400"
                    : "text-gray-300"
                }`}
              />
            ))}
          </div>
          <span className="text-sm text-gray-500">({product.reviews})</span>
        </div>
        <div className="flex flex-wrap gap-1">
          {product.features.map((feature, index) => (
            <span
              key={index}
              className="text-xs bg-blue-50 text-blue-600 px-2 py-1 rounded-full"
            >
              {feature}
            </span>
          ))}
        </div>
      </div>

      {/* SKU & Stock */}
      <div className="lg:col-span-2 flex flex-col justify-center">
        <div className="text-sm text-gray-600 mb-1">
          <span className="font-medium">SKU:</span> {product.sku}
        </div>
        <div className="text-sm text-gray-600">
          <span className="font-medium">Stock:</span>{" "}
          <span
            className={
              product.stock > 10 ? "text-green-600" : "text-orange-600"
            }
          >
            {product.stock} units
          </span>
        </div>
      </div>

      {/* Price */}
      <div className="lg:col-span-2 flex flex-col justify-center">
        <div className="flex items-baseline gap-2 mb-1">
          <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            ${product.price}
          </span>
          <span className="text-sm text-gray-500 line-through">
            ${product.originalPrice}
          </span>
        </div>
        <div className="text-xs font-medium bg-green-100 text-green-600 px-2 py-1 rounded-full w-fit">
          {Math.round((1 - product.price / product.originalPrice) * 100)}% OFF
        </div>
      </div>

      {/* Actions */}
      <div className="lg:col-span-3 flex items-center gap-3">
        <Button
          size="icon"
          variant="ghost"
          className="h-10 w-10 rounded-full bg-gray-100 hover:bg-gray-200 transition-all duration-300"
        >
          <Heart className="h-4 w-4" />
        </Button>
        <Button
          size="icon"
          variant="ghost"
          className="h-10 w-10 rounded-full bg-gray-100 hover:bg-gray-200 transition-all duration-300"
        >
          <Eye className="h-4 w-4" />
        </Button>
        <Button className="flex-1 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 border-0 shadow-lg transition-all duration-300">
          <ShoppingCart className="h-4 w-4 mr-2" />
          Add to Cart
        </Button>
      </div>
    </div>
  );
}
