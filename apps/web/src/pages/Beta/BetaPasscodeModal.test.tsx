import { TestID } from '@l.x/lx/src/test/fixtures/testIDs'
import { BetaPasscodeModal } from '~/pages/Beta/BetaPasscodeModal'
import { act, fireEvent, render, screen } from '~/test-utils/render'

vi.mock('@l.x/ui/src/assets', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@l.x/ui/src/assets')>()
  return {
    ...actual,
    BETA_LOGO: 'beta-logo-mock',
  }
})

const mockGetDynamicConfigValue = vi.fn().mockReturnValue([])
const mockNavigate = vi.fn()

vi.mock('@l.x/gating', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@l.x/gating')>()
  return {
    ...actual,
    getDynamicConfigValue: (...args: unknown[]) => mockGetDynamicConfigValue(...args),
  }
})

vi.mock('react-router', async () => {
  const actual = await vi.importActual('react-router')
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  }
})

describe('BetaPasscodeModal', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockGetDynamicConfigValue.mockReturnValue([])
    window.localStorage.clear()
  })

  it('renders default state', () => {
    const { container } = render(<BetaPasscodeModal />)
    expect(screen.getByText('Lx Preview')).toBeTruthy()
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

  it('persists embedded-wallet beta flag and navigates on correct passphrase', async () => {
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

    expect(window.localStorage.getItem('lx.embeddedWalletBeta')).toBe('true')
    expect(mockNavigate).toHaveBeenCalledWith('/?intro=true', { replace: true })
  })
})
