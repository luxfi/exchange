import { describe, it, expect } from "vitest"
import {
  getTokensForChain,
  getNativeToken,
  getDefaultTokenPair,
  getDefaultOutputToken,
  getWrappedNativeToken,
} from "../tokens"
import {
  luxMainnet,
  luxTestnet,
  zooMainnet,
  hanzoMainnet,
  spcMainnet,
  parsMainnet,
  ethereum,
} from "../chains"

describe("Token definitions", () => {
  it("Lux mainnet has native token", () => {
    const native = getNativeToken(luxMainnet.id)
    expect(native).toBeDefined()
    expect(native!.symbol).toBe("LUX")
    expect(native!.isNative).toBe(true)
  })

  it("Zoo mainnet has native token", () => {
    const native = getNativeToken(zooMainnet.id)
    expect(native).toBeDefined()
    expect(native!.symbol).toBe("ZOO")
    expect(native!.isNative).toBe(true)
  })

  it("Hanzo mainnet has native token", () => {
    const native = getNativeToken(hanzoMainnet.id)
    expect(native).toBeDefined()
    expect(native!.symbol).toBe("HANZO")
    expect(native!.isNative).toBe(true)
  })

  it("Pars mainnet has native token", () => {
    const native = getNativeToken(parsMainnet.id)
    expect(native).toBeDefined()
    expect(native!.symbol).toBe("PARS")
    expect(native!.isNative).toBe(true)
  })
})

describe("getDefaultOutputToken", () => {
  it("returns LUSDC for Lux mainnet", () => {
    const token = getDefaultOutputToken(luxMainnet.id)
    expect(token).toBeDefined()
    expect(token!.symbol).toBe("LUSDC")
  })

  it("returns WZOO for Zoo mainnet", () => {
    const token = getDefaultOutputToken(zooMainnet.id)
    expect(token).toBeDefined()
    expect(token!.symbol).toBe("WZOO")
  })

  it("returns LUSDC for Hanzo mainnet (subnet fallback)", () => {
    const token = getDefaultOutputToken(hanzoMainnet.id)
    expect(token).toBeDefined()
    expect(token!.symbol).toBe("LUSDC")
  })

  it("returns LUSDC for Pars mainnet (subnet fallback)", () => {
    const token = getDefaultOutputToken(parsMainnet.id)
    expect(token).toBeDefined()
    expect(token!.symbol).toBe("LUSDC")
  })

  it("returns something for SPC mainnet (subnet fallback to wrapped native)", () => {
    const token = getDefaultOutputToken(spcMainnet.id)
    // SPC has LUSDC with zero address, so getTokenBySymbol should find it
    expect(token).toBeDefined()
  })

  it("returns USDC for Ethereum", () => {
    const token = getDefaultOutputToken(ethereum.id)
    expect(token).toBeDefined()
    expect(token!.symbol).toBe("USDC")
  })
})

describe("getDefaultTokenPair", () => {
  it("returns input/output pair for Lux mainnet", () => {
    const pair = getDefaultTokenPair(luxMainnet.id)
    expect(pair).toBeDefined()
    expect(pair!.input.symbol).toBe("LUX")
    expect(pair!.output.symbol).toBe("LUSDC")
  })

  it("returns input/output pair for Zoo mainnet", () => {
    const pair = getDefaultTokenPair(zooMainnet.id)
    expect(pair).toBeDefined()
    expect(pair!.input.symbol).toBe("ZOO")
    expect(pair!.output.symbol).toBe("WZOO")
  })

  it("returns input/output pair for Hanzo mainnet", () => {
    const pair = getDefaultTokenPair(hanzoMainnet.id)
    expect(pair).toBeDefined()
    expect(pair!.input.symbol).toBe("HANZO")
    expect(pair!.output.symbol).toBe("LUSDC")
  })

  it("returns input/output pair for Pars mainnet", () => {
    const pair = getDefaultTokenPair(parsMainnet.id)
    expect(pair).toBeDefined()
    expect(pair!.input.symbol).toBe("PARS")
    expect(pair!.output.symbol).toBe("LUSDC")
  })
})
