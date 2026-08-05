import { Suspense } from "react"
import SuccessClient from "./_SuccessClient"

export const metadata = {
  title: "Payment Successful",
  description: "Your EPS payment has been received.",
}

export default function Page() {
  return (
    <Suspense fallback={<div className="min-h-[60vh]" />}>
      <SuccessClient />
    </Suspense>
  )
}
