/**
 * @fileoverview Enforce newlines before exports
 * @author Emily Kolar
 */

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------
const RuleTester = require('eslint').RuleTester;

const parsers = require('../helpers/parsers');
const rule = require('../../rules/exports-newlines');

const ERR_MSG_DEFAULT_EXP = 'Expected 1 empty line before a default export declaration';
const ERR_MSG_DEFAULT_EXP_MULTI = 'Expected 2 empty lines before a default export declaration';
const ERR_MSG_NAMED_EXP = 'Expected 1 empty line before a named export declaration';
const ERR_MSG_NAMED_EXP_MULTI = 'Expected 2 empty lines before a named export declaration';
const ERR_MSG_ALL_EXP = 'Expected 1 empty line before a * export declaration';
const ERR_MSG_ALL_EXP_MULTI = 'Expected 2 empty lines before a * export declaration';

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

const testerOptions = {
  parserOptions: {
    ecmaVersion: 2018,
    sourceType: 'module',
  },
  parser: parsers.BABEL_ESLINT,
};

const ruleTester = new RuleTester(testerOptions);

ruleTester.run('exports-newlines', rule, {
  valid: [
    {
      code: `
        const x = () => true;

        export { x };
      `,
    },
    {
      code: `
        const x = () => true;

        export default x;
      `,
    },
    {
      code: `
        export const x = () => true;
        export default x;
      `,
    },
    {
      code: `
        const x = () => true;

        export { x }; export default x;
      `,
    },
    {
      code: `
        export const x = () => true;
        export default () => false;
      `,
    },
    {
      code: `
        import something from 'external-module';

        export * from 'eslint-plugin-routable';
      `,
    },
    {
      code: `
        import something from 'external-module';

        export * from 'eslint-plugin-routable';
      `,
    },
  ],
  invalid: [{
    code: `
      const x = () => 1;
      export { x };
    `,
    output: `
      const x = () => 1;

      export { x };
    `,
    errors: [{
      line: 2,
      column: 7,
      message: ERR_MSG_NAMED_EXP,
    }],
  }, {
    code: `
      const x = () => 1;
      export default x;
    `,
    output: `
      const x = () => 1;

      export default x;
    `,
    errors: [{
      line: 2,
      column: 7,
      message: ERR_MSG_DEFAULT_EXP,
    }],
  }, {
    code: `
      const x = 1;
      export const y = 2;
    `,
    output: `
      const x = 1;

      export const y = 2;
    `,
    errors: [{
      line: 2,
      column: 7,
      message: ERR_MSG_NAMED_EXP,
    }],
  }, {
    code: `
      const x = 1;
      export default x;
    `,
    output: `
      const x = 1;

      export default x;
    `,
    errors: [{
      line: 2,
      column: 7,
      message: ERR_MSG_DEFAULT_EXP,
    }],
  }, {
    code: `
      const x = 1;
      export * from 'eslint-plugin-routable';
    `,
    output: `
      const x = 1;

      export * from 'eslint-plugin-routable';
    `,
    errors: [{
      line: 2,
      column: 7,
      message: ERR_MSG_ALL_EXP,
    }],
  }, {
    code: `
      const x = 1;
      export default x;
    `,
    output: `
      const x = 1;


      export default x;
    `,
    options: [{
      count: 2,
    }],
    errors: [{
      line: 2,
      column: 7,
      message: ERR_MSG_DEFAULT_EXP_MULTI,
    }],
  }, {
    code: `
      const x = 1;
      export { x };
    `,
    output: `
      const x = 1;


      export { x };
    `,
    options: [{
      count: 2,
    }],
    errors: [{
      line: 2,
      column: 7,
      message: ERR_MSG_NAMED_EXP_MULTI,
    }],
  }, {
    code: `
      const x = 1;
      export * from 'eslint-plugin-routable';
    `,
    output: `
      const x = 1;


      export * from 'eslint-plugin-routable';
    `,
    options: [{
      count: 2,
    }],
    errors: [{
      line: 2,
      column: 7,
      message: ERR_MSG_ALL_EXP_MULTI,
    }],
  }],
});
