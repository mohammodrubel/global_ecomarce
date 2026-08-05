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

import type { Metadata } from "next";

function stripHtml(input: string): string {
  return (input || "")
    .replace(/<[^>]*>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function truncate(input: string, max = 160): string {
  if (!input) return "";
  return input.length > max ? `${input.slice(0, max - 1)}…` : input;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const productRes = await getProduct(id);
  const product = productRes?.data;

  if (!product) {
    return {
      title: "Product Not Found",
      description: "The product you're looking for is not available.",
      robots: { index: false, follow: true },
    };
  }

  const cleanDesc = truncate(stripHtml(product.description || ""));
  const description =
    cleanDesc ||
    `${product.name} available at RocksMart. Fast delivery, secure checkout, verified brand.`;

  const canonical = `/shop/${id}`;
  const images: string[] = Array.isArray(product.images)
    ? product.images.slice(0, 4)
    : [];

  return {
    title: product.name || "Product",
    description,
    keywords: [
      product.name,
      product.brand?.name,
      product.category?.name,
      product.subcategory,
      "buy online",
      "RocksMart",
    ].filter(Boolean) as string[],
    alternates: { canonical },
    openGraph: {
      title: product.name,
      description,
      url: canonical,
      type: "website",
      images: images.map((url) => ({ url, alt: product.name })),
    },
    twitter: {
      card: "summary_large_image",
      title: product.name,
      description,
      images,
    },
    other: {
      "product:price:amount": String(product.price ?? ""),
      "product:price:currency": "USD",
      "product:availability": product.inStock ? "in stock" : "out of stock",
      "product:brand": product.brand?.name || "",
      "product:category": product.category?.name || "",
    },
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

  const siteUrl =
    process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
  const productUrl = `${siteUrl}/shop/${id}`;

  const productJsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: stripHtml(product.description || ""),
    sku: product.sku || undefined,
    image: Array.isArray(product.images) ? product.images : undefined,
    brand: product.brand?.name
      ? { "@type": "Brand", name: product.brand.name }
      : undefined,
    category: product.category?.name || undefined,
    offers: {
      "@type": "Offer",
      url: productUrl,
      priceCurrency: "USD",
      price: product.price ?? 0,
      availability: product.inStock
        ? "https://schema.org/InStock"
        : "https://schema.org/OutOfStock",
      itemCondition: "https://schema.org/NewCondition",
    },
    ...(reviewsCount > 0
      ? {
          aggregateRating: {
            "@type": "AggregateRating",
            ratingValue: Number(averageRating.toFixed(2)),
            reviewCount: reviewsCount,
          },
          review: reviews.slice(0, 5).map((r: any) => ({
            "@type": "Review",
            reviewRating: {
              "@type": "Rating",
              ratingValue: r.rating,
              bestRating: 5,
            },
            author: {
              "@type": "Person",
              name: r.user?.full_name || "Anonymous",
            },
            datePublished: r.createdAt,
            reviewBody: r.comment || "",
          })),
        }
      : {}),
  };

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: siteUrl },
      { "@type": "ListItem", position: 2, name: "Shop", item: `${siteUrl}/shop` },
      ...(product.category?.name
        ? [
            {
              "@type": "ListItem",
              position: 3,
              name: product.category.name,
              item: `${siteUrl}/shop?categoryId=${product.category.id}`,
            },
          ]
        : []),
      {
        "@type": "ListItem",
        position: product.category?.name ? 4 : 3,
        name: product.name,
        item: productUrl,
      },
    ],
  };

  return (
    <div className="min-h-screen">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
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
