/**
 * @fileoverview Enforce newlines before exports
 * @author Emily Kolar
 */
'use strict';

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------
var RuleTester = require('eslint').RuleTester;
var rule = require('../../rules/exports-newlines');

const ERR_MSG_LINES_BEFORE_EXP = 'Expected 1 empty line before export declaration not preceded by another export declaration.';

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

var ruleTester = new RuleTester();
ruleTester.run('exports-newlines', rule, {
  valid: [
    {
      code: `const x = () => true;\n\n\nexport { x };`,
      parserOptions: { ecmaVersion: 2015, sourceType: 'module' },
    },
    {
      code: `const x = () => true;\n\n\nexport default x;`,
      parserOptions: { ecmaVersion: 2015, sourceType: 'module' },
    },
    {
      code: `export const x = () => true;\nexport default x;`,
      parserOptions: { ecmaVersion: 2015, sourceType: 'module' },
    },
    {
      code: `const x = () => true;\n\n\nexport { x }; export default x;`,
      parserOptions: { ecmaVersion: 2015, sourceType: 'module' },
    },
    {
      code: `export const x = () => true;\nexport default () => false;`,
      parserOptions: { ecmaVersion: 2015, sourceType: 'module' },
    },
  ],
  invalid: [{
    code: 'const x = () => 1;\nexport { x };',
    output: `const x = () => 1;\n\nexport { x };`,
    errors: [ {
      line: 1,
      column: 1,
      message: ERR_MSG_LINES_BEFORE_EXP,
    } ],
    parserOptions: { ecmaVersion: 2015, sourceType: 'module' },
  }, {
    code: 'const x = () => 1;\nexport default x;',
    output: `const x = () => 1;\n\nexport default x;`,
    errors: [ {
      line: 1,
      column: 1,
      message: ERR_MSG_LINES_BEFORE_EXP,
    }],
    parserOptions: { ecmaVersion: 2015, sourceType: 'module' },
  }, {
    code: 'const x = 1;\nexport const y = 2;',
    output: 'const x = 1;\n\nexport const y = 2;',
    errors: [ {
      line: 1,
      column: 1,
      message: ERR_MSG_LINES_BEFORE_EXP,
    }],
    parserOptions: { ecmaVersion: 2015, sourceType: 'module' },
  }, {
    code: 'const x = 1;\nexport default x;',
    output: 'const x = 1;\n\nexport default x;',
    errors: [ {
      line: 1,
      column: 1,
      message: ERR_MSG_LINES_BEFORE_EXP,
    }],
    parserOptions: { ecmaVersion: 2015, sourceType: 'module' },
  }],
});
