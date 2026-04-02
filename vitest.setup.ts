import "@testing-library/jest-dom"
import { vi } from "vitest"

// Polyfill ResizeObserver for tests
global.ResizeObserver = class ResizeObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
}

// Mock window.matchMedia
Object.defineProperty(window, "matchMedia", {
  writable: true,
  value: vi.fn().mockImplementation((query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
})

// Mock IntersectionObserver
global.IntersectionObserver = class IntersectionObserver {
  readonly root: Element | null = null
  readonly rootMargin: string = ""
  readonly thresholds: ReadonlyArray<number> = []

  constructor() {}
  observe() {}
  unobserve() {}
  disconnect() {}
  takeRecords(): IntersectionObserverEntry[] {
    return []
  }
}

// Mock document.elementFromPoint
if (typeof document !== "undefined") {
  document.elementFromPoint = vi.fn().mockReturnValue(null)
}

// Mock scrollTo
window.scrollTo = vi.fn()

// Mock crypto.getRandomValues
Object.defineProperty(global, "crypto", {
  value: {
    getRandomValues: (arr: Uint8Array) => {
      for (let i = 0; i < arr.length; i++) {
        arr[i] = Math.floor(Math.random() * 256)
      }
      return arr
    },
    randomUUID: () => {
      return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(
        /[xy]/g,
        function (c) {
          const r = (Math.random() * 16) | 0
          const v = c === "x" ? r : (r & 0x3) | 0x8
          return v.toString(16)
        }
      )
    },
  },
})

// Mock fetch
global.fetch = vi.fn()

// Suppress console errors in tests (optional)
const originalError = console.error
console.error = (...args: unknown[]) => {
  // Filter out React 18 act() warnings
  const firstArg = args[0]
  if (
    typeof firstArg === "string" &&
    firstArg.includes("Warning: An update to")
  ) {
    return
  }
  originalError.apply(console, args)
}
