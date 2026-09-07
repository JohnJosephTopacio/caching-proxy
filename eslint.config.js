import eslint from '@eslint/js';
import { defineConfig, globalIgnores } from 'eslint/config';
import eslintConfigPrettier from 'eslint-config-prettier';
import globals from 'globals';
import tseslint from 'typescript-eslint';

export default defineConfig(
  globalIgnores(['dist/**']),

  {
    files: ['src/**/*.ts'],

    extends: [eslint.configs.recommended, tseslint.configs.recommended],

    languageOptions: {
      globals: globals.node,
    },

    rules: {
      'no-console': 'off',
      '@typescript-eslint/no-unused-vars': [
        'error',
        {
          argsIgnorePattern: '^_',
        },
      ],
    },
  },

  eslintConfigPrettier,
);
