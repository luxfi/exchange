/**
 * Common mocks for this package. This file is intended to be imported in the jest-setup.js file of the package.
 *
 * Notes:
 * * Try not to add test specific mocks here.
 * * Be wary of the import order.
 * * mocks can be overridden
 */

import '@shopify/react-native-skia/jestSetup'
import mockRNLocalize from 'react-native-localize/mock'
import { mockLocalizationContext } from 'lx/src/test/mocks/locale'
import { mockSharedPersistQueryClientProvider } from 'lx/src/test/mocks/mockSharedPersistQueryClientProvider'

jest.mock('react-native-localize', () => mockRNLocalize)
jest.mock('lx/src/features/language/LocalizationContext', () => mockLocalizationContext({}))
jest.mock('lx/src/data/apiClients/SharedPersistQueryClientProvider', () => mockSharedPersistQueryClientProvider)

jest.mock('utilities/src/device/uniqueId', () => {
  return jest.requireActual('lx/src/test/mocks/uniqueId')
})

jest.mock('@luxfi/gating', () => {
  const actual = jest.requireActual('@luxfi/gating')
  return {
    ...actual,
    useClientAsyncInit: jest.fn(() => ({
      client: null,
      isLoading: true,
    })),
  }
})
