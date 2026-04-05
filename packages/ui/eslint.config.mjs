import minimal from '@uniswap/eslint-config/minimal'

export default [
  {
    ignores: [
      'node_modules',
      '.turbo',
      'dist',
      'types',
      '**/*.test.tsx',
      'jest.config.js',
      'babel.config.js',
      '.nx',
      'vitest-setup.ts',
      'vitest.config.ts',
      'src/components/logos/**',
      'src/components/icons/**',
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
