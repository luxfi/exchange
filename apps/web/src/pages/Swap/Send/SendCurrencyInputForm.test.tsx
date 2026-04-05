vi.mock('~/hooks/Tokens')

// Mock only what's needed for tests to pass
<<<<<<< HEAD
vi.mock('lx/src/features/accounts/store/hooks', () => {
=======
vi.mock('uniswap/src/features/accounts/store/hooks', () => {
>>>>>>> upstream/main
  return {
    useActiveAddresses: () => ({
      evmAddress: undefined,
      svmAddress: undefined,
    }),
  }
})

<<<<<<< HEAD
import { DAI } from '@l.x/lx/src/constants/tokens'
import { SwapTab } from '@l.x/lx/src/types/screens/interface'
=======
import { DAI } from 'uniswap/src/constants/tokens'
import { SwapTab } from 'uniswap/src/types/screens/interface'
>>>>>>> upstream/main
import { useCurrencyInfo } from '~/hooks/Tokens'
import SendCurrencyInputForm from '~/pages/Swap/Send/SendCurrencyInputForm'
import { MultichainContext } from '~/state/multichain/types'
import { SendContext, SendContextType } from '~/state/send/SendContext'
import { SwapAndLimitContext } from '~/state/swap/types'
import { DAI_INFO } from '~/test-utils/constants'
import { mocked } from '~/test-utils/mocked'
<<<<<<< HEAD
import { act, renderWithLuxContext, screen } from '~/test-utils/render'
=======
import { act, renderWithUniswapContext, screen } from '~/test-utils/render'
>>>>>>> upstream/main

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
  setCurrencyState: vi.fn(),
  currentTab: SwapTab.Limit,
  setCurrentTab: vi.fn(),
}

const mockedSendContextDefault: SendContextType = {
  sendState: {
    exactAmountToken: undefined,
    exactAmountFiat: '',
    recipient: '',
    inputCurrency: DAI,
    inputInFiat: true,
  },
  derivedSendInfo: {},
  setSendState: vi.fn(),
}

const mockedSendContextFiatInput: SendContextType = {
  sendState: {
    exactAmountToken: undefined,
    exactAmountFiat: '1000',
    recipient: '',
    inputCurrency: DAI,
    inputInFiat: true,
  },
  derivedSendInfo: {
    exactAmountOut: '100',
  },
  setSendState: vi.fn(),
}

const mockedSendContextTokenInput: SendContextType = {
  sendState: {
    exactAmountToken: '1',
    exactAmountFiat: undefined,
    recipient: '',
    inputCurrency: DAI,
    inputInFiat: false,
  },
  derivedSendInfo: {
    exactAmountOut: '100',
  },
  setSendState: vi.fn(),
}

describe('SendCurrencyInputform', () => {
  beforeEach(() => {
    mocked(useCurrencyInfo).mockImplementation(() => {
      return DAI_INFO
    })
  })

  it('should render placeholder values', async () => {
    const { container } = await act(() =>
<<<<<<< HEAD
      renderWithLuxContext(
=======
      renderWithUniswapContext(
>>>>>>> upstream/main
        <MultichainContext.Provider value={mockMultichainContextValue}>
          <SwapAndLimitContext.Provider value={mockSwapAndLimitContextValue}>
            <SendContext.Provider value={mockedSendContextDefault}>
              <SendCurrencyInputForm />
            </SendContext.Provider>
          </SwapAndLimitContext.Provider>
        </MultichainContext.Provider>,
      ),
    )

    expect(screen.getByPlaceholderText('0')).toBeVisible()
    expect(screen.getByText('0 DAI')).toBeVisible()
    expect(screen.getByText('DAI')).toBeVisible()
    expect(container.firstChild).toMatchSnapshot()
  })

  it('renders input in fiat correctly', async () => {
    const { container } = await act(() =>
<<<<<<< HEAD
      renderWithLuxContext(
=======
      renderWithUniswapContext(
>>>>>>> upstream/main
        <MultichainContext.Provider value={mockMultichainContextValue}>
          <SwapAndLimitContext.Provider value={mockSwapAndLimitContextValue}>
            <SendContext.Provider value={mockedSendContextFiatInput}>
              <SendCurrencyInputForm />
            </SendContext.Provider>
          </SwapAndLimitContext.Provider>
        </MultichainContext.Provider>,
      ),
    )

    expect(screen.getByDisplayValue('1000')).toBeVisible()
    expect(screen.getByText('100.00 DAI')).toBeVisible()
    expect(screen.getByText('DAI')).toBeVisible()
    expect(container.firstChild).toMatchSnapshot()
  })

  it('renders input in token amount correctly', async () => {
    const { container } = await act(() =>
<<<<<<< HEAD
      renderWithLuxContext(
=======
      renderWithUniswapContext(
>>>>>>> upstream/main
        <MultichainContext.Provider value={mockMultichainContextValue}>
          <SwapAndLimitContext.Provider value={mockSwapAndLimitContextValue}>
            <SendContext.Provider value={mockedSendContextTokenInput}>
              <SendCurrencyInputForm />
            </SendContext.Provider>
          </SwapAndLimitContext.Provider>
        </MultichainContext.Provider>,
      ),
    )

    expect(screen.getByDisplayValue('1')).toBeVisible()
    expect(screen.getByText('$100.00')).toBeVisible()
    expect(screen.getByText('DAI')).toBeVisible()
    expect(container.firstChild).toMatchSnapshot()
  })
})
