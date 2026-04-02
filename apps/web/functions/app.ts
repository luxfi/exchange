import { poolImageHandler } from 'functions/api/image/pools'
import { positionImageHandler } from 'functions/api/image/positions'
import { tokenImageHandler } from 'functions/api/image/tokens'
import { metaTagInjectionMiddleware } from 'functions/components/metaTagInjector'
import { rewriteProxiedCookies } from 'functions/cookie-utils'
import { Context, Hono } from 'hono'
import { proxy } from 'hono/proxy'

type Bindings = {
  ASSETS?: { fetch: typeof fetch } // Only present on Cloudflare Workers
}

/** Platform-specific dependencies injected by each entry point. */
interface AppConfig {
  fetchSpaHtml: (c: Context) => Promise<Response>
  getEntryGatewayUrl: (c: Context) => string
  getWebSocketUrl: (c: Context) => string
  getTrustedClientIp: (c: Context) => string | undefined
}

// ── Shared constants ─────────────────────────────────────────────────
export const ENTRY_GATEWAY_URLS = {
  development: 'https://gw.lux.exchange/conversion',
  staging: 'https://gw.lux.exchange/conversion',
  production: 'https://gw.lux.exchange/conversion',
} as const

// Statsig proxy -- routed through gw.lux.exchange in production
const STATSIG_PROXY_TARGET = 'https://gw.lux.exchange/gateway'

export const WEBSOCKET_URLS = {
  development: 'wss://ws.lux.exchange/staging',
  staging: 'wss://ws.lux.exchange/staging',
  production: 'wss://ws.lux.exchange',
} as const

// ── Cache-Control middleware for image routes ───────────────────────────
function cacheControl(maxAge: number) {
  return async (c: Context, next: () => Promise<void>) => {
    await next()
    if (c.res.ok) {
      c.res.headers.set('Cache-Control', `public, max-age=${maxAge}`)
    }
  }
}

export function createApp({ fetchSpaHtml, getEntryGatewayUrl, getWebSocketUrl, getTrustedClientIp }: AppConfig) {
  const app = new Hono<{ Bindings: Bindings }>()

  // ── Security headers middleware ──────────────────────────────────────
  app.use('*', async (c, next) => {
    await next()
    c.res.headers.set('X-Frame-Options', 'DENY')
    c.res.headers.set('X-Content-Type-Options', 'nosniff')
    c.res.headers.set('Strict-Transport-Security', 'max-age=31536000; includeSubDomains; preload')
    c.res.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin')
    c.res.headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=(), interest-cohort=()')
    c.res.headers.set('X-DNS-Prefetch-Control', 'on')
  })

  // ── OG image routes ────────────────────────────────────────────────────
  app.get('/api/image/tokens/:networkName/:tokenAddress', cacheControl(604800), tokenImageHandler)

  app.get('/api/image/pools/:networkName/:poolAddress', cacheControl(604800), poolImageHandler)

  app.get('/api/image/positions/:version/:chainName/:identifier', cacheControl(604800), positionImageHandler)

  // ── BFF proxy: entry-gateway ─────────────────────────────────────────
  app.all('/entry-gateway/*', async (c) => {
    const backendUrl = getEntryGatewayUrl(c)
    const path = c.req.path.slice('/entry-gateway'.length) || '/'
    const query = new URL(c.req.url).search

    // Forward the real client IP so the EGW authorizer (and downstream
    // providers like Coinbase) see the user's IP, not the proxy's IP.
    // Each platform provides a trusted IP source — Cloudflare sets
    // cf-connecting-ip automatically; Vercel sets x-real-ip at the TCP
    // level. We always overwrite cf-connecting-ip from the trusted source
    // to prevent clients from spoofing it (especially on Vercel where
    // there's no Cloudflare to sanitize headers).
    const clientIp = getTrustedClientIp(c)

    const targetUrl = `${backendUrl}${path}${query}`
    // redirect:'manual' prevents SSRF via 3xx redirects to internal services
    const response = await proxy(targetUrl, {
      ...c.req,
      headers: {
        ...c.req.header(),
        host: undefined,
        ...(clientIp ? { 'cf-connecting-ip': clientIp } : {}),
      },
      redirect: 'manual',
    })

    // Rewrite Set-Cookie headers so cookies work on non-.lux.exchange domains
    // (Vercel previews, staging, etc.)
    return rewriteProxiedCookies(response)
  })

  // ── BFF proxy: config ──────────────────────────────────────────────
  app.all('/config/*', async (c) => {
    const path = c.req.path.replace(/^\/config/, '/v1/statsig-proxy')
    const query = new URL(c.req.url).search

    return proxy(`${STATSIG_PROXY_TARGET}${path}${query}`, {
      ...c.req,
      headers: {
        ...c.req.header(),
        host: undefined,
      },
      redirect: 'manual',
    })
  })

  // ── BFF proxy: WebSocket ────────────────────────────────────────────
  // In production, clients connect directly to the backend WebSocket
  // service — see getWebSocketUrl() in pkgs/api/src/getWebSocketUrl.ts.
  // This proxy is used in local dev (Vite + @cloudflare/vite-plugin) and
  // on Cloudflare Workers staging, where the CF Workers runtime handles
  // the WebSocket upgrade natively via fetch().
  // Headers are stripped to avoid forwarding the local dev origin/host
  // to the backend, which would reject them.
  app.get('/ws', async (c) => {
    const wsUrl = getWebSocketUrl(c)
    const headers = new Headers(c.req.raw.headers)
    headers.delete('host')
    headers.delete('origin')
    try {
      return await fetch(wsUrl, { headers })
    } catch (err) {
      return c.text(`WebSocket proxy error: ${err}`, 502)
    }
  })

  // ── Catch-all: SPA serving + meta tag injection ────────────────────────
  app.all('*', async (c: Context) => {
    const url = new URL(c.req.url)

    const next = async () => {
      const response = await fetchSpaHtml(c)
      c.res = response
    }

    // API routes should not be processed by meta tag injection
    if (url.pathname.startsWith('/api/')) {
      await next()
      return c.res
    }

    // For non-API routes, use meta tag injection middleware
    return metaTagInjectionMiddleware(c, next)
  })

  return app
}
