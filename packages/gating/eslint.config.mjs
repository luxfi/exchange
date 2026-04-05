import minimal from '@uniswap/eslint-config/minimal'

export default [
  {
    ignores: ['node_modules', '.nx', 'vitest.config.ts'],
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
