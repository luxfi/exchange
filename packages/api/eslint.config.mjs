import minimal from '@uniswap/eslint-config/minimal'

export default [
  {
    ignores: ['graphql.config.ts', 'stubs/**', 'vitest.config.ts'],
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
