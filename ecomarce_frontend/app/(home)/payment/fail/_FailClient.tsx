"use client"

import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { AlertTriangle, RotateCcw, LifeBuoy } from "lucide-react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { useInitEpsPaymentMutation } from "@/redux/fetchers/order/paymentApi"

export default function FailClient() {
  const params = useSearchParams()
  const orderId = params.get("orderId") || ""
  const mtid = params.get("mtid") || ""

  const [initEps, { isLoading: retrying }] = useInitEpsPaymentMutation()

  const handleRetry = async () => {
    if (!orderId) return
    try {
      const res: any = await initEps(orderId).unwrap()
      const url = res?.data?.redirectUrl
      if (url) {
        window.location.href = url
      } else {
        toast.error("Could not restart payment")
      }
    } catch (err: any) {
      toast.error(err?.data?.message || "Retry failed")
    }
  }

  return (
    <div className="bg-gradient-to-b from-rose-50 via-white to-slate-50 min-h-screen">
      <div className="container mx-auto px-4 py-16">
        <Card className="max-w-2xl mx-auto border-slate-200 shadow-xl rounded-2xl overflow-hidden">
          <div className="bg-gradient-to-r from-rose-500 to-rose-600 px-6 py-10 text-center text-white">
            <div className="mx-auto mb-4 h-20 w-20 rounded-full bg-white/20 flex items-center justify-center backdrop-blur-sm">
              <AlertTriangle className="h-12 w-12" />
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold mb-2">
              Payment Failed
            </h1>
            <p className="text-rose-50">
              We could not process your EPS payment. No amount was charged.
            </p>
          </div>

          <CardContent className="p-6 sm:p-8 space-y-5">
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="rounded-xl border border-slate-200 p-4 bg-slate-50/60">
                <p className="text-xs text-slate-500 mb-1">Order ID</p>
                <p className="text-sm font-mono font-semibold text-slate-900 truncate">
                  {orderId || "—"}
                </p>
              </div>
              <div className="rounded-xl border border-slate-200 p-4 bg-slate-50/60">
                <p className="text-xs text-slate-500 mb-1">Transaction ID</p>
                <p className="text-sm font-mono font-semibold text-slate-900 truncate">
                  {mtid || "—"}
                </p>
              </div>
            </div>

            <div className="rounded-xl bg-rose-50 border border-rose-200 p-3 text-sm text-rose-800">
              Common causes: insufficient balance, wrong OTP, network drop, card
              declined by issuer. Please try again or contact support.
            </div>

            <Separator />

            <div className="flex flex-col sm:flex-row gap-3">
              <Button
                onClick={handleRetry}
                disabled={!orderId || retrying}
                className="flex-1 bg-[#1C398E] hover:bg-[#1C398E]/90 h-11"
              >
                <RotateCcw className="h-4 w-4 mr-2" />
                {retrying ? "Restarting…" : "Retry payment"}
              </Button>
              <Button asChild variant="outline" className="flex-1 h-11">
                <Link href="/contact-us">
                  <LifeBuoy className="h-4 w-4 mr-2" />
                  Contact support
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
