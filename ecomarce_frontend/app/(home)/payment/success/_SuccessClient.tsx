"use client"

import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { CheckCircle2, Package, Receipt, ShoppingBag } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { useVerifyEpsPaymentQuery } from "@/redux/fetchers/order/paymentApi"

export default function SuccessClient() {
  const params = useSearchParams()
  const orderId = params.get("orderId") || ""
  const mtid = params.get("mtid") || ""

  const { data, isLoading } = useVerifyEpsPaymentQuery(orderId, {
    skip: !orderId,
  })

  const paymentStatus = data?.data?.paymentStatus as
    | "PAID"
    | "PENDING"
    | "FAILED"
    | "CANCELLED"
    | undefined
  const order = data?.data?.order

  const paid = paymentStatus === "PAID"

  return (
    <div className="bg-gradient-to-b from-emerald-50 via-white to-slate-50 min-h-screen">
      <div className="container mx-auto px-4 py-16">
        <Card className="max-w-2xl mx-auto border-slate-200 shadow-xl rounded-2xl overflow-hidden">
          <div className="bg-gradient-to-r from-emerald-500 to-emerald-600 px-6 py-10 text-center text-white">
            <div className="mx-auto mb-4 h-20 w-20 rounded-full bg-white/20 flex items-center justify-center backdrop-blur-sm">
              <CheckCircle2 className="h-12 w-12" />
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold mb-2">
              Payment Successful
            </h1>
            <p className="text-emerald-50">
              Thank you! Your payment via EPS has been received.
            </p>
          </div>

          <CardContent className="p-6 sm:p-8 space-y-5">
            {isLoading ? (
              <p className="text-center text-slate-500">Verifying payment…</p>
            ) : (
              <>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="rounded-xl border border-slate-200 p-4 bg-slate-50/60">
                    <p className="text-xs text-slate-500 mb-1 flex items-center gap-1.5">
                      <Receipt className="h-3.5 w-3.5" /> Order ID
                    </p>
                    <p className="text-sm font-mono font-semibold text-slate-900 truncate">
                      {orderId || "—"}
                    </p>
                  </div>
                  <div className="rounded-xl border border-slate-200 p-4 bg-slate-50/60">
                    <p className="text-xs text-slate-500 mb-1 flex items-center gap-1.5">
                      <Package className="h-3.5 w-3.5" /> Transaction ID
                    </p>
                    <p className="text-sm font-mono font-semibold text-slate-900 truncate">
                      {mtid || "—"}
                    </p>
                  </div>
                </div>

                {order && (
                  <div className="rounded-xl border border-slate-200 p-4">
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-slate-600">Total paid</span>
                      <span className="font-bold text-slate-900">
                        ৳{Number(order.totalPrice || 0).toFixed(2)}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-slate-600">Payment status</span>
                      <span
                        className={`font-semibold ${
                          paid ? "text-emerald-700" : "text-amber-700"
                        }`}
                      >
                        {paymentStatus || "PENDING"}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-600">Order status</span>
                      <span className="font-semibold text-slate-900">
                        {order.status}
                      </span>
                    </div>
                  </div>
                )}

                {!paid && paymentStatus && (
                  <div className="rounded-xl bg-amber-50 border border-amber-200 p-3 text-sm text-amber-800">
                    Payment not confirmed yet. Refresh in a moment or check your
                    orders.
                  </div>
                )}
              </>
            )}

            <Separator />

            <div className="flex flex-col sm:flex-row gap-3">
              <Button
                asChild
                className="flex-1 bg-[#1C398E] hover:bg-[#1C398E]/90 h-11"
              >
                <Link href="/dashboard/orders">View my orders</Link>
              </Button>
              <Button asChild variant="outline" className="flex-1 h-11">
                <Link href="/shop">
                  <ShoppingBag className="h-4 w-4 mr-2" />
                  Continue shopping
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
