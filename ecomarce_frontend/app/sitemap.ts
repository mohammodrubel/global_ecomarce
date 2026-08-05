import type { MetadataRoute } from "next";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

async function fetchProductSlugs(): Promise<
  { id: string; updatedAt?: string }[]
> {
  try {
    const apiUrl =
      process.env.NEXT_PUBLIC_API_URL || "http://localhost:9000/api";
    const res = await fetch(`${apiUrl}/products`, {
      next: { revalidate: 3600 },
    });
    if (!res.ok) return [];
    const json = await res.json();
    const list = json?.data?.data || json?.data || [];
    return Array.isArray(list) ? list : [];
  } catch {
    return [];
  }
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${siteUrl}/`, lastModified: now, changeFrequency: "daily", priority: 1 },
    { url: `${siteUrl}/shop`, lastModified: now, changeFrequency: "daily", priority: 0.9 },
    { url: `${siteUrl}/shop/new`, lastModified: now, changeFrequency: "daily", priority: 0.8 },
    { url: `${siteUrl}/shop/bestsellers`, lastModified: now, changeFrequency: "daily", priority: 0.8 },
    { url: `${siteUrl}/about`, lastModified: now, changeFrequency: "monthly", priority: 0.6 },
    { url: `${siteUrl}/contact`, lastModified: now, changeFrequency: "monthly", priority: 0.6 },
    { url: `${siteUrl}/faq`, lastModified: now, changeFrequency: "monthly", priority: 0.5 },
    { url: `${siteUrl}/help`, lastModified: now, changeFrequency: "monthly", priority: 0.5 },
    { url: `${siteUrl}/shipping`, lastModified: now, changeFrequency: "monthly", priority: 0.5 },
    { url: `${siteUrl}/returns`, lastModified: now, changeFrequency: "monthly", priority: 0.5 },
    { url: `${siteUrl}/privacy`, lastModified: now, changeFrequency: "yearly", priority: 0.3 },
    { url: `${siteUrl}/terms`, lastModified: now, changeFrequency: "yearly", priority: 0.3 },
    { url: `${siteUrl}/track-order`, lastModified: now, changeFrequency: "monthly", priority: 0.4 },
  ];

  const products = await fetchProductSlugs();
  const productRoutes: MetadataRoute.Sitemap = products.map((p) => ({
    url: `${siteUrl}/shop/${p.id}`,
    lastModified: p.updatedAt ? new Date(p.updatedAt) : now,
    changeFrequency: "weekly",
    priority: 0.7,
  }));

  return [...staticRoutes, ...productRoutes];
}
