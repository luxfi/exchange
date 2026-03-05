import type { Metadata, Viewport } from 'next'
import { Providers } from './providers'
import './globals.css'

export const metadata: Metadata = {
  title: {
    default: 'Lux Market - NFT Marketplace',
    template: '%s | Lux Market',
  },
  description:
    'Trade NFTs across all Lux chains. Seaport-powered P2P trading with LSSVM AMM liquidity pools. Genesis NFTs with permanent LUX staking rewards.',
  openGraph: {
    title: 'Lux Market',
    description: 'The NFT marketplace for the Lux ecosystem',
    url: 'https://lux.market',
    siteName: 'Lux Market',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Lux Market',
    description: 'Trade NFTs across all Lux chains',
  },
  robots: { index: true, follow: true },
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#0a0a0a',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
