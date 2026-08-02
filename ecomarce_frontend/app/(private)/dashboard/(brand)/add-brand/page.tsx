"use client";

import React, { useState, ChangeEvent } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { X, Upload } from "lucide-react";
import { ReachKeyboard } from "@/components/share/ReachKeyboard";
import { useAddNewBrandMutation } from "@/redux/fetchers/brand/brandApi";
import { toast } from "sonner";
import { BrandResponse } from "@/lib/Types";

const Page: React.FC = () => {
  const router = useRouter();
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [formData, setFormData] = useState({ name: "", description: "" });
  const [addNewBrand] = useAddNewBrandMutation();

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
    setPreview(null);
  };

  const handleSubmit = async () => {
    if (!file) return toast.error("Please upload a file");

    const form = new FormData();
    form.append("data", JSON.stringify(formData));
    form.append("file", file);

    try {
      const res: BrandResponse = await addNewBrand(form).unwrap();
      if (res.success) {
        toast.success(res.message);
        router.push("/dashboard/brand"); // Redirect after successful submit
      }
    } catch (error: any) {
      toast.error(error?.data?.message || "Something went wrong");
    }
  };

  return (
    <div className="mx-auto max-w-3xl w-full space-y-6">
      <div className="pb-4 border-b border-slate-200">
        <h1 className="text-2xl sm:text-[28px] font-semibold tracking-tight text-slate-900">
          Add Brand
        </h1>
        <p className="text-sm text-slate-500 mt-1">Create a new brand</p>
      </div>
      <Card className="border-slate-200 shadow-none rounded-xl">
        <CardHeader>
          <CardTitle className="text-[15px] font-semibold">Brand Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Upload Photo */}
          <div className="space-y-2">
            <Label>Upload Photo</Label>
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
            />
          </div>

          <Button className="w-full" onClick={handleSubmit}>
            Submit
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default Page;
