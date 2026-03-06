import { type GasFeeResult } from '@universe/api'
import { UniverseChainId } from 'lx/src/features/chains/types'
import { GasInfoRow } from 'lx/src/features/transactions/swap/form/SwapFormScreen/SwapFormScreenDetails/SwapFormScreenFooter/GasAndWarningRows/TradeInfoRow/GasInfoRow'
import { GasInfo } from 'lx/src/features/transactions/swap/form/SwapFormScreen/SwapFormScreenDetails/SwapFormScreenFooter/GasAndWarningRows/types'
import { TestID } from 'lx/src/test/fixtures/testIDs'
import { render } from 'lx/src/test/test-utils'
import type { MockedFunction } from 'vitest'

// Mock dependencies
vi.mock('lx/src/features/transactions/swap/hooks/usePriceUXEnabled', () => ({
  usePriceUXEnabled: vi.fn(),
}))

import { usePriceUXEnabled } from 'lx/src/features/transactions/swap/hooks/usePriceUXEnabled'

const mockUsePriceUXEnabled = usePriceUXEnabled as MockedFunction<typeof usePriceUXEnabled>

describe('GasInfoRow', () => {
  beforeEach(() => {
    mockUsePriceUXEnabled.mockReturnValue(false)
  })

  const createGasFeeResult = (overrides: Partial<GasFeeResult> = {}): GasFeeResult => ({
    value: '1000000000000000',
    isLoading: false,
    error: null,
    ...overrides,
  })

  const createGasInfo = (overrides: Partial<GasInfo> = {}): GasInfo => ({
    gasFee: createGasFeeResult(),
    fiatPriceFormatted: '$2.50',
    isHighRelativeToValue: false,
    isLoading: false,
    chainId: UniverseChainId.Mainnet,
    ...overrides,
  })

  describe('normal gas fees (non-DEX)', () => {
    it('should render gas info with formatted price', () => {
      const gasInfo = createGasInfo()
      const { getByTestId, getByText } = render(<GasInfoRow gasInfo={gasInfo} />)

      expect(getByTestId(TestID.GasInfoRow)).toBeDefined()
      expect(getByText('$2.50')).toBeDefined()
    })

    it('should not render when fiatPriceFormatted is undefined', () => {
      const gasInfo = createGasInfo({ fiatPriceFormatted: undefined })
      const { queryByTestId } = render(<GasInfoRow gasInfo={gasInfo} />)

      expect(queryByTestId(TestID.GasInfoRow)).toBeNull()
    })

    it('should handle loading state', () => {
      const gasInfo = createGasInfo({ isLoading: true })
      const { getByTestId } = render(<GasInfoRow gasInfo={gasInfo} />)

      const element = getByTestId(TestID.GasInfoRow)
      expect(element).toBeDefined()
    })

    it('should handle hidden state', () => {
      const gasInfo = createGasInfo()
      const { getByTestId } = render(<GasInfoRow hidden gasInfo={gasInfo} />)

      expect(getByTestId(TestID.GasInfoRow)).toBeDefined()
    })
  })

  describe('DEX fees', () => {
    it('should render DEXFee component when dexGasFeeInfo is present', () => {
      const gasInfo = createGasInfo({
        fiatPriceFormatted: 'Free',
        dexGasFeeInfo: {
          swapFeeFormatted: 'Free',
          preSavingsGasFeeFormatted: '$2.50',
          inputTokenSymbol: 'ETH',
        },
      })

      const { getByTestId, queryAllByText } = render(<GasInfoRow gasInfo={gasInfo} />)

      expect(getByTestId(TestID.GasInfoRow)).toBeDefined()
      expect(queryAllByText('Free').length).toBeGreaterThan(0)
      expect(queryAllByText('$2.50').length).toBeGreaterThan(0)
    })

    it('should render DEXFee without approval fee', () => {
      const gasInfo = createGasInfo({
        fiatPriceFormatted: 'Free',
        dexGasFeeInfo: {
          swapFeeFormatted: 'Free',
          preSavingsGasFeeFormatted: '$1.25',
        },
      })

      const { getByTestId, queryAllByText } = render(<GasInfoRow gasInfo={gasInfo} />)

      expect(getByTestId(TestID.GasInfoRow)).toBeDefined()
      expect(queryAllByText('Free').length).toBeGreaterThan(0)
      expect(queryAllByText('$1.25').length).toBeGreaterThan(0)
    })

    it('should render DEXFee with approval fee', () => {
      const gasInfo = createGasInfo({
        fiatPriceFormatted: 'Free',
        dexGasFeeInfo: {
          approvalFeeFormatted: '$0.50',
          swapFeeFormatted: 'Free',
          preSavingsGasFeeFormatted: '$2.00',
          inputTokenSymbol: 'DAI',
        },
      })

      const { getByTestId, queryAllByText } = render(<GasInfoRow gasInfo={gasInfo} />)

      expect(getByTestId(TestID.GasInfoRow)).toBeDefined()
      expect(queryAllByText('Free').length).toBeGreaterThan(0)
    })

    it('should display DEX savings with priceUX enabled', () => {
      mockUsePriceUXEnabled.mockReturnValue(true)

      const gasInfo = createGasInfo({
        fiatPriceFormatted: 'Free',
        dexGasFeeInfo: {
          swapFeeFormatted: 'Free',
          preSavingsGasFeeFormatted: '$3.00',
        },
      })

      const { getByTestId, queryAllByText } = render(<GasInfoRow gasInfo={gasInfo} />)

      expect(getByTestId(TestID.GasInfoRow)).toBeDefined()
      expect(queryAllByText('Free').length).toBeGreaterThan(0)
      expect(queryAllByText('$3.00').length).toBeGreaterThan(0)
    })
  })

  describe('different chain support', () => {
    it.each([UniverseChainId.Mainnet, UniverseChainId.ArbitrumOne, UniverseChainId.Base])(
      'should render for chain %s',
      (chainId) => {
        const gasInfo = createGasInfo({ chainId })
        const { getByTestId } = render(<GasInfoRow gasInfo={gasInfo} />)

        expect(getByTestId(TestID.GasInfoRow)).toBeDefined()
      },
    )
  })
})
