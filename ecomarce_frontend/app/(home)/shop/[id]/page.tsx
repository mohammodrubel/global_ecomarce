import { notFound } from "next/navigation";
import ProductDetailClient from "./_ProductDetailClient";
import { getProduct } from "./getProduct";


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
  const product = await getProduct(id);

  if (!product || !product.data) {
    notFound();
  }

  return <ProductDetailClient product={product.data} />;
}
