// @ts-check
import js from '@eslint/js';
import tseslint from 'typescript-eslint';
import * as react from 'eslint-plugin-react';
import * as reactHooks from 'eslint-plugin-react-hooks';
import jsxA11y from 'eslint-plugin-jsx-a11y';
import simpleImportSort from 'eslint-plugin-simple-import-sort';
import prettierRecommended from 'eslint-plugin-prettier/recommended';

export default [
  // 1️⃣ Base JavaScript + TypeScript rules (with type-aware linting)
  js.configs.recommended,
  ...tseslint.configs.recommendedTypeChecked,

  // 2️⃣ React ecosystem
  react.configs.recommended,
  reactHooks.configs.recommended,          // enforces Rules-of-Hooks
  jsxA11y.configs.recommended,             // accessibility linting

  // 3️⃣ Stylistic / ordering extras
  {
    plugins: { 'simple-import-sort': simpleImportSort },
    rules: {
      // autofixable import grouping → feels very "Airbnb"
      'simple-import-sort/imports': 'error',
      'simple-import-sort/exports': 'error',
    },
  },

  // 4️⃣ Prettier as *the* formatter (last, so it wins)
  prettierRecommended,

  // 5️⃣ Project-specific overrides (mimic a slice of Airbnb-TS)
  {
    languageOptions: {
      parserOptions: {
        project: './tsconfig.json',        // enables strict type-aware rules
      },
    },
    rules: {
      // Prefer arrow FCs, .tsx filenames, etc.
      'react/function-component-definition': [
        'error',
        { namedComponents: 'arrow-function' },
      ],
      'react/jsx-filename-extension': ['error', { extensions: ['.tsx'] }],
      // TypeScript niceties
      '@typescript-eslint/consistent-type-imports': 'error',
      // Example of a Prettier-safe stylistic rule
      'object-shorthand': ['error', 'always'],
    },
  },
];
