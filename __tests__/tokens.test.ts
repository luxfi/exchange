import { describe, it, expect } from "vitest"
import {
  DEFAULT_TOKENS,
  LUX_MAINNET_TOKENS,
  ETHEREUM_MAINNET_TOKENS,
  getTokenBySymbol,
  getTokenByAddress,
  formatTokenAmount,
  parseTokenAmount,
  getDefaultTokenPair,
  getNativeToken,
} from "@/lib/tokens"
import { luxMainnet, ethereum } from "@/lib/chains"

describe("DEFAULT_TOKENS", () => {
  it("contains LUX token", () => {
    const lux = DEFAULT_TOKENS.find((t) => t.symbol === "LUX")
    expect(lux).toBeDefined()
    expect(lux?.name).toBe("Lux")
    expect(lux?.decimals).toBe(18)
  })

  it("contains LUSD token", () => {
    const lusd = DEFAULT_TOKENS.find((t) => t.symbol === "LUSD")
    expect(lusd).toBeDefined()
    expect(lusd?.name).toBe("Lux USD")
    expect(lusd?.decimals).toBe(18)
  })
})

describe("getTokenBySymbol", () => {
  it("finds token by symbol (case insensitive)", () => {
    expect(getTokenBySymbol(luxMainnet.id, "LUX")?.symbol).toBe("LUX")
    expect(getTokenBySymbol(luxMainnet.id, "lux")?.symbol).toBe("LUX")
  })

  it("returns undefined for unknown token", () => {
    expect(getTokenBySymbol(luxMainnet.id, "UNKNOWN")).toBeUndefined()
  })

  it("finds USDC on Ethereum", () => {
    expect(getTokenBySymbol(ethereum.id, "USDC")?.symbol).toBe("USDC")
  })
})

describe("getTokenByAddress", () => {
  it("finds token by address on Ethereum", () => {
    const usdc = getTokenByAddress(ethereum.id, "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48")
    expect(usdc?.symbol).toBe("USDC")
  })

  it("is case insensitive", () => {
    const usdc = getTokenByAddress(ethereum.id, "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48")
    expect(usdc?.symbol).toBe("USDC")
  })
})

describe("getDefaultTokenPair", () => {
  it("returns LUX -> LUSD for Lux mainnet", () => {
    const pair = getDefaultTokenPair(luxMainnet.id)
    expect(pair?.input.symbol).toBe("LUX")
    expect(pair?.output.symbol).toBe("LUSD")
  })

  it("returns ETH -> USDC for Ethereum", () => {
    const pair = getDefaultTokenPair(ethereum.id)
    expect(pair?.input.symbol).toBe("ETH")
    expect(pair?.output.symbol).toBe("USDC")
  })
})

describe("getNativeToken", () => {
  it("returns LUX for Lux mainnet", () => {
    const native = getNativeToken(luxMainnet.id)
    expect(native?.symbol).toBe("LUX")
    expect(native?.isNative).toBe(true)
  })

  it("returns ETH for Ethereum", () => {
    const native = getNativeToken(ethereum.id)
    expect(native?.symbol).toBe("ETH")
    expect(native?.isNative).toBe(true)
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
