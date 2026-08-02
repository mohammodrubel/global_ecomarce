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
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { useGetAllProductsQuery } from "@/redux/fetchers/products/productsApi";
import { useAddNewAdvertisementMutation } from "@/redux/fetchers/advertisement/advertisementAPi";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

const ACTION_OPTIONS = ["Fetchers", "NewProduct"] as const;

const formSchema = z.object({
  title: z.string().min(2, "Title must be at least 2 characters"),
  productId: z.string().min(1, "Please select a product"),
  action: z.enum(ACTION_OPTIONS, {
    message: "Please select an action",
  }),
  active: z.boolean(),
});

type AdvertisementFormValues = z.infer<typeof formSchema>;

export default function CreateAdvertisementPage() {
  const { data: products } = useGetAllProductsQuery(undefined);
  const [addNewAdvertisement, { isLoading }] =
    useAddNewAdvertisementMutation();
  const router = useRouter();

  const form = useForm<AdvertisementFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      productId: "",
      action: undefined,
      active: false,
    },
  });

  const onSubmit = async (values: AdvertisementFormValues) => {
    try {
      const res = await addNewAdvertisement(values).unwrap();
      if (res?.success) {
        toast.success(res?.message || "Advertisement created");
        setTimeout(() => {
          router.push("/dashboard/all-advertisements");
        }, 1500);
      } else {
        toast.error(res?.error?.message || "Something went wrong");
      }
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to create advertisement");
    }
  };

  return (
    <div className="max-w-3xl mx-auto w-full space-y-6">
      <div className="pb-4 border-b border-slate-200">
        <h1 className="text-2xl sm:text-[28px] font-semibold tracking-tight text-slate-900">
          Add Advertisement
        </h1>
        <p className="text-sm text-slate-500 mt-1">Create a new product ad</p>
      </div>
      <Card className="border-slate-200 shadow-none rounded-xl">
        <CardHeader>
          <CardTitle className="text-[15px] font-semibold">Advertisement Details</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-4 w-full"
            >
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Title</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter advertisement title"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="productId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Select Product</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      value={field.value}
                    >
                      <FormControl>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Choose a product" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {products?.data?.map((p: any) => (
                          <SelectItem key={p.id} value={p.id}>
                            {p.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="action"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Action</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      value={field.value}
                    >
                      <FormControl>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Choose an action" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {ACTION_OPTIONS.map((opt) => (
                          <SelectItem key={opt} value={opt}>
                            {opt}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="active"
                render={({ field }) => (
                  <FormItem className="flex items-center justify-between rounded-lg border p-3">
                    <FormLabel className="m-0">Active</FormLabel>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />

              <Button
                type="submit"
                className="w-full"
                disabled={isLoading}
              >
                {isLoading ? "Submitting..." : "Submit"}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
