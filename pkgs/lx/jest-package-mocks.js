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
import { mockLocalizationContext } from '@l.x/lx/src/test/mocks/locale'
import { mockSharedPersistQueryClientProvider } from '@l.x/lx/src/test/mocks/mockSharedPersistQueryClientProvider'

jest.mock('react-native-localize', () => mockRNLocalize)
jest.mock('@l.x/lx/src/features/language/LocalizationContext', () => mockLocalizationContext({}))
jest.mock('@l.x/lx/src/data/apiClients/SharedPersistQueryClientProvider', () => mockSharedPersistQueryClientProvider)

jest.mock('@l.x/utils/src/device/uniqueId', () => {
  return jest.requireActual('@l.x/lx/src/test/mocks/uniqueId')
})

jest.mock('@l.x/lx/src/data/getVersionHeader', () => {
  return jest.requireActual('@l.x/lx/src/data/getVersionHeader.web')
})

jest.mock('@luxexchange/gating', () => {
  const actual = jest.requireActual('@luxexchange/gating')
  return {
    ...actual,
    useInsightsStatus: jest.fn(() => ({ isInsightsLoading: false, isInsightsReady: true })),
    isInsightsReady: jest.fn(() => true),
    getInsights: jest.fn(() => ({
      isFeatureEnabled: jest.fn(() => false),
      getFeatureFlag: jest.fn(() => undefined),
      getFeatureFlagPayload: jest.fn(() => undefined),
      identify: jest.fn(),
      register: jest.fn(),
      capture: jest.fn(),
      reloadFeatureFlags: jest.fn(),
      onFeatureFlags: jest.fn(() => () => undefined),
    })),
  }
})
