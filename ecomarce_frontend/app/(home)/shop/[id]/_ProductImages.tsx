"use client";

import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { Sparkles } from "lucide-react";
import { useState } from "react";

interface ProductImagesProps {
  images: string[];
  name: string;
  inStock: boolean;
}

export default function ProductImages({
  images,
  name,
  inStock,
}: ProductImagesProps) {
  const [selectedImage, setSelectedImage] = useState(0);

  return (
    <div className="space-y-4">
      <div className="aspect-square relative overflow-hidden rounded-lg border shadow-sm">
        <Image
          src={images[selectedImage] || "/placeholder.svg"}
          alt={name}
          fill
          className="object-cover"
          priority
        />
        <div className="absolute top-4 left-4 flex gap-2">
          <Badge>
            <Sparkles className="h-3 w-3 mr-1" />
            Featured
          </Badge>
          {inStock ? (
            <Badge variant="secondary">In Stock</Badge>
          ) : (
            <Badge variant="destructive">Out of Stock</Badge>
          )}
        </div>
      </div>
      {images.length > 1 && (
        <div className="grid grid-cols-4 sm:grid-cols-5 gap-2 sm:gap-3">
          {images.map((image, index) => (
            <button
              key={index}
              onClick={() => setSelectedImage(index)}
              aria-label={`View image ${index + 1} of ${images.length}`}
              className={`aspect-square relative overflow-hidden rounded-lg border-2 transition-all ${
                selectedImage === index
                  ? "border-primary shadow-sm"
                  : "border-border hover:border-primary/50"
              }`}
            >
              <Image
                src={image || "/placeholder.svg"}
                alt={`${name} ${index + 1}`}
                fill
                className="object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
