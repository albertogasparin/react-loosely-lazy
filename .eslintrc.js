module.exports = {
  env: {
    browser: true,
    es6: true,
  },
  extends: [
    'eslint:recommended',
    'plugin:import/recommended',
    'plugin:import/typescript',
    'plugin:react/recommended',
    'plugin:react-hooks/recommended',
    'plugin:prettier/recommended',
  ],
  globals: {
    // Enable webpack require
    require: 'readonly',
    // Fix for eslint-plugin-flowtype/384 not supporting wildcard
    _: 'readonly',
  },
  parser: '@typescript-eslint/parser',
  settings: {
    'import/resolver': {
      typescript: {},
    },
    react: {
      version: 'detect',
    },
  },
  rules: {
    'import/no-extraneous-dependencies': ['error'],
    'no-shadow': ['error'],
    'padding-line-between-statements': [
      'error',
      { blankLine: 'always', prev: '*', next: 'return' },
    ],
    'react/display-name': ['off'],
  },
  overrides: [
    {
      files: ['examples/**'],
      rules: {
        'import/no-extraneous-dependencies': ['off'],
        'import/no-unresolved': ['off'],
      },
    },
    {
      // Enable a node environment for dot, config, and setup files, and any
      // file under the script folder
      env: {
        node: true,
      },
      files: ['.*.js', '*.config.js', '*.setup.js', 'scripts/*'],
    },
    {
      // Enable a jest environment for test files
      env: {
        jest: true,
      },
      extends: ['plugin:jest/recommended', 'plugin:jest/style'],
      files: ['*.test.{js,ts,tsx}'],
      rules: {
        'jest/consistent-test-it': ['error'],
        'jest/expect-expect': ['off'],
      },
    },
    {
      // Flow specific rules
      extends: ['plugin:flowtype/recommended'],
      files: ['*.js.flow', '*.flow.test.js', 'packages/**/*.js'],
      plugins: ['flowtype'],
      rules: {
        'flowtype/generic-spacing': ['off'],
        'import/no-extraneous-dependencies': ['off'],
        'import/no-unresolved': ['off'],
        'no-unused-vars': ['off'],
      },
    },
    {
      // TypeScript specific rules
      extends: ['plugin:@typescript-eslint/recommended'],
      files: ['*.{ts,tsx}'],
      rules: {
        '@typescript-eslint/ban-ts-comment': [
          'error',
          {
            'ts-expect-error': 'allow-with-description',
            'ts-ignore': 'allow-with-description',
          },
        ],
        '@typescript-eslint/explicit-function-return-type': 'off',
        '@typescript-eslint/explicit-module-boundary-types': 'off',
        '@typescript-eslint/no-explicit-any': 'off',
        '@typescript-eslint/no-non-null-assertion': 'off',
        '@typescript-eslint/no-use-before-define': 'off',
      },
    },
    {
      // TypeScript specific rules for type tests
      files: ['*.typescript.test.{ts,tsx}'],
      rules: {
        '@typescript-eslint/no-unused-vars': 'off',
        'import/no-extraneous-dependencies': ['off'],
        'import/no-unresolved': ['off'],
      },
    },
    // apps within test folders
    {
      files: ['**/__tests__/app/**', '**/__tests__/apps/**'],
      rules: {
        'import/no-extraneous-dependencies': ['off'],
      },
    },
    // types folder
    {
      files: ['types/**'],
      rules: {
        'import/no-duplicates': ['off'],
        'import/no-extraneous-dependencies': ['off'],
      },
    },
  ],
};
