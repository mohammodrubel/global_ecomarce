import { notFound } from "next/navigation";
import ProductDetailClient from "./_ProductDetailClient";


export async function getProduct(id: string) {
  try {
    const res = await fetch(`http://localhost:9000/api/products/${id}`, {
      cache: "force-cache",
      next: { tags: [`product-${id}`] },
    });

    if (!res.ok) {
      return null;
    }
    return await res.json();
  } catch (error) {
    console.error("Error fetching product:", error);
    return null;
  }
}


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
