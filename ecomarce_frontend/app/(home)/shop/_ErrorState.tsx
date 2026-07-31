import { Button } from "@/components/ui/button";

export default function ErrorState() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50/30 flex items-center justify-center">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          Failed to load products
        </h2>
        <p className="text-gray-600 mb-4">
          There was an error loading the products. Please try again later.
        </p>
        <Button onClick={() => window.location.reload()}>Retry</Button>
      </div>
    </div>
  );
}
