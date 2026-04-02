import { vi } from 'vitest'

// Text encoding globals
global.TextEncoder = TextEncoder
global.TextDecoder = TextDecoder

// Mock viem for testing
vi.mock('viem', () => ({
  createPublicClient: vi.fn(),
  createWalletClient: vi.fn(),
  http: vi.fn(),
  parseEther: (value: string) => BigInt(parseFloat(value) * 1e18),
  formatEther: (value: bigint) => (Number(value) / 1e18).toString(),
  keccak256: vi.fn(() => '0x' + '0'.repeat(64)),
  toBytes: vi.fn(() => new Uint8Array(32)),
  encodeAbiParameters: vi.fn(() => '0x'),
  decodeAbiParameters: vi.fn(() => []),
}))

// Mock wagmi
vi.mock('wagmi', () => ({
  useAccount: vi.fn(() => ({
    address: '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266',
    isConnected: true,
  })),
  usePublicClient: vi.fn(() => ({
    readContract: vi.fn(),
    watchContractEvent: vi.fn(),
  })),
  useWalletClient: vi.fn(() => ({
    data: {
      writeContract: vi.fn(),
    },
  })),
}))
