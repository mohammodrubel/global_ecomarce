import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Product } from "@/lib/Types";
import { ImageUpload } from "@/components/ProductUploadForm";
import { useUpdateProductImagesMutation } from "@/redux/fetchers/products/productsApi";
import { toast } from "sonner";
import { Loader2, Trash2, X } from "lucide-react";

const MAX_IMAGES = 3;

export type ImageDialogMode = "edit" | "replace" | "remove";

interface ChangeProductImageDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  selectedProduct: Product | null;
  mode?: ImageDialogMode;
}

const MODE_TEXT: Record<ImageDialogMode, { title: string; description: string }> =
  {
    edit: {
      title: "Edit Product Images",
      description:
        "Add new images or click ❌ to remove existing ones. Max 3 images.",
    },
    replace: {
      title: "Replace Product Images",
      description:
        "Upload a new set of images. This replaces ALL current images. Max 3 images.",
    },
    remove: {
      title: "Remove Product Images",
      description: "Click ❌ on the images you want to delete.",
    },
  };

export default function ChangeProductImageDialog({
  isOpen,
  onOpenChange,
  selectedProduct,
  mode = "edit",
}: ChangeProductImageDialogProps) {
  const [newImages, setNewImages] = useState<File[]>([]);
  const [removeImages, setRemoveImages] = useState<string[]>([]);
  const [updateProductImages, { isLoading }] =
    useUpdateProductImagesMutation();

  // Reset local state whenever the dialog (re)opens
  useEffect(() => {
    if (isOpen) {
      setNewImages([]);
      setRemoveImages([]);
    }
  }, [isOpen, selectedProduct?.id]);

  const existingImages = selectedProduct?.images ?? [];

  // Remaining existing images after the ones marked for removal
  const remainingCount = existingImages.length - removeImages.length;
  const availableSlots =
    mode === "replace" ? MAX_IMAGES : Math.max(0, MAX_IMAGES - remainingCount);

  const toggleRemoveImage = (img: string) => {
    setRemoveImages((prev) =>
      prev.includes(img) ? prev.filter((i) => i !== img) : [...prev, img]
    );
  };

  const validate = (): string | null => {
    if (!selectedProduct) return "No product selected";

    if (mode === "replace") {
      if (newImages.length === 0) return "Upload at least one new image";
      if (newImages.length > MAX_IMAGES)
        return `You can upload at most ${MAX_IMAGES} images`;
      return null;
    }

    if (mode === "remove") {
      if (removeImages.length === 0) return "Select at least one image to remove";
      if (remainingCount < 1) return "A product must keep at least one image";
      return null;
    }

    // edit mode
    if (newImages.length === 0 && removeImages.length === 0)
      return "No changes made";
    if (newImages.length > availableSlots)
      return `You can upload only ${availableSlots} more image(s)`;
    if (remainingCount + newImages.length < 1)
      return "A product must keep at least one image";
    return null;
  };

  const handleSave = async () => {
    const error = validate();
    if (error) {
      toast.error(error);
      return;
    }
    if (!selectedProduct) return;

    try {
      const formData = new FormData();
      formData.append(
        "data",
        JSON.stringify({
          mode,
          removeImages: mode === "replace" ? [] : removeImages,
        })
      );
      newImages.forEach((file) => formData.append("files", file));

      const res = await updateProductImages({
        id: selectedProduct.id,
        data: formData,
      }).unwrap();

      if (res?.success) {
        toast.success(res.message || "Product images updated successfully");
        onOpenChange(false);
      } else {
        toast.error(res?.message || "Failed to update images");
      }
    } catch (err: any) {
      toast.error(err?.data?.message || "Failed to update images");
    }
  };

  const { title, description } = MODE_TEXT[mode];

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>

        {/* Existing images */}
        {existingImages.length > 0 && (
          <div>
            <p className="text-sm font-medium mb-1">
              Current images ({existingImages.length})
            </p>
            {mode !== "replace" && (
              <p className="text-xs text-muted-foreground mb-2">
                Click an image to mark it for removal, then Save Changes.
              </p>
            )}
            <div className="flex gap-3 flex-wrap">
              {existingImages.map((img, index) => {
                const marked = removeImages.includes(img);
                const removable = mode !== "replace";

                // The whole tile is clickable in remove/edit modes — clicking
                // anywhere on the image toggles it for removal (the tiny corner
                // icon alone was easy to miss).
                return (
                  <button
                    type="button"
                    key={index}
                    onClick={
                      removable ? () => toggleRemoveImage(img) : undefined
                    }
                    disabled={!removable}
                    aria-pressed={marked}
                    aria-label={
                      marked
                        ? "Marked for removal — click to keep"
                        : "Click to mark for removal"
                    }
                    className={`relative w-24 h-24 rounded overflow-hidden border transition ${
                      removable
                        ? "cursor-pointer hover:ring-2 hover:ring-primary/50"
                        : "cursor-default"
                    } ${marked ? "ring-2 ring-destructive" : ""}`}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={img}
                      alt={`Product image ${index + 1}`}
                      className={`w-full h-full object-cover ${
                        marked ? "opacity-40" : ""
                      }`}
                    />

                    {removable && (
                      <span
                        className={`absolute top-1 right-1 rounded-full p-1 ${
                          marked ? "bg-destructive" : "bg-black/70"
                        }`}
                      >
                        {marked ? (
                          <Trash2 size={14} className="text-white" />
                        ) : (
                          <X size={14} className="text-white" />
                        )}
                      </span>
                    )}

                    {marked && (
                      <span className="absolute inset-x-0 bottom-0 bg-destructive/90 text-white text-[10px] py-0.5 text-center">
                        Will be removed
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Upload new images (not for pure "remove" mode) */}
        {mode !== "remove" && (
          <div>
            <p className="text-sm font-medium mb-2">
              {mode === "replace" ? "New images" : "Add new images"}
            </p>
            {availableSlots > 0 ? (
              <ImageUpload
                images={newImages}
                onImagesChange={setNewImages}
                maxImages={availableSlots}
              />
            ) : (
              <p className="text-sm text-muted-foreground">
                Maximum {MAX_IMAGES} images reached. Remove an image to add a new
                one.
              </p>
            )}
          </div>
        )}

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isLoading}
          >
            Cancel
          </Button>

          <Button onClick={handleSave} disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Updating...
              </>
            ) : (
              "Save Changes"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
