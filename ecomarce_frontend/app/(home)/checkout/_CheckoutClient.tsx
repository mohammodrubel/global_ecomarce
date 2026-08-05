"use client"

import { useState, FormEvent } from "react"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import {
  ArrowLeft,
  Smartphone,
  Truck,
  ShieldCheck,
  ShoppingBag,
  User,
  Mail,
  Phone,
  MapPin,
  Building2,
  Hash,
  Globe,
  StickyNote,
  Check,
  PackageCheck,
  Lock,
  BadgePercent,
} from "lucide-react"
import { useDispatch, useSelector } from "react-redux"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { removeCart } from "@/redux/fetchers/cart/cartSlice"
import { useApplyCouponMutation, useGetLatestCouponQuery } from "@/redux/fetchers/coupon/couponApi"
import { useCreateOrderMutation } from "@/redux/fetchers/order/orderApi"
import { Ticket, X } from "lucide-react"
import { RootState } from "@/redux/store"

type PaymentMethod = "cod" | "eps"

type FieldProps = {
  id: string
  name: string
  label: string
  value: string
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  Icon: any
  type?: string
  placeholder?: string
  required?: boolean
  className?: string
}

function Field({
  id,
  name,
  label,
  value,
  onChange,
  Icon,
  type = "text",
  placeholder,
  required,
  className,
}: FieldProps) {
  return (
    <div className={className}>
      <Label htmlFor={id} className="text-sm font-medium text-slate-700 mb-1.5 block">
        {label}
      </Label>
      <div className="relative">
        <Icon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
        <Input
          id={id}
          name={name}
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          required={required}
          className="pl-9 h-11 bg-slate-50 border-slate-200 focus-visible:bg-white focus-visible:border-[#1C398E]"
        />
      </div>
    </div>
  )
}

