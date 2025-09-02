// eslint.config.js
import eslintConfigPrettier from 'eslint-config-prettier'

import { defineConfig } from 'eslint/config'

export default defineConfig([
  eslintConfigPrettier,
  {
    ignores: ['dist/**', 'frontend/**'],
    rules: {
      indent: ['error', 2],
      'linebreak-style': ['error', 'unix'],
      quotes: ['error', 'single'],
      semi: ['error', 'never'],
      eqeqeq: 'error',
      'no-trailing-spaces': 'error',
      'object-curly-spacing': ['error', 'always'],
      'arrow-spacing': ['error', { before: true, after: true }],
      'no-console': 0,
      'no-unused-vars': 0,
    },
  },
])
