/**
 * Minimal native-specific ESLint rules.
 * Extends minimal.mjs and adds:
 * - i18n (type-aware custom rule — needs TS type checker)
 * - naming-convention (no oxlint equivalent)
 *
 * no-nested-component-definitions and jsx-prop-order have been
 * migrated to the oxlint JS plugin (universe-custom.js).
 */
import minimal from './minimal.mjs'
import i18n from './plugins/i18n.js'

/** @type {import('eslint').Linter.Config[]} */
export default [
  ...minimal,
  {
    files: ['**/*.ts', '**/*.tsx'],
    plugins: {
      'local-native': {
        rules: {
          i18n,
        },
      },
    },
    rules: {
      'local-native/i18n': 'error',
      '@typescript-eslint/naming-convention': [
        2,
        {
          selector: 'enumMember',
          format: ['PascalCase'],
        },
      ],
    },
  },
]
