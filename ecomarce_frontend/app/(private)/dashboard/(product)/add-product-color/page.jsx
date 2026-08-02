"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import {
  Plus,
  Edit,
  Trash2,
  Search,
  Palette,
  CheckCircle,
  XCircle,
} from "lucide-react";

import {
  useAddNewProductColorMutation,
  useGetAllProductColorQuery,
  useUpdateProductColorMutation,
  useDeleteProductColorMutation,
} from "../../../../../redux/fetchers/productColorApi/productColorApi";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

function Page() {
  const [color, setColor] = useState("");
  const [editColor, setEditColor] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  const [addNewProduct, { isLoading }] = useAddNewProductColorMutation();
  const [updateColor, { isLoading: isUpdating }] =
    useUpdateProductColorMutation();
  const [deleteColor] = useDeleteProductColorMutation();
  const { data, isLoading: isDataLoading } = useGetAllProductColorQuery();

  // Filter colors based on search
  const filteredColors =
    data?.data?.filter((item) =>
      item.name.toLowerCase().includes(searchTerm.toLowerCase())
    ) || [];

  // Add new color
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!color.trim()) {
      toast.error("Please enter a color name");
      return;
    }

    try {
      const mainName = { name: color.trim() };
      const res = await addNewProduct(mainName);
      if (res?.data?.success) {
        toast.success(res?.data?.message);
        setColor("");
      }
    } catch (error) {
      toast.error(error?.data?.message || "Failed to add color");
    }
  };

  // Delete color
  const handleDelete = async (id) => {
    try {
      const res = await deleteColor(id);
      if (res?.data?.success) {
        toast.success(res?.data?.message);
        setDeleteModalOpen(false);
      }
    } catch (error) {
      toast.error(error?.data?.message || "Failed to delete color");
    }
  };

  // Open modal for editing
  const openEditModal = (id, name) => {
    setEditingId(id);
    setEditColor(name);
    setIsModalOpen(true);
  };

  // Open delete confirmation modal
  const openDeleteModal = (id) => {
    setDeleteId(id);
    setDeleteModalOpen(true);
  };

  // Update color
  const handleUpdate = async () => {
    if (!editColor.trim()) {
      toast.error("Please enter a color name");
      return;
    }

    try {
      const res = await updateColor({ id: editingId, name: editColor.trim() });
      if (res?.data?.success) {
        toast.success(res?.data?.message);
        setIsModalOpen(false);
        setEditingId(null);
        setEditColor("");
      }
    } catch (error) {
      toast.error(error?.data?.message || "Failed to update color");
    }
  };

  return (
    <div className="max-w-5xl mx-auto w-full space-y-6">
      <div className="pb-4 border-b border-slate-200">
        <h1 className="text-2xl sm:text-[28px] font-semibold tracking-tight text-slate-900">
          Product Colors
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          Manage available product color options
        </p>
      </div>
        <Card className="border-slate-200 shadow-none rounded-xl">
          <CardHeader className="pb-4">
            <CardTitle className="text-[15px] font-semibold flex items-center gap-2">
              <Palette className="h-4 w-4 text-[#2563EB]" />
              Colors
            </CardTitle>
          </CardHeader>
        </Card>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Add Color Section */}
          <Card className="lg:col-span-1 shadow-lg border-0">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Plus className="h-5 w-5" />
                Add New Color
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">
                    Color Name
                  </label>
                  <Input
                    value={color}
                    onChange={(e) => setColor(e.target.value)}
                    placeholder="e.g., Midnight Blue"
                    className="w-full"
                  />
                </div>
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-[#1C398E] hover:bg-[#152B6E]"
                >
                  {isLoading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                      Adding...
                    </>
                  ) : (
                    <>
                      <Plus className="h-4 w-4 mr-2" />
                      Add Color
                    </>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Colors List Section */}
          <Card className="lg:col-span-2 shadow-lg border-0">
            <CardHeader>
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <CardTitle className="flex items-center gap-2">
                  <Palette className="h-5 w-5" />
                  Available Colors
                  <Badge variant="secondary" className="ml-2">
                    {filteredColors.length} colors
                  </Badge>
                </CardTitle>
                <div className="relative w-full sm:w-64">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Search colors..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {isDataLoading ? (
                <div className="flex justify-center items-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#1C398E]"></div>
                </div>
              ) : filteredColors.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <Palette className="h-12 w-12 mx-auto text-gray-300 mb-4" />
                  <p>No colors found</p>
                  {searchTerm && (
                    <p className="text-sm mt-2">
                      Try adjusting your search terms
                    </p>
                  )}
                </div>
              ) : (
                <div className="grid gap-3">
                  {filteredColors.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center justify-between p-4 bg-white rounded-lg border border-gray-200 hover:shadow-md transition-shadow"
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className="w-6 h-6 rounded-full border border-gray-300"
                          style={{ backgroundColor: item.name.toLowerCase() }}
                        />
                        <span className="font-medium text-gray-800">
                          {item.name}
                        </span>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => openEditModal(item.id, item.name)}
                          className="h-9 px-3"
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => openDeleteModal(item.id)}
                          className="h-9 px-3"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Edit Color Modal */}
        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Edit className="h-5 w-5" />
                Edit Color
              </DialogTitle>
              <DialogDescription>
                Update the color name below. Click save when you're done.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">
                  Color Name
                </label>
                <Input
                  value={editColor}
                  onChange={(e) => setEditColor(e.target.value)}
                  placeholder="Enter color name"
                  className="w-full"
                />
              </div>
            </div>
            <DialogFooter className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => setIsModalOpen(false)}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                onClick={handleUpdate}
                disabled={isUpdating}
                className="flex-1 bg-[#1C398E] hover:bg-[#152B6E]"
              >
                {isUpdating ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                    Updating...
                  </>
                ) : (
                  <>
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Update Color
                  </>
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Delete Confirmation Modal */}
        <Dialog open={deleteModalOpen} onOpenChange={setDeleteModalOpen}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2 text-red-600">
                <Trash2 className="h-5 w-5" />
                Delete Color
              </DialogTitle>
              <DialogDescription>
                Are you sure you want to delete this color? This action cannot
                be undone.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => setDeleteModalOpen(false)}
                className="flex-1"
              >
                <XCircle className="h-4 w-4 mr-2" />
                Cancel
              </Button>
              <Button
                variant="destructive"
                onClick={() => handleDelete(deleteId)}
                className="flex-1"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Delete
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
    </div>
  );
}

export default Page;
