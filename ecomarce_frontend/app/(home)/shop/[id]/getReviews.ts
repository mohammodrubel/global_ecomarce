export async function getReviews(productId: string) {
  try {
    const res = await fetch(
      `http://localhost:9000/api/reviews/product/${productId}`,
      {
        cache: "no-store",
        next: { tags: [`reviews-${productId}`] },
      },
    );
    if (!res.ok) return [];
    const json = await res.json();
    return json?.data || [];
  } catch (error) {
    console.error("Error fetching reviews:", error);
    return [];
  }
}
