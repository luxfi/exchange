import '@testing-library/jest-dom'
import { vi } from 'vitest'

// Mock next/navigation
vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: vi.fn(),
    replace: vi.fn(),
    prefetch: vi.fn(),
    back: vi.fn(),
  }),
  usePathname: () => '/',
  useSearchParams: () => new URLSearchParams(),
}))

// Mock wagmi
vi.mock('wagmi', async () => {
  const actual = await vi.importActual('wagmi')
  return {
    ...actual,
    useAccount: () => ({
      address: undefined,
      isConnecting: false,
      isDisconnected: true,
    }),
    useConnect: () => ({
      connect: vi.fn(),
      connectors: [],
    }),
    useDisconnect: () => ({
      disconnect: vi.fn(),
    }),
    useChainId: () => 96369,
    usePublicClient: () => null,
  }
})
