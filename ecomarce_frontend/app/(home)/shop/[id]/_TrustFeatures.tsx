import { Truck, Shield, RotateCcw } from "lucide-react";

export default function TrustFeatures() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-6 border-t">
      <div className="flex items-center gap-3">
        <div className="p-2 bg-muted rounded-lg">
          <Truck className="h-5 w-5" />
        </div>
        <div>
          <p className="font-medium">Free Shipping</p>
          <p className="text-sm text-muted-foreground">Above ₹499</p>
        </div>
      </div>
      <div className="flex items-center gap-3">
        <div className="p-2 bg-muted rounded-lg">
          <Shield className="h-5 w-5" />
        </div>
        <div>
          <p className="font-medium">Quality Guarantee</p>
          <p className="text-sm text-muted-foreground">Premium Materials</p>
        </div>
      </div>
      <div className="flex items-center gap-3">
        <div className="p-2 bg-muted rounded-lg">
          <RotateCcw className="h-5 w-5" />
        </div>
        <div>
          <p className="font-medium">Easy Returns</p>
          <p className="text-sm text-muted-foreground">7 Days Return</p>
        </div>
      </div>
    </div>
  );
}
