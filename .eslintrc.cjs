module.exports = {
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: './tsconfig.json',
    tsconfigRootDir: __dirname,
  },
  plugins: [
    '@typescript-eslint',
    'import',
  ],
  extends: [
    'airbnb-typescript/base',
  ],
  env: {
    browser: true,
    es2021: true,
  },
  ignorePatterns: ['*.spec.ts', '*.test.ts', 'test'],
  settings: {
    'import/resolver': {
      typescript: {
        alwaysTryTypes: true,
      },
    },
  },
  rules: {
    '@typescript-eslint/no-unused-vars': [
      'error',
      {
        'argsIgnorePattern': '^_',
      },
    ],
    'import/extensions': [
      'error',
      'ignorePackages',
      {
        'ts': 'never',
      }
    ],
    'import/prefer-default-export': 'off',
    'no-console': 'off',
    'no-param-reassign': ['error', {props: false}],
  },
};
