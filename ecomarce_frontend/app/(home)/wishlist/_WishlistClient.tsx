"use client"

import Link from "next/link"
import { ArrowLeft, Heart, Trash2 } from "lucide-react"
import { useDispatch, useSelector } from "react-redux"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import ProductCard from "@/components/ProductCard"
import { RootState } from "@/redux/store"
import { clearWishlist } from "@/redux/fetchers/wishlist/wishlistSlice"

export default function WishlistPage() {
  const dispatch = useDispatch()
  const items = useSelector(
    (state: RootState) =>
      (state.wishlist?.product || []).filter((p: any) => p.wishlist)
  )

  const handleClear = () => {
    if (items.length === 0) {
      toast.warning("Wishlist already empty")
      return
    }
    dispatch(clearWishlist())
    toast.success("Wishlist cleared")
  }

  if (items.length === 0) {
    return (
      <div className="min-h-[60vh] container mx-auto px-4 py-16 flex items-center justify-center">
        <div className="text-center max-w-md">
          <div className="mx-auto mb-6 w-24 h-24 rounded-full bg-pink-50 flex items-center justify-center">
            <Heart className="h-12 w-12 text-pink-500" />
          </div>
          <h1 className="text-3xl font-bold mb-3 text-slate-900">
            Your wishlist is empty
          </h1>
          <p className="text-slate-600 mb-8">
            Tap the heart on any product to save it here.
          </p>
          <Button
            asChild
            size="lg"
            className="bg-[#1C398E] hover:bg-[#1C398E]/90"
          >
            <Link href="/shop">Browse Products</Link>
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-3 sm:px-4 py-6 sm:py-10">
      <div className="mb-6 sm:mb-8 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3">
        <div>
          <Button
            variant="ghost"
            asChild
            className="mb-3 sm:mb-4 -ml-3 text-slate-600 hover:text-[#1C398E]"
          >
            <Link href="/shop">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Continue Shopping
            </Link>
          </Button>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 flex items-center gap-2">
            <Heart className="h-6 w-6 text-red-500 fill-red-500" />
            My Wishlist
          </h1>
          <p className="text-slate-600 mt-1">
            {items.length} {items.length === 1 ? "item" : "items"} saved
          </p>
        </div>
        <Button
          variant="outline"
          onClick={handleClear}
          className="text-red-600 border-red-200 hover:bg-red-50 hover:text-red-700 self-start sm:self-auto"
        >
          <Trash2 className="h-4 w-4 mr-2" />
          Clear All
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5">
        {items.map((item: any) => (
          <ProductCard key={item.id} product={item} />
        ))}
      </div>
    </div>
  )
}
