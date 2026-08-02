"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Plus, Edit, Trash2 } from "lucide-react";
import Link from "next/link";
import {
  useDeleteBrandMutation,
  useGetAllBrandQuery,
} from "@/redux/fetchers/brand/brandApi";
import { toast } from "sonner";
import Image from "next/image";

export default function BrandsPage() {
  const { isLoading, isError, data } = useGetAllBrandQuery(undefined);
  const [removeBrand] = useDeleteBrandMutation();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading brands...</p>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-red-500">Failed to load brands</p>
      </div>
    );
  }

  const brands = data?.data || [];

  const handleDelete = async (id: string) => {
    try {
      const res = await removeBrand(id).unwrap();
      if (res?.success) {
        // toast.success(res?.message);
      }
    } catch (error: any) {
      toast.error(error?.data?.message || "Something went wrong!");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between pb-4 sm:pb-5 border-b border-slate-200">
        <div>
          <h1 className="text-2xl sm:text-[28px] font-semibold tracking-tight text-slate-900">
            Brands
          </h1>
          <p className="text-sm text-slate-500 mt-1">Manage product brands</p>
        </div>
        <Link href="/dashboard/add-brand">
          <Button size="sm" className="bg-[#2563EB] hover:bg-[#1D4ED8]">
            <Plus className="h-4 w-4 mr-2" />
            Add Brand
          </Button>
        </Link>
      </div>

      <div className="rounded-xl border border-slate-200 bg-white overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-slate-50/60">
                    <TableHead className="text-[11px] uppercase tracking-wider font-semibold text-slate-500">Logo</TableHead>
                    <TableHead className="text-[11px] uppercase tracking-wider font-semibold text-slate-500">Name</TableHead>
                    <TableHead className="text-[11px] uppercase tracking-wider font-semibold text-slate-500">Description</TableHead>
                    <TableHead className="text-[11px] uppercase tracking-wider font-semibold text-slate-500">Created</TableHead>
                    <TableHead className="text-[11px] uppercase tracking-wider font-semibold text-slate-500 text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {brands.map((brand: any) => (
                    <TableRow key={brand.id}>
                      <TableCell>
                        {brand.logo ? (
                          <Image
                            src={brand.logo}
                            alt={brand.name}
                            width={40}
                            height={40}
                            className="h-10 w-10 object-contain rounded-lg"
                          />
                        ) : (
                          <span className="text-muted-foreground">-</span>
                        )}
                      </TableCell>
                      <TableCell className="font-medium">
                        {brand.name}
                      </TableCell>
                      <TableCell>
                        <div className="max-w-[300px]">
                          {brand.description ? (
                            <p className="text-sm text-muted-foreground line-clamp-2">
                              {brand.description.replace(/<[^>]*>/g, "")}
                            </p>
                          ) : (
                            <span className="text-muted-foreground text-sm">
                              No description
                            </span>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {new Date(brand.createdAt).toLocaleDateString()}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Link href={`/dashboard/brand/${brand.id}`}>
                            <Button variant="outline" size="sm">
                              <Edit className="h-4 w-4" />
                            </Button>
                          </Link>
                          <Button
                            onClick={() => handleDelete(brand.id)}
                            variant="outline"
                            size="sm"
                            className="text-destructive hover:text-destructive"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
      </div>
    </div>
  );
}
