import minimal from '@uniswap/eslint-config/minimal-native'

export default [
  {
    ignores: [
      'node_modules',
      '.turbo',
      'codegen.ts',
      '.nx',
      'vitest-setup.ts',
      'vitest.config.ts',
      'vitest-package-mocks.ts',
      'babel.config.js',
      'jest-package-mocks.js',
      '**/__generated__/**',
      'src/abis/types',
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
