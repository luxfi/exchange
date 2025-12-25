import Link from "next/link";

export default function HomePage() {
  return (
    <main className="flex flex-1 flex-col">
      {/* Hero Section */}
      <section className="relative flex flex-col items-center justify-center px-6 py-24 text-center md:py-32">
        <div className="absolute inset-0 -z-10 bg-gradient-to-b from-fd-primary/5 via-transparent to-transparent" />
        <div className="mx-auto max-w-4xl">
          <h1 className="mb-6 text-4xl font-bold tracking-tight text-fd-foreground md:text-6xl">
            Lux Exchange
          </h1>
          <p className="mx-auto mb-8 max-w-2xl text-lg text-fd-muted-foreground md:text-xl">
            The decentralized exchange built on Lux Network. Trade tokens with deep liquidity,
            minimal slippage, and sub-second finality. No intermediaries, just pure peer-to-peer trading.
          </p>
          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link
              href="/docs"
              className="inline-flex h-12 items-center justify-center rounded-lg bg-fd-primary px-8 text-sm font-medium text-fd-primary-foreground transition-colors hover:bg-fd-primary/90"
            >
              Read Documentation
            </Link>
            <Link
              href="https://exchange.lux.network"
              className="inline-flex h-12 items-center justify-center rounded-lg border border-fd-border bg-fd-background px-8 text-sm font-medium text-fd-foreground transition-colors hover:bg-fd-muted"
            >
              Launch App
            </Link>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="border-t border-fd-border bg-fd-card/50 px-6 py-20">
        <div className="mx-auto max-w-6xl">
          <h2 className="mb-4 text-center text-3xl font-bold text-fd-foreground">
            Trading Features
          </h2>
          <p className="mx-auto mb-12 max-w-2xl text-center text-fd-muted-foreground">
            Everything you need to trade on Lux Network with confidence
          </p>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {/* Spot Trading */}
            <div className="rounded-xl border border-fd-border bg-fd-card p-6 transition-colors hover:border-fd-primary/50">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-fd-primary/10">
                <svg className="h-6 w-6 text-fd-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
              </div>
              <h3 className="mb-2 text-lg font-semibold text-fd-foreground">Spot Trading</h3>
              <p className="text-sm text-fd-muted-foreground">
                Instantly swap tokens at market price with deep liquidity pools and minimal slippage protection.
              </p>
            </div>

            {/* Limit Orders */}
            <div className="rounded-xl border border-fd-border bg-fd-card p-6 transition-colors hover:border-fd-primary/50">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-fd-primary/10">
                <svg className="h-6 w-6 text-fd-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <h3 className="mb-2 text-lg font-semibold text-fd-foreground">Limit Orders</h3>
              <p className="text-sm text-fd-muted-foreground">
                Set your target price and let the protocol execute when conditions are met. No gas until filled.
              </p>
            </div>

            {/* Liquidity Pools */}
            <div className="rounded-xl border border-fd-border bg-fd-card p-6 transition-colors hover:border-fd-primary/50">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-fd-primary/10">
                <svg className="h-6 w-6 text-fd-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
              </div>
              <h3 className="mb-2 text-lg font-semibold text-fd-foreground">Liquidity Pools</h3>
              <p className="text-sm text-fd-muted-foreground">
                Provide liquidity and earn trading fees. Concentrated liquidity for capital-efficient positions.
              </p>
            </div>

            {/* Charts */}
            <div className="rounded-xl border border-fd-border bg-fd-card p-6 transition-colors hover:border-fd-primary/50">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-fd-primary/10">
                <svg className="h-6 w-6 text-fd-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
                </svg>
              </div>
              <h3 className="mb-2 text-lg font-semibold text-fd-foreground">Charts</h3>
              <p className="text-sm text-fd-muted-foreground">
                Professional TradingView charts with real-time price data, indicators, and drawing tools.
              </p>
            </div>

            {/* Portfolio */}
            <div className="rounded-xl border border-fd-border bg-fd-card p-6 transition-colors hover:border-fd-primary/50">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-fd-primary/10">
                <svg className="h-6 w-6 text-fd-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                </svg>
              </div>
              <h3 className="mb-2 text-lg font-semibold text-fd-foreground">Portfolio</h3>
              <p className="text-sm text-fd-muted-foreground">
                Track your holdings, positions, and historical performance across all tokens and pools.
              </p>
            </div>

            {/* API */}
            <div className="rounded-xl border border-fd-border bg-fd-card p-6 transition-colors hover:border-fd-primary/50">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-fd-primary/10">
                <svg className="h-6 w-6 text-fd-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                </svg>
              </div>
              <h3 className="mb-2 text-lg font-semibold text-fd-foreground">API</h3>
              <p className="text-sm text-fd-muted-foreground">
                REST and WebSocket APIs for programmatic trading, market data, and integration with bots.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="border-t border-fd-border px-6 py-16">
        <div className="mx-auto max-w-6xl">
          <div className="grid gap-8 md:grid-cols-4">
            <div className="text-center">
              <div className="text-3xl font-bold text-fd-foreground">$100M+</div>
              <div className="text-sm text-fd-muted-foreground">Total Value Locked</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-fd-foreground">50+</div>
              <div className="text-sm text-fd-muted-foreground">Trading Pairs</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-fd-foreground">&lt;1s</div>
              <div className="text-sm text-fd-muted-foreground">Transaction Finality</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-fd-foreground">0.3%</div>
              <div className="text-sm text-fd-muted-foreground">Trading Fee</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="border-t border-fd-border bg-fd-card/50 px-6 py-16">
        <div className="mx-auto max-w-4xl text-center">
          <h2 className="mb-4 text-2xl font-bold text-fd-foreground">
            Ready to start trading?
          </h2>
          <p className="mb-8 text-fd-muted-foreground">
            Connect your wallet and start trading in seconds. No account required.
          </p>
          <Link
            href="https://exchange.lux.network"
            className="inline-flex h-12 items-center justify-center rounded-lg bg-fd-primary px-8 text-sm font-medium text-fd-primary-foreground transition-colors hover:bg-fd-primary/90"
          >
            Launch Exchange
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-fd-border bg-fd-background px-6 py-12">
        <div className="mx-auto max-w-6xl">
          <div className="grid gap-8 md:grid-cols-4">
            <div>
              <h3 className="mb-4 text-sm font-semibold text-fd-foreground">Lux Exchange</h3>
              <p className="text-sm text-fd-muted-foreground">
                Decentralized trading on Lux Network with deep liquidity and instant finality.
              </p>
            </div>
            <div>
              <h3 className="mb-4 text-sm font-semibold text-fd-foreground">Products</h3>
              <ul className="space-y-2 text-sm text-fd-muted-foreground">
                <li><Link href="/docs/swap" className="hover:text-fd-foreground">Swap</Link></li>
                <li><Link href="/docs/pools" className="hover:text-fd-foreground">Pools</Link></li>
                <li><Link href="/docs/limit-orders" className="hover:text-fd-foreground">Limit Orders</Link></li>
                <li><Link href="/docs/analytics" className="hover:text-fd-foreground">Analytics</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="mb-4 text-sm font-semibold text-fd-foreground">Developers</h3>
              <ul className="space-y-2 text-sm text-fd-muted-foreground">
                <li><Link href="/docs" className="hover:text-fd-foreground">Documentation</Link></li>
                <li><Link href="/docs/api" className="hover:text-fd-foreground">API Reference</Link></li>
                <li><Link href="/docs/sdk" className="hover:text-fd-foreground">SDK</Link></li>
                <li><Link href="https://github.com/luxfi/exchange" className="hover:text-fd-foreground">GitHub</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="mb-4 text-sm font-semibold text-fd-foreground">Community</h3>
              <ul className="space-y-2 text-sm text-fd-muted-foreground">
                <li><Link href="https://twitter.com/luxfi" className="hover:text-fd-foreground">Twitter</Link></li>
                <li><Link href="https://discord.gg/luxfi" className="hover:text-fd-foreground">Discord</Link></li>
                <li><Link href="https://t.me/luxfi" className="hover:text-fd-foreground">Telegram</Link></li>
                <li><Link href="https://lux.network" className="hover:text-fd-foreground">Lux Network</Link></li>
              </ul>
            </div>
          </div>
          <div className="mt-8 border-t border-fd-border pt-8 text-center text-sm text-fd-muted-foreground">
            <p>&copy; {new Date().getFullYear()} Lux Industries. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </main>
  );
}
