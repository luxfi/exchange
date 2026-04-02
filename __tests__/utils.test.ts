import { describe, it, expect } from "vitest"
import {
  cn,
  formatNumber,
  shortenAddress,
  formatCurrency,
  formatPercent,
  isAddress,
} from "@/lib/utils"

describe("cn utility", () => {
  it("merges class names", () => {
    expect(cn("foo", "bar")).toBe("foo bar")
  })

  it("handles conditional classes", () => {
    expect(cn("foo", false && "bar", "baz")).toBe("foo baz")
  })

  it("merges tailwind classes correctly", () => {
    expect(cn("px-2 py-1", "px-4")).toBe("py-1 px-4")
  })
})

describe("formatNumber", () => {
  it("formats numbers with default decimals", () => {
    expect(formatNumber(1234.567)).toBe("1,234.57")
  })

  it("formats numbers with custom decimals", () => {
    expect(formatNumber(1234.5678, 4)).toBe("1,234.5678")
  })
})

describe("shortenAddress", () => {
  it("shortens ethereum addresses", () => {
    const address = "0x1234567890abcdef1234567890abcdef12345678"
    expect(shortenAddress(address)).toBe("0x1234...5678")
  })

  it("handles empty string", () => {
    expect(shortenAddress("")).toBe("")
  })

  it("accepts custom character count", () => {
    const address = "0x1234567890abcdef1234567890abcdef12345678"
    expect(shortenAddress(address, 6)).toBe("0x123456...345678")
  })
})

describe("formatCurrency", () => {
  it("formats as USD by default", () => {
    expect(formatCurrency(1234.56)).toBe("$1,234.56")
  })

  it("handles zero", () => {
    expect(formatCurrency(0)).toBe("$0.00")
  })
})

describe("formatPercent", () => {
  it("formats positive percentages", () => {
    expect(formatPercent(5.25)).toBe("+5.25%")
  })

  it("formats negative percentages", () => {
    expect(formatPercent(-3.14)).toBe("-3.14%")
  })
})

describe("isAddress", () => {
  it("validates correct ethereum addresses", () => {
    expect(isAddress("0x1234567890abcdef1234567890abcdef12345678")).toBe(true)
  })

  it("rejects invalid addresses", () => {
    expect(isAddress("0x1234")).toBe(false)
    expect(isAddress("not an address")).toBe(false)
  })
})
