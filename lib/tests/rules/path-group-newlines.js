import { RuleTester } from 'eslint';

import { test } from '../helpers/utils';

import rule from '../../rules/path-group-newlines';

const ruleTester = new RuleTester();

ruleTester.run('order', rule, {
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
        ruleId: 'order',
      }, {
        ruleId: 'order',
      }, {
        ruleId: 'order',
      }, {
        ruleId: 'order',
      }],
    }),
    // builtin before external, not separated
    test({
      code: `
        import async from 'async';
        import fs from 'fs';
      `,
      errors: [{
        ruleId: 'order',
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
        ruleId: 'order',
      }, {
        ruleId: 'order',
      }],
    }),
    // single line comment with un-separated path groups
    test({
      code: `
        import path from 'path'; // comment
        import _ from 'lodash';
      `,
      errors: [{
        ruleId: 'order',
      }],
    }),
    // block comment with un-separated path groups
    test({
      code: `
        import path from 'path'; /* comment */ /* comment */
        import _ from 'lodash';
      `,
      errors: [{
        ruleId: 'order',
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
        ruleId: 'order',
      }],
    }),
  ].filter((t) => !!t),
});
