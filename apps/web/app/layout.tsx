import type { Metadata, Viewport } from "next"
import { Inter, IBM_Plex_Mono } from "next/font/google"
import { Providers } from "@/components/providers/providers"
import "./globals.css"

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
})

const ibmPlexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-ibm-plex-mono",
})

export const metadata: Metadata = {
  title: {
    default: "Lux Exchange",
    template: "%s | Lux Exchange",
  },
  description: "Trade tokens on the Lux Network",
  keywords: ["DeFi", "DEX", "Lux", "Swap", "Trading", "Cryptocurrency"],
  authors: [{ name: "Lux Partners" }],
  creator: "Lux Partners",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://lux.exchange",
    title: "Lux Exchange",
    description: "Trade tokens on the Lux Network",
    siteName: "Lux Exchange",
  },
  twitter: {
    card: "summary_large_image",
    title: "Lux Exchange",
    description: "Trade tokens on the Lux Network",
    creator: "@luxnetwork",
  },
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon-16x16.png",
    apple: "/apple-touch-icon.png",
  },
  manifest: "/site.webmanifest",
}

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "white" },
    { media: "(prefers-color-scheme: dark)", color: "black" },
  ],
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${inter.variable} ${ibmPlexMono.variable}`}
    >
      <body className="min-h-screen bg-background font-sans antialiased">
        <Providers>
          <div className="relative flex min-h-screen flex-col">
            {children}
          </div>
        </Providers>
      </body>
    </html>
  )
}
