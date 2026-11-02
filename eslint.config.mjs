// @ts-check

import eslint from '@eslint/js';
import { defineConfig } from 'eslint/config';
import tseslint from 'typescript-eslint';

export default defineConfig(
  {
    ignores: ['**/dist/**', 'dist/', 'site/**', '.squad/**', '**/*.test.ts', '**/*.mock.ts', 'src/utils/validator.ts', 'debug.js'],
  },
  eslint.configs.recommended,
  tseslint.configs.recommended,
  {
    rules: {
      'semi': ['error', 'always'],
      'quotes': ['error', 'single'],
      'indent': ['error', 2],
      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/explicit-function-return-type': 'off',
      '@typescript-eslint/no-unused-vars': ['error', { 'argsIgnorePattern': '^_' }],
      'object-curly-spacing': ['error', 'always'],
      'object-curly-newline': ['error', {
        'ObjectExpression': {
          'multiline': true,
          'minProperties': 3,
          'consistent': true
        },
        'ObjectPattern': { 'multiline': true, 'minProperties': 3 },
        'ImportDeclaration': {
          'multiline': true,
          'minProperties': 3
        },
        'ExportDeclaration': {
          'multiline': true,
          'minProperties': 3
        }
      }]
    }
  },
  // Node.js scripts
  {
    files: ['*.mjs', '*.cjs', 'scripts/**/*.mjs'],
    languageOptions: {
      globals: {
        process: 'readonly',
        console: 'readonly',
      },
    },
  },
  // Add override for test files
  {
    files: ['**/tests/**'],
    languageOptions: {
      globals: {
        describe: 'readonly',
        it: 'readonly',
        test: 'readonly',
        expect: 'readonly',
        beforeEach: 'readonly',
        afterEach: 'readonly',
        beforeAll: 'readonly',
        afterAll: 'readonly',
        vi: 'readonly',
      },
    },
    rules: {
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-non-null-assertion': 'off',
      '@typescript-eslint/no-unused-vars': 'off'
    }
  }
);