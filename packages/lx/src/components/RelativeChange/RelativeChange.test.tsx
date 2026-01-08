import { RelativeChange } from 'lx/src/components/RelativeChange/RelativeChange'
import { FiatCurrencyInfo } from 'lx/src/features/fiatOnRamp/types'
import { Locale } from 'lx/src/features/language/constants'
import { renderWithProviders } from 'lx/src/test/render'

const mockLocale = Locale.EnglishUnitedStates

jest.mock('uniswap/src/features/language/hooks', () => ({
  useCurrentLocale: (): Locale => mockLocale,
}))

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

jest.mock('uniswap/src/features/fiatCurrency/hooks', () => ({
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
