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
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
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
import { ReachKeyboard } from "@/components/share/ReachKeyboard";
import { Skeleton } from "@/components/ui/skeleton";

import {
  useGetAllSlidersQuery,
  useDeleteSliderMutation,
  useUpdateSliderMutation,
} from "@/redux/fetchers/slider/sliderApi";
import { useGetAllProductsQuery } from "@/redux/fetchers/products/productsApi";

// Zod schema for editing
const formSchema = z.object({
  title: z.string().min(2),
  description: z.string().min(5),
  buttonText: z.string().min(1),
  productId: z.string().min(1),
});

export default function SlidersTableWithEditModal() {
  const { data, isLoading, isError } = useGetAllSlidersQuery(undefined);
  const { data: products } = useGetAllProductsQuery(undefined);
  const [deleteSlider] = useDeleteSliderMutation();
  const [updateSlider] = useUpdateSliderMutation();

  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editingSlider, setEditingSlider] = useState<any>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      description: "",
      buttonText: "",
      productId: "",
    },
  });

  const openEditModal = (slider: any) => {
    setEditingSlider(slider);
    form.reset({
      title: slider.title,
      description: slider.description,
      buttonText: slider.buttonText,
      productId: slider.product?.id || "",
    });
    setIsEditOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this slider?")) return;
    try {
      await deleteSlider(id).unwrap();
      toast.success("Slider deleted successfully");
    } catch (err: any) {
      toast.error(err?.data?.message || "Failed to delete slider");
    }
  };

  const onSubmitEdit = async (values: z.infer<typeof formSchema>) => {
    if (!editingSlider) return;
    try {
      await updateSlider({ id: editingSlider.id, data: values }).unwrap();
      toast.success("Slider updated successfully");
      setIsEditOpen(false);
    } catch (err: any) {
      toast.error(err?.data?.message || "Failed to update slider");
    }
  };

  if (isError)
    return (
      <p className="text-center my-10 text-red-500">Failed to load sliders.</p>
    );

  return (
    <div className="space-y-6">
      <div className="pb-4 border-b border-slate-200">
        <h1 className="text-2xl sm:text-[28px] font-semibold tracking-tight text-slate-900">
          Banners
        </h1>
        <p className="text-sm text-slate-500 mt-1">Homepage banners</p>
      </div>
      <div className="rounded-xl border border-slate-200 bg-white overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow className="bg-slate-50/60">
            <TableHead className="text-[11px] uppercase tracking-wider font-semibold text-slate-500">Title</TableHead>
            <TableHead className="text-[11px] uppercase tracking-wider font-semibold text-slate-500">Description</TableHead>
            <TableHead className="text-[11px] uppercase tracking-wider font-semibold text-slate-500">Button Text</TableHead>
            <TableHead className="text-[11px] uppercase tracking-wider font-semibold text-slate-500">Product</TableHead>
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
                    <Skeleton className="h-4 w-48" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-4 w-20" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-4 w-28" />
                  </TableCell>
                  <TableCell className="text-right space-x-2">
                    <Skeleton className="h-8 w-16 inline-block" />
                    <Skeleton className="h-8 w-16 inline-block" />
                  </TableCell>
                </TableRow>
              ))
            : data?.data?.map((slider: any) => (
                <TableRow key={slider.id}>
                  <TableCell>{slider.title}</TableCell>
                  <TableCell className="truncate max-w-[250px]">
                    {slider.description}
                  </TableCell>
                  <TableCell>
                    <Badge variant="secondary">{slider.buttonText}</Badge>
                  </TableCell>
                  <TableCell>{slider.product?.name || "-"}</TableCell>
                  <TableCell className="text-right space-x-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => openEditModal(slider)}
                    >
                      Edit
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => handleDelete(slider.id)}
                    >
                      Delete
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
        </TableBody>
      </Table>
      </div>

      {/* Edit Modal */}
      <Dialog open={isEditOpen} onOpenChange={() => setIsEditOpen(false)}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Edit Slider</DialogTitle>
            <DialogDescription>
              Update the slider and save changes.
            </DialogDescription>
          </DialogHeader>

          <Form {...form}>
            <form
              id="edit-slider-form"
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
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <ReachKeyboard
                        content={field.value}
                        onChange={(val) => field.onChange(val)}
                        className="min-h-[200px]"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="buttonText"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Button Text</FormLabel>
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
                    <Select onValueChange={field.onChange} value={field.value}>
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
            </form>
          </Form>

          <DialogFooter className="flex justify-end space-x-2 mt-4">
            <Button variant="outline" onClick={() => setIsEditOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" form="edit-slider-form">
              Save
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