export default function CheckoutPage() {
  const dispatch = useDispatch()
  const router = useRouter()

  const cartInfo = useSelector((state: any) => ({
    totalAmount: state?.cart?.totalAmount || 0,
    totalQuantity: state?.cart?.totalQuantity || 0,
    products: state?.cart?.product || [],
  }))
  const token = useSelector((state: RootState) => state.auth?.token)
  const [createOrder] = useCreateOrderMutation()

  const [payment, setPayment] = useState<PaymentMethod>("cod")
  const [deliveryZone, setDeliveryZone] = useState<"dhaka" | "outside">("dhaka")
  const [submitting, setSubmitting] = useState(false)
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    postalCode: "",
    country: "",
    notes: "",
  })

  const [couponCode, setCouponCode] = useState("")
  const [appliedCoupon, setAppliedCoupon] = useState<{
    code: string
    discount: number
    discountType: "PERCENTAGE" | "FIXED_AMOUNT"
    value: number
  } | null>(null)
  const [applyCoupon, { isLoading: applyingCoupon }] = useApplyCouponMutation()
  const { data: latestCouponRes } = useGetLatestCouponQuery(undefined)
  const hasActiveCoupon = Boolean(latestCouponRes?.data)

  const subtotal = cartInfo.totalAmount
  const isDhaka = deliveryZone === "dhaka"
  const shipping = isDhaka ? 70 : 120
  const discount = appliedCoupon?.discount || 0
  const total = Math.max(0, subtotal - discount) + shipping

  const handleApplyCoupon = async () => {
    const code = couponCode.trim()
    if (!code) return toast.error("Enter a coupon code")
    if (subtotal <= 0) return toast.error("Cart is empty")
    try {
      const res = await applyCoupon({ code, subtotal }).unwrap()
      setAppliedCoupon(res.data)
      toast.success(`Coupon ${res.data.code} applied — save ৳${res.data.discount}`)
    } catch (err: any) {
      setAppliedCoupon(null)
      toast.error(err?.data?.message || "Invalid coupon")
    }
  }

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null)
    setCouponCode("")
    toast.info("Coupon removed")
  }

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    if (!token) {
      toast.error("Please login to place order")
      router.push("/login")
      return
    }
    if (cartInfo.products.length === 0) {
      toast.error("Cart is empty")
      return
    }
    setSubmitting(true)
    try {
      const res: any = await createOrder({
        fullName: `${form.firstName} ${form.lastName}`.trim(),
        email: form.email,
        phone: form.phone,
        address: form.address,
        city: form.city,
        postalCode: form.postalCode,
        country: form.country,
        notes: form.notes || undefined,
        paymentMethod: payment === "eps" ? "EPS" : "COD",
        couponCode: appliedCoupon?.code || undefined,
        items: cartInfo.products.map((p: any) => ({
          productId: p.id,
          quantity: p.quantity || 1,
        })),
      }).unwrap()

      const redirectUrl = res?.data?.redirectUrl
      if (payment === "eps" && redirectUrl) {
        dispatch(removeCart())
        toast.success("Redirecting to EPS gateway…")
        window.location.href = redirectUrl
        return
      }

      toast.success("Order placed successfully")
      dispatch(removeCart())
      router.push("/dashboard/orders")
    } catch (err: any) {
      toast.error(err?.data?.message || "Failed to place order")
    } finally {
      setSubmitting(false)
    }
  }

  if (cartInfo.products.length === 0) {
    return (
      <div className="min-h-[60vh] container mx-auto px-4 py-16 flex items-center justify-center">
        <div className="text-center max-w-md">
          <div className="mx-auto mb-6 w-24 h-24 rounded-full bg-blue-50 flex items-center justify-center">
            <ShoppingBag className="h-12 w-12 text-[#1C398E]" />
          </div>
          <h1 className="text-3xl font-bold mb-3 text-slate-900">Cart is empty</h1>
          <p className="text-slate-600 mb-8">Add items to your cart before checkout.</p>
          <Button asChild size="lg" className="bg-[#1C398E] hover:bg-[#1C398E]/90">
            <Link href="/shop">Go to Shop</Link>
          </Button>
        </div>
      </div>
    )
  }

  const steps = [
    { label: "Cart", done: true },
    { label: "Checkout", done: false, active: true },
    { label: "Complete", done: false },
  ]

  return (
    <div className="bg-gradient-to-b from-slate-50 via-white to-slate-50 min-h-screen">
      <div className="container mx-auto px-3 sm:px-4 py-6 sm:py-10">
        {/* Header */}
        <div className="mb-6 sm:mb-8">
          <Button variant="ghost" asChild className="mb-4 -ml-3 text-slate-600 hover:text-[#1C398E]">
            <Link href="/cart">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Cart
            </Link>
          </Button>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900">
                Checkout
              </h1>
              <p className="text-slate-600 mt-1">Complete your order in a few clicks</p>
            </div>
            {/* Steps */}
            <div className="flex items-center gap-2">
              {steps.map((s, i) => (
                <div key={s.label} className="flex items-center">
                  <div
                    className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium ${
                      s.done
                        ? "bg-green-100 text-green-700"
                        : s.active
                        ? "bg-[#1C398E] text-white shadow-md shadow-blue-600/30"
                        : "bg-slate-100 text-slate-500"
                    }`}
                  >
                    {s.done ? (
                      <Check className="h-3.5 w-3.5" />
                    ) : (
                      <span className="inline-flex items-center justify-center h-4 w-4 rounded-full bg-white/20 text-[10px] font-bold">
                        {i + 1}
                      </span>
                    )}
                    {s.label}
                  </div>
                  {i < steps.length - 1 && (
                    <div className="w-4 h-px bg-slate-300 mx-1" />
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Trust strip */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6 sm:mb-8">
          {[
            { Icon: Truck, title: "Fast delivery", sub: "Nationwide" },
            { Icon: ShieldCheck, title: "Secure", sub: "SSL encrypted" },
            { Icon: PackageCheck, title: "Easy returns", sub: "7 days" },
            { Icon: BadgePercent, title: "Cash on Delivery", sub: "Available" },
          ].map(({ Icon, title, sub }) => (
            <div
              key={title}
              className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white p-3 shadow-sm"
            >
              <div className="h-9 w-9 rounded-lg bg-blue-50 flex items-center justify-center text-[#1C398E]">
                <Icon className="h-4 w-4" />
              </div>
              <div className="min-w-0">
                <p className="text-xs font-semibold text-slate-900 truncate">{title}</p>
                <p className="text-[11px] text-slate-500 truncate">{sub}</p>
              </div>
            </div>
          ))}
        </div>

        <form
          onSubmit={handleSubmit}
          className="grid lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8"
        >
          {/* LEFT — form */}
          <div className="lg:col-span-2 space-y-5 sm:space-y-6">
            {/* Shipping */}
            <Card className="border-slate-200 shadow-sm overflow-hidden rounded-2xl">
              <div className="flex items-center gap-3 px-5 sm:px-6 py-4 bg-gradient-to-r from-blue-50 to-transparent border-b border-slate-100">
                <div className="h-9 w-9 rounded-xl bg-[#1C398E] text-white flex items-center justify-center font-bold text-sm">
                  1
                </div>
                <div>
                  <h2 className="text-base sm:text-lg font-bold text-slate-900">
                    Shipping Information
                  </h2>
                  <p className="text-xs text-slate-500">Where should we deliver?</p>
                </div>
              </div>
              <CardContent className="p-5 sm:p-6">
                <div className="grid sm:grid-cols-2 gap-4">
                  <Field id="firstName" name="firstName" label="First name" Icon={User} value={form.firstName} onChange={handleChange} required />
                  <Field id="lastName" name="lastName" label="Last name" Icon={User} value={form.lastName} onChange={handleChange} required />
                  <Field id="email" name="email" label="Email" type="email" Icon={Mail} value={form.email} onChange={handleChange} required />
                  <Field id="phone" name="phone" label="Phone" Icon={Phone} value={form.phone} onChange={handleChange} required />
                  <Field id="address" name="address" label="Address" Icon={MapPin} value={form.address} onChange={handleChange} required className="sm:col-span-2" />
                  <Field id="city" name="city" label="City" Icon={Building2} value={form.city} onChange={handleChange} required />
                  <Field id="postalCode" name="postalCode" label="Postal code" Icon={Hash} value={form.postalCode} onChange={handleChange} required />
                  <Field id="country" name="country" label="Country" Icon={Globe} value={form.country} onChange={handleChange} required className="sm:col-span-2" />
                  <div className="sm:col-span-2">
                    <Label htmlFor="notes" className="text-sm font-medium text-slate-700 mb-1.5 block">
                      Order notes (optional)
                    </Label>
                    <div className="relative">
                      <StickyNote className="absolute left-3 top-3 h-4 w-4 text-slate-400 pointer-events-none" />
                      <textarea
                        id="notes"
                        name="notes"
                        rows={3}
                        value={form.notes}
                        onChange={handleChange}
                        placeholder="Delivery instructions, gate code, etc."
                        className="w-full rounded-md border border-slate-200 bg-slate-50 pl-9 pr-3 py-2 text-sm shadow-xs outline-none focus:bg-white focus:border-[#1C398E] focus-visible:ring-2 focus-visible:ring-[#1C398E]/20 transition-colors"
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Payment */}
            <Card className="border-slate-200 shadow-sm overflow-hidden rounded-2xl">
              <div className="flex items-center gap-3 px-5 sm:px-6 py-4 bg-gradient-to-r from-blue-50 to-transparent border-b border-slate-100">
                <div className="h-9 w-9 rounded-xl bg-[#1C398E] text-white flex items-center justify-center font-bold text-sm">
                  2
                </div>
                <div>
                  <h2 className="text-base sm:text-lg font-bold text-slate-900">
                    Payment Method
                  </h2>
                  <p className="text-xs text-slate-500">Choose how to pay</p>
                </div>
              </div>
              <CardContent className="p-5 sm:p-6">
                <div className="grid sm:grid-cols-2 gap-3">
                  {(
                    [
                      {
                        value: "cod",
                        title: "Cash on Delivery",
                        subtitle: "Pay when you receive",
                        Icon: Truck,
                        disabled: false,
                        badge: null as string | null,
                        accent: "text-[#1C398E]",
                        accentBg: "bg-blue-50",
                      },
                      {
                        value: "eps",
                        title: "EPS Payment Gateway",
                        subtitle: "Cards, mobile banking, wallets",
                        Icon: Smartphone,
                        disabled: false,
                        badge: "Secure",
                        accent: "text-emerald-600",
                        accentBg: "bg-emerald-50",
                      },
                    ] as {
                      value: PaymentMethod
                      title: string
                      subtitle: string
                      Icon: any
                      disabled: boolean
                      badge: string | null
                      accent: string
                      accentBg: string
                    }[]
                  ).map(({ value, title, subtitle, Icon, disabled, badge, accent, accentBg }) => {
                    const active = payment === value
                    const id = `pay-${value}`
                    return (
                      <label
                        key={value}
                        htmlFor={id}
                        className={`relative flex items-start gap-3 rounded-xl border-2 p-4 transition-all ${
                          disabled
                            ? "border-slate-200 bg-slate-50 opacity-70 cursor-not-allowed"
                            : active
                            ? "border-[#1C398E] bg-blue-50/50 shadow-md cursor-pointer"
                            : "border-slate-200 hover:border-slate-300 hover:shadow-sm cursor-pointer"
                        }`}
                      >
                        {active && !disabled && (
                          <div className="absolute top-2 right-2 h-5 w-5 rounded-full bg-[#1C398E] text-white flex items-center justify-center">
                            <Check className="h-3 w-3" />
                          </div>
                        )}
                        <div className={`h-11 w-11 rounded-xl ${accentBg} ${accent} flex items-center justify-center flex-shrink-0`}>
                          <Icon className="h-5 w-5" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-2 flex-wrap">
                            <p className="font-semibold text-sm text-slate-900">{title}</p>
                            {badge && (
                              <span className="inline-flex items-center rounded-full bg-amber-100 text-amber-700 text-[10px] font-bold px-2 py-0.5">
                                {badge}
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-slate-500 mt-0.5">{subtitle}</p>
                        </div>
                        <input
                          id={id}
                          type="radio"
                          name="payment"
                          value={value}
                          checked={active}
                          disabled={disabled}
                          onChange={() => !disabled && setPayment(value)}
                          className="sr-only"
                        />
                      </label>
                    )
                  })}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* RIGHT — summary */}
          <div className="lg:col-span-1">
            <Card className="sticky top-24 border-slate-200 shadow-lg overflow-hidden rounded-2xl py-0 gap-0">
              <div className="p-5 sm:p-6 border-b border-slate-200">
                <div className="flex items-center gap-2 mb-1">
                  <ShoppingBag className="h-5 w-5 text-[#1C398E]" />
                  <h2 className="text-lg font-bold text-slate-900">Order Summary</h2>
                </div>
                <p className="text-xs text-slate-500">
                  {cartInfo.totalQuantity} {cartInfo.totalQuantity === 1 ? "item" : "items"} ready to ship
                </p>
              </div>

              <CardContent className="p-5 sm:p-6">
                <div className="space-y-3 mb-4 max-h-72 overflow-y-auto pr-1 -mr-1">
                  {cartInfo.products.map((item: any) => (
                    <div key={item.id} className="flex gap-3">
                      <div className="relative w-14 h-14 flex-shrink-0 rounded-lg overflow-hidden bg-slate-100 border border-slate-200">
                        <Image
                          src={item.images?.[0] || "/placeholder.svg"}
                          alt={item.name || "Product"}
                          fill
                          sizes="56px"
                          className="object-cover"
                        />
                        <span className="absolute -top-1.5 -right-1.5 bg-[#1C398E] text-white text-[10px] rounded-full w-5 h-5 flex items-center justify-center font-bold shadow-sm">
                          {item.quantity || 1}
                        </span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium line-clamp-2 text-slate-900">
                          {item.name}
                        </p>
                        <p className="text-xs text-slate-500 mt-0.5">
                          ৳{(item.price || 0).toFixed(2)} × {item.quantity || 1}
                        </p>
                      </div>
                      <p className="text-sm font-semibold text-slate-900 whitespace-nowrap">
                        ৳{((item.price || 0) * (item.quantity || 1)).toFixed(2)}
                      </p>
                    </div>
                  ))}
                </div>

                <Separator className="mb-4" />

                {/* Coupon */}
                <div className="mb-4">
                  {appliedCoupon ? (
                    <div className="flex items-center justify-between gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-2.5">
                      <div className="flex items-center gap-2 min-w-0">
                        <Ticket className="h-4 w-4 text-emerald-600 flex-shrink-0" />
                        <div className="min-w-0">
                          <p className="text-sm font-bold text-emerald-800 tracking-wider truncate">
                            {appliedCoupon.code}
                          </p>
                          <p className="text-[11px] text-emerald-700">
                            {appliedCoupon.discountType === "PERCENTAGE"
                              ? `${appliedCoupon.value}% off applied`
                              : `৳${appliedCoupon.value} off applied`}
                          </p>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={handleRemoveCoupon}
                        className="h-7 w-7 rounded-full hover:bg-emerald-100 flex items-center justify-center text-emerald-700"
                        aria-label="Remove coupon"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  ) : (
                    <>
                      <div className="flex gap-2">
                        <div className="relative flex-1">
                          <Ticket className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
                          <Input
                            placeholder={hasActiveCoupon ? "Coupon code" : "No coupons available"}
                            value={couponCode}
                            onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                            disabled={!hasActiveCoupon}
                            className="pl-9 h-10 uppercase tracking-wider disabled:cursor-not-allowed disabled:bg-slate-100"
                          />
                        </div>
                        <Button
                          type="button"
                          onClick={handleApplyCoupon}
                          disabled={applyingCoupon || !hasActiveCoupon}
                          variant="outline"
                          className="h-10 border-[#1C398E] text-[#1C398E] hover:bg-blue-50"
                        >
                          {applyingCoupon ? "..." : "Apply"}
                        </Button>
                      </div>
                      {!hasActiveCoupon && (
                        <p className="text-[11px] text-slate-500 mt-1.5">
                          No active coupons right now
                        </p>
                      )}
                    </>
                  )}
                </div>

                {/* Delivery zone */}
                <div className="mb-4 rounded-xl border border-slate-200 p-3 bg-slate-50/60">
                  <p className="text-xs font-semibold text-slate-700 mb-2 flex items-center gap-1.5">
                    <Truck className="h-3.5 w-3.5 text-[#1C398E]" />
                    Delivery Zone
                  </p>
                  <div className="grid grid-cols-2 gap-2">
                    {(
                      [
                        { value: "dhaka", title: "Inside Dhaka", price: 70 },
                        { value: "outside", title: "Outside Dhaka", price: 120 },
                      ] as { value: "dhaka" | "outside"; title: string; price: number }[]
                    ).map(({ value, title, price }) => {
                      const active = deliveryZone === value
                      const id = `sum-zone-${value}`
                      return (
                        <label
                          key={value}
                          htmlFor={id}
                          className={`flex items-center gap-2 rounded-lg border p-2.5 cursor-pointer transition-all ${
                            active
                              ? "border-[#1C398E] bg-white shadow-sm"
                              : "border-slate-200 bg-white hover:border-slate-300"
                          }`}
                        >
                          <input
                            id={id}
                            type="radio"
                            name="sum-deliveryZone"
                            value={value}
                            checked={active}
                            onChange={() => setDeliveryZone(value)}
                            className="h-4 w-4 accent-[#1C398E] cursor-pointer flex-shrink-0"
                          />
                          <div className="min-w-0 flex-1">
                            <p className="text-xs font-semibold text-slate-900 truncate">{title}</p>
                            <p className="text-[11px] text-slate-500">৳{price}</p>
                          </div>
                        </label>
                      )
                    })}
                  </div>
                </div>

                <div className="space-y-2.5 mb-5">
                  <div className="flex justify-between text-sm text-slate-600">
                    <span>Subtotal</span>
                    <span className="text-slate-900 font-medium">৳{subtotal.toFixed(2)}</span>
                  </div>
                  {discount > 0 && (
                    <div className="flex justify-between text-sm text-emerald-700">
                      <span>Discount ({appliedCoupon?.code})</span>
                      <span className="font-semibold">-৳{discount.toFixed(2)}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-sm text-slate-600">
                    <span>
                      Delivery{" "}
                      <span className="text-[11px] text-slate-500">
                        ({isDhaka ? "Inside Dhaka" : "Outside Dhaka"})
                      </span>
                    </span>
                    <span className="text-slate-900 font-medium">৳{shipping.toFixed(2)}</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between items-baseline">
                    <span className="text-base font-bold text-slate-900">Total</span>
                    <span className="text-2xl font-extrabold text-[#1C398E]">
                      ৳{total.toFixed(2)}
                    </span>
                  </div>
                </div>

                <Button
                  type="submit"
                  className="w-full mb-3 bg-gradient-to-r from-[#1C398E] to-blue-700 hover:from-[#1C398E]/90 hover:to-blue-700/90 text-white font-semibold shadow-lg shadow-blue-600/30 h-12"
                  size="lg"
                  disabled={submitting}
                >
                  {submitting ? (
                    <span className="flex items-center gap-2">
                      <span className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Placing order...
                    </span>
                  ) : (
                    <span className="flex items-center gap-2">
                      <Lock className="h-4 w-4" />
                      Place Order · ৳{total.toFixed(2)}
                    </span>
                  )}
                </Button>

                <div className="flex items-center justify-center gap-1.5 text-[11px] text-slate-500">
                  <ShieldCheck className="h-3.5 w-3.5 text-green-600" />
                  <span>Secure SSL encrypted checkout</span>
                </div>

                <div className="mt-4 pt-4 border-t border-slate-200 flex flex-wrap items-center justify-center gap-x-3 gap-y-1 text-[11px] text-slate-500">
                  <Link href="/returns" className="hover:text-[#1C398E] hover:underline">
                    Returns & Refunds
                  </Link>
                  <span className="text-slate-300">·</span>
                  <Link href="/privacy" className="hover:text-[#1C398E] hover:underline">
                    Privacy Policy
                  </Link>
                  <span className="text-slate-300">·</span>
                  <Link href="/terms" className="hover:text-[#1C398E] hover:underline">
                    Terms of Service
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>
        </form>
      </div>
    </div>
  )
}
