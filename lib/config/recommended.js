/**
 * Recommended configuration
 * @type {Object}
 */
module.exports = {
  plugins: ['routable'],
  rules: {
    'routable/default-props-prefer-undefined': ['warn', { forbidFalse: true }],
    'routable/exports-newlines': ['error', { count: 2 }],
    'routable/import-groups': ['error', { srcDirectory: 'src' }],
  },
  // need all these for parsing dependencies (even if _your_ code doesn't need
  // all of them)
  parserOptions: {
    sourceType: 'module',
    ecmaVersion: 2018,
  },
};
