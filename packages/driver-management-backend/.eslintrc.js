'use strict';

module.exports = {
  ecmaFeatures: {
    modules: true,
    spread: true,
    restParams: true,
  },
  env: {
    browser: true,
    node: true,
    es6: true,
  },
  rules: {
    'no-unused-vars': 1,
    'no-undef': 2,
    'no-await-in-loop': 1,
  },
  parserOptions: {
    sourceType: 'module',
    ecmaVersion: 2020,
  },
};
