import js from '@eslint/js'
import globals from 'globals'
import react from 'eslint-plugin-react'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import tseslint from 'typescript-eslint'

export default tseslint.config(
  { ignores: ['dist'] },
  {
    extends: [
      js.configs.recommended,
      ...tseslint.configs.recommended
    ],
    files: ['**/*.{ts,tsx}'],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
    },
    plugins: {
      'react': react,
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
    },
    rules: {
      ...react.configs.all.rules,
      ...reactHooks.configs.recommended.rules,
      'react-refresh/only-export-components': [
        'warn',
        { allowConstantExport: true },
      ],
      "no-multiple-empty-lines": ["error", { "max": 1 }],
      "react/jsx-max-props-per-line": ["error", { "maximum": 3 }],
      "react/jsx-indent-props": ["error", 2],
      "react/jsx-indent": ["error", 2],
      "react/function-component-definition": [
        2,
        {
          "namedComponents": "arrow-function",
          "unnamedComponents": "arrow-function"
        }
      ],
      "react/jsx-filename-extension": "off"
    },
    "@typescript-eslint/no-unused-vars": [
      "error",
      {
        ignoreRestSiblings: true,
        argsIgnorePattern: '^_'
      }
    ]
  },
);
