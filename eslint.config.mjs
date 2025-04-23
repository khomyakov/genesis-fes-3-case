// @ts-check
import js from '@eslint/js';
import tseslint from 'typescript-eslint';
import * as react from 'eslint-plugin-react';
import * as reactHooks from 'eslint-plugin-react-hooks';
import jsxA11y from 'eslint-plugin-jsx-a11y';
import simpleImportSort from 'eslint-plugin-simple-import-sort';
import prettierRecommended from 'eslint-plugin-prettier/recommended';

export default [
  js.configs.recommended,
  ...tseslint.configs.recommendedTypeChecked,
  react.configs.recommended,
  reactHooks.configs.recommended,
  jsxA11y.configs.recommended,
  {                     // import sorting (autofix)
    plugins: { 'simple-import-sort': simpleImportSort },
    rules: {
      'simple-import-sort/imports': 'error',
      'simple-import-sort/exports': 'error',
    },
  },
  prettierRecommended,
  {
    languageOptions: { parserOptions: { project: './tsconfig.json' } },
    rules: {
      'react/function-component-definition': [
        'error',
        { namedComponents: 'arrow-function' },
      ],
      'react/jsx-filename-extension': ['error', { extensions: ['.tsx'] }],
      '@typescript-eslint/consistent-type-imports': 'error',
    },
  },
];
