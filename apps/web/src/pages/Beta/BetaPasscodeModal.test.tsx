<<<<<<< HEAD
import { getOverrideAdapter } from '@l.x/gating'
import { TestID } from 'lx/src/test/fixtures/testIDs'
=======
import { getOverrideAdapter } from '@universe/gating'
import { TestID } from 'uniswap/src/test/fixtures/testIDs'
>>>>>>> upstream/main
import { BetaPasscodeModal } from '~/pages/Beta/BetaPasscodeModal'
import { act, fireEvent, render, screen } from '~/test-utils/render'

vi.mock('ui/src/assets', async (importOriginal) => {
  const actual = await importOriginal<typeof import('ui/src/assets')>()
  return {
    ...actual,
    BETA_LOGO: 'beta-logo-mock',
  }
})

const mockGetDynamicConfigValue = vi.fn().mockReturnValue([])
<<<<<<< HEAD
const mockNavigate = vi.fn()

vi.mock('@l.x/gating', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@l.x/gating')>()
=======
vi.mock('@universe/gating', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@universe/gating')>()
>>>>>>> upstream/main
  return {
    ...actual,
    getDynamicConfigValue: (...args: unknown[]) => mockGetDynamicConfigValue(...args),
    getOverrideAdapter: vi.fn().mockReturnValue({ overrideGate: vi.fn() }),
  }
})

<<<<<<< HEAD
vi.mock('react-router', async () => {
  const actual = await vi.importActual('react-router')
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  }
})
=======
const mockLocationReplace = vi.fn()
>>>>>>> upstream/main

describe('BetaPasscodeModal', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockGetDynamicConfigValue.mockReturnValue([])
<<<<<<< HEAD
=======
    Object.defineProperty(window, 'location', {
      value: { ...window.location, replace: mockLocationReplace },
      configurable: true,
      writable: true,
    })
>>>>>>> upstream/main
  })

  it('renders default state', () => {
    const { container } = render(<BetaPasscodeModal />)
<<<<<<< HEAD
    expect(screen.getByText('Lx Preview')).toBeTruthy()
=======
    expect(screen.getByText('Uniswap Preview')).toBeTruthy()
>>>>>>> upstream/main
    expect(screen.getByTestId(TestID.PreviewPassphraseInput)).toBeTruthy()
    expect(container.firstChild).toMatchSnapshot()
  })

  it('submit button is disabled when input is empty', () => {
    render(<BetaPasscodeModal />)
    const submitButton = screen.getByTestId(TestID.PreviewPassphraseSubmit)
    expect(submitButton).toBeDisabled()
  })

  it('shows error on incorrect passphrase', async () => {
    render(<BetaPasscodeModal />)
    const input = screen.getByTestId(TestID.PreviewPassphraseInput)
    const submitButton = screen.getByTestId(TestID.PreviewPassphraseSubmit)

    await act(async () => {
      fireEvent.change(input, { target: { value: 'wrong-passphrase' } })
    })

    await act(async () => {
      fireEvent.click(submitButton)
    })

    expect(screen.getByTestId(TestID.PreviewPassphraseError)).toBeTruthy()
  })

  it('overrides gate and navigates on correct passphrase', async () => {
    mockGetDynamicConfigValue.mockReturnValue(['correct-code'])
    render(<BetaPasscodeModal />)
    const input = screen.getByTestId(TestID.PreviewPassphraseInput)
    const submitButton = screen.getByTestId(TestID.PreviewPassphraseSubmit)

    await act(async () => {
      fireEvent.change(input, { target: { value: 'correct-code' } })
    })

    await act(async () => {
      fireEvent.click(submitButton)
    })

    expect(getOverrideAdapter().overrideGate).toHaveBeenCalledWith('embedded_wallet', true)
<<<<<<< HEAD
    expect(mockNavigate).toHaveBeenCalledWith('/?intro=true', { replace: true })
=======
    expect(mockLocationReplace).toHaveBeenCalledWith('/?intro=true')
>>>>>>> upstream/main
  })
})
