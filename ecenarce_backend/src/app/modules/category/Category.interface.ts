export interface CategoryType {
  id: string;
  name: string;
  icon?: string | null;
  subcategories: string[];
  isDeleted: boolean;
  createdAt: Date;
  updatedAt: Date;
}
