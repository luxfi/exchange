import type { MultichainTokenEntry } from 'lx/src/components/MultichainTokenDetails/useOrderedMultichainEntries'
import { useOrderedMultichainEntries } from 'lx/src/components/MultichainTokenDetails/useOrderedMultichainEntries'
import { useOrderedChainIds } from 'lx/src/features/chains/hooks/useOrderedChainIds'
import { UniverseChainId } from 'lx/src/features/chains/types'
import { renderHook } from 'lx/src/test/test-utils'

vi.mock('lx/src/features/chains/hooks/useOrderedChainIds', () => ({
  useOrderedChainIds: vi.fn(),
}))

describe(useOrderedMultichainEntries, () => {
  const ENTRIES: MultichainTokenEntry[] = [
    { chainId: UniverseChainId.Base, address: '0xBase' },
    { chainId: UniverseChainId.Mainnet, address: '0xMainnet' },
    { chainId: UniverseChainId.ArbitrumOne, address: '0xArbitrum' },
  ]

  beforeEach(() => {
    // Return order: Ethereum first, then Arbitrum, then Base
    vi.mocked(useOrderedChainIds).mockReturnValue([
      UniverseChainId.Mainnet,
      UniverseChainId.ArbitrumOne,
      UniverseChainId.Base,
    ])
  })

  it('sorts entries to match useOrderedChainIds order', () => {
    const { result } = renderHook(() => useOrderedMultichainEntries(ENTRIES))

    expect(result.current.map((e) => e.chainId)).toEqual([
      UniverseChainId.Mainnet,
      UniverseChainId.ArbitrumOne,
      UniverseChainId.Base,
    ])
  })

  it('returns empty array for empty input', () => {
    vi.mocked(useOrderedChainIds).mockReturnValue([])

    const { result } = renderHook(() => useOrderedMultichainEntries([]))

    expect(result.current).toEqual([])
  })

  it('returns stable reference on re-render with same input', () => {
    const { result, rerender } = renderHook(() => useOrderedMultichainEntries(ENTRIES))

    const firstResult = result.current
    rerender()

    expect(result.current).toBe(firstResult)
  })
})
