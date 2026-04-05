import minimal from '@uniswap/eslint-config/minimal-native'

export default [
  {
    ignores: [
      'node_modules',
      '.turbo',
      'codegen.ts',
      '.nx',
      '**/__generated__/**',
      'babel.config.js',
      'jest.config.js',
      'jest-setup.js',
      'jest-package-mocks.js',
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
