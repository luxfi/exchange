import { SwapWidget } from "@/components/swap/swap-widget"
import { Header } from "@/components/layout/header"

export default function HomePage() {
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
