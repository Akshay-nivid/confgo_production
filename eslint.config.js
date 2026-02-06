const eslintPluginPrettier = require('eslint-plugin-prettier');
const typescriptEslintParser = require('@typescript-eslint/parser');
const typescriptEslintPlugin = require('@typescript-eslint/eslint-plugin');

module.exports = [
  {
    ignores: ['dist/**/*'], // Ignore the dist directory
  },
  {
    files: ['src/**/*.{ts,js}'], // Lint files in src folder
    languageOptions: {
      parser: typescriptEslintParser,
      ecmaVersion: 2021,
      sourceType: 'module',
      parserOptions: {
        project: './tsconfig.json', // TypeScript config
      },
    },
    plugins: {
      '@typescript-eslint': typescriptEslintPlugin,
      prettier: eslintPluginPrettier,
    },
    rules: {
      'prettier/prettier': 'error',
      '@typescript-eslint/no-unused-vars': 'error',
      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/explicit-module-boundary-types': 'off',
      'no-console': 'warn',
      'no-var': 'error',
      'prefer-const': 'error',
    },
  },
];
