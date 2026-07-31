"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CalendarIcon } from "lucide-react";
import { toast } from "sonner";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useGetAllProductsQuery } from "@/redux/fetchers/products/productsApi";
import { useAddSpecialOfferMutation } from "@/redux/fetchers/special-offer/specialOffer";

export default function AddSpecialOffer() {
  const [title, setTitle] = useState("");
  const [productId, setProductId] = useState("");
  const [description, setDescription] = useState("");
  const [validFrom, setValidFrom] = useState<Date | null>(null);
  const [validUntil, setValidUntil] = useState<Date | null>(null);

  const { data: products } = useGetAllProductsQuery(undefined);
  const [AddSpecialOfferData] = useAddSpecialOfferMutation();
  const router = useRouter();

  // --- Submit ---
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title || !productId || !validFrom) {
      toast.error("Please fill in all required fields");
      return;
    }

    const payload = {
      title: title.trim(),
      description: description.trim() || null,
      productId,
      validFrom: validFrom.toISOString(),
      validUntil: validUntil ? validUntil.toISOString() : null,
      isActive: true,
    };

    try {
      const res: any = await AddSpecialOfferData(payload);

      if (res?.data?.success) {
        toast.success(
          res.data.message || "Special Offer created successfully!"
        );
        router.push("/dashboard/specialOffer");
      } else {
        toast.error(res?.error?.data?.message || "Something went wrong");
      }
    } catch (error: any) {
      toast.error(error?.data?.message || "Something went wrong");
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <Card>
            <CardHeader>
              <CardTitle>Create Special Offer</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Title */}
                <div className="space-y-2">
                  <Label htmlFor="title">Title *</Label>
                  <Input
                    id="title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                  />
                </div>

                {/* Description */}
                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Input
                    id="description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                  />
                </div>

                {/* Product */}
                <div className="space-y-2">
                  <Label htmlFor="product">Product *</Label>
                  <select
                    id="product"
                    value={productId}
                    onChange={(e) => setProductId(e.target.value)}
                    required
                    className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    <option value="">-- Select Product --</option>
                    {products?.data?.map((prod: any) => (
                      <option key={prod.id} value={prod.id}>
                        {prod.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Valid From */}
                <div className="space-y-2">
                  <Label>Valid From *</Label>
                  <div className="flex items-center border rounded-md px-3 py-2 focus-within:ring-2 focus-within:ring-primary">
                    <CalendarIcon className="h-5 w-5 mr-2 text-muted-foreground" />
                    <DatePicker
                      selected={validFrom}
                      onChange={(date) => setValidFrom(date)}
                      showTimeSelect
                      timeFormat="HH:mm"
                      timeIntervals={15}
                      dateFormat="MMMM d, yyyy h:mm aa"
                      className="w-full bg-transparent outline-none"
                      placeholderText="Select start date and time"
                      required
                    />
                  </div>
                </div>

                {/* Valid Until */}
                <div className="space-y-2">
                  <Label>Valid Until</Label>
                  <div className="flex items-center border rounded-md px-3 py-2 focus-within:ring-2 focus-within:ring-primary">
                    <CalendarIcon className="h-5 w-5 mr-2 text-muted-foreground" />
                    <DatePicker
                      selected={validUntil}
                      onChange={(date) => setValidUntil(date)}
                      showTimeSelect
                      timeFormat="HH:mm"
                      timeIntervals={15}
                      dateFormat="MMMM d, yyyy h:mm aa"
                      className="w-full bg-transparent outline-none"
                      placeholderText="Select end date (optional)"
                    />
                  </div>
                </div>

                <Button type="submit" className="w-full mt-4">
                  Create Special Offer
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
