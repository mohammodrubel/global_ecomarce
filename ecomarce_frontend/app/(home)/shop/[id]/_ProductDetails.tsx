import { Card, CardContent } from "@/components/ui/card";

interface ProductDetailsProps {
  product: {
    material: string;
    style: string;
    decoration: string;
    season: string;
    technics: string;
  };
}

export default function ProductDetails({ product }: ProductDetailsProps) {
  return (
    <Card>
      <CardContent className="p-6">
        <h3 className="font-semibold text-xl mb-4">Product Details</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="flex justify-between border-b pb-2">
              <span className="font-medium text-muted-foreground">
                Material
              </span>
              <span>{product.material}</span>
            </div>
            <div className="flex justify-between border-b pb-2">
              <span className="font-medium text-muted-foreground">Style</span>
              <span>{product.style}</span>
            </div>
            <div className="flex justify-between border-b pb-2">
              <span className="font-medium text-muted-foreground">
                Decoration
              </span>
              <span>{product.decoration}</span>
            </div>
            <div className="flex justify-between border-b pb-2">
              <span className="font-medium text-muted-foreground">Season</span>
              <span>{product.season}</span>
            </div>
          </div>
          <div className="space-y-4">
            <div className="flex justify-between border-b pb-2">
              <span className="font-medium text-muted-foreground">
                Technics
              </span>
              <span>{product.technics}</span>
            </div>
            <div className="flex justify-between border-b pb-2">
              <span className="font-medium text-muted-foreground">Collar</span>
              <span>O-Neck</span>
            </div>
            <div className="flex justify-between border-b pb-2">
              <span className="font-medium text-muted-foreground">
                Sleeve Style
              </span>
              <span>Sleeveless</span>
            </div>
            <div className="flex justify-between border-b pb-2">
              <span className="font-medium text-muted-foreground">
                Silhouette
              </span>
              <span>A-Line, Puffy</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
