import { describe, it, expect } from "vitest"
import {
  DEFAULT_TOKENS,
  getTokenBySymbol,
  getTokenByAddress,
  formatTokenAmount,
  parseTokenAmount,
} from "@/lib/tokens"

describe("DEFAULT_TOKENS", () => {
  it("contains LUX token", () => {
    const lux = DEFAULT_TOKENS.find((t) => t.symbol === "LUX")
    expect(lux).toBeDefined()
    expect(lux?.name).toBe("Lux")
    expect(lux?.decimals).toBe(18)
  })

  it("contains USDC token", () => {
    const usdc = DEFAULT_TOKENS.find((t) => t.symbol === "USDC")
    expect(usdc).toBeDefined()
    expect(usdc?.name).toBe("USD Coin")
    expect(usdc?.decimals).toBe(6)
  })
})

describe("getTokenBySymbol", () => {
  it("finds token by symbol (case insensitive)", () => {
    expect(getTokenBySymbol("LUX")?.symbol).toBe("LUX")
    expect(getTokenBySymbol("lux")?.symbol).toBe("LUX")
  })

  it("returns undefined for unknown token", () => {
    expect(getTokenBySymbol("UNKNOWN")).toBeUndefined()
  })
})

describe("getTokenByAddress", () => {
  it("finds token by address", () => {
    const usdc = getTokenByAddress("0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48")
    expect(usdc?.symbol).toBe("USDC")
  })

  it("is case insensitive", () => {
    const usdc = getTokenByAddress("0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48")
    expect(usdc?.symbol).toBe("USDC")
  })
})

describe("formatTokenAmount", () => {
  it("formats token amounts correctly", () => {
    // 1 ETH (18 decimals)
    expect(formatTokenAmount(BigInt("1000000000000000000"), 18)).toBe("1")

    // 1.5 ETH
    expect(formatTokenAmount(BigInt("1500000000000000000"), 18)).toBe("1.5")

    // 100 USDC (6 decimals)
    expect(formatTokenAmount(BigInt("100000000"), 6)).toBe("100")
  })

  it("respects display decimals", () => {
    // 1.123456789 ETH with 2 display decimals
    expect(formatTokenAmount(BigInt("1123456789000000000"), 18, 2)).toBe("1.12")
  })
})

describe("parseTokenAmount", () => {
  it("parses token amounts correctly", () => {
    // 1 ETH
    expect(parseTokenAmount("1", 18)).toBe(BigInt("1000000000000000000"))

    // 1.5 ETH
    expect(parseTokenAmount("1.5", 18)).toBe(BigInt("1500000000000000000"))

    // 100 USDC
    expect(parseTokenAmount("100", 6)).toBe(BigInt("100000000"))
  })

  it("handles empty string", () => {
    expect(parseTokenAmount("", 18)).toBe(BigInt(0))
  })
})
