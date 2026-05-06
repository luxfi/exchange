// Liquid EVM (regulated securities) chain ids and the corresponding Liquidity onboarding flow.
// Source of truth: ~/work/zoo/exchange/featured-tokens.ts (mainnet/testnet/devnet).

const LIQUID_EVM_CHAIN_IDS = new Set<number>([8675309, 8675310, 8675311])

const ONBOARDING_BY_CHAIN: Record<number, string> = {
  8675309: 'https://id.example.com/onboarding',
  8675310: 'https://id.test.example.com/onboarding',
  8675311: 'https://id.dev.example.com/onboarding',
}

export function isRegulatedToken(token: { chainId?: number } | undefined | null): boolean {
  return !!token?.chainId && LIQUID_EVM_CHAIN_IDS.has(token.chainId)
}

export function onboardingUrlFor(chainId: number | undefined): string {
  if (chainId && ONBOARDING_BY_CHAIN[chainId]) {
    return ONBOARDING_BY_CHAIN[chainId]
  }
  return ONBOARDING_BY_CHAIN[8675309]
}

export function isOnboarded(): boolean {
  return typeof window !== 'undefined' && window.localStorage.getItem('liquidity_onboarded') === 'true'
}
