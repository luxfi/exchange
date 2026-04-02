import type { Metadata } from 'next'
import { ClientProviders } from './client-providers'
import './globals.css'

export const metadata: Metadata = {
  title: 'Lux Build - Validator Management',
  description: 'Manage validators, stake LUX, delegate, and monitor network health on the Lux blockchain.',
  openGraph: {
    title: 'Lux Build',
    description: 'Validator management and staking for the Lux network',
    url: 'https://lux.build',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <ClientProviders>{children}</ClientProviders>
      </body>
    </html>
  )
}
