import { RelativeChange } from '@l.x/lx/src/components/RelativeChange/RelativeChange'
import { FiatCurrencyInfo } from '@l.x/lx/src/features/fiatOnRamp/types'
import { Locale } from '@l.x/lx/src/features/language/constants'
import { renderWithProviders } from '@l.x/lx/src/test/render'

const mockLocale = Locale.EnglishUnitedStates

vi.mock('@l.x/lx/src/features/language/hooks', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@l.x/lx/src/features/language/hooks')>()
  return {
    ...actual,
    useCurrentLocale: (): Locale => mockLocale,
  }
})

const mockFiatCurrencyInfo: FiatCurrencyInfo = {
  name: 'United States Dollar',
  shortName: 'USD ($)',
  code: 'USD',
  symbol: '$',
  groupingSeparator: ',',
  decimalSeparator: '.',
  fullSymbol: '$',
  symbolAtFront: true,
}

vi.mock('@l.x/lx/src/features/fiatCurrency/hooks', () => ({
  useAppFiatCurrencyInfo: (): FiatCurrencyInfo => mockFiatCurrencyInfo,
}))

it('renders a relative change', () => {
  const tree = renderWithProviders(<RelativeChange change={12} />)
  expect(tree).toMatchSnapshot()
})

it('renders placeholders without a change', () => {
  const tree = renderWithProviders(<RelativeChange />)
  expect(tree).toMatchSnapshot()
})

it('renders placeholders with absolute change', () => {
  const tree = renderWithProviders(<RelativeChange absoluteChange={100} change={12} />)
  expect(tree).toMatchSnapshot()
})
