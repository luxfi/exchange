/**
 * Runtime brand configuration for white-label deployments.
 *
 * Single source of truth: brand.json mounted via ConfigMap per deployment.
 *
 * How it works:
 * 1. Build copies brand.json from the brand package into the static dir
 * 2. K8s mounts a ConfigMap over /brand.json per deployment
 * 3. SPA calls loadBrandConfig() before first render
 * 4. All brand references use the `brand` export which updates in place
 *
 * Secrets: Use KMS for any sensitive values (API keys, WalletConnect project IDs).
 */

/** Theme color overrides applied on top of the default dark/light themes.
 * All fields are optional — only set what you want to customize.
 * The exchange UI is monochrome by default; accent1 is the primary brand color.
 */
export interface BrandTheme {
  /** Primary accent color (buttons, links, active states) */
  accent1?: string
  /** Accent hover state */
  accent1Hovered?: string
  /** Secondary accent (derived from accent1 + surface1 if not set) */
  accent2?: string
  /** Tertiary accent */
  accent3?: string
  /** Primary background */
  surface1?: string
  /** Secondary background (cards, panels) */
  surface2?: string
  /** Tertiary background (inputs, wells) */
  surface3?: string
  /** Primary text */
  neutral1?: string
  /** Secondary text */
  neutral2?: string
  /** Tertiary text */
  neutral3?: string
  /** Text on accent backgrounds (auto-derived from accent1 if not set) */
  neutralContrast?: string
  /** Page background (defaults to surface1 if not set) */
  background?: string
  /** Success color (positive price changes, confirmed actions) */
  statusSuccess?: string
  /** Critical/error color (negative price changes, failed actions) */
  statusCritical?: string
  /** Warning color */
  statusWarning?: string
  /** Scrim/overlay color */
  scrim?: string
}

export interface BrandConfig {
  name: string
  title: string
  description: string
  /** Short product abbreviation — used in UI labels */
  shortName: string
  /** Casual lab name — used in social/legal text */
  labsName: string
  /** Legal entity name for Terms/Privacy */
  legalEntity: string
  /** Wallet product name */
  walletName: string
  /** Protocol product name */
  protocolName: string
  /** Copyright holder name */
  copyrightHolder: string
  appDomain: string
  docsDomain: string
  infoDomain: string
  gatewayDomain: string
  wsDomain: string
  helpUrl: string
  termsUrl: string
  privacyUrl: string
  downloadUrl: string
  complianceEmail: string
  supportEmail: string
  twitter: string
  farcaster: string
  linkedin: string
  tiktok: string
  github: string
  discord: string
  logoUrl: string
  faviconUrl: string
  primaryColor: string
  defaultChainId: number
  supportedChainIds: number[]
  walletConnectProjectId: string
  insightsHost: string
  insightsApiKey: string
  /** Theme color overrides for dark and light modes */
  theme?: {
    light?: BrandTheme
    dark?: BrandTheme
  }
}

export interface RuntimeConfig {
  brand: Partial<BrandConfig>
  chains: {
    defaultChainId: number
    supported: number[]
  }
  rpc: Record<string, string>
  api: {
    graphql: string
    gateway: string
    insights: string
  }
  walletConnect: {
    projectId: string
  }
}

// Mutable brand — updated by loadBrandConfig() from /config.json
// Defaults are deliberately generic — override via config.json per deployment
export const brand: BrandConfig = {
  name: '',
  title: '',
  description: '',
  shortName: '',
  labsName: '',
  legalEntity: '',
  walletName: '',
  protocolName: '',
  copyrightHolder: '',
  appDomain: '',
  docsDomain: '',
  infoDomain: '',
  gatewayDomain: '',
  wsDomain: '',
  helpUrl: '',
  termsUrl: '',
  privacyUrl: '',
  downloadUrl: '',
  complianceEmail: '',
  supportEmail: '',
  twitter: '',
  farcaster: '',
  linkedin: '',
  tiktok: '',
  github: '',
  discord: '',
  logoUrl: '',
  faviconUrl: '/favicon.ico',
  primaryColor: '#FFFFFF',
  defaultChainId: 1,
  supportedChainIds: [],
  walletConnectProjectId: '',
  insightsHost: '',
  insightsApiKey: '',
}

// Full runtime config (includes RPC, API endpoints, etc.)
export let runtimeConfig: RuntimeConfig | null = null

