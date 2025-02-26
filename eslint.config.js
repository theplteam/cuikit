import js from '@eslint/js'
import globals from 'globals'
import react from 'eslint-plugin-react'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import tseslint from 'typescript-eslint'

export default tseslint.config(
  {
    ignores: [
      '**/dist/',
      'docs'
    ]
  },
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
      'react-refresh': reactRefresh
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
      "@typescript-eslint/no-unused-vars": [
        "error",
        {
          ignoreRestSiblings: true,
          argsIgnorePattern: '^_'
        }
      ],
      "react/jsx-max-depth": ["error", { "max": 6 }],
      "react/jsx-curly-brace-presence": ["error", { "props": "never", "children": "always", "propElementValues": "always" }],
      "react/jsx-sort-props": ["error", { "ignoreCase": true, "callbacksLast": true, "shorthandFirst": true, "noSortAlphabetically": true, "reservedFirst": true }],


      // OFF
      "react-refresh/only-export-components": "off",
      "react/jsx-filename-extension": "off",
      "@typescript-eslint/no-explicit-any": "off",
      "react/jsx-newline": "off",
      "react/jsx-no-bind": "off",
      // In tests, we declare multiple components in a single file for docs
      "react/no-multi-comp": "off",
      "react/prefer-read-only-props": "off",
      "react/destructuring-assignment": "off",
      "react/require-default-props": "off",
      "react-hooks/exhaustive-deps": "off",
      "react/jsx-props-no-spreading": "off",
      "react/forbid-component-props": "off",
      "react/prop-types": "off",
      "@typescript-eslint/ban-ts-comment": "off",
      "react/no-array-index-key": "off",
      "no-async-promise-executor": "off",
      "react/display-name": "off",
      "react/react-in-jsx-scope": "off",
      // TODO: Maybe we should turn it on
      "react/jsx-handler-names": "off"


      // RULES END
    }
  },
);
