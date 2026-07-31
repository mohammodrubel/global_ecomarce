"use client";

import type React from "react";
import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Plus, X, Upload, ImageIcon } from "lucide-react";
import { useAddNewCategoryMutation } from "@/redux/fetchers/categoryApi/categoryApi";
import { toast } from "sonner";
import { useRouter } from "next/navigation";



export default function AddCategory() {
  const [categoryName, setCategoryName] = useState<string>("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [subcategories, setSubcategories] = useState<string[]>([]);
  const [newSubcategory, setNewSubcategory] = useState<string>("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [addNewCategory, { isLoading }] = useAddNewCategoryMutation();
  const router = useRouter();

  // --- Image Upload Handling ---
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Check if file is an image
      if (!file.type.startsWith("image/")) {
        alert("Please select an image file");
        return;
      }

      setImageFile(file);

      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setImageFile(null);
    setImagePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const triggerFileInput = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

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

    // Validate required fields
    if (!categoryName.trim()) {
      toast.error("Category name is required");
      return;
    }

    const formData = new FormData();
    const data = {
      name: categoryName.trim(),
      subcategories: subcategories,
    };

    formData.append("data", JSON.stringify(data));

    if (imageFile) {
      formData.append("file", imageFile);
    }

    try {
      const response = await addNewCategory(formData).unwrap();

      if (response.success) {
        toast.success(response.message);

        // Reset form
        setCategoryName("");
        setSubcategories([]);
        setImageFile(null);
        setImagePreview(null);

       
        // Navigate to categories page
        router.push("/dashboard/all-categories");
      }
    } catch (error: any) {
      console.error("Error creating category:", error);
      toast.error(error?.data?.message || "Something went wrong");
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <div className="flex items-center gap-4 mb-6">
            <h1 className="text-3xl font-bold">Add New Category</h1>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Create Category</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Category Name */}
                <div className="space-y-2">
                  <Label htmlFor="categoryName">Category Name *</Label>
                  <Input
                    id="categoryName"
                    value={categoryName}
                    onChange={(e) => setCategoryName(e.target.value)}
                    placeholder="Enter category name"
                    required
                  />
                </div>

                {/* Image Upload */}
                <div className="space-y-4">
                  <Label>Category Image (optional)</Label>

                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleImageUpload}
                    accept="image/*"
                    className="hidden"
                  />

                  {imagePreview ? (
                    <div className="flex flex-col items-center space-y-2">
                      <div className="relative">
                        <img
                          src={imagePreview}
                          alt="Preview"
                          className="h-40 w-full object-cover rounded-md border"
                        />
                        <button
                          type="button"
                          onClick={removeImage}
                          className="absolute -top-2 -right-2 bg-destructive text-destructive-foreground rounded-full p-1"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                      <Button
                        type="button"
                        variant="outline"
                        onClick={triggerFileInput}
                        className="mt-2"
                      >
                        Change Image
                      </Button>
                    </div>
                  ) : (
                    <div
                      onClick={triggerFileInput}
                      className="border-2 border-dashed rounded-md p-8 text-center cursor-pointer hover:border-primary transition-colors"
                    >
                      <div className="flex flex-col items-center justify-center space-y-2">
                        <ImageIcon className="h-10 w-10 text-muted-foreground" />
                        <p className="text-sm text-muted-foreground">
                          Click to upload an image
                        </p>
                        <p className="text-xs text-muted-foreground">
                          PNG, JPG, GIF up to 5MB
                        </p>
                      </div>
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
                      placeholder="Enter subcategories (comma separated)"
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
                    <div className="space-y-2">
                      <Label className="text-sm text-muted-foreground">
                        Subcategories ({subcategories.length})
                      </Label>
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
                    </div>
                  )}
                </div>

                {/* Submit */}
                <Button type="submit" disabled={isLoading} className="w-full">
                  {isLoading ? "Creating..." : "Create Category"}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
