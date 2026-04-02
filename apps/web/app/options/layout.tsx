import { Metadata } from "next"
import { brand } from "@/config/brand"

export const metadata: Metadata = {
  title: "Options",
  description: `Trade on-chain options on ${brand.name}`,
}

export default function OptionsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
