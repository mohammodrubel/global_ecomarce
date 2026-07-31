export interface Product {
  id: string;
  name: string;
  description: string;
  subcategory: string;
  price: number;
  originalPrice: number;
  stock: number;
  sku: string;
  brandId: string;
  categoryId: string;
  wishlist?: boolean;
  images: string[];
  rating: number | null;
  reviewsCount: number;
  quantity:number;
  badge: "FEATURED" | "NEW" | "TRENDING" | string;
  inStock: boolean;
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;

  category: Category;
  brand: Brand;
}

export interface Category {
  id: string;
  name: string;
  icon: string;
  subcategories: string[];
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Brand {
  id: string;
  logo: string;
  name: string;
  description: string;
  createdAt: string;
  updatedAt: string;
}