import { Badge } from "@/components/ui/badge";
import { Star } from "lucide-react";

interface ProductHeaderProps {
  brand: string;
  sku: string;
  name: string;
  rating: number;
  reviewsCount: number;
  price: number;
  originalPrice: number;
}

export default function ProductHeader({
  brand,
  sku,
  name,
  rating,
  reviewsCount,
  price,
  originalPrice,
}: ProductHeaderProps) {
  const renderStars = (rating: number) => {
    return [...Array(5)].map((_, i) => (
      <Star
        key={i}
        className={`h-4 w-4 ${
          i < Math.floor(rating)
            ? "fill-primary text-primary"
            : "text-muted-foreground"
        }`}
      />
    ));
  };

  return (
    <div>
      <div className="flex items-center gap-2 mb-3 flex-wrap">
        <Badge variant="outline" className="text-sm">
          {brand}
        </Badge>
        <span className="text-sm text-muted-foreground">SKU: {sku}</span>
      </div>

      <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold mb-4 leading-tight break-words">
        {name}
      </h1>

      <div className="flex items-center gap-4 mb-4 flex-wrap">
        <div className="flex items-center gap-2">
          <div className="flex">{renderStars(rating)}</div>
          <span className="font-medium">{rating}</span>
          <span className="text-muted-foreground">
            ({reviewsCount} reviews)
          </span>
        </div>
      </div>

      <div className="flex items-center gap-2 sm:gap-4 mb-6 flex-wrap">
        <span className="text-2xl sm:text-3xl lg:text-4xl font-bold text-primary">
          ₹{price}
        </span>
        {originalPrice > price && (
          <>
            <span className="text-lg sm:text-xl lg:text-2xl text-muted-foreground line-through">
              ₹{originalPrice}
            </span>
            <Badge variant="secondary" className="text-sm font-medium">
              Save ₹{(originalPrice - price).toFixed(2)}
            </Badge>
          </>
        )}
      </div>
    </div>
  );
}
