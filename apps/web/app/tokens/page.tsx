import { Metadata } from "next"
import { Header } from "@/components/layout/header"
import { TokenList } from "@/components/tokens/token-list"
import { brand } from "@/config/brand"

export const metadata: Metadata = {
  title: "Tokens",
  description: `Explore tokens on ${brand.name}`,
}

export default function TokensPage() {
  return (
    <>
      <Header />
      <main className="flex-1 py-8">
        <div className="container max-w-4xl">
          <TokenList />
        </div>
      </main>
    </>
  )
}
