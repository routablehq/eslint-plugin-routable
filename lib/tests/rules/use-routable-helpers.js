'use strict';

const RuleTester = require('eslint').RuleTester;
const parsers = require('../helpers/parsers');

const rule = require('../../rules/use-routable-helpers');

const ERROR_MESSAGES = {
  ALL_VALUES: 'use "allValues(object)" instead of "object.values"'
};

const testerOptions = {
  parserOptions: {
    ecmaVersion: 2018,
    sourceType: 'module',
  },
  parser: parsers.BABEL_ESLINT,
};

const ruleTester = new RuleTester(testerOptions);

ruleTester.run('use-routable-helpers', rule, {
  valid: [
    {
      code: `const testObj = { hello: 'world' };
console.log(allValues(testObj));
`,
    }
  ],
  invalid: [
    {
      code: `const testObj = { hello: 'world' };
console.log(testObj.values());`,
      output: `const testObj = { hello: 'world' };
console.log(allValues(testObj));`,
      errors: [{
        line: 2,
        column: 13,
        message: ERROR_MESSAGES.ALL_VALUES
      }]
    }
  ]
});
