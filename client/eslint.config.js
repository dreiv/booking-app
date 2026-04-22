import js from '@eslint/js'
import pluginVitest from '@vitest/eslint-plugin'
import oxlint from 'eslint-plugin-oxlint'
import reactCompiler from 'eslint-plugin-react-compiler'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import testingLibrary from 'eslint-plugin-testing-library'
import globals from 'globals'
import tseslint from 'typescript-eslint'

export default tseslint.config(
  {
    ignores: ['dist/**', 'coverage/**', 'node_modules/**', 'e2e/**', 'playwright-report/**'],
  },
  {
    files: ['**/*.{ts,tsx}'],
    languageOptions: {
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
      },
      globals: { ...globals.browser, ...globals.node },
    },
  },
  js.configs.recommended,
  ...tseslint.configs.recommended,

  {
    files: ['src/**/*.{ts,tsx}'],
    plugins: {
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
      'react-compiler': reactCompiler,
    },
    rules: {
      ...reactHooks.configs.recommended.rules,
      'react-refresh/only-export-components': ['warn', { allowConstantExport: true }],
      'react-compiler/react-compiler': 'error',
    },
  },

  {
    files: ['**/*.{test,spec}.{ts,tsx}'],
    plugins: {
      'testing-library': testingLibrary,
      vitest: pluginVitest,
    },
    languageOptions: {
      globals: { ...pluginVitest.environments.env.globals },
    },
    rules: {
      ...testingLibrary.configs.dom.rules,
      ...pluginVitest.configs.recommended.rules,
      '@typescript-eslint/no-explicit-any': 'off',
    },
  },

  ...oxlint.configs['flat/recommended'], // Oxlint - ALWAYS LAST
)
