/**
 * Recommended configuration
 * @type {Object}
 */
module.exports = {
  plugins: ['routable'],
  rules: {
    // analysis/correctness
    'routable/exports-newlines': ['error', { count: 2 }],
  },
  // need all these for parsing dependencies (even if _your_ code doesn't need
  // all of them)
  parserOptions: {
    sourceType: 'module',
    ecmaVersion: 2018,
  },
};
