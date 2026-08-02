"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Upload } from "lucide-react";
import { ReachKeyboard } from "@/components/share/ReachKeyboard";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { toast } from "sonner";

import {
  useDeleteSpecialOfferMutation,
  useGetAllSpecialOffersQuery,
  useUpdateSpecialOfferImageMutation,
  useUpdateSpecialOfferMutation,
} from "@/redux/fetchers/special-offer/specialOffer";
export interface SpecialOffer {
  id: string;
  title: string;
  description?: string;
  image: string;
  validFrom: string;
  validUntil: string;
  createdAt?: string;
  updatedAt?: string;
  isActive?: boolean;
}
// Helper: strip HTML before preview
const stripHtml = (html: string) => html.replace(/<[^>]+>/g, "");

// ====================
// Edit Modal
// ====================
function EditOfferModal({
  item,
  onSave,
}: {
  item: SpecialOffer;
  onSave: (updatedItem: SpecialOffer) => void;
}) {
  const [updateOffer] = useUpdateSpecialOfferMutation();
  const [changeOfferImage] = useUpdateSpecialOfferImageMutation();

  const [title, setTitle] = useState(item.title);
  const [description, setDescription] = useState(item.description ?? "");
  const [isOpen, setIsOpen] = useState(false);

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleLogoChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const formData = new FormData();
      formData.append("file", e.target.files[0]);

      try {
        const updated: any = await changeOfferImage({
          id: item.id,
          data: formData,
        }).unwrap();

        toast.success(updated?.message);
        onSave(updated.data);
      } catch (err) {
        console.error("Failed to update image:", err);
        toast.error("Image update failed");
      }
    }
  };

  const handleUpdate = async () => {
    try {
      const updated: any = await updateOffer({
        id: item.id,
        data: { title, description },
      }).unwrap();

      toast.success(updated?.message);
      onSave(updated.data);
      setIsOpen(false);
    } catch (err) {
      console.error("Failed to update offer:", err);
      toast.error("Update failed");
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button size="sm" variant="outline">
          Edit
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Special Offer</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Image */}
          <div className="space-y-2">
            <Label>Offer Image</Label>
            <div className="border-2 border-dashed rounded-xl p-6 flex flex-col items-center">
              <Image
                src={item.image}
                alt={item.title}
                width={120}
                height={120}
                className="rounded-lg mb-4"
              />
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                hidden
                onChange={handleLogoChange}
              />
              <Button
                variant="outline"
                onClick={() => fileInputRef.current?.click()}
              >
                <Upload className="mr-2 h-4 w-4" />
                Change Image
              </Button>
            </div>
          </div>

          {/* Title */}
          <div className="space-y-2">
            <Label>Title</Label>
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              type="text"
              placeholder="Enter offer title"
            />
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label>Description</Label>
            <ReachKeyboard
              content={description}
              onChange={setDescription}
              placeholder="Start writing..."
            />
          </div>

          <Button className="w-full" onClick={handleUpdate}>
            Update Offer
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

// ====================
// Main Page
// ====================
export default function Page() {
  const {
    data: offersData,
    isLoading,
    error,
    refetch,
  } = useGetAllSpecialOffersQuery(undefined);

  const [deleteOffer] = useDeleteSpecialOfferMutation();
  const [items, setItems] = useState<SpecialOffer[]>([]);

  useEffect(() => {
    if (offersData?.data) {
      setItems(offersData.data);
    }
  }, [offersData]);

  const handleSave = (updatedItem: SpecialOffer) => {
    setItems((prev) =>
      prev.map((item) => (item.id === updatedItem.id ? updatedItem : item))
    );
    refetch();
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this offer?")) return;
    try {
      await deleteOffer(id).unwrap();
      setItems((prev) => prev.filter((item) => item.id !== id));
      toast.success("Offer deleted successfully");
      refetch();
    } catch (err) {
      console.error("Failed to delete offer:", err);
      toast.error("Delete failed");
    }
  };

  if (isLoading) return <div className="p-6">Loading...</div>;
  if (error) return <div className="p-6">Error loading offers</div>;

  return (
    <div className="space-y-6">
      <div className="pb-4 border-b border-slate-200">
        <h1 className="text-2xl sm:text-[28px] font-semibold tracking-tight text-slate-900">
          Special Offers
        </h1>
        <p className="text-sm text-slate-500 mt-1">Promotional product deals</p>
      </div>
      <div className="rounded-xl border border-slate-200 bg-white overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow className="bg-slate-50/60">
            <TableHead className="text-[11px] uppercase tracking-wider font-semibold text-slate-500">Image</TableHead>
            <TableHead className="text-[11px] uppercase tracking-wider font-semibold text-slate-500">Title</TableHead>
            <TableHead className="text-[11px] uppercase tracking-wider font-semibold text-slate-500">Description</TableHead>
            <TableHead className="text-[11px] uppercase tracking-wider font-semibold text-slate-500">Valid From</TableHead>
            <TableHead className="text-[11px] uppercase tracking-wider font-semibold text-slate-500">Valid Until</TableHead>
            <TableHead className="text-[11px] uppercase tracking-wider font-semibold text-slate-500">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {items.map((item) => (
            <TableRow key={item.id}>
              <TableCell>
                <Image
                  src={item.image}
                  alt={item.title}
                  width={60}
                  height={60}
                  className="rounded-lg"
                />
              </TableCell>
              <TableCell>{item.title}</TableCell>
              <TableCell>
                {stripHtml(item.description ?? "").slice(0, 50)}...
              </TableCell>
              <TableCell>{new Date(item.validFrom).toLocaleString()}</TableCell>
              <TableCell>
                {new Date(item.validUntil).toLocaleString()}
              </TableCell>
              <TableCell className="flex gap-2">
                <EditOfferModal item={item} onSave={handleSave} />
                <Button
                  size="sm"
                  variant="destructive"
                  onClick={() => handleDelete(item.id)}
                >
                  Delete
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      </div>
    </div>
  );
}
