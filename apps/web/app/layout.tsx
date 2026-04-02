import type { Metadata, Viewport } from "next"
import { Inter, IBM_Plex_Mono } from "next/font/google"
import { Providers } from "@/components/providers/providers"
import { brand } from "@/config/brand"
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
    default: brand.title,
    template: `%s | ${brand.title}`,
  },
  description: brand.description,
  keywords: ["DeFi", "DEX", brand.shortName, "Swap", "Trading", "Cryptocurrency"],
  authors: [{ name: brand.author }],
  creator: brand.author,
  openGraph: {
    type: "website",
    locale: "en_US",
    url: brand.url,
    title: brand.title,
    description: brand.description,
    siteName: brand.siteName,
  },
  twitter: {
    card: "summary_large_image",
    title: brand.title,
    description: brand.description,
    creator: brand.twitterHandle,
  },
  icons: {
    icon: brand.faviconUrl,
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
