import minimal from '@uniswap/eslint-config/minimal-native'

export default [
  {
    ignores: [
      '.storybook/storybook.requires.ts',
      'app.config.ts',
      'babel.config.js',
      'fingerprint.config.js',
      'index.js',
      'jest.config.js',
      'metro.config.js',
      'react-native.config.js',
      'ReactotronConfig.ts',
      'wdyr.ts',
      'node_modules',
      'storybook-static',
      'coverage',
      '.maestro/**',
      '.storybook/**',
    ],
  },
  ...minimal,
  {
    languageOptions: {
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
  },
]
