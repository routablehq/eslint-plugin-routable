import path from 'path';

import { RuleTester } from 'eslint';

import { test } from '../helpers/utils';

import rule from '../../rules/import-groups';

const ruleTester = new RuleTester();

const CHILD_SIBLINGS_RELATIVE_ERROR = 'Expected sibling and child imports to be relative';
const CSS_ORDER_ERROR = 'Expected css to be imported last';
const GROUP_NEWLINE_ERROR = 'Expected 1 empty line before import declaration group';

ruleTester.run('import-groups', rule, {
  valid: [
    // default order
    test({
      code: `
        import fs from 'fs';

        import async, {foo1} from 'async';

        import relParent1 from '../actions';
        import relParent2, {foo2} from '../actions/bar';

        import relParent3 from '../helpers/bar';

        import sibling, {foo3} from './foo';`,
    }),
    // multiple modules of the same rank next to each other
    test({
      code: `
        import fs from 'fs';
        import path from 'path';

        import async from 'async';
        import _ from 'lodash';`,
    }),
    // ignoring unassigned values by default (these are imported for side-effects)
    test({
      code: `
        import './foo';
        import 'fs';
        import path from 'path';
    `,
    }),
    // no imports
    test({
      code: `
        function add(a, b) {
          return a + b;
        }
        var foo;
    `,
    }),
    // adding unknown import types (using a resolver alias, etc)
    test({
      code: `
        import fs from 'fs';

        import { Button } from '-/components/Button';
        import { Input } from '-/components/Input';

        import { add } from './helper';
      `,
    }),
    // comments can coexist on the newlines between groups
    test({
      code: `
        import path from 'path'; /* 1
        2 */
        import _ from 'lodash';
      `,
    }),
    // webpack resolver, workspace folder name in external-module-folders
    test({
      code: `
        import _ from 'lodash';

        import m from '@test-scope/some-module';

        import bar from './bar';
      `,
      settings: {
        'import/resolver': 'webpack',
        'import/external-module-folders': ['node_modules', 'symlinked-module'],
      },
    }),
    // node resolver, workspace folder name in external-module-folders (doesn't resolve symlinks)
    test({
      code: `
        import _ from 'lodash';

        import m from '@test-scope/some-module';

        import bar from './bar';
      `,
      settings: {
        'import/resolver': 'node',
        'import/external-module-folders': ['node_modules', 'files/symlinked-module'],
      },
    }),
    // with multiline imports #1
    test({
      code: `
        import path from 'path';

        import {
            I,
            Want,
            Couple,
            Imports,
            Here
        } from 'bar';

        import external from 'external'
      `,
    }),
    // with multiline imports #2
    test({
      code: `
        import foo
          from '../../../../this/will/be/very/long/path/and/therefore/this/import/has/to/be/in/two/lines';

        import bar
          from './sibling';
      `,
    }),
    // multi-level difference but path starts similarly
    test({
      code: `
        import util from '../util';

        import helper from '../../../util';
      `,
    }),
    // does not report multiple css exports when last
    test({
      code: `
        import path from 'path';

        import util from '../util';

        import helper from '../../../util';
        
        import './Coolness.css';
        import './Other.css';
      `,
    }),
    // does not report child imports if relative
    test({
      code: `
        import { child } from './components';
      `,
    }),
  ],
  invalid: [
    // not separated
    test({
      code: `
        import fs from 'fs';
        import async, {foo1} from 'async';
        import relParent1 from '../actions';
        import relParent2, {foo2} from '../actions/bar';
        import relParent3 from '../helpers/bar';
        import sibling, {foo3} from './foo';
      `,
      errors: [{
        line: 1,
        column: 1,
        message: GROUP_NEWLINE_ERROR,
      }, {
        line: 2,
        column: 1,
        message: GROUP_NEWLINE_ERROR,
      }, {
        line: 4,
        column: 1,
        message: GROUP_NEWLINE_ERROR,
      }, {
        line: 5,
        column: 1,
        message: GROUP_NEWLINE_ERROR,
      }],
    }),
    // using import with custom import alias, not separated
    test({
      code: `
        import fs from 'fs';
        import { Button } from '-/components/Button';
        import { add } from './helper';
      `,
      errors: [{
        line: 1,
        column: 1,
        message: GROUP_NEWLINE_ERROR,
      }, {
        line: 2,
        column: 1,
        message: GROUP_NEWLINE_ERROR,
      }],
    }),
    // single line comment with un-separated path groups
    test({
      code: `
        import path from 'path'; // comment
        import _ from 'lodash';
      `,
      errors: [{
        line: 1,
        column: 1,
        message: GROUP_NEWLINE_ERROR,
      }],
    }),
    // block comment with un-separated path groups
    test({
      code: `
        import path from 'path'; /* comment */ /* comment */
        import _ from 'lodash';
      `,
      errors: [{
        line: 1,
        column: 1,
        message: GROUP_NEWLINE_ERROR,
      }],
    }),
    // .css files forced last
    test({
      code: `
        import path from 'path';

        import './Coolness.css';

        import util from '../util';

        import helper from '../../../util';
      `,
      errors: [{
        line: 3,
        column: 1,
        message: CSS_ORDER_ERROR,
      }],
    }),
    // reports child imports if absolute
    // mocked file path is tests/files/foo.js
    test({
      code: `
        import { child } from 'tests/files/components';
      `,
      errors: [{
        line: 1,
        column: 1,
        message: CHILD_SIBLINGS_RELATIVE_ERROR,
      }],
    }),
    // reports child imports if absolute, when srcDirectory given
    // mocked file path is src/tests/files/foo.js
    test({
      code: `
        import { child } from 'tests/files/components';
      `,
      errors: [{
        line: 1,
        column: 1,
        message: CHILD_SIBLINGS_RELATIVE_ERROR,
      }],
      filename: path.resolve(process.cwd(), './src/tests/files/foo.js'),
      options: [{
        srcDirectory: 'src',
      }],
    }),
  ].filter((t) => !!t),
});
