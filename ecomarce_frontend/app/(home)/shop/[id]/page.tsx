import Link from "next/link";
import { notFound } from "next/navigation";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";

import ProductImages from "./_ProductImages";
import ProductHeader from "./_ProductHeader";
import ProductFeatures from "./_ProductFeatures";
import TrustFeatures from "./_TrustFeatures";
import ProductDescription from "./_ProductDescription";
import ProductReviews from "./_ProductReviews";
import CartActions from "./_CartActions";

import { getProduct } from "./getProduct";
import { getReviews } from "./getReviews";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const product = await getProduct(id);
  return {
    title: product
      ? `${product?.data?.name ?? "Product"} - MyStore`
      : "Product Not Found",
    description:
      product?.data?.description ?? "Find more great products on MyStore.",
  };
}

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [productRes, reviews] = await Promise.all([
    getProduct(id),
    getReviews(id),
  ]);

  if (!productRes || !productRes.data) {
    notFound();
  }

  const product = productRes.data;

  const reviewsCount = reviews.length;
  const averageRating =
    reviewsCount > 0
      ? reviews.reduce((s: number, r: any) => s + (r.rating || 0), 0) /
        reviewsCount
      : product.rating || 0;

  return (
    <div className="min-h-screen">
      <div className="container mx-auto px-3 sm:px-4 py-4 sm:py-8">
        {/* Breadcrumb */}
        <nav className="flex items-center space-x-2 text-xs sm:text-sm text-muted-foreground mb-4 sm:mb-8 flex-wrap gap-1 sm:gap-2">
          <Link href="/" className="hover:text-primary transition-colors">
            Home
          </Link>
          <span>/</span>
          <Link
            href={`/shop?brandId=${product?.brand?.id}`}
            className="hover:text-primary transition-colors"
          >
            {product?.brand?.name}
          </Link>
          <span>/</span>
          <Link
            href={`/shop?categoryId=${product?.category?.id}`}
            className="hover:text-primary transition-colors"
          >
            {product?.category?.name}
          </Link>
          <span>/</span>
          <span className="text-foreground font-medium truncate">
            {product.name}
          </span>
        </nav>

        <div className="grid md:grid-cols-2 gap-6 md:gap-8 lg:gap-12 mb-10 sm:mb-16">
          <ProductImages
            images={product.images || ["/placeholder.svg"]}
            name={product.name || "Product"}
            inStock={product.inStock}
          />

          <div className="space-y-6">
            <ProductHeader
              brand={product.brand?.name || "Unknown Brand"}
              sku={product.sku || "N/A"}
              name={product.name || "Product"}
              rating={averageRating}
              reviewsCount={reviewsCount}
              price={product.price || 0}
              originalPrice={product.originalPrice || 0}
            />

            <ProductFeatures
              description={product.description || ""}
              features={[]}
            />

            <CartActions product={product} />

            <TrustFeatures />
          </div>
        </div>

        <Tabs defaultValue="description" className="mb-10 sm:mb-16">
          <TabsList className="grid w-full grid-cols-2 p-1 rounded-lg h-auto">
            <TabsTrigger
              value="description"
              className="rounded-md text-xs sm:text-sm px-1 sm:px-3 py-2"
            >
              Description
            </TabsTrigger>
            <TabsTrigger
              value="reviews"
              className="rounded-md text-xs sm:text-sm px-1 sm:px-3 py-2"
            >
              Reviews ({reviewsCount})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="description" className="mt-6">
            <ProductDescription
              description={product.description || ""}
              sku={product.sku || ""}
              brand={product.brand}
              category={product.category}
              subcategory={product.subcategory}
              stock={product.stock || 0}
              inStock={product.inStock}
              badge={product.badge}
              colors={product.colors}
            />
          </TabsContent>

          <TabsContent value="reviews" className="mt-6">
            <ProductReviews
              reviews={reviews}
              averageRating={averageRating}
              reviewsCount={reviewsCount}
            />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
