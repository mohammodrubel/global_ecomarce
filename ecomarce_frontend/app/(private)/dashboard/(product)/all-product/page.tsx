"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Image from "next/image";
import {
  MoreHorizontal,
  Trash,
  Eye,
  Plus,
  Pencil,
  Images,
  Replace,
  ImageMinus,
  Search,
  TrendingUp,
} from "lucide-react";
import {
  useDeleteProductMutation,
  useGetAllProductsQuery,
} from "@/redux/fetchers/products/productsApi";
import { useGetAllOrdersQuery } from "@/redux/fetchers/order/orderApi";
import { Product } from "@/lib/Types";
import Link from "next/link";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@radix-ui/react-tooltip";
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";
import ChangeProductImageDialog, {
  ImageDialogMode,
} from "../../_components/ChangeProductImageDialog";
import { Pagination } from "@/components/Pagination";

export default function ProductTable() {
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [isChangeImageDialogOpen, setIsChangeImageDialogOpen] = useState(false);
  const [viewingProduct, setViewingProduct] = useState<Product | null>(null);
  const [selectedProductForImageChange, setSelectedProductForImageChange] =
    useState<Product | null>(null);
  const [imageDialogMode, setImageDialogMode] =
    useState<ImageDialogMode>("edit");
  const [search, setSearch] = useState("");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [page, setPage] = useState(1);
  const [limit] = useState(10);

  const queryParams = useMemo(() => {
    const params: { name: string; value: string }[] = [
      { name: "limit", value: limit.toString() },
      { name: "page", value: page.toString() },
    ];
    if (search) params.push({ name: "searchTerm", value: search });
    return params;
  }, [search, page, limit]);

  const { isLoading, isError, data } = useGetAllProductsQuery(queryParams);
  const { data: ordersRes } = useGetAllOrdersQuery(undefined);

  const [deleteProduct] = useDeleteProductMutation();

  // Aggregate sales counts per productId from all orders (exclude cancelled)
  const salesMap = useMemo(() => {
    const map: Record<string, number> = {};
    const orders = ordersRes?.data || [];
    for (const o of orders) {
      if (o.status === "CANCELLED") continue;
      for (const it of o.items || []) {
        map[it.productId] = (map[it.productId] || 0) + it.quantity;
      }
    }
    return map;
  }, [ordersRes]);

  const pageProducts: Product[] = data?.data || [];
  const meta = data?.meta || { page: 1, limit, total: 0 };
  const totalPages = Math.max(1, Math.ceil(meta.total / meta.limit));

  const displayedProducts = useMemo(() => {
    return pageProducts.filter((p) => {
      if (dateFrom && new Date(p.createdAt) < new Date(dateFrom)) return false;
      if (dateTo) {
        const end = new Date(dateTo);
        end.setHours(23, 59, 59, 999);
        if (new Date(p.createdAt) > end) return false;
      }
      return true;
    });
  }, [pageProducts, dateFrom, dateTo]);

  useEffect(() => {
    setPage(1);
  }, [search]);

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleView = (product: Product) => {
    setViewingProduct(product);
    // Defer opening so the (closing) dropdown layer and the (opening) dialog
    // layer never overlap — overlap can strand `pointer-events: none` on
    // <body>, leaving the dialog visible but its buttons unclickable.
    setTimeout(() => setIsViewDialogOpen(true), 0);
  };

  const handleDelete = async (productId: string) => {
    try {
      await deleteProduct(productId).unwrap();
      toast.success("Product deleted successfully");
    } catch (error) {
      toast.error("Failed to delete product");
    }
  };

  // Open the image dialog in a specific mode (edit / replace / remove)
  const openImageDialog = (product: Product, mode: ImageDialogMode) => {
    setSelectedProductForImageChange(product);
    setImageDialogMode(mode);
    // Defer opening until the dropdown has fully closed (see handleView).
    setTimeout(() => setIsChangeImageDialogOpen(true), 0);
  };

  // Skeleton loading state
  if (isLoading) return <ProductTableSkeleton />;
  if (isError) return <div>Error loading products</div>;

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between pb-4 sm:pb-5 border-b border-slate-200">
        <div>
          <h1 className="text-2xl sm:text-[28px] font-semibold tracking-tight text-slate-900">
            Products
          </h1>
          <p className="text-sm text-slate-500 mt-1">Manage your product catalog</p>
        </div>
        <Link href="/dashboard/add-product">
          <Button size="sm" className="bg-[#2563EB] hover:bg-[#1D4ED8]">
            <Plus className="h-4 w-4 mr-2" />
            Add Product
          </Button>
        </Link>
      </div>

      {/* Filters */}
      <div className="grid gap-3 sm:grid-cols-[1fr_auto_auto]">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name, SKU, category, brand..."
            className="pl-9 h-10 border-slate-200"
          />
        </div>
        <Input
          type="date"
          value={dateFrom}
          onChange={(e) => setDateFrom(e.target.value)}
          className="h-10 border-slate-200 sm:w-[160px]"
          aria-label="Created from"
        />
        <Input
          type="date"
          value={dateTo}
          onChange={(e) => setDateTo(e.target.value)}
          className="h-10 border-slate-200 sm:w-[160px]"
          aria-label="Created to"
        />
      </div>

      <div className="rounded-xl border border-slate-200 bg-white overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="bg-slate-50/60">
              <TableHead className="text-[11px] uppercase tracking-wider font-semibold text-slate-500">Image</TableHead>
              <TableHead className="text-[11px] uppercase tracking-wider font-semibold text-slate-500">Name</TableHead>
              <TableHead className="text-[11px] uppercase tracking-wider font-semibold text-slate-500">Category</TableHead>
              <TableHead className="text-[11px] uppercase tracking-wider font-semibold text-slate-500">Price</TableHead>
              <TableHead className="text-[11px] uppercase tracking-wider font-semibold text-slate-500">Stock</TableHead>
              <TableHead className="text-[11px] uppercase tracking-wider font-semibold text-slate-500">Sales</TableHead>
              <TableHead className="text-[11px] uppercase tracking-wider font-semibold text-slate-500">Created</TableHead>
              <TableHead className="text-[11px] uppercase tracking-wider font-semibold text-slate-500">Badge</TableHead>
              <TableHead className="text-[11px] uppercase tracking-wider font-semibold text-slate-500 text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {displayedProducts.length === 0 && (
              <TableRow>
                <TableCell colSpan={9} className="text-center py-10 text-sm text-slate-500">
                  No products match the current filters.
                </TableCell>
              </TableRow>
            )}
            {displayedProducts.map((product: Product) => (
              <TableRow key={product.id}>
                <TableCell>
                  <div className="relative group">
                    <Image
                      src={product.images[0] || "/placeholder-image.jpg"}
                      alt={product.name}
                      width={50}
                      height={50}
                      className="rounded-md object-cover"
                    />
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-md flex items-center justify-center">
                      <span className="text-white text-xs font-medium">
                        {product.images.length}{" "}
                        {product.images.length === 1 ? "image" : "images"}
                      </span>
                    </div>
                  </div>
                </TableCell>
                <TableCell className="font-semibold">
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <span className="cursor-help">
                        {product?.name?.slice(0, 30)}
                        {product?.name?.length > 30 && "..."}
                      </span>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="max-w-xs">{product?.name}</p>
                    </TooltipContent>
                  </Tooltip>
                </TableCell>
                <TableCell>
                  <p className="text-sm text-slate-900">
                    {product?.category?.name}
                  </p>
                  <p className="text-[11px] text-slate-500">
                    {product.subcategory}
                  </p>
                </TableCell>
                <TableCell>
                  <p className="text-sm font-semibold text-slate-900">
                    ৳{product.price}
                  </p>
                  {product.originalPrice > product.price && (
                    <p className="text-[11px] text-slate-400 line-through">
                      ৳{product.originalPrice}
                    </p>
                  )}
                </TableCell>
                <TableCell>
                  {product.inStock && product.stock > 0 ? (
                    <Badge
                      variant="outline"
                      className="bg-emerald-50 text-emerald-700 border-emerald-200 font-medium"
                    >
                      {product.stock}
                    </Badge>
                  ) : (
                    <Badge className="bg-red-50 text-red-700 border-red-200 font-medium">
                      Out
                    </Badge>
                  )}
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-1 text-sm font-medium text-slate-900">
                    <TrendingUp className="h-3.5 w-3.5 text-emerald-600" />
                    {salesMap[product.id] || 0}
                  </div>
                </TableCell>
                <TableCell className="text-xs text-slate-600">
                  {new Date(product.createdAt).toLocaleDateString()}
                </TableCell>
                <TableCell>
                  {product.badge && (
                    <Badge className="bg-slate-100 text-slate-700 border-0 font-medium">
                      {product.badge}
                    </Badge>
                  )}
                </TableCell>
                <TableCell className="text-right">
                  {/* modal={false} prevents Radix from locking
                      document.body with `pointer-events: none`. In modal mode
                      that lock can stay stuck on <body> when a menu item
                      navigates (Edit) or opens a Dialog (View / images) while
                      the menu closes, freezing all clicks until a refresh. */}
                  <DropdownMenu modal={false}>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => handleView(product)}>
                        <Eye className="h-4 w-4 mr-2" /> View
                      </DropdownMenuItem>

                      <DropdownMenuItem asChild>
                        <Link href={`/dashboard/edit-product/${product.id}`}>
                          <Pencil className="h-4 w-4 mr-2" /> Edit
                        </Link>
                      </DropdownMenuItem>

                      <DropdownMenuSeparator />
                      <DropdownMenuLabel className="text-xs text-muted-foreground">
                        Images
                      </DropdownMenuLabel>

                      <DropdownMenuItem
                        onClick={() => openImageDialog(product, "edit")}
                      >
                        <Images className="h-4 w-4 mr-2" /> Edit Product Image
                      </DropdownMenuItem>

                      <DropdownMenuItem
                        onClick={() => openImageDialog(product, "replace")}
                      >
                        <Replace className="h-4 w-4 mr-2" /> Replace Image
                      </DropdownMenuItem>

                      <DropdownMenuItem
                        onClick={() => openImageDialog(product, "remove")}
                      >
                        <ImageMinus className="h-4 w-4 mr-2" /> Remove Image
                      </DropdownMenuItem>

                      <DropdownMenuSeparator />

                      <DropdownMenuItem
                        onClick={() => handleDelete(product.id)}
                        className="text-red-600"
                      >
                        <Trash className="h-4 w-4 mr-2" /> Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {totalPages > 1 && (
        <Pagination
          currentPage={page}
          totalPages={totalPages}
          onPageChange={handlePageChange}
          limit={meta.limit}
          total={meta.total}
        />
      )}

      {/* View Product Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Product Details</DialogTitle>
            <DialogDescription>
              Viewing details for {viewingProduct?.name}
            </DialogDescription>
          </DialogHeader>

          {viewingProduct && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold mb-2">
                  Images ({viewingProduct.images.length})
                </h3>
                <div className="grid grid-cols-3 gap-2">
                  {viewingProduct.images.map((image, index) => (
                    <div key={index} className="relative">
                      <Image
                        src={image}
                        alt={`${viewingProduct.name} ${index + 1}`}
                        width={100}
                        height={100}
                        className="rounded-md object-cover"
                      />
                      <span className="absolute top-1 left-1 bg-black/70 text-white text-xs px-1 rounded">
                        {index + 1}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <Label>Name</Label>
                  <p className="font-semibold">{viewingProduct.name}</p>
                </div>

                <div>
                  <Label>Description</Label>
                  <div
                    dangerouslySetInnerHTML={{
                      __html: viewingProduct.description,
                    }}
                    className="prose prose-sm max-w-none mt-1"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Price</Label>
                    <p>${viewingProduct.price}</p>
                  </div>
                  <div>
                    <Label>Original Price</Label>
                    <p>${viewingProduct.originalPrice}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Stock</Label>
                    <p>{viewingProduct.stock}</p>
                  </div>
                  <div>
                    <Label>Status</Label>
                    <p>
                      {viewingProduct.inStock ? "In Stock" : "Out of Stock"}
                    </p>
                  </div>
                </div>

                <div>
                  <Label>SKU</Label>
                  <p>{viewingProduct.sku}</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Discount Type</Label>
                    <p>{viewingProduct.discountType}</p>
                  </div>
                  <div>
                    <Label>Discount Value</Label>
                    <p>{viewingProduct.discountValue}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Category</Label>
                    <p>{viewingProduct.category?.name}</p>
                  </div>
                  <div>
                    <Label>Brand</Label>
                    <p>{viewingProduct.brand?.name}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Rating</Label>
                    <p>
                      {viewingProduct.rating} ⭐ ({viewingProduct.reviewsCount}{" "}
                      reviews)
                    </p>
                  </div>
                  <div>
                    <Label>Badge</Label>
                    <p>{viewingProduct.badge || "None"}</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Change Images Dialog */}
      <ChangeProductImageDialog
        isOpen={isChangeImageDialogOpen}
        onOpenChange={setIsChangeImageDialogOpen}
        selectedProduct={selectedProductForImageChange}
        mode={imageDialogMode}
      />
    </div>
  );
}

// Skeleton component for loading state
function ProductTableSkeleton() {
  return (
    <div className="container mx-auto">
      <div className="flex justify-between items-center mb-4">
        <Skeleton className="h-8 w-32" />
        <Skeleton className="h-10 w-32" />
      </div>

      <div className="rounded-xl border bg-card p-4">
        <div className="space-y-3">
          {/* Table Header Skeleton */}
          <div className="grid grid-cols-9 gap-4">
            {[...Array(9)].map((_, i) => (
              <Skeleton key={i} className="h-6" />
            ))}
          </div>

          {/* Table Rows Skeleton */}
          {[...Array(5)].map((_, rowIndex) => (
            <div key={rowIndex} className="grid grid-cols-9 gap-4 items-center">
              {[...Array(9)].map((_, colIndex) => (
                <Skeleton key={colIndex} className="h-12" />
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
