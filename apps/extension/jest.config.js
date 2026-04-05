const preset = require('../../config/jest-presets/jest/jest-preset')

<<<<<<< HEAD
const fileExtensions = [
  'eot',
  'gif',
  'jpeg',
  'jpg',
  'otf',
  'png',
  'ttf',
  'woff',
  'woff2',
  'mp4',
]
=======
const fileExtensions = ['eot', 'gif', 'jpeg', 'jpg', 'otf', 'png', 'ttf', 'woff', 'woff2', 'mp4']
>>>>>>> upstream/main

module.exports = {
  ...preset,
  preset: 'jest-expo',
  transform: {
    '^.+\\.(t|j)sx?$': [
      'babel-jest',
      {
        configFile: './src/test/babel.config.js',
<<<<<<< HEAD
      }
=======
      },
>>>>>>> upstream/main
    ],
  },
  moduleNameMapper: {
    ...preset.moduleNameMapper,
    '^react-native$': 'react-native-web',
  },
<<<<<<< HEAD
  moduleFileExtensions: [
    'web.js',
    'web.jsx',
    'web.ts',
    'web.tsx',
    ...fileExtensions,
    ...preset.moduleFileExtensions,
  ],
  resolver: "<rootDir>/src/test/jest-resolver.js",
  displayName: 'Extension Wallet',
  testMatch: [
    '<rootDir>/src/**/*.(spec|test).[jt]s?(x)',
    '<rootDir>/config/**/*.(spec|test).[jt]s?(x)',
  ],
  testPathIgnorePatterns: [
    ...preset.testPathIgnorePatterns,
    '<rootDir>/e2e/',
  ],
=======
  moduleFileExtensions: ['web.js', 'web.jsx', 'web.ts', 'web.tsx', ...fileExtensions, ...preset.moduleFileExtensions],
  resolver: '<rootDir>/src/test/jest-resolver.js',
  displayName: 'Extension Wallet',
  testMatch: ['<rootDir>/src/**/*.(spec|test).[jt]s?(x)', '<rootDir>/config/**/*.(spec|test).[jt]s?(x)'],
  testPathIgnorePatterns: [...preset.testPathIgnorePatterns, '<rootDir>/e2e/'],
>>>>>>> upstream/main
  collectCoverageFrom: [
    'src/app/**/*.{js,ts,tsx}',
    'src/background/**/*.{js,ts,tsx}',
    'src/contentScript/**/*.{js,ts,tsx}',
    'config/**/*.{js,ts,tsx}',
    '!src/**/*.stories.**',
    '!**/node_modules/**',
  ],
  coverageThreshold: {
    global: {
      lines: 0,
    },
  },
<<<<<<< HEAD
  setupFiles: [
    '../../config/jest-presets/jest/setup.js',
    './jest-setup.js',
  ],
=======
  setupFiles: ['../../config/jest-presets/jest/setup.js', './jest-setup.js'],
>>>>>>> upstream/main
}