/**
 * Load brand config from /config.json. Call once before React renders.
 * The config.json is either the default shipped in the image, or a
 * ConfigMap mounted by K8s for white-label deployments.
 *
 * Loads /brand.json. In K8s, this is a ConfigMap mount.
 * Secrets (API keys) come from KMS, injected server-side.
 */
export async function loadBrandConfig(): Promise<RuntimeConfig> {
  try {
    const res = await fetch('/brand.json')
    if (!res.ok) throw new Error(`${res.status}`)
    const config: RuntimeConfig = await res.json()

    // Apply brand overrides
    if (config.brand) {
      Object.assign(brand, config.brand)
    }

    // Derive convenience fields from name if not explicitly set
    const baseName = brand.name.replace(/\s*exchange\s*/i, '').trim()
    if (!brand.shortName && baseName) {
      // Short names: 3 chars or fewer get uppercased, rest stay as-is
      brand.shortName = baseName.length <= 3 ? baseName.toUpperCase() : baseName
    }
    if (!brand.labsName && baseName) {
      brand.labsName = baseName + ' Labs'
    }
    if (!brand.walletName && baseName) {
      brand.walletName = brand.shortName + ' Wallet'
    }
    if (!brand.protocolName && baseName) {
      brand.protocolName = brand.shortName + ' Protocol'
    }
    if (!brand.copyrightHolder) {
      brand.copyrightHolder = brand.legalEntity
    }

    // Apply chain config
    if (config.chains) {
      brand.defaultChainId = config.chains.defaultChainId ?? brand.defaultChainId
      brand.supportedChainIds = config.chains.supported ?? brand.supportedChainIds
    }

    // Apply walletconnect
    if (config.walletConnect?.projectId) {
      brand.walletConnectProjectId = config.walletConnect.projectId
    }

    // Apply analytics
    if (config.api?.insights) {
      brand.insightsHost = config.api.insights
    }

    // Update document title and favicon
    if (typeof document !== 'undefined') {
      if (config.brand?.title) {
        document.title = config.brand.title
      }
      if (config.brand?.faviconUrl) {
        const link = document.querySelector("link[rel*='icon']") as HTMLLinkElement | null
        if (link) {
          link.href = config.brand.faviconUrl
        }
      }
    }

    // Inject brand theme colors as CSS custom property overrides.
    // This overrides both the styled-components theme and the @hanzo/gui/Spore
    // theme tokens (--accent1, --surface1, --neutral1, etc.) at runtime.
    if (typeof document !== 'undefined' && brand.theme) {
      const prefersDark = window.matchMedia?.('(prefers-color-scheme: dark)').matches
      const bt = prefersDark ? brand.theme.dark : brand.theme.light
      if (bt) {
        const root = document.documentElement
        const set = (prop: string, val?: string) => { if (val) root.style.setProperty(prop, val) }
        set('--accent1', bt.accent1)
        set('--accent1Hovered', bt.accent1Hovered)
        set('--accent2', bt.accent2)
        set('--accent3', bt.accent3)
        set('--surface1', bt.surface1)
        set('--surface1Hovered', bt.surface1)
        set('--surface2', bt.surface2)
        set('--surface3', bt.surface3)
        set('--neutral1', bt.neutral1)
        set('--neutral2', bt.neutral2)
        set('--neutral3', bt.neutral3)
        set('--neutralContrast', bt.neutralContrast)
        set('--statusSuccess', bt.statusSuccess)
        set('--statusCritical', bt.statusCritical)
        // Also override the page background
        if (bt.background || bt.surface1) {
          root.style.setProperty('background', bt.background || bt.surface1 || '')
        }
      }
    }

    runtimeConfig = config
    return config
  } catch {
    // Config fetch failed — use defaults (works for local dev)
    return {
      brand: {},
      chains: { defaultChainId: brand.defaultChainId, supported: brand.supportedChainIds },
      rpc: {},
      api: { graphql: '', gateway: '', insights: brand.insightsHost },
      walletConnect: { projectId: '' },
    }
  }
}

export function getBrandUrl(path: string): string {
  return `https://${brand.appDomain}${path}`
}

export function getDocsUrl(path: string): string {
  return `https://${brand.docsDomain}${path}`
}

export function getGatewayUrl(path: string): string {
  return `https://${brand.gatewayDomain}${path}`
}

export function getWsUrl(path: string): string {
  return `wss://${brand.wsDomain}${path}`
}

export function getRpcUrl(chainId: number): string | undefined {
  return runtimeConfig?.rpc?.[String(chainId)]
}

export function getApiUrl(key: keyof RuntimeConfig['api']): string {
  return runtimeConfig?.api?.[key] ?? ''
}
