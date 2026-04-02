/**
 * Runtime brand configuration for white-label exchange deployments.
 * Zero baked-in brands — everything loaded from /config.json at runtime.
 *
 * How it works:
 * 1. Default config.json ships in the Docker image (Lux defaults)
 * 2. K8s mounts a ConfigMap over /config.json per deployment
 * 3. SPA calls loadBrandConfig() before first render
 * 4. All brand references use the `brand` export which updates in place
 *
 * For zoo.exchange: mount a ConfigMap with Zoo branding over /config.json
 * For any L2: same image, different ConfigMap
 *
 * KMS integration: set KMS_BRAND_SECRET env var to load brand config from
 * KMS (Infisical) instead of a ConfigMap. The secret should contain the
 * full RuntimeConfig JSON. The /config.json endpoint in the serving layer
 * should proxy to KMS when this env var is set.
 */

/** Theme color overrides applied on top of the default dark/light themes */
export interface BrandTheme {
  /** Primary accent color (buttons, links) */
  accent1?: string
  /** Background color */
  surface1?: string
  /** Secondary surface */
  surface2?: string
  /** Tertiary surface */
  surface3?: string
  /** Primary text color */
  neutral1?: string
  /** Secondary text color */
  neutral2?: string
  /** Success status color */
  statusSuccess?: string
  /** Critical/error status color */
  statusCritical?: string
}

export interface BrandConfig {
  name: string
  title: string
  description: string
  /** Legal entity name for Terms/Privacy, e.g. "Lux Industries Inc." */
  legalEntity: string
  /** Wallet product name, e.g. "Zoo Wallet" or "Lux Wallet" */
  walletName: string
  /** Protocol product name, e.g. "Zoo Protocol" or "Lux Protocol" */
  protocolName: string
  /** Copyright holder name, e.g. "Zoo Labs Foundation" */
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
  github: '',
  discord: '',
  logoUrl: '',
  faviconUrl: '/favicon.ico',
  primaryColor: '#FC72FF',
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
 * KMS integration: when the serving layer sets KMS_BRAND_SECRET, it should
 * proxy /config.json to fetch the secret value from KMS (Infisical). The
 * SPA itself always fetches /config.json — KMS resolution is server-side.
 */
export async function loadBrandConfig(): Promise<RuntimeConfig> {
  try {
    const res = await fetch('/config.json')
    if (!res.ok) throw new Error(`${res.status}`)
    const config: RuntimeConfig = await res.json()

    // Apply brand overrides
    if (config.brand) {
      Object.assign(brand, config.brand)
    }

    // Derive convenience fields from name if not explicitly set
    if (!brand.walletName && brand.name) {
      brand.walletName = brand.name.replace(/\s*exchange\s*/i, '') + ' Wallet'
    }
    if (!brand.protocolName && brand.name) {
      brand.protocolName = brand.name.replace(/\s*exchange\s*/i, '') + ' Protocol'
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
