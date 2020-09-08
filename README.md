# eslint-plugin-routable

Internal ESLint plugin for Routable

## Installation

You'll first need to install [ESLint](http://eslint.org):

```
$ npm i -D eslint
```

Next, install `eslint-plugin-routable`:

```
$ npm i -D eslint-plugin-routable
```

**Note:** If you installed ESLint globally (using the `-g` flag) then you must also install `eslint-plugin-routable` globally.

## Usage

Add `routable` to the plugins section of your `.eslintrc` configuration file. You can omit the `eslint-plugin-` prefix:

```json
{
    "plugins": [
        "routable"
    ]
}
```

Then configure the rules you want to use under the rules section.

```json
{
    "rules": {
        "routable/rule-name": 2
    }
}
```

## Supported Rules

* Prefer `undefined` default props over other empty values, e.g. `null`, `false`, `""`, etc. ([`default-props-prefer-undefined`])
* Enforce a number of newlines before file exports. ([`exports-newlines`])
* Enforce separation between import path groups, relative imports for parents/children in the same module, and CSS imports
after all other imports. ([`import-groups`])

[`default-props-prefer-undefined`]: ./lib/docs/rules/exports-newlines.md
[`exports-newlines`]: ./lib/docs/rules/exports-newlines.md
[`import-groups`]: ./lib/docs/rules/exports-newlines.md
