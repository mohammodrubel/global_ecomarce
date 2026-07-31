import { Button } from "@/components/ui/button";
import { ShoppingCart, Heart, Share2 } from "lucide-react";

interface ActionButtonsProps {
  inStock: boolean;
  isWishlisted: boolean;
  onWishlistToggle: () => void;
}

export default function ActionButtons({
  inStock,
  isWishlisted,
  onWishlistToggle,
}: ActionButtonsProps) {
  return (
    <div className="space-y-4 pt-4">
      <div className="flex gap-3 flex-col sm:flex-row">
        <Button size="lg" className="flex-1" disabled={!inStock}>
          <ShoppingCart className="h-5 w-5 mr-2" />
          {inStock ? "Add to Cart" : "Out of Stock"}
        </Button>
        <div className="flex gap-2">
          <Button
            size="lg"
            variant="outline"
            onClick={onWishlistToggle}
            className={`flex-1 ${isWishlisted ? "text-destructive" : ""}`}
          >
            <Heart
              className={`h-5 w-5 ${isWishlisted ? "fill-destructive" : ""}`}
            />
          </Button>
          <Button size="lg" variant="outline" className="flex-1">
            <Share2 className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </div>
  );
}
