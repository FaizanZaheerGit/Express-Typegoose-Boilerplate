module.exports = {
    root: true,
    parser: '@typescript-eslint/parser',
    parserOptions: {
      ecmaVersion: 2020,
      sourceType: 'module',
      project: ['./tsconfig.json'],
    },
    plugins: ['@typescript-eslint', 'prettier'],
    extends: [
      'eslint:recommended',
      'plugin:@typescript-eslint/recommended',
      'plugin:prettier/recommended',
    ],
    rules: {
      'prettier/prettier': 'error',
      '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
      '@typescript-eslint/no-explicit-any': 'off',
    },
    ignorePatterns: [
      'dist/',
      'node_modules/',
      'dist/',
      'build/',
      'coverage/',
      '*.txt',
      '*.log',
      '.env',
      '.gitignore',
      'package-lock.json',
      'yarn.lock',
      'pnpm-lock.yaml',
      'Dockerfile'
    ],
  };
