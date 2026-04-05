<<<<<<< HEAD
import { TestID } from '@l.x/lx/src/test/fixtures/testIDs'
import AccountDrawer, { MODAL_WIDTH } from '~/components/AccountDrawer'
import { useIsLxExtensionConnected } from '~/hooks/useIsLuxExtensionConnected'
=======
import { TestID } from 'uniswap/src/test/fixtures/testIDs'
import AccountDrawer, { MODAL_WIDTH } from '~/components/AccountDrawer'
import { useIsUniswapExtensionConnected } from '~/hooks/useIsUniswapExtensionConnected'
>>>>>>> upstream/main
import { mocked } from '~/test-utils/mocked'
import mockMediaSize from '~/test-utils/mockMediaSize'
import { render, screen } from '~/test-utils/render'

<<<<<<< HEAD
vi.mock('~/hooks/useIsLuxExtensionConnected', () => ({
  useIsLxExtensionConnected: vi.fn(),
=======
vi.mock('~/hooks/useIsUniswapExtensionConnected', () => ({
  useIsUniswapExtensionConnected: vi.fn(),
>>>>>>> upstream/main
}))

vi.mock('~/components/AccountDrawer/MiniPortfolio/hooks', async (importOriginal) => {
  const actual = await importOriginal<typeof import('~/components/AccountDrawer/MiniPortfolio/hooks')>()
  return {
    ...actual,
    useAccountDrawer: vi.fn(() => ({
      isOpen: true,
      open: vi.fn(),
      close: vi.fn(),
      toggle: vi.fn(),
    })),
  }
})

<<<<<<< HEAD
vi.mock('lx/src/features/accounts/store/hooks', () => ({
=======
vi.mock('uniswap/src/features/accounts/store/hooks', () => ({
>>>>>>> upstream/main
  useActiveAddresses: vi.fn(() => ({
    evmAddress: '0x0000000000000000000000000000000000000000',
    svmAddress: undefined,
  })),
  useConnectionStatus: vi.fn((platform?: any) => {
    // For Solana (svm), return not connected
    if (platform === 'svm') {
      return {
        isConnected: false,
        isConnecting: false,
        isDisconnected: true,
      }
    }
    // For EVM (default), return connected
    return {
      isConnected: true,
      isConnecting: false,
      isDisconnected: false,
    }
  }),
}))

<<<<<<< HEAD
vi.mock('gui', async () => {
  const actual = await vi.importActual('gui')
=======
vi.mock('tamagui', async () => {
  const actual = await vi.importActual('tamagui')
>>>>>>> upstream/main
  return {
    ...actual,
    useMedia: vi.fn(),
  }
})

<<<<<<< HEAD
vi.mock('lx/src/components/AnimatedNumber/AnimatedNumber', () => {
=======
vi.mock('uniswap/src/components/AnimatedNumber/AnimatedNumber', () => {
>>>>>>> upstream/main
  const mockAnimatedNumber = ({ value }: { value: number }) => {
    return <div>{value}</div>
  }
  return {
    BALANCE_CHANGE_INDICATION_DURATION: 1000,
    default: mockAnimatedNumber,
    AnimatedNumber: mockAnimatedNumber,
  }
})

describe('AccountDrawer tests', () => {
  it('AccountDrawer default styles', () => {
<<<<<<< HEAD
    mocked(useIsLxExtensionConnected).mockReturnValue(true)
=======
    mocked(useIsUniswapExtensionConnected).mockReturnValue(true)
>>>>>>> upstream/main
    mockMediaSize('xxl')

    render(<AccountDrawer />)
    expect(document.body).toMatchSnapshot()
    const drawerWrapper = screen.getByTestId(TestID.AccountDrawer)
    expect(drawerWrapper).toBeInTheDocument()
    const drawerContainer = screen.getByTestId(TestID.AccountDrawerContainer)
    expect(drawerContainer).toHaveClass(`_width-${MODAL_WIDTH}`)
  })
})
