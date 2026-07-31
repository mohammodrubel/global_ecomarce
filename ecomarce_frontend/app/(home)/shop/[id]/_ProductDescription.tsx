import { stripHtmlTags } from "@/app/utils";
import { Card, CardContent } from "@/components/ui/card";
import { Check } from "lucide-react";

interface ProductDescriptionProps {
  description: string;
}

export default function ProductDescription({
  description,
}: ProductDescriptionProps) {
  return (
    <Card>
      <CardContent className="p-6">
        <h3 className="font-semibold text-xl mb-4">Product Description</h3>
        <div className="prose max-w-none">
          <p className="mb-6 leading-relaxed">{stripHtmlTags(description)}</p>
          <div className="bg-muted rounded-lg p-6 mb-6">
            <h4 className="font-semibold text-lg mb-4">Perfect For:</h4>
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <li className="flex items-center gap-3">
                <Check className="h-5 w-5 text-green-500" />
                <span>Summer Events</span>
              </li>
              <li className="flex items-center gap-3">
                <Check className="h-5 w-5 text-green-500" />
                <span>Birthday Parties</span>
              </li>
              <li className="flex items-center gap-3">
                <Check className="h-5 w-5 text-green-500" />
                <span>Special Occasions</span>
              </li>
              <li className="flex items-center gap-3">
                <Check className="h-5 w-5 text-green-500" />
                <span>Daily Wear</span>
              </li>
            </ul>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
