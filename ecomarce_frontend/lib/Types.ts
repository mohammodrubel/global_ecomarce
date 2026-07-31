export interface Category {
  id: string;
  name: string;
  icon: string;
  subcategories: string[];
  isDeleted: boolean;
  createdAt: string; // ISO date string
  updatedAt: string; // ISO date string
}

export interface Brand {
  id: string;
  name: string;
  description: string;
  createdAt: string; // ISO date string
  updatedAt: string; // ISO date string
}
// Brand type
export interface Brand {
  id: string;
  name: string;
  logo: string;
  description: string;
  createdAt: string;
  updatedAt: string;
}

// Category type
export interface Category {
  id: string;
  name: string;
  icon: string;
  subcategories: string[];
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
}

// Product type
export interface Product {
  id: string;
  name: string;
  description: string;
  subcategory: string;
  price: number;
  originalPrice: number;
  discountType: string | null;
  discountValue: number | null;
  discountStart: string | null;
  discountEnd: string | null;
  stock: number;
  sku: string;
  brandId: string;
  categoryId: string;
  images: string[];
  rating: number;
  reviewsCount: number;
  badge: string ;
  inStock: boolean;
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
  category: Category;
  brand: Brand;
}

export type BrandInfo = {
  id: string;
  name: string;
  description: string;
  imageUrl?: string;
};

export type BrandResponse = {
  success: boolean;
  message: string;
  data?: BrandInfo;
};