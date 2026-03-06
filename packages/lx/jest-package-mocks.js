/**
 * Common Jest mocks for packages that depend on lux.
 * Note: The lux package itself has migrated to Vitest (see vitest-package-mocks.ts).
 * This file is kept for other packages (e.g., mobile, extension, wallet) that still use Jest.
 *
 * Notes:
 * * Try not to add test specific mocks here.
 * * Be wary of the import order.
 * * mocks can be overridden
 */

import '@shopify/react-native-skia/jestSetup'
import mockRNLocalize from 'react-native-localize/mock'
import { mockLocalizationContext } from 'lux/src/test/mocks/locale'
import { mockSharedPersistQueryClientProvider } from 'lux/src/test/mocks/mockSharedPersistQueryClientProvider'

jest.mock('react-native-localize', () => mockRNLocalize)
jest.mock('lux/src/features/language/LocalizationContext', () => mockLocalizationContext({}))
jest.mock('lux/src/data/apiClients/SharedPersistQueryClientProvider', () => mockSharedPersistQueryClientProvider)

jest.mock('utilities/src/device/uniqueId', () => {
  return jest.requireActual('lux/src/test/mocks/uniqueId')
})

jest.mock('lux/src/data/getVersionHeader', () => {
  return jest.requireActual('lux/src/data/getVersionHeader.web')
})

jest.mock('@universe/gating', () => {
  const actual = jest.requireActual('@universe/gating')
  return {
    ...actual,
    useClientAsyncInit: jest.fn(() => ({
      client: null,
      isLoading: true,
    })),
  }
})
