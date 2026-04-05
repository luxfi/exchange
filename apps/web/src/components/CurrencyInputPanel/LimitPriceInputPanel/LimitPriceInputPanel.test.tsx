import '~/test-utils/tokens/mocks'

<<<<<<< HEAD
vi.mock('lx/src/features/accounts/store/hooks', () => ({
  useActiveAddresses: vi.fn(),
}))

import { DAI, USDC_MAINNET } from '@l.x/lx/src/constants/tokens'
import { useActiveAddresses } from '@l.x/lx/src/features/accounts/store/hooks'
import { LimitsExpiry } from '@l.x/lx/src/types/limits'
import { SwapTab } from '@l.x/lx/src/types/screens/interface'
=======
vi.mock('uniswap/src/features/accounts/store/hooks', () => ({
  useActiveAddresses: vi.fn(),
}))

import { DAI, USDC_MAINNET } from 'uniswap/src/constants/tokens'
import { useActiveAddresses } from 'uniswap/src/features/accounts/store/hooks'
import { LimitsExpiry } from 'uniswap/src/types/limits'
import { SwapTab } from 'uniswap/src/types/screens/interface'
>>>>>>> upstream/main
import { LimitPriceInputPanel } from '~/components/CurrencyInputPanel/LimitPriceInputPanel/LimitPriceInputPanel'
import { LimitContext } from '~/state/limit/LimitContext'
import { MultichainContext } from '~/state/multichain/types'
import { SwapAndLimitContext } from '~/state/swap/types'
<<<<<<< HEAD
import { act, renderWithLuxContext, screen } from '~/test-utils/render'
=======
import { act, renderWithUniswapContext, screen } from '~/test-utils/render'
>>>>>>> upstream/main

const mockUseActiveAddresses = useActiveAddresses as ReturnType<typeof vi.fn>

const mockMultichainContextValue = {
  reset: vi.fn(),
  setSelectedChainId: vi.fn(),
  setIsUserSelectedToken: vi.fn(),
  isSwapAndLimitContext: true,
  isUserSelectedToken: false,
  isMultichainContext: true,
}

const mockSwapAndLimitContextValue = {
  currencyState: {
    inputCurrency: DAI,
    outputCurrency: undefined,
  },
  prefilledState: {},
  setCurrencyState: vi.fn(),
  currentTab: SwapTab.Limit,
  setCurrentTab: vi.fn(),
}

const mockLimitContextValue = {
  limitState: {
    inputAmount: '',
    limitPrice: '100',
    outputAmount: '',
    expiry: LimitsExpiry.Day,
    isInputAmountFixed: true,
    limitPriceEdited: false,
    limitPriceInverted: false,
  },
  setLimitState: vi.fn(),
  derivedLimitInfo: {
    currencyBalances: {},
    parsedAmounts: {},
  },
}

describe('LimitPriceInputPanel', () => {
  beforeEach(() => {
    vi.clearAllMocks()

    mockUseActiveAddresses.mockReturnValue({
      evmAddress: undefined,
      svmAddress: undefined,
    })
  })

  it('should render the component with no currencies selected', async () => {
    const onCurrencySelect = vi.fn()
    await act(async () => {
<<<<<<< HEAD
      return renderWithLuxContext(<LimitPriceInputPanel onCurrencySelect={onCurrencySelect} />)
=======
      return renderWithUniswapContext(<LimitPriceInputPanel onCurrencySelect={onCurrencySelect} />)
>>>>>>> upstream/main
    })
    expect(screen.getByText('Limit price')).toBeVisible()
    expect(screen.getByPlaceholderText('0')).toBeVisible()
    expect(screen.getByText('Market')).toBeVisible()
    expect(screen.getByText('+1%')).toBeVisible()
    expect(screen.getByText('+5%')).toBeVisible()
    expect(screen.getByText('+10%')).toBeVisible()
    // TODO(WEB-7196): re-enable snapshot test once VisuallyHidden issue is resolved
    // expect(result.container.firstChild).toMatchSnapshot()
  })

  it('should render correct subheader with inputCurrency defined, but no price', () => {
    const onCurrencySelect = vi.fn()
<<<<<<< HEAD
    renderWithLuxContext(
=======
    renderWithUniswapContext(
>>>>>>> upstream/main
      <MultichainContext.Provider value={mockMultichainContextValue}>
        <SwapAndLimitContext.Provider value={mockSwapAndLimitContextValue}>
          <LimitPriceInputPanel onCurrencySelect={onCurrencySelect} />
        </SwapAndLimitContext.Provider>
      </MultichainContext.Provider>,
    )
    expect(screen.getByText('Limit price')).toBeVisible()
    expect(screen.getByPlaceholderText('0')).toBeVisible()
    // TODO(WEB-7196): re-enable snapshot test once VisuallyHidden issue is resolved
    // expect(result.container.firstChild).toMatchSnapshot()
  })

  it('should render correct subheader with input currency and limit price defined', () => {
    const onCurrencySelect = vi.fn()
<<<<<<< HEAD
    renderWithLuxContext(
=======
    renderWithUniswapContext(
>>>>>>> upstream/main
      <MultichainContext.Provider value={mockMultichainContextValue}>
        <SwapAndLimitContext.Provider value={mockSwapAndLimitContextValue}>
          <LimitContext.Provider value={mockLimitContextValue}>
            <LimitPriceInputPanel onCurrencySelect={onCurrencySelect} />
          </LimitContext.Provider>
        </SwapAndLimitContext.Provider>
      </MultichainContext.Provider>,
    )
    expect(screen.getByText('DAI')).toBeVisible()
    expect(screen.getByPlaceholderText('0')).toBeVisible()
  })

  it('should render the output currency when defined', () => {
    const onCurrencySelect = vi.fn()
<<<<<<< HEAD
    const { container } = renderWithLuxContext(
=======
    const { container } = renderWithUniswapContext(
>>>>>>> upstream/main
      <MultichainContext.Provider value={mockMultichainContextValue}>
        <SwapAndLimitContext.Provider
          value={{
            ...mockSwapAndLimitContextValue,
            currencyState: {
              ...mockSwapAndLimitContextValue.currencyState,
              outputCurrency: USDC_MAINNET,
            },
          }}
        >
          <LimitContext.Provider value={mockLimitContextValue}>
            <LimitPriceInputPanel onCurrencySelect={onCurrencySelect} />
          </LimitContext.Provider>
        </SwapAndLimitContext.Provider>
      </MultichainContext.Provider>,
    )
    expect(screen.getByText('DAI')).toBeVisible()
    expect(container.querySelector('.token-symbol-container')).toHaveTextContent('USDC')
    expect(screen.getByPlaceholderText('0')).toBeVisible()
  })
})
