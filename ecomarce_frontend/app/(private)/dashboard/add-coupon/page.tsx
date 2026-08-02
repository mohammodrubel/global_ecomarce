"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, Loader2, Percent, Save } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { SectionCard } from "@/components/dashboard/SectionCard";
import { useCreateCouponMutation } from "@/redux/fetchers/coupon/couponApi";

type DiscountType = "PERCENTAGE" | "FIXED_AMOUNT";

export default function AddCouponPage() {
  const router = useRouter();
  const [createCoupon, { isLoading }] = useCreateCouponMutation();

  const [form, setForm] = useState({
    code: "",
    description: "",
    discountType: "PERCENTAGE" as DiscountType,
    value: "",
    minPurchase: "",
    maxDiscount: "",
    expiresAt: "",
    usageLimit: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setForm((p) => ({ ...p, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const value = Number(form.value);
    if (!form.code.trim()) return toast.error("Code required");
    if (!value || value <= 0) return toast.error("Value must be > 0");
    if (form.discountType === "PERCENTAGE" && value > 100)
      return toast.error("Percentage cannot exceed 100");

    const payload: any = {
      code: form.code.trim().toUpperCase(),
      discountType: form.discountType,
      value,
      minPurchase: Number(form.minPurchase) || 0,
    };
    if (form.description.trim()) payload.description = form.description.trim();
    if (form.maxDiscount) payload.maxDiscount = Number(form.maxDiscount);
    if (form.expiresAt) payload.expiresAt = form.expiresAt;
    if (form.usageLimit) payload.usageLimit = Number(form.usageLimit);

    try {
      await createCoupon(payload).unwrap();
      toast.success("Coupon created");
      router.push("/dashboard/coupons");
    } catch (err: any) {
      toast.error(err?.data?.message || "Create failed");
    }
  };

  return (
    <div className="max-w-3xl mx-auto w-full space-y-6">
      <Button variant="ghost" size="sm" asChild className="-ml-2 text-slate-500 hover:text-slate-900">
        <Link href="/dashboard/coupons">
          <ArrowLeft className="h-4 w-4 mr-1.5" />
          Back to Coupons
        </Link>
      </Button>

      <PageHeader title="Add Coupon" description="Create a new discount code" />

      <form onSubmit={handleSubmit} className="space-y-5">
        <SectionCard title="Coupon Details" description="Basic information about the coupon">
          <div className="space-y-4">
            <div>
              <Label htmlFor="code" className="text-sm font-medium mb-1.5 block text-slate-700">
                Coupon Code <span className="text-red-500">*</span>
              </Label>
              <div className="relative">
                <Percent className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
                <Input
                  id="code"
                  name="code"
                  value={form.code}
                  onChange={handleChange}
                  placeholder="SUMMER50"
                  className="pl-9 uppercase tracking-wider font-medium h-10 border-slate-200 focus-visible:border-[#2563EB]"
                  required
                />
              </div>
              <p className="text-xs text-slate-500 mt-1.5">
                Customers will enter this exact code at checkout
              </p>
            </div>

            <div>
              <Label htmlFor="description" className="text-sm font-medium mb-1.5 block text-slate-700">
                Description
              </Label>
              <Input
                id="description"
                name="description"
                value={form.description}
                onChange={handleChange}
                placeholder="Summer sale discount"
                className="h-10 border-slate-200 focus-visible:border-[#2563EB]"
              />
            </div>
          </div>
        </SectionCard>

        <SectionCard
          title="Discount & Limits"
          description="Set the discount value and usage constraints"
        >
          <div className="space-y-4">
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="discountType" className="text-sm font-medium mb-1.5 block text-slate-700">
                  Type <span className="text-red-500">*</span>
                </Label>
                <select
                  id="discountType"
                  name="discountType"
                  value={form.discountType}
                  onChange={handleChange}
                  className="w-full h-10 rounded-md border border-slate-200 bg-white px-3 text-sm outline-none focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/20"
                >
                  <option value="PERCENTAGE">Percentage (%)</option>
                  <option value="FIXED_AMOUNT">Fixed Amount (৳)</option>
                </select>
              </div>
              <div>
                <Label htmlFor="value" className="text-sm font-medium mb-1.5 block text-slate-700">
                  Value <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="value"
                  name="value"
                  type="number"
                  min="0"
                  step="0.01"
                  value={form.value}
                  onChange={handleChange}
                  placeholder={form.discountType === "PERCENTAGE" ? "10" : "100"}
                  className="h-10 border-slate-200 focus-visible:border-[#2563EB]"
                  required
                />
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="minPurchase" className="text-sm font-medium mb-1.5 block text-slate-700">
                  Min purchase (৳)
                </Label>
                <Input
                  id="minPurchase"
                  name="minPurchase"
                  type="number"
                  min="0"
                  value={form.minPurchase}
                  onChange={handleChange}
                  placeholder="0"
                  className="h-10 border-slate-200 focus-visible:border-[#2563EB]"
                />
              </div>
              <div>
                <Label htmlFor="maxDiscount" className="text-sm font-medium mb-1.5 block text-slate-700">
                  Max discount cap (৳)
                </Label>
                <Input
                  id="maxDiscount"
                  name="maxDiscount"
                  type="number"
                  min="0"
                  value={form.maxDiscount}
                  onChange={handleChange}
                  placeholder="Optional"
                  disabled={form.discountType === "FIXED_AMOUNT"}
                  className="h-10 border-slate-200 focus-visible:border-[#2563EB]"
                />
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="expiresAt" className="text-sm font-medium mb-1.5 block text-slate-700">
                  Expiry date
                </Label>
                <Input
                  id="expiresAt"
                  name="expiresAt"
                  type="date"
                  value={form.expiresAt}
                  onChange={handleChange}
                  className="h-10 border-slate-200 focus-visible:border-[#2563EB]"
                />
              </div>
              <div>
                <Label htmlFor="usageLimit" className="text-sm font-medium mb-1.5 block text-slate-700">
                  Usage limit
                </Label>
                <Input
                  id="usageLimit"
                  name="usageLimit"
                  type="number"
                  min="1"
                  value={form.usageLimit}
                  onChange={handleChange}
                  placeholder="Unlimited"
                  className="h-10 border-slate-200 focus-visible:border-[#2563EB]"
                />
              </div>
            </div>
          </div>
        </SectionCard>

        <div className="flex justify-end gap-2">
          <Button asChild variant="outline" className="border-slate-200">
            <Link href="/dashboard/coupons">Cancel</Link>
          </Button>
          <Button
            type="submit"
            disabled={isLoading}
            className="bg-[#2563EB] hover:bg-[#1D4ED8]"
          >
            {isLoading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
                Creating...
              </>
            ) : (
              <>
                <Save className="h-4 w-4 mr-2" />
                Create Coupon
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}
