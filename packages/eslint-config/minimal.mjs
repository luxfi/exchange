/**
 * Minimal ESLint config — only rules that oxlint cannot cover.
 *
 * oxlint handles ~90% of linting. This config covers:
 * 1. One type-aware custom rule (oxlint JS plugins can't access TS types)
 * 2. One rule with no oxlint equivalent
 * 3. One restricted import with allowTypeImports (oxlint lacks this param)
 *
 * Security plugins (eslint-plugin-security, eslint-plugin-no-unsanitized)
 * have been migrated to oxlint JS plugins — see .oxlintrc.json.
 */
import tseslint from 'typescript-eslint'
import preventThisMethodDestructure from './plugins/prevent-this-method-destructure.js'

/** @type {import('eslint').Linter.Config[]} */
export default [
  {
    // Replicate the old .eslintignore patterns, plus common generated dirs.
    // These were previously in the root .eslintignore which ESLint 10 no longer supports.
    ignores: [
      '**/*.test.{ts,tsx,js,jsx}',
      '**/*.spec.{ts,tsx,js,jsx}',
      '**/dist/**',
      '**/build/**',
      '**/node_modules/**',
      '**/types/**',
      '**/__generated__/**',
      '**/.tamagui/**',
      '**/.nx/**',
      '**/.turbo/**',
      '**/coverage/**',
    ],
  },
  {
    files: ['**/*.ts', '**/*.tsx'],
    plugins: {
      '@typescript-eslint': tseslint.plugin,
      local: {
        rules: {
          'prevent-this-method-destructure': preventThisMethodDestructure,
        },
      },
    },
    languageOptions: {
      parser: tseslint.parser,
      parserOptions: {
        projectService: true,
        ecmaFeatures: { jsx: true },
      },
    },
    rules: {
      // ── Type-aware custom rule (needs TS type checker) ─────────────────
      'local/prevent-this-method-destructure': 'error',

      // ── No oxlint equivalent ───────────────────────────────────────────
      'object-shorthand': ['error', 'always'],

      // ── allowTypeImports (oxlint lacks this param) ─────────────────────
      '@typescript-eslint/no-restricted-imports': [
        'error',
        {
          paths: [
            {
              name: '@uniswap/smart-order-router',
              message: 'Only import types, unless you are in the client-side SOR, to preserve lazy-loading.',
              allowTypeImports: true,
            },
          ],
        },
      ],
    },
  },
]
