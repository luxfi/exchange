import { describe, it, expect } from "vitest"
import {
  luxMainnet,
  luxTestnet,
  zooMainnet,
  zooTestnet,
  hanzoMainnet,
  spcMainnet,
  parsMainnet,
  ethereum,
  sepolia,
  SUPPORTED_CHAINS,
  CHAIN_BY_ID,
  getChainById,
  isLuxEcosystem,
  isLuxChain,
  isZooChain,
  getChainIcon,
} from "../chains"

describe("Chain definitions", () => {
  it("luxMainnet has correct chain ID and working RPC URL", () => {
    expect(luxMainnet.id).toBe(96369)
    expect(luxMainnet.rpcUrls.default.http[0]).toContain("/mainnet/ext/bc/C/rpc")
    expect(luxMainnet.rpcUrls.default.http[0]).not.toMatch(/^https:\/\/api\.lux\.network\/rpc$/)
  })

  it("luxTestnet has correct chain ID and working RPC URL", () => {
    expect(luxTestnet.id).toBe(96368)
    expect(luxTestnet.rpcUrls.default.http[0]).toContain("/testnet/ext/bc/C/rpc")
    expect(luxTestnet.rpcUrls.default.http[0]).not.toMatch(/^https:\/\/api\.lux-test\.network\/rpc$/)
  })

  it("zooMainnet has correct chain ID", () => {
    expect(zooMainnet.id).toBe(200200)
  })

  it("hanzoMainnet has correct chain ID", () => {
    expect(hanzoMainnet.id).toBe(36963)
  })

  it("spcMainnet has correct chain ID", () => {
    expect(spcMainnet.id).toBe(36911)
  })

  it("parsMainnet has correct chain ID", () => {
    expect(parsMainnet.id).toBe(494949)
  })

  it("SUPPORTED_CHAINS includes all chains", () => {
    const ids = SUPPORTED_CHAINS.map((c) => c.id)
    expect(ids).toContain(luxMainnet.id)
    expect(ids).toContain(zooMainnet.id)
    expect(ids).toContain(hanzoMainnet.id)
    expect(ids).toContain(spcMainnet.id)
    expect(ids).toContain(parsMainnet.id)
    expect(ids).toContain(ethereum.id)
    expect(ids).toContain(sepolia.id)
  })

  it("CHAIN_BY_ID has all chains", () => {
    expect(getChainById(96369)).toBeDefined()
    expect(getChainById(200200)).toBeDefined()
    expect(getChainById(36963)).toBeDefined()
    expect(getChainById(36911)).toBeDefined()
    expect(getChainById(494949)).toBeDefined()
    expect(getChainById(1)).toBeDefined()
  })

  it("isLuxEcosystem returns true for all Lux ecosystem chains", () => {
    expect(isLuxEcosystem(luxMainnet.id)).toBe(true)
    expect(isLuxEcosystem(zooMainnet.id)).toBe(true)
    expect(isLuxEcosystem(hanzoMainnet.id)).toBe(true)
    expect(isLuxEcosystem(spcMainnet.id)).toBe(true)
    expect(isLuxEcosystem(parsMainnet.id)).toBe(true)
    expect(isLuxEcosystem(ethereum.id)).toBe(false)
  })

  it("isLuxChain only matches Lux chains", () => {
    expect(isLuxChain(luxMainnet.id)).toBe(true)
    expect(isLuxChain(luxTestnet.id)).toBe(true)
    expect(isLuxChain(zooMainnet.id)).toBe(false)
    expect(isLuxChain(hanzoMainnet.id)).toBe(false)
  })

  it("isZooChain only matches Zoo chains", () => {
    expect(isZooChain(zooMainnet.id)).toBe(true)
    expect(isZooChain(zooTestnet.id)).toBe(true)
    expect(isZooChain(luxMainnet.id)).toBe(false)
  })

  it("getChainIcon returns valid paths for all supported chains", () => {
    for (const chain of SUPPORTED_CHAINS) {
      const icon = getChainIcon(chain.id)
      expect(icon).toBeTruthy()
      expect(icon).toMatch(/^\/tokens\//)
    }
  })
})
