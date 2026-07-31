import { Button } from "@/components/ui/button";
import { Minus, Plus } from "lucide-react";

interface QuantitySelectorProps {
  quantity: number;
  onQuantityChange: (quantity: number) => void;
  stock: number;
}

export default function QuantitySelector({
  quantity,
  onQuantityChange,
  stock,
}: QuantitySelectorProps) {
  return (
    <div>
      <h3 className="font-semibold mb-3">Quantity</h3>
      <div className="flex items-center gap-6 flex-wrap">
        <div className="flex items-center border-2 border-border rounded-lg">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onQuantityChange(Math.max(1, quantity - 1))}
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
            onClick={() => onQuantityChange(quantity + 1)}
            disabled={quantity >= stock}
            className="h-10 w-10"
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>
        <span className="text-sm text-muted-foreground">
          {stock} items available
        </span>
      </div>
    </div>
  );
}
