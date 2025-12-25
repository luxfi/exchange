"use client"

import * as React from "react"
import Image from "next/image"
import { cn } from "@/lib/utils"

// Token icon mapping for known tokens
const TOKEN_ICONS: Record<string, string> = {
  // Lux ecosystem
  LUX: "/tokens/lux.svg",
  WLUX: "/tokens/wlux.svg",
  LETH: "/tokens/leth.svg",
  LBTC: "/tokens/lbtc.svg",
  LUSD: "/tokens/lusd.svg",
  // Zoo ecosystem
  ZOO: "/tokens/zoo.svg",
  WZOO: "/tokens/wzoo.svg",
  // Ethereum ecosystem
  ETH: "/tokens/eth.svg",
  WETH: "/tokens/weth.svg",
  USDC: "/tokens/usdc.svg",
  USDT: "/tokens/usdt.svg",
  DAI: "/tokens/dai.svg",
  WBTC: "/tokens/wbtc.svg",
}

interface TokenIconProps {
  symbol: string
  logoUri?: string
  size?: "sm" | "md" | "lg" | "xl"
  className?: string
}

const sizeMap = {
  sm: 20,
  md: 24,
  lg: 32,
  xl: 40,
}

export function TokenIcon({
  symbol,
  logoUri,
  size = "md",
  className,
}: TokenIconProps) {
  const [error, setError] = React.useState(false)
  const iconSize = sizeMap[size]

  // Determine the icon source
  const iconSrc = React.useMemo(() => {
    if (logoUri && !error) return logoUri
    if (TOKEN_ICONS[symbol.toUpperCase()]) return TOKEN_ICONS[symbol.toUpperCase()]
    return "/tokens/default.svg"
  }, [symbol, logoUri, error])

  return (
    <div
      className={cn(
        "relative flex-shrink-0 rounded-full overflow-hidden bg-muted",
        className
      )}
      style={{ width: iconSize, height: iconSize }}
    >
      <Image
        src={iconSrc}
        alt={symbol}
        width={iconSize}
        height={iconSize}
        className="object-cover"
        onError={() => setError(true)}
        unoptimized
      />
    </div>
  )
}

// Dual token icon for pool pairs
interface DualTokenIconProps {
  token0Symbol: string
  token1Symbol: string
  token0Logo?: string
  token1Logo?: string
  size?: "sm" | "md" | "lg"
  className?: string
}

export function DualTokenIcon({
  token0Symbol,
  token1Symbol,
  token0Logo,
  token1Logo,
  size = "md",
  className,
}: DualTokenIconProps) {
  const iconSize = sizeMap[size]
  const offset = Math.floor(iconSize * 0.6)

  return (
    <div
      className={cn("relative flex-shrink-0", className)}
      style={{ width: iconSize + offset, height: iconSize }}
    >
      <div className="absolute left-0 z-10">
        <TokenIcon symbol={token0Symbol} logoUri={token0Logo} size={size} />
      </div>
      <div
        className="absolute z-0"
        style={{ left: offset }}
      >
        <TokenIcon symbol={token1Symbol} logoUri={token1Logo} size={size} />
      </div>
    </div>
  )
}
