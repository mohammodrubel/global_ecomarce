import { stripHtmlTags } from "@/app/utils";
import { Card, CardContent } from "@/components/ui/card";

interface ProductFeaturesProps {
  description: string;
  features: string[];
}

export default function ProductFeatures({
  description,
  features,
}: ProductFeaturesProps) {
  return (
    <>
      <Card>
        <CardContent className="p-6">
          <p className="leading-relaxed">
            {stripHtmlTags(description)}
          </p>
        </CardContent>
      </Card>

      {features.length > 0 && (
        <Card>
          <CardContent className="p-6">
            <h3 className="font-semibold text-lg mb-4">✨ Key Features</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {features.map((feature, index) => (
                <div key={index} className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-primary rounded-full" />
                  <span className="text-sm">{feature}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </>
  );
}
