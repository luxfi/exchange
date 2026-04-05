import 'utilities/jest-package-mocks'
<<<<<<< HEAD
import 'lux/jest-package-mocks'
import 'wallet/jest-package-mocks'
import 'config/jest-presets/ui/ui-package-mocks'
import 'react-native-gesture-handler/jestSetup';

import { chrome } from 'jest-chrome'
import { AppearanceSettingType } from 'lux/src/features/appearance/slice'

process.env.IS_LUX_EXTENSION = true
=======
import 'uniswap/jest-package-mocks'
import 'wallet/jest-package-mocks'
import 'config/jest-presets/ui/ui-package-mocks'
import 'react-native-gesture-handler/jestSetup'
import { chrome } from 'jest-chrome'
import { AppearanceSettingType } from 'uniswap/src/features/appearance/slice'

process.env.IS_UNISWAP_EXTENSION = true
>>>>>>> upstream/main

const ignoreLogs = {
  error: [
    // We need to use _persist property to ensure that the state is properly
<<<<<<< HEAD
    // rehydrated (https://github.com/Lux/universe/pull/7502/files#r1566259088)
    'Unexpected key "_persist" found in previous state received by the reducer.'
  ]
=======
    // rehydrated (https://github.com/Uniswap/universe/pull/7502/files#r1566259088)
    'Unexpected key "_persist" found in previous state received by the reducer.',
  ],
>>>>>>> upstream/main
}

// Ignore certain logs that are expected during tests.
Object.entries(ignoreLogs).forEach(([method, messages]) => {
  const key = method
  const originalMethod = console[key]
<<<<<<< HEAD
  console[key] = ((...args) => {
=======
  console[key] = (...args) => {
>>>>>>> upstream/main
    if (messages.some((message) => args.some((arg) => typeof arg === 'string' && arg.startsWith(message)))) {
      return
    }
    originalMethod(...args)
<<<<<<< HEAD
  })
=======
  }
>>>>>>> upstream/main
})

globalThis.matchMedia =
  globalThis.matchMedia ||
  ((query) => {
    const reducedMotion = query.match(/prefers-reduced-motion: ([a-zA-Z0-9-]+)/)

    return {
      // Needed for reanimated to disable reduced motion warning in tests
      matches: reducedMotion ? reducedMotion[1] === 'no-preference' : false,
      addListener: jest.fn(),
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
    }
  })

require('react-native-reanimated').setUpTests()

const MOCK_LANGUAGE = 'en-US'

global.chrome = {
  ...chrome,
  i18n: {
    ...global.chrome.i18n,
<<<<<<< HEAD
    getUILanguage: jest.fn().mockReturnValue(MOCK_LANGUAGE)
=======
    getUILanguage: jest.fn().mockReturnValue(MOCK_LANGUAGE),
>>>>>>> upstream/main
  },
  storage: {
    ...chrome.storage,
    local: {
      ...chrome.storage.local,
      addListener: jest.fn(),
    },
    session: {
      get: jest.fn().mockImplementation((_keys, callback) => {
        if (callback) {
          callback({})
        }
        return Promise.resolve({})
      }),
      set: jest.fn().mockImplementation((_items, callback) => {
        if (callback) {
          callback()
        }
        return Promise.resolve()
      }),
      remove: jest.fn().mockImplementation((_keys, callback) => {
        if (callback) {
          callback()
        }
        return Promise.resolve()
      }),
      clear: jest.fn().mockImplementation((callback) => {
        if (callback) {
          callback()
        }
        return Promise.resolve()
<<<<<<< HEAD
      })
    }
  }
=======
      }),
    },
  },
>>>>>>> upstream/main
}

jest.mock('src/app/navigation/utils', () => ({
  useExtensionNavigation: () => ({
    navigateTo: jest.fn(),
    navigateBack: jest.fn(),
<<<<<<< HEAD
  })
=======
  }),
>>>>>>> upstream/main
}))

jest.mock('wallet/src/features/focus/useIsFocused', () => {
  return jest.fn().mockReturnValue(true)
})

const mockAppearanceSetting = AppearanceSettingType.System
<<<<<<< HEAD
jest.mock('lux/src/features/appearance/hooks', () => {
=======
jest.mock('uniswap/src/features/appearance/hooks', () => {
>>>>>>> upstream/main
  return {
    useCurrentAppearanceSetting: () => mockAppearanceSetting,
    useSelectedColorScheme: () => 'light',
  }
})

<<<<<<< HEAD
// Mock IntersectionObserver for Gui's useElementLayout
=======
// Mock IntersectionObserver for Tamagui's useElementLayout
>>>>>>> upstream/main
const IntersectionObserverMock = jest.fn().mockImplementation((callback) => ({
  observe: jest.fn((element) => {
    // Immediately call the callback with a mock entry
    if (callback && element) {
      callback([
        {
          target: element,
          isIntersecting: true,
          intersectionRatio: 1,
          boundingClientRect: {
            x: 0,
            y: 0,
            width: 100,
            height: 100,
            top: 0,
            right: 100,
            bottom: 100,
            left: 0,
          },
          intersectionRect: {
            x: 0,
            y: 0,
            width: 100,
            height: 100,
            top: 0,
            right: 100,
            bottom: 100,
            left: 0,
          },
          rootBounds: null,
          time: 0,
        },
      ])
    }
  }),
  unobserve: jest.fn(),
  disconnect: jest.fn(),
  takeRecords: jest.fn().mockReturnValue([]),
  root: null,
  rootMargin: '',
  thresholds: [],
}))

global.IntersectionObserver = IntersectionObserverMock
