import { Metadata } from "next"
import { SwapWidget } from "@/components/swap/swap-widget"
import { Header } from "@/components/layout/header"

export const metadata: Metadata = {
  title: "Swap",
  description: "Swap tokens instantly on Lux Exchange",
}

export default function SwapPage() {
  return (
    <>
      <Header />
      <main className="flex-1 flex items-center justify-center py-8">
        <div className="container max-w-lg">
          <SwapWidget />
        </div>
      </main>
    </>
  )
}
