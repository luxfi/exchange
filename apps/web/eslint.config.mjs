import path from 'node:path'
import { includeIgnoreFile } from '@eslint/compat'
import minimal from '@uniswap/eslint-config/minimal'

export default [
  includeIgnoreFile(path.resolve(import.meta.dirname, '.gitignore')),
  {
    ignores: [
      'scripts/build-vercel.ts',
      'babel.config.js',
      'metro.config.js',
      'vitest.config.ts',
      'playwright.config.ts',
      'vite.config.ts',
      'node_modules',
      '.storybook/stories',
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
