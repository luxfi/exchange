import type { Token } from "@/components/swap/token-input"

// Default token list for Lux Network
export const DEFAULT_TOKENS: Token[] = [
  {
    symbol: "LUX",
    name: "Lux",
    address: "0x0000000000000000000000000000000000000000",
    decimals: 18,
    logoUri: "/tokens/lux.svg",
  },
  {
    symbol: "USDC",
    name: "USD Coin",
    address: "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48",
    decimals: 6,
    logoUri: "/tokens/usdc.svg",
  },
  {
    symbol: "USDT",
    name: "Tether USD",
    address: "0xdAC17F958D2ee523a2206206994597C13D831ec7",
    decimals: 6,
    logoUri: "/tokens/usdt.svg",
  },
  {
    symbol: "ETH",
    name: "Ethereum",
    address: "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2",
    decimals: 18,
    logoUri: "/tokens/eth.svg",
  },
  {
    symbol: "WETH",
    name: "Wrapped Ether",
    address: "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2",
    decimals: 18,
    logoUri: "/tokens/weth.svg",
  },
  {
    symbol: "ZOO",
    name: "Zoo Token",
    address: "0x1234567890123456789012345678901234567890",
    decimals: 18,
    logoUri: "/tokens/zoo.svg",
  },
]

// Get token by symbol
export function getTokenBySymbol(symbol: string): Token | undefined {
  return DEFAULT_TOKENS.find(
    (t) => t.symbol.toLowerCase() === symbol.toLowerCase()
  )
}

// Get token by address
export function getTokenByAddress(address: string): Token | undefined {
  return DEFAULT_TOKENS.find(
    (t) => t.address?.toLowerCase() === address.toLowerCase()
  )
}

// Format token amount with proper decimals
export function formatTokenAmount(
  amount: bigint,
  decimals: number,
  displayDecimals = 4
): string {
  const divisor = BigInt(10 ** decimals)
  const integerPart = amount / divisor
  const remainder = amount % divisor

  const fractionalStr = remainder.toString().padStart(decimals, "0")
  const truncatedFractional = fractionalStr.slice(0, displayDecimals)

  if (parseInt(truncatedFractional) === 0) {
    return integerPart.toString()
  }

  return `${integerPart}.${truncatedFractional.replace(/0+$/, "")}`
}

// Parse token amount string to bigint
export function parseTokenAmount(amount: string, decimals: number): bigint {
  if (!amount || amount === "") return BigInt(0)

  const [integerPart, fractionalPart = ""] = amount.split(".")
  const paddedFractional = fractionalPart.padEnd(decimals, "0").slice(0, decimals)

  return BigInt(integerPart + paddedFractional)
}
