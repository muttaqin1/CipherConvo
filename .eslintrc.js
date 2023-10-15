const path = require('path');
const currentPath = path.resolve(__dirname);
module.exports = {
  env: {
    node: true,
    commonjs: true
  },
  extends: [
    'airbnb-base',
    'airbnb-typescript/base',
    'plugin:@typescript-eslint/recommended',
    'plugin:import/typescript',
  ],
  overrides: [],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
    project: path.join(currentPath, 'tsconfig.json')
  },
  plugins: ['prettier', '@typescript-eslint'],
  rules: {
    'class-methods-use-this': 'off',
    'import/prefer-default-export': 'off',
    'max-classes-per-file': 'off',
    '@typescript-eslint/naming-convention': 'off',
    '@typescript-eslint/ban-ts-comment': 'off',
    '@typescript-eslint/no-explicit-any': 'off',
    '@typescript-eslint/explicit-function-return-types': 'off',
    '@typescript-eslint/explicit-module-boundary-types': 'off',
    'linebreak-style':'off',
    '@typescript-eslint/comma-dangle':'off',
    'curly':'off',
    'nonblock-statement-body-position':'off'
    
  }
};
