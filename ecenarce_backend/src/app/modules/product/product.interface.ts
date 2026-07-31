export interface ApiResponse<T> {
  statusCode: number;
  success: boolean;
  message: string;
  data: {
    meta: Meta;
    data: T[];
  };
}

export interface Meta {
  page: number;
  limit: number;
}

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
  badge: string | null;
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
