"use client"

import * as React from "react"
import { cn } from "./cn"

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

  const iconSrc = logoUri && !error ? logoUri : undefined

  return (
    <div
      className={cn(
        "relative flex-shrink-0 rounded-full overflow-hidden bg-muted flex items-center justify-center",
        className
      )}
      style={{ width: iconSize, height: iconSize }}
    >
      {iconSrc ? (
        <img
          src={iconSrc}
          alt={symbol}
          width={iconSize}
          height={iconSize}
          className="object-cover"
          onError={() => setError(true)}
        />
      ) : (
        <span
          className="font-bold text-muted-foreground"
          style={{ fontSize: iconSize * 0.4 }}
        >
          {symbol.slice(0, 2)}
        </span>
      )}
    </div>
  )
}
