"use client";

import React, { useState, ChangeEvent, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { X, Upload } from "lucide-react";
import { ReachKeyboard } from "@/components/share/ReachKeyboard";
import {
  useGetSingleBrandQuery,
  useUpdateBrandMutation,
  useUpdateBrandImageMutation,
} from "@/redux/fetchers/brand/brandApi";
import { toast } from "sonner";

const EditBrandPage: React.FC = () => {
  const router = useRouter();
  const params = useParams();
  const brandId = params.id as string;

  const { data: brandData, isLoading, error } = useGetSingleBrandQuery(brandId);
  const [updateBrand] = useUpdateBrandMutation();
  const [updateBrandImage] = useUpdateBrandImageMutation();

  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
  });

  // Initialize form with brand data
  useEffect(() => {
    if (brandData?.data) {
      const brand = brandData.data;
      setFormData({
        name: brand.name || "",
        description: brand.description || "",
      });
      setPreview(brand.logo || null);
    }
  }, [brandData]);

  const handleInputChange = (field: keyof typeof formData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0] || null;
    if (!selectedFile) return;
    setFile(selectedFile);
    setPreview(URL.createObjectURL(selectedFile));
  };

  const removeFile = () => {
    setFile(null);
    setPreview(brandData?.data?.logo || null);
  };

  const handleImageUpdate = async () => {
    if (!file) return;

    try {
      const form = new FormData();
      form.append("file", file);

      const res = await updateBrandImage({
        id: brandId,
        data: form,
      }).unwrap();

      if (res?.success) {
        toast.success("Brand logo updated successfully");
        setFile(null);
      }
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to update logo");
    }
  };

  const handleBrandUpdate = async () => {
    if (!formData.name.trim()) {
      return toast.error("Brand name is required");
    }

    try {
      const res = await updateBrand({
        id: brandId,
        data: formData,
      }).unwrap();

      if (res.success) {
        toast.success(res.message);
        router.push("/dashboard/brand");
      }
    } catch (error: any) {
      toast.error(error?.data?.message || "Something went wrong");
    }
  };

  const handleSubmit = async () => {
    // Update image first if new file is selected
    if (file) {
      await handleImageUpdate();
    }

    // Then update brand information
    await handleBrandUpdate();
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading brand...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-red-500">Failed to load brand</p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl w-full space-y-6">
      <div className="pb-4 border-b border-slate-200">
        <h1 className="text-2xl sm:text-[28px] font-semibold tracking-tight text-slate-900">
          Edit Brand
        </h1>
        <p className="text-sm text-slate-500 mt-1">Update brand information</p>
      </div>
      <Card className="border-slate-200 shadow-none rounded-xl">
        <CardHeader>
          <CardTitle className="text-[15px] font-semibold">Brand Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Upload Photo */}
          <div className="space-y-2">
            <Label>Brand Logo</Label>
            <div className="border-2 border-dashed rounded-xl p-6 flex flex-col items-center justify-center cursor-pointer hover:bg-muted/30 transition">
              {!preview ? (
                <>
                  <Upload className="text-muted-foreground mb-2 h-8 w-8" />
                  <p className="text-sm text-muted-foreground text-center">
                    Drag & drop or click to upload
                  </p>
                  <Input
                    id="photo"
                    type="file"
                    className="hidden"
                    onChange={handleFileChange}
                  />
                  <Label
                    htmlFor="photo"
                    className="mt-2 cursor-pointer text-sm text-primary underline"
                  >
                    Choose File
                  </Label>
                </>
              ) : (
                <div className="relative">
                  <img
                    src={preview}
                    alt="Preview"
                    className="w-48 h-48 object-cover rounded-lg shadow"
                  />
                  <button
                    type="button"
                    onClick={removeFile}
                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 shadow hover:bg-red-600"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>
            {file && (
              <p className="text-sm text-green-600">
                New logo selected - will be updated on save
              </p>
            )}
          </div>

          {/* Name */}
          <div className="space-y-2">
            <Label htmlFor="name">Brand Name</Label>
            <Input
              id="name"
              type="text"
              placeholder="Enter brand name"
              value={formData.name}
              onChange={(e) => handleInputChange("name", e.target.value)}
            />
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label>Description</Label>
            <ReachKeyboard
              placeholder="Start writing your brand description..."
              onChange={(val) => handleInputChange("description", val)}
              initialValue={formData.description}
            />
          </div>

          <div className="flex gap-4">
            <Button
              variant="outline"
              className="flex-1"
              onClick={() => router.push("/dashboard/brand")}
            >
              Cancel
            </Button>
            <Button
              className="flex-1"
              onClick={handleSubmit}
              disabled={!formData.name.trim()}
            >
              Update Brand
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default EditBrandPage;
