"use client";

import React, { useState } from "react";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Skeleton } from "@/components/ui/skeleton";

import {
  useGetAllAdvertisementQuery,
  useDeleteAdvertisementMutation,
  useUpdateAdvertisementMutation,
} from "@/redux/fetchers/advertisement/advertisementAPi";
import { useGetAllProductsQuery } from "@/redux/fetchers/products/productsApi";

const ACTION_OPTIONS = ["Fetchers", "NewProduct"] as const;

const formSchema = z.object({
  title: z.string().min(2),
  productId: z.string().min(1),
  action: z.enum(ACTION_OPTIONS),
  active: z.boolean(),
});

type AdvertisementFormValues = z.infer<typeof formSchema>;

export default function AdvertisementsTableWithEditModal() {
  const { data, isLoading, isError } = useGetAllAdvertisementQuery(undefined);
  const { data: products } = useGetAllProductsQuery(undefined);
  const [deleteAdvertisement] = useDeleteAdvertisementMutation();
  const [updateAdvertisement] = useUpdateAdvertisementMutation();

  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editingAd, setEditingAd] = useState<any>(null);

  const form = useForm<AdvertisementFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      productId: "",
      action: "Fetchers",
      active: false,
    },
  });

  const openEditModal = (ad: any) => {
    setEditingAd(ad);
    form.reset({
      title: ad.title,
      productId: ad.product?.id || "",
      action: ad.action,
      active: ad.active,
    });
    setIsEditOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this advertisement?"))
      return;
    try {
      await deleteAdvertisement(id).unwrap();
      toast.success("Advertisement deleted successfully");
    } catch (err: any) {
      toast.error(err?.data?.message || "Failed to delete advertisement");
    }
  };

  const onSubmitEdit = async (values: AdvertisementFormValues) => {
    if (!editingAd) return;
    try {
      await updateAdvertisement({
        id: editingAd.id,
        data: values,
      }).unwrap();
      toast.success("Advertisement updated successfully");
      setIsEditOpen(false);
    } catch (err: any) {
      toast.error(err?.data?.message || "Failed to update advertisement");
    }
  };

  if (isError)
    return (
      <p className="text-center my-10 text-red-500">
        Failed to load advertisements.
      </p>
    );

  return (
    <div className="space-y-6">
      <div className="pb-4 border-b border-slate-200">
        <h1 className="text-2xl sm:text-[28px] font-semibold tracking-tight text-slate-900">
          Advertisements
        </h1>
        <p className="text-sm text-slate-500 mt-1">Product ad placements</p>
      </div>
      <div className="rounded-xl border border-slate-200 bg-white overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow className="bg-slate-50/60">
            <TableHead className="text-[11px] uppercase tracking-wider font-semibold text-slate-500">Title</TableHead>
            <TableHead className="text-[11px] uppercase tracking-wider font-semibold text-slate-500">Product</TableHead>
            <TableHead className="text-[11px] uppercase tracking-wider font-semibold text-slate-500">Action</TableHead>
            <TableHead className="text-[11px] uppercase tracking-wider font-semibold text-slate-500">Active</TableHead>
            <TableHead className="text-[11px] uppercase tracking-wider font-semibold text-slate-500 text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoading
            ? Array.from({ length: 5 }).map((_, idx) => (
                <TableRow key={idx}>
                  <TableCell>
                    <Skeleton className="h-4 w-24" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-4 w-32" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-4 w-20" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-4 w-12" />
                  </TableCell>
                  <TableCell className="text-right space-x-2">
                    <Skeleton className="h-8 w-16 inline-block" />
                    <Skeleton className="h-8 w-16 inline-block" />
                  </TableCell>
                </TableRow>
              ))
            : data?.data?.map((ad: any) => (
                <TableRow key={ad.id}>
                  <TableCell>{ad.title}</TableCell>
                  <TableCell>{ad.product?.name || "-"}</TableCell>
                  <TableCell>
                    <Badge variant="secondary">{ad.action}</Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant={ad.active ? "default" : "outline"}>
                      {ad.active ? "Yes" : "No"}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right space-x-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => openEditModal(ad)}
                    >
                      Edit
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => handleDelete(ad.id)}
                    >
                      Delete
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
        </TableBody>
      </Table>
      </div>

      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Edit Advertisement</DialogTitle>
            <DialogDescription>
              Update the advertisement and save changes.
            </DialogDescription>
          </DialogHeader>

          <Form {...form}>
            <form
              id="edit-advertisement-form"
              onSubmit={form.handleSubmit(onSubmitEdit)}
              className="space-y-4 mt-2"
            >
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Title</FormLabel>
                    <FormControl>
                      <Input {...field} />
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
                    <FormLabel>Product</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      value={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
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
                        <SelectTrigger>
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
            </form>
          </Form>

          <DialogFooter className="flex justify-end space-x-2 mt-4">
            <Button variant="outline" onClick={() => setIsEditOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" form="edit-advertisement-form">
              Save
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
