import { Suspense } from "react"
import FailClient from "./_FailClient"

export const metadata = {
  title: "Payment Failed",
  description: "Your EPS payment failed.",
}

export default function Page() {
  return (
    <Suspense fallback={<div className="min-h-[60vh]" />}>
      <FailClient />
    </Suspense>
  )
}
