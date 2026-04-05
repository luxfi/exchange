import minimal from '@uniswap/eslint-config/minimal'

export default [
  {
    ignores: [
      'node_modules',
      '.turbo',
      '.nx',
      'vitest-setup.ts',
      'vitest.config.ts',
      'vitest-package-mocks.js',
      'jest-package-mocks.js',
      'codegen.ts',
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
