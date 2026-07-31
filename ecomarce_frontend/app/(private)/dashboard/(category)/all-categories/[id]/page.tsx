"use client";

import type React from "react";
import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Plus, X, ImageIcon } from "lucide-react";

import { toast } from "sonner";
import { useParams, useRouter } from "next/navigation";
import {
  useGetSingleCategoryQuery,
  useUpdateCategoryMutation,
} from "@/redux/fetchers/categoryApi/categoryApi";

export default function EditCategory() {
  const params = useParams();
  const router = useRouter();

  const { data, isLoading } = useGetSingleCategoryQuery(params.id);

  const [categoryName, setCategoryName] = useState("");
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [subcategories, setSubcategories] = useState<string[]>([]);
  const [newSubcategory, setNewSubcategory] = useState("");

  const [updateCategory] = useUpdateCategoryMutation();

  // --- Prefill form when data is loaded ---
  useEffect(() => {
    if (data?.data) {
      const category = data.data;
      setCategoryName(category.name);
      setSubcategories(category.subcategories || []);
      setImagePreview(category.icon || null);
    }
  }, [data]);

  // --- Subcategory handling ---
  const handleSubcategoryInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewSubcategory(e.target.value);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      addMultipleSubcategories();
    }
  };

  const addMultipleSubcategories = () => {
    if (!newSubcategory.trim()) return;
    const newItems = newSubcategory
      .split(",")
      .map((item) => item.trim())
      .filter((item) => item.length > 0 && !subcategories.includes(item));
    if (newItems.length > 0) {
      setSubcategories([...subcategories, ...newItems]);
    }
    setNewSubcategory("");
  };

  const removeSubcategory = (index: number) => {
    setSubcategories(subcategories.filter((_, i) => i !== index));
  };

  // --- Submit ---
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await updateCategory({
        data: { subcategories },
        id: params.id,
      }).unwrap();
      console.log(response)
      toast.success("Subcategories updated successfully!");
      router.push("/dashboard/all-categories");
    } catch (error: any) {
      toast.error(error?.data?.message || "Something went wrong");
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-3xl font-bold mb-6">Edit Category</h1>

          <Card>
            <CardHeader>
              <CardTitle>Update Category</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Category Name */}
                <div className="space-y-2">
                  <Label htmlFor="categoryName">Category Name</Label>
                  <Input disabled id="categoryName" value={categoryName} readOnly />
                </div>

                {/* Image Preview */}
                <div className="space-y-4">
                  <Label>Category Image</Label>
                  {imagePreview ? (
                    <div className="relative">
                      <img
                        src={imagePreview}
                        alt="Preview"
                        className="h-40 w-full object-cover rounded-md border"
                      />
                    </div>
                  ) : (
                    <div className="border-2 border-dashed rounded-md p-8 text-center cursor-not-allowed text-muted-foreground">
                      <ImageIcon className="h-10 w-10 mx-auto" />
                      <p className="text-sm mt-2">Image cannot be changed</p>
                    </div>
                  )}
                </div>

                {/* Subcategories */}
                <div className="space-y-4">
                  <Label>Subcategories</Label>
                  <div className="flex gap-2">
                    <Input
                      value={newSubcategory}
                      onChange={handleSubcategoryInput}
                      onKeyDown={handleKeyDown}
                      placeholder="Enter subcategories"
                    />
                    <Button
                      type="button"
                      onClick={addMultipleSubcategories}
                      disabled={!newSubcategory.trim()}
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                  {subcategories.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {subcategories.map((subcategory, index) => (
                        <Badge
                          key={index}
                          variant="secondary"
                          className="flex items-center gap-1"
                        >
                          {subcategory}
                          <button
                            type="button"
                            onClick={() => removeSubcategory(index)}
                            className="ml-1 hover:text-destructive"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>

                <Button type="submit" disabled={isLoading} className="w-full">
                  {isLoading ? "Updating..." : "Update Subcategories"}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
