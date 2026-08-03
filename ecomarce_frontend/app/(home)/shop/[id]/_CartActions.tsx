"use client";

import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";
import {
  Minus,
  Plus,
  ShoppingCart,
  Heart,
  Share2,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { addToCart } from "@/redux/fetchers/cart/cartSlice";
import {
  addToWishlist,
  removeFromWishlist,
} from "@/redux/fetchers/wishlist/wishlistSlice";
import { RootState } from "@/redux/store";

interface CartActionsProps {
  product: any;
}

export default function CartActions({ product }: CartActionsProps) {
  const [quantity, setQuantity] = useState(1);
  const dispatch = useDispatch();
  const inStock = product.inStock && product.stock > 0;

  const isWishlisted = useSelector((state: RootState) =>
    Boolean(
      state.wishlist?.product?.find(
        (p: any) => p.id === product?.id && p.wishlist,
      ),
    ),
  );

  const handleWishlistToggle = () => {
    if (isWishlisted) {
      dispatch(removeFromWishlist(product.id));
      toast.info("Removed from wishlist");
    } else {
      dispatch(addToWishlist(product));
      toast.success("Added to wishlist");
    }
  };

  const handleAddToCart = () => {
    for (let i = 0; i < quantity; i++) {
      dispatch(addToCart(product));
    }
    toast.success(`${quantity} × added to cart`);
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="font-semibold mb-3">Quantity</h3>
        <div className="flex items-center gap-6 flex-wrap">
          <div className="flex items-center border-2 border-border rounded-lg">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setQuantity((q) => Math.max(1, q - 1))}
              disabled={quantity <= 1}
              className="h-10 w-10"
            >
              <Minus className="h-4 w-4" />
            </Button>
            <span className="px-4 py-2 font-medium w-8 text-center">
              {quantity}
            </span>
            <Button
              variant="ghost"
              size="icon"
              onClick={() =>
                setQuantity((q) => Math.min(product.stock || q, q + 1))
              }
              disabled={quantity >= (product.stock || 0)}
              className="h-10 w-10"
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>
          <span className="text-sm text-muted-foreground">
            {product.stock || 0} items available
          </span>
        </div>
      </div>

      <div className="space-y-4 pt-4">
        <div className="flex gap-3 flex-col sm:flex-row">
          <Button
            size="lg"
            className="flex-1"
            disabled={!inStock}
            onClick={handleAddToCart}
          >
            <ShoppingCart className="h-5 w-5 mr-2" />
            {inStock ? "Add to Cart" : "Out of Stock"}
          </Button>
          <div className="flex gap-2">
            <Button
              size="lg"
              variant="outline"
              onClick={handleWishlistToggle}
              className={`flex-1 ${isWishlisted ? "text-destructive" : ""}`}
            >
              <Heart
                className={`h-5 w-5 ${
                  isWishlisted ? "fill-destructive" : ""
                }`}
              />
            </Button>
            <Button size="lg" variant="outline" className="flex-1">
              <Share2 className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
