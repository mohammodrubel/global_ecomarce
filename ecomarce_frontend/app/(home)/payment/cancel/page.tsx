import { Suspense } from "react"
import CancelClient from "./_CancelClient"

export const metadata = {
  title: "Payment Cancelled",
  description: "Your EPS payment was cancelled.",
}

export default function Page() {
  return (
    <Suspense fallback={<div className="min-h-[60vh]" />}>
      <CancelClient />
    </Suspense>
  )
}
