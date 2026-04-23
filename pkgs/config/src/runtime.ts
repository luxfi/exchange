// Runtime deployment config, loaded from /config.json.
//
// Orthogonal to brand.ts (static, per-brand). This file is per-deployment:
// hanzoai/spa v1.2+ templates /config.json from SPA_* env vars at pod
// startup. One image runs on every tenant; white-label operators set
// SPA_ID_HOST, SPA_ONBOARDING_URL, etc., at deploy time and the SPA picks
// them up on first fetch.
//
// Shape is intentionally tiny and optional. If /config.json is absent or
// the fields aren't set, consumers render nothing — there are no default
// "example.com" fallbacks.

export type RuntimeConfig = {
  /** Identity provider host, e.g. https://id.dev.satschel.com.
   *  If set, the NavBar onboarding gate redirects to `${idHost}/signup`. */
  readonly idHost?: string
  /** Exact onboarding redirect URL. Wins over idHost if both are set. */
  readonly onboardingUrl?: string
}

let cached: RuntimeConfig | null = null

function sanitize(raw: unknown): RuntimeConfig {
  if (raw == null || typeof raw !== 'object') return {}
  const o = raw as Record<string, unknown>
  const out: { idHost?: string; onboardingUrl?: string } = {}
  if (typeof o.idHost === 'string' && o.idHost) out.idHost = o.idHost.replace(/\/+$/, '')
  if (typeof o.onboardingUrl === 'string' && o.onboardingUrl) out.onboardingUrl = o.onboardingUrl
  return out
}

/** Fetch /config.json once per page load. Safe to re-call — cached. */
export async function loadRuntimeConfig(): Promise<RuntimeConfig> {
  if (cached) return cached
  try {
    const res = await fetch('/config.json', { cache: 'no-store' })
    if (!res.ok) throw new Error(`${res.status}`)
    cached = sanitize(await res.json())
  } catch {
    cached = {}
  }
  return cached
}

/** Synchronous accessor. Returns `{}` if loadRuntimeConfig() hasn't resolved. */
export function getRuntimeConfig(): RuntimeConfig {
  return cached ?? {}
}

/** Test-only. */
export function _resetRuntimeConfigForTests(): void {
  cached = null
}
