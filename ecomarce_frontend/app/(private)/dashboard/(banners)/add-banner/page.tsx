"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useGetAllProductsQuery } from "@/redux/fetchers/products/productsApi";
import { useAddSliderMutation } from "@/redux/fetchers/slider/sliderApi";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { ReachKeyboard } from "@/components/share/ReachKeyboard";

// ------------------ Zod schema & Type ------------------
const formSchema = z.object({
  title: z.string().min(2, "Title must be at least 2 characters"),
  description: z.string().min(5, "Description must be at least 5 characters"),
  buttonText: z.string().min(1, "Button text is required"),
  productId: z.string().min(1, "Please select a product"),
});

export type SliderFormValues = z.infer<typeof formSchema>;

// ------------------ Component ------------------
export default function CreateSliderPage() {
  const { data } = useGetAllProductsQuery(undefined);
  const [addNewSlider] = useAddSliderMutation();
  const router = useRouter();

  const form = useForm<SliderFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      description: "",
      buttonText: "",
      productId: "",
    },
  });

  const onSubmit = async (values: SliderFormValues) => {
    try {
      const res = await addNewSlider(values).unwrap();

      if (res?.success) {
        toast.success(res?.message);
        setTimeout(() => {
          router.push("/dashboard/all-banners");
        }, 2000);
      } else {
        toast.error(res?.error?.message || "Something went wrong");
      }
    } catch (error: any) {
      if (error?.data?.message) {
        toast.error(error.data.message);
      } else {
        toast.error("Something went wrong");
      }
    }
  };

  return (
    <div className="max-w-3xl mx-auto w-full space-y-6">
      <div className="pb-4 border-b border-slate-200">
        <h1 className="text-2xl sm:text-[28px] font-semibold tracking-tight text-slate-900">
          Add Banner
        </h1>
        <p className="text-sm text-slate-500 mt-1">Create a new homepage banner</p>
      </div>
      <Card className="border-slate-200 shadow-none rounded-xl">
        <CardHeader>
          <CardTitle className="text-[15px] font-semibold">Banner Details</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-4 w-full"
            >
              {/* Title */}
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Title</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter title"
                        {...field}
                        className="w-full"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Description (ReachKeyboard) */}
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <ReachKeyboard
                        content={field.value}
                        onChange={(val: string) => field.onChange(val)}
                        placeholder="Start writing your product description..."
                        className="min-h-[200px]"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Button Text */}
              <FormField
                control={form.control}
                name="buttonText"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Button Text</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter button text"
                        {...field}
                        className="w-full"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Product Select */}
              <FormField
                control={form.control}
                name="productId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Select Product</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Choose a product" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {data?.data?.map((item: any) => (
                          <SelectItem key={item.id} value={item.id}>
                            {item.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button type="submit" className="w-full">
                Submit
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
