"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
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
import { useDeleteCategoryMutation, useGetAllCategoryQuery } from "@/redux/fetchers/categoryApi/categoryApi";
import { toast } from "sonner";


export default function CategoriesPage() {
  const { isLoading, isError, data } = useGetAllCategoryQuery(undefined);
  const [removeCategory] = useDeleteCategoryMutation()

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading categories...</p>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-red-500">Failed to load categories</p>
      </div>
    );
  }

  const categories = data?.data || []; 
 
  const handleDelete = async(id:string)=>{
    try{
      const res = await removeCategory(id).unwrap()
      if(res?.success){
        toast.success(res?.message)
      }
    }catch(error:any){
      toast.error(error?.data?.message || "somthing went wrong!")
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between pb-4 sm:pb-5 border-b border-slate-200">
        <div>
          <h1 className="text-2xl sm:text-[28px] font-semibold tracking-tight text-slate-900">
            Categories
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Organize your products into categories
          </p>
        </div>
        <Link href="/dashboard/add-categories">
          <Button size="sm" className="bg-[#2563EB] hover:bg-[#1D4ED8]">
            <Plus className="h-4 w-4 mr-2" />
            Add Category
          </Button>
        </Link>
      </div>

      <div className="rounded-xl border border-slate-200 bg-white overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-slate-50/60">
                    <TableHead className="text-[11px] uppercase tracking-wider font-semibold text-slate-500">Name</TableHead>
                    <TableHead className="text-[11px] uppercase tracking-wider font-semibold text-slate-500">Icon</TableHead>
                    <TableHead className="text-[11px] uppercase tracking-wider font-semibold text-slate-500">Subcategories</TableHead>
                    <TableHead className="text-[11px] uppercase tracking-wider font-semibold text-slate-500">Created</TableHead>
                    <TableHead className="text-[11px] uppercase tracking-wider font-semibold text-slate-500 text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {categories.map((category: any) => (
                    <TableRow key={category.id}>
                      <TableCell className="font-medium">
                        {category.name}
                      </TableCell>
                      <TableCell>
                        {category.icon ? (
                          <img
                            src={category.icon}
                            alt={category.name}
                            className="h-8 w-8 object-contain"
                          />
                        ) : (
                          <span className="text-muted-foreground">-</span>
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1">
                          {category.subcategories?.length > 0 ? (
                            category.subcategories.map(
                              (subcategory: string, index: number) => (
                                <Badge
                                  key={index}
                                  variant="outline"
                                  className="text-xs"
                                >
                                  {subcategory}
                                </Badge>
                              )
                            )
                          ) : (
                            <span className="text-muted-foreground text-sm">
                              None
                            </span>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {new Date(category.createdAt).toLocaleDateString()}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Link
                            href={`/dashboard/all-categories/${category.id}`}
                          >
                            <Button variant="outline" size="sm">
                              <Edit className="h-4 w-4" />
                            </Button>
                          </Link>
                          <Button
                            onClick={() => handleDelete(category.id)}
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
