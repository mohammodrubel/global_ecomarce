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
