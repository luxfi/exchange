const LUX_CHAIN_IDS = new Set([96369, 96368, 200200, 200201])

export function isLuxChain(chainId: number): boolean {
  return LUX_CHAIN_IDS.has(chainId)
}
