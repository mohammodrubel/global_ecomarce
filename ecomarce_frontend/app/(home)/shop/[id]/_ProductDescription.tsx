import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface Category {
  id: string;
  name: string;
}
interface Brand {
  id: string;
  name: string;
  logo?: string;
}
interface Color {
  id: string;
  name: string;
}

interface ProductDescriptionProps {
  description: string;
  sku: string;
  brand?: Brand;
  category?: Category;
  subcategory?: string;
  stock: number;
  inStock: boolean;
  badge?: string;
  colors?: Color[];
}

export default function ProductDescription({
  description,
  sku,
  brand,
  category,
  subcategory,
  stock,
  inStock,
  badge,
  colors,
}: ProductDescriptionProps) {
  const rows: { label: string; value: React.ReactNode }[] = [
    { label: "SKU", value: sku || "N/A" },
    { label: "Brand", value: brand?.name || "N/A" },
    { label: "Category", value: category?.name || "N/A" },
    ...(subcategory
      ? [{ label: "Subcategory", value: subcategory }]
      : []),
    {
      label: "Availability",
      value: inStock && stock > 0 ? `In stock (${stock})` : "Out of stock",
    },
    ...(badge ? [{ label: "Badge", value: badge }] : []),
    ...(colors && colors.length
      ? [
          {
            label: "Colors",
            value: (
              <div className="flex flex-wrap gap-1.5">
                {colors.map((c) => (
                  <Badge key={c.id} variant="outline" className="text-xs">
                    {c.name}
                  </Badge>
                ))}
              </div>
            ),
          },
        ]
      : []),
  ];

  return (
    <Card>
      <CardContent className="p-6">
        <h3 className="font-semibold text-xl mb-4">Product Description</h3>

        <div
          className="prose prose-sm sm:prose max-w-none mb-8"
          dangerouslySetInnerHTML={{ __html: description || "No description available." }}
        />

        <h4 className="font-semibold text-lg mb-3">Product Details</h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-2">
          {rows.map((row) => (
            <div
              key={row.label}
              className="flex justify-between gap-4 border-b border-slate-100 py-2 text-sm"
            >
              <span className="font-medium text-slate-500">{row.label}</span>
              <span className="text-slate-900 text-right">{row.value}</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
