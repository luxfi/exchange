import minimal from '@uniswap/eslint-config/minimal'

export default [
  {
    ignores: ['env.d.ts', 'vitest.config.ts', 'vitest.integration.config.ts'],
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
