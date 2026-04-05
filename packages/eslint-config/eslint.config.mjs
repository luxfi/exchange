import tseslint from 'typescript-eslint'

export default [
  {
    ignores: ['node_modules', '.nx', 'plugins/', 'utils/'],
  },
  {
    files: ['**/*.ts', '**/*.tsx'],
    plugins: {
      '@typescript-eslint': tseslint.plugin,
    },
    languageOptions: {
      parser: tseslint.parser,
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
    rules: {
      'object-shorthand': ['error', 'always'],
    },
  },
]
