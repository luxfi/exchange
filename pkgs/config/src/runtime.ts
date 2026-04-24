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

/** Max bytes we'll accept for any single string field. Defensive cap — a
 *  malicious or misconfigured /config.json must not blow up render. */
const MAX_STRING_LEN = 500

/** Max number of disclosure bullets. */
const MAX_BULLETS = 10

/** Max chars per bullet. */
const MAX_BULLET_LEN = 200

/** Regulated-asset disclosure text. Rendered as plain text — never HTML.
 *  All fields optional; consumers fill in defaults when rendering. */
export type SecurityDisclosureConfig = {
  readonly title?: string
  readonly body?: string
  readonly bullets?: readonly string[]
}

export type RuntimeConfig = {
  /** Identity provider host, e.g. https://id.dev.satschel.com.
   *  If set, the NavBar onboarding gate redirects to `${idHost}/signup`. */
  readonly idHost?: string
  /** Exact onboarding redirect URL. Wins over idHost if both are set. */
  readonly onboardingUrl?: string
  /** When true, tokens tagged `security` in the `securityListUrl` list
   *  swap the primary CTA for a "Verify ID" redirect until the user is
   *  verified. Off-by-default — opt-in per deployment. */
  readonly securityGateEnabled?: boolean
  /** HTTPS URL of a Uniswap-schema token list whose tokens carry the
   *  `security` tag. Fetched once on mount, cached. Non-HTTPS URLs are
   *  rejected by sanitize() to block mixed-content + exfil vectors. */
  readonly securityListUrl?: string
  /** Override copy for the disclosure box. All fields optional — consumer
   *  supplies sensible defaults when missing. */
  readonly securityDisclosure?: SecurityDisclosureConfig
  /** localStorage key that, when present and truthy, marks the session as
   *  verified. Optional — defaults applied by the consuming hook. */
  readonly verifiedSignalStorageKey?: string
}

let cached: RuntimeConfig | null = null

function clampString(v: unknown, max = MAX_STRING_LEN): string | undefined {
  if (typeof v !== 'string' || v.length === 0) return undefined
  return v.length > max ? v.slice(0, max) : v
}

function isHttpsUrl(v: string): boolean {
  try {
    const u = new URL(v)
    return u.protocol === 'https:'
  } catch {
    return false
  }
}

function sanitizeBullets(raw: unknown): readonly string[] | undefined {
  let arr: unknown = raw
  if (typeof raw === 'string') {
    try {
      arr = JSON.parse(raw)
    } catch {
      return undefined
    }
  }
  if (!Array.isArray(arr)) return undefined
  const out: string[] = []
  for (const item of arr) {
    if (out.length >= MAX_BULLETS) break
    const s = clampString(item, MAX_BULLET_LEN)
    if (s) out.push(s)
  }
  return out.length > 0 ? Object.freeze(out) : undefined
}

function sanitizeDisclosure(o: Record<string, unknown>): SecurityDisclosureConfig | undefined {
  const nested = o.securityDisclosure
  const src =
    nested && typeof nested === 'object'
      ? (nested as Record<string, unknown>)
      : {
          title: o.securityDisclosureTitle,
          body: o.securityDisclosureBody,
          bullets: o.securityDisclosureBullets,
        }
  const title = clampString(src.title)
  const body = clampString(src.body)
  const bullets = sanitizeBullets(src.bullets)
  if (!title && !body && !bullets) return undefined
  const out: SecurityDisclosureConfig = {}
  if (title) (out as { title?: string }).title = title
  if (body) (out as { body?: string }).body = body
  if (bullets) (out as { bullets?: readonly string[] }).bullets = bullets
  return Object.freeze(out)
}

function sanitize(raw: unknown): RuntimeConfig {
  if (raw == null || typeof raw !== 'object') return {}
  const o = raw as Record<string, unknown>
  const out: {
    idHost?: string
    onboardingUrl?: string
    securityGateEnabled?: boolean
    securityListUrl?: string
    securityDisclosure?: SecurityDisclosureConfig
    verifiedSignalStorageKey?: string
  } = {}
  if (typeof o.idHost === 'string' && o.idHost) out.idHost = o.idHost.replace(/\/+$/, '')
  if (typeof o.onboardingUrl === 'string' && o.onboardingUrl) out.onboardingUrl = o.onboardingUrl
  if (o.securityGateEnabled === true) out.securityGateEnabled = true
  if (typeof o.securityListUrl === 'string' && isHttpsUrl(o.securityListUrl)) {
    out.securityListUrl = o.securityListUrl.replace(/\/+$/, '')
  }
  const disclosure = sanitizeDisclosure(o)
  if (disclosure) out.securityDisclosure = disclosure
  const vkey = clampString(o.verifiedSignalStorageKey, 100)
  if (vkey) out.verifiedSignalStorageKey = vkey
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
