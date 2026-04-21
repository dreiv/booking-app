import js from '@eslint/js'
import pluginVitest from '@vitest/eslint-plugin'
import oxlint from 'eslint-plugin-oxlint'
import playwright from 'eslint-plugin-playwright'
import reactCompiler from 'eslint-plugin-react-compiler'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import storybook from 'eslint-plugin-storybook'
import testingLibrary from 'eslint-plugin-testing-library'
import globals from 'globals'
import tseslint from 'typescript-eslint'

export default tseslint.config(
  {
    ignores: [
      'dist/**',
      'coverage/**',
      'storybook-static/**',
      'node_modules/**',
      'e2e/**',
      'playwright-report/**',
    ],
  },

  js.configs.recommended,
  ...tseslint.configs.recommended,

  {
    files: ['**/*.{ts,tsx}'],
    plugins: {
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
      'react-compiler': reactCompiler,
    },
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: {
        ...globals.browser,
      },
    },
    rules: {
      ...reactHooks.configs.recommended.rules,
      'react-refresh/only-export-components': ['warn', { allowConstantExport: true }],
      'react-compiler/react-compiler': 'error',
    },
  },

  {
    files: ['**/*.test.{ts,tsx}', '**/*.spec.ts'],
    plugins: {
      'testing-library': testingLibrary,
      vitest: pluginVitest,
    },
    rules: {
      ...testingLibrary.configs.dom.rules,
      ...pluginVitest.configs.recommended.rules,
      'vitest/no-disabled-tests': 'warn',
    },
  },

  {
    ...playwright.configs['flat/recommended'],
    files: ['e2e/**/*.{ts,tsx}'],
    rules: {
      ...playwright.configs['flat/recommended'].rules,
      'playwright/no-skipped-test': 'warn',
    },
  },

  ...storybook.configs['flat/recommended'],

  ...oxlint.configs['flat/recommended'], // Oxlint - ALWAYS LAST
)
