
export interface Brand {
  id: string;
  name: string;
  logo: string;
}
export interface Category {
  id: string;
  name: string;
}

export interface ProductType {
  id: string;
  name: string;
  description: string;
  sku: string;

  price: number;
  originalPrice: number;

  stock: number;
  inStock: boolean;

  badge: string | null;
  rating: number | null;
  reviewsCount: number;

  images: string[];

  brandId: string;
  categoryId: string;

  brand: Brand;
  category: Category;
  colors:string[]
  subcategory: string;
  isDeleted: boolean;

  createdAt: string;
  updatedAt: string;
}

export interface BrandType {
  id: string; // UUID
  name: string;
  description: string; // HTML string (Rich text)
  logo: string; // Image URL
  createdAt: string; // ISO date string
  updatedAt: string; // ISO date string
}
export interface CategoryType {
  id: string; 
  name: string;
  icon: string; 
  subcategories: string[];
  isDeleted: boolean;
  createdAt: string; 
}