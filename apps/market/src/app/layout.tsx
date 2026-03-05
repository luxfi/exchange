import type { Metadata } from 'next'
import { Providers } from './providers'
import './globals.css'

export const metadata: Metadata = {
  title: 'Lux Market - NFT Marketplace',
  description:
    'Trade Genesis NFTs, collect digital assets, and participate in the Lux NFT ecosystem with Seaport-powered P2P trading and LSSVM AMM liquidity.',
  openGraph: {
    title: 'Lux Market',
    description: 'The NFT marketplace for the Lux ecosystem',
    url: 'https://lux.market',
  },
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
