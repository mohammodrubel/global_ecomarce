"use client"

import Image from "next/image"
import Link from "next/link"
import { Minus, Plus, Trash2, ShoppingBag, ArrowLeft } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { useSelector, useDispatch } from "react-redux"
import {
  decrementQuantity,
  incrementQuantity,
  removeCart,
  removeItem,
} from "@/redux/fetchers/cart/cartSlice"

export default function CartPage() {
  const dispatch = useDispatch()
  const cartProducts = useSelector((state: any) => state?.cart?.product || [])
  const cartInfo = useSelector((state: any) => ({
    totalAmount: state?.cart?.totalAmount || 0,
    totalQuantity: state?.cart?.totalQuantity || 0,
    products: state?.cart?.product || []
  }))

  // Use cartInfo totals instead of calculating from products
  const subtotal = cartInfo.totalAmount
  const shipping = subtotal > 50 ? 0 : 9.99
  const tax = subtotal * 0.08
  const total = subtotal + shipping + tax

  const increment = (id:string)=>{
    dispatch(incrementQuantity({id:id}))
  }
  const decrement = (id:string)=>{
    dispatch(decrementQuantity({id:id}))
  }

  const handleRemove = (id: string) => {
    dispatch(removeItem({ id }))
  }
  const handleClearCart = () => {
    dispatch(removeCart())
  }

  if (cartProducts.length === 0) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="text-center">
          <ShoppingBag className="h-24 w-24 mx-auto text-gray-400 mb-6" />
          <h1 className="text-3xl font-bold mb-4">Your cart is empty</h1>
          <p className="text-gray-600 mb-8">Looks like you havent added any items to your cart yet.</p>
          <Button asChild size="lg">
            <Link href="/shop">Continue Shopping</Link>
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-3 sm:px-4 py-4 sm:py-8">
      <div className="mb-6 sm:mb-8 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3">
        <div>
          <Button variant="ghost" asChild className="mb-3 sm:mb-4 -ml-3">
            <Link href="/shop">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Continue Shopping
            </Link>
          </Button>
          <h1 className="text-2xl sm:text-3xl font-bold">Shopping Cart</h1>
          <p className="text-gray-600">
            {cartInfo.totalQuantity} {cartInfo.totalQuantity === 1 ? 'item' : 'items'} in your cart
          </p>
        </div>
        <Button
          variant="outline"
          onClick={handleClearCart}
          className="text-red-600 border-red-200 hover:bg-red-50 hover:text-red-700 self-start sm:self-auto"
        >
          <Trash2 className="h-4 w-4 mr-2" />
          Clear Cart
        </Button>
      </div>

      <div className="grid lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-2 space-y-3 sm:space-y-4">
          {cartProducts.map((item: any) => (
            <Card key={item.id}>
              <CardContent className="p-3 sm:p-4 md:p-6">
                <div className="flex gap-3 sm:gap-4">
                  <div className="flex-shrink-0">
                    <Image
                      src={item.images?.[0] || "/placeholder.svg"}
                      alt={item.name || "Product"}
                      width={100}
                      height={100}
                      className="rounded-lg object-cover w-20 h-20 sm:w-24 sm:h-24 md:w-[100px] md:h-[100px]"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start mb-2 gap-2">
                      <div className="min-w-0 flex-1">
                        <h3 className="font-semibold text-sm sm:text-base md:text-lg line-clamp-2">{item.name}</h3>
                        <div className="text-sm text-gray-600 space-y-1 mt-1">
                          {item.subcategory && <p>Category: {item.subcategory}</p>}
                          {item.brand?.name && <p>Brand: {item.brand.name}</p>}
                          {item.sku && <p>SKU: {item.sku}</p>}
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleRemove(item.id)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                    <div className="flex items-center justify-between mt-3 sm:mt-4 gap-2 flex-wrap">
                      <div className="flex items-center border rounded-lg">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => decrement(item.id)}
                          disabled={(item.quantity || 1) <= 1}
                          className="h-8 w-8 sm:h-10 sm:w-10"
                        >
                          <Minus className="h-3 w-3 sm:h-4 sm:w-4" />
                        </Button>
                        <span className="px-3 sm:px-4 py-1 sm:py-2 font-medium text-sm sm:text-base">{item.quantity || 1}</span>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => increment(item.id)}
                          disabled={(item.quantity || 1) >= (item.stock || 0)}
                          className="h-8 w-8 sm:h-10 sm:w-10"
                        >
                          <Plus className="h-3 w-3 sm:h-4 sm:w-4" />
                        </Button>
                      </div>
                      <div className="text-right">
                        <p className="text-base sm:text-lg font-bold">
                          ${((item.price || 0) * (item.quantity || 1)).toFixed(2)}
                        </p>
                        <p className="text-xs sm:text-sm text-gray-500">${(item.price || 0).toFixed(2)} each</p>
                      </div>
                    </div>
                    {item.originalPrice && item.originalPrice > (item.price || 0) && (
                      <p className="text-sm text-green-600 mt-2">
                        Saved: ${(item.originalPrice - (item.price || 0)).toFixed(2)}
                      </p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <Card className="sticky top-24">
            <CardContent className="p-6">
              <h2 className="text-xl font-bold mb-6">Order Summary</h2>

              <div className="space-y-4 mb-6">
                <div className="flex justify-between">
                  <span>Subtotal ({cartInfo.totalQuantity} items)</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span>{shipping === 0 ? "Free" : `$${shipping.toFixed(2)}`}</span>
                </div>
                <div className="flex justify-between">
                  <span>Tax (8%)</span>
                  <span>${tax.toFixed(2)}</span>
                </div>
                <Separator />
                <div className="flex justify-between text-lg font-bold">
                  <span>Total</span>
                  <span>${total.toFixed(2)}</span>
                </div>
              </div>

              <Button className="w-full mb-4" size="lg" asChild>
                <Link href="/checkout">Proceed to Checkout</Link>
              </Button>

              <div className="text-center text-sm text-gray-600">
                <p>Free shipping on orders over $50</p>
                <p>Secure checkout with SSL encryption</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}