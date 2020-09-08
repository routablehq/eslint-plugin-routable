# Enforce rules related to import path groups (import-groups)

In our JavaScript files, we prefer to:

* Separate import blocks of different path groups (e.g. `modules/*` or `helpers/*`) by an empty newline
* Use relative paths for sibling and child imports
* Order CSS imports last, after all other imports

## Rule Details

Enforces an empty newline between path groups, ensures relative paths are used for sibling and child imports, and ensures CSS imports are ordered last.

Examples of **incorrect** code for this rule:

```js
import { maskCardNumber } from 'helpers/funding';
import { CreditCardComponent } from 'modules/funding/components';
```

```js
import { ComponentThatIsAChildOfThisOne } from 'modules/funding/components/ThisComponent/components';
```

```js
import './ThisComponent.css';
import { maskCardNumber } from 'helpers/funding';
```

Examples of **correct** code for this rule:

```js
import { maskCardNumber } from 'helpers/funding';

import { CreditCardComponent } from 'modules/funding/components';
```

```js
import { ComponentThatIsAChildOfThisOne } from './components';
```

```js
import { maskCardNumber } from 'helpers/funding';

import './ThisComponent.css';
```

### Options

`srcDirectory` - The path to your code's source directory. A string that will be parsed as relative to the project's top-level directory.

`groups` - See [documentation](https://github.com/benmosher/eslint-plugin-import/blob/master/docs/rules/order.md#groups-array) for `eslint-plugin-import/order` `groups`

`pathGroups` - See [documentation](https://github.com/benmosher/eslint-plugin-import/blob/master/docs/rules/order.md#pathgroups-array-of-objects) for `eslint-plugin-import/order` `pathGroups`

`pathGroupsExcludedImportTypes` - See [documentation](https://github.com/benmosher/eslint-plugin-import/blob/master/docs/rules/order.md#pathgroupsexcludedimporttypes-array) for `eslint-plugin-import/order` `pathGroupsExcludedImportTypes`

Example config:

```json
{
  "routable/exports-newlines": ["error", {
    "groups": ["builtin", "external", "internal", "parent", "sibling", "index", "unknown"],
    "pathGroups": [
      {
        "pattern": "{actions,constants,helpers,modules,sagas}*(/**)",
        "group": "internal"
      }
    ],
    "pathGroupsExcludedImportTypes": ["builtin", "external", "parent", "sibling", "index", "unknown"],
    "srcDirectory": "src"
  }]
}
```

## When Not To Use It

When you don't want to enforce this specific combination of circumstances in your codestyle.
