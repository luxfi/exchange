import { Metadata } from "next"
import { Header } from "@/components/layout/header"
import { PoolList } from "@/components/pool/pool-list"
import { brand } from "@/config/brand"

export const metadata: Metadata = {
  title: "Pools",
  description: `Provide liquidity and earn fees on ${brand.name}`,
}

export default function PoolPage() {
  return (
    <>
      <Header />
      <main className="flex-1 py-8">
        <div className="container max-w-4xl">
          <PoolList />
        </div>
      </main>
    </>
  )
}
