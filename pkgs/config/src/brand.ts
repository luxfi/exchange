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
 */

export interface BrandConfig {
  name: string
  title: string
  description: string
  /** Legal entity name for Terms/Privacy, e.g. "Lux Industries Inc." */
  legalEntity: string
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

    // Update document title
    if (typeof document !== 'undefined' && config.brand?.title) {
      document.title = config.brand.title
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
