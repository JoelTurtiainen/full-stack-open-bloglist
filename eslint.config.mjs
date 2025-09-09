import js from '@eslint/js'

import globals from 'globals'
import react from 'eslint-plugin-react'
import eslintConfigPrettier from 'eslint-config-prettier'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import { defineConfig } from 'eslint/config'
export default defineConfig([
  eslintConfigPrettier,
  {
    ignores: ['front/dist/**'],
    files: ['**/*.{js,mjs,cjs,jsx}'],
    plugins: { js, react },
    extends: ['js/recommended'],
    languageOptions: { globals: { ...globals.browser, ...globals.node, ...globals.vitest } },
  },
  { files: ['**/*.js'], languageOptions: { sourceType: 'commonjs' } },
  react.configs.flat.recommended,
  react.configs.flat['jsx-runtime'],
  reactHooks.configs['recommended-latest'],
  reactRefresh.configs.recommended,
])
